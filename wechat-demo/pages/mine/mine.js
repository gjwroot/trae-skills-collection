const store = require('../../utils/store.js');
const icons = require('../../utils/icons.js');

Page({
  data: {
    userInfo: null,
    orderCount: 0,
    favoriteCount: 0,
    totalSpent: 0,
    icons: icons
  },

  onLoad() {
    const app = getApp();
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo
      });
    }
    this.updateStats();
  },

  onShow() {
    this.updateStats();
  },

  updateStats() {
    const orders = wx.getStorageSync('orders') || [];
    const orderCount = orders.length;
    const favoriteCount = store.getFavoriteCount();
    let totalSpent = 0;
    orders.forEach(order => {
      totalSpent += order.total;
    });
    this.setData({
      orderCount,
      favoriteCount,
      totalSpent: totalSpent.toFixed(0)
    });
  },

  getUserInfo() {
    wx.getUserProfile({
      desc: '用于完善用户资料',
      success: (res) => {
        const app = getApp();
        app.globalData.userInfo = res.userInfo;
        this.setData({
          userInfo: res.userInfo
        });
        wx.showToast({
          title: '获取成功',
          icon: 'success'
        });
      },
      fail: (err) => {
        wx.showToast({
          title: '获取失败',
          icon: 'none'
        });
      }
    });
  },

  goToOrders() {
    wx.switchTab({
      url: '/pages/cart/cart'
    });
  },

  goToFavorites() {
    wx.navigateTo({
      url: '/pages/favorites/favorites'
    });
  },

  goToAddress() {
    wx.navigateTo({
      url: '/pages/address/address'
    });
  },

  clearCart() {
    wx.showModal({
      title: '提示',
      content: '确定要清空购物车吗？',
      success: (res) => {
        if (res.confirm) {
          store.clearCart();
          wx.showToast({
            title: '已清空',
            icon: 'success'
          });
        }
      }
    });
  },

  clearOrders() {
    wx.showModal({
      title: '提示',
      content: '确定要清空订单记录吗？',
      success: (res) => {
        if (res.confirm) {
          wx.setStorageSync('orders', []);
          store.orders = [];
          wx.showToast({
            title: '已清空',
            icon: 'success'
          });
        }
      }
    });
  },

  showAbout() {
    wx.showModal({
      title: '关于我们',
      content: '家庭点饭系统 v1.0.0\n\n一款简单易用的家庭点餐小程序，让您轻松享受美味佳肴！',
      showCancel: false,
      confirmText: '好的'
    });
  },

  goToSettings() {
    wx.navigateTo({
      url: '/pages/settings/settings'
    });
  }
});