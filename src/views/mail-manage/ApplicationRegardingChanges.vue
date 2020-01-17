<!-- 变更申请 -->
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
        placeholder="原车牌号码"
      ></el-autocomplete>
    </el-form-item>
      <el-form-item>
        <el-select v-model="query.new_vehicle"  clearable filterable placeholder="新车牌号码">
          <el-option
            v-for="item in select.new_vehicle"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <!--<el-autocomplete-->
          <!--v-model="query.new_vehicle"-->
          <!--:prefix-icon="iconClassName('icon-car')"-->
          <!--:fetch-suggestions="handleNewVehicleQuerySearch"-->
          <!--:trigger-on-focus="false"-->
          <!--placeholder="新车牌号码"-->
        <!--&gt;</el-autocomplete>-->
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleQueryClick">查询</el-button>
        <el-button type="primary" @click="handleExportClick">导出</el-button>
        <el-button type="primary" @click="handleTableAddClick">添加</el-button>
      </el-form-item>
    </template>
    <t-table-page :data="table.data" :loading="table.display" :page-size="20">
      <el-table-column type="index" label="序号" align="center" width="50" :resizable="false"></el-table-column>
      <el-table-column prop="OLD_VEHICLE_NO" label="原车牌号码" align="center" width="140"></el-table-column>
      <el-table-column prop="NEW_VEHICLE_NO" label="现车牌号码" align="center" width="140"></el-table-column>
      <el-table-column prop="APPLY_TIME" label="申请时间" align="center" width="140"></el-table-column>
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
          <el-autocomplete class="inline-input" v-model="dialog.form.vehicle" placeholder="车牌号码"
                           :fetch-suggestions="handleVehicleQuerySearch" :trigger-on-focus="false" style="width: 260px;"></el-autocomplete>
        </el-form-item>
        <el-form-item label="变更车牌号">
          <el-input v-model="dialog.form.new_vehicle" placeholder="变更车牌号" style="width: 260px;"></el-input>
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
    name: 'ApplicationRegardingChanges',
    data() {
      return {
        query: {
          startTime: '',
          endTime: '',
          vehicle: '',
          new_vehicle: ''
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
          new_vehicle: []
        },
        dialog: {
          title: '',
          display: false,
          form: {
            vehicle: '',
            new_vehicle: ''
          }
        }
      }
    },
    mounted() {
      this.query.startTime = new Date(moment().add('day', -1));
      this.query.endTime = new Date();
      this.findChangeApplication();
      this.getVehicle();
      this.getNewVehicle();
    },
    methods: {
      iconClassName,
      handleVehicleQuerySearch(query, cb) {
        if (query.length < 3) return cb([])
        cb(_.filter(this.select.vehicle, item => item.value.indexOf(query) > -1))
      },
      // handleNewVehicleQuerySearch(query, cb) {
      //   if (query.length < 3) return cb([])
      //   cb(_.filter(this.select.new_vehicle, item => item.value.indexOf(query) > -1))
      // },
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
      getNewVehicle(){
        axios.get('common/newVehicle', {
          baseURL,
          params: {}
        }).then(res=> {
          this.select.new_vehicle = _.map(res.data, item => {
            return {
              label: item.VEHICLE_NO,
              value: item.VEHICLE_NO
            }
          });
        }).catch(function (error) {
        });
      },
      findChangeApplication() {
        const {startTime, endTime, vehicle, new_vehicle} = this.query;
        this.table.display = true;
        axios.get('letterManagement/findChangeApplication', {
          baseURL,
          params: {
            startTime: startTime && moment(startTime).format('YYYY-MM-DD'),
            endTime: endTime && moment(endTime).format('YYYY-MM-DD'),
            vehicle,
            new_vehicle
          }
        }).then(res=> {
          this.table.data = res.data||[];
          this.table.display = false;
        }).catch(function (error) {
        });
      },
      addChangeApplication(){
        const {vehicle,new_vehicle} = this.dialog.form;
        if(vehicle===''||new_vehicle===''){
          this.$message.error('请填写完整信息！');
          return false;
        }
        axios.get('letterManagement/addChangeApplication', {
          baseURL,
          params: {
            vehicle,
            new_vehicle
          }
        }).then(res => {
          if(res.data>0){
            this.$message({message: "操作成功!", type: 'success'});
            this.dialog.display = false;
            this.findChangeApplication();
            this.getNewVehicle();
          }else if (res.data===0){
            this.$message.error('操作失败！');
          }else if (res.data===-1){
            this.$message.error('该车辆已申请！');
          }
        }).catch(function (error) {
        });
      },
      updateChangeApplication(){
        const {vehicle,new_vehicle} = this.dialog.form;
        if(vehicle===''||new_vehicle===''){
          this.$message.error('请填写完整信息！');
          return false;
        }
        axios.get('letterManagement/updateChangeApplication', {
          baseURL,
          params: {
            id: this.table.selectItem.ID,
            vehicle,
            new_vehicle
          }
        }).then(res => {
          if(res.data>0){
            this.$message({message: "操作成功!", type: 'success'});
            this.dialog.display = false;
            this.findChangeApplication();
            this.getNewVehicle();
          }else if (res.data===0){
            this.$message.error('操作失败！');
          }else if (res.data===-1){
            this.$message.error('该车辆已申请！');
          }
        }).catch(function (error) {
        });
      },
      /*事件*/
      handleQueryClick() {
        this.findChangeApplication();
      },
      handleTableAddClick() {
        this.dialog.title = '添加';
        this.dialog.display = true;
      },
      handleTableEditClick(item) {
        this.dialog.title = '修改';
        this.dialog.display = true;
        this.table.selectItem = item;
        this.dialog.form.vehicle = item.OLD_VEHICLE_NO;
        this.dialog.form.new_vehicle = item.NEW_VEHICLE_NO;
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
          axios.get('letterManagement/deleteChangeApplication', {
            baseURL,
            params: {id:item.ID}
          }).then(res => {
            if(res.data>0){
              this.$message({message: "操作成功!", type: 'success'});
              this.findChangeApplication();
              this.getNewVehicle();
            }else{
              this.$message.error('操作失败！');
            }
          }).catch(function (error) {
          });
        }).catch(() => {

        });
      },
      handleDialogSaveClick() {
        if(this.dialog.title === '修改'){
          this.updateChangeApplication();
        }else if(this.dialog.title === '添加'){
          this.addChangeApplication();
        }
      },
      handleDialogClosed() {
        this.dialog.title = '';
        this.dialog.form.vehicle = '';
        this.dialog.form.new_vehicle = '';
        this.table.selectItem = [];
      },
      handleExportClick() {
        const {startTime, endTime, vehicle, new_vehicle} = this.query;
        this.$confirm('是否需要导出?', '提示', {
          confirmButtonText: '是',
          cancelButtonText: '否',
          cancelButtonClass: 'el-button--danger',
          closeOnClickModal: false,
          type: 'info',
          center: true
        }).then(() => {
          window.open(`${baseURL}letterManagement/findChangeApplicationExcel?startTime=${startTime && moment(startTime).format('YYYY-MM-DD')}&endTime=${endTime && moment(endTime).format('YYYY-MM-DD')}&vehicle=${vehicle}&new_vehicle=${new_vehicle}`);
        }).catch(() => {
        });
      }
    }
  }
</script>


