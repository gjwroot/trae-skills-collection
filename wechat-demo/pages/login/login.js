const request = require('../../utils/request.js');
const api = require('../../utils/api.js');

Page({
  data: {
    phone: '',
    code: '',
    countdown: 0,
    agreed: false,
    canLogin: false
  },

  onLoad() {
    this.checkCanLogin();
  },

  bindPhoneInput(e) {
    this.setData({ phone: e.detail.value });
    this.checkCanLogin();
  },

  bindCodeInput(e) {
    this.setData({ code: e.detail.value });
    this.checkCanLogin();
  },

  toggleAgreement() {
    this.setData({ agreed: !this.data.agreed });
    this.checkCanLogin();
  },

  checkCanLogin() {
    const { phone, code, agreed } = this.data;
    const canLogin = phone && code && agreed && phone.length === 11 && code.length === 6;
    this.setData({ canLogin });
  },

  getCode() {
    const { phone, agreed } = this.data;

    if (!agreed) {
      wx.showToast({ title: '请先同意用户协议', icon: 'none' });
      return;
    }

    if (!phone || !/^1[3-9]\d{9}$/.test(phone)) {
      wx.showToast({ title: '请输入正确的手机号', icon: 'none' });
      return;
    }

    // 模拟发送验证码
    wx.showToast({ title: '验证码已发送: 123456', icon: 'none' });
    this.startCountdown();
  },

  startCountdown() {
    let countdown = 60;
    this.setData({ countdown });
    this.data.timer = setInterval(() => {
      countdown--;
      this.setData({ countdown });
      if (countdown <= 0) {
        clearInterval(this.data.timer);
      }
    }, 1000);
  },

  onUnload() {
    if (this.data.timer) {
      clearInterval(this.data.timer);
    }
  },

  login() {
    const { phone, code, agreed } = this.data;

    if (!agreed) {
      wx.showToast({ title: '请先同意用户协议', icon: 'none' });
      return;
    }

    if (!phone || !code) {
      wx.showToast({ title: '请填写完整信息', icon: 'none' });
      return;
    }

    // 模拟登录成功
    wx.showLoading({ title: '登录中...' });
    setTimeout(() => {
      wx.hideLoading();
      wx.setStorageSync('token', 'mock_token_' + Date.now());
      wx.setStorageSync('userInfo', {
        nickName: '用户' + phone.slice(-4),
        phone: phone,
        avatarUrl: ''
      });
      wx.showToast({
        title: '登录成功',
        success: () => {
          setTimeout(() => {
            wx.switchTab({ url: '/pages/index/index' });
          }, 500);
        }
      });
    }, 1000);
  },

  wechatLogin() {
    const { agreed } = this.data;

    if (!agreed) {
      wx.showToast({ title: '请先同意用户协议', icon: 'none' });
      return;
    }

    wx.showLoading({ title: '登录中...' });
    wx.login({
      success: (res) => {
        if (res.code) {
          // 模拟微信登录成功
          setTimeout(() => {
            wx.hideLoading();
            wx.setStorageSync('token', 'wechat_token_' + Date.now());
            wx.setStorageSync('userInfo', {
              nickName: '微信用户',
              avatarUrl: '',
              isWechatUser: true
            });
            wx.showToast({
              title: '登录成功',
              success: () => {
                setTimeout(() => {
                  wx.switchTab({ url: '/pages/index/index' });
                }, 500);
              }
            });
          }, 1000);
        } else {
          wx.hideLoading();
          wx.showToast({ title: '登录失败', icon: 'none' });
        }
      },
      fail: () => {
        wx.hideLoading();
        wx.showToast({ title: '登录失败', icon: 'none' });
      }
    });
  },

  getPhoneNumber(e) {
    const { agreed } = this.data;

    if (!agreed) {
      wx.showToast({ title: '请先同意用户协议', icon: 'none' });
      return;
    }

    if (e.detail.errMsg === 'getPhoneNumber:ok') {
      wx.showLoading({ title: '登录中...' });

      // 模拟手机号登录成功
      setTimeout(() => {
        wx.hideLoading();
        wx.setStorageSync('token', 'phone_token_' + Date.now());
        wx.setStorageSync('userInfo', {
          nickName: '手机号用户',
          phone: '138****8888',
          avatarUrl: '',
          isPhoneUser: true
        });
        wx.showToast({
          title: '登录成功',
          success: () => {
            setTimeout(() => {
              wx.switchTab({ url: '/pages/index/index' });
            }, 500);
          }
        });
      }, 1000);
    } else {
      wx.showToast({ title: '获取手机号失败', icon: 'none' });
    }
  },

  showAgreement() {
    wx.showModal({
      title: '用户协议',
      content: '欢迎使用家庭点饭系统！\n\n1. 用户注册与账户安全\n2. 服务内容与使用规范\n3. 隐私保护政策\n4. 免责声明\n\n请仔细阅读并遵守以上协议内容。',
      showCancel: false
    });
  },

  showPrivacy() {
    wx.showModal({
      title: '隐私政策',
      content: '我们重视您的隐私保护！\n\n1. 信息收集与使用\n2. 信息存储与保护\n3. 信息共享与披露\n4. 用户权利\n\n我们承诺严格保护您的个人信息安全。',
      showCancel: false
    });
  }
});
