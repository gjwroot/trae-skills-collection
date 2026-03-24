const app = getApp();

Component({
  properties: {
    title: {
      type: String,
      value: ''
    },
    showBack: {
      type: Boolean,
      value: true
    },
    showHome: {
      type: Boolean,
      value: false
    },
    background: {
      type: String,
      value: '#FF6B4A'
    },
    titleColor: {
      type: String,
      value: '#fff'
    },
    iconColor: {
      type: String,
      value: '#fff'
    },
    showBorder: {
      type: Boolean,
      value: false
    }
  },

  data: {
    statusBarHeight: 0,
    navBarHeight: 44
  },

  lifetimes: {
    attached() {
      let statusBarHeight = 0;
      try {
        const windowInfo = wx.getWindowInfo();
        statusBarHeight = windowInfo.statusBarHeight || 0;
      } catch (error) {
        try {
          const systemInfo = wx.getSystemInfoSync();
          statusBarHeight = systemInfo.statusBarHeight || 0;
        } catch (e) {
          statusBarHeight = 0;
        }
      }
      
      const menuButton = wx.getMenuButtonBoundingClientRect();
      let navBarHeight = 44;
      
      if (menuButton) {
        navBarHeight = (menuButton.top - statusBarHeight) * 2 + menuButton.height;
      }
      
      this.setData({
        statusBarHeight,
        navBarHeight
      });
    }
  },

  methods: {
    goBack() {
      const pages = getCurrentPages();
      if (pages.length > 1) {
        wx.navigateBack();
      } else {
        wx.switchTab({
          url: '/pages/index/index'
        });
      }
    },

    goHome() {
      wx.switchTab({
        url: '/pages/index/index'
      });
    }
  }
});