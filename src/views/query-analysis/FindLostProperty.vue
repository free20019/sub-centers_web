<!-- 查找失物 -->
<template>
  <t-layout right="400">
    <div class="tw-template-wrapper" v-loading="map.loading">
      <div id="gaode-map" class="tw-map-panel"></div>
    </div>
    <template v-slot:right>
      <div class="tw-template-wrapper" v-scrollbar style="position: relative;">
        <el-form class="tw-form" v-model="query" size="small">
          <el-divider content-position="left">起点范围</el-divider>
          <el-form-item class="tw-form-inline">
            <div>
              <el-date-picker
                class="tw-input-date"
                v-model="query.startPointSTime"
                type="datetime"
                placeholder="开始时间"
              ></el-date-picker
              >&nbsp;
              <el-date-picker
                class="tw-input-date"
                v-model="query.startPointETime"
                type="datetime"
                placeholder="开始时间"
              ></el-date-picker>
            </div>
          </el-form-item>
          <el-form-item class="tw-form-inline">
            <el-button type="primary" @click="handleStartLoactionClick">{{
              fenceTextName('Start')
            }}</el-button>
          </el-form-item>
          <el-divider content-position="left">终点范围</el-divider>
          <el-form-item class="tw-form-inline">
            <div>
              <el-date-picker
                class="tw-input-date"
                v-model="query.endPointSTime"
                type="datetime"
                placeholder="开始时间"
              ></el-date-picker
              >&nbsp;
              <el-date-picker
                class="tw-input-date"
                v-model="query.endPointETime"
                type="datetime"
                placeholder="开始时间"
              ></el-date-picker>
            </div>
          </el-form-item>
          <el-form-item class="tw-form-inline">
            <el-button type="primary" @click="handleEndLoactionClick">{{
              fenceTextName('End')
            }}</el-button>
          </el-form-item>
          <el-form-item class="tw-form-inline">
            <div style="text-align: center;">
              <el-button class="button" type="primary" @click="handleQueryClick"
                >查询</el-button
              >
              <el-button class="button" type="primary" @click="handleQueryDC"
                >导出</el-button
              >
              <el-button
                class="button"
                type="primary"
                @click="handleCloseMapClick"
                >清除地图</el-button
              >
              <el-button
                class="button"
                type="primary"
                @click="displayDialog"
                >弹出框</el-button
              >
            </div>
          </el-form-item>
        </el-form>
        <el-tabs
          class="tw-tabs left-tabs"
          type="border-card"
          v-loading="table.loading"
        >
          <el-tab-pane label="车辆信息">
            <el-table
              class="tw-table tw-item__click"
              :data="table.vehicle"
              size="small"
              border
              v-scrollbar:table
            >
              <el-table-column
                prop="vehi_no"
                label="车牌号码"
                width="100"
                align="center"
                :resizable="false"
              ></el-table-column>
              <!-- <el-table-column prop="px" label="经纬度" width="160" align="center" :resizable="false"></el-table-column> -->
              <el-table-column
                prop="stime"
                label="时间"
                min-width="120"
                align="center"
                :resizable="false"
              ></el-table-column>
              <el-table-column label="操作" width="80" align="center">
                <template v-slot="scope">
                  <el-button
                    type="text"
                    size="small"
                    icon="el-icon-search"
                    title="轨迹"
                    @click="handleTableRowClick(scope.row)"
                  ></el-button>
                  <el-button
                    type="text"
                    size="small"
                    icon="el-icon-data-line"
                    title="回放"
                    @click="displayDialog(scope.row)"
                  ></el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="起点范围">
            <el-table
              class="tw-table tw-item__click"
              :data="table.startPoint"
              size="small"
              border
              v-scrollbar:table
              @row-click="handleTableRowClick"
            >
              <el-table-column
                prop="vehi_no"
                label="车牌号码"
                width="80"
                align="center"
                :resizable="false"
              ></el-table-column>
              <el-table-column
                prop="px"
                label="经纬度"
                width="160"
                align="center"
                :resizable="false"
              ></el-table-column>
              <el-table-column
                prop="stime"
                label="时间"
                min-width="120"
                align="center"
                :resizable="false"
              ></el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="终点范围">
            <el-table
              class="tw-table tw-item__click"
              :data="table.endPoint"
              size="small"
              border
              v-scrollbar:table
              @row-click="handleTableRowClick"
            >
              <el-table-column
                prop="vehi_no"
                label="车牌号码"
                width="80"
                align="center"
                :resizable="false"
              ></el-table-column>
              <el-table-column
                prop="px"
                label="经纬度"
                width="160"
                align="center"
                :resizable="false"
              ></el-table-column>
              <el-table-column
                prop="stime"
                label="时间"
                min-width="120"
                align="center"
                :resizable="false"
              ></el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
        <el-dialog
          class="tw-dialog"
          title="轨迹"
          :visible.sync="dialog.dialogVisible"
          @opened="initMapDialog"
          @closed="distoryMap"
          width="80%">
          <el-form :inline="true" size="medium" class="demo-form-inline">
            <el-form-item label="起始时间">
              <el-date-picker
                class="tw-input-date1"
                v-model="dialog.stime"
                type="datetime"
                placeholder="开始时间"
              ></el-date-picker
              >&nbsp;
              <el-date-picker
                class="tw-input-date1"
                v-model="dialog.etime"
                type="datetime"
                placeholder="开始时间"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="车牌号码">
              <el-select
                v-model="dialog.vhic"
                :remote-method="handleVehicleQueryRemoteMethod"
                remote
                filterable
                reserve-keyword
                placeholder="车牌号码"
              >
                <el-option
                  v-for="item in dialog.vehicleOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="dialogHistory">查询</el-button>
            </el-form-item>
          </el-form>
          <div style="width:100%;height:500px;" id="dialogMap"
          v-loading="dialog.loading"></div>
        </el-dialog>
      </div>
    </template>
  </t-layout>
