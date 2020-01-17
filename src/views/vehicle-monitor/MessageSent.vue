<template>
  <t-layout border right="500">
    <el-form class="tw-form" :model="form" label-width="80px">
      <el-form-item label="公司" v-show="loginType.compDisplay">
        <el-select v-model="form.company" filterable clearable  placeholder="请选择公司" @change="checkComp">
          <el-option
            v-for="item in companyOptions"
            :key="item.BA_ID"
            :label="item.BA_NAME"
            :value="item.BA_ID"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="分公司" v-show="loginType.compDisplay">
        <el-select v-model="form.branchOffice" clearable  placeholder="请选择分公司" @change="checkVhic">
          <el-option
            v-for="item in branchOfficeOptions"
            :key="item.COMP_ID"
            :label="item.COMP_NAME"
            :value="item.COMP_ID"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="车辆组" v-show="loginType.groupDisplay">
        <el-select v-model="form.clz" filterable clearable  placeholder="请选择车辆组" @change="checkVhic">
          <el-option
            v-for="item in clzOptions"
            :key="item.ID"
            :label="item.CLZ_NAME"
            :value="item.ID"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="车牌号码">
        <el-select v-model="form.vehicle" filterable clearable multiple placeholder="请输入车牌号码" class="tw-select">
          <el-option
            v-for="item in vehicleoptions"
            :key="item.VEHI_ID"
            :label="item.VEHI_NO"
            :value="item.VEHI_NO"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="消息内容">
        <el-input type="textarea" :rows="8" placeholder="请输入消息内容" v-model="form.center"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="sendOut">发送</el-button>
      </el-form-item>
    </el-form>
    <template v-slot:right>
      <div class="tw-template-wrapper">
        <div class="tw-list">
          <div class="tw-list-item" :class="{active: fastTextIndex === index}" v-for="(item,index) in fastTextList" :key="index" @click="checkInfo(index)" @dblclick="infoTowbk(item.INFO)">
            <t-icon class="tw-icon" name="icon-arrowTria"></t-icon>
            <span>{{item.INFO}}</span>
          </div>
        </div>
        <div style="text-align: center;">
          <el-button type="primary" size="small" @click="addInfo">添加</el-button>
          <el-button type="primary" size="small" @click="editInfo">修改</el-button>
          <el-button type="primary" size="small" @click="delInfo">删除</el-button>
        </div>
      </div>
    </template>
    <el-dialog
      :title="dialog.title"
      :visible.sync="dialog.display"
      :close-on-click-modal="false"
      width="500px"
      @closed="handleDialogClosed"
    >
      <el-form class="tw-form" :model="dialog.form" label-width="80px">
        <el-form-item label="消息内容">
          <el-input v-model="dialog.form.name" type="textarea" rows="4"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="handleDialogCancel">取 消</el-button>
        <el-button type="primary" @click="handleDialogSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </t-layout>
</template>

<script>
  import axios from 'axios'
  import { baseURL } from 'util'
  import _ from 'underscore'
