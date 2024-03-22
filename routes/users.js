const router = require('koa-router')()
const jwt = require('jsonwebtoken')
const util = require('util')
const verify = util.promisify(jwt.verify)
const { SECRET } = require('./conf/constant')

router.prefix('/users')

router.get('/', function (ctx, next) {
  ctx.body = 'this is a users response!'
})

router.get('/bar', function (ctx, next) {
  ctx.body = 'this is a users/bar response'
})

// 模拟登陆
router.get('/login', async (ctx, next) => {
  const { userName, password } = ctx.request.body;
  let userInfo;
  
  if (userName === 'zhangsan' && password === '123') {
    userInfo = {
      userId: 1,
      userName: 'zhangsan',
      nickName: 'san',
      gender: 1
    }
  }
  // 加密 userInfo
  let token;
  if (userInfo) {
    token = jwt.sign(userInfo, SECRET, {
      expiresIn: 'In'
    })
  }
  if (userInfo == null) {
    ctx.body = {
      errno: -1,
      msg: 'login error'
    }
  }
  ctx.body = {
    errno: 0,
    data: userInfo
  }
})

// 获取用户信息
router.get('/getUserInfo', async (ctx, next) => {
  const token = ctx.header.authorization;
  try {
    const payload = await verify(token.split(' ')[1], SECRET)
    ctx.body = {
      errno: 0,
      userInfo: payload
    }
  } catch(e) {
    ctx.body = {
      errno: -1,
      msg: 'verify token failed'
    }
  }
  
})
module.exports = router
