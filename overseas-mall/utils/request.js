const config = require('./config.js');

const request = (options) => {
  return new Promise((resolve, reject) => {
    const showLoading = options.showLoading !== false;
    
    if (showLoading) {
      wx.showLoading({
        title: options.loadingText || 'Loading...',
        mask: true
      });
    }

    const token = wx.getStorageSync('token');
    const language = wx.getStorageSync('language') || config.defaultLanguage;
    const currency = wx.getStorageSync('currency') || config.defaultCurrency;
    
    if (!config.baseUrl) {
      return mockRequest(options, showLoading, resolve, reject);
    }
    
    const url = config.baseUrl + options.url;

    wx.request({
      url: url,
      method: options.method || 'GET',
      data: options.data || {},
      header: {
        'Content-Type': 'application/json',
        'Authorization': token ? 'Bearer ' + token : '',
        'Accept-Language': language,
        'X-Currency': currency,
        ...options.header
      },
      timeout: options.timeout || config.timeout,
      success: (res) => {
        if (showLoading) wx.hideLoading();
        
        const { statusCode, data } = res;

        if (statusCode >= 200 && statusCode < 300) {
          if (data.code === 0) {
            resolve(data.data !== undefined ? data.data : {});
          } else {
            if (data.code === 401) {
              wx.removeStorageSync('token');
              wx.removeStorageSync('userInfo');
              const app = getApp();
              if (app) app.globalData.isLoggedIn = false;
              
              wx.showModal({
                title: 'Login Required',
                content: 'Your session has expired. Please login again.',
                showCancel: false,
                success: () => {
                  wx.reLaunch({ url: '/pages/login/login' });
                }
              });
            } else {
              wx.showToast({
                title: data.msg || 'Request failed',
                icon: 'none',
                duration: 2000
              });
            }
            reject(data);
          }
        } else {
          if (statusCode === 401) {
            wx.removeStorageSync('token');
            wx.removeStorageSync('userInfo');
            wx.reLaunch({ url: '/pages/login/login' });
          } else if (statusCode === 404) {
            wx.showToast({
              title: 'Resource not found',
              icon: 'none',
              duration: 2000
            });
          } else if (statusCode >= 500) {
            wx.showToast({
              title: 'Server error. Please try again later.',
              icon: 'none',
              duration: 2000
            });
          } else {
            wx.showToast({
              title: 'Network error',
              icon: 'none',
              duration: 2000
            });
          }
          reject(res);
        }
      },
      fail: (err) => {
        if (showLoading) wx.hideLoading();
        
        wx.showToast({
          title: 'Network connection failed',
          icon: 'none',
          duration: 2000
        });
        
        reject(err);
      }
    });
  });
};

const get = (url, data, options = {}) => {
  return request({
    url,
    method: 'GET',
    data,
    ...options
  });
};

const post = (url, data, options = {}) => {
  return request({
    url,
    method: 'POST',
    data,
    ...options
  });
};

const put = (url, data, options = {}) => {
  return request({
    url,
    method: 'PUT',
    data,
    ...options
  });
};

const del = (url, data, options = {}) => {
  return request({
    url,
    method: 'DELETE',
    data,
    ...options
  });
};

const mockRequest = (options, showLoading, resolve, reject) => {
  if (showLoading) {
    wx.showLoading({
      title: options.loadingText || 'Loading...',
      mask: true
    });
  }

  setTimeout(() => {
    if (showLoading) wx.hideLoading();
    
    const url = options.url;
    const method = options.method || 'GET';
    
    const mockData = getMockData(url, method, options.data);
    
    resolve(mockData);
  }, 300);
};

