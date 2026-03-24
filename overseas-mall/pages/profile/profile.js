const { get, post } = require('../../utils/request.js');
const api = require('../../utils/api.js');
const util = require('../../utils/util.js');

Page({
  data: {
    userInfo: {
      avatar: '',
      nickname: '',
      phone: '',
      email: '',
      gender: '',
      birthday: ''
    },
    genderOptions: ['Male', 'Female', 'Other'],
    genderIndex: 0
  },

  onLoad() {
    this.loadUserProfile();
  },

  async loadUserProfile() {
    return new Promise((resolve) => {
      try {
        const userInfo = wx.getStorageSync('userInfo') || {};
        const genderIndex = this.data.genderOptions.indexOf(userInfo.gender);
        
        this.setData({
          userInfo,
          genderIndex: genderIndex >= 0 ? genderIndex : 0
        });
        resolve();
      } catch (error) {
        console.error('Load profile failed:', error);
        resolve();
      }
    });
  },

  changeAvatar() {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempFilePath = res.tempFiles[0].tempFilePath;
        this.uploadAvatar(tempFilePath);
      }
    });
  },

  async uploadAvatar(filePath) {
    wx.showLoading({ title: 'Uploading...' });
    
    wx.uploadFile({
      url: api.upload.avatar,
      filePath: filePath,
      name: 'file',
      success: (res) => {
        const data = JSON.parse(res.data);
        if (data.code === 0) {
          this.setData({
            'userInfo.avatar': data.url
          });
          util.showSuccess('Avatar updated');
        }
      },
      complete: () => {
        wx.hideLoading();
      }
    });
  },

  onNicknameInput(e) {
    this.setData({ 'userInfo.nickname': e.detail.value });
  },

  onPhoneInput(e) {
    this.setData({ 'userInfo.phone': e.detail.value });
  },

  onEmailInput(e) {
    this.setData({ 'userInfo.email': e.detail.value });
  },

  onGenderChange(e) {
    const index = e.detail.value;
    this.setData({
      genderIndex: index,
      'userInfo.gender': this.data.genderOptions[index]
    });
  },

  onBirthdayChange(e) {
    this.setData({ 'userInfo.birthday': e.detail.value });
  },

  async saveProfile() {
    if (!this.data.userInfo.nickname) {
      util.showToast('Please enter nickname');
      return;
    }

    try {
      wx.showLoading({ title: 'Saving...' });
      
      await post(api.user.updateProfile, this.data.userInfo);
      
      wx.hideLoading();
      util.showSuccess('Saved successfully');
      
      wx.setStorageSync('userInfo', this.data.userInfo);
    } catch (error) {
      wx.hideLoading();
      console.error('Save profile failed:', error);
      util.showToast('Save failed');
    }
  },

  onPullDownRefresh() {
    this.loadUserProfile().then(() => {
      wx.stopPullDownRefresh();
    });
  }
});
