Component({
  data: {
    selected: 0,
    color: '#666666',
    selectedColor: '#FF6B4A',
    list: [
      {
        pagePath: '/pages/index/index',
        text: 'Home',
        iconPath: '/assets/icons/home.png',
        selectedIconPath: '/assets/icons/home-active.png'
      },
      {
        pagePath: '/pages/category/category',
        text: 'Category',
        iconPath: '/assets/icons/category.png',
        selectedIconPath: '/assets/icons/category-active.png'
      },
      {
        pagePath: '/pages/cart/cart',
        text: 'Cart',
        iconPath: '/assets/icons/cart.png',
        selectedIconPath: '/assets/icons/cart-active.png'
      },
      {
        pagePath: '/pages/mine/mine',
        text: 'Mine',
        iconPath: '/assets/icons/mine.png',
        selectedIconPath: '/assets/icons/mine-active.png'
      }
    ],
    cartCount: 0,
    messageCount: 0,
    couponCount: 0,
    orderCount: 0
  },

  lifetimes: {
    attached() {
      this.updateSelectedTab();
      this.updateAllBadges();
    }
  },

  pageLifetimes: {
    show() {
      this.updateSelectedTab();
      this.updateAllBadges();
    }
  },

  methods: {
    updateSelectedTab() {
      try {
        const pages = getCurrentPages();
        if (pages && pages.length > 0) {
          const currentPage = pages[pages.length - 1];
          if (currentPage && currentPage.route) {
            const route = '/' + currentPage.route;
            const index = this.data.list.findIndex(item => item.pagePath === route);
            if (index !== -1) {
              this.setData({ selected: index });
            }
          }
        }
      } catch (error) {
        console.error('Update selected tab failed:', error);
      }
    },

    switchTab(e) {
      const data = e.currentTarget.dataset;
      const url = data.path;
      wx.switchTab({ url });
    },

    updateAllBadges() {
      this.updateCartBadge();
      this.updateMessageBadge();
      this.updateCouponBadge();
      this.updateOrderBadge();
    },

    updateCartBadge() {
      try {
        const cartItems = wx.getStorageSync('cartItems') || [];
        let count = 0;
        cartItems.forEach(item => {
          count += item.quantity || 0;
        });
        this.setData({ cartCount: count });
      } catch (error) {
        console.error('Update cart badge failed:', error);
        this.setData({ cartCount: 0 });
      }
    },

    updateMessageBadge() {
      try {
        const messages = wx.getStorageSync('mockMessages') || [];
        const unreadCount = messages.filter(msg => !msg.read).length;
        this.setData({ messageCount: unreadCount });
      } catch (error) {
        console.error('Update message badge failed:', error);
        this.setData({ messageCount: 0 });
      }
    },

    updateCouponBadge() {
      try {
        const coupons = wx.getStorageSync('mockCoupons') || [];
        const today = new Date();
        const expiringSoonCount = coupons.filter(coupon => {
          if (coupon.used) return false;
          const expireDate = new Date(coupon.expireDate);
          const diffDays = Math.ceil((expireDate - today) / (1000 * 60 * 60 * 24));
          return diffDays > 0 && diffDays <= 7;
        }).length;
        this.setData({ couponCount: expiringSoonCount });
      } catch (error) {
        console.error('Update coupon badge failed:', error);
        this.setData({ couponCount: 0 });
      }
    },

    updateOrderBadge() {
      try {
        const orders = wx.getStorageSync('mockOrders') || [];
        const pendingReviewCount = orders.filter(order => 
          order.status === 'completed' && !order.reviewed
        ).length;
        this.setData({ orderCount: pendingReviewCount });
      } catch (error) {
        console.error('Update order badge failed:', error);
        this.setData({ orderCount: 0 });
      }
    }
  }
});
