const { get } = require('./utils/request.js');
const api = require('./utils/api.js');
const store = require('./utils/store.js');
const themeManager = require('./utils/theme.js');
const couponReminder = require('./utils/coupon-reminder.js');
const reviewReminder = require('./utils/review-reminder.js');

App({
  onLaunch() {
    console.log('Overseas Mall launched');
    this.initTheme();
    store.loadUserInfo();
    store.loadCartCount();
    this.initMockData();
    this.checkReminders();
  },

  initTheme() {
    const themeConfig = themeManager.initAppTheme();
    this.globalData.theme = themeConfig.theme;
    this.globalData.colors = themeConfig.colors;
  },

  initMockData() {
    this.initMockMessages();
    this.initMockCoupons();
    this.initMockOrders();
  },

  initMockMessages() {
    let messages = wx.getStorageSync('mockMessages');
    if (!messages) {
      messages = [
        { id: 1, title: 'Order Shipped', content: 'Your order #12345 has been shipped!', read: false, time: new Date(Date.now() - 3600000).toISOString() },
        { id: 2, title: 'Coupon Expiring', content: 'Your $10 coupon will expire in 3 days', read: false, time: new Date(Date.now() - 7200000).toISOString() },
        { id: 3, title: 'New Arrivals', content: 'Check out our latest products!', read: true, time: new Date(Date.now() - 86400000).toISOString() }
      ];
      wx.setStorageSync('mockMessages', messages);
    }
  },

  initMockCoupons() {
    let coupons = wx.getStorageSync('mockCoupons');
    if (!coupons) {
      const today = new Date();
      coupons = [
        { id: 1, name: 'New User Discount', discount: 10, minAmount: 50, endTime: new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString(), used: false },
        { id: 2, name: 'Weekend Sale', discount: 15, minAmount: 80, endTime: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(), used: false },
        { id: 3, name: 'Birthday Special', discount: 20, minAmount: 100, endTime: new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(), used: false },
        { id: 4, name: 'Used Coupon', discount: 5, minAmount: 30, endTime: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(), used: true }
      ];
      wx.setStorageSync('mockCoupons', coupons);
    }
  },

  checkReminders() {
    couponReminder.checkAndRemind();
    reviewReminder.checkAndRemind();
  },

  initMockOrders() {
    let orders = wx.getStorageSync('mockOrders');
    if (!orders) {
      orders = [];
      wx.setStorageSync('mockOrders', orders);
    }
  },

  onShow() {
    console.log('Overseas Mall shown');
  },

  onHide() {
    console.log('Overseas Mall hidden');
  },

  checkLoginStatus() {
    const state = store.getState();
    this.globalData.userInfo = state.userInfo;
    this.globalData.isLoggedIn = !!state.token;
  },

  async loadCartCount() {
    try {
      return await store.loadCartCount();
    } catch (error) {
      console.error('Load cart count failed:', error);
      return 0;
    }
  },

  store: store,

  globalData: {
    userInfo: null,
    isLoggedIn: false,
    cartCount: 0,
    language: 'zh-CN',
    currency: 'USD',
    selectedCategoryId: null,
    showHotGoods: false,
    showNewGoods: false
  }
});
