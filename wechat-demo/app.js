const request = require('./utils/request.js');
const api = require('./utils/api.js');

App({
  onLaunch() {
    console.log('小程序启动');
    this.checkLoginStatus();
  },
  
  onShow() {
    console.log('小程序显示');
  },
  
  onHide() {
    console.log('小程序隐藏');
  },

  checkLoginStatus() {
    const token = wx.getStorageSync('token');
    if (!token) {
      wx.reLaunch({ url: '/pages/login/login' });
    }
  },

  globalData: {
    userInfo: null
  }
})