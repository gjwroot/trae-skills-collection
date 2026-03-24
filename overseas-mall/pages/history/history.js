const util = require('../../utils/util.js');
const historyManager = require('../../utils/history.js');

Page({
  data: {
    historyList: [],
    viewStats: null,
    topCategories: [],
    viewTrend: [],
    showAnalysis: true
  },

  onLoad() {
    this.loadHistory();
    this.loadAnalysis();
  },

  onShow() {
    this.loadHistory();
    this.loadAnalysis();
  },

  loadHistory() {
    const history = historyManager.getHistory();
    this.setData({ historyList: history });
  },

  loadAnalysis() {
    const viewStats = historyManager.getViewStats();
    const topCategories = historyManager.getTopCategories(5);
    const viewTrend = historyManager.getViewTrend(7);
    
    this.setData({
      viewStats,
      topCategories,
      viewTrend
    });
  },

  toggleAnalysis() {
    this.setData({
      showAnalysis: !this.data.showAnalysis
    });
  },

  async clearHistory() {
    wx.showModal({
      title: 'Clear History',
      content: 'Clear all browse history?',
      success: (res) => {
        if (res.confirm) {
          historyManager.clearHistory();
          this.setData({ historyList: [] });
          this.loadAnalysis();
          util.showSuccess('Cleared');
        }
      }
    });
  },

  navigateToDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: `/pages/goods-detail/goods-detail?id=${id}` });
  },

  goShopping() {
    wx.switchTab({ url: '/pages/index/index' });
  },

  onPullDownRefresh() {
    this.loadHistory();
    this.loadAnalysis();
    wx.stopPullDownRefresh();
  }
});
