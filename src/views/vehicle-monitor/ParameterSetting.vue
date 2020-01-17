<template>
  <div class="tw-setting-template">
    <div class="tw-setting" ref="setting">
      <div class="el-divider__text is-left">终端选择设置</div>
      <div class="tw-setting-form">
        <el-form :inline="true" label-width="80px">
          <el-form-item label="终端选择">
            <el-autocomplete
              :fetch-suggestions="querySearchAsync"
              :placeholder="queryPlaceholder"
              v-model="vehicle"
              style="width: 280px"
              popper-class="vehicleWidth"
              @select="handleSelect"
            ></el-autocomplete>
          </el-form-item>
          <el-form-item>
            <el-button size="mini" type="primary" @click="getTerminal">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button size="mini" type="primary" @click="getSetupState">终端设置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="tw-tab-content" ref="tabContent" v-loading="loading">
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane label="基本信息" name="first">
          <basic-info :setting="data" @test="getEditInfo"></basic-info>
        </el-tab-pane>
        <el-tab-pane label="连接参数" name="second">
          <connection-parameter :setting="data" @test="getEditInfo"></connection-parameter>
        </el-tab-pane>
        <el-tab-pane label="汇报参数" name="third">
          <reporting-parameters :setting="data" @test="getEditInfo"></reporting-parameters>
        </el-tab-pane>
        <el-tab-pane label="通话参数" name="fourth">
          <call-parameter :setting="data" @test="getEditInfo"></call-parameter>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import ReportingParameters from '../../components/parameter-setting/ReportingParameters'
import BasicInfo from '../../components/parameter-setting/BasicInfo'
import ConnectionParameter from '../../components/parameter-setting/ConnectionParameter'
import CallParameters from '../../components/parameter-setting/CallParameters'
import { baseURL } from 'util'
import axios from 'axios'
import _ from 'underscore'
export default {
  name: 'ParameterSetting',
  data() {
    return {
      activeName: 'first',
      queryPlaceholder: '请输入车牌号码、终端编号、SIM卡号',
      placeholderIndex: 0,
      vehicle: '',
      checkCode: 0,
      goon:0,
      isgoon:0,
      time:0,
      istime:0,
      data:[],
      datas: [],
      loading: false,
      params:{},
      sendCheckCode: 0
    }
  },
  mounted() {
    this.$nextTick(() => {
      console.log(this.$refs.setting)
      let height = parseInt(this.$refs.setting.offsetHeight)
      this.$refs.tabContent.style.height = `calc(100% - ${height}px - 20px)`
      console.info(this.$refs.tabContent.style.height)
    })
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event)
    },
    /**车辆查找输入框中输入3位以上显示内容**/
    querySearchAsync(query, cb) {
      if(query.length<3)return cb([])
      this.getVehiList(query).then(res=>{
        console.log(res.data)
        cb(res.data&&_.map(res.data,item=>{
          return {value:item.INFO,label:item.VEHI_NO}
        })||[])
      })
    },
    /**车辆查找输入框中输入3位以上显示内容后选中一条后执行**/
    handleSelect(item) {
      let params = new URLSearchParams();
      params.append('type', '1');
      params.append('vhic', item.label);
      axios.post('map/getOneVhic', params ,{baseURL}).then(res=>{
        this.vehicleList = res.data
      })
    },
    /**查询车辆**/
    getVehiList(val){
      let params = new URLSearchParams();
      params.append('vhic', val);
      return axios.post('map/getVhic', params ,{baseURL})
    },
    getTerminalInfo() {
      console.log(2)
      this.goon = 1
      this.checkCode = new Date().getTime();
      let params = new URLSearchParams();
      params.append('type', this.checkCode);
      params.append('isu', this.vehicle.split('(')[1].split(',')[0]);
      axios.post('map/SendMessageMQ', params ,{baseURL}).then(res=>{
        console.log(res.data)
      })
    },
    getTerminal() {
      if(this.vehicle.length < 10){
        this.$message('终端选择错误！')
        return
      }
      this.loading = true
      console.log(1)
      if(this.goon !=1) setTimeout(this.getTerminalInfo, 1000)
      axios.get('map/ReceiveMessageMQ' ,{baseURL}).then(res =>{
        console.log(res.data.serialNumber)
        this.loading = false
        console.log(res.data.serialNumber,this.checkCode)
        if(res.data.serialNumber == this.checkCode){
          this.goon = 0
          if(res.data.error3 == '设备不在线！！！'){
            this.$message('该设备不在线！')
            return
          }else{
            let terminal = res.data.paramBody
            this.data = this.datas = terminal
            console.log(terminal)
          }
        }else{
          if(this.goon !=1){
            this.time = new Date().getTime()
          }
          let t = new Date().getTime()
          console.log(t , this.time)
          console.log(1,(t - this.time)/1000)
          if(t - this.time >=1000*15){
            this.goon = 0
            this.$message('查询失败，请重试！')
            return
          }
          this.goon = 1
          this.getTerminal()
        }
      }).catch(function (error) {
        this.goon ==1
        console.log(error);
        this.loading = false
        this.$message('查询失败，请重试！')
      })
    },
    getEditInfo(info) {
      this.params[info] = this.data[info]
      let param = JSON.stringify(this.params)
      console.log(param)
    },
    setTerminal() {
      this.sendCheckCode = new Date().getTime();
      let params = new URLSearchParams();
      params.append('type', this.sendCheckCode);
      params.append('isu', this.vehicle.split('(')[1].split(',')[0]);
      params.append('param', JSON.stringify(this.params));
      axios.post('map/setTerminal', params ,{baseURL}).then(res=>{
      })
    },
    getSetupState() {
      if(JSON.stringify(this.params).length<5){
        this.$message('请修改需要设置的参数后，再进行重点设置！')
        return
      }
      this.loading = true
      if(this.isgoon !=1) setTimeout(this.setTerminal, 1000)
      axios.get('map/ReceiveMessageMQ' ,{baseURL}).then(res =>{
        this.loading = false
        console.log(res.data.serialNumber,this.sendCheckCode,res.data)
        if(res.data.serialNumber == this.sendCheckCode){
          this.isgoon = 0
          if(res.data.Result == '0'){
            this.$message('设置成功！')
            return
          }else if(res.data.Result == '2'){
            this.$message('参数不正确！')
            return
          }else{
            this.$message('设置失败，请重新进行终端设置！')
            return
          }
        }else{
          if(this.isgoon !=1){
            this.istime = new Date().getTime()
          }
          let t = new Date().getTime()
          console.log(t , this.istime)
          console.log(1,(t - this.istime)/1000)
          if(t - this.istime >=1000*15){
            this.isgoon = 0
            this.$message('设置超时，请重新进行终端设置！！')
            return
          }
          this.isgoon = 1
          this.getSetupState()
        }
      })
    }
  },
  components: {
    'reporting-parameters': ReportingParameters,
    'basic-info': BasicInfo,
    'connection-parameter': ConnectionParameter,
    'call-parameter': CallParameters
  }
}
</script>

<style lang="scss" scoped>
.tw-setting-template {
  padding: 15px;
  height: 100%;
}
.tw-setting {
  border: 1px solid #dcdfe6;
  border-radius: 5px;
  width: 540px;
  box-sizing: border-box;
  margin-bottom: 20px;
}
.tw-setting-form {
  padding: 5px;
}
.tw-tab-content {
  box-sizing: border-box;
}
</style>
