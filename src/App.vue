<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style lang="scss">
@import './tongwoo/style/index';
@import './assets/css/style';

.tw-layout {
  &-header {
    &.tw-header {
      background-color: #1273c4;
    }
    position: relative;
    .tw-header {
      padding-left: 10px;
      padding-right: 10px;
      font-size: 24px;
      line-height: 40px;
      color: #ffffff;
    }
  }
}
.vehicleWidth {
    width: 280px!important;
  }
</style>
