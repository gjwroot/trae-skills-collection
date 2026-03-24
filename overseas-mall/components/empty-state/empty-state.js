Component({
  properties: {
    icon: {
      type: String,
      value: 'search'
    },
    iconSize: {
      type: String,
      value: '100px'
    },
    title: {
      type: String,
      value: 'No data'
    },
    desc: {
      type: String,
      value: ''
    },
    showBtn: {
      type: Boolean,
      value: true
    },
    btnText: {
      type: String,
      value: 'Go Shopping'
    },
    btnIcon: {
      type: String,
      value: 'shop-o'
    },
    bgColor: {
      type: String,
      value: 'linear-gradient(135deg, #f0f7ff 0%, #e0efff 100%)'
    }
  },

  methods: {
    onBtnTap() {
      this.triggerEvent('btntap');
    }
  }
});
