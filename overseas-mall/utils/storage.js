class StorageManager {
  constructor() {
    this.prefix = 'om_';
    this.expirySuffix = '_expiry';
    this.maxAge = {
      short: 5 * 60 * 1000,
      medium: 30 * 60 * 1000,
      long: 24 * 60 * 60 * 1000,
      permanent: null
    };
  }

  getKey(key) {
    return this.prefix + key;
  }

  getExpiryKey(key) {
    return this.getKey(key) + this.expirySuffix;
  }

  set(key, value, maxAge = 'medium') {
    try {
      const storageKey = this.getKey(key);
      const expiryKey = this.getExpiryKey(key);
      
      const serializedValue = JSON.stringify(value);
      wx.setStorageSync(storageKey, serializedValue);
      
      if (maxAge && this.maxAge[maxAge]) {
        const expiry = Date.now() + this.maxAge[maxAge];
        wx.setStorageSync(expiryKey, expiry);
      } else {
        wx.removeStorageSync(expiryKey);
      }
      
      return true;
    } catch (error) {
      console.error('Storage set failed:', error);
      return false;
    }
  }

  get(key, defaultValue = null) {
    try {
      const storageKey = this.getKey(key);
      const expiryKey = this.getExpiryKey(key);
      
      const expiry = wx.getStorageSync(expiryKey);
      if (expiry && Date.now() > expiry) {
        this.remove(key);
        return defaultValue;
      }
      
      const serializedValue = wx.getStorageSync(storageKey);
      if (serializedValue === '' || serializedValue === undefined || serializedValue === null) {
        return defaultValue;
      }
      
      return JSON.parse(serializedValue);
    } catch (error) {
      console.error('Storage get failed:', error);
      return defaultValue;
    }
  }

  remove(key) {
    try {
      const storageKey = this.getKey(key);
      const expiryKey = this.getExpiryKey(key);
      
      wx.removeStorageSync(storageKey);
      wx.removeStorageSync(expiryKey);
      
      return true;
    } catch (error) {
      console.error('Storage remove failed:', error);
      return false;
    }
  }

  clear(prefix = '') {
    try {
      const res = wx.getStorageInfoSync();
      const keys = res.keys;
      
      const targetPrefix = this.getKey(prefix);
      
      keys.forEach(key => {
        if (key.startsWith(targetPrefix)) {
          wx.removeStorageSync(key);
        }
      });
      
      return true;
    } catch (error) {
      console.error('Storage clear failed:', error);
      return false;
    }
  }

  exists(key) {
    try {
      const storageKey = this.getKey(key);
      const expiryKey = this.getExpiryKey(key);
      
      const expiry = wx.getStorageSync(expiryKey);
      if (expiry && Date.now() > expiry) {
        this.remove(key);
        return false;
      }
      
      const value = wx.getStorageSync(storageKey);
      return value !== '' && value !== undefined && value !== null;
    } catch (error) {
      console.error('Storage exists check failed:', error);
      return false;
    }
  }

  getSize() {
    try {
      const res = wx.getStorageInfoSync();
      return {
        currentSize: res.currentSize,
        limitSize: res.limitSize
      };
    } catch (error) {
      console.error('Storage get size failed:', error);
      return null;
    }
  }

  setBatch(items, maxAge = 'medium') {
    try {
      items.forEach(item => {
        this.set(item.key, item.value, maxAge);
      });
      return true;
    } catch (error) {
      console.error('Storage set batch failed:', error);
      return false;
    }
  }

  getBatch(keys, defaultValue = null) {
    try {
      const result = {};
      keys.forEach(key => {
        result[key] = this.get(key, defaultValue);
      });
      return result;
    } catch (error) {
      console.error('Storage get batch failed:', error);
      return {};
    }
  }

  removeBatch(keys) {
    try {
      keys.forEach(key => {
        this.remove(key);
      });
      return true;
    } catch (error) {
      console.error('Storage remove batch failed:', error);
      return false;
    }
  }
}

module.exports = new StorageManager();