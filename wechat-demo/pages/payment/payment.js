const request = require('../../utils/request.js');
const api = require('../../utils/api.js');

Page({
  data: {
    orderId: '',
    totalPrice: '0',
    selectedMethod: 'wechat'
  },

  onLoad(options) {
    if (options.orderId) {
      this.setData({ orderId: options.orderId });
    }
    if (options.price) {
      this.setData({ totalPrice: options.price });
    }
  },

  selectMethod(e) {
    const method = e.currentTarget.dataset.method;
    this.setData({ selectedMethod: method });
  },

  pay() {
    const { orderId, selectedMethod } = this.data;

    // 检查是否是企业小程序（个人小程序无法支付）
    const accountInfo = wx.getAccountInfoSync();
    if (accountInfo.miniProgram.envVersion === 'release') {
      // 正式环境检查
      wx.showModal({
        title: '提示',
        content: '支付功能需要企业资质，个人小程序无法开通支付',
        showCancel: false
      });
      return;
    }

    wx.showLoading({ title: '准备支付...' });

    // 模拟调用后端接口获取支付参数
    // 实际开发中，这里需要：
    // 1. 调用后端创建订单接口
    // 2. 后端调用微信支付统一下单接口
    // 3. 后端返回支付参数给前端
    setTimeout(() => {
      wx.hideLoading();

      if (selectedMethod === 'wechat') {
        // 模拟后端返回的支付参数
        const payData = {
          timeStamp: String(Date.now()),
          nonceStr: 'mock_nonce_str_' + Date.now(),
          package: 'prepay_id=mock_prepay_id',
          signType: 'RSA',
          paySign: 'mock_sign'
        };
        this.wechatPay(payData);
      } else if (selectedMethod === 'alipay') {
        wx.showToast({ title: '支付宝支付暂未开放', icon: 'none' });
      }
    }, 1000);
  },

  wechatPay(payData) {
    // 实际微信支付流程
    // wx.requestPayment({
    //   timeStamp: payData.timeStamp,
    //   nonceStr: payData.nonceStr,
    //   package: payData.package,
    //   signType: payData.signType,
    //   paySign: payData.paySign,
    //   success: (res) => {
    //     // 支付成功，查询订单状态
    //     this.queryOrderStatus();
    //   },
    //   fail: (err) => {
    //     if (err.errMsg.includes('cancel')) {
    //       wx.showToast({ title: '用户取消支付', icon: 'none' });
    //     } else {
    //       wx.showToast({ title: '支付失败', icon: 'none' });
    //     }
    //   }
    // });

    // 模拟支付成功（开发者工具无法真实支付）
    wx.showModal({
      title: '支付提示',
      content: '开发者工具无法真实支付，是否模拟支付成功？',
      success: (res) => {
        if (res.confirm) {
          wx.showToast({
            title: '支付成功',
            success: () => {
              setTimeout(() => {
                // 跳转到首页
                wx.switchTab({ url: '/pages/index/index' });
              }, 1000);
            }
          });
        }
      }
    });
  },

  // 查询订单状态
  queryOrderStatus() {
    // 实际开发中需要轮询或接收后端回调
    // 不能依赖前端支付成功回调，因为用户可能关闭小程序
    wx.showLoading({ title: '查询订单状态...' });

    // 模拟查询
    setTimeout(() => {
      wx.hideLoading();
      wx.showToast({ title: '支付成功' });
      setTimeout(() => {
        wx.switchTab({ url: '/pages/index/index' });
      }, 1000);
    }, 1000);
  },

  alipay(payData) {
    // 支付宝支付逻辑（需要支付宝 SDK）
    // 小程序中无法直接使用支付宝，需要跳转 H5 页面
    wx.showToast({ title: '支付宝支付暂未开放', icon: 'none' });
  }
});
