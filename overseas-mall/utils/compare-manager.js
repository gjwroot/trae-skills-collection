class CompareManager {
  constructor() {
    this.compareKey = 'compare_list';
    this.maxCompareSize = 4;
  }

  getCompareList() {
    try {
      return wx.getStorageSync(this.compareKey) || [];
    } catch (error) {
      console.error('Get compare list failed:', error);
      return [];
    }
  }

  saveCompareList(list) {
    try {
      wx.setStorageSync(this.compareKey, list);
      return true;
    } catch (error) {
      console.error('Save compare list failed:', error);
      return false;
    }
  }

  addToCompare(goods) {
    try {
      let compareList = this.getCompareList();
      
      const existingIndex = compareList.findIndex(item => item.id === goods.id);
      if (existingIndex !== -1) {
        return { success: false, message: '商品已在对比列表中' };
      }

      if (compareList.length >= this.maxCompareSize) {
        return { success: false, message: `最多只能对比${this.maxCompareSize}件商品` };
      }

      const compareItem = {
        id: goods.id,
        name: goods.name,
        image: goods.image,
        price: goods.price,
        originalPrice: goods.originalPrice,
        category: goods.category || '',
        specs: goods.specs || {},
        ratings: goods.ratings || 4.5,
        sales: goods.sales || 0,
        addedAt: Date.now()
      };

      compareList.push(compareItem);
      this.saveCompareList(compareList);

      return { success: true, message: '已添加到对比列表' };
    } catch (error) {
      console.error('Add to compare failed:', error);
      return { success: false, message: '添加失败' };
    }
  }

  removeFromCompare(goodsId) {
    try {
      let compareList = this.getCompareList();
      const initialLength = compareList.length;
      compareList = compareList.filter(item => item.id !== goodsId);
      
      if (compareList.length < initialLength) {
        this.saveCompareList(compareList);
        return { success: true, message: '已从对比列表移除' };
      }
      
      return { success: false, message: '商品不在对比列表中' };
    } catch (error) {
      console.error('Remove from compare failed:', error);
      return { success: false, message: '移除失败' };
    }
  }

  clearCompareList() {
    try {
      this.saveCompareList([]);
      return { success: true, message: '对比列表已清空' };
    } catch (error) {
      console.error('Clear compare list failed:', error);
      return { success: false, message: '清空失败' };
    }
  }

  isInCompare(goodsId) {
    try {
      const compareList = this.getCompareList();
      return compareList.some(item => item.id === goodsId);
    } catch (error) {
      console.error('Check compare failed:', error);
      return false;
    }
  }

  getCompareCount() {
    try {
      return this.getCompareList().length;
    } catch (error) {
      console.error('Get compare count failed:', error);
      return 0;
    }
  }

  generateComparisonData() {
    try {
      const compareList = this.getCompareList();
      if (compareList.length < 2) {
        return null;
      }

      const specs = [
        { key: 'price', label: '价格', format: (v) => `$${v}` },
        { key: 'originalPrice', label: '原价', format: (v) => `$${v}` },
        { key: 'ratings', label: '评分', format: (v) => `${v}★` },
        { key: 'sales', label: '销量', format: (v) => `${v}件` }
      ];

      const allSpecKeys = new Set();
      compareList.forEach(item => {
        if (item.specs) {
          Object.keys(item.specs).forEach(key => allSpecKeys.add(key));
        }
      });

      allSpecKeys.forEach(key => {
        specs.push({ key, label: key, format: (v) => v || '-' });
      });

      return {
        items: compareList,
        specs: specs
      };
    } catch (error) {
      console.error('Generate comparison data failed:', error);
      return null;
    }
  }
}

const compareManager = new CompareManager();
module.exports = compareManager;
