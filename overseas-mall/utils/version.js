class VersionManager {
  constructor() {
    this.currentVersion = '1.0.0';
    this.versionKey = 'app_version';
    this.updateKey = 'app_update_info';
    this.checkInterval = 24 * 60 * 60 * 1000;
  }

  getCurrentVersion() {
    return this.currentVersion;
  }

  getStoredVersion() {
    try {
      return wx.getStorageSync(this.versionKey) || null;
    } catch (error) {
      console.error('Get stored version failed:', error);
      return null;
    }
  }

  setStoredVersion(version) {
    try {
      wx.setStorageSync(this.versionKey, version);
      return true;
    } catch (error) {
      console.error('Set stored version failed:', error);
      return false;
    }
  }

  compareVersions(v1, v2) {
    const parts1 = v1.split('.').map(Number);
    const parts2 = v2.split('.').map(Number);
    
    for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
      const num1 = parts1[i] || 0;
      const num2 = parts2[i] || 0;
      
      if (num1 > num2) return 1;
      if (num1 < num2) return -1;
    }
    
    return 0;
  }

  isNewVersion(remoteVersion) {
    const storedVersion = this.getStoredVersion() || '0.0.0';
    return this.compareVersions(remoteVersion, storedVersion) > 0;
  }

  shouldCheckUpdate() {
    try {
      const updateInfo = wx.getStorageSync(this.updateKey);
      if (!updateInfo) return true;
      
      const lastCheck = updateInfo.lastCheck || 0;
      return Date.now() - lastCheck > this.checkInterval;
    } catch (error) {
      console.error('Check update interval failed:', error);
      return true;
    }
  }

  async checkForUpdate() {
    try {
      const mockUpdateInfo = {
        version: '1.1.0',
        title: '新版本可用',
        description: '1. 新增深色模式\n2. 优化搜索功能\n3. 修复已知问题',
        forceUpdate: false,
        downloadUrl: '',
        updateType: 'minor'
      };

      const updateInfo = {
        lastCheck: Date.now(),
        lastVersion: mockUpdateInfo.version
      };
      wx.setStorageSync(this.updateKey, updateInfo);

      if (this.isNewVersion(mockUpdateInfo.version)) {
        return {
          hasUpdate: true,
          ...mockUpdateInfo
        };
      }

      return { hasUpdate: false };
    } catch (error) {
      console.error('Check for update failed:', error);
      return { hasUpdate: false, error: error.message };
    }
  }

  showUpdateDialog(updateInfo) {
    return new Promise((resolve) => {
      wx.showModal({
        title: updateInfo.title,
        content: updateInfo.description,
        confirmText: '立即更新',
        cancelText: updateInfo.forceUpdate ? '' : '稍后',
        showCancel: !updateInfo.forceUpdate,
        success: (res) => {
          if (res.confirm) {
            this.performUpdate(updateInfo);
            resolve(true);
          } else {
            resolve(false);
          }
        }
      });
    });
  }

  performUpdate(updateInfo) {
    wx.showLoading({ title: '更新中...' });

    setTimeout(() => {
      wx.hideLoading();
      
      this.setStoredVersion(updateInfo.version);
      
      wx.showModal({
        title: '更新成功',
        content: '请重启小程序以应用更新',
        showCancel: false,
        confirmText: '确定',
        success: () => {
        }
      });
    }, 1500);
  }

  getUpdateHistory() {
    try {
      return wx.getStorageSync('update_history') || [];
    } catch (error) {
      console.error('Get update history failed:', error);
      return [];
    }
  }

  addUpdateHistory(version, type = 'manual') {
    try {
      const history = this.getUpdateHistory();
      history.unshift({
        version,
        type,
        timestamp: Date.now(),
        timestampISO: new Date().toISOString()
      });
      
      if (history.length > 20) {
        history.length = 20;
      }
      
      wx.setStorageSync('update_history', history);
      return true;
    } catch (error) {
      console.error('Add update history failed:', error);
      return false;
    }
  }

  getVersionInfo() {
    return {
      currentVersion: this.currentVersion,
      storedVersion: this.getStoredVersion(),
      updateHistory: this.getUpdateHistory(),
      lastCheck: this.getLastCheckTime()
    };
  }

  getLastCheckTime() {
    try {
      const updateInfo = wx.getStorageSync(this.updateKey);
      return updateInfo ? updateInfo.lastCheck : null;
    } catch (error) {
      console.error('Get last check time failed:', error);
      return null;
    }
  }

  resetVersion() {
    try {
      wx.removeStorageSync(this.versionKey);
      wx.removeStorageSync(this.updateKey);
      wx.removeStorageSync('update_history');
      return true;
    } catch (error) {
      console.error('Reset version failed:', error);
      return false;
    }
  }
}

module.exports = new VersionManager();