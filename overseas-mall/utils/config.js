module.exports = {
  // 开发环境使用空字符串或 localhost，生产环境替换为真实域名
  // 注意：需要在微信开发者工具中开启「不校验合法域名」选项
  baseUrl: '',
  timeout: 10000,
  appId: 'overseas-mall-app',
  version: '1.0.0',
  
  supportedLanguages: ['zh-CN', 'en-US', 'ja-JP'],
  supportedCurrencies: ['USD', 'EUR', 'GBP', 'JPY'],
  
  defaultLanguage: 'zh-CN',
  defaultCurrency: 'USD',
  
  exchangeRates: {
    USD: 1,
    EUR: 0.85,
    GBP: 0.73,
    JPY: 110.0
  }
};
