const { get, post } = require('../../utils/request.js');
const api = require('../../utils/api.js');
const util = require('../../utils/util.js');

Page({
  data: {
    goodsList: [],
    address: null,
    selectedCoupon: null,
    selectedPayment: 'wechat',
    remark: '',
    subtotal: '0.00',
    shipping: 0,
    totalPrice: '0.00'
  },

  onLoad() {
    this.loadCheckoutData();
    this.loadDefaultAddress();
    this.loadSelectedCoupon();
  },

  onShow() {
    this.loadDefaultAddress();
    this.loadSelectedCoupon();
  },
  
  loadSelectedCoupon() {
    const selectedCoupon = wx.getStorageSync('selectedCoupon');
    if (selectedCoupon) {
      this.setData({ selectedCoupon });
      this.calculatePrice();
    }
  },

  loadCheckoutData() {
    const checkoutData = wx.getStorageSync('checkoutData');
    if (!checkoutData || !checkoutData.items || checkoutData.items.length === 0) {
      util.showToast('No items to checkout');
      setTimeout(() => {
        wx.navigateBack();
      }, 1500);
      return;
    }

    const processedItems = checkoutData.items.map(item => ({
      ...item,
      price: parseFloat(item.price) || 0
    }));

    this.setData({ goodsList: processedItems });
    this.calculatePrice();
  },

  async loadDefaultAddress() {
    try {
      let addresses = wx.getStorageSync('mockAddressList');
      
      if (!addresses || addresses.length === 0) {
        addresses = [
          {
            id: 1,
            name: 'John Doe',
            phone: '13800138000',
            province: 'California',
            city: 'Los Angeles',
            district: 'Downtown',
            detail: '123 Main Street, Apt 4B',
            isDefault: true
          }
        ];
        wx.setStorageSync('mockAddressList', addresses);
      }
      
      const defaultAddress = addresses.find(item => item.isDefault) || addresses[0];
      this.setData({ address: defaultAddress });
    } catch (error) {
      console.error('Load address failed:', error);
    }
  },

  calculatePrice() {
    const subtotal = this.data.goodsList.reduce((sum, item) => {
      return sum + item.price * item.quantity;
    }, 0);

    const shipping = subtotal >= 99 ? 0 : 10;
    const discount = this.data.selectedCoupon ? this.data.selectedCoupon.discount : 0;
    const total = Math.max(0, subtotal + shipping - discount);

    this.setData({
      subtotal: subtotal.toFixed(2),
      shipping,
      totalPrice: total.toFixed(2)
    });
  },

  selectAddress() {
    wx.navigateTo({ url: '/pages/address-list/address-list?select=1' });
  },

  selectCoupon() {
    const subtotal = this.data.goodsList.reduce((sum, item) => {
      return sum + item.price * item.quantity;
    }, 0);
    wx.navigateTo({ 
      url: `/pages/coupons/coupons?select=1&subtotal=${subtotal}` 
    });
  },

  removeCoupon() {
    wx.removeStorageSync('selectedCoupon');
    this.setData({ selectedCoupon: null });
    this.calculatePrice();
    util.showSuccess('Coupon removed');
  },

  onRemarkInput(e) {
    this.setData({ remark: e.detail.value });
  },

  selectPayment(e) {
    const type = e.currentTarget.dataset.type;
    this.setData({ selectedPayment: type });
  },

  goBack() {
    wx.navigateBack();
  },

  async submitOrder() {
    if (!this.data.address) {
      util.showToast('Please add shipping address');
      return;
    }

    if (this.data.goodsList.length === 0) {
      util.showToast('No items to checkout');
      return;
    }

    try {
      wx.showLoading({ title: 'Submitting...' });

      setTimeout(() => {
        wx.hideLoading();

        const orderId = Date.now();
        const orderData = {
          id: orderId,
          orderNo: 'ORD' + orderId,
          address: this.data.address,
          coupon: this.data.selectedCoupon,
          paymentMethod: this.data.selectedPayment,
          remark: this.data.remark,
          items: this.data.goodsList,
          subtotal: this.data.subtotal,
          shipping: this.data.shipping,
          totalPrice: this.data.totalPrice,
          status: 'pending',
          createTime: new Date().toISOString()
        };

        let orders = wx.getStorageSync('mockOrders') || [];
        orders.unshift(orderData);
        wx.setStorageSync('mockOrders', orders);

        let cartList = wx.getStorageSync('mockCartList') || [];
        const selectedIds = this.data.goodsList.map(item => item.id);
        cartList = cartList.filter(item => !selectedIds.includes(item.id));
        wx.setStorageSync('mockCartList', cartList);

        wx.setStorageSync('checkoutData', null);
        wx.setStorageSync('selectedCoupon', null);

        util.showSuccess('Order submitted!');
        
        setTimeout(() => {
          wx.redirectTo({ url: `/pages/order-detail/order-detail?id=${orderId}` });
        }, 1000);
      }, 1000);
    } catch (error) {
      wx.hideLoading();
      console.error('Submit order failed:', error);
      util.showToast('Submit failed, please try again');
    }
  }
});
