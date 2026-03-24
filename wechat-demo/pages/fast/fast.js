const store = require('../../utils/store.js');
const images = require('../../utils/images.js');

Page({
  data: {
    recipes: [
      {
        id: 1,
        name: '番茄炒蛋',
        time: '10分钟',
        level: '简单',
        desc: '经典家常菜，酸甜可口',
        price: 18,
        quantity: 0,
        image: images.dishes.fanqiechaodan
      },
      {
        id: 2,
        name: '蛋炒饭',
        time: '15分钟',
        level: '简单',
        desc: '粒粒分明，香喷喷',
        price: 15,
        quantity: 0,
        image: images.dishes.danjiaofan
      },
      {
        id: 3,
        name: '红烧豆腐',
        time: '20分钟',
        level: '中等',
        desc: '嫩滑入味，下饭神器',
        price: 22,
        quantity: 0,
        image: images.dishes.hongshaodoufu
      }
    ],
    tips: [
      {
        id: 1,
        title: '提前准备食材',
        text: '先把所有食材切好备好，可以大大节省时间',
        icon: 'lightning'
      },
      {
        id: 2,
        title: '合理使用火候',
        text: '大火快炒，小火慢炖，掌握火候事半功倍',
        icon: 'fire'
      }
    ],
    icons: images.icons
  },

  onShow() {
    this.updateQuantitiesFromCart();
  },

  updateQuantitiesFromCart() {
    const cart = store.getCart();
    const recipes = this.data.recipes.map(recipe => {
      const cartItem = cart.find(item => item.id === recipe.id + 500);
      return {
        ...recipe,
        quantity: cartItem ? cartItem.quantity : 0
      };
    });
    this.setData({ recipes });
  },

  orderRecipe(e) {
    const id = e.currentTarget.dataset.id;
    const recipeIndex = this.data.recipes.findIndex(r => r.id === id);
    const recipe = this.data.recipes[recipeIndex];
    
    if (recipe) {
      store.addToCart({
        id: recipe.id + 500,
        name: recipe.name,
        price: recipe.price,
        image: recipe.image,
        description: recipe.desc
      });
      
      const newRecipes = [...this.data.recipes];
      newRecipes[recipeIndex].quantity = (newRecipes[recipeIndex].quantity || 0) + 1;
      this.setData({ recipes: newRecipes });
      
      wx.showToast({
        title: '已加入购物车',
        icon: 'success'
      });
    }
  },

  decreaseQuantity(e) {
    const id = e.currentTarget.dataset.id;
    const recipeIndex = this.data.recipes.findIndex(r => r.id === id);
    const recipe = this.data.recipes[recipeIndex];
    
    if (recipe && recipe.quantity > 0) {
      store.updateCartItemQuantity(recipe.id + 500, recipe.quantity - 1);
      
      const newRecipes = [...this.data.recipes];
      newRecipes[recipeIndex].quantity = newRecipes[recipeIndex].quantity - 1;
      this.setData({ recipes: newRecipes });
    }
  },

  preventBubble() {
    // 阻止冒泡
  }
});