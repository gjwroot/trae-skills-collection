const { get, post, del } = require('../../utils/request.js');
const api = require('../../utils/api.js');
const util = require('../../utils/util.js');

Page({
  data: {
    addressList: [],
    isSelect: false
  },

  onLoad(options) {
    this.setData({ isSelect: options.select === '1' });
    this.loadAddressList();
  },

  onShow() {
    this.loadAddressList();
  },

  onPullDownRefresh() {
    this.loadAddressList().then(() => {
      wx.stopPullDownRefresh();
    });
  },

  generateMockAddresses() {
    return [
      {
        id: 1,
        name: 'John Doe',
        phone: '13800138000',
        province: 'California',
        city: 'Los Angeles',
        district: 'Downtown',
        detail: '123 Main Street, Apt 4B',
        isDefault: true
      },
      {
        id: 2,
        name: 'Jane Smith',
        phone: '13900139000',
        province: 'New York',
        city: 'New York',
        district: 'Manhattan',
        detail: '456 Park Avenue, Floor 10',
        isDefault: false
      },
      {
        id: 3,
        name: 'Mike Johnson',
        phone: '13700137000',
        province: 'Texas',
        city: 'Houston',
        district: 'Midtown',
        detail: '789 Oak Street',
        isDefault: false
      }
    ];
  },

  async loadAddressList() {
    return new Promise((resolve) => {
      try {
        let addressList = wx.getStorageSync('mockAddressList');
        
        if (!addressList || addressList.length === 0) {
          addressList = this.generateMockAddresses();
          wx.setStorageSync('mockAddressList', addressList);
        }
        
        this.setData({ addressList });
        resolve();
      } catch (error) {
        console.error('Load address failed:', error);
        resolve();
      }
    });
  },

  saveAddressList() {
    wx.setStorageSync('mockAddressList', this.data.addressList);
  },

  selectAddress(e) {
    if (!this.data.isSelect) return;
    
    const id = e.currentTarget.dataset.id;
    const address = this.data.addressList.find(item => item.id === id);
    
    const pages = getCurrentPages();
    const prevPage = pages[pages.length - 2];
    
    if (prevPage) {
      prevPage.setData({ address });
    }
    
    wx.navigateBack();
  },

  async setDefault(e) {
    const id = e.currentTarget.dataset.id;
    const isDefault = e.currentTarget.dataset.isDefault;
    
    if (isDefault) return;
    
    try {
      const addressList = this.data.addressList.map(item => ({
        ...item,
        isDefault: item.id === id
      }));
      
      this.setData({ addressList });
      this.saveAddressList();
      util.showSuccess('Set as default');
    } catch (error) {
      console.error('Set default failed:', error);
    }
  },

  editAddress(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: `/pages/address-edit/address-edit?id=${id}` });
  },

  async deleteAddress(e) {
    const id = e.currentTarget.dataset.id;
    
    const confirm = await util.showConfirm('Delete this address?', 'Delete Address');
    if (!confirm) return;
    
    try {
      const addressList = this.data.addressList.filter(item => item.id !== id);
      this.setData({ addressList });
      this.saveAddressList();
      
      util.showSuccess('Deleted');
    } catch (error) {
      console.error('Delete address failed:', error);
    }
  },

  addAddress() {
    wx.navigateTo({ url: '/pages/address-edit/address-edit' });
  }
});
