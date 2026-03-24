class I18nManager {
  constructor() {
    this.languageKey = 'language';
    this.defaultLanguage = 'en';
    
    this.translations = {
      'en': {
        common: {
          confirm: 'Confirm',
          cancel: 'Cancel',
          save: 'Save',
          delete: 'Delete',
          edit: 'Edit',
          submit: 'Submit',
          loading: 'Loading...',
          success: 'Success',
          error: 'Error',
          warning: 'Warning',
          info: 'Info'
        },
        home: {
          title: 'Overseas Mall',
          search: 'Search products...',
          hotSale: 'Hot Sale',
          newArrivals: 'New Arrivals',
          recommended: 'Recommended'
        },
        cart: {
          title: 'Shopping Cart',
          empty: 'Your cart is empty',
          total: 'Total',
          checkout: 'Checkout',
          selectAll: 'Select All',
          deleteSelected: 'Delete Selected'
        },
        order: {
          title: 'My Orders',
          empty: 'No orders yet',
          orderNumber: 'Order #',
          orderTime: 'Order Time',
          totalAmount: 'Total Amount',
          orderStatus: {
            pending: 'Pending',
            paid: 'Paid',
            shipped: 'Shipped',
            delivered: 'Delivered',
            completed: 'Completed',
            cancelled: 'Cancelled'
          }
        },
        user: {
          profile: 'Profile',
          settings: 'Settings',
          logout: 'Log Out',
          login: 'Login',
          register: 'Register',
          nickname: 'Nickname',
          phone: 'Phone',
          email: 'Email'
        },
        address: {
          title: 'Shipping Address',
          add: 'Add Address',
          edit: 'Edit Address',
          name: 'Name',
          phone: 'Phone',
          region: 'Region',
          detail: 'Detail Address',
          default: 'Set as Default'
        },
        coupon: {
          title: 'My Coupons',
          empty: 'No coupons',
          valid: 'Valid',
          expired: 'Expired',
          used: 'Used',
          minAmount: 'Min. Amount',
          discount: 'Discount'
        }
      },
      'zh-CN': {
        common: {
          confirm: '确认',
          cancel: '取消',
          save: '保存',
          delete: '删除',
          edit: '编辑',
          submit: '提交',
          loading: '加载中...',
          success: '成功',
          error: '错误',
          warning: '警告',
          info: '提示'
        },
        home: {
          title: '海外商城',
          search: '搜索商品...',
          hotSale: '热卖',
          newArrivals: '新品上架',
          recommended: '推荐'
        },
        cart: {
          title: '购物车',
          empty: '购物车是空的',
          total: '合计',
          checkout: '结算',
          selectAll: '全选',
          deleteSelected: '删除选中'
        },
        order: {
          title: '我的订单',
          empty: '暂无订单',
          orderNumber: '订单 #',
          orderTime: '下单时间',
          totalAmount: '总金额',
          orderStatus: {
            pending: '待付款',
            paid: '已付款',
            shipped: '已发货',
            delivered: '已送达',
            completed: '已完成',
            cancelled: '已取消'
          }
        },
        user: {
          profile: '个人资料',
          settings: '设置',
          logout: '退出登录',
          login: '登录',
          register: '注册',
          nickname: '昵称',
          phone: '手机号',
          email: '邮箱'
        },
        address: {
          title: '收货地址',
          add: '添加地址',
          edit: '编辑地址',
          name: '姓名',
          phone: '电话',
          region: '地区',
          detail: '详细地址',
          default: '设为默认'
        },
        coupon: {
          title: '我的优惠券',
          empty: '暂无优惠券',
          valid: '可使用',
          expired: '已过期',
          used: '已使用',
          minAmount: '最低消费',
          discount: '优惠金额'
        }
      },
      'zh-TW': {
        common: {
          confirm: '確認',
          cancel: '取消',
          save: '儲存',
          delete: '刪除',
          edit: '編輯',
          submit: '提交',
          loading: '載入中...',
          success: '成功',
          error: '錯誤',
          warning: '警告',
          info: '提示'
        },
        home: {
          title: '海外商城',
          search: '搜尋商品...',
          hotSale: '熱賣',
          newArrivals: '新品上架',
          recommended: '推薦'
        },
        cart: {
          title: '購物車',
          empty: '購物車是空的',
          total: '合計',
          checkout: '結帳',
          selectAll: '全選',
          deleteSelected: '刪除選中'
        },
        order: {
          title: '我的訂單',
          empty: '暫無訂單',
          orderNumber: '訂單 #',
          orderTime: '下單時間',
          totalAmount: '總金額',
          orderStatus: {
            pending: '待付款',
            paid: '已付款',
            shipped: '已發貨',
            delivered: '已送達',
            completed: '已完成',
            cancelled: '已取消'
          }
        },
        user: {
          profile: '個人資料',
          settings: '設定',
          logout: '退出登錄',
          login: '登錄',
          register: '註冊',
          nickname: '暱稱',
          phone: '手機號',
          email: '郵箱'
        },
        address: {
          title: '收貨地址',
          add: '添加地址',
          edit: '編輯地址',
          name: '姓名',
          phone: '電話',
          region: '地區',
          detail: '詳細地址',
          default: '設為默認'
        },
        coupon: {
          title: '我的優惠券',
          empty: '暫無優惠券',
          valid: '可使用',
          expired: '已過期',
          used: '已使用',
          minAmount: '最低消費',
          discount: '優惠金額'
        }
      },
      'ja': {
        common: {
          confirm: '確認',
          cancel: 'キャンセル',
          save: '保存',
          delete: '削除',
          edit: '編集',
          submit: '送信',
          loading: '読み込み中...',
          success: '成功',
          error: 'エラー',
          warning: '警告',
          info: '情報'
        },
        home: {
          title: '海外モール',
          search: '商品を検索...',
          hotSale: '人気',
          newArrivals: '新着',
          recommended: 'おすすめ'
        },
        cart: {
          title: 'ショッピングカート',
          empty: 'カートは空です',
          total: '合計',
          checkout: 'チェックアウト',
          selectAll: '全選択',
          deleteSelected: '選択したものを削除'
        },
        order: {
          title: '注文履歴',
          empty: '注文はありません',
          orderNumber: '注文 #',
          orderTime: '注文時間',
          totalAmount: '合計金額',
          orderStatus: {
            pending: '支払い待ち',
            paid: '支払い済み',
            shipped: '発送済み',
            delivered: '配達済み',
            completed: '完了',
            cancelled: 'キャンセル'
          }
        },
        user: {
          profile: 'プロフィール',
          settings: '設定',
          logout: 'ログアウト',
          login: 'ログイン',
          register: '新規登録',
          nickname: 'ニックネーム',
          phone: '電話番号',
          email: 'メール'
        },
        address: {
          title: '配送先',
          add: '住所を追加',
          edit: '住所を編集',
          name: '氏名',
          phone: '電話',
          region: '地域',
          detail: '詳細住所',
          default: 'デフォルトに設定'
        },
        coupon: {
          title: 'クーポン',
          empty: 'クーポンはありません',
          valid: '有効',
          expired: '期限切れ',
          used: '使用済み',
          minAmount: '最低利用金額',
          discount: '割引額'
        }
      },
      'ko': {
        common: {
          confirm: '확인',
          cancel: '취소',
          save: '저장',
          delete: '삭제',
          edit: '편집',
          submit: '제출',
          loading: '로딩 중...',
          success: '성공',
          error: '오류',
          warning: '경고',
          info: '정보'
        },
        home: {
          title: '해외 쇼핑몰',
          search: '상품 검색...',
          hotSale: '인기 상품',
          newArrivals: '신상품',
          recommended: '추천'
        },
        cart: {
          title: '장바구니',
          empty: '장바구니가 비어있습니다',
          total: '합계',
          checkout: '결제',
          selectAll: '전체 선택',
          deleteSelected: '선택 삭제'
        },
        order: {
          title: '내 주문',
          empty: '주문이 없습니다',
          orderNumber: '주문 #',
          orderTime: '주문 시간',
          totalAmount: '총 금액',
          orderStatus: {
            pending: '결제 대기',
            paid: '결제 완료',
            shipped: '배송 중',
            delivered: '배송 완료',
            completed: '완료',
            cancelled: '취소됨'
          }
        },
        user: {
          profile: '프로필',
          settings: '설정',
          logout: '로그아웃',
          login: '로그인',
          register: '회원가입',
          nickname: '닉네임',
          phone: '전화번호',
          email: '이메일'
        },
        address: {
          title: '배송지',
          add: '주소 추가',
          edit: '주소 편집',
          name: '이름',
          phone: '전화번호',
          region: '지역',
          detail: '상세 주소',
          default: '기본으로 설정'
        },
        coupon: {
          title: '쿠폰',
          empty: '쿠폰이 없습니다',
          valid: '사용 가능',
          expired: '만료됨',
          used: '사용됨',
          minAmount: '최소 주문 금액',
          discount: '할인 금액'
        }
      }
    };
  }

  getLanguage() {
    try {
      return wx.getStorageSync(this.languageKey) || this.defaultLanguage;
    } catch (error) {
      console.error('Get language failed:', error);
      return this.defaultLanguage;
    }
  }

  setLanguage(language) {
    try {
      if (this.translations[language]) {
        wx.setStorageSync(this.languageKey, language);
        
        const app = getApp();
        if (app) {
          app.globalData.language = language;
        }
        
        return true;
      }
      return false;
    } catch (error) {
      console.error('Set language failed:', error);
      return false;
    }
  }

  t(key, params = {}) {
    const language = this.getLanguage();
    const translation = this.getNestedTranslation(this.translations[language], key);
    
    if (!translation) {
      const fallbackTranslation = this.getNestedTranslation(this.translations[this.defaultLanguage], key);
      return fallbackTranslation || key;
    }
    
    return this.interpolate(translation, params);
  }

  getNestedTranslation(obj, path) {
    return path.split('.').reduce((acc, part) => {
      return acc && acc[part];
    }, obj);
  }

  interpolate(text, params) {
    return text.replace(/\{(\w+)\}/g, (match, key) => {
      return params[key] !== undefined ? params[key] : match;
    });
  }

  getSupportedLanguages() {
    return [
      { code: 'en', name: 'English' },
      { code: 'zh-CN', name: '简体中文' },
      { code: 'zh-TW', name: '繁體中文' },
      { code: 'ja', name: '日本語' },
      { code: 'ko', name: '한국어' }
    ];
  }
}

module.exports = new I18nManager();