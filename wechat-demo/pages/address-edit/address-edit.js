const store = require('../../utils/store.js');

Page({
  data: {
    addressId: null,
    region: ['北京市', '北京市', '东城区'],
    formData: {
      name: '',
      phone: '',
      province: '北京市',
      city: '北京市',
      district: '东城区',
      detail: '',
      isDefault: false
    }
  },

  onLoad(options) {
    if (options.id) {
      this.setData({ addressId: parseInt(options.id) });
      this.loadAddress(parseInt(options.id));
    }
  },

  loadAddress(id) {
    const addresses = store.getAddresses();
    const address = addresses.find(a => a.id === id);
    if (address) {
      this.setData({
        region: [address.province, address.city, address.district],
        formData: address
      });
    }
  },

  onNameInput(e) {
    this.setData({
      'formData.name': e.detail.value
    });
  },

  onPhoneInput(e) {
    this.setData({
      'formData.phone': e.detail.value
    });
  },

  onRegionChange(e) {
    const region = e.detail.value;
    this.setData({
      region: region,
      'formData.province': region[0],
      'formData.city': region[1],
      'formData.district': region[2]
    });
  },

  onDetailInput(e) {
    this.setData({
      'formData.detail': e.detail.value
    });
  },

  onDefaultChange(e) {
    this.setData({
      'formData.isDefault': e.detail.value
    });
  },

  saveAddress() {
    const { name, phone, province, city, district, detail, isDefault } = this.data.formData;

    if (!name || !name.trim()) {
      wx.showToast({
        title: '请输入收货人姓名',
        icon: 'none'
      });
      return;
    }

    if (!phone || !phone.trim()) {
      wx.showToast({
        title: '请输入手机号',
        icon: 'none'
      });
      return;
    }

    if (!/^1[3-9]\d{9}$/.test(phone)) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none'
      });
      return;
    }

    if (!detail || !detail.trim()) {
      wx.showToast({
        title: '请输入详细地址',
        icon: 'none'
      });
      return;
    }

    const addressData = {
      name,
      phone,
      province,
      city,
      district,
      detail,
      isDefault
    };

    if (this.data.addressId) {
      store.updateAddress(this.data.addressId, addressData);
      if (isDefault) {
        store.setDefaultAddress(this.data.addressId);
      }
    } else {
      store.addAddress(addressData);
      if (isDefault) {
        const addresses = store.getAddresses();
        const lastAddress = addresses[addresses.length - 1];
        store.setDefaultAddress(lastAddress.id);
      }
    }

    wx.showToast({
      title: '保存成功',
      icon: 'success',
      duration: 1500
    });

    setTimeout(() => {
      wx.navigateBack();
    }, 1500);
  }
});
