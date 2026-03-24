Page({
  data: {
    settings: {
      orderNotify: true,
      promoNotify: true
    },
    cacheSize: '0.5'
  },

  onLoad() {
    this.loadSettings();
  },

  loadSettings() {
    const settings = wx.getStorageSync('app_settings');
    if (settings) {
      this.setData({ settings });
    }
  },

  saveSettings() {
    wx.setStorageSync('app_settings', this.data.settings);
  },

  // 编辑个人资料
  editProfile() {
    wx.navigateTo({
      url: '/pages/profile/profile'
    });
  },

  // 修改密码
  changePassword() {
    wx.navigateTo({
      url: '/pages/password/password'
    });
  },

  // 切换订单通知
  toggleOrderNotify(e) {
    this.setData({
      'settings.orderNotify': e.detail.value
    });
    this.saveSettings();
    wx.showToast({
      title: e.detail.value ? '已开启' : '已关闭',
      icon: 'none'
    });
  },

  // 切换优惠通知
  togglePromoNotify(e) {
    this.setData({
      'settings.promoNotify': e.detail.value
    });
    this.saveSettings();
    wx.showToast({
      title: e.detail.value ? '已开启' : '已关闭',
      icon: 'none'
    });
  },

  // 清除缓存
  clearCache() {
    wx.showModal({
      title: '清除缓存',
      content: '确定要清除缓存吗？',
      success: (res) => {
        if (res.confirm) {
          wx.clearStorage();
          this.setData({ cacheSize: '0' });
          wx.showToast({
            title: '缓存已清除',
            icon: 'success'
          });
        }
      }
    });
  },

  // 关于我们
  aboutApp() {
    wx.showModal({
      title: '关于我们',
      content: '家庭点饭系统 v1.0.0\n\n用心做好每一顿饭，让美食温暖你的每一天。',
      showCancel: false
    });
  },

  // 打开WebView示例
  openWebView() {
    wx.navigateTo({
      url: '/pages/webview/webview'
    });
  },

  // 退出登录
  logout() {
    wx.showModal({
      title: '退出登录',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          wx.showToast({
            title: '已退出登录',
            icon: 'success'
          });
        }
      }
    });
  }
});
