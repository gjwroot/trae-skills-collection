// 接口统一管理
const api = {
  // 用户模块
  user: {
    login: '/user/login',
    sendCode: '/user/sendCode',
    wechatLogin: '/user/wechatLogin',
    phoneLogin: '/user/phoneLogin',
    info: '/user/info',
    update: '/user/update'
  },
  // 商品模块
  goods: {
    list: '/goods/list',
    detail: '/goods/detail',
    search: '/goods/search'
  },
  // 订单模块
  order: {
    create: '/order/create',
    list: '/order/list',
    detail: '/order/detail',
    pay: '/order/pay'
  }
}

module.exports = api