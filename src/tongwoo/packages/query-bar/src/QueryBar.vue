<template>
  <el-form class="tw-query-bar" :model="model" :size="size" inline>
    <slot></slot>
  </el-form>
</template>

<script>
export default {
  name: 'TQueryBar',
  props: {
    model: Object,
    size: {
      type: String,
      default: 'small'
    }
  }
}
</script>