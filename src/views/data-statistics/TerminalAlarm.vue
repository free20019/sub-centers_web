<!-- 终端报警-->
<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <t-query-panel :model="query" footer="300">
    <template v-slot:querybar>
      <el-form-item>
        <el-date-picker v-model="query.startTime" type="date" placeholder="开始时间"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-date-picker v-model="query.endTime" type="date" placeholder="结束时间"></el-date-picker>
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
        <el-select v-model="query.type" placeholder="报警类型" clearable>
          <el-option v-for="item in getType" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleQueryClick">查询</el-button>
        <el-button type="primary" @click="handleExportClick">导出</el-button>
      </el-form-item>
    </template>
    <t-table-page :data="table.data" :loading="table.display" :page-size="20">
      <el-table-column type="index" label="序号" align="center" width="50" :resizable="false"></el-table-column>
      <el-table-column prop="VEHI_NO" label="车牌号码" align="center" width="220"></el-table-column>
      <el-table-column prop="ALT_CAUSE" label="报警类型" align="center" width="220"></el-table-column>
      <el-table-column prop="COUNT" label="次数" align="center" min-width="240"></el-table-column>
    </t-table-page>
  </t-query-panel>
</template>

<script>
  import moment from 'moment'
  import { iconClassName ,baseURL} from 'util'
  import axios from 'axios'
  import _ from 'underscore'
  export default {
    name: 'TerminalAlarm',
    data() {
      return {
        loginType:'',
        query: {
          startTime: '',
          endTime: '',
          vehicle: '',
          type: '',
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
        getType:[
          {label: '超速报警', value: '超速报警'},
          {label: '紧急报警', value: '紧急报警'},
        ]
      }
    },
    mounted() {
      this.query.startTime = new Date();
      this.query.endTime = new Date();
      this.findTerminalAlarm();
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
      findTerminalAlarm() {
        const {startTime, endTime, vehicle, type} = this.query;
        this.table.display = true;
        axios.get('dataStatistics/findTerminalAlarm', {
          baseURL,
          params: {
            startTime: startTime && moment(startTime).format('YYYY-MM-DD'),
            endTime: endTime && moment(endTime).format('YYYY-MM-DD'),
            vehicle,
            type,
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
        this.findTerminalAlarm();
      },
      handleExportClick() {
        const {startTime, endTime, vehicle, type} = this.query;
        this.$confirm('是否需要导出?', '提示', {
          confirmButtonText: '是',
          cancelButtonText: '否',
          cancelButtonClass: 'el-button--danger',
          closeOnClickModal: false,
          type: 'info',
          center: true
        }).then(() => {
          window.open(`${baseURL}dataStatistics/findTerminalAlarmExcel?startTime=${startTime && moment(startTime).format('YYYY-MM-DD')}&endTime=${endTime && moment(endTime).format('YYYY-MM-DD')}&vehicle=${vehicle}&type=${type}`);
        }).catch(() => {

        });
      }
    }
  }
</script>
