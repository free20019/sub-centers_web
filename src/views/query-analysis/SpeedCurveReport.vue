<!-- 速度曲线报表 -->
<template>
  <t-query-panel :model="query" footer="300">
    <template v-slot:querybar>
      <el-form-item>
        <el-date-picker v-model="query.startTime" type="datetime" placeholder="开始时间"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-date-picker v-model="query.endTime" type="datetime" placeholder="结束时间"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="query.limit"
          :prefix-icon="iconClassName('icon-speed-limit')"
          placeholder="限速值"
        ></el-input>
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
        <el-select v-model="query.vehicleGroupId" filterable clearable  placeholder="请选择车辆组" v-if="loginType==='1'">
          <el-option
            v-for="item in select.vehicleGroup"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleQueryClick">查询</el-button>
        <el-button type="primary" @click="handleExportClick">导出</el-button>
      </el-form-item>
    </template>
    <t-table-page :data="table.data" :loading="table.display">
      <el-table-column type="index" label="序号" align="center" width="50" :resizable="false"></el-table-column>
      <el-table-column prop="VEHICLE_NUM" label="车牌号码" align="center" width="140"></el-table-column>
      <el-table-column prop="STATE" label="状态" align="center" width="120"></el-table-column>
      <el-table-column prop="SPEED" label="速度" align="center" width="120"></el-table-column>
      <el-table-column prop="DIRECTION" label="方向" align="center" width="120"></el-table-column>
      <el-table-column prop="PX_PY" label="经纬度" align="center" width="180"></el-table-column>
      <el-table-column prop="DB_TIME" label="定位时间" align="center" min-width="180" :resizable="false"></el-table-column>
    </t-table-page>
    <template v-slot:footer>
      <div id="e-chart" class="tw-chart"></div>
    </template>
  </t-query-panel>
</template>

<script>
import moment from 'moment'
import echarts from 'echarts'
import { iconClassName ,baseURL} from 'util'
import axios from 'axios'
import _ from 'underscore'
export default {
  name: 'SpeedCurveReport',
  data() {
    return {
      loginType:'',
      query: {
        startTime: '',
        endTime: '',
        limit: 0,
        vehicle: '',
        vehicleGroupId: '',
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
        vehicle:[],
        vehicleGroup:[],
      },
      chart: {
        el: null
      }
    }
  },
  mounted() {
    this.query.startTime = new Date(moment().add('hour', -2));
    this.query.endTime = new Date();
    // this.findSpeedCurve();
    this.loginType=this.$cookies.get('loginType');
    this.getVehicleGroup();
    this.getVehicle();
    this.$nextTick(() => {
      this.chart.el = echarts.init(document.getElementById('e-chart'))
    })
  },
  methods: {
    iconClassName,
    getVehicleGroup(){
      if(this.loginType!=='1') return null;
      axios.get('common/vehicleGroup', {
        baseURL,
        params: {
          userId:this.$cookies.get('userId'),
        }
      }).then(res=> {
        this.select.vehicleGroup = _.map(res.data, item => {
          return {value: item.CLZS, label:item.CLZ_NAME}
        });
      }).catch(function (error) {
      });
    },
    setChart(data) {
      let xdata= [],ydata=[];
      _.map(data,item=>{
        xdata.push(item.DB_TIME);
        ydata.push(item.SPEED);
      });
      this.chart.el.clear();
      this.chart.el.setOption({
        title: {
          text: '速度曲线报表'
        },
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          type: 'category',
          data: xdata
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: ydata,
            type: 'line',
            smooth: true
          }
        ]
      })
    },
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
      });
    },
    findSpeedCurve() {
      const {startTime, endTime, limit,vehicle,vehicleGroupId} = this.query;
      if(!vehicle) return this.$message.error("请选择车牌号！")
      if(!startTime||!endTime) return this.$message.error('请选择时间！');
      if((startTime&&moment(startTime).format('YYYY-MM'))!==(endTime&&moment(endTime).format('YYYY-MM'))) return this.$message.error('无法跨月查询！');
      this.table.display = true;
      axios.get('queryAnalysis/findSpeedCurve', {
        baseURL,
        params: {
          startTime: startTime && moment(startTime).format('YYYY-MM-DD HH:mm:ss'),
          endTime: endTime && moment(endTime).format('YYYY-MM-DD HH:mm:ss'),
          limit,
          vehicle,
          vehicleGroupId,
        }
      }).then(res=> {
        this.table.data = _.map(res.data, item => {
          return {
            VEHICLE_NUM: item.VEHICLE_NUM,
            STATE: item.STATE,
            SPEED: item.SPEED,
            DIRECTION: item.DIRECTION,
            PX_PY: item.PX+","+item.PY,
            DB_TIME: item.DB_TIME,
          }
        });
        this.setChart(res.data||[]);
        this.table.display = false;
      }).catch(function (error) {
      });
    },
    /*事件*/
    handleQueryClick() {
      this.findSpeedCurve();
    },
    handleExportClick() {
      const {startTime, endTime, limit,vehicle,vehicleGroupId} = this.query;
      if(!vehicle) return this.$message.error("请选择车牌号！")
      if(!startTime||!endTime) return this.$message.error('请选择时间！');
      if((startTime&&moment(startTime).format('YYYY-MM'))!==(endTime&&moment(endTime).format('YYYY-MM'))) return this.$message.error('无法跨月查询！');
      this.$confirm('是否需要导出?', '提示', {
        confirmButtonText: '是',
        cancelButtonText: '否',
        cancelButtonClass: 'el-button--danger',
        closeOnClickModal: false,
        type: 'info',
        center: true
      }).then(() => {
        window.open(`${baseURL}queryAnalysis/findSpeedCurveExcel?startTime=${startTime && moment(startTime).format('YYYY-MM-DD HH:mm:ss')}&endTime=${endTime && moment(endTime).format('YYYY-MM-DD HH:mm:ss')}&limit=${limit}&vehicle=${vehicle}&vehicleGroupId=${vehicleGroupId}`);
      }).catch(() => {

      });
    }
  }
}
</script>
