<!-- 无空重车变化车辆 -->
<template>
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
      <el-table-column prop="COMP_NAME" label="公司名称" align="center" width="240"></el-table-column>
      <el-table-column prop="VEHI_NO" label="车牌号码" align="center" width="100"></el-table-column>
      <el-table-column v-if="index<table.arr.length-1" v-for="(item,index) in table.arr" :prop="'M'+(index+1)" :label=item align="center" width="100"></el-table-column>
      <el-table-column v-if="index===table.arr.length-1" v-for="(item,index) in table.arr" :prop="'M'+(index+1)" :label=item align="center" min-width="100" :resizable="false"></el-table-column>
    </t-table-page>
  </t-query-panel>
</template>
<script>
  import moment from 'moment'
  import { iconClassName ,baseURL} from 'util'
  import axios from 'axios'
  import _ from 'underscore'
  export default {
    name: 'NoEmptyVehicleChangeVehicle',
    data() {
      return {
        loginType:'',
        query: {
          startTime: '',
          endTime: '',
          company: '',
          vehicleGroupId: '',
        },
        inputVehicle: {
          loading: false,
          option: []
        },
        table: {
          display: false,
          data: [],
          arr: [],
        },
        select:{
          company: [],
          vehicleGroup:[],
        }
      }
    },
    mounted() {
      this.query.startTime = new Date(moment().startOf('month'));
      this.query.endTime = new Date();
      this.loginType=this.$cookies.get('loginType');
      this.getVehicleGroup();
      this.findNoEmptyVehicleChange();
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
          console.log(error);
        });
      },
      getAll(begin, end) {
        this.table.arr = [];
        let ab = begin.split("-");
        let ae = end.split("-");
        let db = new Date();
        db.setUTCFullYear(ab[0], ab[1] - 1, ab[2]);
        let de = new Date();
        de.setUTCFullYear(ae[0], ae[1] - 1, ae[2]);
        let unixDb = db.getTime() - 24 * 60 * 60 * 1000;
        let unixDe = de.getTime() - 24 * 60 * 60 * 1000;
        for (let k = unixDb; k <= unixDe;) {
          k = k + 24 * 60 * 60 * 1000;
          this.table.arr .push(moment(new Date(parseInt(k))).format('YYYY-MM-DD'));
        }
      },
      findNoEmptyVehicleChange() {
        const {startTime, endTime, company, vehicleGroupId} = this.query;
        if(!startTime||!endTime) return this.$message.error('请选择时间！');
        if(parseInt(moment(startTime).format('YYYYMMDD'))>parseInt(moment(endTime).format('YYYYMMDD'))) return this.$message.error('开始时间必须小于结束时间！');
        this.getAll(startTime && moment(startTime).format('YYYY-MM-DD'),endTime && moment(endTime).format('YYYY-MM-DD'));
        this.table.display = true;
        axios.get('dataStatistics/findNoEmptyVehicleChange', {
          baseURL,
          params: {
            startTime: startTime && moment(startTime).format('YYYY-MM-DD'),
            endTime: endTime && moment(endTime).format('YYYY-MM-DD'),
            company,
            vehicleGroupId
          }
        }).then(res=> {
          console.log("1111111111111",res)
          this.table.data = res.data||[];
          this.table.display = false;
        }).catch(function (error) {
          console.log(error);
        });
      },
      /*事件*/
      handleQueryClick() {
        this.findNoEmptyVehicleChange();
      },
      handleExportClick() {
        const {startTime, endTime, company, vehicleGroupId} = this.query;
        if(!startTime||!endTime) return this.$message.error('请选择时间！');
        if(parseInt(moment(startTime).format('YYYYMMDD'))>parseInt(moment(endTime).format('YYYYMMDD'))) return this.$message.error('开始时间必须小于结束时间！');
        this.$confirm('是否需要导出?', '提示', {
          confirmButtonText: '是',
          cancelButtonText: '否',
          cancelButtonClass: 'el-button--danger',
          closeOnClickModal: false,
          type: 'info',
          center: true
        }).then(() => {
          window.open(`${baseURL}dataStatistics/findNoEmptyVehicleChangeExcel?startTime=${startTime && moment(startTime).format('YYYY-MM-DD')}&endTime=${endTime && moment(endTime).format('YYYY-MM-DD')}&company=${company}&vehicleGroupId=${vehicleGroupId}`);
        }).catch(() => {

        });
      }
    }
  }
</script>