</template>

<script>
import $ from 'jquery'
import AMap from 'AMap'
import axios from 'axios'
import _ from 'underscore'
import moment from 'moment'
import AMapMixin from 'mixins/mapMixin'
import { baseURL, formatterDateTime } from 'util'
import startIconMarker from 'assets/icon-map/start-marker.png'
import endIconMarker from 'assets/icon-map/end-marker.png'
import emptyMarker from 'images/car/empty-marker.png'
import heavyMarker from 'images/car/heavy-marker.png'

export default {
  name: 'FindLostProperty',
  data() {
    return {
      map: {
        loading: false,
        loaded: false,
        amap: null,
        startMarker: null,
        endMarKer: null,
        polyline: null,
        polylineMarker: [],
        geocoder: null,
        mouseTool: null,
        isStartDraw: false,
        isEndDraw: false
      },
      query: {
        startPointSTime: '',
        startPointETime: '',
        startLoaction: null,
        endPointSTime: '',
        endPointETime: '',
        endLoaction: null
      },
      table: {
        loading: false,
        startPoint: [],
        endPoint: [],
        vehicle: []
      },
      dialog: {
        dialogVisible: false,
        dialogMap: null,
        stime: '',
        etime: '',
        vhic: '',
        vehicleOptions: [],
        polyline: null,
        startMarker: null,
        endMarker: null,
        polyline: [],
        polylineMarker: [],
        loading: false
      }
    }
  },
  mixins: ['AMapMixin'],
  mounted() {
    var startTime = new Date(moment().subtract(1, 'hour'))
    var endTime = new Date()
    this.query.startPointSTime = this.query.endPointSTime = startTime
    this.query.startPointETime = this.query.endPointETime = endTime
    this.dialog.stime = startTime
    this.dialog.etime = endTime
    this.$nextTick(() => {
      this.initMap()
    })
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
    }
  },
  methods: {
    handleVehicleQueryRemoteMethod(query) {
      if (query.length < 3) return
      this.getVehicleList(query)
    },
    getVehicleList(value) {
      const params = new URLSearchParams()
      params.append('vhic', value)
      return axios.post('map/getHisVhic', params, { baseURL }).then(res => {
        this.dialog.vehicleOptions = _.map(res.data, item => {
          return { value: item.VEHI_NO, label: item.VEHI_NO }
        })
      })
    },
    // 初始化地图
    initMapDialog() {
      this.dialog.dialogMap = new AMap.Map('dialogMap', {
          resizeEnable: true, //是否监控地图容器尺寸变化
          zoom:11 //初始化地图层级
      });
      this.dialogHistory()
    },
    distoryMap() {
      this.dialog.dialogMap && this.dialog.dialogMap.destroy();
    },
    displayDialog(item) {
      this.dialog.vhic = item.vehi_no
      this.dialog.dialogVisible = true
    },
    dialogHistory() {
      this.dialog.loading = true
      this.dialog.dialogMap.clearMap()
      var params = new URLSearchParams()
      params.append('vhic', this.dialog.vhic)
      params.append('stime', formatterDateTime(this.dialog.stime))
      params.append('etime', formatterDateTime(this.dialog.etime))
      axios.post('map/getHistory', params, { baseURL }).then(res => {
        this.dialog.loading = false
        console.log(res.data)
        const polylinePath = []
        _.each(res.data, item => {
          this.createMarkerDialog(item)
          polylinePath.push([item.PX, item.PY])
        })
        if (polylinePath.length > 0) this.openDrawRouteMapDialog(polylinePath)
        else this.$message({ message: '无数据', type: 'warning' })
      })
    },
    // 添加marker
    createMarkerDialog(item) {
      var marker = new AMap.Marker({
        position: new AMap.LngLat(item.PX, item.PY),
        icon: this.mapIconType(item.STATE),
        angle: item.ANGLE || item.DIRECTION,
        offset: new AMap.Pixel(0, -10),
        anchor: 'center',
        title: item.COMP_NAME
      })
      AMap.event.addListener(marker, 'click', () => {
        this.createMapWindow(item, marker, this.dialog.dialogMap)
      })
      this.dialog.polylineMarker.push(marker)
      this.dialog.dialogMap.add(marker)
    },
    // 绘制线路
    openDrawRouteMapDialog(path) {
      this.dialog.startMarker = new AMap.Marker({
        position: path[0],
        icon: startIconMarker,
        offset: new AMap.Pixel(-15, -38)
      })
      this.dialog.endMarker = new AMap.Marker({
        position: path[path.length - 1],
        icon: endIconMarker,
        offset: new AMap.Pixel(-15, -38)
      })
      this.dialog.polyline = new AMap.Polyline({ path: path })
      this.dialog.dialogMap.add(this.dialog.polyline)
      this.dialog.dialogMap.add(this.dialog.startMarker)
      this.dialog.dialogMap.add(this.dialog.endMarker)
      this.dialog.dialogMap.setFitView(this.dialog.polyline)
    },
    // 失物招领
    getLostFound() {
      const {
        startPointSTime,
        startPointETime,
        startLoaction,
        endPointSTime,
        endPointETime,
        endLoaction
      } = this.query
      this.table.loading = true
      const pathS = _.map(startLoaction.getPath(), this.routeLineToList)
      const pathE = _.map(endLoaction.getPath(), this.routeLineToList)
      const params = new URLSearchParams()
      params.append('qd_stime', formatterDateTime(startPointSTime))
      params.append('qd_etime', formatterDateTime(startPointETime))
      params.append('zd_stime', formatterDateTime(endPointSTime))
      params.append('zd_etime', formatterDateTime(endPointETime))
      params.append('qd_jwd', pathS.join(';') + ';')
      params.append('zd_jwd', pathE.join(';') + ';')
      params.append('type','0')
      axios.post('map/lostFound', params, { baseURL }).then(res => {
        this.table.startPoint = res.data.qd || []
        this.table.endPoint = res.data.zd || []
        this.table.vehicle = res.data.jg || []
        this.table.loading = false
      })
    },
    handleQueryDC() {
      const {
        startPointSTime,
        startPointETime,
        startLoaction,
        endPointSTime,
        endPointETime,
        endLoaction
      } = this.query
      const pathS = _.map(startLoaction.getPath(), this.routeLineToList)
      const pathE = _.map(endLoaction.getPath(), this.routeLineToList)
      let url = `${baseURL}map/swczexcle?qd_stime=${$.trim(formatterDateTime(startPointSTime))}
                                       &qd_etime=${$.trim(formatterDateTime(startPointETime))}
                                       &zd_stime=${$.trim(formatterDateTime(endPointSTime))}
                                       &zd_etime=${$.trim(formatterDateTime(endPointETime))}
                                       &qd_jwd=${$.trim(pathS.join(';') + ';')}
                                       &zd_jwd=${$.trim(pathE.join(';') + ';')}
                                       &type=0`
      window.open(url)
    },
    // 历史轨迹线路
    getHistory(vehicle) {
      var { startPointSTime, endPointETime } = this.query
      this.map.loading = true
      var params = new URLSearchParams()
      console.log(vehicle,formatterDateTime(startPointSTime),formatterDateTime(endPointETime))
      params.append('vhic', vehicle)
      params.append('stime', formatterDateTime(startPointSTime))
      params.append('etime', formatterDateTime(endPointETime))
      axios.post('map/getHistory', params, { baseURL }).then(res => {
        const polylinePath = []
        _.each(res.data, item => {
          this.createMarker(item)
          polylinePath.push([item.PX, item.PY])
        })
        if (polylinePath.length > 0) this.openDrawRouteMap(polylinePath)
        else this.$message({ message: '无数据', type: 'warning' })
        setTimeout(() => (this.map.loading = false), 500)
      })
    },
    // 绘制起点区域
    handleStartLoactionClick() {
      if (this.map.isStartDraw) {
        this.map.isStartDraw = false
        this.resetMapDraw()
      } else {
        this.map.isStartDraw = true
        this.query.startLoaction && this.clearMapDraw('start')
        this.map.mouseTool.polygon({
          fillColor: '#1a76d5',
          strokeColor: '#80d8ff'
        })
      }
    },
    // 绘制终点区域
    handleEndLoactionClick() {
      if (this.map.isEndDraw) {
        this.map.isEndDraw = false
        this.resetMapDraw()
      } else {
        this.map.isEndDraw = true
        this.query.endLoaction && this.clearMapDraw('end')
        this.map.mouseTool.polygon({
          fillColor: '#892a19',
          strokeColor: '#540e06'
        })
      }
    },
    // 查询点击
    handleQueryClick() {
      if (!this.query.startPointSTime)
        return this.query.$message({
          message: '请选择起点开始时间',
          type: 'warning'
        })
      if (!this.query.startPointETime)
        return this.query.$message({
          message: '请选择起点结束时间',
          type: 'warning'
        })
      if (!this.query.endPointSTime)
        return this.query.$message({
          message: '请选择终点开始时间',
          type: 'warning'
        })
      if (!this.query.endPointETime)
        return this.query.$message({
          message: '请选择终点结束时间',
          type: 'warning'
        })
      if (!this.query.startLoaction)
        return this.$message({ message: '请选择起点范围', type: 'warning' })
      if (!this.query.endLoaction)
        return this.$message({ message: '请选择终点范围', type: 'warning' })
      this.closeRouteLine()
      this.getLostFound()
    },
    // 表格点击事件
    handleTableRowClick(item) {
      console.log(item)
      if (this.map.loading) return
      if (this.map.polyline) this.closeRouteLine()
      // this.query.startPointSTime = new Date('2019-08-26 08:00:00')
      // this.query.endPointETime = new Date('2019-08-26 09:00:00')
      // this.getHistory('浙AT1230')
      this.getHistory(item.vehi_no)
    },
    // 清除地图
    handleCloseMapClick() {
      this.clearMapDraw('start')
      this.clearMapDraw('end')
      this.closeRouteLine()
    },
    // 清除线路
    closeRouteLine() {
      if (this.map.polyline) {
        this.amap.remove(this.map.polyline)
        this.map.polyline = null
      }
      if (this.map.startMarker) {
        this.amap.remove(this.map.startMarker)
        this.map.startMarker = null
      }
      if (this.map.endMarker) {
        this.amap.remove(this.map.endMarker)
        this.map.endMarker = null
      }
      if (this.map.polylineMarker) {
        this.amap.remove(this.map.polylineMarker)
        this.map.polylineMarker = []
      }
    },
    // 绘制线路
    openDrawRouteMap(path) {
      this.map.startMarker = new AMap.Marker({
        position: path[0],
        icon: startIconMarker,
        offset: new AMap.Pixel(-15, -38)
      })
      this.map.endMarker = new AMap.Marker({
        position: path[path.length - 1],
        icon: endIconMarker,
        offset: new AMap.Pixel(-15, -38)
      })
      this.map.polyline = new AMap.Polyline({ path: path })
      this.amap.add(this.map.polyline)
      this.amap.add(this.map.startMarker)
      this.amap.add(this.map.endMarker)
      this.amap.setFitView(this.map.polyline)
    },
    // 绘制按钮文字
    fenceTextName(type) {
      if (this.map[`is${type}Draw`]) return '绘制中。。。'
      if (type === 'Start') return '定位起点'
      else if (type === 'End') return '定位终点'
      return ''
    },
    // 初始化地图
    initMap() {
      this.map.loading = true
      this.amap = new AMap.Map('gaode-map', {
        zoom: 13
      })
      this.amap.plugin(['AMap.MouseTool'], () => {
        this.map.mouseTool = new AMap.MouseTool(this.amap)
        this.map.mouseTool.on('draw', e => {
          let type = this.loactionType()
          if (!type) return
          this.query[`${type}Loaction`] = e.obj
          this.closeMapDraw()
        })
        this.map.geocoder = new AMap.Geocoder()
        setTimeout(() => {
          this.mapLoaded = true
          this.map.loading = false
        }, 500)
      })
    },
    // 当前绘制类型
    loactionType() {
      if (this.map.isStartDraw) {
        this.map.isStartDraw = false
        return 'start'
      } else if (this.map.isEndDraw) {
        this.map.isEndDraw = false
        return 'end'
      }
    },
    resetMapDraw() {
      this.amap.clearMap()
      if (this.query.startLoaction) this.amap.add(this.query.startLoaction)
      if (this.query.endLoaction) this.amap.add(this.query.endLoaction)
      if (this.map.polyline) this.amap.add(this.map.polyline)
      if (this.map.polylineMarker) this.amap.add(this.map.polylineMarker)
    },
    // 关闭绘制
    closeMapDraw() {
      this.map.mouseTool.close()
    },
    // 清除绘制区域
    clearMapDraw(type) {
      const routeLine = this.query[`${type}Loaction`]
      this.amap.remove(routeLine)
      this.query[`${type}Loaction`] = null
    },
    // 添加marker
    createMarker(item) {
      var marker = new AMap.Marker({
        position: new AMap.LngLat(item.PX, item.PY),
        icon: this.mapIconType(item.STATE),
        angle: item.ANGLE || item.DIRECTION,
        offset: new AMap.Pixel(0, -10),
        anchor: 'center',
        title: item.COMP_NAME
      })
      AMap.event.addListener(marker, 'click', () => {
        this.createMapWindow(item, marker, this.amap)
      })
      this.map.polylineMarker.push(marker)
      this.amap.add(marker)
    },
    // 经纬度
    routeLineToList(item) {
      return `${item.lng},${item.lat}`
    },
    createMapWindow(item, marker, map) {
      const lngLat = [item.PX, item.PY]
      const newMapWindow = item => {
        this.map.window = new AMap.InfoWindow({
          isCustom: true, //使用自定义窗体
          content: this.createMapWindowHtml(item)[0],
          offset: new AMap.Pixel(0, -15)
        })
        this.map.window.open(map, marker.getPosition())
      }
      this.map.geocoder.getAddress(lngLat, (status, res) => {
        if (status === 'complete' && res.regeocode)
          item.address = res.regeocode.formattedAddress
        else log.error('根据经纬度查询地址失败')
        newMapWindow(item, map)
      })
      newMapWindow(item, map)
      map.setCenter(new AMap.LngLat(item.PX, item.PY))
    },
    createMapWindowHtml(item) {
      console.info('createMapWindowHtml:', item.address)
      const mapObj = this.map
      var title = $('<span>')
        .addClass('tw-title')
        .text(item['VEHICLE_NUM'])
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
      const stime = formatterDateTime(item.SPEED_TIME)
      const zdzlx = item.MDT_SUB_TYPE || ''
      const kzczt = item.STATE == '1'?'重车':'空车'
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
              `<div class="el-row"><div class="el-col el-col-6 tw-align-right">定位时间：</div><div class="el-col el-col-18">${stime}</div></div>`,
              `<div class="el-row"><div class="el-col el-col-6 tw-align-right">当前地址：</div><div class="el-col el-col-18">${address}</div></div>`,
            ])
        ])
    },
    mapIconType(carType) {
      if (carType == 0) return emptyMarker
      else if (carType == 1) return heavyMarker
      return null
    }
  }
}
</script>

<style lang="scss" scoped>
.tw-input-date {
  width: 185px;
  // padding-right: 10px;
  &:last-child {
    padding-right: 0;
  }
}
.button {
  width: 120px;
}
.left-tabs {
  height: calc(100% - 313px);
  min-height: 350px;
}
.tw-input-date1 {
  width: 200px;
  // padding-right: 10px;
  &:last-child {
    padding-right: 0;
  }
}
</style>
