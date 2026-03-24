Page({
  data: {
    currentPage: 0,
    guidePages: [
      {
        id: 0,
        title: '全球精选商品',
        description: '汇聚全球优质好物，品质保障放心购',
        image: 'https://picsum.photos/400/400?random=1',
        color: '#FF6B4A'
      },
      {
        id: 1,
        title: '极速物流配送',
        description: '全球快递网络，快速送达您手中',
        image: 'https://picsum.photos/400/400?random=2',
        color: '#10B981'
      },
      {
        id: 2,
        title: '安全支付保障',
        description: '多种支付方式，交易安全有保障',
        image: 'https://picsum.photos/400/400?random=3',
        color: '#3B82F6'
      },
      {
        id: 3,
        title: '专属会员权益',
        description: 'VIP会员专享优惠，更多惊喜等你发现',
        image: 'https://picsum.photos/400/400?random=4',
        color: '#8B5CF6'
      }
    ]
  },

  onSwiperChange(e) {
    this.setData({
      currentPage: e.detail.current
    });
  },

  goToNext() {
    const nextPage = this.data.currentPage + 1;
    if (nextPage < this.data.guidePages.length) {
      this.setData({ currentPage: nextPage });
    }
  },

  skipGuide() {
    this.completeGuide();
  },

  startUsing() {
    this.completeGuide();
  },

  completeGuide() {
    wx.setStorageSync('hasLaunched', true);
    wx.switchTab({
      url: '/pages/index/index'
    });
  }
});