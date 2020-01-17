<!-- 位置监控 -->
<template>
  <t-layout class="tw-template-wrapper">
    <template v-slot:left>
      <real-time-monitor-vehicle-panel :vhic.sync="table.positionInfo.data" :ischeckbox="true"></real-time-monitor-vehicle-panel>
    </template>
    <t-layout footer="300">
      <div class="tw-map-panel">
        <div id="baidu-map" class="tw-map-panel"></div>
        <div class="tw-map-prompt-bar">
          <div class="tw-map-item">
            总数：
            <span>{{vehicleStatus.total}}</span>辆
          </div>
          <div class="tw-map-item">
            上线：
            <span>{{vehicleStatus.online}}</span>辆
          </div>
          <div class="tw-map-item">
            下线：
            <span>{{vehicleStatus.notOnline}}</span>辆
          </div>
          <div class="tw-map-item">
            重车：
            <span>{{vehicleStatus.heavyCar}}</span>辆
          </div>
          <div class="tw-map-item">
            空车：
            <span>{{vehicleStatus.emptyCar}}</span>辆
          </div>
        </div>
      </div>
      <template v-slot:footer>
        <t-tabs :active.sync="tabs.active" specified-display="locationMonitor" @tab-click="locationClick">
          <template v-slot:toolbar>
            <el-button type="primary" @click="tableListDC">导出</el-button>
          </template>
          <el-tab-pane label="位置信息" name="locationMonitor">
            <pl-table :datas="positionInfo"
                      class="tw-table tw-table__towLines tw-item__click"
                      size="small"
                      header-drag-style
                      :pagination-show=false
                      use-virtual
                      @row-click="rowclick"
                      :row-height="50">
              <pl-table-column type="index" label="序号" width="50" align="center"></pl-table-column>
              <pl-table-column prop="VEHI_NO" label="车牌号码" min-width="100" align="center"></pl-table-column>
              <pl-table-column prop="COMP_NAME" label="分公司" min-width="260" align="center"></pl-table-column>
              <pl-table-column prop="MDT_SUB_TYPE" label="终端类型" width="120" align="center"></pl-table-column>
              <pl-table-column prop="SFJQ" label="精确度" width="120" align="center"></pl-table-column>
              <pl-table-column prop="VEHI_SIM" label="SIM卡号" width="120" align="center"></pl-table-column>
              <pl-table-column prop="MDT_NO" label="终端编号" width="120" align="center"></pl-table-column>
              <pl-table-column prop="STIME" label="GPS时间" width="160" align="center">
              <template slot-scope="scope">
              <span v-text="stime(scope.row.STIME)"></span>
              </template>
              </pl-table-column>
              <pl-table-column prop="SPEED" label="GPS速度" width="100" align="center"></pl-table-column>
              <pl-table-column prop="STATE" label="车辆状态" width="100" align="center">
              <template slot-scope="scope">
              <span v-text="stateType(scope.row)" :style="{ color: typeColor(scope.row)}"></span>
              </template>
              </pl-table-column>
              <pl-table-column prop="ANGLE" label="方向" width="100" align="center"></pl-table-column>
            </pl-table>
          </el-tab-pane>
          <el-tab-pane
            label="监控信息"
            name="monitorInfo"
            v-scrollbar
            style="position: relative;height: 100%"
          >
            <div v-for="(item, index) in table.monitorInfo" :key="index">
              <div @click="mapInfoOpen(item)">{{ item.VEHI_NO }} - {{ formatterDateTime(item.STIME) }} - {{ item.SPEED }}KM/H - {{ item.PX }},{{ item.PY }} - 方向:{{ formatterDirectionType(item.ANGLE) }}</div>
            </div>
          </el-tab-pane>
          <el-tab-pane
            label="重要信息"
            name="importantInfo"
            v-scrollbar
            style="position: relative;height: 100%"
          >
            <div v-for="(item, index) in table.importantInfo" :key="index">
              <el-link
                type="primary"
                @click="imInfoMapInfoOpen(item)"
              >车牌：{{ item.OPERATION_VEHICLENO }} - 签到时间：{{ formatterDateTime(item.LOGINTIME) }} - 签退时间：{{ formatterDateTime(item.LOGOUTTIME) }}</el-link>
            </div>
          </el-tab-pane>
          <el-tab-pane
            label="终端警情监控"
            name="TerminalMonitor"
            v-scrollbar
            style="position: relative;height: 100%"
          >
            <div v-for="(item, index) in table.alarmInfo" :key="index">
              <el-link
                type="primary"
                @click="mapInfoOpen(item)"
              >车牌：{{ item.VEHI_NO }} - 报警时间：{{ formatterDateTime(item.STIME) }} - 报警类型：{{ item.ALARM }}</el-link>
            </div>
          </el-tab-pane>
          <el-tab-pane
            label="故障报警"
            name="AlarmMonitor"
            v-scrollbar
            style="position: relative;height: 100%"
          >
            <div v-for="(item, index) in table.alarmList" :key="index">
              车牌：{{ item.VEHICLE_NUM }} - 报警类型：{{ item.ALARMSTATUS }}
              <!--<el-link-->
                <!--type="primary"-->
                <!--@click="mapInfoOpen(item)"-->
              <!--&gt;车牌：{{ item.VEHI_NO }} - 报警时间：{{ formatterDateTime(item.STIME) }} - 报警类型：{{ item.ALARM }}</el-link>-->
            </div>
          </el-tab-pane>
          <el-tab-pane label="发送监控" name="sendMonitor"></el-tab-pane>
        </t-tabs>
      </template>
    </t-layout>
    <el-dialog
      class="tw-dialog"
      :title="dialog.title"
      :visible.sync="dialog.display"
      :width="dialog.width"
    >
      <el-form class="tw-form" :model="dialog.form" label-width="80px">
        <el-form-item label="消息内容">
          <el-input type="textarea" :rows="8" placeholder="请输入消息内容" v-model="dialog.form.center"></el-input>
        </el-form-item>
        <el-form-item label="定制消息">
          <div class="tw-list">
            <div
              class="tw-list-item"
              :class="{active: messageIndex === index}"
              v-for="(item,index) in messageList"
              :key="index"
              @click="handleMessageInfoClick(index)"
              @dblclick="handleMessageinfoDblclick(item.INFO)"
            >
              <t-icon class="tw-icon" name="icon-arrowTria"></t-icon>
              <span>{{item.INFO}}</span>
            </div>
          </div>
          <div style="text-align: center;">
            <el-button type="primary" size="small" @click="handleMessageAddClick">添加</el-button>
            <el-button type="primary" size="small" @click="handleMessageEditClick">修改</el-button>
            <el-button type="primary" size="small" @click="handleMessageDeleteClick">删除</el-button>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleDialogCancelClick">取 消</el-button>
        <el-button type="primary" @click="handleDialogDefineClick">发 送</el-button>
      </div>
    </el-dialog>
    <el-dialog
      :title="dialog1.title"
      :visible.sync="dialog1.display"
      :close-on-click-modal="false"
      width="500px"
      @closed="handleDialogClosed"
    >
      <el-form class="tw-form" :model="dialog1.form" label-width="80px">
        <el-form-item label="消息内容">
          <el-input v-model="dialog1.form.name" type="textarea" rows="4"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="handleDialog1CancelClick">取 消</el-button>
        <el-button type="primary" @click="handleDialogSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </t-layout>
