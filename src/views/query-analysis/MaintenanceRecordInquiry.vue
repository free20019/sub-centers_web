<!-- 维修记录查询 -->
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
        <el-select v-model="query.area" placeholder="区域">
          <el-option v-for="item in getArea" :key="item.value" :label="item.label" :value="item.value"></el-option>
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
    <t-table-page :data="table.data" :loading="table.display" :page-total="table.total" :page-size="table.pageSize" :real-time-page.sync="table.currentPage" :sumText="table.total.toString()" @current-change="handlePaginationCurrentChange">
      <el-table-column type="index" label="序号" align="center" width="50" :resizable="false"></el-table-column>

      <el-table-column prop="gsmc" label="公司名称" align="center" width="260"></el-table-column>
      <el-table-column prop="cphm" label="车牌号码" align="center" width="140"></el-table-column>
      <el-table-column prop="area" label="区域" align="center" width="240"></el-table-column>
      <el-table-column prop="simk" label="SIM卡号" align="center" width="140"></el-table-column>
      <el-table-column prop="chez" label="车主" align="center" width="120"></el-table-column>
      <el-table-column prop="sjhm" label="手机号码" align="center" width="140"></el-table-column>
      <el-table-column prop="wxlx" label="维修类型" align="center" width="200"></el-table-column>
      <el-table-column prop="gzlx" label="故障类型" align="center" width="280"></el-table-column>
      <!--<el-table-column prop="gzfssj" label="故障发生时间" align="center" width="160"></el-table-column>-->
      <el-table-column prop="wxrxm" label="维修人姓名" align="center" width="120"></el-table-column>
      <el-table-column prop="wxqk" label="维修情况" align="center" width="240"></el-table-column>
      <el-table-column prop="wxdd" label="维修地点" align="center" width="280"></el-table-column>
      <el-table-column prop="wxfy" label="维修费用" align="center" width="120"></el-table-column>
      <el-table-column prop="wxjd" label="维修进度" align="center" width="140"></el-table-column>
      <el-table-column prop="wxjg" label="维修结果" align="center" width="240"></el-table-column>
      <el-table-column prop="sxsj" label="送修时间" align="center" width="160"></el-table-column>
      <el-table-column prop="wxsj" label="完修时间" align="center" width="160"></el-table-column>
      <el-table-column prop="ghao" label="工号" align="center" width="180"></el-table-column>
      <el-table-column prop="khmyd" label="客户满意度" align="center" width="120"></el-table-column>
      <el-table-column prop="beiz" label="备注" align="center"  min-width="320" :resizable="false"></el-table-column>
    </t-table-page>
  </t-query-panel>
</template>

<script>
  import moment from 'moment'
  import { iconClassName ,baseURL} from 'util'
  import axios from 'axios'
  import _ from 'underscore'
  export default {
    name: 'MaintenanceRecordInquiry',
    data() {
      return {
        loginType:'',
        query: {
          startTime: '',
          endTime: '',
          area: '',
          company: '',
          vehicle: '',
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
        },
        getArea:[
          {label: '全部区域', value: ''},
          {label: '主城区', value: '主城区'},
          {label: '余杭区', value: '余杭区'},
          {label: '萧山区', value: '萧山区'},
          {label: '临安区', value: '临安区'},
          {label: '富阳区', value: '富阳区'},
          {label: '淳安区', value: '淳安区'},
          {label: '建德市', value: '建德市'}
        ]
      }
    },
    mounted() {
      this.query.startTime = new Date(moment().add('day', -1));
      this.query.endTime = new Date();
      this.loginType=this.$cookies.get('loginType');
      this.getVehicleGroup();
      this.findMaintenanceRecord();
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
      findMaintenanceRecord() {
        const {startTime, endTime, area, company, vehicle, vehicleGroupId} = this.query;
        const {pageSize, currentPage}=this.table
        this.table.display = true;
        axios.get('queryAnalysis/findMaintenanceRecord', {
          baseURL,
          params: {
            startTime: startTime && moment(startTime).format('YYYY-MM-DD HH:mm:ss'),
            endTime: endTime && moment(endTime).format('YYYY-MM-DD HH:mm:ss'),
            area,
            company,
            vehicle,
            vehicleGroupId,
            pageSize,
            currentPage
          }
        }).then(res=> {
          this.table.data = _.map(res.data.datas, item => {
            return {
              id:item.RR_ID,
              gsmc: item.COMP_NAME,
              cphm: item.VEHI_NO,
              area: item.AREA_NAME,
              simk: item.VEHI_SIM,
              chez: item.OWN_NAME,
              sjhm: item.HOME_TEL,
              wxlx: item.RT_TYPE,
              gzlx: item.GZLX,
              // gzfssj: '',
              wxrxm: item.REAL_NAME,
              wxqk: item.RM_MALFUNCTION,
              wxdd: item.RA_ADDR,
              wxfy: item.RR_COST,
              wxjd: item.WXJD,
              wxjg: item.RC_CONTENT,
              sxsj: item.STIME,
              wxsj: item.ETIME,
              ghao: item.GHAO,
              // khmyd: item.TCSS,
              khmyd: item.HFJG,
              beiz: item.JFYY
            }
          });
          this.table.total = parseInt(res.data.count)||0;
          this.table.display = false;
        }).catch(function (error) {
        });
      },
      /*事件*/
      handleQueryClick() {
        this.table.currentPage = 1;
        this.findMaintenanceRecord();
      },
      handlePaginationCurrentChange({currentPage, pageSize}){
        this.table.currentPage=currentPage;
        this.findMaintenanceRecord();
      },
      handleExportClick() {
        const {startTime, endTime, area, company, vehicle, vehicleGroupId} = this.query;
        this.$confirm('是否需要导出?', '提示', {
          confirmButtonText: '是',
          cancelButtonText: '否',
          cancelButtonClass: 'el-button--danger',
          closeOnClickModal: false,
          type: 'info',
          center: true
        }).then(() => {
          window.open(`${baseURL}queryAnalysis/findMaintenanceRecordExcel?startTime=${startTime && moment(startTime).format('YYYY-MM-DD HH:mm:ss')}&endTime=${endTime && moment(endTime).format('YYYY-MM-DD HH:mm:ss')}&area=${area}&company=${company}&vehicle=${vehicle}&vehicleGroupId=${vehicleGroupId}&pageSize=${10000000}&currentPage=${1}`);
        }).catch(() => {

        });
      }
    }
  }
</script>

