class AccessibilityManager {
  constructor() {
    this.settingsKey = 'accessibilitySettings';
    this.defaultSettings = {
      voiceOverEnabled: false,
      largeTextEnabled: false,
      highContrastEnabled: false,
      reduceMotionEnabled: false,
      textScale: 1.0
    };
  }

  getSettings() {
    try {
      const saved = wx.getStorageSync(this.settingsKey);
      return {
        ...this.defaultSettings,
        ...saved
      };
    } catch (error) {
      console.error('Get accessibility settings failed:', error);
      return { ...this.defaultSettings };
    }
  }

  saveSettings(settings) {
    try {
      const currentSettings = this.getSettings();
      const newSettings = {
        ...currentSettings,
        ...settings
      };
      wx.setStorageSync(this.settingsKey, newSettings);
      
      const app = getApp();
      if (app) {
        app.globalData.accessibility = newSettings;
      }
      
      return true;
    } catch (error) {
      console.error('Save accessibility settings failed:', error);
      return false;
    }
  }

  toggleVoiceOver() {
    const settings = this.getSettings();
    settings.voiceOverEnabled = !settings.voiceOverEnabled;
    return this.saveSettings(settings);
  }

  toggleLargeText() {
    const settings = this.getSettings();
    settings.largeTextEnabled = !settings.largeTextEnabled;
    settings.textScale = settings.largeTextEnabled ? 1.3 : 1.0;
    return this.saveSettings(settings);
  }

  toggleHighContrast() {
    const settings = this.getSettings();
    settings.highContrastEnabled = !settings.highContrastEnabled;
    return this.saveSettings(settings);
  }

  toggleReduceMotion() {
    const settings = this.getSettings();
    settings.reduceMotionEnabled = !settings.reduceMotionEnabled;
    return this.saveSettings(settings);
  }

  speak(text, priority = 'default') {
    if (!this.getSettings().voiceOverEnabled) {
      return false;
    }
    
    try {
      wx.showToast({
        title: text,
        icon: 'none',
        duration: 2000
      });
      return true;
    } catch (error) {
      console.error('Speak failed:', error);
      return false;
    }
  }

  getTextScale() {
    return this.getSettings().textScale;
  }

  applyTextStyles() {
    const settings = this.getSettings();
    const styles = {};
    
    if (settings.largeTextEnabled) {
      styles['font-size'] = '130%';
      styles['line-height'] = '1.6';
    }
    
    if (settings.highContrastEnabled) {
      styles['color'] = '#000';
      styles['background-color'] = '#fff';
    }
    
    return styles;
  }
}

module.exports = new AccessibilityManager();