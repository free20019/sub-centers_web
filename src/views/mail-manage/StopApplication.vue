<!-- 报停申请 -->
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
      <el-table-column type="index" label="序号" align="center" width="50" :resizable="false"></el-table-column>
      <el-table-column prop="COMPANY_NAME" label="公司名称" align="center" width="140"></el-table-column>
      <el-table-column prop="VEHICLE_NO" label="车牌号码" align="center" width="140"></el-table-column>
      <el-table-column prop="STOP_TIME" label="停报时间" align="center" width="140"></el-table-column>
      <el-table-column prop="STOP_REASON" label="停报原因" align="center" width="140"></el-table-column>
      <el-table-column prop="UP_TIME" label="上报日期" align="center" width="140"></el-table-column>
      <el-table-column prop="AUDIT_STATUS" label="审核状态" align="center" width="140"></el-table-column>
      <el-table-column prop="AUDIT_TIME" label="审核时间" align="center" width="140"></el-table-column>
      <el-table-column prop="AUDIT_REASON" label="审核原因" align="center"  min-width="160" :resizable="false"></el-table-column>
      <el-table-column :resizable="false" width="100" align="center">
        <!--<template slot="header" slot-scope="scope">-->
          <!--<el-button size="mini" icon="el-icon-plus" @click="handleTableAddClick"></el-button>-->
        <!--</template>-->
        <template slot-scope="scope">
          <el-button size="mini" icon="el-icon-edit" type="text" @click="handleTableEditClick(scope.row,)"></el-button>
          <el-button size="mini" icon="el-icon-delete" type="text" @click="handleTableDeleteClick(scope.row)"></el-button>
        </template>
      </el-table-column>
    </t-table-page>
    <el-dialog :title="dialog.title" :visible.sync="dialog.display" width="400px" @closed="handleDialogClosed">
      <el-form ref="form" :model="dialog.form" size="small" label-width="100px" label-position="right">
        <el-form-item label="车牌号码">
          <el-autocomplete class="inline-input" v-model="dialog.form.vehicle" placeholder="车牌号码（公司）"
                           :fetch-suggestions="handleVehicleCompanyQuerySearch" :trigger-on-focus="false" style="width: 260px;"></el-autocomplete>
        </el-form-item>
        <el-form-item label="报停原因">
          <el-input type="textarea" :rows="2" v-model="dialog.form.reason"  placeholder="报停原因" style="width: 260px;"></el-input>
        </el-form-item>
        <el-form-item label="报停时间">
          <el-date-picker v-model="dialog.form.time" type="datetime" placeholder="报停时间" style="width: 260px;"></el-date-picker>
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
    name: 'StopApplication',
    data() {
      return {
        query: {
          startTime: '',
          endTime: '',
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
          vehicle_company:[],
        },
        dialog: {
          title: '',
          display: false,
          form: {
            vehicle: '',
            reason: '',
            time: ''
          }
        }
      }
    },
    mounted() {
      this.query.startTime = new Date(moment().add('day', -1));
      this.query.endTime = new Date();
      this.findStopApplication();
      this.getVehicle();
    },
    methods: {
      iconClassName,
      handleVehicleQuerySearch(query, cb) {
        if (query.length < 3) return cb([])
        cb(_.filter(this.select.vehicle, item => item.value.indexOf(query) > -1))
      },
      handleVehicleCompanyQuerySearch(query, cb) {
        if (query.length < 3) return cb([])
        cb(_.filter(this.select.vehicle_company, item => item.value.indexOf(query) > -1))
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
          this.select.vehicle_company = _.map(res.data, item => {
            return{
              value: item.VEHICLE_NO+"("+item.COMPANY_NAME+")"
            }
          })
        }).catch(function (error) {
          console.log(error);
        });
      },
      findStopApplication() {
        const {startTime, endTime, vehicle} = this.query;
        this.table.display = true;
        axios.get('letterManagement/findStopApplication', {
          baseURL,
          params: {
            startTime: startTime && moment(startTime).format('YYYY-MM-DD'),
            endTime: endTime && moment(endTime).format('YYYY-MM-DD'),
            vehicle
          }
        }).then(res=> {
          this.table.data = res.data||[];
          this.table.display = false;
        }).catch(function (error) {
          console.log(error);
        });
      },
      addStopApplication(){
        const {vehicle,reason, time} = this.dialog.form;
        if(vehicle===''||reason===''||time===''){
          this.$message.error('请填写完整信息！');
          return false;
        }
        axios.get('letterManagement/addStopApplication', {
          baseURL,
          params: {
            vehicle,
            reason,
            time: time && moment(time).format('YYYY-MM-DD HH:mm:ss'),
          }
        }).then(res => {
          if(res.data>0){
            this.$message({message: "操作成功!", type: 'success'});
            this.dialog.display = false;
            this.findStopApplication();
          }else if (res.data===0){
            this.$message.error('操作失败！');
          }else if (res.data===-1){
            this.$message.error('该车辆已申请！');
          }
        }).catch(function (error) {
          console.error(error);
        });
      },
      updateStopApplication(){
        const {vehicle,reason, time} = this.dialog.form;
        if(vehicle===''||reason===''||time===''){
          this.$message.error('请填写完整信息！');
          return false;
        }
        axios.get('letterManagement/updateStopApplication', {
          baseURL,
          params: {
            id: this.table.selectItem.ID,
            vehicle,
            reason,
            time: time && moment(time).format('YYYY-MM-DD HH:mm:ss'),
          }
        }).then(res => {
          if(res.data>0){
            this.$message({message: "操作成功!", type: 'success'});
            this.dialog.display = false;
            this.findStopApplication();
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
        this.findStopApplication();
      },
      handleTableAddClick() {
        this.dialog.title = '添加';
        this.dialog.display = true;
      },
      handleTableEditClick(item) {
        this.dialog.title = '修改';
        this.dialog.display = true;
        this.table.selectItem = item;
        this.dialog.form.vehicle = item.VEHICLE_NO+"("+item.COMPANY_NAME+")";
        this.dialog.form.reason = item.STOP_REASON;
        this.dialog.form.time = item.STOP_TIME;
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
          axios.get('letterManagement/deleteStopApplication', {
            baseURL,
            params: {id:item.ID}
          }).then(res => {
            if(res.data>0){
              this.$message({message: "操作成功!", type: 'success'});
              this.findStopApplication();
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
          this.updateStopApplication();
        }else if(this.dialog.title === '添加'){
          this.addStopApplication();
        }
      },
      handleDialogClosed() {
        this.dialog.title = '';
        this.dialog.form.vehicle = '';
        this.dialog.form.reason = '';
        this.dialog.form.time = '';
        this.table.selectItem = [];
      },
      handleExportClick() {
        const {startTime, endTime, vehicle} = this.query;
        this.$confirm('是否需要导出?', '提示', {
          confirmButtonText: '是',
          cancelButtonText: '否',
          cancelButtonClass: 'el-button--danger',
          closeOnClickModal: false,
          type: 'info',
          center: true
        }).then(() => {
          window.open(`${baseURL}letterManagement/findStopApplicationExcel?startTime=${startTime && moment(startTime).format('YYYY-MM-DD')}&endTime=${endTime && moment(endTime).format('YYYY-MM-DD')}&vehicle=${vehicle}&type=${0}`);
        }).catch(() => {
        });
      }
    }
  }
</script>

