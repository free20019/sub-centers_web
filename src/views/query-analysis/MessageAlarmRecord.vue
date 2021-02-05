<!-- 短信报警记录 -->
<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
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
          placeholder="公司名称"
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
        <el-select v-model="query.alarmtype" placeholder="报警类型" clearable>
          <el-option v-for="item in select.alarmType" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
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
    <!--String a[] = {"公司名称","车牌号码","运行时间","短信发送时间","短信内容","速度","联系人","联系人号码","短信发送状态","报警状态","行驶报警"};//导出列明-->
    <!--String b[] = {"COMP_NAME","VEHI_NUM","STIME","MSG_SEND_TIME","MSGINFO","SPEED","CONTACTOR","PHONE","MSG_STATUS","ALARMTYPE","ALARMFLAG"};//导出map中的key-->

    <t-table-page :data="table.data" :loading="table.display" :page-total="table.total" :page-size="table.pageSize" :real-time-page.sync="table.currentPage" :sumText="table.total.toString()" @current-change="handlePaginationCurrentChange">
      <el-table-column type="index" label="序号" align="center" width="50" :resizable="false"></el-table-column>
      <el-table-column prop="COMP_NAME" label="公司名称" align="center" width="180"></el-table-column>
      <el-table-column prop="VEHI_NUM" label="车牌号码" align="center" width="120"></el-table-column>
      <el-table-column prop="STIME" label="运行时间" align="center" width="180"></el-table-column>
      <el-table-column prop="MSG_SEND_TIME" label="短信发送时间" align="center" width="180"></el-table-column>
      <el-table-column prop="MSGINFO" label="短信内容" align="center" width="180" show-overflow-tooltip></el-table-column>
      <el-table-column prop="SPEED" label="速度" align="center" width="120"></el-table-column>
      <el-table-column prop="CONTACTOR" label="联系人" align="center" width="120"></el-table-column>
      <el-table-column prop="PHONE" label="联系人号码" align="center" width="120"></el-table-column>
      <el-table-column prop="MSG_STATUS" label="短信发送状态" align="center" width="120"></el-table-column>
      <el-table-column prop="ALARMTYPE" label="报警状态" align="center" width="120"></el-table-column>
      <el-table-column prop="ALARMFLAG" label="行驶报警" align="center" min-width="120" :resizable="false"></el-table-column>
    </t-table-page>
  </t-query-panel>
</template>

<script>
  import moment from 'moment'
  import { iconClassName ,baseURL} from 'util'
  import axios from 'axios'
  import _ from 'underscore'
  export default {
    name: 'MessageAlarmRecord',
    data() {
      return {
        loginType:'',
        query: {
          startTime: '',
          endTime: '',
          company: '',
          vehicle: '',
          alarmtype: '',
          vehicleGroupId: '',
        },
        inputVehicle: {
          loading: false,
          option: []
        },
        table: {
          display: false,
          data: [],
          pageSize: 20,
          currentPage: 1,
          total: 0
        },
        select:{
          vehicle: [],
          company: [],
          vehicleGroup:[],
          alarmType: [
            {value: '夜间行驶', label: '夜间行驶'},
            {value: '疲劳驾驶', label: '疲劳驾驶'},
            {value: '超速报警', label: '超速报警'},
            {value: '区域报警', label: '区域报警'},
            {value: '登录提醒', label: '登录提醒'},
          ],
        }
      }
    },
    mounted() {
      this.query.startTime = new Date(moment().add('day', -1));
      this.query.endTime = new Date();
      this.loginType=this.$cookies.get('loginType');
      this.getVehicleGroup();
      this.findMessageAlarm();
      this.getVehicle();
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
      findMessageAlarm() {
        const {startTime, endTime, company, vehicle, alarmtype,vehicleGroupId} = this.query;
        const {pageSize, currentPage}=this.table
        if(!startTime||!endTime) return this.$message.error('请选择时间！');
        if((startTime&&moment(startTime).format('YYYY-MM'))!==(endTime&&moment(endTime).format('YYYY-MM'))) return this.$message.error('无法跨月查询！');
        this.table.display = true;
        axios.get('areaAlarm/findMessageAlarm', {
          baseURL,
          params: {
            startTime: startTime && moment(startTime).format('YYYY-MM-DD HH:mm:ss'),
            endTime: endTime && moment(endTime).format('YYYY-MM-DD HH:mm:ss'),
            company,
            vehicle,
            alarmtype,
            vehicleGroupId,
            pageSize,
            currentPage
          }
        }).then(res=> {
          this.table.data = res.data.datas||[];
          this.table.total = parseInt(res.data.count)||0;
          this.table.display = false;
        }).catch(function (error) {
        });
      },
      /*事件*/
      handleQueryClick() {
        this.table.currentPage = 1;
        this.findMessageAlarm();
      },
      handlePaginationCurrentChange({currentPage, pageSize}){
        this.table.currentPage=currentPage;
        this.findMessageAlarm();
      },
      handleExportClick() {
        const {startTime, endTime, company, vehicle, alarmtype, vehicleGroupId} = this.query;
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
          window.open(`${baseURL}areaAlarm/findMessageAlarmExcel?startTime=${startTime && moment(startTime).format('YYYY-MM-DD HH:mm:ss')}&endTime=${endTime && moment(endTime).format('YYYY-MM-DD HH:mm:ss')}&company=${company}&vehicle=${vehicle}&alarmtype=${alarmtype}&vehicleGroupId=${vehicleGroupId}&pageSize=${1000000}&currentPage=${1}`);
        }).catch(() => {

        });
      }
    }
  }
</script>

