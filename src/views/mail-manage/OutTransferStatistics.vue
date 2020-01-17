<!-- 转出统计 -->
<!-- 转入统计 -->
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
        <el-autocomplete
          v-model="query.company"
          :prefix-icon="iconClassName('icon-car')"
          :fetch-suggestions="handleCompanyQuerySearch"
          :trigger-on-focus="false"
          placeholder="原公司名称"
        ></el-autocomplete>
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
        <el-button type="primary" @click="handleQueryClick">查询</el-button>
        <el-button type="primary" @click="handleExportClick">导出</el-button>
      </el-form-item>
    </template>
    <t-table-page :data="table.data" :loading="table.display" :page-size="20">
      <el-table-column type="index" label="序号" align="center" width="50" :resizable="false"></el-table-column>
      <el-table-column prop="VEHICLE_NO" label="车牌号码" width="140" align="center"></el-table-column>
      <el-table-column prop="OLD_COMPANY" label="原公司名称" width="280" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="NEW_COMPANY" label="现公司名称" width="280" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="COUNT" label="转出次数" align="center"  min-width="160" :resizable="false"></el-table-column>
    </t-table-page>
  </t-query-panel>
</template>

<script>
  import moment from 'moment'
  import { iconClassName ,baseURL} from 'util'
  import axios from 'axios'
  import _ from 'underscore'
  export default {
    name: 'OutTransferStatistics',
    data() {
      return {
        query: {
          startTime: '',
          endTime: '',
          vehicle: '',
          company: ''
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
          company: [],
        }
      }
    },
    mounted() {
      this.query.startTime = new Date(moment().add('day', -1));
      this.query.endTime = new Date();
      this.findTransferStatistics();
      this.getVehicle();
      this.getCompany();
    },
    methods: {
      iconClassName,
      handleVehicleQuerySearch(query, cb) {
        if (query.length < 3) return cb([])
        cb(_.filter(this.select.vehicle, item => item.value.indexOf(query) > -1))
      },
      handleCompanyQuerySearch(query, cb) {
        cb(_.filter(this.select.company, item => item.value.indexOf(query) > -1))
      },
      getVehicle(){
        axios.get('common/vehicle', {
          baseURL,
          params: {
            type:1
          }
        }).then(res=> {
          this.select.vehicle = _.map(res.data, item => {
            return {
              value: item.VEHICLE_NO
            }
          });
        }).catch(function (error) {
        });
      },
      getCompany(){
        axios.get('common/company', {
          baseURL,
          params: {
            type:1
          }
        }).then(res=> {
          this.select.company = _.map(res.data, item => {
            return {
              value: item.COMPANY_NAME
            }
          });
        }).catch(function (error) {
        });
      },
      findTransferStatistics() {
        const {startTime, endTime, vehicle, company} = this.query;
        this.table.display = true;
        axios.get('letterManagement/findTransferStatistics', {
          baseURL,
          params: {
            startTime: startTime && moment(startTime).format('YYYY-MM-DD HH:mm:ss'),
            endTime: endTime && moment(endTime).format('YYYY-MM-DD HH:mm:ss'),
            vehicle,
            company,
            status: 1
          }
        }).then(res=> {
          this.table.data = res.data||[];
          this.table.display = false;
        }).catch(function (error) {
        });
      },
      /*事件*/
      handleQueryClick() {
        this.findTransferStatistics();
      },
      handleExportClick() {
        const {startTime, endTime, vehicle, company} = this.query;
        this.$confirm('是否需要导出?', '提示', {
          confirmButtonText: '是',
          cancelButtonText: '否',
          cancelButtonClass: 'el-button--danger',
          closeOnClickModal: false,
          type: 'info',
          center: true
        }).then(() => {
          window.open(`${baseURL}letterManagement/findTransferStatisticsExcel?startTime=${startTime && moment(startTime).format('YYYY-MM-DD HH:mm:ss')}&endTime=${endTime && moment(endTime).format('YYYY-MM-DD HH:mm:ss')}&vehicle=${vehicle}&company=${company}&status=1`);
        }).catch(() => {
        });
      }
    }
  }
</script>


