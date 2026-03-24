const store = require('../../utils/store.js');
const images = require('../../utils/images.js');

Page({
  data: {
    categories: [
      { id: 'all', name: '全部' },
      { id: 'vegetables', name: '蔬菜' },
      { id: 'fruits', name: '水果' },
      { id: 'meat', name: '肉类' },
      { id: 'seafood', name: '海鲜' }
    ],
    currentCategory: 'all',
    categoryName: '新鲜食材',
    items: [
      {
        id: 1,
        name: '有机西兰花',
        tag: '新鲜采摘',
        price: 12.8,
        unit: '斤',
        category: 'vegetables',
        quantity: 0,
        image: images.ingredients.xilanhua
      },
      {
        id: 2,
        name: '红富士苹果',
        tag: '香甜多汁',
        price: 15.9,
        unit: '斤',
        category: 'fruits',
        quantity: 0,
        image: images.ingredients.pingguo
      },
      {
        id: 3,
        name: '精选五花肉',
        tag: '肉质鲜嫩',
        price: 35.0,
        unit: '斤',
        category: 'meat',
        quantity: 0,
        image: images.ingredients.wuhuarou
      },
      {
        id: 4,
        name: '活虾',
        tag: '活蹦乱跳',
        price: 68.0,
        unit: '斤',
        category: 'seafood',
        quantity: 0,
        image: images.ingredients.huoxia
      },
      {
        id: 5,
        name: '有机菠菜',
        tag: '营养丰富',
        price: 8.5,
        unit: '斤',
        category: 'vegetables',
        quantity: 0,
        image: images.ingredients.boicai
      },
      {
        id: 6,
        name: '草莓',
        tag: '当季限定',
        price: 28.0,
        unit: '盒',
        category: 'fruits',
        quantity: 0,
        image: images.ingredients.caomei
      }
    ],
    filteredItems: [],
    icons: images.icons
  },

  onLoad() {
    this.filterItems();
  },

  onShow() {
    this.updateQuantitiesFromCart();
  },

  filterItems() {
    const { items, currentCategory } = this.data;
    let filteredItems = items;
    if (currentCategory !== 'all') {
      filteredItems = items.filter(item => item.category === currentCategory);
    }
    this.setData({ filteredItems });
  },

  updateQuantitiesFromCart() {
    const cart = store.getCart();
    const items = this.data.items.map(item => {
      const cartItem = cart.find(cartItem => cartItem.id === item.id + 400);
      return {
        ...item,
        quantity: cartItem ? cartItem.quantity : 0
      };
    });
    this.setData({ items }, () => {
      this.filterItems();
    });
  },

  selectCategory(e) {
    const id = e.currentTarget.dataset.id;
    const category = this.data.categories.find(c => c.id === id);
    
    let filteredItems = this.data.items;
    if (id !== 'all') {
      filteredItems = this.data.items.filter(item => item.category === id);
    }
    
    this.setData({
      currentCategory: id,
      categoryName: category.name,
      filteredItems
    });
  },

  addToCart(e) {
    const item = e.currentTarget.dataset.item;
    const itemIndex = this.data.items.findIndex(i => i.id === item.id);
    
    store.addToCart({
      id: item.id + 400,
      name: item.name,
      price: item.price,
      image: item.image,
      description: item.tag
    });
    
    const newItems = [...this.data.items];
    newItems[itemIndex].quantity = (newItems[itemIndex].quantity || 0) + 1;
    this.setData({ items: newItems }, () => {
      this.filterItems();
    });
    
    wx.showToast({
      title: '已加入购物车',
      icon: 'success'
    });
  },

  decreaseQuantity(e) {
    const item = e.currentTarget.dataset.item;
    const itemIndex = this.data.items.findIndex(i => i.id === item.id);
    
    if (item.quantity > 0) {
      store.updateCartItemQuantity(item.id + 400, item.quantity - 1);
      
      const newItems = [...this.data.items];
      newItems[itemIndex].quantity = newItems[itemIndex].quantity - 1;
      this.setData({ items: newItems }, () => {
        this.filterItems();
      });
    }
  },

  preventBubble() {
    // 阻止冒泡
  }
});