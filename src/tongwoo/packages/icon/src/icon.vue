<template>
  <i class="tw-icon" :class="iconClassName"></i>
</template>

<script>
export default {
  name: 'TIcon',
  props: {
    name: String
  },
  computed: {
    iconClassName() {
      if (this.name && this.name.indexOf('icon-') === 0)
        return `iconfont ${this.name}`
      else if (this.name) return this.name
      else return ''
    }
  }
}
</script>