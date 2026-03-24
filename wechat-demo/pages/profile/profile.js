Page({
  data: {
    profile: {
      nickname: '美食家',
      phone: '',
      gender: 0,
      birthday: ''
    },
    genderOptions: ['保密', '男', '女']
  },

  onLoad() {
    this.loadProfile();
  },

  loadProfile() {
    const profile = wx.getStorageSync('user_profile');
    if (profile) {
      this.setData({ profile });
    }
  },

  onNicknameInput(e) {
    this.setData({
      'profile.nickname': e.detail.value
    });
  },

  onPhoneInput(e) {
    this.setData({
      'profile.phone': e.detail.value
    });
  },

  onGenderChange(e) {
    this.setData({
      'profile.gender': parseInt(e.detail.value)
    });
  },

  onBirthdayChange(e) {
    this.setData({
      'profile.birthday': e.detail.value
    });
  },

  saveProfile() {
    wx.setStorageSync('user_profile', this.data.profile);
    wx.showToast({
      title: '保存成功',
      icon: 'success'
    });
    setTimeout(() => {
      wx.navigateBack();
    }, 1500);
  }
});
