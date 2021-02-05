<!-- - -->
<template>
  <t-layout footer="300" :footerStrip="true">
    <div class="map-btn">
      <i class="el-icon-s-opportunity"></i>
    </div>
    <div class="map-tool-dialog" v-if="dialog.toolDisplay">
      <div class="dialog-head">车辆报警<i class="el-icon-close"></i></div>
      <div class="dialog-content">
        <div class="list-content first">
          <div class="list">
            <div class="tw-title">
              车牌号码
            </div>
            <div class="for" v-scrollbar>
              <div
                class="tw-item"
                v-for="(item, index) in dialog.toolData"
                :key="'toodialog_' + index"
                @click="chooseDialogVehicle(item.title)"
                :class="{ active: item.title === dialog.toolActive }"
              >
                {{ item.title }}
              </div>
            </div>
          </div>
        </div>
        <div class="list-content sec">
          <div>
            <el-button type="warning" size="small" @click="handleAlarmCancel"
              >取消报警</el-button
            >
          </div>
          <div>
            <el-button
              type="warning"
              size="small"
              @click="handleAlarmProcessing"
              >报警处理</el-button
            >
          </div>
        </div>
      </div>
    </div>
    <div id="baidu-map" class="tw-map-panel"></div>
    <template v-slot:footer>
      <div class="tw-border__body tw-foot-content">
        <div class="tw-item">
          <el-tabs v-model="tabs.left" @tab-click="handleTabsLeftClick">
            <el-tab-pane label="重要信息" name="first"></el-tab-pane>
          </el-tabs>
          <div class="tw-tabs-content">
            <div class="tw-title">重要信息</div>
            <div class="tw-for">
              <div
                class="tw-item"
                v-for="(item, index) in foot.leftData"
                :key="'left_' + index"
                @click="handleImportantInfoClick(item.vehi_no)"
              >
                <span>{{ item.vehi_no }}</span>
                <span>{{ item.type }}</span>
                <span>{{ formatterMqTime(item.stime) }}</span>
                <span>{{ item.longti }}</span>
                <span>{{ item.lati }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="tw-item">
          <el-tabs v-model="tabs.right">
            <el-tab-pane label="报警查询" name="bjcx"></el-tab-pane>
          </el-tabs>
          <div class="tw-tabs-content">
            <t-query-panel size="mini" :model="query" footer="300">
              <template v-slot:querybar>
                <el-form-item size="mini" label="车牌号码">
                  <el-input
                    v-model="query.cphm"
                    placeholder="车牌号码"
                  ></el-input>
                </el-form-item>
                <el-form-item size="mini" label="天数">
                  <el-input v-model="query.days" placeholder="天数"></el-input>
                </el-form-item>
                <el-form-item size="mini">
                  <el-button type="primary" @click="handleQueryClick"
                    >查询</el-button
                  >
                  <el-button
                    type="primary"
                    @click="handleEditClick"
                    :disabled="table.selectRows.length !== 1"
                    >处理</el-button
                  >
                </el-form-item>
              </template>
              <el-table
                size="mini"
                @selection-change="handleSelectionChange"
                :data="table.data"
                v-loading="table.loading"
                height="100%"
                border
              >
                <el-table-column align="center" type="selection" width="55">
                </el-table-column>
                <el-table-column
                  align="center"
                  prop="AD_ID"
                  label="处理编号"
                  width="110"
                >
                </el-table-column>
                <el-table-column
                  align="center"
                  prop="AD_CAR_NO"
                  label="车牌号码"
                  width="110"
                >
                </el-table-column>
                <el-table-column
                  align="center"
                  prop="AD_ALERTTYPE"
                  label="报警类型"
                  width="110"
                >
                </el-table-column>
                <el-table-column
                  align="center"
                  prop="AD_RESULT"
                  label="处警结果"
                  width="110"
                >
                </el-table-column>
                <el-table-column
                  align="center"
                  prop="AD_DEALTIME"
                  label="报警时间"
                  :formatter="formatterTableTime"
                  min-width="140"
                  :resizable="false"
                >
                </el-table-column>
              </el-table>
            </t-query-panel>
          </div>
        </div>
      </div>
    </template>
    <el-dialog
      :title="dialog.title"
      :visible.sync="dialog.display"
      width="700px"
      @closed="handleDialogClosed"
      :close-on-click-modal="false"
      custom-class="dialog_inline_form"
    >
      <el-form :inline="true" label-width="120px">
        <el-form-item label="处警时间：">
          <el-date-picker
            v-model="dialog.form.cjTime"
            type="datetime"
            placeholder="处警时间"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="处警工号：">
          <el-input v-model="dialog.form.cjgh"></el-input>
        </el-form-item>
        <el-form-item label="车牌号码：">
          <el-input v-model="dialog.form.cphm"></el-input>
        </el-form-item>
        <el-form-item label="司机电话：">
          <el-input v-model="dialog.form.driverPhone"></el-input>
        </el-form-item>
        <el-form-item label="公司名称：">
          <el-input v-model="dialog.form.companyName"></el-input>
        </el-form-item>
        <el-form-item label="终端类型：">
          <el-input v-model="dialog.form.zdlx"></el-input>
        </el-form-item>
      </el-form>
      <el-form label-width="120px">
        <el-form-item label="监控情况：">
          <el-radio-group v-model="dialog.form.jkqk">
            <el-radio label="无异常">无异常</el-radio>
            <el-radio label="异常">异常</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="定位情况：">
          <el-radio-group v-model="dialog.form.dwqk">
            <el-radio label="非精确">非精确</el-radio>
            <el-radio label="精确" class="special_radio"
              ><span class="tw-input-text">在</span
              ><el-input
                v-model="dialog.form.dwqkDetail"
                :disabled="dialog.form.dwqk == '非精确'"
              ></el-input
              ><span class="tw-input-text">附近上传报警</span></el-radio
            >
          </el-radio-group>
        </el-form-item>
        <el-form-item label="处警结果：">
          <el-radio-group v-model="dialog.form.cjjg">
            <el-radio label="报警解除">报警解除</el-radio>
            <el-radio label="其他" class="special_radio"
              ><span class="tw-input-text">其他</span
              ><el-input
                v-model="dialog.form.cjjgDetail"
                :disabled="dialog.form.cjjg == '报警解除'"
              ></el-input
            ></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="报警类型：">
          <el-radio-group v-model="dialog.form.bjlx">
            <el-radio label="真实报警">真实报警</el-radio>
            <el-radio label="测试报警">测试报警</el-radio>
            <el-radio label="报警开关故障">报警开关故障</el-radio>
            <el-radio label="误报警">误报警</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="事件内容：">
          <el-input v-model="dialog.form.sjnr" type="textarea"></el-input>
        </el-form-item>
        <el-form-item label="备注：">
          <el-input v-model="dialog.form.bz"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialog.display = false">取 消</el-button>
        <el-button type="primary" @click="handleDialogSubmit">确 定</el-button>
      </span>
    </el-dialog>
    <div style="display:none">
      <div class="tw-map-dialog-wrapper" ref="map-dialog">
        <div class="dialog_title">
          {{ mapDialog.VEHI_NO }}
          <span class="icon_close" @click="handleInfoWindowClose">x</span>
        </div>
        <div class="dialog_content">
          <div class="tw-item">
            时间：{{ formatterTableTime('', '', mapDialog.STIME) }}
          </div>
          <div class="tw-item">速度：{{ mapDialog.SPEED }}</div>
          <div class="tw-item">Sim卡号：{{ mapDialog.VEHI_SIM }}</div>
          <div class="tw-item">终端类型：{{ mapDialog.MDT_SUB_TYPE }}</div>
          <div class="tw-item">终端编号：{{ mapDialog.MDT_NO }}</div>
          <div class="tw-item">车主电话：{{ mapDialog.OWN_TEL }}</div>
          <div class="tw-item">车主姓名：{{ mapDialog.OWN_NAME }}</div>
          <div class="tw-item">公司：{{ mapDialog.BA_NAME }}</div>
        </div>
        <div class="dialog_sharp"></div>
      </div>
    </div>
  </t-layout>
</template>

<script>
import { iconClassName, baseURL } from 'util'
import axios from 'axios'
import moment from 'moment'
import offlineCar from 'images/car/offline.png'
import _ from 'underscore'
export default {
  name: 'EmergencyAlarmVehicle',
  data() {
    return {
      tabs: {
        left: 'first',
        right: 'bjcx'
      },
      query: {
        cphm: '',
        days: ''
      },
      foot: {
        leftData: []
      },
      table: {
        loading: false,
        data: [],
        selectRows: []
      },
      dialog: {
        title: '',
        type: '',
        toolDisplay: true,
        toolData: [],
        toolActive: '',
        display: false,
        form: {
          cjgh: '', //处警工号：
          companyName: '', //公司名称：
          zdlx: '', //终端类型：
          cjTime: '', //处警时间
          cphm: '', //车牌号码：
          driverPhone: '', //司机电话：
          jkqk: '无异常', //监控情况：
          dwqk: '非精确', //定位情况
          dwqkDetail: '',
          cjjg: '报警解除', //处警结果
          cjjgDetail: '',
          bjlx: '误报警', //报警类型：
          sjnr: '', //事件内容：
          bz: '' //备注：
        }
      },
      bjclient: null,
      gzcl: '',
      yjccl: '',
      map: null,
      markerInfo: {}, //点标记信息
      vehicleList: [], //存储车牌号码
      staticVehicleStr: '',
      mapDialog: {} //infowindow
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.map = new AMap.Map('baidu-map', {
        resizeEnable: true, //是否监控地图容器尺寸变化
        zoom: 18
      })
    })
    this.getData()
    this.getTableData()
  },
  methods: {
    // 车辆报警弹框车辆点击
    chooseDialogVehicle(item) {
      this.dialog.toolActive = item
      this.map.setFitView(this.markerInfo[item])
    },
    // 格式化表格时间
    formatterTableTime(a, b, val) {
      return (val && moment(val).format('YYYY-MM-DD HH:mm:ss')) || ''
    },
    // 报警查询表格数据
    getTableData() {
      this.table.loading = true
      axios
        .get('map/findbjclitem', {
          baseURL,
          params: {
            vhic: this.query.cphm,
            day: this.query.days
          }
        })
        .then(res => {
          this.table.data = res.data
          this.table.loading = false
        })
    },
    async getData() {
      const dataGzcl = await this.getGzcl()
      const dataYjccl = await this.getYjccl()
      const staticData = await this.getMonitor()
      this.gzcl = dataGzcl.data
      this.yjccl = dataYjccl.data
      this.staticVehicleStr = _.pluck(
        staticData.data.vehilist,
        'VEHI_NO'
      ).join()
      await this.connectMQ()
    },
    // 格式化时间 加空格
    formatterMqTime(val) {
      return (
        (val &&
          val.substring(0, 4) +
            '-' +
            val.substring(4, 6) +
            '-' +
            val.substring(6, 8) +
            ' ' +
            val.substring(8, 10) +
            ':' +
            val.substring(10, 12) +
            ':' +
            val.substring(12, 14)) ||
        ''
      )
    },
    getMonitor() {
      return axios.get('map/getMonitor', { baseURL })
    },
    getYjccl() {
      return axios.get('map/yjcbjcar', { baseURL })
    },
    // 获取故障车辆
    getGzcl() {
      return axios.get('map/lovecar', { baseURL })
    },
    // mq客户端监听～～～～～～～～～～～
    connectMQ() {
      console.info('connectMQ')
      let host = '192.168.0.102'
      let port = 61614
      let clientID = 'bj505'
      let bjdxclcs = 0
      let destination = 'hz_taxi_905_gd' // 报警队列
      let _self = this
      let meclientID = clientID + '-' + Math.floor(Math.random() * 100000)
      this.bjclient = new Messaging.Client(host, Number(port), meclientID)
      // 获取到数据
      this.bjclient.onMessageArrived = function(e) {
        let result = JSON.parse(e.payloadString)

        // 重要信息
        if (_self.foot.leftData.length == 50) {
          _self.foot.leftData.pop()
        }

        // cmd  0x0200_1:紧急报警 0x0200_2:超速报警
        if (_self.staticVehicleStr.indexOf(result.vehi_no) > -1) {
          if (result.cmd.indexOf('0x0200') > -1) {
            if (_self.gzcl.indexOf(result.vehi_no) < 0) {
              _self.foot.leftData.unshift({
                ...result,
                type:
                  result.cmd == '0x0200_1'
                    ? '紧急报警'
                    : result.cmd == '0x0200_2'
                    ? '超速报警'
                    : ''
              })
              _self.getMarkerInfo(result.vehi_no)
            }
          }
        }

        // ----------------  重要信息 结束
        // 车辆报警 dialog 数据
        if (_self.dialog.toolData.length == 50) {
          _self.dialog.toolData.pop()
        }
        if (_self.staticVehicleStr.indexOf(result.vehi_no) > -1) {
          if (_self.gzcl.indexOf(result.vehi_no) >= 0) {
            _self.dialog.toolData.unshift({
              ...result,
              title: result.vehi_no + '-故障'
            })
          } else {
            if (_self.yjccl.indexOf(result.isu) >= 0) {
              _self.dialog.toolData.unshift({
                ...result,
                title: result.vehi_no + '-已解除'
              })
            } else {
              _self.dialog.toolData.unshift({
                ...result,
                title: result.vehi_no
              })
            }
          }
        }
      }
      this.bjclient.onConnectionLost = function(e) {}
      this.bjclient.connect({
        onSuccess: function() {
          _self.bjclient.subscribe(destination)
          console.log('消息队列连接成功')
        },
        onFailure: function() {
          console.log('消息队列连接失败')
          bjdxclcs++
          if (bjdxclcs > 5) {
            console.log('连接服务器失败，请检查网络！')
          } else {
            _self.connectMQ(clientID)
          }
        }
      })
    },
    // element dialog 关闭事件
    handleDialogClosed() {
      this.dialog.form.cjgh = ''
      this.dialog.form.companyName = ''
      this.dialog.form.zdlx = ''
      this.dialog.form.cjTime = ''
      this.dialog.form.cphm = ''
      this.dialog.form.driverPhone = ''
      this.dialog.form.jkqk = '无异常'
      this.dialog.form.dwqk = '非精确'
      this.dialog.form.dwqkDetail = ''
      this.dialog.form.cjjg = '报警解除'
      this.dialog.form.cjjgDetail = ''
      this.dialog.form.bjlx = '误报警'
      this.dialog.form.sjnr = ''
      this.dialog.form.bz = ''
    },
    // 报警处理 获取车辆数据
    handleAlarmProcessing() {
      axios
        .get('map/getVehiInfo', {
          baseURL,
          params: {
            vhic: this.dialog.toolActive
          }
        })
        .then(res => {
          this.dialog.form.cjgh = res.data[0].username
          this.dialog.form.zdlx = res.data[0].MT_NAME
          this.dialog.form.companyName = res.data[0].COMP_NAME
          this.dialog.form.cphm = this.dialog.toolActive
          this.dialog.title = '报警处理(' + this.dialog.toolActive + ')'
          this.dialog.type = 'add'
          this.dialog.display = true
        })
    },
    // 取消报警
    handleAlarmCancel() {
      axios
        .get('map/sendTCP', {
          baseURL,
          params: {
            type: 2,
            mdt_no: this.dialog.toolActive
          }
        })
        .then(res => {
          if (res.data.info == 0) this.$message.success('取消报警成功')
          else this.$message.error('取消报警失败')
        })
    },
    // 获取打点信息
    getMarkerInfo(cphm) {
      if (this.vehicleList.join().indexOf(cphm) < 0) {
        this.vehicleList.push(cphm)
        axios
          .get('map/multiVehicle', {
            baseURL,
            params: {
              vhic: cphm
            }
          })
          .then(res => {
            const item = res.data[0]
            var marker = new AMap.Marker({
              position: new AMap.LngLat(item.PX, item.PY),
              icon: offlineCar,
              angle: item.ANGLE,
              offset: new AMap.Pixel(0, -10),
              anchor: 'center',
              title: item.COMP_NAME
            })
            AMap.event.addListener(marker, 'click', () => {
              this.createMapWindow(item, marker)
            })
            this.markerInfo[cphm] = marker
            this.map.add(marker)
          })
      }
    },
    // 创建infowindow
    createMapWindow(item, marker) {
      this.mapDialog = item
      const lngLat = [item.PX, item.PY]
      this.map.setCenter(lngLat)
      this.map.infoWindow = new AMap.InfoWindow({
        isCustom: true, //自定义
        offset: new AMap.Pixel(0, -23),
        content: this.$refs['map-dialog']
      })
      this.map.infoWindow.open(this.map, lngLat)
    },
    // infowindow 自定义关闭按钮点击事件
    handleInfoWindowClose() {
      this.map.infoWindow.close()
    },
    // 重要信息点击事件
    handleImportantInfoClick(cphm) {
      this.map.setFitView(this.markerInfo[cphm])
    },
    // 表格处理
    handleEditClick() {
      const {
        AD_DEALTIME,
        AD_CAR_NO,
        AD_USERID,
        DRIVER_TEL,
        AD_LISTENCASE,
        AD_GPS,
        AD_RESULT,
        AD_ALERTTYPE,
        AD_CONDITION,
        AD_MEMO
      } = this.table.selectRows[0]
      axios
        .get('map/getVehiInfo', {
          baseURL,
          params: {
            vhic: AD_CAR_NO
          }
        })
        .then(res => {
          this.dialog.form.zdlx = res.data[0].MT_NAME
          this.dialog.form.companyName = res.data[0].COMP_NAME

          this.dialog.title = '报警处理(' + AD_CAR_NO + ')'

          this.dialog.form.cjTime = AD_DEALTIME
          this.dialog.form.cjgh = AD_USERID
          this.dialog.form.cphm = AD_CAR_NO
          this.dialog.form.driverPhone = DRIVER_TEL
          this.dialog.form.jkqk = AD_LISTENCASE
          if (AD_GPS == '非精确') this.dialog.form.dwqk = '非精确'
          else {
            this.dialog.form.dwqk = '精确'
            this.dialog.form.dwqkDetail = AD_GPS
          }
          if (AD_RESULT == '报警解除') this.dialog.form.cjjg = '报警解除'
          else {
            this.dialog.form.cjjg = '精确'
            this.dialog.form.cjjgDetail = AD_RESULT
          }
          this.dialog.form.bjlx = AD_ALERTTYPE
          this.dialog.form.sjnr = AD_CONDITION
          this.dialog.form.bz = AD_MEMO

          this.dialog.type = 'edit'
          this.dialog.display = true
        })
    },
    // dialog提交
    handleDialogSubmit() {
      if (!this.validateDialog()) {
        console.info(this.dialog.type)
        if (this.dialog.type == 'add') this.addBjcl()
        else if (this.dialog.type == 'edit') this.editBjcl()
      }
    },
    editBjcl() {
      const {
        driverPhone,
        sjnr,
        bz,
        jkqk,
        dwqk,
        dwqkDetail,
        cjjg,
        cjjgDetail,
        bjlx
      } = this.dialog.form
      const params = new URLSearchParams()
      params.append('sjdh', driverPhone)
      params.append('jkqk', jkqk)
      params.append('dwqk', dwqk == '非精确' ? '非精确' : dwqkDetail)
      params.append('cjjg', dwqk == '报警解除' ? '报警解除' : cjjgDetail)
      params.append('bjlx', bjlx)
      params.append('sjnr', sjnr)
      params.append('bz', bz)
      params.append('id', this.table.selectRows[0].AD_ID)
      axios
        .get('map/editbjcl', {
          baseURL,
          params
        })
        .then(res => {
          if (res.data.type == 0) {
            this.$message.success('处理成功')
            this.dialog.display = false
          } else if (res.data.type == 1) this.$message.error('处理失败')
        })
    },
    addBjcl() {
      const {
        cjTime,
        cjgh,
        cphm,
        driverPhone,
        sjnr,
        bz,
        jkqk,
        dwqk,
        dwqkDetail,
        cjjg,
        cjjgDetail,
        bjlx
      } = this.dialog.form
      const params = new URLSearchParams()
      params.append('bjsj', moment(cjTime).format('YYYY-MM-DD HH:mm:ss'))
      params.append('cjgh', cjgh)
      params.append('cphm', cphm)
      params.append('sjdh', driverPhone)
      params.append('jkqk', jkqk)
      params.append('dwqk', dwqk == '非精确' ? '非精确' : dwqkDetail)
      params.append('cjjg', dwqk == '报警解除' ? '报警解除' : cjjgDetail)
      params.append('bjlx', bjlx)
      params.append('sjnr', sjnr)
      params.append('bz', bz)
      axios
        .get('map/addbjcl', {
          baseURL,
          params
        })
        .then(res => {
          if (res.data.type == 0) {
            this.$message.success('处理成功')
            this.dialog.display = false
          } else if (res.data.type == 1) this.$message.error('处理失败')
        })
    },
    // 非空判断
    validateDialog() {
      const {
        cjTime,
        cjgh,
        cphm,
        driverPhone,
        companyName,
        zdlx,
        sjnr,
        bz
      } = this.dialog.form
      if (!cjTime) return this.$message.warning('请选择处警时间')
      if (!cjgh) return this.$message.warning('请填写处警工号')
      if (!cphm) return this.$message.warning('请填写车牌号码')
      if (!companyName) return this.$message.warning('请填写公司名称')
      if (!zdlx) return this.$message.warning('请填写终端类型')
      if (!sjnr) return this.$message.warning('请填写事件内容')

      return false
    },
    handleTabsLeftClick() {},
    handleQueryClick() {
      this.getTableData()
    },
    // 表格选中事件
    handleSelectionChange(val) {
      this.table.selectRows = val
    }
  }
}
</script>

