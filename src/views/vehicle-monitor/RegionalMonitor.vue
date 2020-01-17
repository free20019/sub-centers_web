<!-- 区域监控 -->
<template>
  <t-layout right="350" border>
    <t-layout footer="300" border>
      <div class="tw-map-panel" :class="{'tw-full': map.isFull}" v-loading="map.loading">
        <div id="gaode-map" class="tw-map"></div>
        <div class="tw-map-tool-bar">
          <div class="tw-map-tool-item tw-map-tool-header">
            <t-icon name="icon-list"></t-icon>
          </div>
          <el-tooltip class="tw-map-tool-item" content="全屏" placement="bottom">
            <t-icon name="icon-fullScreen" @click.native="handleMapFullClick"></t-icon>
          </el-tooltip>
          <el-tooltip class="tw-map-tool-item" content="鹰眼" placement="bottom">
            <t-icon name="icon-eagleEyeDiagram" @click.native="handleMapHawkeyeClick"></t-icon>
          </el-tooltip>
        </div>
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
            <span>{{vehicleStatus.offline}}</span>辆
          </div>
          <div class="tw-map-item">
            重车：
            <span>{{vehicleStatus.heavyTruck}}</span>辆
          </div>
          <div class="tw-map-item">
            空车：
            <span>{{vehicleStatus.emptyCar}}</span>辆
          </div>
        </div>
      </div>
      <template v-slot:footer>
        <t-query-panel>
          <template v-slot:querybar>
            <el-form-item>
              <el-button
                type="primary"
                :disabled="!mapLoaded"
                @click="handeFenceClick"
              >{{fenceTextName}}</el-button>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" v-show="DCisShow" @click="areaVhicDC">导出</el-button>
            </el-form-item>
          </template>
          <t-table-page
            class="tw-table tw-item__click"
            :data="filterVehicleList"
            @row-click="handleVehicleTableRowClick"
          >
            <el-table-column type="index" label="序号" width="50" align="center" :resizable="false"></el-table-column>
            <el-table-column prop="VEHI_NO" label="车牌号码" width="140" align="center"></el-table-column>
            <el-table-column prop="COMP_NAME" label="分公司" min-width="240" header-align="center"></el-table-column>
            <el-table-column prop="VEHI_SIM" label="SIM卡号" width="140" align="center"></el-table-column>
            <el-table-column prop="SPEED" label="车速 km/h" width="120" align="center"></el-table-column>
            <!-- 0：在线  1：不在线 -->
            <el-table-column
              prop="TYPE"
              label="在线状态"
              width="120"
              align="center"
              :formatter="formatterTOnlineType"
            ></el-table-column>
            <!-- 0：空车  1：重车 -->
            <el-table-column
              prop="STATE"
              label="空重车状态"
              width="120"
              align="center"
              :formatter="formatterTVehicleType"
            ></el-table-column>
            <el-table-column prop="STIME" label="汇报时间" width="150" align="center">
              <template slot-scope="scope">
                <span v-text="stime(scope.row.STIME)"></span>
              </template>
            </el-table-column>
            <el-table-column
              prop="MDT_SUB_TYPE"
              label="终端类型"
              width="120"
              align="center"
              :resizable="false"
            ></el-table-column>
          </t-table-page>
        </t-query-panel>
      </template>
    </t-layout>
    <template v-slot:right>
      <div class="tw-template-wrapper">
        <t-table-page
          class="tw-table tw-item__click areaCallPolice"
          :data="table.areaList"
          @row-click="handleAreaTableRowClick"
        >
          <el-table-column prop="AREA_NAME" label="区域" width="198" header-align="center"></el-table-column>
          <el-table-column
            prop="AREAVHIC"
            label="车辆数"
            width="60"
            align="center"
            :formatter="formatterVehicleNumber"
          ></el-table-column>
          <el-table-column prop="YJS" label="预报警数" width="70" align="center" :resizable="false"></el-table-column>
        </t-table-page>
      </div>
    </template>
  </t-layout>
</template>

<script>
import $ from 'jquery'
import AMpa from 'AMap'
import axios from 'axios'
import _ from 'underscore'
import moment from 'moment'
import AMapMixin from 'mixins/mapMixin'
import { baseURL, formatterTVehicleType, formatterTOnlineType, formatterDateTime } from 'util'
import offlineCar from 'images/car/offline.png'
import emptyCar from 'images/car/empty-car.png'
import heavyTruck from 'images/car/heavy-truck.png'

