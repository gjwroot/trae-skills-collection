const util = require('../../utils/util.js');

Page({
  data: {
    refundId: '',
    refundInfo: {},
    statusIcon: 'clock-o',
    timeline: []
  },

  onLoad(options) {
    if (options.refundId) {
      this.setData({ refundId: options.refundId });
      this.loadRefundDetail(options.refundId);
    }
    
    wx.setNavigationBarTitle({
      title: 'Refund Detail'
    });
  },

  loadRefundDetail(refundId) {
    const mockRefundInfo = {
      id: refundId,
      refundNo: 'RF' + Date.now(),
      type: 'refund',
      typeText: 'Refund Only',
      status: 'processing',
      statusText: 'Processing',
      statusDesc: 'Your refund is being processed, please wait',
      reason: 'Quality issues',
      amount: '59.99',
      applyTime: '2026-03-08 10:30',
      goodsName: 'Wireless Bluetooth Headphones',
      goodsImage: '/assets/images/product-1.jpg',
      goodsSpec: 'Color: Black',
      goodsPrice: '59.99',
      quantity: 1
    };

    const mockTimeline = [
      {
        title: 'Application Submitted',
        time: '2026-03-08 10:30',
        desc: 'Your refund application has been submitted successfully',
        completed: true
      },
      {
        title: 'Reviewing',
        time: '2026-03-08 11:00',
        desc: 'Customer service is reviewing your application',
        completed: true
      },
      {
        title: 'Refund Approved',
        time: 'Pending',
        desc: '',
        completed: false
      },
      {
        title: 'Refund Completed',
        time: 'Pending',
        desc: 'Funds will be returned to your original payment method',
        completed: false
      }
    ];

    let statusIcon = 'clock-o';
    if (mockRefundInfo.status === 'approved') {
      statusIcon = 'success';
    } else if (mockRefundInfo.status === 'rejected') {
      statusIcon = 'close';
    }

    this.setData({
      refundInfo: mockRefundInfo,
      timeline: mockTimeline,
      statusIcon
    });
  },

  viewAllRefunds() {
    wx.redirectTo({
      url: '/pages/refund-list/refund-list'
    });
  },

  cancelRefund() {
    wx.showModal({
      title: 'Cancel Application',
      content: 'Are you sure you want to cancel this refund application?',
      success: (res) => {
        if (res.confirm) {
          wx.showLoading({ title: 'Canceling...' });
          
          setTimeout(() => {
            wx.hideLoading();
            util.showSuccess('Cancelled');
            
            setTimeout(() => {
              wx.redirectTo({
                url: '/pages/refund-list/refund-list'
              });
            }, 1500);
          }, 800);
        }
      }
    });
  }
});
