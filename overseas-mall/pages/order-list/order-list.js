const { get, post } = require('../../utils/request.js');
const api = require('../../utils/api.js');
const util = require('../../utils/util.js');

Page({
  data: {
    activeTab: 'all',
    orderList: [],
    page: 1,
    pageSize: 10,
    loading: false,
    noMore: false
  },

  onLoad(options) {
    const status = options.status || 'all';
    this.setData({ activeTab: status });
    this.loadOrders();
  },



  onTabChange(e) {
    const tab = e.currentTarget.dataset.name;

    this.setData({
      activeTab: tab,
      orderList: [],
      page: 1,
      noMore: false
    });

    this.loadOrders();
  },

  generateMockOrders() {
    const productImages = [
      '/assets/images/product-1.jpg',
      '/assets/images/product-2.jpg',
      '/assets/images/product-3.jpg',
      '/assets/images/product-4.jpg'
    ];
    const productNames = [
      'Wireless Bluetooth Headphones',
      'Smart Watch Series 5',
      'Cotton Casual T-Shirt',
      'Leather Wallet for Men',
      'Yoga Mat Non-Slip'
    ];
    const statuses = ['pending', 'paid', 'shipped', 'completed', 'cancelled'];
    
    const orders = [];
    
    for (let i = 0; i < 12; i++) {
      const status = statuses[i % statuses.length];
      const goodsCount = Math.floor(Math.random() * 3) + 1;
      const goods = [];
      
      for (let j = 0; j < goodsCount; j++) {
        goods.push({
          id: j + 1,
          name: productNames[(i + j) % productNames.length],
          image: productImages[(i + j) % productImages.length],
          price: (Math.random() * 100 + 20).toFixed(2),
          quantity: Math.floor(Math.random() * 2) + 1
        });
      }
      
      const totalAmount = goods.reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0);
      
      orders.push({
        id: i + 1,
        orderNo: 'ON' + Date.now() + String(i).padStart(4, '0'),
        status: status,
        goods: goods,
        goodsCount: goodsCount,
        totalAmount: totalAmount.toFixed(2),
        createTime: this.getRandomDate(i)
      });
    }
    
    return orders;
  },

  getRandomDate(daysAgo) {
    const now = new Date();
    now.setDate(now.getDate() - daysAgo);
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  },

  async loadOrders() {
    if (this.data.loading) return;

    this.setData({ loading: true });

    try {
      await new Promise(resolve => setTimeout(resolve, 300));

      let allOrders = wx.getStorageSync('mockOrders') || [];
      
      if (allOrders.length === 0) {
        allOrders = this.generateMockOrders();
        wx.setStorageSync('mockOrders', allOrders);
      }
      
      let list = allOrders;
      
      if (this.data.activeTab !== 'all') {
        list = allOrders.filter(item => item.status === this.data.activeTab);
      }

      const statusMap = {
        pending: 'Pending Payment',
        paid: 'Paid',
        shipped: 'Shipped',
        completed: 'Completed',
        cancelled: 'Cancelled',
        refund: 'Refund'
      };

      const processedList = list.map(item => ({
        ...item,
        goods: item.items || item.goods,
        goodsCount: (item.items || item.goods || []).length,
        totalAmount: item.totalPrice,
        statusText: statusMap[item.status] || item.status
      }));

      const pageSize = this.data.pageSize;
      const startIndex = (this.data.page - 1) * pageSize;
      const paginatedList = processedList.slice(startIndex, startIndex + pageSize);

      const orderList = this.data.page === 1 
        ? paginatedList
        : [...this.data.orderList, ...paginatedList];

      this.setData({
        orderList,
        loading: false,
        noMore: startIndex + pageSize >= processedList.length
      });
    } catch (error) {
      console.error('Load orders failed:', error);
      this.setData({ 
        loading: false,
        orderList: [],
        noMore: true
      });
    }
  },

  async loadMoreOrders() {
    if (this.data.noMore || this.data.loading) return;

    this.setData({ page: this.data.page + 1 });
    await this.loadOrders();
  },

  navigateToDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: `/pages/order-detail/order-detail?id=${id}` });
  },

  async cancelOrder(e) {
    const id = e.currentTarget.dataset.id;

    const confirm = await util.showConfirm('Are you sure to cancel this order?', 'Cancel Order');
    if (!confirm) return;

    try {
      let orders = wx.getStorageSync('mockOrders') || [];
      orders = orders.map(item => {
        if (item.id == id) {
          return { ...item, status: 'cancelled' };
        }
        return item;
      });
      wx.setStorageSync('mockOrders', orders);

      util.showSuccess('Order cancelled');
      this.refreshOrders();
    } catch (error) {
      console.error('Cancel order failed:', error);
    }
  },

  async payOrder(e) {
    const id = e.currentTarget.dataset.id;

    try {
      wx.showLoading({ title: 'Processing...' });
      
      setTimeout(() => {
        wx.hideLoading();
        
        let orders = wx.getStorageSync('mockOrders') || [];
        orders = orders.map(item => {
          if (item.id == id) {
            return { ...item, status: 'paid', payTime: new Date().toISOString() };
          }
          return item;
        });
        wx.setStorageSync('mockOrders', orders);
        
        util.showSuccess('Payment successful');
        this.refreshOrders();
      }, 1000);
    } catch (error) {
      wx.hideLoading();
      console.error('Pay order failed:', error);
      util.showError('Payment failed');
    }
  },

  async confirmReceive(e) {
    const id = e.currentTarget.dataset.id;

    const confirm = await util.showConfirm('Confirm receipt of goods?', 'Confirm Receipt');
    if (!confirm) return;

    try {
      let orders = wx.getStorageSync('mockOrders') || [];
      orders = orders.map(item => {
        if (item.id == id) {
          return { ...item, status: 'completed', completeTime: new Date().toISOString() };
        }
        return item;
      });
      wx.setStorageSync('mockOrders', orders);

      util.showSuccess('Confirmed');
      this.refreshOrders();
    } catch (error) {
      console.error('Confirm order failed:', error);
    }
  },

  writeReview(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: `/pages/review/review?orderId=${id}` });
  },

  async reorder(e) {
    const id = e.currentTarget.dataset.id;

    try {
      const res = await post('/order/reorder', { orderId: id });

      wx.setStorageSync('checkoutData', {
        items: res.items
      });

      wx.navigateTo({ url: '/pages/checkout/checkout' });
    } catch (error) {
      console.error('Reorder failed:', error);
    }
  },

  async applyRefund(e) {
    const id = e.currentTarget.dataset.id;

    const confirm = await util.showConfirm('Are you sure you want to apply for a refund?', 'Apply Refund');
    if (!confirm) return;

    try {
      await post(api.order.refund, { orderId: id });

      util.showSuccess('Refund application submitted');
      this.refreshOrders();
    } catch (error) {
      console.error('Apply refund failed:', error);
      util.showError('Refund application failed');
    }
  },

  refreshOrders() {
    this.setData({
      orderList: [],
      page: 1,
      noMore: false
    });
    this.loadOrders();
  },

  goShopping() {
    wx.switchTab({ url: '/pages/index/index' });
  },

  onPullDownRefresh() {
    this.setData({ page: 1, noMore: false, orderList: [] });
    this.loadOrders().then(() => {
      wx.stopPullDownRefresh();
    });
  }
});
