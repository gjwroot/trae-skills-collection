const util = require('../../utils/util.js');

Page({
  data: {
    account: '',
    password: '',
    code: '',
    loginType: 'password',
    countdown: 0,
    agreed: false,
    accountError: '',
    passwordError: ''
  },

  onLoad(options) {
    if (options.redirect) {
      this.redirectUrl = decodeURIComponent(options.redirect);
    }
  },

  onAccountInput(e) {
    const account = e.detail.value;
    this.setData({ account });
    
    if (account && account.length > 0) {
      this.validateAccount(account);
    } else {
      this.setData({ accountError: '' });
    }
  },

  validateAccount(account) {
    const isPhone = /^1[3-9]\d{9}$/.test(account);
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(account);
    
    if (!isPhone && !isEmail) {
      if (account.length >= 11 && /^\d+$/.test(account)) {
        this.setData({ accountError: 'Please enter a valid phone number' });
      } else if (account.includes('@')) {
        this.setData({ accountError: 'Please enter a valid email' });
      } else {
        this.setData({ accountError: '' });
      }
    } else {
      this.setData({ accountError: '' });
    }
  },

  onPasswordInput(e) {
    this.setData({ password: e.detail.value });
  },

  onCodeInput(e) {
    this.setData({ code: e.detail.value });
  },

  switchLoginType() {
    this.setData({
      loginType: this.data.loginType === 'password' ? 'code' : 'password'
    });
  },

  async sendCode() {
    if (this.data.countdown > 0) return;
    
    if (!this.data.account) {
      util.showError('Please enter phone number or email');
      return;
    }

    const isPhone = /^1[3-9]\d{9}$/.test(this.data.account);
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.data.account);
    
    if (!isPhone && !isEmail) {
      this.validateAccount(this.data.account);
      util.showError('Please enter a valid phone number or email');
      return;
    }

    wx.showLoading({ title: 'Sending...' });
    setTimeout(() => {
      wx.hideLoading();
      util.showSuccess('Code sent (Mock: 123456)');
      this.startCountdown();
    }, 1000);
  },

  startCountdown() {
    this.setData({ countdown: 60 });
    
    const timer = setInterval(() => {
      if (this.data.countdown <= 1) {
        clearInterval(timer);
        this.setData({ countdown: 0 });
      } else {
        this.setData({ countdown: this.data.countdown - 1 });
      }
    }, 1000);
  },

  async handleLogin() {
    if (!this.data.agreed) {
      util.showError('Please agree to the terms');
      return;
    }

    if (!this.data.account) {
      util.showError('Please enter account');
      return;
    }

    const isPhone = /^1[3-9]\d{9}$/.test(this.data.account);
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.data.account);
    
    if (!isPhone && !isEmail) {
      this.validateAccount(this.data.account);
      util.showError('Please enter a valid phone number or email');
      return;
    }

    if (this.data.loginType === 'password' && !this.data.password) {
      util.showError('Please enter password');
      return;
    }

    if (this.data.loginType === 'code' && !this.data.code) {
      util.showError('Please enter verification code');
      return;
    }

    wx.showLoading({ title: 'Logging in...' });
    
    setTimeout(() => {
      wx.hideLoading();
      
      const mockUserInfo = {
        id: 1,
        nickname: 'Demo User',
        avatar: '/assets/images/default-avatar.png',
        phone: this.data.account,
        vipLevel: 1,
        points: 1000
      };
      
      wx.setStorageSync('token', 'mock_token_' + Date.now());
      wx.setStorageSync('userInfo', mockUserInfo);

      const app = getApp();
      if (app) {
        app.globalData.userInfo = mockUserInfo;
        app.globalData.isLoggedIn = true;
      }

      util.showSuccess('Login successful');

      setTimeout(() => {
        if (this.redirectUrl) {
          wx.redirectTo({ url: this.redirectUrl });
        } else {
          wx.switchTab({ url: '/pages/index/index' });
        }
      }, 1000);
    }, 1500);
  },

  handleWechatLogin() {
    if (!this.data.agreed) {
      util.showError('Please agree to the terms');
      return;
    }
    this.thirdPartyLogin('WeChat');
  },

  handleGoogleLogin() {
    if (!this.data.agreed) {
      util.showError('Please agree to the terms');
      return;
    }
    this.thirdPartyLogin('Google');
  },

  handleFacebookLogin() {
    if (!this.data.agreed) {
      util.showError('Please agree to the terms');
      return;
    }
    this.thirdPartyLogin('Facebook');
  },

  thirdPartyLogin(platform) {
    wx.showLoading({ title: 'Logging in...' });
    
    setTimeout(() => {
      wx.hideLoading();
      
      const mockUserInfo = {
        id: 1,
        nickname: platform + ' User',
        avatar: '/assets/images/default-avatar.png',
        loginVia: platform,
        vipLevel: 1,
        points: 1000
      };
      
      wx.setStorageSync('token', 'mock_token_' + Date.now());
      wx.setStorageSync('userInfo', mockUserInfo);

      const app = getApp();
      if (app) {
        app.globalData.userInfo = mockUserInfo;
        app.globalData.isLoggedIn = true;
      }

      util.showSuccess('Login successful');

      setTimeout(() => {
        wx.switchTab({ url: '/pages/index/index' });
      }, 1000);
    }, 1500);
  },

  toggleAgreement() {
    this.setData({ agreed: !this.data.agreed });
  },

  viewTerms() {
    wx.showModal({
      title: 'Terms of Service',
      content: 'This is a demo application. By using this app, you agree to our terms of service.',
      showCancel: false
    });
  },

  viewPrivacy() {
    wx.showModal({
      title: 'Privacy Policy',
      content: 'This is a demo application. We respect your privacy and protect your personal information.',
      showCancel: false
    });
  },

  navigateToRegister() {
    wx.navigateTo({ url: '/pages/register/register' });
  },

  forgotPassword() {
    wx.navigateTo({ url: '/pages/forgot-password/forgot-password' });
  },

  navigateToHome() {
    wx.switchTab({ url: '/pages/index/index' });
  }
});
