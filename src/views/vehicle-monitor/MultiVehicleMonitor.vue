<!-- 多车监控 -->
<template>
  <t-layout right="340" :leftBtnStrip="true">
    <template v-slot:left>
      <real-time-monitor-vehicle-panel
        :vhic.sync="table.positionInfo.data"
        @clear-table="clearTable()"
      ></real-time-monitor-vehicle-panel>
    </template>
    <t-layout footer="300" :footerStrip="true">
      <div id="baidu-map" class="tw-map-panel"></div>
      <template v-slot:footer>
        <div class="tw-border__body">
          <el-table
            class="tw-table"
            :data="table.data"
            size="small"
            border
            height="100%"
            v-scrollbar:table
            @row-click="rowclick"
          >
            <el-table-column
              type="index"
              label="序号"
              width="50"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="VEHI_NO"
              label="车牌号码"
              min-width="100"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="COMP_NAME"
              label="分公司"
              min-width="160"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="VEHI_SIM"
              label="SIM卡号"
              width="120"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="MDT_NO"
              label="终端类型"
              width="120"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="STIME"
              label="GPS时间"
              width="160"
              align="center"
            >
              <template slot-scope="scope">
                <span v-text="stime(scope.row.STIME)"></span>
              </template>
            </el-table-column>
            <el-table-column
              prop="SPEED"
              label="GPS速度"
              width="100"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="STATE"
              label="车辆状态"
              width="100"
              align="center"
            >
              <template slot-scope="scope">
                <span v-text="kzctype(scope.row.STATE)"></span>
              </template>
            </el-table-column>
            <el-table-column
              prop="ANGLE"
              :formatter="formatterAngle"
              label="方向"
              width="100"
              align="center"
            ></el-table-column>
            <el-table-column label="操作" width="50" align="center">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-delete"
                  size="small"
                  @click.stop="delRwo(scope.row.VEHI_NO)"
                ></el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </template>
    </t-layout>
  </t-layout>
</template>

<script>
import axios from 'axios'
import RealTimeMonitorVehiclePanel from 'components/RealTimeMonitorVehiclePanel'
import AMap from 'AMap'
import { setInterval } from 'timers'
import {
  baseURL,
  freezeData,
  formatterDateTime,
  formatterTDateTime,
  formatterVehicleType,
  formatterTVehicleType,
  formatterDirectionType,
  formatterTDirectionType,
  direction
} from 'util'
import _ from 'underscore'
import $ from 'jquery'
import moment from 'moment'
import lxImg from 'images/xhcar/l3.png'
import zcImg from 'images/xhcar/z3.png'
import kcImg from 'images/xhcar/k3.png'

