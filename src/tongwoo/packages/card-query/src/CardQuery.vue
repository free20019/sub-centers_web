<template>
  <div class="tw-panel__query" :style="queryStyle">
    <t-group class="tw-panel__query-bar">
      <template v-if="$slots.query">
        <slot name="query"></slot>
      </template>
      <template v-else>
        <el-input class="tw-panel__query-input" :placeholder="queryPlaceholder"></el-input>
        <el-button :type="queryButtonType" icon="el-icon-search"></el-button>
      </template>
    </t-group>
    <div class="tw-panel__body tw-scrollbar" v-scrollbar v-if="$slots.default">
      <div class="tw-scrollbar__wrapper">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TCardQuery',
  props: {
    height: [String, Number],
    queryPlaceholder: String,
    queryButtonType: String
  },
  mounted() {},
  computed: {
    buttonType() {
      const type = this.queryButtonType
      const status = ['primary', 'success', 'info', 'warning', 'danger']
      if (status.indexOf(type) >= 0) return type
      return ''
    },
    queryStyle() {
      const height = this.height
      const flag = height.indexOf('calc(') === 0
      if (height == 0 || /^[0-9]+px|em|rem|%&/.test(height) || flag)
        return { height }
      return {}
    }
  }
}
</script>