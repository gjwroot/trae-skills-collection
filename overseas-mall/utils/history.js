class HistoryManager {
  constructor() {
    this.storageKey = 'viewHistory';
    this.maxHistoryLength = 50;
    this.recommendCount = 4;
  }

  addView(goodsId, goodsInfo = {}) {
    try {
      let history = this.getHistory();
      
      history = history.filter(item => item.id !== goodsId);
      
      const viewItem = {
        id: goodsId,
        ...goodsInfo,
        viewTime: Date.now()
      };
      
      history.unshift(viewItem);
      
      if (history.length > this.maxHistoryLength) {
        history = history.slice(0, this.maxHistoryLength);
      }
      
      wx.setStorageSync(this.storageKey, history);
      return true;
    } catch (error) {
      console.error('Add view history failed:', error);
      return false;
    }
  }

  getHistory() {
    try {
      return wx.getStorageSync(this.storageKey) || [];
    } catch (error) {
      console.error('Get view history failed:', error);
      return [];
    }
  }

  clearHistory() {
    try {
      wx.removeStorageSync(this.storageKey);
      return true;
    } catch (error) {
      console.error('Clear view history failed:', error);
      return false;
    }
  }

  getRecommendations(excludeIds = []) {
    try {
      const history = this.getHistory();
      if (history.length === 0) {
        return this.getDefaultRecommendations();
      }

      const viewedIds = history.map(item => item.id);
      const allExcludeIds = [...new Set([...viewedIds, ...excludeIds])];

      const productImages = [
        '/assets/images/product-1.jpg',
        '/assets/images/product-2.jpg',
        '/assets/images/product-3.jpg',
        '/assets/images/product-4.jpg',
        '/assets/images/product-5.jpg',
        '/assets/images/product-6.jpg',
        '/assets/images/product-7.jpg',
        '/assets/images/product-8.jpg'
      ];
      const productNames = [
        'Wireless Bluetooth Headphones',
        'Smart Watch Series 5',
        'Cotton Casual T-Shirt',
        'Leather Wallet for Men',
        'Yoga Mat Non-Slip',
        'Premium Coffee Maker',
        'Portable Power Bank',
        'Noise Cancelling Earbuds'
      ];

      const recommendations = [];
      let idCounter = 100;

      while (recommendations.length < this.recommendCount && idCounter < 200) {
        if (!allExcludeIds.includes(idCounter)) {
          const index = idCounter % productNames.length;
          const price = (Math.random() * 100 + 20).toFixed(2);
          const originalPrice = (parseFloat(price) * 1.3).toFixed(2);
          
          recommendations.push({
            id: idCounter,
            name: productNames[index],
            image: productImages[index],
            price: price,
            originalPrice: originalPrice,
            sales: Math.floor(Math.random() * 1000) + 50,
            isRecommend: true
          });
        }
        idCounter++;
      }

      return recommendations;
    } catch (error) {
      console.error('Get recommendations failed:', error);
      return this.getDefaultRecommendations();
    }
  }

  getDefaultRecommendations() {
    const productImages = [
      '/assets/images/product-1.jpg',
      '/assets/images/product-2.jpg',
      '/assets/images/product-3.jpg',
      '/assets/images/product-4.jpg',
      '/assets/images/product-5.jpg',
      '/assets/images/product-6.jpg',
      '/assets/images/product-7.jpg',
      '/assets/images/product-8.jpg'
    ];
    const productNames = [
      'Wireless Bluetooth Headphones',
      'Smart Watch Series 5',
      'Cotton Casual T-Shirt',
      'Leather Wallet for Men',
      'Yoga Mat Non-Slip',
      'Premium Coffee Maker',
      'Portable Power Bank',
      'Noise Cancelling Earbuds'
    ];

    const recommendations = [];
    for (let i = 0; i < this.recommendCount; i++) {
      const price = (Math.random() * 100 + 20).toFixed(2);
      const originalPrice = (parseFloat(price) * 1.3).toFixed(2);
      
      recommendations.push({
        id: 200 + i,
        name: productNames[i % productNames.length],
        image: productImages[i % productImages.length],
        price: price,
        originalPrice: originalPrice,
        sales: Math.floor(Math.random() * 1000) + 50,
        isRecommend: true,
        isHot: i < 2
      });
    }

    return recommendations;
  }

  getViewStats() {
    try {
      const history = this.getHistory();
      const now = Date.now();
      const oneDay = 24 * 60 * 60 * 1000;
      const oneWeek = 7 * oneDay;
      const oneMonth = 30 * oneDay;

      const stats = {
        totalViews: history.length,
        todayViews: 0,
        weekViews: 0,
        monthViews: 0,
        categoryStats: {},
        priceRange: { min: Infinity, max: 0, avg: 0 },
        viewTimeDistribution: {
          morning: 0,
          afternoon: 0,
          evening: 0,
          night: 0
        }
      };

      let totalPrice = 0;
      let priceCount = 0;

      history.forEach(item => {
        const viewDate = new Date(item.viewTime);
        const hour = viewDate.getHours();

        if (now - item.viewTime < oneDay) {
          stats.todayViews++;
        }
        if (now - item.viewTime < oneWeek) {
          stats.weekViews++;
        }
        if (now - item.viewTime < oneMonth) {
          stats.monthViews++;
        }

        if (hour >= 6 && hour < 12) {
          stats.viewTimeDistribution.morning++;
        } else if (hour >= 12 && hour < 18) {
          stats.viewTimeDistribution.afternoon++;
        } else if (hour >= 18 && hour < 22) {
          stats.viewTimeDistribution.evening++;
        } else {
          stats.viewTimeDistribution.night++;
        }

        if (item.category) {
          stats.categoryStats[item.category] = (stats.categoryStats[item.category] || 0) + 1;
        }

        if (item.price) {
          const price = parseFloat(item.price);
          if (!isNaN(price)) {
            stats.priceRange.min = Math.min(stats.priceRange.min, price);
            stats.priceRange.max = Math.max(stats.priceRange.max, price);
            totalPrice += price;
            priceCount++;
          }
        }
      });

      if (priceCount > 0) {
        stats.priceRange.avg = (totalPrice / priceCount).toFixed(2);
      }
      if (stats.priceRange.min === Infinity) {
        stats.priceRange.min = 0;
      }

      return stats;
    } catch (error) {
      console.error('Get view stats failed:', error);
      return null;
    }
  }

  getTopCategories(limit = 5) {
    try {
      const stats = this.getViewStats();
      if (!stats) return [];

      const categories = Object.entries(stats.categoryStats)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, limit);

      return categories;
    } catch (error) {
      console.error('Get top categories failed:', error);
      return [];
    }
  }

  getRecentlyViewed(days = 7, limit = 10) {
    try {
      const history = this.getHistory();
      const cutoffTime = Date.now() - (days * 24 * 60 * 60 * 1000);
      
      return history
        .filter(item => item.viewTime >= cutoffTime)
        .slice(0, limit);
    } catch (error) {
      console.error('Get recently viewed failed:', error);
      return [];
    }
  }

  getViewTrend(days = 7) {
    try {
      const history = this.getHistory();
      const trend = [];
      const now = new Date();
      
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        date.setHours(0, 0, 0, 0);
        
        const nextDate = new Date(date);
        nextDate.setDate(nextDate.getDate() + 1);
        
        const count = history.filter(item => {
          const viewTime = new Date(item.viewTime);
          return viewTime >= date && viewTime < nextDate;
        }).length;
        
        trend.push({
          date: date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' }),
          count
        });
      }
      
      return trend;
    } catch (error) {
      console.error('Get view trend failed:', error);
      return [];
    }
  }
}

module.exports = new HistoryManager();
