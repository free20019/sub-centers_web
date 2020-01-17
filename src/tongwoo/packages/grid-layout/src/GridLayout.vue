<template>
  <div class="tw-grid-layout">
    <template v-if="$slots.default">
      <slot></slot>
    </template>
  </div>
</template>

<script>
import { hasNumber } from 'assets/js/util'
import { irregularPanelInfo } from './gridLayout'
export default {
  name: 'TGridLayout',
  data() {
    return {
      equalType: [1, 4, 9, 16, 25]
    }
  },
  props: {
    margin: {
      type: [Number, String],
      default: 0
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initPanelInfo()
    })
  },
  computed: {},
  methods: {
    initPanelInfo() {
      const panel = this.$slots.default
      // console.info('init-each:', panel)
      if (panel && panel.length > 0) {
        if (this.equalType.indexOf(panel.length) >= 0) {
          this.$slots.default.forEach((item, index) => {
            const multiple = this.equalType.indexOf(panel.length) + 1
            this.equalPanleStyle(item.elm, multiple, index)
          })
        } else if (panel.length > 25) {
          this.$slots.default.forEach((item, index) => {
            this.irregularPanleStyle(item.elm, index, this.$slots.default)
            item.elm.style.width = `100%`
            const flag = hasNumber(this.margin)
            const size = (flag && this.margin) || parseInt(this.margin) || 0
            if (size > 0 && panel.length > index + 1)
              item.elm.style.marginBottom = `${size}px`
          })
        } else {
          this.$slots.default.forEach((item, index) => {
            this.irregularPanleStyle(item.elm, index, this.$slots.default)
          })
        }
        //  else if (panel && panel.length === 2) {
        //   this.$slots.default.forEach((item, index) => {
        //     this.towPanelStyle(item.elm, index)
        //   })
        // } else if (panel && panel.length === 3) {
        //   this.$slots.default.forEach((item, index) => {
        //     this.threePanelStyle(item.elm, index)
        //   })
        // }
      }
    },
    equalPanleStyle(el, multiple, index) {
      const flag = hasNumber(this.margin)
      const size = (flag && this.margin) || parseInt(this.margin) || 0
      if (size > 0) {
        const margin = ((multiple - 1) * size) / multiple
        el.style.width = `calc(${100 / multiple}% - ${margin}px)`
        el.style.height = `calc(${100 / multiple}% - ${margin}px)`
        if ((index + 1) % multiple !== 0) el.style.marginRight = `${size}px`
        if (multiple * multiple - multiple > index)
          el.style.marginBottom = `${size}px`
      } else {
        el.style.width = `${100 / multiple}%`
        el.style.height = `${100 / multiple}%`
      }
    },
    irregularPanleStyle(el, index, list) {
      const flag = hasNumber(this.margin)
      const size = (flag && this.margin) || parseInt(this.margin) || 0
      const item = irregularPanelInfo(list.length)[index] || {}
      if (item === {}) return
      el.style.width = `${item.width}%`
      el.style.height = `${item.height}%`
      if (size > 0) {
        if (item.col > 1) {
          const marginSize = (size / item.col) * (item.col - 1)
          el.style.width = `calc(${item.width}% - ${marginSize}px)`
          if (item.marginType === 1 || item.marginType === 3)
            el.style.marginRight = `${size}px`
        }
        if (item.row > 1) {
          const marginSize = (size / item.row) * (item.row - 1)
          el.style.height = `calc(${item.height}% - ${marginSize}px)`
          if (item.marginType === 2 || item.marginType === 3)
            el.style.marginBottom = `${size}px`
        }
      }
    }
  },
  watch: {
    margin() {
      this.$nextTick(() => {
        this.initPanelInfo()
      })
    }
  }
}
</script>