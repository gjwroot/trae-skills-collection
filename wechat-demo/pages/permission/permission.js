Page({
  data: {
    locationAuth: false,
    albumAuth: false,
    cameraAuth: false
  },

  onLoad() {
    this.checkPermissionStatus();
  },

  onShow() {
    // 页面显示时重新检查权限状态
    this.checkPermissionStatus();
  },

  // 检查权限状态
  checkPermissionStatus() {
    wx.getSetting({
      success: (res) => {
        this.setData({
          locationAuth: res.authSetting['scope.userLocation'] || false,
          albumAuth: res.authSetting['scope.writePhotosAlbum'] || false,
          cameraAuth: res.authSetting['scope.camera'] || false
        });
      }
    });
  },

  // 获取手机号 - 必须使用原生按钮触发
  getPhoneNumber(e) {
    console.log('获取手机号事件:', e);
    if (e.detail.errMsg === 'getPhoneNumber:ok') {
      // 获取成功，e.detail.code 需要发送到后端解密
      wx.showModal({
        title: '获取成功',
        content: `加密数据code: ${e.detail.code}\n\n注意：此code需要发送到后端，通过微信接口解密获取真实手机号`,
        showCancel: false
      });
    } else {
      wx.showToast({
        title: '用户拒绝授权',
        icon: 'none'
      });
    }
  },

  // 获取位置
  getLocation() {
    // 先检查权限状态
    wx.getSetting({
      success: (res) => {
        if (!res.authSetting['scope.userLocation']) {
          // 首次请求权限
          wx.authorize({
            scope: 'scope.userLocation',
            success: () => {
              this.setData({ locationAuth: true });
              this.doGetLocation();
            },
            fail: () => {
              // 权限被拒绝，引导用户去设置页面
              wx.showModal({
                title: '权限请求',
                content: '需要获取您的位置信息，用于推荐附近的餐厅',
                confirmText: '去设置',
                cancelText: '取消',
                success: (modalRes) => {
                  if (modalRes.confirm) {
                    wx.openSetting({
                      success: (settingRes) => {
                        if (settingRes.authSetting['scope.userLocation']) {
                          this.setData({ locationAuth: true });
                          this.doGetLocation();
                        }
                      }
                    });
                  }
                }
              });
            }
          });
        } else {
          // 已经有权限
          this.doGetLocation();
        }
      }
    });
  },

  doGetLocation() {
    wx.getLocation({
      type: 'wgs84',
      success: (res) => {
        console.log('获取位置成功:', res);
        wx.showModal({
          title: '获取位置成功',
          content: `经度: ${res.longitude}\n纬度: ${res.latitude}\n精度: ${res.accuracy}米`,
          showCancel: false
        });
      },
      fail: (err) => {
        console.log('获取位置失败:', err);
        wx.showToast({ title: '获取位置失败', icon: 'none' });
      }
    });
  },

  // 选择图片
  chooseImage() {
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        console.log('选择图片成功:', res);
        this.setData({ albumAuth: true });
        wx.showModal({
          title: '选择图片成功',
          content: `图片路径: ${res.tempFilePaths[0]}\n图片大小: ${(res.tempFiles[0].size / 1024).toFixed(2)} KB`,
          showCancel: false
        });
      },
      fail: (err) => {
        console.log('选择图片失败:', err);
        if (err.errMsg.includes('auth')) {
          wx.showModal({
            title: '权限不足',
            content: '需要相册权限，是否去设置？',
            confirmText: '去设置',
            success: (res) => {
              if (res.confirm) {
                wx.openSetting();
              }
            }
          });
        } else {
          wx.showToast({ title: '选择图片失败', icon: 'none' });
        }
      }
    });
  },

  // 扫码
  scanCode() {
    wx.scanCode({
      onlyFromCamera: false,
      scanType: ['qrCode', 'barCode', 'datamatrix', 'pdf417'],
      success: (res) => {
        console.log('扫码成功:', res);
        wx.showModal({
          title: '扫码成功',
          content: `类型: ${res.scanType}\n结果: ${res.result}`,
          showCancel: false
        });
      },
      fail: (err) => {
        console.log('扫码失败:', err);
        wx.showToast({ title: '扫码失败', icon: 'none' });
      }
    });
  },

  // 获取用户信息
  getUserInfo() {
    wx.getUserProfile({
      desc: '用于展示用户头像和昵称',
      success: (res) => {
        console.log('获取用户信息成功:', res);
        wx.showModal({
          title: '获取成功',
          content: `昵称: ${res.userInfo.nickName}\n头像: ${res.userInfo.avatarUrl.substring(0, 30)}...`,
          showCancel: false
        });
      },
      fail: (err) => {
        console.log('获取用户信息失败:', err);
        wx.showToast({ title: '用户拒绝授权', icon: 'none' });
      }
    });
  }
});
