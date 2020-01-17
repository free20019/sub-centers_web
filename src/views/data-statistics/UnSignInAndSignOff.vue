<!-- 无签到签退 -->
<template>
  <t-query-panel :model="query" footer="300">
    <template v-slot:querybar>
      <el-form-item>
        <el-date-picker v-model="query.startTime" type="date" :disabled="timeControl" placeholder="开始时间"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-date-picker v-model="query.endTime" type="date" :disabled="timeControl" placeholder="结束时间"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-select v-model="query.timeType" placeholder="请选择" @change="handleTimeTypeChange">
          <el-option v-for="item in timeTypeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
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
    <t-table-page :data="table.data" :loading="table.display" :page-size="20">
      <el-table-column type="index" label="序号" align="center" width="50" :resizable="false"></el-table-column>
      <el-table-column prop="COMP_NAME" label="公司名称" align="center" width="220"></el-table-column>
      <!--<el-table-column prop="AREA_NAME" label="区域" align="center" width="180"></el-table-column>-->
      <el-table-column prop="VEHI_NO" label="车牌号码" align="center" width="120"></el-table-column>
      <el-table-column prop="VEHI_SIM" label="SIM卡号" align="center" width="180"></el-table-column>
      <el-table-column prop="OWN_NAME" label="联系人" align="center" width="120"></el-table-column>
      <el-table-column prop="OWN_TEL" label="联系电话" align="center" width="180"></el-table-column>
      <el-table-column prop="LOGINTIME" label="最近签到时间" align="center" width="180"></el-table-column>
      <el-table-column prop="LOGOUTTIME" label="最近签退时间" align="center" min-width="180" :resizable="false"></el-table-column>
    </t-table-page>
  </t-query-panel>
</template>

<script>
  import moment from 'moment'
  import { iconClassName ,baseURL} from 'util'
  import axios from 'axios'
  import _ from 'underscore'
  export default {
    name: 'UnSignInAndSignOff',
    data() {
      return {
        loginType:'',
        query: {
          startTime: '',
          endTime: '',
          timeType: 2,
          company: '',
          vehicleGroupId: '',
        },
        timeControl: true,
        timeTypeOptions: [
          {label: '自定义时间', value: 0},
          {label: '3天时间', value: 1},
          {label: '7天时间', value: 2}
        ],
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
      // this.query.startTime = new Date(moment().add('day', -1));
      // this.query.endTime = new Date();
      this.query.startTime = moment(moment().subtract(8, 'days').format('YYYY-MM-DD'));
      this.query.endTime = moment(moment().subtract(1, 'days').format('YYYY-MM-DD'));
      this.loginType=this.$cookies.get('loginType');
      this.getVehicleGroup();
      this.findUnSignInAndSignOff();
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
      findUnSignInAndSignOff() {
        const {startTime, endTime, company, vehicleGroupId} = this.query;
        if(!startTime||!endTime) return this.$message.error('请选择时间！');
        if((startTime&&moment(startTime).format('YYYY'))!==(endTime&&moment(endTime).format('YYYY'))) return this.$message.error('无法跨年查询！');
        this.table.display = true;
        axios.get('dataStatistics/findUnSignInAndSignOff', {
          baseURL,
          params: {
            startTime: startTime && moment(startTime).format('YYYY-MM-DD'),
            endTime: endTime && moment(endTime).format('YYYY-MM-DD'),
            company,
            vehicleGroupId
          }
        }).then(res=> {
          this.table.data = res.data||[];
          this.table.display = false;
        }).catch(function (error) {
        });
      },
      /*事件*/
      handleTimeTypeChange() {
        switch (this.query.timeType) {
          case 0:
            this.timeControl = false;
            break;
          case 1:
            this.timeControl = true;
            this.query.startTime = moment(moment().subtract(4, 'days').format('YYYY-MM-DD'));
            this.query.endTime = moment(moment().subtract(1, 'days').format('YYYY-MM-DD'));
            break;
          case 2:
            this.timeControl = true;
            this.query.startTime = moment(moment().subtract(8, 'days').format('YYYY-MM-DD'));
            this.query.endTime = moment(moment().subtract(1, 'days').format('YYYY-MM-DD'));
            break;
        }
      },
      handleQueryClick() {
        this.findUnSignInAndSignOff();
      },
      handleExportClick() {
        const {startTime, endTime, company, vehicleGroupId} = this.query;
        if(!startTime||!endTime) return this.$message.error('请选择时间！');
        if((startTime&&moment(startTime).format('YYYY'))!==(endTime&&moment(endTime).format('YYYY'))) return this.$message.error('无法跨年查询！');
        this.$confirm('是否需要导出?', '提示', {
          confirmButtonText: '是',
          cancelButtonText: '否',
          cancelButtonClass: 'el-button--danger',
          closeOnClickModal: false,
          type: 'info',
          center: true
        }).then(() => {
          window.open(`${baseURL}dataStatistics/findUnSignInAndSignOffExcel?startTime=${startTime && moment(startTime).format('YYYY-MM-DD')}&endTime=${endTime && moment(endTime).format('YYYY-MM-DD')}&company=${company}&vehicleGroupId=${vehicleGroupId}`);
        }).catch(() => {

        });
      }
    }
  }
</script>

