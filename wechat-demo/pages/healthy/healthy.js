const store = require('../../utils/store.js');
const images = require('../../utils/images.js');

Page({
  data: {
    foods: [
      {
        id: 1,
        name: '藜麦沙拉',
        tags: ['低卡', '高蛋白', '有机'],
        desc: '新鲜蔬菜配藜麦，营养又健康',
        calories: '280',
        price: 28,
        quantity: 0,
        image: images.dishes.liqiumala
      },
      {
        id: 2,
        name: '清蒸鲈鱼',
        tags: ['低脂', '高蛋白', '补脑'],
        desc: '鲜嫩鲈鱼，清蒸最健康',
        calories: '180',
        price: 58,
        quantity: 0,
        image: images.dishes.qingzhengluyu
      },
      {
        id: 3,
        name: '鸡胸肉沙拉',
        tags: ['减脂', '高蛋白', '健身'],
        desc: '低脂高蛋白，健身首选',
        calories: '220',
        price: 32,
        quantity: 0,
        image: images.dishes.jixianrousala
      },
      {
        id: 4,
        name: '蔬菜汤',
        tags: ['低卡', '高纤维', '排毒'],
        desc: '多种蔬菜熬制，清淡养胃',
        calories: '120',
        price: 18,
        quantity: 0,
        image: images.dishes.shucaitang
      }
    ]
  },

  onShow() {
    this.updateQuantitiesFromCart();
  },

  updateQuantitiesFromCart() {
    const cart = store.getCart();
    const foods = this.data.foods.map(food => {
      const cartItem = cart.find(item => item.id === food.id + 100);
      return {
        ...food,
        quantity: cartItem ? cartItem.quantity : 0
      };
    });
    this.setData({ foods });
  },

  orderFood(e) {
    const id = e.currentTarget.dataset.id;
    const foodIndex = this.data.foods.findIndex(f => f.id === id);
    const food = this.data.foods[foodIndex];
    
    if (food) {
      store.addToCart({
        id: food.id + 100,
        name: food.name,
        price: food.price,
        image: food.image,
        description: food.desc
      });
      
      // 更新数量显示
      const newFoods = [...this.data.foods];
      newFoods[foodIndex].quantity = (newFoods[foodIndex].quantity || 0) + 1;
      this.setData({ foods: newFoods });
      
      wx.showToast({
        title: '已加入购物车',
        icon: 'success'
      });
    }
  },

  decreaseQuantity(e) {
    const id = e.currentTarget.dataset.id;
    const foodIndex = this.data.foods.findIndex(f => f.id === id);
    const food = this.data.foods[foodIndex];
    
    if (food && food.quantity > 0) {
      store.updateCartItemQuantity(food.id + 100, food.quantity - 1);
      
      // 更新数量显示
      const newFoods = [...this.data.foods];
      newFoods[foodIndex].quantity = newFoods[foodIndex].quantity - 1;
      this.setData({ foods: newFoods });
    }
  },

  preventBubble() {
    // 阻止冒泡
  }
});