export default {
  name: 'MultiVehicleMonitor',
  data() {
    return {
      table: {
        positionInfo: {
          data: []
        },
        data: []
      },
      map: null,
      vhic: {
        vehicle: '',
        vehicleList: [],
        vhicsetInterval: null,
        address: ''
      },
      infoWindow: new AMap.InfoWindow({
        isCustom: true,
        offset: new AMap.Pixel(0, -30)
      }),
      geocoder: new AMap.Geocoder({
        city: '010', //城市设为北京，默认：“全国”
        radius: 1000 //范围，默认：500
      }),
      vehicleinfo: [],
      setIntervalVList: null,
      marList: [],
      lineList: [],
      textList: []
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.map = new AMap.Map('baidu-map', {
        resizeEnable: true, //是否监控地图容器尺寸变化
        zoom: 18
      })
    })
  },
  methods: {
    formatterAngle(a, b, val) {
      return direction(val)
    },
    stime(date) {
      return moment(date).format('YYYY-MM-DD HH:mm:ss')
    },
    kzctype(type) {
      if (type == '1') {
        return '重车'
      } else {
        return '空车'
      }
    },
    getVehicleInfo: function() {
      if (this.vhic.vehicleList.length == 0) {
        this.map.clearMap()
        clearInterval(this.setIntervalVList)
        return
      }
      if(this.$route.path != '/cljk/dcjk') return
      let vhic = ''
      _.map(this.vhic.vehicleList, item => {
        vhic += item + ';'
      })
      let params = new URLSearchParams()
      params.append('vhic', vhic.substring(0, vhic.length - 1))
      axios.post('map/multiVehicle', params, { baseURL }).then(res => {
        // console.log('data:',res.data)
        // this.map.remove(this.marList)
        // this.map.remove(this.textList)
        this.map.clearMap()
        const data = res.data
        this.table.data = res.data || []
       this.lineList = _.map(data, item=>{
         const line = _.pluck(this.lineList,'VEHI_NO')
         const index = line.indexOf(item.VEHI_NO)
         const {PX, PY}  = item
         console.log('this.lineList[index].path:',this.lineList, index)
         if (index != -1)
           item.path=[...this.lineList[index].path,new AMap.LngLat(PX, PY)]
         else 
           item.path=[new AMap.LngLat(PX, PY)]
          console.log('item:',item)
           this.addLine(item)
           this.addmar(item)
           this.addText(item)
           if (item.VEHI_NO == this.vhic.vehicle) {
            this.markerClick(item)
           }
         return item
       })
      })
    },
    /**
     * @description: 清空表格数据
     * @param {type}
     * @return:
     */

    clearTable() {
      this.table.data = []
      this.marList = []
      this.textList = []
      this.lineList = []
      this.map.clearMap()
      this.vhic.vehicleList = []
    },
    addmar(item) {
      let icon = ''
      if (item.TYPE == '1') icon = lxImg
      else {
        if (item.STATE == '1') icon = zcImg
        else icon = kcImg
      }
      let marker = new AMap.Marker({
        position: [item.PX, item.PY],
        map: this.map,
        icon: icon,
        offset: new AMap.Pixel(-16, -16),
        angle: item.ANGLE
      })
      marker.vehicle = item.VEHI_NO
      this.marList.push(marker)
      AMap.event.addListener(marker, 'click', e => {
        this.markerClick(item)
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
      const speed = item.SPEED + 'KM/S' || '无'
      // const type = item.MDT_SUB_TYPE || ''
      const address = item.ADDRESS || ''
      const stime = formatterDateTime(item.STIME)
      const zdzlx = item.MDT_SUB_TYPE || ''
      const kzczt = item.STATE == '1' ? '重车' : '空车'
      const fx = this.formatterAngle(1,1,item.ANGLE)
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
              `<div class="el-row"><div class="el-col el-col-6 tw-align-right">子类型：</div><div class="el-col el-col-18">${zdzlx}</div></div>`,
              `<div class="el-row"><div class="el-col el-col-6 tw-align-right">营运状态：</div><div class="el-col el-col-18">${kzczt}</div></div>`,
              `<div class="el-row"><div class="el-col el-col-6 tw-align-right">SIM卡号：</div><div class="el-col el-col-18">${phoneNum}</div></div>`,
              `<div class="el-row"><div class="el-col el-col-6 tw-align-right">GPS速度：</div><div class="el-col el-col-6">${speed}</div><div class="el-col el-col-6 tw-align-right">方向：</div><div class="el-col el-col-6">${fx}</div></div>`,
              `<div class="el-row"><div class="el-col el-col-6 tw-align-right">定位时间：</div><div class="el-col el-col-18">${stime}</div></div>`,
              `<div class="el-row"><div class="el-col el-col-6 tw-align-right">当前地址：</div><div class="el-col el-col-18">${address}</div></div>`
            ])
        ])
    },
    addText(item) {
      let text1 = new AMap.Text({
        text: item.VEHI_NO,
        anchor: 'bottom-center', // 设置文本标记锚点
        cursor: 'pointer',
        offset: new AMap.Pixel(5, 30),
        style: {
          // 'padding': '.75rem 1.25rem',
          // 'margin-bottom': '1rem',
          'border-radius': '.25rem',
          'background-color': 'white',
          width: (item.VEHI_NO.length+1)+'em',
          'border-width': 0,
          'box-shadow': '0 2px 6px 0 rgba(114, 124, 245, .5)',
          'text-align': 'center',
          'font-size': '10px',
          'font-weight': 'bold ',
          color: 'blue'
        },
        position: [item.PX, item.PY]
      })
      text1.vehicle = item.VEHI_NO
      this.textList.push(text1)
      text1.setMap(this.map)
    },
    addLine({path, VEHI_NO}) {
      //绘制轨迹
      let polyline = new AMap.Polyline({
        path: path,
        showDir: true,
        strokeColor: '#28F', //线颜色
        strokeWeight: 3 //线宽
      })
      polyline.vehicle = VEHI_NO
      polyline.setMap(this.map)
      return polyline
      // this.lineList.push(polyline)
    },
    markerClick(item) {
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
        else log.error('根据经纬度查询地址失败')
        newMapWindow(item)
      })
      newMapWindow(item)
      this.map.setCenter([item.PX, item.PY])
    },
    rowclick(row) {
      this.map.setCenter([row.PX, row.PY])
      this.markerClick(row)
    },
    delRwo(vhic) {
      let data = []
      for (let i = 0; i < this.table.data.length; i++) {
        if (this.table.data[i].VEHI_NO != vhic) {
          data.push(this.table.data[i])
        }
      }
      let vehicleList = []
      _.map(this.vhic.vehicleList, item => {
        if (item != vhic) vehicleList.push(item)
      })
      this.vhic.vehicleList = vehicleList
      this.table.data = data
      this.vhic.vehicle = ''
      console.log(vhic)
      this.getVehicleInfo()
    }
  },
  components: {
    RealTimeMonitorVehiclePanel
  },
  watch: {
    'table.positionInfo.data'(value) {
      console.log('value:',value[0].VEHI_NO)
      for (let i = 0; i < this.vhic.vehicleList.length; i++) {
        if (this.vhic.vehicleList[i] == value[0].VEHI_NO) {
          this.$message.error('该车已在监控列表')
          return
        }
      }
      this.vhic.vehicle = value[0].VEHI_NO
      this.vhic.vehicleList.push(
        value[0].VEHI_NO
      )
      this.getVehicleInfo()
      if (null == this.setIntervalVList)
        this.setIntervalVList = setInterval(this.getVehicleInfo, 20000)
        // this.setIntervalVList = setInterval(this.getVehicleInfo, 3000)
    }
  },
  destroyed() {
    clearInterval(this.setIntervalVList)
  }
}
</script>

<style lang="scss" scoped>
.tw-border {
  &__body {
    height: 100%;
    padding: 10px;
    border: 1px solid #eeeeee;
    // border-left: 1px solid #eeeeee;
    // border-right: 1px solid #eeeeee;
    box-sizing: border-box;
  }
}
</style>
