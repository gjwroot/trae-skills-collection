Component({
  properties: {
    show: {
      type: Boolean,
      value: false
    },
    type: {
      type: String,
      value: 'loading'
    },
    text: {
      type: String,
      value: ''
    },
    title: {
      type: String,
      value: ''
    },
    desc: {
      type: String,
      value: ''
    },
    icon: {
      type: String,
      value: ''
    },
    showRetry: {
      type: Boolean,
      value: true
    },
    retryText: {
      type: String,
      value: 'Retry'
    },
    showAction: {
      type: Boolean,
      value: false
    },
    actionText: {
      type: String,
      value: 'Action'
    }
  },

  methods: {
    onRetry() {
      this.triggerEvent('retry');
    },
    onAction() {
      this.triggerEvent('action');
    }
  }
});
