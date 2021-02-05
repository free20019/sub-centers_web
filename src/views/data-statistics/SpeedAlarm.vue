<!-- 超速报警-->
<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <t-query-panel :model="query" footer="300">
    <template v-slot:querybar>
      <el-form-item>
        <el-date-picker v-model="query.time" type="date" placeholder="时间"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-autocomplete
          v-model="query.vehicle"
          :prefix-icon="iconClassName('icon-car')"
          :fetch-suggestions="handleVehicleQuerySearch"
          :trigger-on-focus="false"
          placeholder="车牌号码"
        ></el-autocomplete>
      </el-form-item>
      <el-form-item>
        <el-form-item>
          <el-input v-model="query.speed" type="number" placeholder="速度值"></el-input>
        </el-form-item>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleQueryClick">查询</el-button>
        <el-button type="primary" @click="handleExportClick">导出</el-button>
      </el-form-item>
    </template>
    <t-table-page :data="table.data" :loading="table.display" :page-size="20">
      <el-table-column type="index" label="序号" align="center" width="50" :resizable="false"></el-table-column>
      <el-table-column prop="VEHICLE_NUM" label="车牌号码" align="center" width="220"></el-table-column>
      <el-table-column prop="COUNT" label="超速次数" align="center" min-width="240"></el-table-column>
    </t-table-page>
  </t-query-panel>
</template>

<script>
  import moment from 'moment'
  import { iconClassName ,baseURL} from 'util'
  import axios from 'axios'
  import _ from 'underscore'
  export default {
    name: 'SpeedAlarm',
    data() {
      return {
        loginType:'',
        query: {
          time: '',
          vehicle: '',
          speed: 60,
        },
        inputVehicle: {
          loading: false,
          option: []
        },
        table: {
          display: false,
          data: []
        },
        select:{
          vehicle: [],
        },
      }
    },
    mounted() {
      this.query.time = new Date();
      this.findSpeedAlarm();
      this.getVehicle();
    },
    methods: {
      iconClassName,
      handleVehicleQuerySearch(query, cb) {
        if (query.length < 3) return cb([])
        cb(_.filter(this.select.vehicle, item => item.value.indexOf(query) > -1))
      },
      getVehicle(){
        axios.get('common/vehicle', {
          baseURL,
          params: {}
        }).then(res=> {
          this.select.vehicle = _.map(res.data, item => {
            return {
              value: item.VEHICLE_NO
            }
          });
        }).catch(function (error) {
          console.log(error);
        });
      },
      findSpeedAlarm() {
        const {time, vehicle, speed} = this.query;
        if(!time) return this.$message.error('请选择时间！');
        if(!speed) return this.$message.error('请选择速度值！');
        this.table.display = true;
        axios.get('dataStatistics/findSpeedAlarm', {
          baseURL,
          params: {
            time: time && moment(time).format('YYYY-MM-DD'),
            vehicle,
            speed,
          }
        }).then(res=> {
          this.table.data = res.data||[];
          this.table.display = false;
        }).catch(function (error) {
          console.log(error);
        });
      },
      /*事件*/
      handleQueryClick() {
        this.findSpeedAlarm();
      },
      handleExportClick() {
        const {time, vehicle, speed} = this.query;
        if(!time) return this.$message.error('请选择时间！');
        if(!speed) return this.$message.error('请选择速度值！');
        this.$confirm('是否需要导出?', '提示', {
          confirmButtonText: '是',
          cancelButtonText: '否',
          cancelButtonClass: 'el-button--danger',
          closeOnClickModal: false,
          type: 'info',
          center: true
        }).then(() => {
          window.open(`${baseURL}dataStatistics/findSpeedAlarmExcel?time=${time && moment(time).format('YYYY-MM-DD')}&vehicle=${vehicle}&speed=${speed}`);
        }).catch(() => {

        });
      }
    }
  }
</script>

