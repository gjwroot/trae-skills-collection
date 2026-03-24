class ThemeManager {
  constructor() {
    this.themeKey = 'appTheme';
    this.defaultTheme = 'light';
    
    this.themes = {
      light: {
        name: '浅色模式',
        colors: {
          primary: '#FF6B4A',
          primaryLight: '#FF8E6B',
          background: '#f5f5f5',
          pageBackground: '#fff',
          textPrimary: '#333',
          textSecondary: '#666',
          textTertiary: '#999',
          border: '#f0f0f0',
          borderLight: '#e8e8e8',
          success: '#10B981',
          warning: '#F59E0B',
          error: '#EF4444',
          shadow: 'rgba(0, 0, 0, 0.08)'
        }
      },
      dark: {
        name: '深色模式',
        colors: {
          primary: '#FF6B4A',
          primaryLight: '#FF8E6B',
          background: '#1a1a1a',
          pageBackground: '#2d2d2d',
          textPrimary: '#f0f0f0',
          textSecondary: '#b0b0b0',
          textTertiary: '#808080',
          border: '#3a3a3a',
          borderLight: '#454545',
          success: '#10B981',
          warning: '#F59E0B',
          error: '#EF4444',
          shadow: 'rgba(0, 0, 0, 0.3)'
        }
      }
    };
  }

  getTheme() {
    try {
      const savedTheme = wx.getStorageSync(this.themeKey);
      return savedTheme || this.defaultTheme;
    } catch (error) {
      console.error('Get theme failed:', error);
      return this.defaultTheme;
    }
  }

  setTheme(theme) {
    try {
      if (this.themes[theme]) {
        wx.setStorageSync(this.themeKey, theme);
        
        const app = getApp();
        if (app && app.globalData) {
          app.globalData.theme = theme;
          app.globalData.colors = this.themes[theme].colors;
        }
        
        return true;
      }
      return false;
    } catch (error) {
      console.error('Set theme failed:', error);
      return false;
    }
  }

  toggleTheme() {
    const currentTheme = this.getTheme();
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    return this.setTheme(newTheme);
  }

  getThemeConfig(themeName) {
    return this.themes[themeName] || this.themes[this.defaultTheme];
  }

  initAppTheme() {
    const theme = this.getTheme();
    const config = this.getThemeConfig(theme);
    
    return {
      theme,
      ...config
    };
  }
}

module.exports = new ThemeManager();