class RecommendManager {
  constructor() {
    this.historyKey = 'browseHistory';
    this.viewCountKey = 'productViewCounts';
    this.categoryPreferenceKey = 'categoryPreferences';
  }

  recordBrowse(productId, category = 'default') {
    try {
      let history = this.getBrowseHistory();
      
      history = history.filter(item => item.productId !== productId);
      
      history.unshift({
        productId,
        category,
        timestamp: Date.now()
      });
      
      if (history.length > 100) {
        history = history.slice(0, 100);
      }
      
      wx.setStorageSync(this.historyKey, history);
      
      this.incrementViewCount(productId);
      this.updateCategoryPreference(category);
    } catch (error) {
      console.error('Record browse failed:', error);
    }
  }

  getBrowseHistory() {
    try {
      return wx.getStorageSync(this.historyKey) || [];
    } catch (error) {
      console.error('Get browse history failed:', error);
      return [];
    }
  }

  incrementViewCount(productId) {
    try {
      let viewCounts = wx.getStorageSync(this.viewCountKey) || {};
      viewCounts[productId] = (viewCounts[productId] || 0) + 1;
      wx.setStorageSync(this.viewCountKey, viewCounts);
    } catch (error) {
      console.error('Increment view count failed:', error);
    }
  }

  getViewCounts() {
    try {
      return wx.getStorageSync(this.viewCountKey) || {};
    } catch (error) {
      console.error('Get view counts failed:', error);
      return {};
    }
  }

  updateCategoryPreference(category) {
    try {
      let preferences = wx.getStorageSync(this.categoryPreferenceKey) || {};
      preferences[category] = (preferences[category] || 0) + 1;
      wx.setStorageSync(this.categoryPreferenceKey, preferences);
    } catch (error) {
      console.error('Update category preference failed:', error);
    }
  }

  getCategoryPreferences() {
    try {
      return wx.getStorageSync(this.categoryPreferenceKey) || {};
    } catch (error) {
      console.error('Get category preferences failed:', error);
      return {};
    }
  }

  getTopCategories(limit = 3) {
    const preferences = this.getCategoryPreferences();
    const sorted = Object.entries(preferences)
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([category]) => category);
    
    return sorted;
  }

  getRecentBrowsed(limit = 10) {
    const history = this.getBrowseHistory();
    return history.slice(0, limit).map(item => item.productId);
  }

  getRecommendations(productList, options = {}) {
    const { 
      limit = 10, 
      excludeProductIds = [],
      strategy = 'hybrid'
    } = options;

    let recommendations = [];
    const viewCounts = this.getViewCounts();
    const recentBrowsed = this.getRecentBrowsed();
    const topCategories = this.getTopCategories(3);

    switch (strategy) {
      case 'recent':
        recommendations = this.getRecentBasedRecommendations(productList, recentBrowsed, excludeProductIds);
        break;
      case 'popular':
        recommendations = this.getPopularBasedRecommendations(productList, viewCounts, excludeProductIds);
        break;
      case 'category':
        recommendations = this.getCategoryBasedRecommendations(productList, topCategories, excludeProductIds);
        break;
      case 'hybrid':
      default:
        recommendations = this.getHybridRecommendations(
          productList, 
          recentBrowsed, 
          viewCounts, 
          topCategories, 
          excludeProductIds
        );
        break;
    }

    return recommendations.slice(0, limit);
  }

  getRecentBasedRecommendations(productList, recentBrowsed, excludeIds) {
    const recentSet = new Set(recentBrowsed);
    const recentProducts = productList.filter(p => 
      recentSet.has(p.id) && !excludeIds.includes(p.id)
    );
    
    const otherProducts = productList.filter(p => 
      !recentSet.has(p.id) && !excludeIds.includes(p.id)
    );
    
    return [...recentProducts, ...otherProducts];
  }

  getPopularBasedRecommendations(productList, viewCounts, excludeIds) {
    return productList
      .filter(p => !excludeIds.includes(p.id))
      .map(p => ({
        ...p,
        score: viewCounts[p.id] || 0
      }))
      .sort((a, b) => b.score - a.score);
  }

  getCategoryBasedRecommendations(productList, topCategories, excludeIds) {
    const categorySet = new Set(topCategories);
    const categoryProducts = productList.filter(p => 
      categorySet.has(p.category) && !excludeIds.includes(p.id)
    );
    
    const otherProducts = productList.filter(p => 
      !categorySet.has(p.category) && !excludeIds.includes(p.id)
    );
    
    return [...categoryProducts, ...otherProducts];
  }

  getHybridRecommendations(productList, recentBrowsed, viewCounts, topCategories, excludeIds) {
    const excludeSet = new Set(excludeIds);
    const recentSet = new Set(recentBrowsed);
    const categorySet = new Set(topCategories);
    
    const scoredProducts = productList
      .filter(p => !excludeSet.has(p.id))
      .map(p => {
        let score = 0;
        
        if (recentSet.has(p.id)) {
          score += 50;
        }
        
        if (categorySet.has(p.category)) {
          score += 30;
        }
        
        score += (viewCounts[p.id] || 0) * 2;
        
        score += Math.random() * 10;
        
        return { ...p, score };
      })
      .sort((a, b) => b.score - a.score);
    
    return scoredProducts;
  }

  getSimilarProducts(productId, productList, limit = 5) {
    const product = productList.find(p => p.id === productId);
    if (!product) return [];
    
    const category = product.category || 'default';
    
    return productList
      .filter(p => p.id !== productId && (p.category === category || p.tags?.some(tag => product.tags?.includes(tag))))
      .slice(0, limit);
  }

  clearHistory() {
    try {
      wx.removeStorageSync(this.historyKey);
      wx.removeStorageSync(this.viewCountKey);
      wx.removeStorageSync(this.categoryPreferenceKey);
      return true;
    } catch (error) {
      console.error('Clear history failed:', error);
      return false;
    }
  }
}

module.exports = new RecommendManager();