<style lang="scss" scoped>
.tw-foot-content {
  height: 100%;
  & > .tw-item {
    height: 100%;
    width: 50%;
    display: inline-block;
    vertical-align: middle;
    box-sizing: border-box;
    padding: 5px;
    .tw-tabs-content {
      height: calc(100% - 40px);
      .tw-for {
        height: calc(100% - 30px);
        overflow: auto;
      }
    }
  }
}
// 底部
.tw-tabs-content {
  .tw-title {
    line-height: 30px;
    padding-left: 10px;
    font-size: 15px;
    font-weight: bold;
    color: #010066;
    box-sizing: border-box;
    border-bottom: 1px solid #1e8cff;
  }
  .tw-for {
    .tw-item {
      cursor: pointer;
      user-select: none;
      padding-left: 10px;
      font-size: 14px;
      color: #0000ee;
      line-height: 25px;
      span {
        padding: 0 7px;
      }
      &:nth-child(2n) {
        background-color: #eef9ff;
      }
    }
  }
}
// 地图 按钮
.map-btn {
  position: absolute;
  height: 40px;
  width: 30px;
  background-color: #0062a7;
  top: 20px;
  left: 0px;
  z-index: 10;
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
  // text-align: center;
  i {
    font-size: 27px;
    color: #f7ab00;
    line-height: 40px;
    cursor: pointer;
  }
}
// 地图小弹框
.map-tool-dialog {
  position: absolute;
  top: 30px;
  left: 80px;
  width: 250px;
  height: 220px;
  z-index: 10;
  background-color: #ffffff;
  box-shadow: 1px 2px 12px #565656;
}
// 地图小弹框
.map-tool-dialog {
  .dialog-head {
    position: relative;
    height: 30px;
    background-color: #008ac3;
    color: #f7ab00;
    line-height: 30px;
    text-align: center;
    font-size: 15px;
    font-weight: bold;
  }
  .dialog-content {
    height: calc(100% - 30px);
    > .list-content {
      display: inline-block;
      height: 100%;
      box-sizing: border-box;
      vertical-align: middle;
      &.first {
        width: 60%;
        padding: 15px;
      }
      &.sec {
        width: 40%;
        padding: 8px 0;
        > div {
          height: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
    }
  }
  .el-icon-close {
    position: absolute;
    right: 5px;
    top: 7px;
    font-size: 15px;
    font-weight: bold;
    color: #f7ab00;
    cursor: pointer;
  }
}
// 车辆报警弹框
.dialog-content {
  .list {
    height: 100%;
    border: 1px solid #008ac3;
    .tw-title {
      border-bottom: 1px solid #008ac3;
      color: #010066;
      font-weight: 500;
      line-height: 25px;
      box-sizing: border-box;
      text-align: center;
    }
    .for {
      position: relative;
      height: calc(100% - 25px);
      overflow: auto;
      .tw-item {
        width: 100%;
        box-sizing: border-box;
        padding-left: 10px;
        line-height: 20px;
        color: #010066;
        cursor: pointer;
        &.active,
        &:hover {
          color: #0000ee;
          background-color: #eef9ff;
        }
      }
    }
  }
}
// infowindow 样式
.tw-map-dialog-wrapper {
  position: relative;
  background-color: #ffffff;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  border-radius: 2px;
  &:hover {
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  }
  // title 样式
  .dialog_title {
    position: relative;
    height: 30px;
    line-height: 30px;
    padding-left: 8px;
    font-size: 15px;
    color: #278ac4;
    font-weight: bold;
    background-color: #f9f9f9;
    border-bottom: 1px solid #ccc;
    .icon_close {
      position: absolute;
      font-weight: normal;
      color: #000;
      right: 6px;
      cursor: pointer;
    }
  }
  .dialog_content {
    padding: 5px 10px;
    .tw-item {
      font-size: 15px;
    }
  }
  .dialog_sharp {
    position: absolute;
    bottom: -8px;
    left: 50%;
    margin-left: -8px;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-top: 8px solid #fff;
    &::after {
      position: absolute;
      content: '';
      margin-left: -8px;
      margin-top: -7px;
      border-left: 8px solid transparent;
      border-right: 8px solid transparent;
      border-top: 8px solid rgba(0, 0, 0, 0.3);
      filter: blur(2px);
      z-index: -1;
    }
  }
}
</style>
