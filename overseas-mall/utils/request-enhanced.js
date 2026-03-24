const RequestQueue = {
  queue: [],
  maxConcurrent: 3,
  running: 0,
  retryCount: 3,
  retryDelay: 1000,

  add(request) {
    return new Promise((resolve, reject) => {
      this.queue.push({
        request,
        resolve,
        reject,
        retries: 0
      });
      this.process();
    });
  },

  process() {
    if (this.running >= this.maxConcurrent || this.queue.length === 0) {
      return;
    }

    const item = this.queue.shift();
    this.running++;

    this.execute(item)
      .then(result => {
        item.resolve(result);
      })
      .catch(error => {
        if (item.retries < this.retryCount) {
          item.retries++;
          setTimeout(() => {
            this.queue.unshift(item);
            this.process();
          }, this.retryDelay * item.retries);
        } else {
          item.reject(error);
        }
      })
      .finally(() => {
        this.running--;
        this.process();
      });
  },

  async execute(item) {
    try {
      return await item.request();
    } catch (error) {
      throw error;
    }
  }
};

const RequestEnhanced = {
  cache: new Map(),
  cacheTimeout: 5 * 60 * 1000,

  async get(url, options = {}) {
    const { useCache = false, cacheKey = url } = options;

    if (useCache) {
      const cached = this.cache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
        return cached.data;
      }
    }

    return RequestQueue.add(async () => {
      const result = await this.doRequest('GET', url, options);
      
      if (useCache) {
        this.cache.set(cacheKey, {
          data: result,
          timestamp: Date.now()
        });
      }
      
      return result;
    });
  },

  async post(url, data, options = {}) {
    return RequestQueue.add(async () => {
      return await this.doRequest('POST', url, { ...options, data });
    });
  },

  async put(url, data, options = {}) {
    return RequestQueue.add(async () => {
      return await this.doRequest('PUT', url, { ...options, data });
    });
  },

  async delete(url, options = {}) {
    return RequestQueue.add(async () => {
      return await this.doRequest('DELETE', url, options);
    });
  },

  async doRequest(method, url, options = {}) {
    return new Promise((resolve, reject) => {
      wx.request({
        url,
        method,
        data: options.data,
        header: options.header || {
          'Content-Type': 'application/json'
        },
        success: (res) => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(res.data);
          } else {
            reject(new Error(`Request failed with status ${res.statusCode}`));
          }
        },
        fail: (err) => {
          reject(err);
        }
      });
    });
  },

  clearCache() {
    this.cache.clear();
  },

  removeCache(key) {
    this.cache.delete(key);
  }
};

module.exports = { RequestQueue, RequestEnhanced };
