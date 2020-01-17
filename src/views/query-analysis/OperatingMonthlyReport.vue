<!-- 营运月报 -->
<template>
  <t-query-panel :model="query" footer="300">
    <template v-slot:querybar>
      <el-form-item>
        <el-date-picker v-model="query.time" type="month" placeholder="时间"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-autocomplete
          v-model="query.company"
          :prefix-icon="iconClassName('icon-car')"
          :fetch-suggestions="handleCompanyQuerySearch"
          :trigger-on-focus="false"
          placeholder="公司名称"
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
    <t-table-page :data="table.data" :loading="table.display" :page-size="31">
      <el-table-column type="index" label="序号" align="center" width="50" :resizable="false"></el-table-column>
      <el-table-column prop="REPORT_TIME" label="日期" align="center" width="80"></el-table-column>
      <el-table-column prop="REPORE_VHICNO" label="总车辆数" align="center" width="100"></el-table-column>
      <el-table-column prop="REPORE_VHIC" label="参与营运车辆数" align="center" width="120"></el-table-column>
      <el-table-column prop="REPORE_RUN_RATE" label="出车率" align="center" width="80"></el-table-column>
      <el-table-column prop="REPORE_NO" label="周转总次数" align="center" width="120"></el-table-column>
      <el-table-column prop="REPORE_TURNOVER" label="平均周转次数" align="center" width="120"></el-table-column>
      <el-table-column prop="REPORE_AMOUNT_REVENUE" label="平均营收金额" align="center" width="120"></el-table-column>
      <el-table-column prop="REPORE_ACTUAL_LOADING" label="平均实载率" align="center" width="100"></el-table-column>
      <el-table-column prop="REPORE_CAR_TIME" label="平均出车时间(时)" align="center" width="120"></el-table-column>
      <el-table-column prop="REPROE_REVENUE_TIME" label="平均重车时间(时)" align="center" width="120"></el-table-column>
      <el-table-column prop="REPORE_WAIT_TIME" label="平均等候时间(时)" align="center" width="120"></el-table-column>
      <el-table-column prop="REPORE_MILEAGE" label="平均总里程(公里)" align="center" width="120"></el-table-column>
      <el-table-column prop="REPORE_ACTUAL_MILEAGE" label="平均实载里程(公里)" align="center" width="140"></el-table-column>
      <el-table-column prop="REPORE_EMPTY_MILEAGE" label="平均空驶里程(公里)" align="center" min-width="140" :resizable="false"></el-table-column>
    </t-table-page>
  </t-query-panel>
</template>

<script>
  import moment from 'moment'
  import { iconClassName ,baseURL} from 'util'
  import axios from 'axios'
  import _ from 'underscore'
  export default {
    name: 'OperatingMonthlyReport',
    data() {
      return {
        loginType:'',
        query: {
          time: '',
          company: '',
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
          company: [],
          vehicleGroup:[],
        }
      }
    },
    mounted() {
      this.query.time = new Date();
      this.loginType=this.$cookies.get('loginType');
      this.getVehicleGroup();
      this.findOperatingMonthlyReport();
      this.getCompany();
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
      handleCompanyQuerySearch(query, cb) {
        cb(_.filter(this.select.company, item => item.value.indexOf(query) > -1))
      },
      getCompany(){
        axios.get('common/company', {
          baseURL,
          params: {}
        }).then(res=> {
          this.select.company = _.map(res.data, item => {
            return {
              value: item.COMPANY_NAME
            }
          });
        }).catch(function (error) {
        });
      },
      findOperatingMonthlyReport() {
        const {time, company, vehicleGroupId} = this.query;
        if(!time) return this.$message.error('请选择时间！');
        this.table.display = true;
        axios.get('queryAnalysis/findOperatingMonthlyReport', {
          baseURL,
          params: {
            time: time && moment(time).format('YYYY-MM'),
            company,
            vehicleGroupId,
          }
        }).then(res=> {
          this.table.data = res.data||[];
          this.table.display = false;
        }).catch(function (error) {
        });
      },
      /*事件*/
      handleQueryClick() {
        this.findOperatingMonthlyReport();
      },
      handleExportClick() {
        const {time, company, vehicleGroupId} = this.query;
        if(!time) return this.$message.error('请选择时间！');
        this.$confirm('是否需要导出?', '提示', {
          confirmButtonText: '是',
          cancelButtonText: '否',
          cancelButtonClass: 'el-button--danger',
          closeOnClickModal: false,
          type: 'info',
          center: true
        }).then(() => {
          window.open(`${baseURL}queryAnalysis/findOperatingMonthlyReportExcel?time=${time && moment(time).format('YYYY-MM')}&company=${company}&vehicleGroupId=${vehicleGroupId}`);
        }).catch(() => {

        });
      }
    }
  }
</script>