</template>

<script>
import axios from 'axios'
import _ from 'underscore'
import AMap from 'AMap'
import AMapUI from 'AMapUI'
import { baseURL, formatterDirectionType, formatterDateTime } from 'util'
import RealTimeMonitorVehiclePanel from 'components/RealTimeMonitorVehiclePanel'
import moment from 'moment'
import $ from 'jquery'
import k1 from 'images/xhcar/k1.png'
import k2 from 'images/xhcar/k2.png'
import k3 from 'images/xhcar/k3.png'
import k4 from 'images/xhcar/k4.png'
import k5 from 'images/xhcar/k5.png'
import k6 from 'images/xhcar/k6.png'
import k7 from 'images/xhcar/k7.png'
import k8 from 'images/xhcar/k8.png'
import z1 from 'images/xhcar/z1.png'
import z2 from 'images/xhcar/z2.png'
import z3 from 'images/xhcar/z3.png'
import z4 from 'images/xhcar/z4.png'
import z5 from 'images/xhcar/z5.png'
import z6 from 'images/xhcar/z6.png'
import z7 from 'images/xhcar/z7.png'
import z8 from 'images/xhcar/z8.png'
import l1 from 'images/xhcar/l1.png'
import l2 from 'images/xhcar/l2.png'
import l3 from 'images/xhcar/l3.png'
import l4 from 'images/xhcar/l4.png'
import l5 from 'images/xhcar/l5.png'
import l6 from 'images/xhcar/l6.png'
import l7 from 'images/xhcar/l7.png'
import l8 from 'images/xhcar/l8.png'
export default {
  name: 'LocationMonitor',
  data() {
    return {
      table: {
        data: [],
        data1: [],
        monitorInfo: [],
        importantInfo: [],
        time: '',
        alarmInfo: [],
        alarmList: [],
        positionInfo: {
          data: []
        }
      },
      tabs: {
        active: 'locationMonitor'
      },
      map: null,
      colors: [
        '#3366cc',
        '#dc3912',
        '#ff9900',
        '#109618',
        '#990099',
        '#0099c6',
        '#dd4477',
        '#66aa00',
        '#b82e2e',
        '#316395',
        '#994499',
        '#22aa99',
        '#aaaa11',
        '#6633cc',
        '#e67300',
        '#8b0707',
        '#651067',
        '#329262',
        '#5574a6',
        '#3b3eac'
      ],
      vehicleData: [],
      infoWindow: new AMap.InfoWindow({
        isCustom: true,
        offset: new AMap.Pixel(0, -30)
      }),
      geocoder: new AMap.Geocoder({
        city: '010', //城市设为北京，默认：“全国”
        radius: 1000 //范围，默认：500
      }),
      pointSimplifierIns: null,
      isOne: 0,
      setintervalLM: null,
      setintervaltabList: null,
      setintervalInfo: null,
      setintervalalarm: null,
      vehicleStatus: {
        total: 0,
        online: 0,
        offline: 0,
        heavyTruck: 0,
        emptyCar: 0
      },
      messageList: [],
      messageIndex: '',
      dialog: {
        display: false,
        title: '消息下发',
        widht: 600,
        form: {
          center: '',
          mdt_no: ''
        }
      },
      dialog1: {
        display: false,
        title: '',
        form: {
          name: '',
          id: ''
        }
      },
      iswzjk: true
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.map = new AMap.Map('baidu-map', {
        resizeEnable: true, //是否监控地图容器尺寸变化
        zoom: 12
      })
      this.getVehiMap()
      this.getAlarm()
      this.setintervalLM = setInterval(this.getVehiMap1, 30000)
      this.setintervalalarm = setInterval(this.getAlarm, 60000)
    })
  },
  computed: {
    positionInfo() {
      return this.table.data
    }
  },
  methods: {
    stime(date) {
      return moment(date).format('YYYY-MM-DD HH:mm:ss')
    },
    stateType(row) {
      if(new Date().getTime() - row.STIME > 1000*60*30){
        return '离线'
      }else{
        if(row.STATE == '1') return '重车'
        else return '空车'
      }
    },
    typeColor(row) {
      if(new Date().getTime() - row.STIME > 1000*60*30){
        return '#606266'
      }else{
        if(row.STATE == '1') return 'red'
        else return '#005400'
      }
    },
    /**查询车辆**/
    getVehiMap() {
      axios.get('map/getMonitor', { baseURL }).then(res => {
        console.log(res.data)
        this.vehicleData = Object.freeze(res.data.vehilist)
        this.vehicleStatus.emptyCar = res.data.num.emptyCar
        this.vehicleStatus.heavyCar = res.data.num.heavyCar
        this.vehicleStatus.notOnline = res.data.num.notOnline
        this.vehicleStatus.online = res.data.num.online
        this.vehicleStatus.total = res.data.num.total
        this.ULLoad()
      })
    },
    /**查询故障车辆**/
    getAlarm() {
      axios.get('map/getAlarm', { baseURL }).then(res => {
        console.log(res.data)
        this.table.alarmList = Object.freeze(res.data)
      })
    },
    getVehiMap1() {
      axios.get('map/getMonitor', { baseURL }).then(res => {
        this.vehicleData = Object.freeze(res.data.vehilist)
        this.vehicleStatus.emptyCar = res.data.num.emptyCar
        this.vehicleStatus.heavyCar = res.data.num.heavyCar
        this.vehicleStatus.notOnline = res.data.num.notOnline
        this.vehicleStatus.online = res.data.num.online
        this.vehicleStatus.total = res.data.num.total
        let data = []
        for (let i = 0, len = this.vehicleData.length; i < len; i++) {
          if (this.vehicleData[i].PX > 115) {
            data.push({
              lngLatLine: [this.vehicleData[i].PX, this.vehicleData[i].PY],
              groupId: this.vehicleData[i].FX,
              vhic: this.vehicleData[i].VEHI_NO
            })
          }
        }
        this.pointSimplifierIns.setData(data)
      })
    },
    getMessageInfo() {
      axios.get('map/getInfo', { baseURL }).then(res => {
        this.messageList = res.data
      })
    },
    handleDialogCancelClick() {
      this.dialog.display = false
    },
    handleDialog1CancelClick() {
      this.dialog1.display = false
    },
    handleDialogClosed() {
      this.dialog1.title = ''
      this.dialog1.form.name = ''
      this.dialog1.form.id = ''
    },
    handleDialogDefineClick() {
      this.dialog.display = false
      if(this.dialog.form.center == ''){
        this.$message({
          message: '消息内容不能为空！',
          type: 'warning'
        });
        return
      }
      let params1 = new URLSearchParams()
      params1.append('vehi_no', this.dialog.form.mdt_no)
      params1.append('nr', this.dialog.form.center)
      axios.post('map/sendMessage', params1, { baseURL }).then(res => {
        this.$message('下发成功');
        // console.log(11,res.data)
      })
    },
    handleMessageInfoClick(index) {
      this.messageIndex = index
    },
    handleMessageinfoDblclick(msg) {
      this.dialog.form.center = msg
    },
    handleDialogSubmit() {
      if(this.dialog1.form.name == ''){
        this.$message({
          message: '消息内容必能为空！',
          type: 'warning'
        });
        return;
      }
      let params = new URLSearchParams()
      params.append('info', this.dialog1.form.name)
      if(this.dialog1.title == '添加') {
        axios.post('map/addInfo', params, { baseURL }).then(res => {
          this.$message(res.data.info);
          this.dialog1.display = false
          this.getMessageInfo()
        })
      }else{
        params.append('id', this.dialog1.form.id)
        axios.post('map/editInfo', params, { baseURL }).then(res => {
          this.$message(res.data.info);
          this.dialog1.display = false
          this.getMessageInfo()
        })
      }
    },
    handleMessageAddClick() {
      this.dialog1.title = '添加'
      this.dialog1.display = true
      this.dialog1.form.id = ''
      this.dialog1.form.name = ''
    },
    handleMessageEditClick() {
      if(this.messageIndex != ''){
        this.dialog1.display = true
        this.dialog1.title = '修改'
        this.dialog1.form.id = this.messageList[this.messageIndex].ID
        this.dialog1.form.name = this.messageList[this.messageIndex].INFO
      }else{
        this.$message({
          message: '请选择一条消息后修改！',
          type: 'warning'
        });
      }
    },
    handleMessageDeleteClick() {
      if(this.messageIndex != null){
        this.$confirm('此操作将永久删除该消息内容, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let params = new URLSearchParams()
          params.append('id', this.messageList[this.messageIndex].ID)
          axios.post('map/delInfo', params, { baseURL }).then(res => {
            this.$message(res.data.info);
            this.getMessageInfo()
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
    initPage(PointSimplifier, $) {
      let pointSimplifierIns1, groupStyleMap

      pointSimplifierIns1 = new PointSimplifier({
        zIndex: 115,
        //autoSetFitView: false,
        map: this.map, //所属的地图实例
        autoSetFitView: false,
        getPosition: function(item) {
          var lngLatLine = item.lngLatLine
          if (!lngLatLine) {
            return null
          }

          // var parts = lngLatLine.split(',');

          return [parseFloat(lngLatLine[0]), parseFloat(lngLatLine[1])]
        },
        getHoverTitle: function(dataItem, idx) {
          return '车牌: ' + dataItem.vhic
        },
        //使用GroupStyleRender
        renderConstructor: PointSimplifier.Render.Canvas.GroupStyleRender,
        renderOptions: {
          //点的样式
          pointStyle: {
            width: 5,
            height: 5,
            fillStyle: '#A2D0FA'
          },
          getGroupId: function(item, idx) {
            return item.groupId
          },
          groupStyleOptions: function(obj) {
            return groupStyleMap[obj]
          }
        }
      })
      function onIconLoad() {
        pointSimplifierIns1.renderLater()
      }

      function onIconError(e) {
        alert('图片加载失败！')
      }
      groupStyleMap = {
        k1: {
          pointStyle: {
            //绘制点占据的矩形区域
            content: PointSimplifier.Render.Canvas.getImageContent(
              k1,
              onIconLoad,
              onIconError
            ),
            //宽度
            width: 30,
            //高度
            height: 30,
            //定位点为中心
            offset: ['-50%', '-50%'],
            fillStyle: null
            //strokeStyle: null
          }
        },
        k2: {
          pointStyle: {
            //绘制点占据的矩形区域
            content: PointSimplifier.Render.Canvas.getImageContent(
              k2,
              onIconLoad,
              onIconError
            ),
            //宽度
            width: 30,
            //高度
            height: 30,
            //定位点为中心
            offset: ['-50%', '-50%'],
            fillStyle: null
            //strokeStyle: null
          }
        },
        k3: {
          pointStyle: {
            //绘制点占据的矩形区域
            content: PointSimplifier.Render.Canvas.getImageContent(
              k3,
              onIconLoad,
              onIconError
            ),
            //宽度
            width: 30,
            //高度
            height: 30,
            //定位点为中心
            offset: ['-50%', '-50%'],
            fillStyle: null
            //strokeStyle: null
          }
        },
        k4: {
          pointStyle: {
            //绘制点占据的矩形区域
            content: PointSimplifier.Render.Canvas.getImageContent(
              k4,
              onIconLoad,
              onIconError
            ),
            //宽度
            width: 30,
            //高度
            height: 30,
            //定位点为中心
            offset: ['-50%', '-50%'],
            fillStyle: null
            //strokeStyle: null
          }
        },
        k5: {
          pointStyle: {
            //绘制点占据的矩形区域
            content: PointSimplifier.Render.Canvas.getImageContent(
              k5,
              onIconLoad,
              onIconError
            ),
            //宽度
            width: 30,
            //高度
            height: 30,
            //定位点为中心
            offset: ['-50%', '-50%'],
            fillStyle: null
            //strokeStyle: null
          }
        },
        k6: {
          pointStyle: {
            //绘制点占据的矩形区域
            content: PointSimplifier.Render.Canvas.getImageContent(
              k6,
              onIconLoad,
              onIconError
            ),
            //宽度
            width: 30,
            //高度
            height: 30,
            //定位点为中心
            offset: ['-50%', '-50%'],
            fillStyle: null
            //strokeStyle: null
          }
        },
        k7: {
          pointStyle: {
            //绘制点占据的矩形区域
            content: PointSimplifier.Render.Canvas.getImageContent(
              k7,
              onIconLoad,
              onIconError
            ),
            //宽度
            width: 30,
            //高度
            height: 30,
            //定位点为中心
            offset: ['-50%', '-50%'],
            fillStyle: null
            //strokeStyle: null
          }
        },
        k8: {
          pointStyle: {
            //绘制点占据的矩形区域
            content: PointSimplifier.Render.Canvas.getImageContent(
              k8,
              onIconLoad,
              onIconError
            ),
            //宽度
            width: 30,
            //高度
            height: 30,
            //定位点为中心
            offset: ['-50%', '-50%'],
            fillStyle: null
            //strokeStyle: null
          }
        },
        z1: {
          pointStyle: {
            //绘制点占据的矩形区域
            content: PointSimplifier.Render.Canvas.getImageContent(
              z1,
              onIconLoad,
              onIconError
            ),
            //宽度
            width: 30,
            //高度
            height: 30,
            //定位点为中心
            offset: ['-50%', '-50%'],
            fillStyle: null
            //strokeStyle: null
          }
        },
        z2: {
          pointStyle: {
            //绘制点占据的矩形区域
            content: PointSimplifier.Render.Canvas.getImageContent(
              z2,
              onIconLoad,
              onIconError
            ),
            //宽度
            width: 30,
            //高度
            height: 30,
            //定位点为中心
            offset: ['-50%', '-50%'],
            fillStyle: null
            //strokeStyle: null
          }
        },
        z3: {
          pointStyle: {
            //绘制点占据的矩形区域
            content: PointSimplifier.Render.Canvas.getImageContent(
              z3,
              onIconLoad,
              onIconError
            ),
            //宽度
            width: 30,
            //高度
            height: 30,
            //定位点为中心
            offset: ['-50%', '-50%'],
            fillStyle: null
            //strokeStyle: null
          }
        },
        z4: {
          pointStyle: {
            //绘制点占据的矩形区域
            content: PointSimplifier.Render.Canvas.getImageContent(
              z4,
              onIconLoad,
              onIconError
            ),
            //宽度
            width: 30,
            //高度
            height: 30,
            //定位点为中心
            offset: ['-50%', '-50%'],
            fillStyle: null
            //strokeStyle: null
          }
        },
        z5: {
          pointStyle: {
            //绘制点占据的矩形区域
            content: PointSimplifier.Render.Canvas.getImageContent(
              z5,
              onIconLoad,
              onIconError
            ),
            //宽度
            width: 30,
            //高度
            height: 30,
            //定位点为中心
            offset: ['-50%', '-50%'],
            fillStyle: null
            //strokeStyle: null
          }
        },
        z6: {
          pointStyle: {
            //绘制点占据的矩形区域
            content: PointSimplifier.Render.Canvas.getImageContent(
              z6,
              onIconLoad,
              onIconError
            ),
            //宽度
            width: 30,
            //高度
            height: 30,
            //定位点为中心
            offset: ['-50%', '-50%'],
            fillStyle: null
            //strokeStyle: null
          }
        },
        z7: {
          pointStyle: {
            //绘制点占据的矩形区域
            content: PointSimplifier.Render.Canvas.getImageContent(
              z7,
              onIconLoad,
              onIconError
            ),
            //宽度
            width: 30,
            //高度
            height: 30,
            //定位点为中心
            offset: ['-50%', '-50%'],
            fillStyle: null
            //strokeStyle: null
          }
        },
        z8: {
          pointStyle: {
            //绘制点占据的矩形区域
            content: PointSimplifier.Render.Canvas.getImageContent(
              z8,
              onIconLoad,
              onIconError
            ),
            //宽度
            width: 30,
            //高度
            height: 30,
            //定位点为中心
            offset: ['-50%', '-50%'],
            fillStyle: null
            //strokeStyle: null
          }
        },
        l1: {
          pointStyle: {
            //绘制点占据的矩形区域
            content: PointSimplifier.Render.Canvas.getImageContent(
              l1,
              onIconLoad,
              onIconError
            ),
            //宽度
            width: 30,
            //高度
            height: 30,
            //定位点为中心
            offset: ['-50%', '-50%'],
            fillStyle: null
            //strokeStyle: null
          }
        },
        l2: {
          pointStyle: {
            //绘制点占据的矩形区域
            content: PointSimplifier.Render.Canvas.getImageContent(
              l2,
              onIconLoad,
              onIconError
            ),
            //宽度
            width: 30,
            //高度
            height: 30,
            //定位点为中心
            offset: ['-50%', '-50%'],
            fillStyle: null
            //strokeStyle: null
          }
        },
        l3: {
          pointStyle: {
            //绘制点占据的矩形区域
            content: PointSimplifier.Render.Canvas.getImageContent(
              l3,
              onIconLoad,
              onIconError
            ),
            //宽度
            width: 30,
            //高度
            height: 30,
            //定位点为中心
            offset: ['-50%', '-50%'],
            fillStyle: null
            //strokeStyle: null
          }
        },
        l4: {
          pointStyle: {
            //绘制点占据的矩形区域
            content: PointSimplifier.Render.Canvas.getImageContent(
              l4,
              onIconLoad,
              onIconError
            ),
            //宽度
            width: 30,
            //高度
            height: 30,
            //定位点为中心
            offset: ['-50%', '-50%'],
            fillStyle: null
            //strokeStyle: null
          }
        },
        l5: {
          pointStyle: {
            //绘制点占据的矩形区域
            content: PointSimplifier.Render.Canvas.getImageContent(
              l5,
              onIconLoad,
              onIconError
            ),
            //宽度
            width: 30,
            //高度
            height: 30,
            //定位点为中心
            offset: ['-50%', '-50%'],
            fillStyle: null
            //strokeStyle: null
          }
        },
        l6: {
          pointStyle: {
            //绘制点占据的矩形区域
            content: PointSimplifier.Render.Canvas.getImageContent(
              l6,
              onIconLoad,
              onIconError
            ),
            //宽度
            width: 30,
            //高度
            height: 30,
            //定位点为中心
            offset: ['-50%', '-50%'],
            fillStyle: null
            //strokeStyle: null
          }
        },
        l7: {
          pointStyle: {
            //绘制点占据的矩形区域
            content: PointSimplifier.Render.Canvas.getImageContent(
              l7,
              onIconLoad,
              onIconError
            ),
            //宽度
            width: 30,
            //高度
            height: 30,
            //定位点为中心
            offset: ['-50%', '-50%'],
            fillStyle: null
            //strokeStyle: null
          }
        },
        l8: {
          pointStyle: {
            //绘制点占据的矩形区域
            content: PointSimplifier.Render.Canvas.getImageContent(
              l8,
              onIconLoad,
              onIconError
            ),
            //宽度
            width: 30,
            //高度
            height: 30,
            //定位点为中心
            offset: ['-50%', '-50%'],
            fillStyle: null
            //strokeStyle: null
          }
        }
      }

      let data = []
      for (var i = 0, len = this.vehicleData.length; i < len; i++) {
        if (this.vehicleData[i].PX > 115) {
          data.push({
            lngLatLine: [this.vehicleData[i].PX, this.vehicleData[i].PY],
            groupId: this.vehicleData[i].FX,
            vhic: this.vehicleData[i].VEHI_NO
          })
        }
      }
      pointSimplifierIns1.on('pointClick', (dataItem, index) => {
        _.map(this.vehicleData, item => {
          if (index.data.vhic == item.VEHI_NO) {
            this.mapInfoOpen(item)
          }
        })
      })
      pointSimplifierIns1.setData(data)
      this.pointSimplifierIns = pointSimplifierIns1
    },
    ULLoad() {
      let _this = this
      AMapUI.load(['ui/misc/PointSimplifier', 'lib/$'], function(
        PointSimplifier,
        $
      ) {
        if (!PointSimplifier.supportCanvas) {
          alert('当前环境不支持 Canvas！')
          return
        }

        _this.initPage(PointSimplifier, $)
      })
    },
    markerMouseout() {
      this.infoWindow.close()
    },
    createInfoWindowHtml(item) {
      let _this = this
      var title = $('<span>')
        .addClass('tw-title')
        .text(item.VEHI_NO + (item.CARSTATE == '0' ? '(精确)' : '(非精确)'))
      var close = $('<span>')
        .addClass('tw-close')
        .html('&times;')
        .on('click', function() {
          // this.infoWindow.close()
          _this.markerMouseout()
        })
      const compName = item.COMP_NAME || ''
      const mdtNo = item.MDT_NO || ''
      const phoneNum = item.VEHI_SIM || ''
      const speed = item.SPEED+'KM/S' || '无'
      // const type = item.MDT_SUB_TYPE || ''
      const address = item.ADDRESS || ''
      const alarm = item.ALARMSTATUS || '无'
      const stime = formatterDateTime(item.STIME)
      const zdzlx = item.MDT_SUB_TYPE || ''
      const kzczt = item.STATE == '1'?'重车':'空车'
      let alarminfo = '',one = ''
      if (alarm.length == 8) {
        one = alarm.substring(7, 8)
        if (
          one == '1' ||
          one == '3' ||
          one == '5' ||
          one == '7' ||
          one == '9' ||
          one == 'B' ||
          one == 'D' ||
          one == 'F'
        ) {
          alarminfo = '紧急报警'
        }else alarminfo = '无'
      }else alarminfo = '无'
      this.dialog.title = '消息下发' + (item.VEHI_NO && ' - ' + item.VEHI_NO)
      this.dialog.form.mdt_no = mdtNo
      this.dialog.form.center = ''
      this.getMessageInfo()
      let btnxxxf = $('<button>')
        .addClass('el-button el-button--primary is-plain el-button--mini')
        .text('消息下发')
        .on('click',()=>{
          this.dialog.display = true
        })
      let btnlsgj = $('<button>')
        .addClass('el-button el-button--primary is-plain el-button--mini')
        .text('历史轨迹')
        .on('click',()=>{
          // this.$store.commit('setHTAddress', item.VEHI_NO);
          this.$cookies.set('setHTAddress', item.VEHI_NO)
          this.$router.push({name: '历史轨迹'})
        })
      return $('<div>')
        .addClass('tw-map-window')
        .html([
          $('<div>')
            .addClass('tw-map-window-header')
            .html([title, close]),
          $('<div>')
            .addClass('tw-map-window-body')
            .html([
              `<div class="el-row"><div class="el-col el-col-6 tw-align-right">公司名称：</div><div class="el-col el-col-18">${compName}</div></div>`,
              `<div class="el-row"><div class="el-col el-col-6 tw-align-right">终端编号：</div><div class="el-col el-col-18">${mdtNo}</div></div>`,
              `<div class="el-row"><div class="el-col el-col-6 tw-align-right">营运状态：</div><div class="el-col el-col-18">${kzczt}</div></div>`,
              `<div class="el-row"><div class="el-col el-col-6 tw-align-right">SIM卡号：</div><div class="el-col el-col-18">${phoneNum}</div></div>`,
              `<div class="el-row"><div class="el-col el-col-6 tw-align-right">GPS速度：</div><div class="el-col el-col-18">${speed}</div></div>`,
              `<!--<div class="el-row"><div class="el-col el-col-6 tw-align-right">终端类型：</div><div class="el-col el-col-18"></div></div>-->`,
              `<div class="el-row"><div class="el-col el-col-6 tw-align-right">子类型：</div><div class="el-col el-col-18">${zdzlx}</div></div>`,
              `<div class="el-row"><div class="el-col el-col-6 tw-align-right">报警状态：</div><div class="el-col el-col-18">${alarminfo}</div></div>`,
              `<div class="el-row"><div class="el-col el-col-6 tw-align-right">定位时间：</div><div class="el-col el-col-18">${stime}</div></div>`,
              `<div class="el-row"><div class="el-col el-col-6 tw-align-right">当前地址：</div><div class="el-col el-col-18">${address}</div></div>`,
              $('<div>').addClass('el-row').html([btnxxxf,btnlsgj])
            ])
        ])
    },
    rowclick(row) {
      this.mapInfoOpen(row)
    },
    imInfoMapInfoOpen(info) {
      _.map(this.vehicleData, item => {
        if (item.VEHI_NO == info.OPERATION_VEHICLENO) this.mapInfoOpen(item)
      })
    },
    mapInfoOpen(item) {
      const newMapWindow = item => {
        this.infoWindow = new AMap.InfoWindow({
          isCustom: true, //使用自定义窗体
          content: this.createInfoWindowHtml(item)[0],
          offset: new AMap.Pixel(0, -20),
          autoMove: true,
          closeWhenClickMap: true
        })
        this.infoWindow.open(this.map, [item.PX, item.PY])
      }
      this.geocoder.getAddress([item.PX, item.PY], (status, res) => {
        if (status === 'complete' && res.regeocode)
          item.ADDRESS = res.regeocode.formattedAddress
        else console.log('根据经纬度查询地址失败')
        newMapWindow(item)
      })
      newMapWindow(item)
      this.map.setCenter([item.PX, item.PY])
    },
    locationClick(targetName) {
      if(targetName.label == '位置信息'){
        if(!this.iswzjk){
          clearInterval(this.setintervaltabList)
          this.tableList()
          this.setintervaltabList = setInterval(this.tableList, 30000)
        }
        this.iswzjk = true
      }else {
        this.iswzjk = false
      }
    },
    tableList() {
      let vhic = ''
      _.map(this.table.data1, item => {
        vhic += "'" + item.VEHI_NO + "',"
      })
      let params = new URLSearchParams()
      params.append('type', '2')
      params.append('vhic', vhic.substring(0, vhic.length - 1))
      axios.post('map/getOneVhic', params, { baseURL }).then(res => {
        this.table.data = res.data || []
        this.table.monitorInfo = res.data || []
        console.log(11,this.table.monitorInfo)
        let alarm = '',
          one = '',
          two = ''
        _.map(res.data, item => {
          if (item.ALARMSTATUS.length == 8) {
            alarm = ''
            one = item.ALARMSTATUS.substring(7, 8)
            two = item.ALARMSTATUS.substring(3, 4)
            if (
              one == '1' ||
              one == '3' ||
              one == '5' ||
              one == '7' ||
              one == '9' ||
              one == 'B' ||
              one == 'D' ||
              one == 'F'
            ) {
              alarm += '紧急报警;'
            }
            if (
              two == '9' ||
              two == '8' ||
              two == 'A' ||
              two == 'B' ||
              two == 'C' ||
              two == 'D' ||
              two == 'E' ||
              two == 'F'
            ) {
              alarm += '越界报警;'
            }
            item.ALARM = alarm
            if (item.ALARM != '') this.table.alarmInfo.push(item)
          }
        })
      })
    },
    tableListDC() {
      let vhic = ''
      _.map(this.table.data1, item => {
        vhic += "'" + item.VEHI_NO + "',"
      })
      let url = `${baseURL}map/getOneVhicexcle?type=2&vhic=${vhic.substring(
        0,
        vhic.length - 1
      )}`
      window.open(url)
    },
    importantInfo() {
      let vhic = ''
      _.map(this.table.data1, item => {
        vhic += "'" + item.VEHI_NO + "',"
      })
      let params = new URLSearchParams()
      params.append('time', this.table.time)
      params.append('vhic', vhic.substring(0, vhic.length - 1))
      axios.post('map/importantInfo', params, { baseURL }).then(res => {
        this.table.importantInfo = res.data || []
      })
    },
    newsRelease() {
      this.dialog.display = true
    },
    formatterDirectionType,
    formatterDateTime
  },
  components: {
    RealTimeMonitorVehiclePanel
  },
  destroyed() {
    if (this.setintervalLM) clearInterval(this.setintervalLM)
    if (this.setintervaltabList) clearInterval(this.setintervaltabList)
  },
  watch: {
    'table.positionInfo.data'(value) {
      console.log(value)
      if (value.length == 0) {
        clearInterval(this.setintervaltabList)
        clearInterval(this.setintervalInfo)
        this.table.data = []
        this.table.data1 = []
        this.table.importantInfo = []
        this.table.monitorInfo = []
        this.table.time = ''
      } else {
        this.table.time = this.stime(new Date())
        this.table.data1 = value
        this.tableList()
        this.setintervaltabList = setInterval(this.tableList, 30000)
        this.importantInfo()
        this.setintervalInfo = setInterval(this.importantInfo, 60000)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.tw-template-wrapper {
  box-sizing: border-box;
}
.tw-map {
  &-prompt-bar {
    position: absolute;
    left: 10px;
    bottom: 0;
    border-radius: 8px 8px 0 0;
    box-shadow: 2px -3px 6px rgba(102, 102, 102, 0.5);
    background-color: #ffffff;
    z-index: 170;
  }
  &-item {
    display: inline-block;
    padding: 10px 15px;
    span {
      margin-right: 5px;
      font-weight: bold;
    }
  }
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
    &:hover,
    &.active {
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
