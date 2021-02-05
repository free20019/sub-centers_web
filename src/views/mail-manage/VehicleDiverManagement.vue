<!-- 爱心驾驶员信息管理-->
<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <t-query-panel :model="query" footer="300">
    <template v-slot:querybar>
      <el-form-item>
        <el-input v-model="query.driver_name" placeholder="姓名"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="query.phone" placeholder="联系方式" ></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="query.shift_address" placeholder="交班地址" ></el-input>
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
        <el-autocomplete
          v-model="query.unit_name"
          :prefix-icon="iconClassName('icon-car')"
          :fetch-suggestions="handleUnitQuerySearch"
          :trigger-on-focus="false"
          placeholder="分队名称"
        ></el-autocomplete>
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
      <el-table-column prop="DRIVER_NAME" label="姓名" width="100" align="center"></el-table-column>
      <el-table-column prop="COMMIT_PERSON" label="录入人员" width="180" align="center" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="SEX" label="性别" width="100" align="center"></el-table-column>
      <el-table-column prop="BIRTH_DATE" label="出生年月" width="120" align="center"></el-table-column>
      <el-table-column prop="POLITICAL_AFFILIATION" label="政治面貌" width="100" align="center"></el-table-column>
      <el-table-column prop="VEHICLE_NO" label="车号" width="120" align="center"></el-table-column>
      <el-table-column prop="COMPANY_NAME" label="所属公司" width="240" align="center" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="UNIT_NAME" label="分队名称" width="240" align="center" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="SHIFTS" label="班次" width="120" align="center"></el-table-column>
      <el-table-column prop="SHIFT_TIME" label="交班时间" width="120" align="center"></el-table-column>
      <el-table-column prop="SHIFT_ADDRESS" label="交班地点" width="180" align="center" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="PHONE" label="联系方式" width="180" align="center"></el-table-column>
      <el-table-column prop="FUEL_TYPE" label="燃料类型" width="120" align="center"></el-table-column>
      <el-table-column prop="QUALIFICATION_NUMBER" label="资格证号" width="180" align="center"></el-table-column>
      <el-table-column prop="ADDRESS" label="居住地址" width="180" align="center" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="REMARKS" label="备注" align="center" min-width="200" :resizable="false" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column :resizable="false" width="100" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button size="mini" icon="el-icon-edit" type="text" @click="handleTableEditClick(scope.row,)"></el-button>
          <el-button size="mini" icon="el-icon-delete" type="text" @click="handleTableDeleteClick(scope.row)"></el-button>
        </template>
      </el-table-column>
    </t-table-page>
    <el-dialog :title="dialog.title" :visible.sync="dialog.display" width="800px" @closed="handleDialogClosed">
      <el-form ref="form" :model="dialog.form" size="small" label-width="100px" label-position="right"  :inline="true">
        <el-form-item label="姓名">
          <el-input v-model="dialog.form.DRIVER_NAME"  placeholder="姓名" style="width: 220px;"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-select v-model="dialog.form.SEX" filterable :clearable="true" allow-create placeholder="性别" style="width: 220px;">
            <el-option
              v-for="item in select.SEXArray"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="出生年月">
          <el-date-picker v-model="dialog.form.BIRTH_DATE" type="date" placeholder="出生年月" style="width: 220px;"></el-date-picker>
        </el-form-item>
        <el-form-item label="政治面貌">
          <el-select v-model="dialog.form.POLITICAL_AFFILIATION" filterable :clearable="true" allow-create placeholder="政治面貌" style="width: 220px;">
            <el-option
              v-for="item in select.POLITICAL_AFFILIATIONArray"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="车号">
          <el-autocomplete class="inline-input" v-model="dialog.form.VEHICLE_NO" placeholder="车号"
                           :fetch-suggestions="handleVehicleQuerySearch" :trigger-on-focus="false" style="width: 220px;"  @input="handleFilterClick()"></el-autocomplete>
        </el-form-item>
        <el-form-item label="所属公司">
          <el-input v-model="dialog.form.COMPANY_NAME"  placeholder="所属公司" style="width: 220px;" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="分队名称">
          <el-input v-model="dialog.form.UNIT_NAME"  placeholder="分队名称" style="width: 220px;"></el-input>
        </el-form-item>
        <el-form-item label="班次">
          <el-select v-model="dialog.form.SHIFTS" filterable :clearable="true" allow-create  placeholder="班次" style="width: 220px;">
            <el-option
              v-for="item in select.SHIFTSArray"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="交班时间">
          <el-time-picker v-model="dialog.form.SHIFT_TIME" value-format="HH:mm" format="HH:mm"  placeholder="交班时间" style="width: 220px;"></el-time-picker>
        </el-form-item>
        <el-form-item label="交班地点">
          <el-input v-model="dialog.form.SHIFT_ADDRESS"  placeholder="交班地点" style="width: 220px;"></el-input>
        </el-form-item>
        <el-form-item label="联系方式">
          <el-input v-model="dialog.form.PHONE"  placeholder="联系方式" style="width: 220px;"></el-input>
        </el-form-item>
        <el-form-item label="燃料类型">
          <el-select v-model="dialog.form.FUEL_TYPE" filterable :clearable="true" allow-create placeholder="燃料类型" style="width: 220px;">
            <el-option
              v-for="item in select.FUEL_TYPEArray"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="资格证号">
          <el-input v-model="dialog.form.QUALIFICATION_NUMBER"  placeholder="资格证号" style="width: 220px;"></el-input>
        </el-form-item>
        <el-form-item label="居住地址">
          <el-input v-model="dialog.form.ADDRESS"  placeholder="居住地址" style="width: 220px;"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="dialog.form.REMARKS" type="textarea" rows="2"  placeholder="备注" style="width: 550px;"></el-input>
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
    name: 'VehicleDiverManagement',
    data() {
      return {
        query: {
          driver_name: '',
          phone: '',
          shift_address: '',
          vehicle: '',
          unit_name: '',
          user: '',
        },
        userList: [],
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
          all: [],
          vehicle: [],
          unit: [],
          SEXArray: [
            {key:'男',value:'男'},
            {key:'女',value:'女'},
          ],
          POLITICAL_AFFILIATIONArray: [
            {key:'党员',value:'党员'},
            {key:'群众',value:'群众'},
          ],
          SHIFTSArray: [
            {key:'白班',value:'白班'},
            {key:'夜班',value:'夜班'},
            {key:'统班',value:'统班'},
            {key:'替班',value:'替班'},
          ],
          FUEL_TYPEArray: [
            {key:'纯电动',value:'纯电动'},
            {key:'汽油车',value:'汽油车'},
            {key:'双燃料',value:'双燃料'},
          ],
        },
        dialog: {
          title: '',
          display: false,
          form: {
            DRIVER_NAME: '',
            SEX: '',
            BIRTH_DATE: '',
            POLITICAL_AFFILIATION: '',
            VEHICLE_NO: '',
            COMPANY_NAME: '',
            UNIT_NAME: '',
            SHIFTS: '',
            SHIFT_TIME: '',
            SHIFT_ADDRESS: '',
            PHONE: '',
            FUEL_TYPE: '',
            QUALIFICATION_NUMBER: '',
            ADDRESS: '',
            REMARKS: '',
          }
        }
      }
    },
    mounted() {
      this.getUser();
      if(this.userList.length===0){
        setTimeout(()=>{
          this.findVehicleDiverManagement();
        }, 1 * 1000)
      }
      this.getVehicle();
      this.getUnit();
    },
    methods: {
      iconClassName,
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
      handleVehicleQuerySearch(query, cb) {
        if (query.length < 3) return cb([])
        cb(_.filter(this.select.vehicle, item => item.value.indexOf(query) > -1))
      },
      handleUnitQuerySearch(query, cb) {
        cb(_.filter(this.select.unit, item => item.value.indexOf(query) > -1))
      },
      handleFilterClick(){
        const { VEHICLE_NO } = this.dialog.form
        let arr = _.filter(this.select.all, item => {
          return (
            item.VEHICLE_NO===VEHICLE_NO
          )
        })
        if(arr.length===1){
          this.dialog.form.COMPANY_NAME=arr[0].COMPANY_NAME
          this.dialog.form.UNIT_NAME=arr[0].UNIT_NAME
        }else {
          this.dialog.form.COMPANY_NAME=''
          this.dialog.form.UNIT_NAME=''
        }
      },
      getVehicle(){
        axios.get('common/vehicle', {
          baseURL,
          params: {
            type:1
          }
        }).then(res=> {
          this.select.all=res.data;
          this.select.vehicle = _.map(res.data, item => {
            return {
              value: item.VEHICLE_NO
            }
          });
        }).catch(function (error) {
          console.error(error);
        });
      },
      getUnit(){
        axios.get('common/unit', {
          baseURL,
          params: {
            type:1
          }
        }).then(res=> {
          this.select.unit = _.map(res.data, item => {
            return {
              value: item.UNIT_NAME
            }
          });
        }).catch(function (error) {
          console.error(error);
        });
      },
      findVehicleDiverManagement() {
        const {driver_name, phone, shift_address, vehicle, unit_name, user} = this.query;
        this.table.display = true;
        axios.get('letterManagement/findVehicleDiverManagement', {
          baseURL,
          params: {
            driver_name,
            phone,
            shift_address,
            vehicle,
            unit_name,
            user,
          }
        }).then(res=> {
          this.table.data = res.data||[];
          this.table.display = false;
        }).catch(function (error) {
          console.log(error);
        });
      },
      addVehicleDiverManagement(){
        const {DRIVER_NAME,SEX,BIRTH_DATE,POLITICAL_AFFILIATION,VEHICLE_NO,COMPANY_NAME,UNIT_NAME,SHIFTS,SHIFT_TIME,SHIFT_ADDRESS,PHONE,FUEL_TYPE,QUALIFICATION_NUMBER,ADDRESS,REMARKS} = this.dialog.form;
        let mobile =  /^(0|86|17951)?(13[0-9]|15[012356789]|17[01678]|18[0-9]|14[57])[0-9]{8}$/;
        let telephone= /^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/;
        if(DRIVER_NAME==='') return this.$message.error('请填写姓名！');
        if(SEX==='') return this.$message.error('请填写性别！');
        if(BIRTH_DATE==='') return this.$message.error('请填写出生年月！');
        if(POLITICAL_AFFILIATION==='') return this.$message.error('请填写政治面貌！');
        if(VEHICLE_NO==='') return this.$message.error('请填写车号！');
        if(SHIFTS==='') return this.$message.error('请填写班次！');
        if(SHIFT_TIME==='') return this.$message.error('请填写交班时间！');
        if(SHIFT_ADDRESS==='') return this.$message.error('请填写交班地点！');
        if(PHONE==='') return this.$message.error('请填写联系方式！');
        if(FUEL_TYPE==='') return this.$message.error('请填写燃料类型！');
        if(QUALIFICATION_NUMBER==='') return this.$message.error('请填写资格证号！');
        if(ADDRESS==='') return this.$message.error('请填写居住地址！');
        if(REMARKS==='') return this.$message.error('请填写备注！');

        if(COMPANY_NAME==='') return this.$message.error('请填写正确的车号！');
        if (!(mobile.test(PHONE)||telephone.test(PHONE)||PHONE==='')){
          this.$message.error('请填写正确的联系方式！');
          return false;
        }
        axios.get('letterManagement/addVehicleDiverManagement', {
          baseURL,
          params: {
            BIRTH_DATE: BIRTH_DATE && moment(BIRTH_DATE).format('YYYY-MM-DD'),
            DRIVER_NAME,SEX,POLITICAL_AFFILIATION,VEHICLE_NO,COMPANY_NAME,UNIT_NAME,SHIFTS,SHIFT_TIME,SHIFT_ADDRESS,PHONE,FUEL_TYPE,QUALIFICATION_NUMBER,ADDRESS,REMARKS
          }
        }).then(res => {
          if(res.data>0){
            this.$message({message: "操作成功!", type: 'success'});
            this.dialog.display = false;
            this.findVehicleDiverManagement();
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
      updateVehicleDiverManagement(){
        const {DRIVER_NAME,SEX,BIRTH_DATE,POLITICAL_AFFILIATION,VEHICLE_NO,COMPANY_NAME,UNIT_NAME,SHIFTS,SHIFT_TIME,SHIFT_ADDRESS,PHONE,FUEL_TYPE,QUALIFICATION_NUMBER,ADDRESS,REMARKS} = this.dialog.form;
        let mobile =  /^(0|86|17951)?(13[0-9]|15[012356789]|17[01678]|18[0-9]|14[57])[0-9]{8}$/;
        let telephone= /^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/;
        if(DRIVER_NAME==='') return this.$message.error('请填写姓名！');
        if(SEX==='') return this.$message.error('请填写性别！');
        if(BIRTH_DATE==='') return this.$message.error('请填写出生年月！');
        if(POLITICAL_AFFILIATION==='') return this.$message.error('请填写政治面貌！');
        if(VEHICLE_NO==='') return this.$message.error('请填写车号！');
        if(SHIFTS==='') return this.$message.error('请填写班次！');
        if(SHIFT_TIME==='') return this.$message.error('请填写交班时间！');
        if(SHIFT_ADDRESS==='') return this.$message.error('请填写交班地点！');
        if(PHONE==='') return this.$message.error('请填写联系方式！');
        if(FUEL_TYPE==='') return this.$message.error('请填写燃料类型！');
        if(QUALIFICATION_NUMBER==='') return this.$message.error('请填写资格证号！');
        if(ADDRESS==='') return this.$message.error('请填写居住地址！');
        if(REMARKS==='') return this.$message.error('请填写备注！');

        if(COMPANY_NAME==='') return this.$message.error('请填写正确的车号！');
        if (!(mobile.test(PHONE)||telephone.test(PHONE)||PHONE==='')){
          this.$message.error('请填写正确的联系方式！');
          return false;
        }
        axios.get('letterManagement/updateVehicleDiverManagement', {
          baseURL,
          params: {
            id: this.table.selectItem.ID,
            BIRTH_DATE: BIRTH_DATE && moment(BIRTH_DATE).format('YYYY-MM-DD'),
            DRIVER_NAME,SEX,POLITICAL_AFFILIATION,VEHICLE_NO,COMPANY_NAME,UNIT_NAME,SHIFTS,SHIFT_TIME,SHIFT_ADDRESS,PHONE,FUEL_TYPE,QUALIFICATION_NUMBER,ADDRESS,REMARKS
          }
        }).then(res => {
          if(res.data>0){
            this.$message({message: "操作成功!", type: 'success'});
            this.dialog.display = false;
            this.findVehicleDiverManagement();
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
        this.findVehicleDiverManagement();
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
        this.dialog.form.DRIVER_NAME = item.DRIVER_NAME;
        this.dialog.form.SEX = item.SEX;
        this.dialog.form.BIRTH_DATE = item.BIRTH_DATE;
        this.dialog.form.POLITICAL_AFFILIATION = item.POLITICAL_AFFILIATION;
        this.dialog.form.VEHICLE_NO = item.VEHICLE_NO;
        this.dialog.form.COMPANY_NAME = item.COMPANY_NAME;
        this.dialog.form.UNIT_NAME = item.UNIT_NAME;
        this.dialog.form.SHIFTS = item.SHIFTS;
        this.dialog.form.SHIFT_TIME = item.SHIFT_TIME;
        this.dialog.form.SHIFT_ADDRESS = item.SHIFT_ADDRESS;
        this.dialog.form.PHONE = item.PHONE;
        this.dialog.form.FUEL_TYPE = item.FUEL_TYPE;
        this.dialog.form.QUALIFICATION_NUMBER = item.QUALIFICATION_NUMBER;
        this.dialog.form.ADDRESS = item.ADDRESS;
        this.dialog.form.REMARKS = item.REMARKS;
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
          axios.get('letterManagement/deleteVehicleDiverManagement', {
            baseURL,
            params: {id:item.ID}
          }).then(res => {
            if(res.data>0){
              this.$message({message: "操作成功!", type: 'success'});
              this.findVehicleDiverManagement();
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
          this.updateVehicleDiverManagement();
        }else if(this.dialog.title === '添加'){
          this.addVehicleDiverManagement();
        }
      },
      handleDialogClosed() {
        this.dialog.title = '';
        this.dialog.form.DRIVER_NAME = '';
        this.dialog.form.SEX = '';
        this.dialog.form.BIRTH_DATE = '';
        this.dialog.form.POLITICAL_AFFILIATION = '';
        this.dialog.form.VEHICLE_NO = '';
        this.dialog.form.COMPANY_NAME = '';
        this.dialog.form.UNIT_NAME = '';
        this.dialog.form.SHIFTS = '';
        this.dialog.form.SHIFT_TIME = '';
        this.dialog.form.SHIFT_ADDRESS = '';
        this.dialog.form.PHONE = '';
        this.dialog.form.FUEL_TYPE = '';
        this.dialog.form.QUALIFICATION_NUMBER = '';
        this.dialog.form.ADDRESS = '';
        this.dialog.form.REMARKS = '';
        this.table.selectItem = [];
      },
      handleExportClick() {
        const {driver_name, phone, shift_address, vehicle, unit_name, user} = this.query;
        this.$confirm('是否需要导出?', '提示', {
          confirmButtonText: '是',
          cancelButtonText: '否',
          cancelButtonClass: 'el-button--danger',
          closeOnClickModal: false,
          type: 'info',
          center: true
        }).then(() => {
          window.open(`${baseURL}letterManagement/findVehicleDiverManagementExcel?driver_name=${driver_name}&phone=${phone}&shift_address=${shift_address}&unit_name=${unit_name}&vehicle=${vehicle}&user=${user}`);
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
          axios.post('letterManagement/uploadVehicleDiverManagement', params, { baseURL }).then(res => {
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
            this.findVehicleDiverManagement()
          })
        }
      },
      // 模板下载
      handleTemplateFileClick() {
        window.open(`${baseURL}file/爱心驾驶员信息管理模板.xlsx`)
      }
    }
  }
</script>

