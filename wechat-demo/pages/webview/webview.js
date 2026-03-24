Page({
  data: {},

  onLoad() {
    // WebView页面加载
    console.log('WebView页面加载');
  },

  onShareAppMessage() {
    return {
      title: 'WebView示例',
      path: '/pages/webview/webview'
    };
  }
});