const compareManager = require('../../utils/compare-manager.js');
const util = require('../../utils/util.js');

Page({
  data: {
    compareList: [],
    comparisonData: null,
    compareFeatures: [
      { key: 'price', label: '价格' },
      { key: 'sales', label: '销量' },
      { key: 'ratings', label: '评分' },
      { key: 'brand', label: '品牌' },
      { key: 'origin', label: '产地' },
      { key: 'warranty', label: '保修' },
      { key: 'delivery', label: '配送' }
    ]
  },

  onLoad(options) {
    this.loadCompareList();
  },

  onShow() {
    this.loadCompareList();
  },

  loadCompareList() {
    const compareList = compareManager.getCompareList();
    const comparisonData = compareManager.generateComparisonData();
    
    this.setData({ 
      compareList,
      comparisonData
    });
  },

  removeFromCompare(e) {
    const id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '移除对比',
      content: '确定要从对比列表中移除该商品吗？',
      success: (res) => {
        if (res.confirm) {
          const result = compareManager.removeFromCompare(id);
          if (result.success) {
            util.showSuccess(result.message);
            this.loadCompareList();
          }
        }
      }
    });
  },

  clearCompareList() {
    if (this.data.compareList.length === 0) {
      util.showToast('对比列表为空');
      return;
    }
    
    wx.showModal({
      title: '清空对比',
      content: '确定要清空对比列表吗？',
      success: (res) => {
        if (res.confirm) {
          const result = compareManager.clearCompareList();
          if (result.success) {
            util.showSuccess(result.message);
            this.loadCompareList();
          }
        }
      }
    });
  },

  getFeatureValue(item, featureKey) {
    return item[featureKey] || (item.specs && item.specs[featureKey]) || '-';
  },

  getBestValueIndex(featureKey) {
    if (this.data.compareList.length < 2) return -1;
    
    const values = this.data.compareList.map(item => {
      const value = item[featureKey];
      if (featureKey === 'price') {
        return parseFloat(value) || 99999;
      } else if (featureKey === 'sales' || featureKey === 'ratings') {
        return parseFloat(value) || 0;
      }
      return 0;
    });
    
    if (featureKey === 'price') {
      return values.indexOf(Math.min(...values));
    } else if (featureKey === 'sales' || featureKey === 'ratings') {
      return values.indexOf(Math.max(...values));
    }
    
    return -1;
  },

  navigateToDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: `/pages/goods-detail/goods-detail?id=${id}` });
  },

  addToCart(e) {
    const id = e.currentTarget.dataset.id;
    util.showToast('已加入购物车');
  },

  goAddMore() {
    wx.switchTab({ url: '/pages/index/index' });
  }
});