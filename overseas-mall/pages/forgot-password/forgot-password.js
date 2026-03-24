const util = require('../../utils/util.js');

Page({
  data: {
    account: '',
    code: '',
    newPassword: '',
    confirmPassword: '',
    countdown: 0
  },

  onAccountInput(e) {
    this.setData({ account: e.detail.value });
  },

  onCodeInput(e) {
    this.setData({ code: e.detail.value });
  },

  onNewPasswordInput(e) {
    this.setData({ newPassword: e.detail.value });
  },

  onConfirmPasswordInput(e) {
    this.setData({ confirmPassword: e.detail.value });
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

  async handleReset() {
    if (!this.data.account) {
      util.showError('Please enter account');
      return;
    }

    if (!this.data.code) {
      util.showError('Please enter verification code');
      return;
    }

    if (!this.data.newPassword) {
      util.showError('Please enter new password');
      return;
    }

    if (this.data.newPassword !== this.data.confirmPassword) {
      util.showError('Passwords do not match');
      return;
    }

    wx.showLoading({ title: 'Resetting password...' });
    
    setTimeout(() => {
      wx.hideLoading();
      util.showSuccess('Password reset successful');

      setTimeout(() => {
        wx.navigateBack();
      }, 1500);
    }, 1500);
  },

  navigateToLogin() {
    wx.navigateBack();
  }
});
