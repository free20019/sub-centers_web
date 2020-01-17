<template>
  <div class="tw-tabs-panel" :class="{'tw-tabs-panel__toolbar': hasShowToolbar}">
    <transition name="fade" appear>
      <t-group
        class="tw-tabs-toolbar"
        v-if="toolbar && hasHorizontal"
        v-show="hasShowToolbar"
        ref="toolbar"
      >
        <slot name="toolbar"></slot>
      </t-group>
    </transition>
    <el-tabs
      class="tw-tabs"
      v-model="activeName"
      :type="tabTypeStatus"
      :closable="tabClosable"
      :addable="tabAddable"
      :editable="tabEditable"
      :tab-position="tabPositionStatus"
      @edit="handleTabEdit"
      @tab-click="handleTabClick"
      @tab-add="handleTabAdd"
      @tab-remove="handleTabRemove"
      ref="tabs"
    >
      <template v-if="$slots.default">
        <slot></slot>
      </template>
    </el-tabs>
  </div>
</template>

<script>
import { hasClass, hasString, hasArray } from 'assets/js/util'
export default {
  name: 'TTabs',
  data() {
    return {
      activeName: this.active
    }
  },
  props: {
    active: {
      type: String,
      default: ''
    },
    /** 指定显示: 等于active的时候显示toolbar */
    specifiedDisplay: String,
    tabType: {
      type: String,
      default: ''
    },
    tabAddable: {
      type: Boolean,
      default: false
    },
    tabEditable: {
      type: Boolean,
      default: false
    },
    tabClosable: {
      type: Boolean,
      default: false
    },
    tabPosition: {
      type: String,
      default: 'top'
    }
  },
  mounted() {
    const tabPanels = this.$slots.default
    if (tabPanels && tabPanels.length && !this.active)
      this.activeName = tabPanels[0].child.name
    this.$nextTick(() => {
      setTimeout(() => {
        this.setToolbar()
      }, 300)
    })
    window.onresize = () => {
      this.setToolbar()
    }
  },
  computed: {
    toolbar() {
      return this.$slots.toolbar
    },
    toolbarHtml() {
      return this.$refs.toolbar
    },
    hasShowToolbar() {
      if (hasArray(this.specifiedDisplay))
        return this.toolbar && this.specifiedDisplay.indexOf(this.active) >= 0
      else if (hasString(this.specifiedDisplay) && this.specifiedDisplay !== '')
        return this.toolbar && this.active === this.specifiedDisplay
      else return this.toolbar && !this.specifiedDisplay
    },
    tabsPanel() {
      return this.$refs.tabs
    },
    hasHorizontal() {
      return this.tabPosition === 'top' // || this.tabPosition === 'bottom'
    },
    tabTypeStatus() {
      if (this.tabType === 'border-card') return 'border-card'
      else if (this.tabType === 'card') return 'card'
      else return ''
    },
    tabPositionStatus() {
      if (this.tabPosition === 'left') return 'left'
      else if (this.tabPosition === 'bottom') return 'bottom'
      else if (this.tabPosition === 'right') return 'right'
      else return 'top'
    }
  },
  methods: {
    handleTabClick(item) {
      if (this.$listeners['tab-click']) this.$emit('tab-click', item)
      setTimeout(() => {
        this.setToolbar()
      }, 0)
    },
    handleTabAdd() {
      if (this.$listeners['tab-add']) this.$emit('tab-add')
    },
    handleTabEdit(targetName, action) {
      if (this.$listeners['tab-edit'])
        this.$emit('tab-edit', targetName, action)
    },
    handleTabRemove(name) {
      if (this.$listeners['tab-remove']) this.$emit('tab-remove', name)
    },
    setToolbar() {
      if (this.toolbar) {
        const toolbarWidth = this.toolbarHtml.$el.offsetWidth
        const tabPanelList = this.tabsPanel.$children
        if (tabPanelList.length > 1) {
          tabPanelList[0].$el.style.paddingRight = `${toolbarWidth}px`
          setTimeout(() => this.resizeTabs(toolbarWidth, tabPanelList), 100)
        }
      }
    },
    resizeTabs(toolbarWidth, tabPanelList, width = 0) {
      // if (this.tabPosition !== 'top' || this.tabPosition !== 'bottom') return
      const headerList = this.tabsPanel.$el.children[0].children
      if (headerList.length > 1) width += 35
      if (!hasClass(tabPanelList[0].$el, 'is-scrollable')) return
      const tabHeaderList = tabPanelList[0].$el.children
      const tabPanelHtml = tabPanelList[0].$el
      if (hasClass(tabHeaderList[1], 'el-tabs__nav-next'))
        tabHeaderList[1].style.right = `${toolbarWidth + width + 3}px`
      tabPanelHtml.style.paddingRight = `${toolbarWidth + width + 18}px`
      if (this.tabAddable || this.tabEditable)
        headerList[0].style.right = `${toolbarWidth - 5}px`
    }
  },
  watch: {
    active(value) {
      this.activeName = value
    },
    activeName(value) {
      if (this.$listeners['update:active']) this.$emit('update:active', value)
      setTimeout(() => {
        this.setToolbar()
      }, 540)
    },
    tabAddable() {
      this.setToolbar()
    }
  }
}
</script>