const { get, post } = require('../../utils/request.js');
const api = require('../../utils/api.js');
const util = require('../../utils/util.js');
const reviewReminder = require('../../utils/review-reminder.js');

Page({
  data: {
    orderId: '',
    orderInfo: {
      address: {}
    },
    statusIcon: 'paid',
    statusDesc: '',
    logisticsList: []
  },

  onLoad(options) {
    this.setData({ orderId: options.id });
    this.loadOrderDetail();
  },

  async loadOrderDetail() {
    try {
      const orders = wx.getStorageSync('mockOrders') || [];
      let orderInfo = orders.find(item => item.id == this.data.orderId);
      
      if (!orderInfo) {
        util.showToast('Order not found');
        setTimeout(() => wx.navigateBack(), 1500);
        return;
      }

      const statusMap = {
        pending: { text: 'Pending Payment', icon: 'paid', desc: 'Please complete payment within 30 minutes' },
        paid: { text: 'Paid', icon: 'paid', desc: 'Order is being processed' },
        shipped: { text: 'Shipped', icon: 'logistics', desc: 'Package is on the way' },
        completed: { text: 'Completed', icon: 'passed', desc: 'Order completed' },
        cancelled: { text: 'Cancelled', icon: 'cross', desc: 'Order has been cancelled' }
      };

      const statusInfo = statusMap[orderInfo.status] || statusMap.pending;

      const logisticsList = this.generateLogisticsData(orderInfo.status);

      this.setData({
        orderInfo: {
          ...orderInfo,
          goods: orderInfo.items,
          statusText: statusInfo.text,
          shopName: 'Overseas Mall'
        },
        statusIcon: statusInfo.icon,
        statusDesc: statusInfo.desc,
        logisticsList
      });
    } catch (error) {
      console.error('Load order detail failed:', error);
    }
  },

  copyOrderNo() {
    wx.setClipboardData({
      data: this.data.orderInfo.orderNo,
      success: () => {
        util.showSuccess('Copied');
      }
    });
  },

  async cancelOrder() {
    const confirm = await util.showConfirm('Are you sure to cancel this order?', 'Cancel Order');
    if (!confirm) return;

    try {
      let orders = wx.getStorageSync('mockOrders') || [];
      orders = orders.map(item => {
        if (item.id == this.data.orderId) {
          return { ...item, status: 'cancelled' };
        }
        return item;
      });
      wx.setStorageSync('mockOrders', orders);
      
      util.showSuccess('Order cancelled');
      this.loadOrderDetail();
    } catch (error) {
      console.error('Cancel order failed:', error);
    }
  },

  async payOrder() {
    try {
      wx.showLoading({ title: 'Processing...' });
      
      setTimeout(() => {
        wx.hideLoading();
        
        let orders = wx.getStorageSync('mockOrders') || [];
        orders = orders.map(item => {
          if (item.id == this.data.orderId) {
            return { ...item, status: 'paid', payTime: new Date().toISOString() };
          }
          return item;
        });
        wx.setStorageSync('mockOrders', orders);
        
        util.showSuccess('Payment successful');
        this.loadOrderDetail();
      }, 1000);
    } catch (error) {
      wx.hideLoading();
      console.error('Pay order failed:', error);
    }
  },

  async confirmReceive() {
    const confirm = await util.showConfirm('Confirm receipt of goods?', 'Confirm Receipt');
    if (!confirm) return;

    try {
      let orders = wx.getStorageSync('mockOrders') || [];
      orders = orders.map(item => {
        if (item.id == this.data.orderId) {
          return { ...item, status: 'completed', completeTime: new Date().toISOString() };
        }
        return item;
      });
      wx.setStorageSync('mockOrders', orders);
      
      reviewReminder.addReminder(this.data.orderId, this.data.orderInfo.goods, 0);
      
      util.showSuccess('Confirmed');
      this.loadOrderDetail();
    } catch (error) {
      console.error('Confirm order failed:', error);
    }
  },

  writeReview() {
    const goods = this.data.orderInfo.goods;
    if (goods && goods.length > 0) {
      wx.navigateTo({
        url: `/pages/goods-review/goods-review?id=${goods[0].id}&orderId=${this.data.orderId}`
      });
    }
  },

  generateLogisticsData(status) {
    const allLogistics = [
      {
        time: '2024-01-20 14:30',
        desc: 'Package delivered, signed by recipient'
      },
      {
        time: '2024-01-20 09:00',
        desc: 'Out for delivery'
      },
      {
        time: '2024-01-19 18:00',
        desc: 'Arrived at local distribution center'
      },
      {
        time: '2024-01-18 08:00',
        desc: 'In transit to destination city'
      },
      {
        time: '2024-01-17 15:00',
        desc: 'Package picked up by courier'
      },
      {
        time: '2024-01-17 10:00',
        desc: 'Order shipped, tracking number: SF1234567890'
      }
    ];

    if (status === 'shipped' || status === 'completed') {
      if (status === 'shipped') {
        return allLogistics.slice(2);
      }
      return allLogistics;
    }

    return [];
  },

  applyRefund() {
    const token = wx.getStorageSync('token');
    if (!token) {
      wx.navigateTo({ url: '/pages/login/login' });
      return;
    }
    
    wx.navigateTo({
      url: `/pages/refund-apply/refund-apply?orderId=${this.data.orderId}`
    });
  }
});
