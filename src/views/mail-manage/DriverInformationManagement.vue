<!-- 企业车辆驾驶员信息管理-->
<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <t-query-panel :model="query" footer="300">
    <template v-slot:querybar>
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
        <el-input v-model="query.owner" placeholder="车主姓名" ></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="query.phone" placeholder="车主电话"></el-input>
      </el-form-item>
      <el-form-item>
        <el-select v-model="query.user" placeholder="录入人员" clearable>
          <el-option v-for="item in userList" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleQueryClick">查询</el-button>
        <el-button type="primary" @click="handleExportClick">导出</el-button>
        <el-button type="primary" @click="handleTableAddClick">添加</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleImportFileClick">导入</el-button>
        <input type="file" ref="importFile" style="display: none;" @change="handleImportFileChange" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleTemplateFileClick">模板下载</el-button>
      </el-form-item>
    </template>
    <t-table-page :data="table.data" :loading="table.display" :page-size="20">
      <el-table-column type="index" label="序号" align="center" width="50" :resizable="false" fixed></el-table-column>
      <el-table-column prop="COMPANY_NAME" label="公司" width="200" align="center"></el-table-column>
      <el-table-column prop="BRANCH_OFFICE" label="分公司" width="200" align="center"></el-table-column>
      <el-table-column prop="VEHICLE_NO" label="车牌号码" width="100" align="center"></el-table-column>
      <el-table-column prop="OWNER_NAME" label="车主姓名" width="100" align="center"></el-table-column>
      <el-table-column prop="OWNER_PHONE" label="车主电话" width="140" align="center"></el-table-column>
      <el-table-column prop="DAY_PHONE" label="统班、白班电话" width="200" align="center"></el-table-column>
      <el-table-column prop="NIGHT_PHONE" label="晚班电话" width="140" align="center"></el-table-column>
      <el-table-column prop="SHIFT_PHONE" label="替班电话" width="140" align="center"></el-table-column>
      <el-table-column prop="COMMIT_PERSON" label="录入人员" width="140" align="center"></el-table-column>
      <el-table-column prop="DB_TIME" label="入库时间" min-width="140" align="center" :resizable="false"></el-table-column>
      <el-table-column label="操作" :resizable="false" width="100"  align="center" fixed="right">
        <template slot-scope="scope">
          <el-button size="mini" icon="el-icon-edit" type="text" @click="handleTableEditClick(scope.row)"></el-button>
          <el-button size="mini" icon="el-icon-delete" type="text" @click="handleTableDeleteClick(scope.row)"></el-button>
        </template>
      </el-table-column>
    </t-table-page>
    <el-dialog :title="dialog.title" :visible.sync="dialog.display" width="800px" @closed="handleDialogClosed">
      <el-form ref="form" :model="dialog.form" size="small" label-width="100px" label-position="right"  :inline="true">
        <el-form-item label="车牌号码">
          <el-autocomplete class="inline-input" v-model="dialog.form.VEHICLE_NO" placeholder="车牌号码"
                           :fetch-suggestions="handleVehicleQuerySearch" :trigger-on-focus="false" style="width: 220px;"  @input="handleFilterClick()"></el-autocomplete>
        </el-form-item>
        <el-form-item label="公司">
          <el-input v-model="dialog.form.COMPANY_NAME"  placeholder="公司" style="width: 220px;" disabled></el-input>
        </el-form-item>
        <el-form-item label="分公司">
          <el-input v-model="dialog.form.BRANCH_OFFICE"  placeholder="分公司" style="width: 220px;"></el-input>
        </el-form-item>
        <el-form-item label="车主姓名">
          <el-input v-model="dialog.form.OWNER_NAME"  placeholder="车主姓名" style="width: 220px;"></el-input>
        </el-form-item>
        <el-form-item label="车主电话">
          <el-input v-model="dialog.form.OWNER_PHONE"  placeholder="车主电话" style="width: 220px;"></el-input>
        </el-form-item>
        <el-form-item label="白班电话">
          <el-input v-model="dialog.form.DAY_PHONE"  placeholder="统班、白班电话" style="width: 220px;"></el-input>
        </el-form-item>
        <el-form-item label="晚班电话">
          <el-input v-model="dialog.form.NIGHT_PHONE"  placeholder="晚班电话" style="width: 220px;"></el-input>
        </el-form-item>
        <el-form-item label="替班电话">
          <el-input v-model="dialog.form.SHIFT_PHONE"  placeholder="替班电话" style="width: 220px;"></el-input>
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
    name: 'DriverInformationManagement',
    data() {
      return {
        query: {
          phone: '',
          owner: '',
          vehicle: '',
          user: ''
        },
        userList: [],
        table: {
          display: false,
          selectItem: [],
          data: []
        },
        select:{
          all: [],
          vehicle: [],
        },
        dialog: {
          title: '',
          display: false,
          form: {
            COMPANY_NAME: '',
            BRANCH_OFFICE: '',
            VEHICLE_NO: '',
            OWNER_NAME: '',
            OWNER_PHONE: '',
            DAY_PHONE: '',
            NIGHT_PHONE: '',
            SHIFT_PHONE: '',
          }
        }
      }
    },
    mounted() {
      this.getUser();
      if(this.userList.length===0){
        setTimeout(()=>{
          this.findDriverInformationManagement();
        }, 1 * 1000)
      }
      this.getVehicle();
    },
    methods: {
      iconClassName,
      handleVehicleQuerySearch(query, cb) {
        if (query.length < 3) return cb([])
        cb(_.filter(this.select.vehicle, item => item.value.indexOf(query) > -1))
      },
      handleFilterClick(){
        const { VEHICLE_NO } = this.dialog.form
        let arr = _.filter(this.select.all, item => {
          return (
            item.VEHICLE_NO===VEHICLE_NO
          )
        })
        if(arr.length===1){
          this.dialog.form.BRANCH_OFFICE=arr[0].UNIT_NAME
          this.dialog.form.COMPANY_NAME=arr[0].COMPANY_NAME
        }else {
          this.dialog.form.BRANCH_OFFICE=''
          this.dialog.form.COMPANY_NAME=''
        }
      },
      getUser(){
        axios.get('map/getUser', { baseURL }).then(res => {
          if (res.data.allow_operation_ids === 'null'||res.data.allow_operation_ids === '') {
            console.log('用户未登录！！');
          } else {
            this.query.user = res.data.realname
            let map ={}
            map.value= res.data.realname
            map.label= res.data.realname
            this.userList.push(map)
          }
        })
      },
      getVehicle(){
        axios.get('common/vehicle', {
          baseURL,
          params: {
            type:0
          }
        }).then(res=> {
          this.select.all=res.data;
          this.select.vehicle = _.map(res.data, item => {
            return {
              value: item.VEHICLE_NO
            }
          });
        }).catch(function (error) {
          console.log(error);
        });
      },
      findDriverInformationManagement() {
        const {startTime, endTime,  type, phone, owner, vehicle, user} = this.query;
        this.table.display = true;
        axios.get('letterManagement/findDriverInformationManagement', {
          baseURL,
          params: {
            startTime: startTime && moment(startTime).format('YYYY-MM-DD'),
            endTime: endTime && moment(endTime).format('YYYY-MM-DD'),
            type,
            phone,
            owner,
            vehicle,
            user,
          }
        }).then(res=> {
          this.table.data = res.data||[];
          this.table.display = false;
        }).catch(function (error) {
          console.log(error);
        });
      },
      addDriverInformationManagement(){
        const {COMPANY_NAME,BRANCH_OFFICE,VEHICLE_NO,OWNER_NAME,OWNER_PHONE,DAY_PHONE,NIGHT_PHONE,SHIFT_PHONE} = this.dialog.form;
        let mobile =  /^(0|86|17951)?(13[0-9]|15[012356789]|17[01678]|18[0-9]|14[57])[0-9]{8}$/;
        let telephone= /^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/;

        if(COMPANY_NAME==='') return this.$message.error('请填写公司！');
        // if(BRANCH_OFFICE==='') return this.$message.error('请填写分公司！');
        if(VEHICLE_NO==='') return this.$message.error('请填写车牌号码！');
        if(OWNER_NAME==='') return this.$message.error('请填写车主姓名！');
        if(OWNER_PHONE==='') return this.$message.error('请填写车主电话！');
        if(DAY_PHONE==='') return this.$message.error('请填写统班、白班电话！');
        if(NIGHT_PHONE==='') return this.$message.error('请填写晚班电话！');
        if(SHIFT_PHONE==='') return this.$message.error('请填写替班电话！');

        if (!(mobile.test(OWNER_PHONE)||telephone.test(OWNER_PHONE)||OWNER_PHONE==='')){
          this.$message.error('请填写正确车主电话！');
          return false;
        }
        if (!(mobile.test(DAY_PHONE)||telephone.test(DAY_PHONE)||DAY_PHONE==='')){
          this.$message.error('请填写正确统班、白班电话！');
          return false;
        }
        if (!(mobile.test(NIGHT_PHONE)||telephone.test(NIGHT_PHONE)||NIGHT_PHONE==='')){
          this.$message.error('请填写正确晚班电话！');
          return false;
        }
        if (!(mobile.test(SHIFT_PHONE)||telephone.test(SHIFT_PHONE)||SHIFT_PHONE==='')){
          this.$message.error('请填写正确替班电话！');
          return false;
        }
        axios.get('letterManagement/addDriverInformationManagement', {
          baseURL,
          params: {
            COMPANY_NAME,BRANCH_OFFICE,VEHICLE_NO,OWNER_NAME,OWNER_PHONE,DAY_PHONE,NIGHT_PHONE,SHIFT_PHONE
          }
        }).then(res => {
          if(res.data>0){
            this.$message({message: "操作成功!", type: 'success'});
            this.dialog.display = false;
            this.findDriverInformationManagement();
          }else if (res.data===0){
            this.$message.error('操作失败！');
          }else if (res.data===-1){
            this.$message.error('信息重复！');
          }else if (res.data===-2){
            this.$message.error('录入人员为空,请重新登录！');
          }else{
            this.$message.error('其他错误！');
          }
        }).catch(function (error) {
          console.error(error);
        });
      },
      updateDriverInformationManagement(){
        const {COMPANY_NAME,BRANCH_OFFICE,VEHICLE_NO,OWNER_NAME,OWNER_PHONE,DAY_PHONE,NIGHT_PHONE,SHIFT_PHONE} = this.dialog.form;
        let mobile =  /^(0|86|17951)?(13[0-9]|15[012356789]|17[01678]|18[0-9]|14[57])[0-9]{8}$/;
        let telephone= /^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/;

        if(COMPANY_NAME==='') return this.$message.error('请填写公司！');
        // if(BRANCH_OFFICE==='') return this.$message.error('请填写分公司！');
        if(VEHICLE_NO==='') return this.$message.error('请填写车牌号码！');
        if(OWNER_NAME==='') return this.$message.error('请填写车主姓名！');
        if(OWNER_PHONE==='') return this.$message.error('请填写车主电话！');
        if(DAY_PHONE==='') return this.$message.error('请填写统班、白班电话！');
        if(NIGHT_PHONE==='') return this.$message.error('请填写晚班电话！');
        if(SHIFT_PHONE==='') return this.$message.error('请填写替班电话！');

        if (!(mobile.test(OWNER_PHONE)||telephone.test(OWNER_PHONE)||OWNER_PHONE==='')){
          this.$message.error('请填写正确车主电话！');
          return false;
        }
        if (!(mobile.test(DAY_PHONE)||telephone.test(DAY_PHONE)||DAY_PHONE==='')){
          this.$message.error('请填写正确统班、白班电话！');
          return false;
        }
        if (!(mobile.test(NIGHT_PHONE)||telephone.test(NIGHT_PHONE)||NIGHT_PHONE==='')){
          this.$message.error('请填写正确晚班电话！');
          return false;
        }
        if (!(mobile.test(SHIFT_PHONE)||telephone.test(SHIFT_PHONE)||SHIFT_PHONE==='')){
          this.$message.error('请填写正确替班电话！');
          return false;
        }
        axios.get('letterManagement/updateDriverInformationManagement', {
          baseURL,
          params: {
            id: this.table.selectItem.ID,
            COMPANY_NAME,BRANCH_OFFICE,VEHICLE_NO,OWNER_NAME,OWNER_PHONE,DAY_PHONE,NIGHT_PHONE,SHIFT_PHONE
          }
        }).then(res => {
          if(res.data>0){
            this.$message({message: "操作成功!", type: 'success'});
            this.dialog.display = false;
            this.findDriverInformationManagement();
          }else if (res.data===0){
            this.$message.error('操作失败！');
          }else if (res.data===-1){
            this.$message.error('信息重复！');
          }else{
            this.$message.error('其他错误！');
          }
        }).catch(function (error) {
          console.error(error);
        });
      },
      /*事件*/
      handleQueryClick() {
        this.findDriverInformationManagement();
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
        this.dialog.form.COMPANY_NAME = item.COMPANY_NAME;
        this.dialog.form.BRANCH_OFFICE = item.BRANCH_OFFICE;
        this.dialog.form.VEHICLE_NO = item.VEHICLE_NO;
        this.dialog.form.OWNER_NAME = item.OWNER_NAME;
        this.dialog.form.OWNER_PHONE = item.OWNER_PHONE;
        this.dialog.form.DAY_PHONE = item.DAY_PHONE;
        this.dialog.form.NIGHT_PHONE = item.NIGHT_PHONE;
        this.dialog.form.SHIFT_PHONE = item.SHIFT_PHONE;

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
          axios.get('letterManagement/deleteDriverInformationManagement', {
            baseURL,
            params: {id:item.ID}
          }).then(res => {
            if(res.data>0){
              this.$message({message: "操作成功!", type: 'success'});
              this.findDriverInformationManagement();
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
          this.updateDriverInformationManagement();
        }else if(this.dialog.title === '添加'){
          this.addDriverInformationManagement();
        }
      },
      handleDialogClosed() {
        this.dialog.title = '';
        this.dialog.form.COMPANY_NAME = '';
        this.dialog.form.BRANCH_OFFICE = '';
        this.dialog.form.VEHICLE_NO = '';
        this.dialog.form.OWNER_NAME = '';
        this.dialog.form.OWNER_PHONE = '';
        this.dialog.form.DAY_PHONE = '';
        this.dialog.form.NIGHT_PHONE = '';
        this.dialog.form.SHIFT_PHONE = '';
        this.table.selectItem = [];
      },
      handleExportClick() {
        const {phone, owner, vehicle, user} = this.query;
        this.$confirm('是否需要导出?', '提示', {
          confirmButtonText: '是',
          cancelButtonText: '否',
          cancelButtonClass: 'el-button--danger',
          closeOnClickModal: false,
          type: 'info',
          center: true
        }).then(() => {
          window.open(`${baseURL}letterManagement/findDriverInformationManagementExcel?phone=${phone}&owner=${owner}&vehicle=${vehicle}&user=${user}`);
        }).catch(() => {
        });
      },
      // 导入点击事件
      handleImportFileClick() {
        this.$refs.importFile.click()
      },
      // input 框 file change 事件
      handleImportFileChange(e) {
        console.info('2')
        console.info(e.target.files[0])
        const file = e.target.files[0]
        if (file) {
          const params = new FormData()
          params.append('file', file)
          axios.post('letterManagement/uploadDriverInformationManagement', params, { baseURL }).then(res => {
            if (res.data.msg === '导入失败') {
              this.$notify.error({
                title: '失败',
                message: `导入失败：导入成功${res.data.success.length}条，失败${res.data.error.length}条，重复${res.data.repeat.length}条`
              })
            } else if (res.data.msg === '导入成功') {
              this.$notify({
                title: '成功',
                message: `导入成功：导入成功${res.data.success.length}条，失败${res.data.error.length}条，重复${res.data.repeat.length}条`,
                type: 'success'
              })
            }else if (res.data.msg !== '') {
              this.$notify.error({
                title: '失败',
                message: `${res.data.msg}`
              })
            }else{
              this.$notify.error({
                title: '失败',
                message: `其他错误`
              })
            }
            this.$refs.importFile.value = ''
            this.findDriverInformationManagement()
          })
        }
      },
      // 模板下载
      handleTemplateFileClick() {
        window.open(`${baseURL}file/企业车辆驾驶员信息管理模板.xlsx`)
      }

    }
  }
</script>