export default {
  name: 'RegionalMonitor',
  data() {
    return {
      interfaceTimer: null,
      DCisShow: true,
      areaid:'',
      map: {
        loading: false,
        loaded: false,
        isFull: false,
        isHawkeye: false,
        amap: null,
        mouseTool: null,
        hawkeye: null,
        polygon: null,
        polyline: null,
        window: null,
        vehicleMarker: [],
        areaMarker: [],
        isDraw: false
      },
      vehicleStatus: {
        total: 0,
        online: 0,
        offline: 0,
        heavyTruck: 0,
        emptyCar: 0
      },
      table: {
        selectVehicle: null,
        areaList: [],
        vehicleList: [],
        vhicList: []
      }
    }
  },
  mixins: ['AMapMixin'],
  mounted() {
    this.interfaceTimer = setInterval(() => {
      this.getMonitor()
    }, 1000 * 30)
    this.getMonitor()
    this.$nextTick(() => {
      this.initMap()
    })
  },
  destroyed() {
    if (this.interfaceTimer) clearInterval(this.interfaceTimer)
  },
  computed: {
    mapLoaded: {
      get() {
        return this.map.loaded
      },
      set(value) {
        if (typeof value === 'boolean') this.map.loaded = value
        else throw new Error('"map.loaded" 只支持布尔类型！')
      }
    },
    fenceTextName() {
      this.DCisShow = false
      if (this.map.isDraw) return '绘制中。。。'
      return '围栏'
    },
    filterVehicleList() {
      var selectVehicle = this.table.selectVehicle
      console.log(selectVehicle)
      const list = (selectVehicle && selectVehicle['AREAVHIC']) || []
      const vehicleList = _.filter(this.table.vehicleList, item => {
        return list && list.indexOf(item['VEHI_NO']) >= 0
      })
      return vehicleList
    },
    filterVehicleArea() {
      var selectVehicle = this.table.selectVehicle
      var lngLat = selectVehicle && (selectVehicle['AREA_COORDINATES'] || '')
      if (!lngLat) return undefined
      return _.map(lngLat.split(';'), item => {
        var ll = item.split(',')
        return [ll[0], ll[1]]
      })
    }
  },
  methods: {
    stime(date){
      return moment(date).format('YYYY-MM-DD HH:mm:ss')
    },
    getMonitor() {
      axios.get('map/getMonitor', { baseURL }).then(res => {
        console.log(res.data)
        const { num, arealist, vehilist } = Object.freeze(res.data)
        this.vehicleStatus.total = num.total || 0
        this.vehicleStatus.online = num.online || 0
        this.vehicleStatus.offline = num.notOnline || 0
        this.vehicleStatus.heavyTruck = num.heavyCar || 0
        this.vehicleStatus.emptyCar = num.emptyCar || 0
        this.table.areaList = arealist || []
        this.table.vehicleList = vehilist || []
      })
    },
    handleMapFullClick() {
      this.map.isFull = !this.map.isFull
    },
    handleMapHawkeyeClick() {
      if ((this.map.isHawkeye = !this.map.isHawkeye)) {
        this.map.hawkeye.open()
        this.map.hawkeye.show()
      } else {
        this.map.hawkeye.hide()
        this.map.hawkeye.close()
      }
    },
    handeFenceClick() {
      this.map.isDraw = !this.map.isDraw
      if (this.map.isDraw) {
        this.clearMapAreaMarker()
        this.clearMapDraw()
        this.openMapDraw()
      } else {
        this.amap.clearMap()
        this.closeMapDraw()
        this.createMarkerList()
      }
    },
    handleAreaTableRowClick(item, column, event) {
      this.DCisShow = true
      this.areaid = item.ID
      this.clearMapAreaMarker()
      this.clearMapDraw()
      if (this.map.window) {
        this.map.window.close()
        this.map.window = null
      }
      if (item['AREAVHIC'] instanceof Array) {
        this.table.selectVehicle = item || null
        this.createMarkerList()
      }
    },
    handleVehicleTableRowClick(item) {
      let index = null
      _.each(this.filterVehicleList, (v, i) => {
        if (v.VEHI_NO === item.VEHI_NO) index = i
      })
      if (typeof index === 'number') {
        this.createMapWindow(item, this.map.vehicleMarker[index])
        this.amap.setZoom(19)
      }
    },
    initMap() {
      this.map.loading = true
      this.amap = new AMpa.Map('gaode-map', {
        zoom: 13
      })
      this.amap.plugin(['AMap.MouseTool', 'AMap.OverView'], () => {
        this.map.mouseTool = new AMap.MouseTool(this.amap)
        this.map.mouseTool.on('draw', e => {
          this.$set(this.map, 'polygon', e.obj)
          this.closeMapDraw()
          this.map.isDraw = false
          this.calcPointInArea()
        })
        this.map.hawkeye = new AMap.OverView({ isOpen: false, visible: false })
        this.amap.addControl(this.map.hawkeye)
        this.map.geocoder = new AMap.Geocoder()
        setTimeout(() => {
          this.mapLoaded = true
          this.map.loading = false
        }, 500)
      })
    },
    openMapDraw() {
      this.map.mouseTool.polygon({
        fillColor: '#00b0ff',
        strokeColor: '#80d8ff'
        // strokeWidth: 4
      })
    },
    closeMapDraw() {
      this.map.mouseTool.close()
    },
    clearMapDraw() {
      const { polygon } = this.map
      if (!polygon) return
      this.amap.remove(polygon)
      this.$set(this.map, 'polygon', null)
    },
    clearMapAreaMarker() {
      if (this.map.areaMarker) {
        this.amap.remove(this.map.areaMarker)
        this.map.areaMarker = []
      }
    },
    mapIconType(online, carType) {
      if (online == 1) return offlineCar
      else if (carType == 0) return emptyCar
      else if (carType == 1) return heavyTruck
      return null
    },
    createMarkerList() {
      if (this.map.vehicleMarker.length > 0) {
        this.amap.remove(this.map.vehicleMarker)
        this.map.vehicleMarker = []
      }
      if (this.amap.polyline) {
        this.amap.remove(this.amap.polyline)
        this.amap.polyline = null
      }
      _.each(this.filterVehicleList, item => {
        this.createMarker('vehicleMarker', item)
      })
      // this.table.vehicleList = markerItem
      this.amap.polyline = new AMap.Polygon({
        path: this.filterVehicleArea,
        borderWeight: 2,
        strokeColor: '#1791fc',
        fillColor: '#1791fc',
        fillOpacity: 0.35
      })
      this.amap.add(this.amap.polyline)
      if (!this.map.window)
        this.amap.setFitView([
          ...this.map.vehicleMarker,
          ...this.map.areaMarker
        ])
    },
    createMarker(type, item) {
      var marker = new AMap.Marker({
        position: new AMap.LngLat(item.PX, item.PY),
        icon: this.mapIconType(item.TYPE, item.STATE),
        angle: item.ANGLE,
        offset: new AMap.Pixel(0, -10),
        anchor: 'center',
        title: item.COMP_NAME
      })
      AMap.event.addListener(marker, 'click', () => {
        this.createMapWindow(item, marker)
      })
      this.map[type].push(marker)
      this.amap.add(marker)
    },
    calcPointInArea() {
      const area = this.map.polygon
      const points = this.table.vehicleList
      this.clearMapAreaMarker()
      let itemList = [];
      _.each(_.filter(points, item => item.PX > 10 && item.PY > 10), item => {
        const point = [item.PX, item.PY]
        const isPointInArea = area.contains(point)
        if (isPointInArea) {
          itemList.push(item)
          this.createMarker('areaMarker', item)
        }
      })
      console.log(itemList)
      let vhic = [];
      for(let i=0; i<itemList.length; i++){
        vhic.push(itemList[i].VEHI_NO)
      }
      console.log(vhic)
      itemList = {'AREAVHIC':vhic,'ID':'tt'}
      this.table.selectVehicle = itemList
      console.log(itemList)
      _.each(this.filterVehicleList, () => {
      })
    },
    createMapWindow(item, marker) {
      const lngLat = [item.PX, item.PY]
      const newMapWindow = item => {
        this.map.window = new AMap.InfoWindow({
          isCustom: true, //使用自定义窗体
          content: this.createMapWindowHtml(item)[0],
          offset: new AMap.Pixel(0, -20),
          autoMove: true,
          closeWhenClickMap: true
        })
        this.map.window.open(this.amap, marker.getPosition())
      }
      this.map.geocoder.getAddress(lngLat, (status, res) => {
        if (status === 'complete' && res.regeocode)
          item.address = res.regeocode.formattedAddress
        else log.error('根据经纬度查询地址失败')
        newMapWindow(item)
      })
      newMapWindow(item)
      this.amap.setCenter(new AMap.LngLat(item.PX, item.PY))
    },
    createMapWindowHtml(item) {
      const mapObj = this.map
      var title = $('<span>')
        .addClass('tw-title')
        .text(item['VEHI_NO'])
      var close = $('<span>')
        .addClass('tw-close')
        .html('&times;')
        .on('click', function() {
          mapObj.window.close()
          mapObj.window = null
        })
      const compName = item.COMP_NAME || ''
      const mdtNo = item.MDT_NO || ''
      const phoneNum = item.VEHI_SIM || ''
      const speed = item.SPEED+'KM/S' || '无'
      // const type = item.MDT_SUB_TYPE || ''
      const stime = formatterDateTime(item.STIME)
      const zdzlx = item.MDT_SUB_TYPE || ''
      const kzczt = item.STATE == '1'?'重车':'空车'
      const own_name = item.OWN_NAME || '无'
      const own_tel = item.OWN_TEL || '无'
      const address = item.address || ''
      return $('<div>')
        .addClass('tw-map-window')
        .html([
          $('<div>')
            .addClass('tw-map-window-header')
            .html([title, close]),
          $('<div>')
            .addClass('tw-map-window-body')
            .css({ width: '300px' })
            .html([
              `<div class="el-row"><div class="el-col el-col-6 tw-align-right">公司名称：</div><div class="el-col el-col-18">${compName}</div></div>`,
              `<div class="el-row"><div class="el-col el-col-6 tw-align-right">终端编号：</div><div class="el-col el-col-18">${mdtNo}</div></div>`,
              `<div class="el-row"><div class="el-col el-col-6 tw-align-right">营运状态：</div><div class="el-col el-col-18">${kzczt}</div></div>`,
              `<div class="el-row"><div class="el-col el-col-6 tw-align-right">SIM卡号：</div><div class="el-col el-col-18">${phoneNum}</div></div>`,
              `<div class="el-row"><div class="el-col el-col-6 tw-align-right">GPS速度：</div><div class="el-col el-col-18">${speed}</div></div>`,
              `<!--<div class="el-row"><div class="el-col el-col-6 tw-align-right">终端类型：</div><div class="el-col el-col-18"></div></div>-->`,
              `<div class="el-row"><div class="el-col el-col-6 tw-align-right">子类型：</div><div class="el-col el-col-18">${zdzlx}</div></div>`,
              `<div class="el-row"><div class="el-col el-col-6 tw-align-right">联系人：</div><div class="el-col el-col-18">${own_name}</div></div>`,
              `<div class="el-row"><div class="el-col el-col-6 tw-align-right">联系电话：</div><div class="el-col el-col-18">${own_tel}</div></div>`,
              `<div class="el-row"><div class="el-col el-col-6 tw-align-right">定位时间：</div><div class="el-col el-col-18">${stime}</div></div>`,
              `<div class="el-row"><div class="el-col el-col-6 tw-align-right">当前地址：</div><div class="el-col el-col-18">${address}</div></div>`,
            ])
        ])
    },
    // 格式化
    formatterTOnlineType,
    formatterTVehicleType,
    formatterDateTime,
    formatterVehicleNumber(item, col, value, index) {
      const className = '.areaCallPolice .el-table__body .el-table__row'
      if (item.YJS < value.length) {
        setTimeout(() => {
          const currentRow = document.querySelectorAll(className)[index]
          if (currentRow) currentRow.classList.add('tw-call-police')
        }, 0)
      }
      return value.length || 0
    },
    areaVhicDC(){
      if(this.areaid == '') return
      let url = `${baseURL}map/areaVhicexcle?id=${this.areaid}`;
      window.open(url);
    }
  },
  watch: {
    'table.vehicleList'(value) {
      this.createMarkerList()
      if (this.map.polygon) this.calcPointInArea()
    }
  }
}
</script>

<style lang="scss" scoped>
.tw-template-wrapper {
  padding: 10px;
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
</style>
