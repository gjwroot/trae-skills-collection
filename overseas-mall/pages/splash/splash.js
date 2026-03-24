Page({
  data: {
    progress: 0,
    showLogo: false
  },

  onLoad() {
    this.startAnimation();
  },

  startAnimation() {
    setTimeout(() => {
      this.setData({ showLogo: true });
    }, 300);

    let progress = 0;
    const timer = setInterval(() => {
      progress += Math.random() * 15;
      if (progress >= 100) {
        progress = 100;
        clearInterval(timer);
        setTimeout(() => {
          this.navigateToHome();
        }, 500);
      }
      this.setData({ progress: Math.floor(progress) });
    }, 200);
  },

  navigateToHome() {
    const isFirstLaunch = this.checkFirstLaunch();
    
    if (isFirstLaunch) {
      wx.reLaunch({
        url: '/pages/guide/guide'
      });
    } else {
      wx.switchTab({
        url: '/pages/index/index'
      });
    }
  },

  checkFirstLaunch() {
    const hasLaunched = wx.getStorageSync('hasLaunched');
    if (!hasLaunched) {
      return true;
    }
    return false;
  }
});