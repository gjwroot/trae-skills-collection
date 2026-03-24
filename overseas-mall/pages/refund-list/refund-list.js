const util = require('../../utils/util.js');

Page({
  data: {
    activeTab: 'all',
    tabCounts: {
      all: 0,
      pending: 0,
      processing: 0,
      completed: 0
    },
    refundList: [],
    page: 1,
    pageSize: 10,
    loading: false,
    noMore: false
  },

  onLoad() {
    wx.setNavigationBarTitle({
      title: 'My Refunds'
    });
    this.loadRefundList();
  },

  onShow() {
    this.loadRefundList();
  },

  onPullDownRefresh() {
    this.setData({
      page: 1,
      noMore: false
    });
    this.loadRefundList().then(() => {
      wx.stopPullDownRefresh();
    });
  },

  onReachBottom() {
    if (!this.data.noMore && !this.data.loading) {
      this.loadMore();
    }
  },

  switchTab(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({
      activeTab: tab,
      page: 1,
      noMore: false,
      refundList: []
    });
    this.loadRefundList();
  },

  generateMockRefunds() {
    const statusMap = {
      pending: { text: 'Pending Review', class: 'pending' },
      processing: { text: 'Processing', class: 'processing' },
      approved: { text: 'Approved', class: 'approved' },
      completed: { text: 'Completed', class: 'completed' },
      rejected: { text: 'Rejected', class: 'rejected' },
      cancelled: { text: 'Cancelled', class: 'cancelled' }
    };

    const typeMap = {
      refund: 'Refund Only',
      return: 'Return & Refund'
    };

    const goodsNames = [
      'Wireless Bluetooth Headphones',
      'Smart Watch Series 5',
      'Cotton Casual T-Shirt',
      'Leather Wallet for Men',
      'Yoga Mat Non-Slip'
    ];

    const goodsSpecs = [
      'Color: Black',
      'Size: M',
      'Color: Blue, Size: L',
      'Style: Classic'
    ];

    const refunds = [];
    const statuses = ['pending', 'processing', 'completed', 'completed', 'rejected'];

    for (let i = 0; i < 8; i++) {
      const status = statuses[i % statuses.length];
      const type = Math.random() > 0.5 ? 'refund' : 'return';
      const amount = (Math.random() * 100 + 20).toFixed(2);

      refunds.push({
        id: i + 1,
        refundNo: 'RF' + Date.now() + String(i).padStart(4, '0'),
        status: status,
        statusText: statusMap[status].text,
        type: type,
        typeText: typeMap[type],
        goodsName: goodsNames[i % goodsNames.length],
        goodsImage: `/assets/images/product-${(i % 8) + 1}.jpg`,
        goodsSpec: goodsSpecs[i % goodsSpecs.length],
        amount: amount,
        applyTime: this.getRandomDate(),
        goodsId: i + 1
      });
    }

    return refunds;
  },

  getRandomDate() {
    const now = new Date();
    const days = Math.floor(Math.random() * 30);
    now.setDate(now.getDate() - days);
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  },

  async loadRefundList() {
    return new Promise((resolve) => {
      this.setData({ loading: true });

      try {
        setTimeout(() => {
          const allRefunds = this.generateMockRefunds();
          
          let filteredRefunds = allRefunds;
          if (this.data.activeTab !== 'all') {
            filteredRefunds = allRefunds.filter(item => item.status === this.data.activeTab);
          }

          const counts = {
            all: allRefunds.length,
            pending: allRefunds.filter(r => r.status === 'pending').length,
            processing: allRefunds.filter(r => r.status === 'processing').length,
            completed: allRefunds.filter(r => r.status === 'completed' || r.status === 'approved').length
          };

          this.setData({
            refundList: filteredRefunds,
            tabCounts: counts,
            loading: false
          });
          resolve();
        }, 500);
      } catch (error) {
        console.error('Load refund list failed:', error);
        this.setData({ loading: false });
        resolve();
      }
    });
  },

  loadMore() {
    if (this.data.noMore) return;
    
    this.setData({ loading: true });
    
    setTimeout(() => {
      this.setData({
        loading: false,
        noMore: true
      });
    }, 800);
  },

  goToDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/refund-detail/refund-detail?refundId=${id}`
    });
  },

  cancelRefund(e) {
    const id = e.currentTarget.dataset.id;
    
    wx.showModal({
      title: 'Cancel Refund',
      content: 'Are you sure you want to cancel this refund application?',
      success: (res) => {
        if (res.confirm) {
          wx.showLoading({ title: 'Canceling...' });
          
          setTimeout(() => {
            wx.hideLoading();
            util.showSuccess('Cancelled');
            this.loadRefundList();
          }, 800);
        }
      }
    });
  }
});
