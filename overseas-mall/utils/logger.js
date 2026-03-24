const Logger = {
  logs: [],
  maxLogs: 100,

  addLog(type, message, data = null) {
    const log = {
      id: Date.now() + Math.random(),
      type,
      message,
      data,
      timestamp: new Date().toISOString()
    };

    this.logs.unshift(log);
    
    if (this.logs.length > this.maxLogs) {
      this.logs.pop();
    }

    console.log(`[${type.toUpperCase()}] ${message}`, data || '');
  },

  info(message, data) {
    this.addLog('info', message, data);
  },

  warn(message, data) {
    this.addLog('warn', message, data);
  },

  error(message, data) {
    this.addLog('error', message, data);
    this.reportError(message, data);
  },

  debug(message, data) {
    this.addLog('debug', message, data);
  },

  reportError(message, data) {
    try {
      const errorReport = {
        message,
        data,
        timestamp: new Date().toISOString(),
        page: getCurrentPages().length > 0 ? getCurrentPages()[getCurrentPages().length - 1].route : 'unknown'
      };
      
      wx.setStorageSync('errorReports', [
        errorReport,
        ...(wx.getStorageSync('errorReports') || []).slice(0, 19)
      ]);
    } catch (e) {
      console.error('Failed to report error:', e);
    }
  },

  getLogs() {
    return [...this.logs];
  },

  clearLogs() {
    this.logs = [];
  },

  getErrorReports() {
    return wx.getStorageSync('errorReports') || [];
  },

  clearErrorReports() {
    wx.removeStorageSync('errorReports');
  }
};

module.exports = Logger;
