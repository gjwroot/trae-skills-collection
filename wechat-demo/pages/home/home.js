const store = require('../../utils/store.js');
const images = require('../../utils/images.js');

Page({
  data: {
    homefoods: [
      {
        id: 1,
        name: '红烧肉',
        story: '小时候逢年过节才能吃到的味道',
        price: 48,
        quantity: 0,
        image: images.dishes.hongshaorou
      },
      {
        id: 2,
        name: '糖醋排骨',
        story: '妈妈说吃这个就能长高',
        price: 52,
        quantity: 0,
        image: images.dishes.tangcupaigu
      },
      {
        id: 3,
        name: '鱼香肉丝',
        story: '每次考试满分妈妈都会做',
        price: 32,
        quantity: 0,
        image: images.dishes.yuxiangrousi
      }
    ],
    memories: [
      {
        id: 1,
        name: '过年的饺子',
        price: 28,
        quantity: 0,
        icon: '🥟'
      },
      {
        id: 2,
        name: '生日的长寿面',
        price: 18,
        quantity: 0,
        icon: '🍜'
      },
      {
        id: 3,
        name: '中秋的月饼',
        price: 38,
        quantity: 0,
        icon: '🥮'
      }
    ]
  },

  onShow() {
    this.updateQuantitiesFromCart();
  },

  updateQuantitiesFromCart() {
    const cart = store.getCart();
    
    // 更新家常菜数量
    const homefoods = this.data.homefoods.map(food => {
      const cartItem = cart.find(item => item.id === food.id + 200);
      return {
        ...food,
        quantity: cartItem ? cartItem.quantity : 0
      };
    });
    
    // 更新回忆菜品数量
    const memories = this.data.memories.map(memory => {
      const cartItem = cart.find(item => item.id === memory.id + 300);
      return {
        ...memory,
        quantity: cartItem ? cartItem.quantity : 0
      };
    });
    
    this.setData({ homefoods, memories });
  },

  // 家常菜点餐
  orderHomeFood(e) {
    const id = e.currentTarget.dataset.id;
    const foodIndex = this.data.homefoods.findIndex(f => f.id === id);
    const food = this.data.homefoods[foodIndex];
    
    if (food) {
      store.addToCart({
        id: food.id + 200,
        name: food.name,
        price: food.price,
        image: food.image,
        description: food.story
      });
      
      const newHomeFoods = [...this.data.homefoods];
      newHomeFoods[foodIndex].quantity = (newHomeFoods[foodIndex].quantity || 0) + 1;
      this.setData({ homefoods: newHomeFoods });
      
      wx.showToast({
        title: '已加入购物车',
        icon: 'success'
      });
    }
  },

  decreaseHomeFoodQuantity(e) {
    const id = e.currentTarget.dataset.id;
    const foodIndex = this.data.homefoods.findIndex(f => f.id === id);
    const food = this.data.homefoods[foodIndex];
    
    if (food && food.quantity > 0) {
      store.updateCartItemQuantity(food.id + 200, food.quantity - 1);
      
      const newHomeFoods = [...this.data.homefoods];
      newHomeFoods[foodIndex].quantity = newHomeFoods[foodIndex].quantity - 1;
      this.setData({ homefoods: newHomeFoods });
    }
  },

  // 回忆菜品点餐
  orderMemory(e) {
    const id = e.currentTarget.dataset.id;
    const memoryIndex = this.data.memories.findIndex(m => m.id === id);
    const memory = this.data.memories[memoryIndex];
    
    if (memory) {
      store.addToCart({
        id: memory.id + 300,
        name: memory.name,
        price: memory.price,
        image: '',
        description: '记忆中的味道'
      });
      
      const newMemories = [...this.data.memories];
      newMemories[memoryIndex].quantity = (newMemories[memoryIndex].quantity || 0) + 1;
      this.setData({ memories: newMemories });
      
      wx.showToast({
        title: '已加入购物车',
        icon: 'success'
      });
    }
  },

  decreaseMemoryQuantity(e) {
    const id = e.currentTarget.dataset.id;
    const memoryIndex = this.data.memories.findIndex(m => m.id === id);
    const memory = this.data.memories[memoryIndex];
    
    if (memory && memory.quantity > 0) {
      store.updateCartItemQuantity(memory.id + 300, memory.quantity - 1);
      
      const newMemories = [...this.data.memories];
      newMemories[memoryIndex].quantity = newMemories[memoryIndex].quantity - 1;
      this.setData({ memories: newMemories });
    }
  },

  preventBubble() {
    // 阻止冒泡
  }
});