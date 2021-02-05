<template>
  <div
    class="tw-layout"
    :class="{ 'tw-drag': footerOption.mousedown, 'tw-border': border }"
    @mouseup="handleLayoutMouseup"
    @mousemove="handleLayoutMousemove"
  >
    <div
      class="tw-layout-header"
      :class="headerClass"
      v-if="headerCenter"
      ref="header"
      :style="layoutHeaderHeigth"
    >
      <slot name="header"></slot>
    </div>
    <div class="tw-layout-left" v-if="$slots.left" :style="layoutLeftWidth">
      <slot name="left"></slot>
      <div class="tw-control-strip" v-if="leftStrip"></div>
    </div>
    <div class="tw-layout-body" v-if="$slots.default" :style="layoutBodyStyle">
      <div
        class="tw-left-change-btn"
        :class="changeBtn"
        @click="changePanel"
        v-if="leftBtnStrip"
      ></div>
      <slot></slot>
    </div>
    <div class="tw-layout-right" v-if="$slots.right" :style="layoutRightWidth">
      <slot name="right"></slot>
      <div class="tw-control-strip" v-if="rightStrip"></div>
    </div>
    <div
      class="tw-layout-footer"
      :class="{
        'tw-control': footerStrip,
        'tw-selected': footerOption.mousedown
      }"
      v-if="$slots.footer"
      :style="layoutFooterHeigth"
    >
      <slot name="footer"></slot>
      <div
        class="tw-control-strip"
        v-if="footerStrip"
        @mousedown="handleFooterStripMousedown"
      ></div>
    </div>
  </div>
</template>

