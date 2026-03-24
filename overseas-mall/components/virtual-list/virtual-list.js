
Component({
  properties: {
    list: {
      type: Array,
      value: []
    },
    itemHeight: {
      type: Number,
      value: 200
    },
    containerHeight: {
      type: Number,
      value: 1000
    }
  },

  data: {
    visibleData: [],
    startIndex: 0,
    endIndex: 0,
    translateY: 0
  },

  observers: {
    'list': function(list) {
      if (list && list.length > 0) {
        this.initList();
      }
    }
  },

  lifetimes: {
    attached() {
      this.initList();
    }
  },

  methods: {
    initList() {
      const { list, itemHeight, containerHeight } = this.properties;
      const visibleCount = Math.ceil(containerHeight / itemHeight) + 2;
      const endIndex = Math.min(visibleCount, list.length);
      
      this.setData({
        visibleData: list.slice(0, endIndex),
        endIndex,
        startIndex: 0,
        translateY: 0
      });
    },

    onScroll(e) {
      const { scrollTop } = e.detail;
      const { list, itemHeight, containerHeight } = this.properties;
      
      const startIndex = Math.floor(scrollTop / itemHeight);
      const visibleCount = Math.ceil(containerHeight / itemHeight) + 2;
      const endIndex = Math.min(startIndex + visibleCount, list.length);
      
      const translateY = startIndex * itemHeight;
      
      if (this.data.startIndex !== startIndex) {
        this.setData({
          visibleData: list.slice(startIndex, endIndex),
          startIndex,
          endIndex,
          translateY
        });
      }
    }
  }
});
