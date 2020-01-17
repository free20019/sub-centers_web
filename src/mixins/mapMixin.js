export const AMapMixin = {
  data() {
    return {
      map: {
        loaded: false
      }
    }
  },
  computed: {
    amap: {
      get() {
        return this.map.amap
      },
      set(map) {
        if (map instanceof AMap) this.map.amap = map
        else throw new Error('"amap" 必须传入AMap对象。')
      }
    }
  }
}
