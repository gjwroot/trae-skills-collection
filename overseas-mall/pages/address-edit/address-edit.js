const util = require('../../utils/util.js');
const addressParser = require('../../utils/address-parser.js');

Page({
  data: {
    addressId: '',
    address: {
      name: '',
      phone: '',
      region: [],
      province: '',
      city: '',
      district: '',
      detail: '',
      isDefault: false
    },
    smartInput: '',
    showSmartInput: true
  },

  onLoad(options) {
    if (options.id) {
      this.setData({ addressId: options.id });
      this.loadAddressDetail(options.id);
    }
  },

  loadAddressDetail(id) {
    try {
      const addressList = wx.getStorageSync('mockAddressList') || [];
      const address = addressList.find(item => item.id == id) || {};
      
      this.setData({
        address: {
          ...address,
          region: [address.province, address.city, address.district]
        }
      });
    } catch (error) {
      console.error('Load address detail failed:', error);
    }
  },

  onNameInput(e) {
    this.setData({ 'address.name': e.detail.value });
  },

  onPhoneInput(e) {
    this.setData({ 'address.phone': e.detail.value });
  },

  onRegionChange(e) {
    const region = e.detail.value;
    this.setData({
      'address.region': region,
      'address.province': region[0],
      'address.city': region[1],
      'address.district': region[2]
    });
  },

  onDetailInput(e) {
    this.setData({ 'address.detail': e.detail.value });
  },

  onDefaultChange(e) {
    this.setData({ 'address.isDefault': e.detail.value });
  },

  onSmartInputChange(e) {
    this.setData({ smartInput: e.detail.value });
  },

  parseAddress() {
    const smartInput = this.data.smartInput.trim();
    
    if (!smartInput) {
      util.showToast('请输入地址信息');
      return;
    }
    
    wx.showLoading({ title: '解析中...' });
    
    setTimeout(() => {
      wx.hideLoading();
      
      const parsed = addressParser.parse(smartInput);
      
      this.setData({
        'address.name': parsed.name,
        'address.phone': parsed.phone,
        'address.province': parsed.province,
        'address.city': parsed.city,
        'address.district': parsed.district,
        'address.detail': parsed.detail,
        'address.region': [parsed.province, parsed.city, parsed.district].filter(item => item),
        showSmartInput: false
      });
      
      if (parsed.name && parsed.phone) {
        util.showSuccess('解析成功！');
      } else {
        util.showToast('请补充完整信息');
      }
    }, 500);
  },

  toggleInputMode() {
    this.setData({
      showSmartInput: !this.data.showSmartInput,
      smartInput: ''
    });
  },

  async saveAddress() {
    const { address } = this.data;
    
    if (!address.name) {
      util.showToast('Please enter name');
      return;
    }
    
    if (!address.phone) {
      util.showToast('Please enter phone');
      return;
    }
    
    if (!address.region || address.region.length === 0) {
      util.showToast('Please select region');
      return;
    }
    
    if (!address.detail) {
      util.showToast('Please enter detailed address');
      return;
    }

    wx.showLoading({ title: 'Saving...' });
    
    setTimeout(() => {
      wx.hideLoading();
      
      let addressList = wx.getStorageSync('mockAddressList') || [];
      
      if (this.data.addressId) {
        addressList = addressList.map(item => {
          if (item.id == this.data.addressId) {
            return { ...item, ...address };
          }
          if (address.isDefault) {
            return { ...item, isDefault: false };
          }
          return item;
        });
      } else {
        const newId = addressList.length > 0 ? Math.max(...addressList.map(item => item.id)) + 1 : 1;
        if (address.isDefault) {
          addressList = addressList.map(item => ({ ...item, isDefault: false }));
        }
        addressList.push({
          id: newId,
          ...address
        });
      }
      
      wx.setStorageSync('mockAddressList', addressList);
      util.showSuccess('Saved successfully');
      
      wx.navigateBack();
    }, 800);
  },

  async deleteAddress() {
    const confirm = await util.showConfirm('Delete this address?', 'Delete Address');
    if (!confirm) return;

    try {
      let addressList = wx.getStorageSync('mockAddressList') || [];
      addressList = addressList.filter(item => item.id != this.data.addressId);
      wx.setStorageSync('mockAddressList', addressList);
      util.showSuccess('Deleted');
      wx.navigateBack();
    } catch (error) {
      console.error('Delete address failed:', error);
    }
  }
});
