<!-- 投诉查询 -->
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
        <el-select v-model="query.type" placeholder="投诉类型">
          <el-option v-for="item in getType" :key="item.value" :label="item.label" :value="item.value"></el-option>
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
    <t-table-page :data="table.data" :loading="table.display" :page-total="table.total" :page-size="table.pageSize" :real-time-page.sync="table.currentPage" :sumText="table.total.toString()" @current-change="handlePaginationCurrentChange">
      <el-table-column type="index" label="序号" align="center" width="50" :resizable="false"></el-table-column>
      <el-table-column prop="CALL_NAME" label="投诉人" align="center" width="140"></el-table-column>
      <el-table-column prop="BUSINESS_ITEMTYPE_NAME" label="投诉类型" align="center" width="240"></el-table-column>
      <el-table-column prop="CALLER_ID" label="联系方式" align="center" width="180"></el-table-column>
      <el-table-column prop="VEHICLE_PLATE_NUMBER" label="投诉车辆" align="center" width="180"></el-table-column>
      <el-table-column prop="BUSINESS_STATUS_NAME" label="处理详情" align="center" width="240"></el-table-column>
      <el-table-column prop="ARCHIVE_TIME" label="投诉时间" align="center" width="180"></el-table-column>
      <el-table-column prop="ACCEPT_TIME" label="处理时间" align="center" min-width="180" :resizable="false"></el-table-column>
    </t-table-page>
  </t-query-panel>
</template>

<script>
  import moment from 'moment'
  import { iconClassName ,baseURL} from 'util'
  import axios from 'axios'
  import _ from 'underscore'
  export default {
    name: 'ComplaintInquiry',
    data() {
      return {
        loginType:'',
        query: {
          startTime: '',
          endTime: '',
          type: '',
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
          vehicleGroup:[],
        },
        getType: [
          {label:"全部" ,value: ""},
          {label:"绕道" ,value: "绕道"},
          {label:"中途抛客" ,value: "中途抛客"},
          {label:"扰乱场站秩序" ,value: "扰乱场站秩序"},
          {label:"服务质量" ,value: "服务质量"},
          {label:"拒载" ,value: "拒载"},
          {label:"拼载" ,value: "拼载"},
          {label:"表扬" ,value: "表扬"},
          {label:"其他" ,value: "其他"}
        ]
      }
    },
    mounted() {
      this.query.startTime = new Date(moment().add('day', -1));
      this.query.endTime = new Date();
      this.loginType=this.$cookies.get('loginType');
      this.getVehicleGroup();
      this.findComplaintInquiry();
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
      findComplaintInquiry() {
        const {startTime, endTime, type, vehicleGroupId} = this.query;
        const {pageSize, currentPage}=this.table
        this.table.display = true;
        axios.get('queryAnalysis/findComplaintInquiry', {
          baseURL,
          params: {
            startTime: startTime && moment(startTime).format('YYYY-MM-DD'),
            endTime: endTime && moment(endTime).format('YYYY-MM-DD'),
            type,
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
        this.table.currentPage=1;
        this.findComplaintInquiry();
      },
      handlePaginationCurrentChange({currentPage, pageSize}){
        this.table.currentPage=currentPage;
        this.findComplaintInquiry();
      },
      handleExportClick() {
        const {startTime, endTime, type, vehicleGroupId} = this.query;
        this.$confirm('是否需要导出?', '提示', {
          confirmButtonText: '是',
          cancelButtonText: '否',
          cancelButtonClass: 'el-button--danger',
          closeOnClickModal: false,
          type: 'info',
          center: true
        }).then(() => {
          window.open(`${baseURL}queryAnalysis/findComplaintInquiryExcel?startTime=${startTime && moment(startTime).format('YYYY-MM-DD')}&endTime=${endTime && moment(endTime).format('YYYY-MM-DD')}&type=${type}&vehicleGroupId=${vehicleGroupId}&pageSize=${10000000}&currentPage=${1}`);
        }).catch(() => {

        });
      }
    }
  }
</script>


