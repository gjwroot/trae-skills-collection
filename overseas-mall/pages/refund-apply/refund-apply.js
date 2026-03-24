const util = require('../../utils/util.js');

Page({
  data: {
    orderId: '',
    orderInfo: {
      goods: []
    },
    refundType: 'refund',
    refundReasons: [
      'Quality issue',
      'Wrong item received',
      'Item not as described',
      'No longer needed',
      'Size issue',
      'Color issue',
      'Other reason'
    ],
    selectedReason: null,
    refundAmount: '',
    maxRefundAmount: '0.00',
    refundDesc: '',
    uploadImages: [],
    canSubmit: false
  },

  onLoad(options) {
    this.setData({ orderId: options.id });
    this.loadOrderInfo();
  },

  async loadOrderInfo() {
    try {
      const orders = wx.getStorageSync('mockOrders') || [];
      const orderInfo = orders.find(item => item.id == this.data.orderId);
      
      if (!orderInfo) {
        util.showToast('Order not found');
        setTimeout(() => wx.navigateBack(), 1500);
        return;
      }

      const maxRefundAmount = parseFloat(orderInfo.totalPrice || 0).toFixed(2);

      this.setData({
        orderInfo: {
          ...orderInfo,
          goods: orderInfo.items
        },
        maxRefundAmount,
        refundAmount: maxRefundAmount
      });

      this.checkCanSubmit();
    } catch (error) {
      console.error('Load order info failed:', error);
    }
  },

  selectRefundType(e) {
    const type = e.currentTarget.dataset.type;
    this.setData({ refundType: type });
    this.checkCanSubmit();
  },

  selectReason(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({ selectedReason: index });
    this.checkCanSubmit();
  },

  onAmountInput(e) {
    let value = e.detail.value;
    
    if (value) {
      const maxAmount = parseFloat(this.data.maxRefundAmount);
      let amount = parseFloat(value);
      
      if (amount > maxAmount) {
        amount = maxAmount;
        value = amount.toFixed(2);
      }
    }
    
    this.setData({ refundAmount: value });
    this.checkCanSubmit();
  },

  onDescInput(e) {
    this.setData({ refundDesc: e.detail.value });
  },

  chooseImage() {
    const remainingCount = 6 - this.data.uploadImages.length;
    
    wx.chooseImage({
      count: remainingCount,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const newImages = [...this.data.uploadImages, ...res.tempFilePaths];
        this.setData({ uploadImages: newImages });
      }
    });
  },

  deleteImage(e) {
    const index = e.currentTarget.dataset.index;
    const images = [...this.data.uploadImages];
    images.splice(index, 1);
    this.setData({ uploadImages: images });
  },

  checkCanSubmit() {
    const { refundType, selectedReason, refundAmount } = this.data;
    const canSubmit = refundType && selectedReason !== null && refundAmount && parseFloat(refundAmount) > 0;
    this.setData({ canSubmit });
  },

  async submitRefund() {
    if (!this.data.canSubmit) return;

    try {
      wx.showLoading({ title: 'Submitting...' });

      setTimeout(() => {
        wx.hideLoading();

        const refundData = {
          id: Date.now(),
          orderId: this.data.orderId,
          refundType: this.data.refundType,
          reason: this.data.refundReasons[this.data.selectedReason],
          amount: this.data.refundAmount,
          description: this.data.refundDesc,
          images: this.data.uploadImages,
          status: 'pending',
          createTime: new Date().toISOString()
        };

        let refunds = wx.getStorageSync('mockRefunds') || [];
        refunds.unshift(refundData);
        wx.setStorageSync('mockRefunds', refunds);

        util.showSuccess('Submitted successfully');
        
        setTimeout(() => {
          wx.navigateBack();
        }, 1500);
      }, 1000);
    } catch (error) {
      wx.hideLoading();
      console.error('Submit refund failed:', error);
      util.showToast('Submit failed');
    }
  }
});
