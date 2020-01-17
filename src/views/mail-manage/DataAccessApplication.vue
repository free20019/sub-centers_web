<!-- 数据接入申请 -->
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
        <el-button type="primary" @click="handleQueryClick">查询</el-button>
        <el-button type="primary" @click="handleExportClick">导出</el-button>
        <el-button type="primary" @click="handleTableAddClick">添加</el-button>
      </el-form-item>
    </template>
    <t-table-page :data="table.data" :loading="table.display" :page-size="20">
      <el-table-column type="index" label="序号" align="center" width="50" :resizable="false" fixed></el-table-column>
      <el-table-column prop="VEHICLE_NO" label="车号" width="120" align="center" fixed></el-table-column>
      <el-table-column prop="COMPANY_NAME" label="公司" width="220" align="center"></el-table-column>
      <el-table-column prop="VEHICLE_TYPE" label="车型" width="120" align="center"></el-table-column>
      <el-table-column prop="VEHICLE_COLOR" label="车辆颜色" width="120" align="center"></el-table-column>
      <el-table-column prop="FUEL_TYPE" label="燃料类型" width="120" align="center"></el-table-column>
      <el-table-column prop="TERMINAL_TYPE" label="终端类型" width="120" align="center"></el-table-column>
      <el-table-column prop="TERMINAL_MODEL" label="终端型号" width="120" align="center"></el-table-column>
      <el-table-column prop="OWNER_NAME" label="车主姓名" width="120" align="center"></el-table-column>
      <el-table-column prop="OWNER_PHONE" label="电话号码" width="120" align="center"></el-table-column>
      <el-table-column prop="DAY_PERSON" label="白班姓名" width="120" align="center"></el-table-column>
      <el-table-column prop="NIGHT_PERSON" label="夜班姓名" width="120" align="center"></el-table-column>
      <el-table-column prop="DAY_PHONE" label="白班电话" width="120" align="center"></el-table-column>
      <el-table-column prop="NIGHT_PHONE" label="夜班电话" width="120" align="center"></el-table-column>
      <el-table-column prop="APPLICATION_DATE" label="申请时间" width="180" align="center"></el-table-column>
      <el-table-column prop="AUDIT_DATE" label="审核时间" width="180" align="center"></el-table-column>
      <el-table-column prop="REAL_NAME" label="审核人员" width="120" align="center"></el-table-column>
      <el-table-column prop="AUDIT_REASON" label="审核原因" width="120" align="center"></el-table-column>
      <el-table-column prop="AUDIT_STATUS" label="审核状态" align="center"  min-width="120" :resizable="false"></el-table-column>
      <el-table-column :resizable="false" width="100" align="center" fixed="right">
        <!--<template slot="header" slot-scope="scope">-->
          <!--<el-button size="mini" icon="el-icon-plus" @click="handleTableAddClick"></el-button>-->
        <!--</template>-->
        <template slot-scope="scope">
          <el-button size="mini" icon="el-icon-edit" type="text" @click="handleTableEditClick(scope.row,)"></el-button>
          <el-button size="mini" icon="el-icon-delete" type="text" @click="handleTableDeleteClick(scope.row)"></el-button>
        </template>
      </el-table-column>
    </t-table-page>
    <el-dialog :title="dialog.title" :visible.sync="dialog.display" width="800px" @closed="handleDialogClosed">
      <el-form ref="form" :model="dialog.form" size="small" label-width="100px" label-position="right"  :inline="true">
        <el-form-item label="车号">
          <el-input v-model="dialog.form.vehicle"  placeholder="车号" style="width: 220px;"></el-input>
        </el-form-item>
         <el-form-item label="公司">
          <el-input v-model="dialog.form.company"  placeholder="公司" style="width: 220px;"></el-input>
        </el-form-item>
         <el-form-item label="车型">
           <el-select v-model="dialog.form.vehicleType" filterable placeholder="车型" style="width: 220px;">
             <el-option
               v-for="item in select.vehicleType"
               :key="item.value"
               :label="item.label"
               :value="item.value">
             </el-option>
           </el-select>
        </el-form-item>
         <el-form-item label="车辆颜色">
          <el-input v-model="dialog.form.vehicleColor"  placeholder="车辆颜色" style="width: 220px;"></el-input>
        </el-form-item>
         <el-form-item label="燃料类型">
           <el-select v-model="dialog.form.fuelType" filterable placeholder="燃料类型" style="width: 220px;">
             <el-option
               v-for="item in select.fuelType"
               :key="item.value"
               :label="item.label"
               :value="item.value">
             </el-option>
           </el-select>
        </el-form-item>
         <el-form-item label="终端类型">
           <el-select v-model="dialog.form.terminalType" filterable placeholder="终端类型" style="width: 220px;">
             <el-option
               v-for="item in select.terminalType"
               :key="item.value"
               :label="item.label"
               :value="item.value">
             </el-option>
           </el-select>
        </el-form-item>
         <el-form-item label="终端型号">
          <el-input v-model="dialog.form.terminalModel"  placeholder="终端型号" style="width: 220px;"></el-input>
        </el-form-item>
         <el-form-item label="车主姓名">
          <el-input v-model="dialog.form.ownerName"  placeholder="车主姓名" style="width: 220px;"></el-input>
        </el-form-item>
         <el-form-item label="电话号码">
          <el-input v-model="dialog.form.ownerPhone"  placeholder="电话号码" style="width: 220px;"></el-input>
        </el-form-item>
         <el-form-item label="白班姓名">
          <el-input v-model="dialog.form.dayPerson"  placeholder="白班姓名" style="width: 220px;"></el-input>
        </el-form-item>
         <el-form-item label="夜班姓名">
          <el-input v-model="dialog.form.nightPerson"  placeholder="夜班姓名" style="width: 220px;"></el-input>
        </el-form-item>
         <el-form-item label="白班电话">
          <el-input v-model="dialog.form.dayPhone"  placeholder="白班电话" style="width: 220px;"></el-input>
        </el-form-item>
         <el-form-item label="夜班电话">
          <el-input v-model="dialog.form.nightPhone"  placeholder="夜班电话" style="width: 220px;"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialog.display = false">取 消</el-button>
        <el-button type="primary" @click="handleDialogSaveClick">提 交</el-button>
      </div>
    </el-dialog>
  </t-query-panel>
