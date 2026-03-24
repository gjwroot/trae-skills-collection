class CacheManager {
  constructor() {
    this.prefix = 'cache_';
    this.defaultTTL = 5 * 60 * 1000;
  }

  set(key, value, ttl = this.defaultTTL) {
    try {
      const data = {
        value,
        expireAt: Date.now() + ttl
      };
      wx.setStorageSync(this.prefix + key, data);
      return true;
    } catch (error) {
      console.error('Cache set failed:', error);
      return false;
    }
  }

  get(key) {
    try {
      const data = wx.getStorageSync(this.prefix + key);
      if (!data) return null;
      
      if (Date.now() > data.expireAt) {
        this.delete(key);
        return null;
      }
      
      return data.value;
    } catch (error) {
      console.error('Cache get failed:', error);
      return null;
    }
  }

  delete(key) {
    try {
      wx.removeStorageSync(this.prefix + key);
      return true;
    } catch (error) {
      console.error('Cache delete failed:', error);
      return false;
    }
  }

  clear() {
    try {
      const info = wx.getStorageInfoSync();
      const keys = info.keys.filter(key => key.startsWith(this.prefix));
      keys.forEach(key => wx.removeStorageSync(key));
      return true;
    } catch (error) {
      console.error('Cache clear failed:', error);
      return false;
    }
  }

  getSize() {
    try {
      const info = wx.getStorageInfoSync();
      const keys = info.keys.filter(key => key.startsWith(this.prefix));
      return keys.length;
    } catch (error) {
      console.error('Cache getSize failed:', error);
      return 0;
    }
  }

  async wrap(key, fn, ttl = this.defaultTTL) {
    const cached = this.get(key);
    if (cached !== null) {
      return cached;
    }
    
    const result = await fn();
    this.set(key, result, ttl);
    return result;
  }
}

module.exports = new CacheManager();
