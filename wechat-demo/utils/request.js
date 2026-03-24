const config = require('./config.js');

const request = (options) => {
  return new Promise((resolve, reject) => {
    const showLoading = options.showLoading !== false;
    if (showLoading) {
      wx.showLoading({
        title: options.loadingText || 'Loading...',
        mask: true
      });
    }

    const token = wx.getStorageSync('token');
    const url = config.baseUrl + options.url;

    wx.request({
      url: url,
      method: options.method || 'GET',
      data: options.data || {},
      header: {
        'Content-Type': 'application/json',
        'Authorization': token ? 'Bearer ' + token : '',
        ...options.header
      },
      timeout: options.timeout || config.timeout,
      success: (res) => {
        if (showLoading) wx.hideLoading();
        const { statusCode, data } = res;

        if (statusCode >= 200 && statusCode < 300) {
          if (data.code === 0) {
            resolve(data.data !== undefined ? data.data : {});
          } else {
            if (data.code === 401) {
              wx.removeStorageSync('token');
              wx.removeStorageSync('userInfo');
              wx.reLaunch({ url: '/pages/login/login' });
            } else {
              wx.showToast({
                title: data.msg || 'Request failed',
                icon: 'none',
                duration: 2000
              });
            }
            reject(data);
          }
        } else {
          if (statusCode === 401) {
            wx.removeStorageSync('token');
            wx.removeStorageSync('userInfo');
            wx.reLaunch({ url: '/pages/login/login' });
          } else {
            wx.showToast({
              title: 'Network error',
              icon: 'none',
              duration: 2000
            });
          }
          reject(res);
        }
      },
      fail: (err) => {
        if (showLoading) wx.hideLoading();
        wx.showToast({
          title: 'Network connection failed',
          icon: 'none',
          duration: 2000
        });
        reject(err);
      }
    });
  });
};

module.exports = request;