// 使用真实商品图片 - 使用picsum和稳定的外部图片服务
const productImages = [
  'https://picsum.photos/400/400?random=1',
  'https://picsum.photos/400/400?random=2',
  'https://picsum.photos/400/400?random=3',
  'https://picsum.photos/400/400?random=4',
  'https://picsum.photos/400/400?random=5',
  'https://picsum.photos/400/400?random=6',
  'https://picsum.photos/400/400?random=7',
  'https://picsum.photos/400/400?random=8',
  'https://picsum.photos/400/400?random=9',
  'https://picsum.photos/400/400?random=10',
  'https://picsum.photos/400/400?random=11',
  'https://picsum.photos/400/400?random=12',
  'https://picsum.photos/400/400?random=13',
  'https://picsum.photos/400/400?random=14',
  'https://picsum.photos/400/400?random=15',
  'https://picsum.photos/400/400?random=16'
];

const getMockData = (url, method, data) => {
  if (url.includes('/banner/list')) {
    return {
      list: [
        { id: 1, image: productImages[0], type: 'goods', targetId: '1' },
        { id: 2, image: productImages[4], type: 'category', targetId: '1' },
        { id: 3, image: productImages[8], type: 'url', url: 'https://example.com' }
      ]
    };
  }
  
  if (url.includes('/goods/categories')) {
    return {
      list: [
        { 
          id: '1', 
          name: 'Electronics', 
          icon: 'phone-o',
          children: [
            { id: '1-1', name: 'Phones', icon: 'phone-o' },
            { id: '1-2', name: 'Laptops', icon: 'laptop' },
            { id: '1-3', name: 'Headphones', icon: 'headphone' },
            { id: '1-4', name: 'Cameras', icon: 'camera' }
          ]
        },
        { 
          id: '2', 
          name: 'Fashion', 
          icon: 'shirt-o',
          children: [
            { id: '2-1', name: 'Men', icon: 'shirt-o' },
            { id: '2-2', name: 'Women', icon: 'dress' },
            { id: '2-3', name: 'Kids', icon: 'shirt-o' },
            { id: '2-4', name: 'Shoes', icon: 'shoe' }
          ]
        },
        { 
          id: '3', 
          name: 'Home', 
          icon: 'home-o',
          children: [
            { id: '3-1', name: 'Furniture', icon: 'home-o' },
            { id: '3-2', name: 'Decor', icon: 'home-o' },
            { id: '3-3', name: 'Kitchen', icon: 'home-o' }
          ]
        },
        { 
          id: '4', 
          name: 'Beauty', 
          icon: 'smile-o',
          children: [
            { id: '4-1', name: 'Skincare', icon: 'smile-o' },
            { id: '4-2', name: 'Makeup', icon: 'smile-o' },
            { id: '4-3', name: 'Haircare', icon: 'smile-o' }
          ]
        },
        { 
          id: '5', 
          name: 'Sports', 
          icon: 'fire-o',
          children: [
            { id: '5-1', name: 'Running', icon: 'fire-o' },
            { id: '5-2', name: 'Fitness', icon: 'fire-o' },
            { id: '5-3', name: 'Outdoor', icon: 'fire-o' }
          ]
        },
        { 
          id: '6', 
          name: 'Books', 
          icon: 'book-o',
          children: [
            { id: '6-1', name: 'Fiction', icon: 'book-o' },
            { id: '6-2', name: 'Non-Fiction', icon: 'book-o' },
            { id: '6-3', name: 'Education', icon: 'book-o' }
          ]
        }
      ]
    };
  }
  
  if (url.includes('/goods/list') || url.includes('/goods/hot') || url.includes('/goods/new') || url.includes('/goods/recommend')) {
    const allProducts = [
      // Electronics (categoryId: '1')
      { id: '1', name: 'Premium Wireless Headphones', price: 99.99, originalPrice: 129.99, image: productImages[0], sales: 1256, stock: 150, isNew: true, isHot: true, categoryId: '1', subCategoryId: '1-3' },
      { id: '2', name: 'Smart Watch Pro', price: 299.99, originalPrice: 349.99, image: productImages[1], sales: 892, stock: 80, isNew: true, isHot: true, categoryId: '1', subCategoryId: '1-1' },
      { id: '6', name: 'Vintage Camera', price: 249.99, image: productImages[5], sales: 234, stock: 40, categoryId: '1', subCategoryId: '1-4' },
      { id: '8', name: 'Wireless Earbuds', price: 79.99, image: productImages[7], sales: 3456, stock: 300, isHot: true, categoryId: '1', subCategoryId: '1-3' },
      { id: '13', name: 'Bluetooth Speaker', price: 129.99, originalPrice: 149.99, image: productImages[12], sales: 567, stock: 70, categoryId: '1', subCategoryId: '1-3' },
      { id: '14', name: 'Gaming Headset', price: 179.99, image: productImages[13], sales: 1234, stock: 90, isHot: true, categoryId: '1', subCategoryId: '1-3' },
      { id: '16', name: 'Smart Watch Classic', price: 199.99, image: productImages[15], sales: 890, stock: 100, categoryId: '1', subCategoryId: '1-1' },
      { id: '17', name: 'iPhone 15 Pro', price: 999.99, image: productImages[0], sales: 567, stock: 50, isNew: true, categoryId: '1', subCategoryId: '1-1' },
      { id: '18', name: 'MacBook Air', price: 1299.99, originalPrice: 1499.99, image: productImages[1], sales: 234, stock: 30, categoryId: '1', subCategoryId: '1-2' },
      { id: '19', name: 'Sony Camera Lens', price: 599.99, image: productImages[5], sales: 89, stock: 20, categoryId: '1', subCategoryId: '1-4' },
      
      // Fashion (categoryId: '2')
      { id: '3', name: 'Designer Sunglasses', price: 149.99, image: productImages[2], sales: 567, stock: 60, categoryId: '2', subCategoryId: '2-1' },
      { id: '7', name: 'Luxury Handbag', price: 399.99, originalPrice: 499.99, image: productImages[6], sales: 445, stock: 50, categoryId: '2', subCategoryId: '2-2' },
      { id: '10', name: 'Leather Wallet', price: 49.99, image: productImages[9], sales: 1567, stock: 120, categoryId: '2', subCategoryId: '2-1' },
      { id: '12', name: 'Canvas Backpack', price: 69.99, image: productImages[11], sales: 2345, stock: 150, categoryId: '2', subCategoryId: '2-4' },
      { id: '20', name: 'Men\'s Casual Shirt', price: 39.99, image: productImages[2], sales: 890, stock: 200, categoryId: '2', subCategoryId: '2-1' },
      { id: '21', name: 'Women\'s Summer Dress', price: 59.99, originalPrice: 79.99, image: productImages[6], sales: 1234, stock: 150, categoryId: '2', subCategoryId: '2-2' },
      { id: '22', name: 'Kids T-Shirt', price: 19.99, image: productImages[2], sales: 567, stock: 300, categoryId: '2', subCategoryId: '2-3' },
      { id: '23', name: 'Running Shoes', price: 89.99, image: productImages[11], sales: 789, stock: 100, categoryId: '2', subCategoryId: '2-4' },
      
      // Home (categoryId: '3')
      { id: '15', name: 'Smart Home Hub', price: 199.99, originalPrice: 249.99, image: productImages[14], sales: 456, stock: 60, isNew: true, categoryId: '3', subCategoryId: '3-1' },
      { id: '24', name: 'Modern Sofa', price: 599.99, image: productImages[14], sales: 123, stock: 20, categoryId: '3', subCategoryId: '3-1' },
      { id: '25', name: 'Wall Art Decor', price: 49.99, image: productImages[9], sales: 567, stock: 80, categoryId: '3', subCategoryId: '3-2' },
      { id: '26', name: 'Kitchen Blender', price: 79.99, originalPrice: 99.99, image: productImages[4], sales: 890, stock: 100, categoryId: '3', subCategoryId: '3-3' },
      { id: '27', name: 'Coffee Table', price: 199.99, image: productImages[14], sales: 234, stock: 40, categoryId: '3', subCategoryId: '3-1' },
      { id: '28', name: 'Table Lamp', price: 39.99, image: productImages[4], sales: 456, stock: 120, categoryId: '3', subCategoryId: '3-2' },
      { id: '29', name: 'Cookware Set', price: 129.99, image: productImages[4], sales: 345, stock: 60, categoryId: '3', subCategoryId: '3-3' },
      
      // Beauty (categoryId: '4')
      { id: '5', name: 'Skincare Gift Set', price: 89.99, originalPrice: 119.99, image: productImages[4], sales: 678, stock: 90, isNew: true, categoryId: '4', subCategoryId: '4-1' },
      { id: '30', name: 'Anti-Aging Serum', price: 69.99, image: productImages[4], sales: 1234, stock: 150, categoryId: '4', subCategoryId: '4-1' },
      { id: '31', name: 'Lipstick Set', price: 29.99, image: productImages[4], sales: 2345, stock: 200, categoryId: '4', subCategoryId: '4-2' },
      { id: '32', name: 'Shampoo & Conditioner', price: 24.99, image: productImages[4], sales: 1567, stock: 180, categoryId: '4', subCategoryId: '4-3' },
      { id: '33', name: 'Face Mask Pack', price: 19.99, image: productImages[4], sales: 890, stock: 250, categoryId: '4', subCategoryId: '4-1' },
      { id: '34', name: 'Eyeshadow Palette', price: 34.99, originalPrice: 49.99, image: productImages[4], sales: 678, stock: 120, categoryId: '4', subCategoryId: '4-2' },
      
      // Sports (categoryId: '5')
      { id: '4', name: 'Running Sneakers', price: 129.99, originalPrice: 159.99, image: productImages[3], sales: 2341, stock: 200, isHot: true, categoryId: '5', subCategoryId: '5-1' },
      { id: '9', name: 'Fitness Tracker', price: 59.99, originalPrice: 79.99, image: productImages[8], sales: 1892, stock: 180, categoryId: '5', subCategoryId: '5-2' },
      { id: '11', name: 'Basketball Shoes', price: 159.99, originalPrice: 189.99, image: productImages[10], sales: 789, stock: 100, categoryId: '5', subCategoryId: '5-1' },
      { id: '35', name: 'Yoga Mat', price: 29.99, image: productImages[3], sales: 1234, stock: 150, categoryId: '5', subCategoryId: '5-2' },
      { id: '36', name: 'Camping Tent', price: 199.99, image: productImages[10], sales: 234, stock: 40, categoryId: '5', subCategoryId: '5-3' },
      { id: '37', name: 'Dumbbell Set', price: 79.99, image: productImages[8], sales: 567, stock: 80, categoryId: '5', subCategoryId: '5-2' },
      { id: '38', name: 'Hiking Boots', price: 149.99, image: productImages[10], sales: 345, stock: 60, categoryId: '5', subCategoryId: '5-3' },
      
      // Books (categoryId: '6')
      { id: '39', name: 'Best Seller Novel', price: 14.99, image: productImages[9], sales: 5678, stock: 500, categoryId: '6', subCategoryId: '6-1' },
      { id: '40', name: 'Self-Help Book', price: 19.99, image: productImages[9], sales: 3456, stock: 400, categoryId: '6', subCategoryId: '6-2' },
      { id: '41', name: 'Programming Guide', price: 39.99, image: productImages[9], sales: 1234, stock: 200, categoryId: '6', subCategoryId: '6-3' },
      { id: '42', name: 'Science Fiction', price: 12.99, image: productImages[9], sales: 2345, stock: 350, categoryId: '6', subCategoryId: '6-1' },
      { id: '43', name: 'Biography', price: 24.99, image: productImages[9], sales: 890, stock: 180, categoryId: '6', subCategoryId: '6-2' },
      { id: '44', name: 'Math Textbook', price: 49.99, image: productImages[9], sales: 456, stock: 100, categoryId: '6', subCategoryId: '6-3' }
    ];
    
    let filteredProducts = allProducts;
    
    if (data && data.categoryId) {
      filteredProducts = allProducts.filter(p => p.categoryId === data.categoryId);
    }
    
    if (data && data.subCategoryId) {
      filteredProducts = allProducts.filter(p => p.subCategoryId === data.subCategoryId);
    }
    
    const limit = data && data.limit ? data.limit : filteredProducts.length;
    const page = data && data.page ? data.page : 1;
    const pageSize = data && data.pageSize ? data.pageSize : 20;
    
    const startIndex = (page - 1) * pageSize;
    const paginatedProducts = filteredProducts.slice(startIndex, startIndex + pageSize);
    
    return {
      list: limit ? filteredProducts.slice(0, limit) : paginatedProducts,
      total: filteredProducts.length
    };
  }
  
  if (url.includes('/goods/search')) {
    const allProducts = [
      { id: '1', name: 'Premium Wireless Headphones', price: 99.99, originalPrice: 129.99, image: productImages[0], sales: 1256, stock: 150, isNew: true, isHot: true, categoryId: '1', subCategoryId: '1-1' },
      { id: '2', name: 'Smart Watch Pro', price: 199.99, originalPrice: 249.99, image: productImages[1], sales: 2341, stock: 200, isHot: true, categoryId: '1', subCategoryId: '1-2' },
      { id: '3', name: 'Laptop Ultra', price: 899.99, originalPrice: 999.99, image: productImages[2], sales: 567, stock: 100, categoryId: '1', subCategoryId: '1-3' },
      { id: '4', name: 'Running Sneakers', price: 129.99, originalPrice: 159.99, image: productImages[3], sales: 2341, stock: 200, isHot: true, categoryId: '5', subCategoryId: '5-1' },
      { id: '5', name: 'Skincare Gift Set', price: 89.99, originalPrice: 119.99, image: productImages[4], sales: 678, stock: 90, isNew: true, categoryId: '4', subCategoryId: '4-1' },
      { id: '6', name: 'Designer T-Shirt', price: 39.99, originalPrice: 49.99, image: productImages[5], sales: 1567, stock: 300, categoryId: '2', subCategoryId: '2-1' },
      { id: '7', name: 'Modern Sofa', price: 599.99, originalPrice: 699.99, image: productImages[6], sales: 234, stock: 50, categoryId: '3', subCategoryId: '3-1' },
      { id: '8', name: 'Wireless Earbuds', price: 79.99, image: productImages[7], sales: 3456, stock: 250, isNew: true, categoryId: '1', subCategoryId: '1-1' },
      { id: '9', name: 'Fitness Tracker', price: 59.99, originalPrice: 79.99, image: productImages[8], sales: 1892, stock: 180, categoryId: '5', subCategoryId: '5-2' },
      { id: '10', name: 'Leather Handbag', price: 149.99, originalPrice: 189.99, image: productImages[9], sales: 890, stock: 120, categoryId: '2', subCategoryId: '2-2' }
    ];
    
    let filteredProducts = allProducts;
    
    if (data && data.keyword) {
      const keyword = data.keyword.toLowerCase();
      filteredProducts = allProducts.filter(p => 
        p.name.toLowerCase().includes(keyword) || 
        p.categoryId.toLowerCase().includes(keyword)
      );
    }
    
    const page = data && data.page ? data.page : 1;
    const pageSize = data && data.pageSize ? data.pageSize : 20;
    
    const startIndex = (page - 1) * pageSize;
    const paginatedProducts = filteredProducts.slice(startIndex, startIndex + pageSize);
    
    return {
      list: paginatedProducts,
      total: filteredProducts.length
    };
  }
  
  if (url.includes('/goods/detail')) {
    const productId = data.id || '1';
    return {
      goods: {
        id: productId,
        name: 'Premium Wireless Headphones',
        description: 'High-quality wireless headphones with active noise cancellation, 30-hour battery life, and premium sound quality. Features include Bluetooth 5.0, comfortable memory foam ear cushions, and a sleek modern design. Perfect for music lovers, professionals, and travelers.',
        price: 99.99,
        originalPrice: 129.99,
        discount: 23,
        image: productImages[0],
        images: [productImages[0], productImages[7], productImages[12]],
        sales: 1256,
        stock: 150,
        isNew: true,
        isHot: true,
        freeShipping: true,
        detail: '<p>Premium Wireless Headphones</p><p>Features:</p><ul><li>Active Noise Cancellation</li><li>30-hour Battery Life</li><li>Bluetooth 5.0</li><li>Memory Foam Ear Cushions</li></ul>'
      },
      specs: [
        {
          id: 'color',
          name: 'Color',
          options: [
            { id: 'black', name: 'Black' },
            { id: 'white', name: 'White' },
            { id: 'blue', name: 'Blue' },
            { id: 'rose', name: 'Rose Gold' }
          ]
        }
      ],
      shop: {
        id: '1',
        name: 'Tech Official Store',
        logo: productImages[0],
        productCount: 256,
        followerCount: 12500
      }
    };
  }
  
  if (url.includes('/cart/list')) {
    return {
      list: [
        { id: '1', goodsId: '1', name: 'Premium Wireless Headphones', price: 99.99, image: productImages[0], quantity: 1, selected: false, spec: 'Black' },
        { id: '2', goodsId: '4', name: 'Running Sneakers', price: 129.99, originalPrice: 159.99, image: productImages[3], quantity: 1, selected: false, spec: 'Size: 42' }
      ]
    };
  }
  
  if (url.includes('/cart/count')) {
    return { count: 2 };
  }
  
  if (url.includes('/order/pay')) {
    return {
      payment: {
        timeStamp: Date.now().toString(),
        nonceStr: 'mock_nonce_' + Date.now(),
        package: 'prepay_id=mock_prepay_id',
        signType: 'MD5',
        paySign: 'mock_pay_sign'
      }
    };
  }
  
  if (url.includes('/order/cancel')) {
    return { success: true };
  }
  
  if (url.includes('/order/confirm')) {
    return { success: true };
  }
  
  if (url.includes('/order/list')) {
    const allOrders = [
      {
        id: '1',
        orderNo: 'ORD202403080001',
        status: 'pending',
        statusText: 'Pending Payment',
        totalPrice: '229.98',
        shopName: 'Tech Official Store',
        createTime: '2024-03-08 10:30:00',
        goods: [
          { id: '1', name: 'Premium Wireless Headphones', image: productImages[0], price: 99.99, quantity: 1, spec: 'Black' },
          { id: '2', name: 'Running Sneakers', image: productImages[3], price: 129.99, quantity: 1, spec: 'Size: 42' }
        ]
      },
      {
        id: '2',
        orderNo: 'ORD202403080002',
        status: 'paid',
        statusText: 'Paid',
        totalPrice: '79.99',
        shopName: 'Audio World',
        createTime: '2024-03-08 09:15:00',
        payTime: '2024-03-08 09:20:00',
        goods: [
          { id: '5', name: 'Wireless Earbuds', image: productImages[7], price: 79.99, quantity: 1, spec: 'White' }
        ]
      },
      {
        id: '3',
        orderNo: 'ORD202403070002',
        status: 'shipped',
        statusText: 'Shipped',
        totalPrice: '299.99',
        shopName: 'Fashion Store',
        createTime: '2024-03-07 14:20:00',
        payTime: '2024-03-07 14:25:00',
        shipTime: '2024-03-08 09:00:00',
        goods: [
          { id: '3', name: 'Smart Watch Pro', image: productImages[1], price: 299.99, quantity: 1 }
        ]
      },
      {
        id: '4',
        orderNo: 'ORD202403060001',
        status: 'completed',
        statusText: 'Completed',
        totalPrice: '59.99',
        shopName: 'Sports Gear',
        createTime: '2024-03-06 11:30:00',
        payTime: '2024-03-06 11:35:00',
        shipTime: '2024-03-06 15:00:00',
        completeTime: '2024-03-07 10:30:00',
        goods: [
          { id: '6', name: 'Fitness Tracker', image: productImages[8], price: 59.99, quantity: 1, spec: 'Black' }
        ]
      },
      {
        id: '5',
        orderNo: 'ORD202403050003',
        status: 'completed',
        statusText: 'Completed',
        totalPrice: '149.99',
        shopName: 'Style Boutique',
        createTime: '2024-03-05 16:45:00',
        payTime: '2024-03-05 16:50:00',
        shipTime: '2024-03-06 10:00:00',
        completeTime: '2024-03-08 15:30:00',
        goods: [
          { id: '4', name: 'Designer Sunglasses', image: productImages[2], price: 149.99, quantity: 1 }
        ]
      },
      {
        id: '6',
        orderNo: 'ORD202403010001',
        status: 'refund',
        statusText: 'Refund',
        totalPrice: '99.99',
        shopName: 'Tech Official Store',
        createTime: '2024-03-01 10:15:00',
        payTime: '2024-03-01 10:20:00',
        shipTime: '2024-03-01 14:30:00',
        refundTime: '2024-03-03 09:45:00',
        goods: [
          { id: '1', name: 'Premium Wireless Headphones', image: productImages[0], price: 99.99, quantity: 1, spec: 'Black' }
        ]
      }
    ];
    
    const status = data?.status;
    let filteredOrders = allOrders;
    if (status && status !== 'all') {
      filteredOrders = allOrders.filter(order => order.status === status);
    }
    
    return {
      list: filteredOrders,
      total: filteredOrders.length,
      counts: {
        pending: allOrders.filter(o => o.status === 'pending').length,
        paid: allOrders.filter(o => o.status === 'paid').length,
        shipped: allOrders.filter(o => o.status === 'shipped').length,
        completed: allOrders.filter(o => o.status === 'completed').length,
        refund: allOrders.filter(o => o.status === 'refund').length
      }
    };
  }
  
  if (url.includes('/order/detail')) {
    return {
      order: {
        id: data.id || '1',
        orderNo: 'ORD202403080001',
        status: 'pending',
        statusText: 'Pending Payment',
        totalPrice: '229.98',
        subtotal: '229.98',
        shipping: 0,
        discount: 0,
        shopName: 'Tech Official Store',
        createTime: '2024-03-08 10:30:00',
        remark: 'Please pack carefully',
        address: {
          name: 'John Doe',
          phone: '+1 234 567 8900',
          province: 'California',
          city: 'Los Angeles',
          district: 'Downtown',
          detail: '123 Main Street, Apt 4B'
        },
        goods: [
          { id: '1', name: 'Premium Wireless Headphones', image: productImages[0], price: 99.99, quantity: 1, spec: 'Black' },
          { id: '2', name: 'Running Sneakers', image: productImages[3], price: 129.99, quantity: 1, spec: 'Size: 42' }
        ]
      }
    };
  }
  
  if (url.includes('/user/info') || url.includes('/user/profile')) {
    return {
      id: '1',
      nickname: 'John Doe',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200',
      phone: '+1 234 567 8900',
      email: 'john@example.com',
      gender: 'Male',
      birthday: '1990-01-01'
    };
  }
  
  if (url.includes('/address/list')) {
    return {
      list: [
        {
          id: '1',
          name: 'John Doe',
          phone: '+1 234 567 8900',
          province: 'California',
          city: 'Los Angeles',
          district: 'Downtown',
          detail: '123 Main Street, Apt 4B',
          isDefault: true
        },
        {
          id: '2',
          name: 'John Doe',
          phone: '+1 234 567 8901',
          province: 'New York',
          city: 'New York City',
          district: 'Manhattan',
          detail: '456 Park Avenue, Suite 100',
          isDefault: false
        }
      ]
    };
  }
  
  if (url.includes('/address/detail')) {
    return {
      address: {
        id: data.id || '1',
        name: 'John Doe',
        phone: '+1 234 567 8900',
        province: 'California',
        city: 'Los Angeles',
        district: 'Downtown',
        detail: '123 Main Street, Apt 4B',
        isDefault: true
      }
    };
  }
  
  if (url.includes('/coupon/list')) {
    return {
      list: [
        { id: '1', name: 'New User Coupon', discount: 20, minAmount: 100, startTime: '2024-01-01', endTime: '2024-12-31' },
        { id: '2', name: 'Summer Sale', discount: 15, minAmount: 80, startTime: '2024-06-01', endTime: '2024-08-31' },
        { id: '3', name: 'Free Shipping', discount: 10, minAmount: 50, startTime: '2024-01-01', endTime: '2024-12-31' }
      ]
    };
  }
  
  if (url.includes('/favorite/list')) {
    return {
      list: [
        { id: '1', name: 'Premium Wireless Headphones', price: 99.99, originalPrice: 129.99, image: productImages[0], sales: 1256 },
        { id: '4', name: 'Running Sneakers', price: 129.99, originalPrice: 159.99, image: productImages[3], sales: 2341 },
        { id: '8', name: 'Wireless Earbuds', price: 79.99, image: productImages[7], sales: 3456 }
      ]
    };
  }
  
  if (url.includes('/shop/followed')) {
    return {
      list: [
        { id: '1', name: 'Tech Official Store', productCount: 256, followerCount: 12500 },
        { id: '2', name: 'Fashion Store', productCount: 189, followerCount: 8900 },
        { id: '3', name: 'Style Boutique', productCount: 145, followerCount: 5600 }
      ]
    };
  }
  
  if (url.includes('/review/list')) {
    return {
      list: [
        { id: '1', userName: 'Alice', rating: 5, content: 'Great product! Sound quality is amazing.', time: '2024-03-05' },
        { id: '2', userName: 'Bob', rating: 4, content: 'Good value for money, comfortable to wear.', time: '2024-03-03' }
      ],
      total: 2
    };
  }
  
  if (url.includes('/search/hot')) {
    return {
      list: ['Headphones', 'Smart Watch', 'Sneakers', 'Sunglasses', 'Earbuds', 'Backpack', 'Camera', 'Speaker']
    };
  }

  if (url.includes('/auth/login')) {
    return {
      token: 'mock_token_' + Date.now(),
      userInfo: {
        id: '1',
        nickname: 'John Doe',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200',
        phone: '+1 234 567 8900'
      }
    };
  }

  if (url.includes('/auth/register')) {
    return {
      token: 'mock_token_' + Date.now(),
      userInfo: {
        id: '1',
        nickname: 'New User',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200',
        phone: data.account || '+1 234 567 8900'
      }
    };
  }

  if (url.includes('/auth/send-code')) {
    return {
      success: true,
      message: 'Verification code sent'
    };
  }

  if (url.includes('/auth/reset-password')) {
    return {
      success: true,
      message: 'Password reset successful'
    };
  }

  if (url.includes('/auth/logout')) {
    return {
      success: true,
      message: 'Logout successful'
    };
  }
  
  if (method === 'POST' || method === 'PUT' || method === 'DELETE') {
    return {
      success: true,
      message: 'Operation successful'
    };
  }

  return {};
};

module.exports = {
  request,
  get,
  post,
  put,
  del
};
