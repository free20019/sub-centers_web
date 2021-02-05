<!-- 顶灯数据透传 -->
<template>
  <div style="height:100%">
    <el-form class="tw-query-bar" size="small" :inline="true">
      <el-form-item>
        <el-select
          v-model="query.vehicle"
          filterable
          remote
          placeholder="请输入关键词"
          :remote-method="getVehicleData"
          :loading="query.selectLoading"
          :loading-text="query.selectLoadingText"
          :no-data-text="query.selectNoDataText"
          ref="select-vehicle"
        >
          <el-option
            v-for="item in query.vehicleOptions"
            :key="item.SIM_NUM"
            :label="item.VEHI_NO"
            :value="item.SIM_NUM"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleBtnClick('0')"
          >下发防伪</el-button
        >
        <el-button type="primary" @click="handleBtnClick('1')"
          >退出防伪</el-button
        >
        <el-button type="primary" @click="handleBtnClick('2')"
          >解除报警</el-button
        >
      </el-form-item>
    </el-form>
    <div class="tw-query-wrapper" ref="wrapper" v-loading="table.loading">
      <div class="tw-for" v-for="(item, index) in table.data" :key="index">
        <div class="tw-title">
          <span id="vehicle">{{ item.vehicle }}</span>
          <span id="type">{{ item.type }}</span>
        </div>
        <div class="tw-title">{{ item.result }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { iconClassName, baseURL } from 'util'
export default {
  name: 'CeilingLampDataTransmission',
  data() {
    return {
      query: {
        vehicle: '',
        vehicleOptions: [],
        selectLoading: false,
        selectLoadingText: '加载中',
        selectNoDataText: ''
      },
      table: {
        loading: false,
        data: []
      }
    }
  },
  methods: {
    // 下拉框
    getVehicleData(query) {
      if (query !== '') {
        if (query.length < 3) {
          console.info('1')
          this.query.vehicleOptions = []
          this.query.selectNoDataText = '请输入3位及以上车牌号码'
        } else {
          this.query.selectLoading = true
          this.query.selectNoDataText = '无数据'
          axios
            .get('map/getVehicle', {
              baseURL,
              params: {
                vhic: query
              }
            })
            .then(res => {
              this.query.selectLoading = false
              this.query.vehicleOptions = res.data.data
            })
        }
      } else {
        this.query.vehicleOptions = []
      }
    },
    // 按钮点击 type：0下发防伪    1退出防伪  2解除报警
    handleBtnClick(type) {
      if (!this.query.vehicle) return this.$message.error('请选择车辆')
      this.table.loading = true
      axios
        .get('map/sendTCP', {
          baseURL,
          params: {
            type,
            mdt_no: this.query.vehicle
          }
        })
        .then(res => {
          this.table.data.push({
            vehicle: '<<：' + this.$refs['select-vehicle'].selected.label,
            type:
              type == 0
                ? '下发防伪'
                : type == 1
                ? '下发退出防伪'
                : type == 2
                ? '下发解除报警'
                : '',
            result: res.data.instructions
          })
          this.table.loading = false
          setTimeout(() => {
            this.$refs.wrapper.scrollTop = this.$refs.wrapper.scrollHeight
          })
          console.info(this.$refs.wrapper.scrollHeight)
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.tw-for {
  .tw-title {
    line-height: 30px;
    font-size: 15px;
    padding-left: 10px;
    #vehicle {
      margin-right: 30px;
    }
  }
  border-bottom: 1px solid #eeeeee;
}
.tw-query-wrapper {
  overflow: auto !important;
}
</style>