export default {
  name: 'MessageSent',
  data() {
    return {
      form: {
        company: '',
        branchOffice: '',
        vehicle: [],
        center: '',
        clz: ''
      },
      companyOptions: [],
      branchOfficeOptions: [],
      clzOptions: [],
      fastTextIndex: null,
      fastTextList: [],
      vehicleoptions: [],
      dialog: {
        display: false,
        title: '',
        form: {
          name: '',
          id: ''
        }
      },
      loginType: {
        loginType: '',
        compDisplay: false,
        groupDisplay: false
      }
    }
  },
  mounted() {
    this.getLoginType()
    this.getInfo()
  },
  methods: {
    checkInfo(index) {
      this.fastTextIndex = index
    },
    infoTowbk(item) {
      this.fastTextIndex = null
      this.form.center = item
    },
    handleDialogCancel() {
      this.dialog.display = false
    },
    handleDialogClosed() {
      this.dialog.title = ''
      this.dialog.form.name = ''
      this.dialog.form.id = ''
    },
    getLoginType() {
      let loginType = this.$cookies.get('loginType')
      this.loginType.loginType = loginType
      if(loginType == '0'){
        this.loginType.compDisplay = true
        this.getBa_select()
      }else if(loginType == '1'){
        this.loginType.groupDisplay = true
        this.getClz()
      }
    },
    getInfo() {
      axios.get('map/getInfo' ,{baseURL}).then(res =>{
        this.fastTextList = res.data
      })
    },
    addInfo() {
      this.dialog.display = true
      this.dialog.title = '添加'
    },
    editInfo() {
      if(this.fastTextIndex != null){
        this.dialog.display = true
        this.dialog.title = '修改'
        this.dialog.form.id = this.fastTextList[this.fastTextIndex].ID
        this.dialog.form.name = this.fastTextList[this.fastTextIndex].INFO
      }else{
        this.$message({
          message: '请选择一条消息后修改！',
          type: 'warning'
        });
      }
    },
    handleDialogSubmit() {
      if(this.dialog.form.name == ''){
        this.$message({
          message: '消息内容必能为空！',
          type: 'warning'
        });
        return;
      }
      let params = new URLSearchParams()
      params.append('info', this.dialog.form.name)
      if(this.dialog.title == '添加') {
        axios.post('map/addInfo', params, { baseURL }).then(res => {
          this.$message(res.data.info);
          this.dialog.display = false
          this.getInfo()
        })
      }else{
        params.append('id', this.dialog.form.id)
        axios.post('map/editInfo', params, { baseURL }).then(res => {
          this.$message(res.data.info);
          this.dialog.display = false
          this.getInfo()
        })
      }
    },
    delInfo() {
      if(this.fastTextIndex != null){
        this.$confirm('此操作将永久删除该消息内容, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let params = new URLSearchParams()
          params.append('id', this.fastTextList[this.fastTextIndex].ID)
          axios.post('map/delInfo', params, { baseURL }).then(res => {
            this.$message(res.data.info);
            this.getInfo()
          })
        }).catch(() => {
        });
      }else{
        this.$message({
          message: '请选择一条消息后删除！',
          type: 'warning'
        });
      }
    },
    getBa_select() {
      axios.get('map/getBa_select' ,{baseURL}).then(res =>{
        this.companyOptions = res.data
      })
    },
    checkComp() {
      this.form.branchOffice = ''
      this.form.vehicle = ''
      let params = new URLSearchParams()
      params.append('id', this.form.company)
      axios.post('map/getComp_select', params, { baseURL }).then(res => {
        this.branchOfficeOptions = res.data
      })
      this.checkVhic()
    },
    checkVhic() {
      this.form.vehicle = ''
      let params1 = new URLSearchParams()
      if(this.loginType.loginType == '0'){
        params1.append('ba_id', this.form.company)
        params1.append('comp_id', this.form.branchOffice)
      }else if(this.loginType.loginType == '1'){
        params1.append('id', this.form.clz)
      }
      axios.post('map/getVhic_select', params1, { baseURL }).then(res => {
        this.vehicleoptions = res.data
      })
    },
    getClz() {
      axios.get('map/getClz' ,{baseURL}).then(res =>{
        console.log(res.data)
        this.clzOptions = res.data
      })
    },
    sendOut() {
      console.log(this.form)
      if(this.loginType.loginType == '0'){
        if(this.form.company == ''){
          this.$message({
            message: '公司不能为空！',
            type: 'warning'
          });
          return
        }
      }else if(this.loginType.loginType == '1'){
        if(this.form.clz == ''){
          this.$message({
            message: '车辆组不能为空！',
            type: 'warning'
          });
          return
        }
      }
      if(this.form.center == ''){
        this.$message({
          message: '消息内容不能为空！',
          type: 'warning'
        });
        return
      }
      let vehi_no = '';
      if(this.form.vehicle.length>0){
        _.map(this.form.vehicle, item=>{
          vehi_no += '\''+ item + '\','
        })
        vehi_no = vehi_no.substring(0,vehi_no.length-1)
      }
      let params1 = new URLSearchParams()
      if(this.loginType.loginType == '0'){
        params1.append('ba_id', this.form.company)
        params1.append('comp_id', this.form.branchOffice)
      }else if(this.loginType.loginType == '1'){
        params1.append('clz', this.form.clz)
      }
      params1.append('vehi_no', vehi_no)
      params1.append('nr', this.form.center)
      axios.post('map/sendMessage', params1, { baseURL }).then(res => {
        this.$message('下发成功');
        // console.log(11,res.data)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.tw-template-wrapper {
  padding: 10px;
  box-sizing: border-box;
}
.tw-list {
  max-height: calc(100% - 50px);
  margin-bottom: 10px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  cursor: pointer;
  &-item {
    display: flex;
    min-height: 30px;
    line-height: 30px;
    border-bottom: 1px solid #dcdfe6;
    &:last-child {
      border-bottom: none;
    }
    &:hover, &.active {
      background-color: #409eff;
      &:first-child {
        border-top-left-radius: inherit;
        border-top-right-radius: inherit;
      }
      &:last-child {
        border-bottom-left-radius: inherit;
        border-bottom-right-radius: inherit;
      }
      .tw-icon {
        text-shadow: 1px 1px 3px #555555;
        color: #ffffff;
      }
      span {
        text-shadow: 2px 2px 2px #555555;
        color: #ffffff;
      }
    }
    .tw-icon {
      display: inline-block;
      width: 30px;
      height: 30px;
      text-align: center;
      color: #eeeeee;
    }
    span {
      display: inline-block;
      width: calc(100% - 30px);
      padding: 6px 0px;
      line-height: 1.5;
    }
  }
}
</style>
