<!-- 爱心业务用车记录-->
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
        <el-select v-model="query.type" placeholder="审核状态">
          <el-option v-for="item in approvalStatus" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input v-model="query.phone" placeholder="联系电话"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="query.address" placeholder="详细地址" ></el-input>
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
        <el-select v-model="query.user" placeholder="录入人员" clearable>
          <el-option v-for="item in userList" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleQueryClick" v-show="power.query">查询</el-button>
        <el-button type="primary" @click="handleExportClick" v-show="power.query">导出</el-button>
        <el-button type="primary" @click="handleTableAddClick" v-show="power.add">添加</el-button>
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
      <el-table-column prop="DB_TIME" label="生成时间" width="200" align="center"></el-table-column>
      <el-table-column prop="COMMIT_PERSON" label="录入人员" width="180" align="center" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="CUST_NAME" label="客户姓名" width="120" align="center"></el-table-column>
      <el-table-column prop="CUST_TEL" label="手机号码" width="120" align="center"></el-table-column>
      <el-table-column prop="JSYXM" label="驾驶员姓名" width="120" align="center"></el-table-column>
      <el-table-column prop="CF" label="车费金额" width="120" align="center"></el-table-column>
      <el-table-column prop="DDQY" label="调度区域" width="120" align="center"></el-table-column>
      <el-table-column prop="ADDRESS" label="详细地址" width="200" align="center" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="DEST_ADDRESS" label="目的地址" width="200" align="center" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="DISP_TIME" label="用车时间" width="200" align="center"></el-table-column>
      <el-table-column prop="VEHI_NO1" label="所派车辆" width="120" align="center"></el-table-column>
      <el-table-column prop="SJDH1" label="司机联系方式" width="120" align="center"></el-table-column>
      <el-table-column prop="SIM_NUM1" label="SIM卡" width="120" align="center"></el-table-column>
      <el-table-column prop="COMP_NAME1" label="所属公司" width="240" align="center" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="YCMS" label="用车模式" width="120" align="center"></el-table-column>
      <el-table-column prop="TSRQ" label="特殊人群" width="120" align="center"></el-table-column>
      <el-table-column prop="PTQK" label="陪同情况" width="120" align="center"></el-table-column>
      <el-table-column prop="YCXQ" label="用车需求" width="120" align="center"></el-table-column>
      <el-table-column prop="NOTE" label="附加信息" width="120" align="center" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="SZQY" label="所在区域" width="120" align="center"></el-table-column>
      <el-table-column prop="AUDIT_STATUS" label="审核状态" width="120" align="center"></el-table-column>
      <el-table-column prop="AUDIT_DATE" label="审核时间" width="200" align="center"></el-table-column>
      <el-table-column prop="AUDIT_REASON" label="审核原因" align="center"  min-width="200" :resizable="false" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column label="操作" :resizable="false" width="100"  align="center" fixed="right">
        <template slot-scope="scope">
          <el-button size="mini" icon="el-icon-edit" type="text" @click="handleTableEditClick(scope.row)" v-show="handleTableShowbutton(scope.row)"></el-button>
          <el-button size="mini" icon="el-icon-delete" type="text" @click="handleTableDeleteClick(scope.row)" v-show="power.delete"></el-button>
        </template>
      </el-table-column>
    </t-table-page>
    <el-dialog :title="dialog.title" :visible.sync="dialog.display" width="800px" @closed="handleDialogClosed">
      <el-form ref="form" :model="dialog.form" size="small" label-width="100px" label-position="right"  :inline="true">
        <el-form-item label="手机号码">
          <!--<el-input v-model="dialog.form.CUST_TEL"  placeholder="手机号码" style="width: 220px;"></el-input>-->
          <el-autocomplete v-model="dialog.form.CUST_TEL" :fetch-suggestions="handleSjhmQuerySearch" :trigger-on-focus="false"
           placeholder="手机号码" style="width: 220px;" @select="handleSjhmClick"></el-autocomplete>
        </el-form-item>
        <el-form-item label="乘客姓名">
          <el-input v-model="dialog.form.CUST_NAME"  placeholder="乘客姓名" style="width: 220px;"></el-input>
        </el-form-item>
        <el-form-item label="用车时间">
          <el-date-picker v-model="dialog.form.DISP_TIME" type="datetime" placeholder="用车时间" style="width: 220px;"></el-date-picker>
        </el-form-item>
        <el-form-item label="详细地址">
          <el-input v-model="dialog.form.ADDRESS"  placeholder="详细地址" style="width: 220px;"></el-input>
        </el-form-item>
        <el-form-item label="目的地址">
          <el-input v-model="dialog.form.DEST_ADDRESS"  placeholder="目的地址" style="width: 220px;"></el-input>
        </el-form-item>
        <el-form-item label="附加信息">
          <el-input v-model="dialog.form.NOTE"  placeholder="附加信息" style="width: 220px;"></el-input>
        </el-form-item>
        <el-form-item label="驾驶员姓名">
          <el-input v-model="dialog.form.JSYXM"  placeholder="驾驶员姓名" style="width: 220px;"></el-input>
        </el-form-item>
        <el-form-item label="车费">
          <el-input v-model="dialog.form.CF"  placeholder="车费" style="width: 220px;"></el-input>
        </el-form-item>
        <!--<el-form-item label="指派车辆">-->
          <!--<el-input v-model="dialog.form.VEHI_NO1"  placeholder="指派车辆" style="width: 220px;"></el-input>-->
        <!--</el-form-item>-->
        <el-form-item label="指派车辆">
          <el-autocomplete class="inline-input" v-model="dialog.form.VEHI_NO1" placeholder="指派车辆"
                           :fetch-suggestions="handleVehicleQuerySearch" :trigger-on-focus="false" style="width: 220px;"  @input="handleFilterClick()"></el-autocomplete>
        </el-form-item>
        <el-form-item label="联系方式">
          <el-input v-model="dialog.form.SJDH1"  placeholder="联系方式" style="width: 220px;"></el-input>
        </el-form-item>
        <el-form-item label="SIM卡">
          <el-input v-model="dialog.form.SIM_NUM1"  placeholder="SIM卡" style="width: 220px;" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="所属公司">
          <el-input v-model="dialog.form.COMP_NAME1"  placeholder="所属公司" style="width: 220px;" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="用车模式">
          <el-select v-model="dialog.form.YCMS" filterable :clearable="true" allow-create placeholder="用车模式" style="width: 220px;">
            <el-option
              v-for="item in select.vehicleYCMS"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="特殊人群">
          <el-select v-model="dialog.form.TSRQ" filterable :clearable="true" allow-create placeholder="特殊人群" style="width: 220px;">
            <el-option
              v-for="item in select.vehicleTSRQ"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="陪同情况">
          <el-select v-model="dialog.form.PTQK" filterable :clearable="true" allow-create placeholder="陪同情况" style="width: 220px;">
            <el-option
              v-for="item in select.vehiclePTQK"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用车需求">
          <el-select v-model="dialog.form.YCXQ" filterable :clearable="true" allow-create placeholder="用车需求" style="width: 220px;">
            <el-option
              v-for="item in select.vehicleYCXQ"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
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
    name: 'LoveBusinessVehicleUseRecord',
    data() {
      return {
        query: {
          startTime: '',
          endTime: '',
          type: '',
          phone: '',
          address: '',
          vehicle: '',
          user: ''
        },
        approvalStatus: [
          {value: '2', label: '未审核'},
          {value: '0', label: '审核通过'},
          {value: '1', label: '审核未通过'},
        ],
        userList: [],
        inputVehicle: {
          loading: false,
          option: []
        },
        power:{
          query: true,
          add: false,
          update: false,
          delete: false,
        },
        table: {
          display: false,
          selectItem: [],
          data: []
        },
        select:{
          sjhm: [],
          all: [],
          vehicle: [],
          vehicleYCMS: [
            {key:'结对用车',value:'结对用车'},
            {key:'即时用车',value:'即时用车'},
          ],
          vehicleTSRQ: [
            {key:'盲人',value:'盲人'},
            {key:'腿脚不便',value:'腿脚不便'},
            {key:'聋哑',value:'聋哑'},
            {key:'瘫痪',value:'瘫痪'},
          ],
          vehiclePTQK: [
            {key:'无陪同',value:'无陪同'},
            {key:'子女',value:'子女'},
            {key:'老伴',value:'老伴'},
            {key:'保姆',value:'保姆'},
            {key:'社区志愿者',value:'社区志愿者'},
          ],
          vehicleYCXQ: [
            {key:'血透',value:'血透'},
            {key:'复诊',value:'复诊'},
            {key:'看病',value:'看病'},
            {key:'做检查',value:'做检查'},
            {key:'配药',value:'配药'},
          ],
        },
        dialog: {
          title: '',
          display: false,
          form: {
            CUST_TEL: '',
            CUST_NAME: '',
            DISP_TIME: '',
            ADDRESS: '',
            DEST_ADDRESS: '',
            NOTE: '',
            VEHI_NO1: '',
            SJDH1: '',
            SIM_NUM1: '',
            COMP_NAME1: '',
            YCMS: '',
            TSRQ: '',
            PTQK: '',
            YCXQ: '',
            SZQY: '',
            JSYXM: '',
            CF: ''
          }
        }
      }
    },
    mounted() {
      this.query.startTime = new Date(moment().add('day', -1));
      this.query.endTime = new Date();
      this.getUser();
      if(this.userList.length===0){
        setTimeout(()=>{
          this.findLoveBusinessVehicleUseRecord();
        }, 1 * 1000)
      }

      this.getVehicle();
      this.getSjhm();
    },
    methods: {
      iconClassName,
      handleTableShowbutton(item){
        let isShow = false
        if(this.power.update){
          if(item.AUDIT_STATUS!=='审核通过'){
            if(item.AUDIT_STATUS==='审核不通过'){
              if(new moment(item.AUDIT_DATE).add('day', 15).format('YYYY-MM-DD') >= new moment().format('YYYY-MM-DD')){
                isShow = true
              }
            }else {
              isShow = true
            }
          }
        }
        return isShow
        // power.update&&(scope.row.AUDIT_STATUS!=='审核通过')&&!(new moment(scope.row.AUDIT_DATE).)
      },
      handleVehicleQuerySearch(query, cb) {
        if (query.length < 3) return cb([])
        cb(_.filter(this.select.vehicle, item => item.value.indexOf(query) > -1))
      },
      handleSjhmQuerySearch(query, cb) {
        if (query.length < 3) return cb([])
        cb(_.filter(this.select.sjhm, item => item.value.indexOf(query) > -1))
      },
      handleFilterClick(){
        const { VEHI_NO1 } = this.dialog.form
        let arr = _.filter(this.select.all, item => {
          return (
            item.VEHICLE_NO===VEHI_NO1
          )
        })
        if(arr.length===1){
          this.dialog.form.SIM_NUM1=arr[0].MDT_NO
          this.dialog.form.COMP_NAME1=arr[0].COMPANY_NAME
        }else {
          this.dialog.form.SIM_NUM1=''
          this.dialog.form.COMP_NAME1=''
        }
      },
      getUser(){
        axios.get('map/getUser', { baseURL }).then(res => {
          if (res.data.allow_operation_ids === 'null'||res.data.allow_operation_ids === '') {
            this.power.query=true
            this.power.add=false
            this.power.update=false
            this.power.delete=false
          } else {
            this.power.query=res.data.allow_operation_ids.indexOf('axywycjl_query')>-1
            this.power.add=res.data.allow_operation_ids.indexOf('axywycjl_add')>-1
            this.power.update=res.data.allow_operation_ids.indexOf('axywycjl_update')>-1
            this.power.delete=res.data.allow_operation_ids.indexOf('axywycjl_delete')>-1
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
        });
      },
      getSjhm() {
        axios.get('letterManagement/getSjhmSelect', {
          baseURL,
          params: {
            sjhm:''
          }
        }).then(res=> {
          // this.select.all=res.data;
          this.select.sjhm = _.map(res.data, item => {
            return {
              value: item.CUST_TEL
            }
          });
        }).catch(function (error) {
        });
      },
      handleSjhmClick(item) {
        axios.get('letterManagement/getSjhmInfo', {
          baseURL,
          params: {
            sjhm: item.value
          }
        }).then(res=> {
          if(res.data.length > 0) {
            const data = res.data[0];
            this.dialog.form.CUST_NAME = data.CUST_NAME
            this.dialog.form.ADDRESS = data.ADDRESS
            this.dialog.form.DEST_ADDRESS = data.DEST_ADDRESS
            this.dialog.form.NOTE = data.NOTE
            this.dialog.form.JSYXM = data.JSYXM
            this.dialog.form.CF = data.CF
            this.dialog.form.VEHI_NO1 = data.VEHI_NO1
            this.dialog.form.SJDH1 = data.SJDH1
            this.dialog.form.SIM_NUM1 = data.SIM_NUM1
            this.dialog.form.COMP_NAME1 = data.COMP_NAME1
            this.dialog.form.YCMS = data.YCMS
            this.dialog.form.TSRQ = data.TSRQ
            this.dialog.form.PTQK = data.PTQK
            this.dialog.form.YCXQ = data.YCXQ
            this.handleFilterClick()
          }
        }).catch(function (error) {
        });
      },
      findLoveBusinessVehicleUseRecord() {
        const {startTime, endTime,  type, phone, address, vehicle, user} = this.query;
        this.table.display = true;
        axios.get('letterManagement/findLoveBusinessVehicleUseRecord', {
          baseURL,
          params: {
            startTime: startTime && moment(startTime).format('YYYY-MM-DD'),
            endTime: endTime && moment(endTime).format('YYYY-MM-DD'),
            type,
            phone,
            address,
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
      addLoveBusinessVehicleUseRecord(){
        const {CUST_TEL,CUST_NAME,DISP_TIME,ADDRESS,DEST_ADDRESS,NOTE,VEHI_NO1,SJDH1,SIM_NUM1,COMP_NAME1,YCMS,TSRQ,PTQK,YCXQ,SZQY,JSYXM,CF} = this.dialog.form;
        let mobile =  /^(0|86|17951)?(13[0-9]|15[012356789]|17[01678]|18[0-9]|14[57])[0-9]{8}$/;
        let telephone= /^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/;

        if(DISP_TIME==='') return this.$message.error('请填写用车时间！');
        let compareTime = new moment(DISP_TIME).add('month', 1).format('YYYY-MM')+'-10'
        if(compareTime < new moment().format('YYYY-MM-DD')) return this.$message.error('最晚录入时间截止到'+new moment().format('YYYY年')+new moment(compareTime).format('M月DD日')+'，超过时间就无法录入，如需录入企业联系中心补录！');

        if(CUST_TEL==='') return this.$message.error('请填写手机号码！');
        if(CUST_NAME==='') return this.$message.error('请填写客户姓名！');
        if(ADDRESS==='') return this.$message.error('请填写详细地址！');
        if(DEST_ADDRESS==='') return this.$message.error('请填写目的地址！');
        if(JSYXM==='') return this.$message.error('请填写驾驶员姓名！');
        if(CF==='') return this.$message.error('请填写车费金额！');
        // if(NOTE==='') return this.$message.error('请填写附加信息！');
        if(VEHI_NO1==='') return this.$message.error('请填写所派车辆！');
        if(SJDH1==='') return this.$message.error('请填写联系方式！');
        if(YCMS==='') return this.$message.error('请填写用车模式！');
        if(PTQK==='') return this.$message.error('请填写陪同情况！');

        if(COMP_NAME1==='') return this.$message.error('请填写正确的车号！');
        if (!(mobile.test(CUST_TEL)||telephone.test(CUST_TEL)||CUST_TEL==='')){
          this.$message.error('请填写正确手机号码！');
          return false;
        }
        if (!(mobile.test(SJDH1)||telephone.test(SJDH1)||SJDH1==='')){
          this.$message.error('请填写正确联系方式！');
          return false;
        }
        axios.get('letterManagement/addLoveBusinessVehicleUseRecord', {
          baseURL,
          params: {
            DISP_TIME: DISP_TIME && moment(DISP_TIME).format('YYYY-MM-DD HH:mm:ss'),
            CUST_TEL,CUST_NAME,ADDRESS,DEST_ADDRESS,NOTE,VEHI_NO1,SJDH1,SIM_NUM1,COMP_NAME1,YCMS,TSRQ,PTQK,YCXQ,SZQY,JSYXM,CF
          }
        }).then(res => {
          if(res.data>0){
            this.$message({message: "操作成功!", type: 'success'});
            this.dialog.display = false;
            this.findLoveBusinessVehicleUseRecord();
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
      updateLoveBusinessVehicleUseRecord(){
        const {CUST_TEL,CUST_NAME,DISP_TIME,ADDRESS,DEST_ADDRESS,NOTE,VEHI_NO1,SJDH1,SIM_NUM1,COMP_NAME1,YCMS,TSRQ,PTQK,YCXQ,SZQY,JSYXM,CF} = this.dialog.form;
        let mobile =  /^(0|86|17951)?(13[0-9]|15[012356789]|17[01678]|18[0-9]|14[57])[0-9]{8}$/;
        let telephone= /^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/;
        if(CUST_TEL==='') return this.$message.error('请填写手机号码！');
        if(CUST_NAME==='') return this.$message.error('请填写客户姓名！');
        if(DISP_TIME==='') return this.$message.error('请填写用车时间！');
        if(ADDRESS==='') return this.$message.error('请填写详细地址！');
        if(DEST_ADDRESS==='') return this.$message.error('请填写目的地址！');
        if(JSYXM==='') return this.$message.error('请填写驾驶员姓名！');
        if(CF==='') return this.$message.error('请填写车费金额！');
        // if(NOTE==='') return this.$message.error('请填写附加信息！');
        if(VEHI_NO1==='') return this.$message.error('请填写所派车辆！');
        if(SJDH1==='') return this.$message.error('请填写联系方式！');
        if(YCMS==='') return this.$message.error('请填写用车模式！');
        if(PTQK==='') return this.$message.error('请填写陪同情况！');

        if(COMP_NAME1==='') return this.$message.error('请填写正确的车号！');
        if (!(mobile.test(CUST_TEL)||telephone.test(CUST_TEL)||CUST_TEL==='')){
          this.$message.error('请填写正确手机号码！');
          return false;
        }
        if (!(mobile.test(SJDH1)||telephone.test(SJDH1)||SJDH1==='')){
          this.$message.error('请填写正确联系方式！');
          return false;
        }
        axios.get('letterManagement/updateLoveBusinessVehicleUseRecord', {
          baseURL,
          params: {
            id: this.table.selectItem.DISP_ID,
            DISP_TIME: DISP_TIME && moment(DISP_TIME).format('YYYY-MM-DD HH:mm:ss'),
            CUST_TEL,CUST_NAME,ADDRESS,DEST_ADDRESS,NOTE,VEHI_NO1,SJDH1,SIM_NUM1,COMP_NAME1,YCMS,TSRQ,PTQK,YCXQ,SZQY,JSYXM,CF
          }
        }).then(res => {
          if(res.data>0){
            this.$message({message: "操作成功!", type: 'success'});
            this.dialog.display = false;
            this.findLoveBusinessVehicleUseRecord();
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
        this.findLoveBusinessVehicleUseRecord();
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
        this.dialog.form.CUST_TEL = item.CUST_TEL;
        this.dialog.form.CUST_NAME = item.CUST_NAME;
        this.dialog.form.DISP_TIME = item.DISP_TIME;
        this.dialog.form.ADDRESS = item.ADDRESS;
        this.dialog.form.DEST_ADDRESS = item.DEST_ADDRESS;
        this.dialog.form.NOTE = item.NOTE;
        this.dialog.form.VEHI_NO1 = item.VEHI_NO1;
        this.dialog.form.SJDH1 = item.SJDH1;
        this.dialog.form.SIM_NUM1 = item.SIM_NUM1;
        this.dialog.form.COMP_NAME1 = item.COMP_NAME1;
        this.dialog.form.YCMS = item.YCMS;
        this.dialog.form.TSRQ = item.TSRQ;
        this.dialog.form.PTQK = item.PTQK;
        this.dialog.form.YCXQ = item.YCXQ;
        this.dialog.form.SZQY = item.SZQY;
        this.dialog.form.JSYXM = item.JSYXM;
        this.dialog.form.CF = item.CF;
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
          axios.get('letterManagement/deleteLoveBusinessVehicleUseRecord', {
            baseURL,
            params: {id:item.DISP_ID}
          }).then(res => {
            if(res.data>0){
              this.$message({message: "操作成功!", type: 'success'});
              this.findLoveBusinessVehicleUseRecord();
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
          this.updateLoveBusinessVehicleUseRecord();
        }else if(this.dialog.title === '添加'){
          this.addLoveBusinessVehicleUseRecord();
        }
      },
      handleDialogClosed() {
        this.dialog.title = '';
        this.dialog.form.CUST_TEL = '';
        this.dialog.form.CUST_NAME = '';
        this.dialog.form.DISP_TIME = '';
        this.dialog.form.ADDRESS = '';
        this.dialog.form.DEST_ADDRESS = '';
        this.dialog.form.NOTE = '';
        this.dialog.form.VEHI_NO1 = '';
        this.dialog.form.SJDH1 = '';
        this.dialog.form.SIM_NUM1 = '';
        this.dialog.form.COMP_NAME1 = '';
        this.dialog.form.YCMS = '';
        this.dialog.form.TSRQ = '';
        this.dialog.form.PTQK = '';
        this.dialog.form.YCXQ = '';
        this.dialog.form.SZQY = '';
        this.dialog.form.JSYXM = '';
        this.dialog.form.CF = '';
        this.table.selectItem = [];
      },
      handleExportClick() {
        const {startTime, endTime, type, phone, address, vehicle, user} = this.query;
        this.$confirm('是否需要导出?', '提示', {
          confirmButtonText: '是',
          cancelButtonText: '否',
          cancelButtonClass: 'el-button--danger',
          closeOnClickModal: false,
          type: 'info',
          center: true
        }).then(() => {
          window.open(`${baseURL}letterManagement/findLoveBusinessVehicleUseRecordExcel?startTime=${startTime && moment(startTime).format('YYYY-MM-DD')}&endTime=${endTime && moment(endTime).format('YYYY-MM-DD')}&type=${type}&phone=${phone}&address=${address}&vehicle=${vehicle}&user=${user}`);
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
          axios.post('letterManagement/uploadLoveBusinessVehicleUseRecord', params, { baseURL }).then(res => {
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
            this.findLoveBusinessVehicleUseRecord()
          })
        }
      },
      // 模板下载
      handleTemplateFileClick() {
        window.open(`${baseURL}file/爱心订单.xlsx`)
      }
      
    }
  }
</script>

