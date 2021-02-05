<!-- 岗位管理 -->
<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <t-query-panel :model="query" footer="300">
    <template v-slot:querybar>
      <el-form-item>
        <el-input  v-model="query.station" placeholder="岗位"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleQueryClick">查询</el-button>
        <el-button type="primary" @click="handleExportClick">导出</el-button>
        <el-button type="primary" @click="handleTableAddClick">添加</el-button>
      </el-form-item>
    </template>
    <t-table-page :data="table.data" :loading="table.display" :page-size="20">
      <el-table-column type="index" label="序号" align="center" width="50" :resizable="false"></el-table-column>
      <el-table-column prop="STATION_NAME" label="岗位名" align="center" width="240"></el-table-column>
      <el-table-column prop="STATION_JURI" label="页面权限" :show-overflow-tooltip="true" align="center"  min-width="160" :resizable="false"></el-table-column>
      <el-table-column prop="ALLOW_OPERATION_NAME" label="操作权限" :show-overflow-tooltip="true" align="center"  min-width="160" :resizable="false"></el-table-column>
      <el-table-column :resizable="false" width="100" align="center">
        <!--<template slot="header" slot-scope="scope">-->
          <!--<el-button size="mini" icon="el-icon-plus" @click="handleTableAddClick"></el-button>-->
        <!--</template>-->
        <template slot-scope="scope">
          <el-button size="mini" icon="el-icon-edit" type="text" @click="handleTableEditClick(scope.row)"></el-button>
          <el-button size="mini" icon="el-icon-delete" type="text" @click="handleTableDeleteClick(scope.row)"></el-button>
        </template>
      </el-table-column>
    </t-table-page>
    <el-dialog :title="dialog.title" :visible.sync="dialog.display" width="800px"  @closed="handleDialogClosed">
      <el-form ref="form" :model="dialog.form" size="small" label-width="100px" label-position="right">
        <el-form-item label="岗位">
          <el-input v-model="dialog.form.station" placeholder="岗位" style="width: 250px;"></el-input>
        </el-form-item>
        <el-form-item label="页面权限">
          <template >
            <div v-for="module in select.module">
              <span>{{module}}</span>
              <el-checkbox-group v-model="dialog.form.power_names" style="position: left;">
                <el-checkbox v-for="item in select.power"  v-if="item.MODULE===module" :label="item.POWER" :key="item.POWER">{{item.POWER}}</el-checkbox>
              </el-checkbox-group>
            </div>
          </template>
        </el-form-item>
        <el-form-item label="操作权限">
          <template >
            <div v-for="option_one in select.options">
              <span>{{option_one.name}}</span>
              <el-checkbox-group v-model="dialog.form.allow_operation_ids" >
                <el-checkbox v-for="item in option_one.option"  :label="item.id" :key="item.id">{{item.name}}</el-checkbox>
              </el-checkbox-group>
            </div>
          </template>
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
    name: 'JobManage',
    data() {
      return {
        query: {
          station: '',
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
          power: [],
          module: [],
          options:[
            {
              name:'爱心业务用车记录',
              id:'axywycjl',
              option:[
                {name:'查询', id: 'axywycjl_query'},
                {name:'添加', id: 'axywycjl_add'},
                {name:'修改', id: 'axywycjl_update'},
                {name:'删除', id: 'axywycjl_delete'},
              ]
            }
          ]
        },
        dialog: {
          title: '',
          display: false,
          form: {
            station: '',
            power_names: [],
            power_ids: [],
            allow_operation_name: [],
            allow_operation_ids: ['axywycjl_query']
          },
        }
      }
    },
    mounted() {
      this.findJobManage();
      this.getPower();
    },
    methods: {
      iconClassName,
      getPower(){
        axios.get('common/power', {
          baseURL,
          params: {}
        }).then(res=> {
          this.select.power = res.data||[];
          this.select.module = [];
          const {module} = this.select;
          _.each(res.data,item=>{
            if(module.indexOf(item.MODULE)===-1){
              module.push(item.MODULE);
            }
          });
        }).catch(function (error) {
        });
      },
      findJobManage() {
        const {station} = this.query;
        this.table.display = true;
        axios.get('basicData/findJobManage', {
          baseURL,
          params: {
            station
          }
        }).then(res=> {
          console.log(res.data)
          this.table.data = res.data||[];
          this.table.display = false;
        }).catch(function (error) {
        });
      },
      addJobManage(){
        this.dialog.form.power_ids = [];
        this.dialog.form.allow_operation_name = [];
        const {station,power_names, power_ids, allow_operation_name, allow_operation_ids} = this.dialog.form;
        _.each(power_names,power=>{
          _.each(this.select.power,item=>{
            if(power===item.POWER){
              power_ids.push(item.POWER_ID);
            }
          })
        });
        _.each(allow_operation_ids,allow=>{
          _.each(this.select.options,item=>{
            if(allow.substring(0,allow.lastIndexOf('_'))===item.id){
              allow_operation_name.push(item.name+'('+_.filter(item.option,e=>{return allow===e.id})[0].name+')');
            }
          })
        });
        if(station===''||power_names.length===0||power_ids.length===0||allow_operation_name.length===0||allow_operation_ids.length===0){
          this.$message.error('请填写完整信息！');
          return false;
        }
        axios.get('basicData/addJobManage', {
          baseURL,
          params: {
            station,
            power_ids: power_ids.toString(),
            power_names: power_names.toString(),
            allow_operation_name: allow_operation_name.toString(),
            allow_operation_ids: allow_operation_ids.toString()
          }
        }).then(res => {
          if(res.data>0){
            this.$message({message: "操作成功!", type: 'success'});
            this.dialog.display = false;
            this.findJobManage();
          }else if (res.data===0){
            this.$message.error('操作失败！');
          }else if (res.data===-1){
            this.$message.error('该用户已添加！');
          }
        }).catch(function (error) {
        });
      },
      updateJobManage(){
        this.dialog.form.power_ids = [];
        this.dialog.form.allow_operation_name = [];
        const {station,power_names, power_ids, allow_operation_name, allow_operation_ids} = this.dialog.form;
        _.each(power_names,power=>{
          _.each(this.select.power,item=>{
            if(power===item.POWER){
              power_ids.push(item.POWER_ID);
            }
          })
        });
        _.each(allow_operation_ids,allow=>{
          _.each(this.select.options,item=>{
            if(allow.substring(0,allow.lastIndexOf('_'))===item.id){
              allow_operation_name.push(item.name+'('+_.filter(item.option,e=>{return allow===e.id})[0].name+')');
            }
          })
        });
        if(station===''||power_names.length===0||power_ids.length===0||allow_operation_name.length===0||allow_operation_ids.length===0){
          this.$message.error('请填写完整信息！');
          return false;
        }
        axios.get('basicData/updateJobManage', {
          baseURL,
          params: {
            id: this.table.selectItem.ID,
            station,
            power_ids: power_ids.toString(),
            power_names: power_names.toString(),
            allow_operation_name: allow_operation_name.toString(),
            allow_operation_ids: allow_operation_ids.toString(),
          }
        }).then(res => {
          if(res.data>0){
            this.$message({message: "操作成功!", type: 'success'});
            this.dialog.display = false;
            this.findJobManage();
          }else if (res.data===0){
            this.$message.error('操作失败！');
          }else if (res.data===-1){
            this.$message.error('该用户已添加！');
          }
        }).catch(function (error) {
        });
      },
      /*事件*/
      handleQueryClick() {
        this.findJobManage();
      },
      handleTableAddClick() {
        this.dialog.title = '添加';
        this.dialog.display = true;
      },
      handleTableEditClick(item) {
        this.dialog.title = '修改';
        this.dialog.display = true;
        this.table.selectItem = item;
        this.dialog.form.station = item.STATION_NAME;
        this.dialog.form.power_names = item.STATION_JURI.split(',');
        this.dialog.form.power_ids = item.POWER_IDS.split(',');
        this.dialog.form.allow_operation_name = item.ALLOW_OPERATION_NAME.split(',');
        this.dialog.form.allow_operation_ids = item.ALLOW_OPERATION_IDS.split(',');
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
          axios.get('basicData/deleteJobManage', {
            baseURL,
            params: {id:item.ID}
          }).then(res => {
            if(res.data>0){
              this.$message({message: "操作成功!", type: 'success'});
              this.findJobManage();
            }else if (res.data===0){
              this.$message.error('操作失败！');
            }else if (res.data===-1){
              this.$message.error('该岗位正在使用！');
            }
          }).catch(function (error) {
          });
        }).catch(() => {

        });
      },
      handleDialogSaveClick() {
        if(this.dialog.title === '修改'){
          this.updateJobManage();
        }else if(this.dialog.title === '添加'){
          this.addJobManage();
        }
      },
      handleDialogClosed() {
        this.dialog.title = '';
        this.dialog.form.station = '';
        this.dialog.form.power_names = [];
        this.dialog.form.power_ids = [];
        this.dialog.form.allow_operation_name = [];
        this.dialog.form.allow_operation_ids = ['axywycjl_query'];
        this.table.selectItem = [];
      },
      handleExportClick() {
        const {station} = this.query;
        this.$confirm('是否需要导出?', '提示', {
          confirmButtonText: '是',
          cancelButtonText: '否',
          cancelButtonClass: 'el-button--danger',
          closeOnClickModal: false,
          type: 'info',
          center: true
        }).then(() => {
          window.open(`${baseURL}basicData/findJobManageExcel?station=${station}`);
        }).catch(() => {

        });
      }
    }
  }
</script>



