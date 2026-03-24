const store = require('../../utils/store.js');

Page({
  data: {
    addresses: []
  },

  onLoad() {
    this.loadAddresses();
  },

  onShow() {
    this.loadAddresses();
  },

  loadAddresses() {
    this.setData({
      addresses: store.getAddresses()
    });
  },

  selectAddress(e) {
    const id = e.currentTarget.dataset.id;
    const pages = getCurrentPages();
    const prevPage = pages[pages.length - 2];
    if (prevPage) {
      const address = this.data.addresses.find(a => a.id === id);
      prevPage.setData({ selectedAddress: address });
      wx.navigateBack();
    }
  },

  setDefault(e) {
    const id = e.currentTarget.dataset.id;
    store.setDefaultAddress(id);
    this.loadAddresses();
    wx.showToast({
      title: '已设为默认',
      icon: 'success'
    });
  },

  editAddress(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/address-edit/address-edit?id=${id}`
    });
  },

  deleteAddress(e) {
    const id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这个地址吗？',
      success: (res) => {
        if (res.confirm) {
          store.deleteAddress(id);
          this.loadAddresses();
          wx.showToast({
            title: '已删除',
            icon: 'success'
          });
        }
      }
    });
  },

  addAddress() {
    wx.navigateTo({
      url: '/pages/address-edit/address-edit'
    });
  }
});