<script>
import { hasNumber } from 'assets/js/util'
export default {
  name: 'TLayout',
  data() {
    return {
      headerHeight: 0,
      layoutSize: {
        left: JSON.parse(this.left),
        right: JSON.parse(this.right),
        header: JSON.parse(this.header),
        footer: JSON.parse(this.footer)
      },
      footerOption: {
        mousedown: false,
        mousePoint: null,
        offset: 0
      },
      changeBtn: 'el-icon-caret-right'
    }
  },
  props: {
    border: {
      type: Boolean,
      default: false
    },
    header: {
      type: [String, Number],
      default: 50
    },
    headerClass: {
      type: String,
      default: ''
    },
    headerAuto: {
      type: Boolean,
      default: false
    },
    left: {
      type: [String, Number],
      default: 300
    },
    leftStrip: {
      type: Boolean,
      default: false
    },
    right: {
      type: [String, Number],
      default: 300
    },
    rightStrip: {
      type: Boolean,
      default: false
    },
    footer: {
      type: [String, Number],
      default: 40
    },
    footerStrip: {
      type: Boolean,
      default: false
    },
    // 是否可以收缩左侧面板
    leftBtnStrip: {
      type: Boolean,
      default: false
    }
  },
  mounted() {
    // console.info('header:', this.header, this.layoutSize.header, this.leftStrip)
    this.$nextTick(() => {
      if (this.headerAuto) {
        this.headerHeight = this.$refs.header.offsetHeight || 0
        window.onresize = () => {
          this.headerHeight = this.$refs.header.offsetHeight || 0
        }
      }
    })
  },
  computed: {
    headerCenter() {
      this.$nextTick(() => {
        /* eslint-disable */
        if (this.headerAuto)
          this.headerHeight = this.$refs.header.offsetHeight || 0
      })
      return this.$slots.header
    },
    layoutLeftWidth() {
      const style = this.layoutLeftOfRightPanelHeight()
      const width = this.layoutPanelSize('left')
      if (this.$slots.left) style.width = width
      return style
    },
    layoutRightWidth() {
      const style = this.layoutLeftOfRightPanelHeight()
      const width = this.layoutPanelSize('right')
      if (this.$slots.right) style.width = width
      return style
    },
    layoutHeaderHeigth() {
      const style = {}
      if (this.headerAuto) return style
      const height = this.layoutPanelSize('header')
      if (this.$slots.header) style.height = height
      return style
    },
    layoutFooterHeigth() {
      const style = {}
      const height = this.layoutPanelSize('footer')
      const intFooter = this.styleValueToInt(height)
      const offset = this.footerOption.offset
      if (this.$slots.footer)
        style.height = offset !== 0 ? intFooter + offset + 'px' : height
      return style
    },
    layoutBodyStyle() {
      const style = this.layoutBodyWidth()
      return this.layoutBodyHeight(style)
    }
  },
  methods: {
    changePanel() {
      if (this.changeBtn == 'el-icon-caret-right') {
        this.changeBtn = 'el-icon-caret-left'
        this.layoutSize.left = 0
      } else if (this.changeBtn == 'el-icon-caret-left') {
        this.changeBtn = 'el-icon-caret-right'
        this.layoutSize.left = 300
      }
    },
    handleLayoutMousemove() {
      const { y } = event
      if (this.$slots.footer) {
        const { mousedown, mousePoint } = this.footerOption
        if (mousedown) {
          this.footerOption.offset = mousePoint - y
        }
      }
    },
    handleLayoutMouseup() {
      if (this.$slots.footer) {
        if (this.footerOption.mousedown) {
          if (this.footerOption.offset !== 0) {
            const footer = this.layoutPanelSize('footer')
            const intFooter = this.styleValueToInt(footer)
            this.layoutSize.footer = intFooter + this.footerOption.offset + 'px'
          }
          this.footerOption.offset = 0
          this.footerOption.mousedown = false
          this.footerOption.mousePoint = null
        }
      }
    },
    handleFooterStripMousedown() {
      this.footerOption.mousedown = true
      this.footerOption.mousePoint = event.y
    },
    layoutPanelSize(type) {
      if (hasNumber(this.layoutSize[type])) return this.layoutSize[type] + 'px'
      return this.layoutSize[type]
    },
    layoutLeftOfRightPanelHeight(style = {}) {
      let header = this.layoutPanelSize('header')
      if (this.headerAuto) header = `${this.headerHeight}px`
      const footer = this.layoutPanelSize('footer')
      const intFooter = this.styleValueToInt(footer)
      const offset = this.footerOption.offset
      const footerStrip = offset !== 0 ? intFooter + offset + 'px' : footer
      if (this.$slots.header && this.$slots.footer)
        style.height = `calc(100% - (${(style.top = header)} + ${footerStrip}))`
      else if (this.$slots.header)
        style.height = `calc(100% - ${(style.top = header)})`
      else if (this.$slots.footer) style.height = `calc(100% - ${footerStrip})`
      return style
    },
    layoutBodyWidth(style = {}) {
      const left = this.layoutPanelSize('left')
      const right = this.layoutPanelSize('right')
      const intLeft = this.styleValueToInt(left)
      const intRight = this.styleValueToInt(right)
      if (this.$slots.left && this.$slots.right) {
        if (intLeft > 0) style.marginLeft = left
        if (intRight > 0) style.marginRight = right
        if (intLeft > 0 || intRight > 0)
          style.width = `calc(100% - (${left} + ${right}))`
      } else if (this.$slots.left && intLeft > 0) {
        style.marginLeft = left
        style.width = `calc(100% - ${left})`
      } else if (this.$slots.right && intRight > 0) {
        style.marginRight = right
        style.width = `calc(100% - ${right})`
      }
      return style
    },
    layoutBodyHeight(style = {}) {
      let header = this.layoutPanelSize('header')
      if (this.headerAuto) header = `${this.headerHeight}px`
      const footer = this.layoutPanelSize('footer')
      const intHeader = this.styleValueToInt(header)
      const intFooter = this.styleValueToInt(footer)
      const offset = this.footerOption.offset
      const footerStrip = offset !== 0 ? intFooter + offset + 'px' : footer
      const flag = intHeader > 0 || intFooter > 0
      if (this.$slots.header && this.$slots.footer && flag) {
        style.height = `calc(100% - (${header} + ${footerStrip}))`
      } else if (this.$slots.header && intHeader > 0)
        style.height = `calc(100% - ${header})`
      else if (this.$slots.footer && intFooter > 0)
        style.height = `calc(100% - ${footerStrip})`
      return style
    },
    layoutSlotBody() {
      const bodyer = this.$slots.default
      const bodyType = ['tw-layout', 'tw-tabs-panel']
      if (
        bodyer.length === 1 &&
        bodyType.indexOf(bodyer[0].elm.className) === 0
      ) {
      }
    },
    regStyleValue(value) {
      const regString = /^[0-9]+px$/
      const regNumber = /^[0-9]+$/
      if (regNumber.test(value)) return `${value}px`
      if (regString.test(value)) return value
      return ''
    },
    styleValueToInt(value) {
      return parseInt(value && value.match(/^[0-9]+/)[0])
    },
    getStyleValueUnit(value) {
      return value && value.match(/px|em|rem|%$/)[0]
    },
    cloneData(data) {
      return JSON.parse(JSON.stringify(data))
    }
  },
  render(h) {
    const header = (
      <div
        class={['tw-layout-header', this.headerClass]}
        style={this.layoutHeaderHeigth}
        ref="header"
      >
        {this.$slots.header}
      </div>
    )
    const left = (
      <div class={['tw-layout-left']} style={this.layoutLeftWidth}>
        {this.$slots.left}
        {this.leftStrip && <div class="tw-control-strip"></div>}
      </div>
    )
    const right = (
      <div class={['tw-layout-right']} style={this.layoutLeftWidth}>
        {this.$slots.right}
        {this.rightStrip && <div class="tw-control-strip"></div>}
      </div>
    )
    const footer = (
      <div
        class={{
          'tw-layout-footer': true,
          'tw-control': this.footerStrip,
          'tw-selected': this.footerOption.mousedown
        }}
        style={this.layoutFooterHeigth}
      >
        {this.$slots.footer}
        {this.footerStrip && (
          <div
            class="tw-control-strip"
            on-mousedown={this.handleFooterStripMousedown}
          ></div>
        )}
      </div>
    )
    const bodyer = (
      <div class={['tw-layout-body']} style={layoutBodyStyle}>
        {this.$slots.default}
      </div>
    )

    reutrn(
      <div
        class={{
          'tw-layout': true,
          'tw-border': this.border,
          'tw-drag': this.footerOption.mousedown
        }}
        on-mouseup={this.handleLayoutMouseup}
        on-mousemove={this.handleLayoutMousemove}
      >
        {this.headerCenter && header}
        {this.$slots.left && left}
        {this.$slots.default && bodyer}
        {this.$slots.right && right}
        {this.$slots.footer && footer}
      </div>
    )
  },
  watch: {
    left(value) {
      this.layoutSize.left = JSON.parse(value)
    },
    right(value) {
      this.layoutSize.right = JSON.parse(value)
    },
    header(value) {
      this.layoutSize.header = JSON.parse(value)
    },
    footer(value) {
      this.layoutSize.footer = JSON.parse(value)
    },
    'layoutSize.left'(value) {
      if (this.$listeners['update:left-widht'])
        this.$emit('update:left-width', value)
    },
    'layoutSize.right'(value) {
      if (this.$listeners['update:right-widht'])
        this.$emit('update:right-width', value)
    },
    'layoutSize.header'(value) {
      if (this.$listeners['update:header-widht'])
        this.$emit('update:header-width', value)
    },
    'layoutSize.footer'(value) {
      if (this.$listeners['update:footer-widht'])
        this.$emit('update:footer-width', value)
    }
  }
}
</script>
