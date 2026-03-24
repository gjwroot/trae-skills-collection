Page({
  data: {
    form: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  },

  onOldPasswordInput(e) {
    this.setData({
      'form.oldPassword': e.detail.value
    });
  },

  onNewPasswordInput(e) {
    this.setData({
      'form.newPassword': e.detail.value
    });
  },

  onConfirmPasswordInput(e) {
    this.setData({
      'form.confirmPassword': e.detail.value
    });
  },

  savePassword() {
    const { oldPassword, newPassword, confirmPassword } = this.data.form;

    // 验证输入
    if (!oldPassword || !newPassword || !confirmPassword) {
      wx.showToast({
        title: '请填写完整信息',
        icon: 'none'
      });
      return;
    }

    if (newPassword.length < 6 || newPassword.length > 20) {
      wx.showToast({
        title: '密码长度需为6-20位',
        icon: 'none'
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      wx.showToast({
        title: '两次密码输入不一致',
        icon: 'none'
      });
      return;
    }

    // 模拟修改密码成功
    wx.showToast({
      title: '修改成功',
      icon: 'success'
    });

    setTimeout(() => {
      wx.navigateBack();
    }, 1500);
  }
});
