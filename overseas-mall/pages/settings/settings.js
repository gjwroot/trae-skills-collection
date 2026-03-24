const { get, post } = require('../../utils/request.js');
const api = require('../../utils/api.js');
const util = require('../../utils/util.js');
const themeManager = require('../../utils/theme.js');
const accessibilityManager = require('../../utils/accessibility.js');

Page({
  data: {
    userInfo: {},
    couponCount: 0,
    notificationEnabled: true,
    cacheSize: '0KB',
    language: 'en',
    currency: 'USD',
    languageText: 'English',
    currencyText: 'USD ($)',
    theme: 'light',
    themeText: '浅色模式',
    voiceOverEnabled: false,
    largeTextEnabled: false,
    highContrastEnabled: false,
    reduceMotionEnabled: false,
    languages: [
      { code: 'en', name: 'English' },
      { code: 'zh-CN', name: '简体中文' },
      { code: 'zh-TW', name: '繁體中文' },
      { code: 'ja', name: '日本語' },
      { code: 'ko', name: '한국어' }
    ],
    currencies: [
      { code: 'USD', name: 'USD ($)' },
      { code: 'CNY', name: 'CNY (¥)' },
      { code: 'EUR', name: 'EUR (€)' },
      { code: 'GBP', name: 'GBP (£)' },
      { code: 'JPY', name: 'JPY (¥)' }
    ],
    showLanguagePicker: false,
    showCurrencyPicker: false
  },

  onLoad() {
    this.loadUserInfo();
    this.loadCouponCount();
    this.calculateCacheSize();
    this.loadSettings();
  },

  onShow() {
    this.loadUserInfo();
  },

  loadSettings() {
    const language = wx.getStorageSync('language') || 'en';
    const currency = wx.getStorageSync('currency') || 'USD';
    const theme = themeManager.getTheme();
    const accessibility = accessibilityManager.getSettings();
    const languageItem = this.data.languages.find(item => item.code === language);
    const currencyItem = this.data.currencies.find(item => item.code === currency);
    const themeConfig = themeManager.getThemeConfig(theme);
    this.setData({ 
      language, 
      currency,
      theme,
      voiceOverEnabled: accessibility.voiceOverEnabled,
      largeTextEnabled: accessibility.largeTextEnabled,
      highContrastEnabled: accessibility.highContrastEnabled,
      reduceMotionEnabled: accessibility.reduceMotionEnabled,
      languageText: languageItem ? languageItem.name : 'English',
      currencyText: currencyItem ? currencyItem.name : 'USD ($)',
      themeText: themeConfig ? themeConfig.name : '浅色模式'
    });
  },

  loadUserInfo() {
    const userInfo = wx.getStorageSync('userInfo') || {};
    this.setData({ userInfo });
  },

  async loadCouponCount() {
    try {
      const res = await get(api.coupon.list, { status: 'available' });
      this.setData({ couponCount: (res.list || []).length });
    } catch (error) {
      console.error('Load coupon count failed:', error);
    }
  },

  calculateCacheSize() {
    const res = wx.getStorageInfoSync();
    const size = res.currentSize > 1024 
      ? (res.currentSize / 1024).toFixed(2) + 'MB'
      : res.currentSize + 'KB';
    this.setData({ cacheSize: size });
  },

  navigateTo(e) {
    const url = e.currentTarget.dataset.url;
    wx.navigateTo({ url });
  },

  toggleNotification(e) {
    this.setData({ notificationEnabled: e.detail.value });
  },

  toggleTheme() {
    themeManager.toggleTheme();
    const theme = themeManager.getTheme();
    const themeConfig = themeManager.getThemeConfig(theme);
    this.setData({
      theme,
      themeText: themeConfig ? themeConfig.name : '浅色模式'
    });
    util.showSuccess(`${themeConfig.name}已切换`);
  },

  toggleVoiceOver(e) {
    accessibilityManager.toggleVoiceOver();
    this.setData({ voiceOverEnabled: e.detail.value });
    util.showToast(e.detail.value ? 'VoiceOver已开启' : 'VoiceOver已关闭');
  },

  toggleLargeText(e) {
    accessibilityManager.toggleLargeText();
    this.setData({ largeTextEnabled: e.detail.value });
    util.showToast(e.detail.value ? '大字体已开启' : '大字体已关闭');
  },

  toggleHighContrast(e) {
    accessibilityManager.toggleHighContrast();
    this.setData({ highContrastEnabled: e.detail.value });
    util.showToast(e.detail.value ? '高对比度已开启' : '高对比度已关闭');
  },

  toggleReduceMotion(e) {
    accessibilityManager.toggleReduceMotion();
    this.setData({ reduceMotionEnabled: e.detail.value });
    util.showToast(e.detail.value ? '减少动画已开启' : '减少动画已关闭');
  },

  showLanguagePicker() {
    this.setData({ showLanguagePicker: true });
  },

  hideLanguagePicker() {
    this.setData({ showLanguagePicker: false });
  },

  selectLanguage(e) {
    const code = e.currentTarget.dataset.code;
    const languageItem = this.data.languages.find(item => item.code === code);
    wx.setStorageSync('language', code);
    this.setData({ 
      language: code, 
      languageText: languageItem ? languageItem.name : 'English',
      showLanguagePicker: false 
    });
    util.showSuccess('Language updated');
    
    // 更新全局数据
    const app = getApp();
    if (app) {
      app.globalData.language = code;
    }
  },

  showCurrencyPicker() {
    this.setData({ showCurrencyPicker: true });
  },

  hideCurrencyPicker() {
    this.setData({ showCurrencyPicker: false });
  },

  selectCurrency(e) {
    const code = e.currentTarget.dataset.code;
    const currencyItem = this.data.currencies.find(item => item.code === code);
    wx.setStorageSync('currency', code);
    this.setData({ 
      currency: code, 
      currencyText: currencyItem ? currencyItem.name : 'USD ($)',
      showCurrencyPicker: false 
    });
    util.showSuccess('Currency updated');
    
    // 更新全局数据
    const app = getApp();
    if (app) {
      app.globalData.currency = code;
    }
  },

  clearCache() {
    wx.showModal({
      title: 'Clear Cache',
      content: 'Are you sure to clear cache?',
      success: (res) => {
        if (res.confirm) {
          const userInfo = wx.getStorageSync('userInfo');
          const token = wx.getStorageSync('token');
          const language = wx.getStorageSync('language');
          const currency = wx.getStorageSync('currency');
          const theme = wx.getStorageSync('appTheme');
          const accessibility = wx.getStorageSync('accessibilitySettings');
          
          wx.clearStorageSync();
          
          if (userInfo) wx.setStorageSync('userInfo', userInfo);
          if (token) wx.setStorageSync('token', token);
          if (language) wx.setStorageSync('language', language);
          if (currency) wx.setStorageSync('currency', currency);
          if (theme) wx.setStorageSync('appTheme', theme);
          if (accessibility) wx.setStorageSync('accessibilitySettings', accessibility);
          
          this.calculateCacheSize();
          util.showSuccess('Cache cleared');
        }
      }
    });
  },

  showAbout() {
    wx.showModal({
      title: 'About Overseas Mall',
      content: 'Version: 1.0.0\n\nOverseas Mall is your one-stop shopping destination for quality products from around the world.',
      showCancel: false
    });
  },

  handleLogout() {
    wx.showModal({
      title: 'Log Out',
      content: 'Are you sure to log out?',
      success: async (res) => {
        if (res.confirm) {
          try {
            await post(api.auth.logout);
          } catch (error) {
            console.error('Logout failed:', error);
          }
          
          wx.clearStorageSync();
          wx.reLaunch({ url: '/pages/login/login' });
        }
      }
    });
  },

  onPullDownRefresh() {
    this.loadUserInfo();
    this.calculateCacheSize();
    setTimeout(() => {
      wx.stopPullDownRefresh();
    }, 500);
  }
});