</template>

<script>
  import moment from 'moment'
  import { iconClassName ,baseURL} from 'util'
  import axios from 'axios'
  import _ from 'underscore'
  export default {
    name: 'DataAccessApplication',
    data() {
      return {
        query: {
          startTime: '',
          endTime: '',
          company: '',
          vehicle: ''
        },
        inputVehicle: {
          loading: false,
          option: []
        },
        table: {
          display: false,
          selectItem: [],
          data: []
        },
        select:{
          vehicle: [],
          company:[],
          vehicleType: [],
          fuelType: [],
          terminalType: [],
        },
        dialog: {
          title: '',
          display: false,
          form: {
            vehicle: '',
            company: '',
            vehicleType: '',
            vehicleColor: '',
            fuelType: '',
            terminalType: '',
            terminalModel: '',
            ownerName: '',
            ownerPhone: '',
            dayPerson: '',
            nightPerson: '',
            dayPhone: '',
            nightPhone: ''
          }
        }
      }
    },
    mounted() {
      this.query.startTime = new Date(moment().add('day', -1));
      this.query.endTime = new Date();
      this.findDataApplication();
      this.getVehicle();
      this.getCompany();
      this.getFuelType();
      this.getTerminalType();
      this.getVehicleType();
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
      getFuelType(){
        axios.get('common/fuelType', {
          baseURL,
          params: {}
        }).then(res=> {
          this.select.fuelType = _.map(res.data, item => {
            return {
              label: item.RLLX,
              value: item.RLLX
            }
          });
        }).catch(function (error) {
        });
      },
      getTerminalType(){
        axios.get('common/terminalType', {
          baseURL,
          params: {}
        }).then(res=> {
          this.select.terminalType = _.map(res.data, item => {
            return {
              label: item.MT_NAME,
              value: item.MT_NAME
            }
          });
        }).catch(function (error) {
        });
      },
      getVehicleType(){
        axios.get('common/vehicleType', {
          baseURL,
          params: {}
        }).then(res=> {
          this.select.vehicleType = _.map(res.data, item => {
            return {
              label: item.VT_NAME,
              value: item.VT_NAME
            }
          });
        }).catch(function (error) {
        });
      },
      findDataApplication() {
        const {startTime, endTime, company, vehicle} = this.query;
        this.table.display = true;
        axios.get('letterManagement/findDataApplication', {
          baseURL,
          params: {
            startTime: startTime && moment(startTime).format('YYYY-MM-DD'),
            endTime: endTime && moment(endTime).format('YYYY-MM-DD'),
            company,
            vehicle
          }
        }).then(res=> {
          this.table.data = res.data||[];
          this.table.display = false;
        }).catch(function (error) {
          console.log(error);
        });
      },
      addDataApplication(){
        const {vehicle, company, vehicleType, fuelType, terminalType, terminalModel, ownerName, ownerPhone, dayPerson, nightPerson, dayPhone, nightPhone, vehicleColor} = this.dialog.form;
        let mobile =  /^(0|86|17951)?(13[0-9]|15[012356789]|17[01678]|18[0-9]|14[57])[0-9]{8}$/;
        let telephone= /^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/;
        if(vehicle===''||company===''||ownerName===''||ownerPhone===''){
          this.$message.error('请填写完车牌号码，公司，车主姓名，车主电话！');
          return false;
        }
        if (!((mobile.test(ownerPhone)||telephone.test(ownerPhone)||ownerPhone==='')&&(mobile.test(dayPhone)||telephone.test(dayPhone)||dayPhone==='')&&(mobile.test(nightPhone)||telephone.test(nightPhone)||nightPhone===''))){
          this.$message.error('请填写正确手机号码！');
          return false;
        }
        axios.get('letterManagement/addDataApplication', {
          baseURL,
          params: {
            vehicle, company, vehicleType, fuelType, terminalType, terminalModel, ownerName, ownerPhone, dayPerson, nightPerson, dayPhone, nightPhone, vehicleColor
          }
        }).then(res => {
          if(res.data>0){
            this.$message({message: "操作成功!", type: 'success'});
            this.dialog.display = false;
            this.findDataApplication();
          }else if (res.data===0){
            this.$message.error('操作失败！');
          }else if (res.data===-1){
            this.$message.error('该车辆已申请！');
          }
        }).catch(function (error) {
          console.error(error);
        });
      },
      updateDataApplication(){
        const {vehicle, company, vehicleType, fuelType, terminalType, terminalModel, ownerName, ownerPhone, dayPerson, nightPerson, dayPhone, nightPhone, vehicleColor} = this.dialog.form;
        let mobile =  /^(0|86|17951)?(13[0-9]|15[012356789]|17[01678]|18[0-9]|14[57])[0-9]{8}$/;
        let telephone= /^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/;
        if(vehicle===''||company===''||ownerName===''||ownerPhone===''){
          this.$message.error('请填写完车牌号码，公司，车主姓名，车主电话！');
          return false;
        }
        if (!((mobile.test(ownerPhone)||telephone.test(ownerPhone)||ownerPhone==='')&&(mobile.test(dayPhone)||telephone.test(dayPhone)||dayPhone==='')&&(mobile.test(nightPhone)||telephone.test(nightPhone)||nightPhone===''))){
          this.$message.error('请填写正确手机号码！');
          return false;
        }
        axios.get('letterManagement/updateDataApplication', {
          baseURL,
          params: {
            id: this.table.selectItem.ID,
            vehicle, company, vehicleType, fuelType, terminalType, terminalModel, ownerName, ownerPhone, dayPerson, nightPerson, dayPhone, nightPhone, vehicleColor
          }
        }).then(res => {
          if(res.data>0){
            this.$message({message: "操作成功!", type: 'success'});
            this.dialog.display = false;
            this.findDataApplication();
          }else if (res.data===0){
            this.$message.error('操作失败！');
          }else if (res.data===-1){
            this.$message.error('该车辆已申请！');
          }
        }).catch(function (error) {
          console.error(error);
        });
      },
      /*事件*/
      handleQueryClick() {
        this.findDataApplication();
      },
      handleTableAddClick() {
        this.dialog.title = '添加';
        sessionStorage.setItem('username','测试');
        this.dialog.form.company = sessionStorage.getItem('username');
        this.dialog.display = true;
      },
      handleTableEditClick(item) {
        this.dialog.title = '修改';
        this.dialog.display = true;
        this.table.selectItem = item;
        this.dialog.form.vehicle = item.VEHICLE_NO;
        this.dialog.form.company = item.COMPANY_NAME;
        this.dialog.form.vehicleType = item.VEHICLE_TYPE;
        this.dialog.form.vehicleColor = item.VEHICLE_COLOR;
        this.dialog.form.fuelType = item.FUEL_TYPE;
        this.dialog.form.terminalType = item.TERMINAL_TYPE
        this.dialog.form.terminalModel = item.TERMINAL_MODEL;
        this.dialog.form.ownerName = item.OWNER_NAME;
        this.dialog.form.ownerPhone = item.OWNER_PHONE;
        this.dialog.form.dayPerson = item.DAY_PERSON;
        this.dialog.form.nightPerson = item.NIGHT_PERSON;
        this.dialog.form.dayPhone = item.DAY_PHONE;
        this.dialog.form.nightPhone = item.NIGHT_PHONE;
      },
      handleTableDeleteClick(item) {
        this.$confirm('是否删除?', '提示', {
          confirmButtonText: '是',
          cancelButtonText: '否',
          cancelButtonClass: 'el-button--danger',
          closeOnClickModal: false,
          type: 'info',
          center: true
        }).then(() => {
          axios.get('letterManagement/deleteDataApplication', {
            baseURL,
            params: {id:item.ID}
          }).then(res => {
            if(res.data>0){
              this.$message({message: "操作成功!", type: 'success'});
              this.findDataApplication();
            }else{
              this.$message.error('操作失败！');
            }
          }).catch(function (error) {
            console.error(error);
          });
        }).catch(() => {

        });
      },
      handleDialogSaveClick() {
        if(this.dialog.title === '修改'){
          this.updateDataApplication();
        }else if(this.dialog.title === '添加'){
          this.addDataApplication();
        }
      },
      handleDialogClosed() {
        this.dialog.title = '';
        this.dialog.form.vehicle = '';
        this.dialog.form.company = '';
        this.dialog.form.vehicleType = '';
        this.dialog.form.vehicleColor = '';
        this.dialog.form.fuelType = '';
        this.dialog.form.terminalType = '';
        this.dialog.form.terminalModel = '';
        this.dialog.form.ownerName = '';
        this.dialog.form.ownerPhone = '';
        this.dialog.form.dayPerson = '';
        this.dialog.form.nightPerson = '';
        this.dialog.form.dayPhone = '';
        this.dialog.form.nightPhone = '';
        this.table.selectItem = [];
      },
      handleExportClick() {
        const {startTime, endTime, company, vehicle} = this.query;
        this.$confirm('是否需要导出?', '提示', {
          confirmButtonText: '是',
          cancelButtonText: '否',
          cancelButtonClass: 'el-button--danger',
          closeOnClickModal: false,
          type: 'info',
          center: true
        }).then(() => {
          window.open(`${baseURL}letterManagement/findDataApplicationExcel?startTime=${startTime && moment(startTime).format('YYYY-MM-DD')}&endTime=${endTime && moment(endTime).format('YYYY-MM-DD')}&company=${company}&vehicle=${vehicle}`);
        }).catch(() => {
        });
      }
    }
  }
</script>

