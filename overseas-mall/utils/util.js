const formatTime = date => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();
  
  return [year, month, day].map(formatNumber).join('-') + ' ' + 
         [hour, minute, second].map(formatNumber).join(':');
};

const formatDate = date => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  
  return [year, month, day].map(formatNumber).join('-');
};

const formatNumber = n => {
  n = n.toString();
  return n[1] ? n : '0' + n;
};

const showLoading = (title = 'Loading...') => {
  wx.showLoading({ title, mask: true });
};

const hideLoading = () => {
  wx.hideLoading();
};

const showToast = (title, icon = 'none', duration = 2000) => {
  wx.showToast({ title, icon, duration });
};

const showSuccess = (title = 'Success') => {
  showToast(title, 'success');
};

const showError = (title = 'Error') => {
  showToast(title, 'none');
};

const showConfirm = (content, title = 'Confirm') => {
  return new Promise((resolve) => {
    wx.showModal({
      title,
      content,
      success: (res) => resolve(res.confirm)
    });
  });
};

const formatPrice = (price, currency = 'USD') => {
  const symbols = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    JPY: '¥'
  };
  
  const symbol = symbols[currency] || '$';
  
  if (currency === 'JPY') {
    return symbol + Math.round(price);
  }
  
  return symbol + price.toFixed(2);
};

const debounce = (fn, delay = 500) => {
  let timer = null;
  return function(...args) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
};

const throttle = (fn, delay = 500) => {
  let lastTime = 0;
  return function(...args) {
    const now = Date.now();
    if (now - lastTime >= delay) {
      lastTime = now;
      fn.apply(this, args);
    }
  };
};

const checkLogin = () => {
  const token = wx.getStorageSync('token');
  const userInfo = wx.getStorageSync('userInfo');
  return !!(token && userInfo);
};

const navigateToLogin = () => {
  wx.navigateTo({ url: '/pages/login/login' });
};

const getImageUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return 'https://cdn.overseas-mall.com' + url;
};

const calculateDiscount = (originalPrice, currentPrice) => {
  if (!originalPrice || originalPrice <= currentPrice) return 0;
  return Math.round((1 - currentPrice / originalPrice) * 100);
};

const isValidPhone = (phone) => {
  const phoneReg = /^1[3-9]\d{9}$/;
  return phoneReg.test(phone);
};

const isValidEmail = (email) => {
  const emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailReg.test(email);
};

const checkPasswordStrength = (password) => {
  if (!password || password.length < 6) {
    return { level: 0, text: 'Too short', color: '#EF4444' };
  }
  
  let score = 0;
  
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;
  
  if (score <= 2) {
    return { level: 1, text: 'Weak', color: '#EF4444' };
  } else if (score <= 4) {
    return { level: 2, text: 'Medium', color: '#F59E0B' };
  } else {
    return { level: 3, text: 'Strong', color: '#10B981' };
  }
};

const generateCaptcha = (length = 4) => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  let captcha = '';
  for (let i = 0; i < length; i++) {
    captcha += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return captcha;
};

module.exports = {
  formatTime,
  formatDate,
  formatNumber,
  showLoading,
  hideLoading,
  showToast,
  showSuccess,
  showError,
  showConfirm,
  formatPrice,
  debounce,
  throttle,
  checkLogin,
  navigateToLogin,
  getImageUrl,
  calculateDiscount,
  isValidPhone,
  isValidEmail,
  checkPasswordStrength,
  generateCaptcha
};
