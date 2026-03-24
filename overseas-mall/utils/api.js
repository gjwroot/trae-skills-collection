module.exports = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    refreshToken: '/auth/refresh',
    sendCode: '/auth/send-code',
    verifyCode: '/auth/verify-code',
    resetPassword: '/auth/reset-password'
  },

  user: {
    info: '/user/info',
    profile: '/user/profile',
    updateProfile: '/user/update-profile',
    update: '/user/update'
  },

  address: {
    list: '/address/list',
    add: '/address/add',
    update: '/address/update',
    delete: '/address/delete',
    detail: '/address/detail',
    setDefault: '/address/set-default'
  },

  goods: {
    list: '/goods/list',
    detail: '/goods/detail',
    search: '/goods/search',
    categories: '/goods/categories',
    hot: '/goods/hot',
    new: '/goods/new',
    recommend: '/goods/recommend'
  },

  cart: {
    list: '/cart/list',
    add: '/cart/add',
    update: '/cart/update',
    delete: '/cart/delete',
    clear: '/cart/clear',
    count: '/cart/count'
  },

  order: {
    create: '/order/create',
    list: '/order/list',
    detail: '/order/detail',
    cancel: '/order/cancel',
    confirm: '/order/confirm',
    pay: '/order/pay',
    logistics: '/order/logistics',
    refund: '/order/refund'
  },

  payment: {
    methods: '/payment/methods',
    create: '/payment/create',
    status: '/payment/status'
  },

  coupon: {
    list: '/coupon/list',
    available: '/coupon/available',
    use: '/coupon/use'
  },

  favorite: {
    list: '/favorite/list',
    add: '/favorite/add',
    remove: '/favorite/remove',
    check: '/favorite/check'
  },

  shop: {
    followedList: '/shop/followed',
    follow: '/shop/follow',
    unfollow: '/shop/unfollow'
  },

  review: {
    list: '/review/list',
    add: '/review/add'
  },

  upload: {
    avatar: '/upload/avatar',
    image: '/upload/image'
  },

  banner: {
    list: '/banner/list'
  },

  search: {
    hot: '/search/hot',
    history: '/search/history',
    clear: '/search/clear'
  }
};
