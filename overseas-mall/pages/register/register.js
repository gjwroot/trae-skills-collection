const util = require('../../utils/util.js');

Page({
  data: {
    account: '',
    password: '',
    confirmPassword: '',
    code: '',
    countdown: 0,
    agreed: false,
    passwordStrength: { level: 0, text: '', color: '#E5E5E5' },
    confirmError: ''
  },

  onAccountInput(e) {
    this.setData({ account: e.detail.value });
  },

  onPasswordInput(e) {
    const password = e.detail.value;
    this.setData({ password });
    this.checkPasswordStrength(password);
    
    if (this.data.confirmPassword) {
      this.validateConfirmPassword(password, this.data.confirmPassword);
    }
  },

  onConfirmPasswordInput(e) {
    const confirmPassword = e.detail.value;
    this.setData({ confirmPassword });
    this.validateConfirmPassword(this.data.password, confirmPassword);
  },

  checkPasswordStrength(password) {
    if (!password || password.length < 6) {
      this.setData({
        passwordStrength: { level: 0, text: 'Too short', color: '#E5E5E5' }
      });
      return;
    }
    
    let score = 0;
    
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;
    
    let strength;
    if (score <= 2) {
      strength = { level: 1, text: 'Weak', color: '#EF4444' };
    } else if (score <= 4) {
      strength = { level: 2, text: 'Medium', color: '#F59E0B' };
    } else {
      strength = { level: 3, text: 'Strong', color: '#10B981' };
    }
    
    this.setData({ passwordStrength: strength });
  },

  validateConfirmPassword(password, confirmPassword) {
    if (!confirmPassword) {
      this.setData({ confirmError: '' });
      return;
    }
    
    if (password !== confirmPassword) {
      this.setData({ confirmError: 'Passwords do not match' });
    } else {
      this.setData({ confirmError: '' });
    }
  },

  onCodeInput(e) {
    this.setData({ code: e.detail.value });
  },

  async sendCode() {
    if (this.data.countdown > 0) return;
    
    if (!this.data.account) {
      util.showError('Please enter phone number or email');
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

  async handleRegister() {
    if (!this.data.agreed) {
      util.showError('Please agree to the terms');
      return;
    }

    if (!this.data.account) {
      util.showError('Please enter account');
      return;
    }

    if (!this.data.password) {
      util.showError('Please enter password');
      return;
    }

    if (this.data.password !== this.data.confirmPassword) {
      util.showError('Passwords do not match');
      return;
    }

    if (!this.data.code) {
      util.showError('Please enter verification code');
      return;
    }

    wx.showLoading({ title: 'Creating account...' });
    
    setTimeout(() => {
      wx.hideLoading();
      
      const mockUserInfo = {
        id: 1,
        nickname: 'New User',
        avatar: '/assets/images/default-avatar.png',
        account: this.data.account,
        level: 1,
        levelName: 'Silver Member',
        points: 500
      };
      
      wx.setStorageSync('token', 'mock_token_' + Date.now());
      wx.setStorageSync('userInfo', mockUserInfo);

      const app = getApp();
      if (app) {
        app.globalData.userInfo = mockUserInfo;
        app.globalData.isLoggedIn = true;
      }

      util.showSuccess('Registration successful');

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

  navigateToLogin() {
    wx.navigateBack();
  }
});
