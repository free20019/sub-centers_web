<!-- 历史轨迹 -->
<template>
  <t-layout border right="273" v-loading="table.gpsData.loading">
    <t-layout border footer-strip footer="360">
      <div id="baidu-map" class="tw-map-panel"></div>
      <template v-slot:footer>
        <el-slider
          v-model="map.playFrame"
          :max="table.gpsData.data.length"
          style="padding-left: 20px; padding-right: 20px;"
        ></el-slider>
        <el-tabs
          class="tw-tabs tw-full"
          v-model="tabs.active"
          tab-position="bottom"
          type="border-card"
          @tab-click="test"
          style="height: calc(100% - 38px)"
        >
          <el-tab-pane label="GPS数据" name="GPSData">
            <t-query-panel>
              <template v-slot:querybar>
                <el-form-item>
                  <el-button type="primary" @click="getHistoryExcle">导出</el-button>
                </el-form-item>
                <!-- <el-form-item>
                  <el-pagination
                    background
                    layout="prev, pager, next"
                    :page-size="table.gpsData.pageSize"
                    :current-page="table.gpsData.currentPage"
                    :total="table.gpsData.data.length"
                    @current-change="handleTablePageCurrentChange"
                  ></el-pagination>
                </el-form-item>-->
              </template>
              <el-table
                class="tw-table"
                :data="freezeData(table.gpsData.data)"
                size="small"
                border
                stripe
                v-scrollbar:table
                @row-click="rowclick"
              >
                <el-table-column
                  type="index"
                  label="序号"
                  width="60"
                  align="center"
                ></el-table-column>
                <el-table-column
                  prop="COMP_NAME"
                  label="公司"
                  min-width="120"
                  align="center"
                ></el-table-column>
                <el-table-column
                  prop="VEHICLE_NUM"
                  label="车牌号码"
                  width="120"
                  align="center"
                ></el-table-column>
                <el-table-column
                  prop="SPEED_TIME"
                  label="时间"
                  width="160"
                  align="center"
                  :formatter="formatterTDateTime"
                ></el-table-column>
                <el-table-column
                  prop="STATE"
                  label="车辆状态"
                  width="100"
                  align="center"
                  :formatter="formatterTVehicleType"
                ></el-table-column>
                <el-table-column
                  prop="CARSTATE"
                  label="是否精确"
                  width="100"
                  align="center"
                >
                  <template slot-scope="scope">
                    <span v-text="sfjq(scope.row.CARSTATE)"></span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="PX"
                  label="经度"
                  width="120"
                  align="center"
                ></el-table-column>
                <el-table-column
                  prop="PY"
                  label="纬度"
                  width="120"
                  align="center"
                ></el-table-column>
                <el-table-column
                  prop="DIRECTION"
                  label="方向"
                  width="100"
                  align="center"
                  :formatter="formatterTDirectionType"
                ></el-table-column>
                <el-table-column
                  prop="SPEED"
                  label="GPS速度 km/h"
                  width="100"
                  align="center"
                ></el-table-column>
                <el-table-column
                  prop="MILEAGE"
                  label="总里程 km"
                  width="100"
                  align="center"
                ></el-table-column>
              </el-table>
            </t-query-panel>
          </el-tab-pane>
          <el-tab-pane label="速度曲线" name="second">
            <div id="speedecharts" style="width: 100%;height: 100%"></div>
          </el-tab-pane>
        </el-tabs>
      </template>
    </t-layout>
    <template v-slot:right>
      <div id="calendar" class="tw-calendar no-footer"></div>
      <el-form class="tw-form" :model="vehicleQuery" size="small">
        <el-form-item>
          <el-select
            v-model="vehicleQuery.vehicle"
            :remote-method="handleVehicleQueryRemoteMethod"
            remote
            filterable
            reserve-keyword
            placeholder="车牌号码"
          >
            <el-option
              v-for="item in vehicleOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
         <!-- <div style="display:none">{{ getHTAddress }}</div> -->
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="vehicleQuery.startTime"
            type="datetime"
            placeholder="开始时间"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="vehicleQuery.endTime"
            type="datetime"
            placeholder="开始时间"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQueryClick">查询</el-button>
        </el-form-item>
        <el-form-item label-width="9em">
          <template v-slot:label>
            <el-button
              type="text"
              :icon="playIconType"
              @click="handlePlayClick"
            ></el-button>
            <el-button
              type="text"
              icon="iconfont icon-stop"
              @click="handleStopClick"
            ></el-button
            >&emsp;速度：
          </template>
          <el-slider
            v-model="vehicleQuery.speed"
            :min="1"
            :max="10"
            @change="handleVehicleSpeedChange"
          ></el-slider>
        </el-form-item>
      </el-form>
      <t-panel class="no-radius" title="点位状态" size="small">
        <el-row class="tw-item">
          <el-col :span="12">速度：{{ info.speed }}</el-col>
          <el-col :span="12">方向：{{ info.fx }}</el-col>
        </el-row>
        <el-row class="tw-item">
          <el-col :span="12">经度：{{ info.px }}</el-col>
          <el-col :span="12">纬度：{{ info.py }}</el-col>
        </el-row>
        <el-row class="tw-item">
          <el-col :span="12">当前里程：{{ info.dqlc }}</el-col>
          <el-col :span="12">合计里程：{{ info.zlc }}</el-col>
        </el-row>
        <el-row class="tw-item">
          <el-col :span="24">GPS时间：{{ info.time }}</el-col>
        </el-row>
        <el-row class="tw-item">
          <el-col :span="12">状态：{{ info.zt }}</el-col>
        </el-row>
      </t-panel>
    </template>
  </t-layout>
</template>

<script>
import axios from 'axios'
import _ from 'underscore'
import moment from 'moment'
import {
  baseURL,
  freezeData,
  formatterDateTime,
  formatterTDateTime,
  formatterVehicleType,
  formatterTVehicleType,
  formatterDirectionType,
  formatterTDirectionType
} from 'util'
import mmc from 'assets/js/markerMovingControl.js'
import AMap from 'AMap'
import echarts from 'echarts'
import $ from 'jquery'
import car from 'images/car.png'
import kc from 'images/fxyd.png'
import zc from 'images/fxjz.png'
import start from 'images/start.png'
import end from 'images/end.png'
export default {
  name: 'HistoricalTrack',
  data() {
    return {
      map: {
        bmap: null,
        vehicleRoute: null,
        vehicleMarker: null,
        playType: 0,
        playFrame: 0,
        palytool: null,
        markerhistory: [],
        polyline: [],
        markerMovingControl: null
      },
      vehicleQuery: {
        vehicle: '',
        startTime: '',
        endTime: '',
        speed: 5
      },
      vehicleOptions: [],
      tabs: {
        active: 'GPSData'
      },
      table: {
        gpsData: {
          loading: false,
          data: [],
          pageSize: 100,
          currentPage: 1,
          freeze: true
        },
        vehicleRecord: {
          loading: false,
          data: [],
          duration: 2
        },
        alarmLocation: {
          loading: false,
          data: []
        },
        speedingSection: {
          loading: false,
          data: []
        },
        leftEChart: null
      },
      setIntervalgj: null,
      info: {
        speed: '',
        fx: '',
        px: '',
        py: '',
        dqlc: '',
        zlc: '',
        time: '',
        zt: ''
      },
      geocoder: new AMap.Geocoder({
        city: '010', //城市设为北京，默认：“全国”
        radius: 1000 //范围，默认：500
      }),
      dqjd: {
        jindu: 0
      }
    }
  },
  mounted() {
    this.vehicleQuery.startTime = moment(
      new Date(new Date().getTime() - 1000 * 60 * 60 * 1)
    ).format('YYYY-MM-DD HH:mm:ss')
    this.vehicleQuery.endTime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
    // this.vehicleQuery.vehicle = this.$cookies.get('setHTAddress') || ''
    this.getVehi_no()
    this.$nextTick(() => {
      this.map.bmap = new AMap.Map('baidu-map', {
        resizeEnable: true, //是否监控地图容器尺寸变化
        zoom: 12
      })

      laydate.render({
        elem: '#calendar',
        position: 'static'
      })
      // if (this.vehicleQuery.vehicle != '') {
      //   this.$cookies.remove('setHTAddress')
      // }
    })
  },
  computed: {
    playIconType() {
      const iconName = this.map.playType === 1 ? 'icon-timeOut' : 'icon-play'
      return `iconfont ${iconName}`
    }
    // getHTAddress() {
    //   return this.$cookies.get('setHTAddress')
    // }
  },
  methods: {
    sfjq(type) {
      if (type == '0') {
        return '精确'
      } else {
        return '非精确'
      }
    },
    async regeoCode(px, py) {
      let lnglat = [px, py]
      let add = new Promise((resolve, reject) => {
        this.geocoder.getAddress(lnglat, (status, result) => {
          if (status === 'complete' && result.regeocode)
            resolve(result.regeocode.formattedAddress)
          else reject('无')
        })
      })
      let address = await add
      return address
    },
    getVehicleList(value) {
      const params = new URLSearchParams()
      params.append('vhic', value)
      return axios.post('map/getHisVhic', params, { baseURL }).then(res => {
        this.vehicleOptions = _.map(res.data, item => {
          return { value: item.VEHI_NO, label: item.VEHI_NO }
        })
      })
    },
    rowclick(row) {
      this.info.speed = row.SPEED
      this.info.fx = this.formatterDirectionType(row.DIRECTION)
      this.info.px = row.PX
      this.info.py = row.PY
      this.info.dqlc = row.MILEAGE
      this.info.zlc = row.MILEAGE
      this.info.time = moment(row.SPEED_TIME).format('YYYY-MM-DD HH:mm:ss')
      this.info.zt = row.STATE == 1 ? '重车' : '空车'
      this.map.bmap.setCenter([row.PX, row.PY])
      this.markerClick(row)
    },
    getHistoryExcle() {
      const { vehicle, startTime, endTime } = this.vehicleQuery
      const params = new URLSearchParams()
      let cphm = vehicle
      params.append('vhic', vehicle)
      params.append('stime', moment(startTime).format('YYYY-MM-DD HH:mm:ss'))
      params.append('etime', moment(endTime).format('YYYY-MM-DD HH:mm:ss'))
      let url = `${baseURL}map/getHistoryexcle?stime=${moment(startTime).format('YYYY-MM-DD HH:mm:ss')}
                                        &etime=${moment(endTime).format('YYYY-MM-DD HH:mm:ss')}
                                        &vhic=${vehicle}`
      window.open(url)
    },
    /**查询轨迹**/
    getHistoryList() {
      const { vehicle, startTime, endTime } = this.vehicleQuery
      const params = new URLSearchParams()
      let cphm = vehicle
      params.append('vhic', vehicle)
      params.append('stime', moment(startTime).format('YYYY-MM-DD HH:mm:ss'))
      params.append('etime', moment(endTime).format('YYYY-MM-DD HH:mm:ss'))
      this.table.gpsData.loading = true
      return axios.post('map/getHistory', params, { baseURL }).then(res => {
        this.vehicleQuery.vehicle = cphm
        this.map.bmap.clearMap()
        let lineArr = []
        this.table.gpsData.data = []
        let datas = []
        if(res.data.length == 0) {
           this.table.gpsData.loading = false
          this.$message({
            message: '该车无轨迹！',
            type: 'warning'
          })
          return
        }
        for (let i = 0; i < res.data.length; i++) {
          lineArr.push(new AMap.LngLat(res.data[i].PX, res.data[i].PY))
          if (i == 0) this.addmar(res.data[i], 0)
          else if (i == res.data.length - 1) this.addmar(res.data[i], 1)
          else this.addmar(res.data[i], 2)
        }
        this.addLine(lineArr)
        this.map.markerMovingControl = new mmc(
          this.map.bmap,
          this.map.markerhistory,
          lineArr,
          1000
        )
        this.table.gpsData.data = res.data
        // if(datas.length = res.data.length)
        this.table.gpsData.loading = false
        // this.speedecharts();
      })
    },
    addmar(item, type) {
      let icon = ''
      let direction = 0
      if (type == 0) {
        icon = start
      } else if (type == 1) {
        icon = end
      } else {
        direction = item.DIRECTION - 90
        if (item.STATE == '1') icon = zc
        else icon = kc
      }
      let marker = new AMap.Marker({
        position: [item.PX, item.PY],
        map: this.map.bmap,
        icon: icon,
        offset: new AMap.Pixel(-7, -7),
        angle: direction
      })
      marker.stime = item.STIME
      AMap.event.addListener(marker, 'click', e => {
        this.markerClick(item)
      })
    },
    addLine(lineArr) {
      this.map.markerhistory = new AMap.Marker({
        map: this.map.bmap,
        //draggable:true, //是否可拖动
        position: lineArr[0], //基点位置
        icon: car, //marker图标，直接传递地址url
        zIndex: 101,
        offset: new AMap.Pixel(-26, -13), //相对于基点的位置
        autoRotation: true
      })
      //绘制轨迹
      this.map.polyline = new AMap.Polyline({
        map: this.map.bmap,
        path: lineArr,
        showDir: true,
        strokeColor: '#28F', //线颜色
        // strokeOpacity: 1,     //线透明度
        strokeWeight: 3 //线宽
        // strokeStyle: "solid"  //线样式
      })
      this.map.bmap.setFitView()
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
        this.infoWindow.open(this.map.bmap, [item.PX, item.PY])
      }
      this.geocoder.getAddress([item.PX, item.PY], (status, res) => {
        if (status === 'complete' && res.regeocode)
          item.ADDRESS = res.regeocode.formattedAddress
        else log.error('根据经纬度查询地址失败')
        newMapWindow(item)
      })
      newMapWindow(item)
      this.map.bmap.setCenter([item.PX, item.PY])
    },
    test() {
      if (this.tabs.active === 'second') setTimeout(this.speedecharts, 500)
      // this.leftEChart.reset();
    },
    speedecharts() {
      let data = [],
        title = []
      _.map(this.table.gpsData.data, item => {
        title.push(moment(item.SPEED_TIME).format('YYYY-MM-DD HH:mm:ss'))
        data.push(item.SPEED)
      })
      this.leftEChart = echarts.init(document.getElementById('speedecharts'))
      this.leftEChart.setOption({
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['速度曲线']
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: title
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            formatter: '{value} (KM/H)'
          }
        },
        series: [
          {
            name: '时速',
            type: 'line',
            data: data,
            markPoint: {
              data: [
                { type: 'max', name: '最大值' },
                { type: 'min', name: '最小值' }
              ]
            }
          }
        ]
      })
      this.leftEChart.resize()
    },
    markerMouseout() {
      this.infoWindow.close()
    },
    createInfoWindowHtml(item) {
      let _this = this
      var title = $('<span>')
        .addClass('tw-title')
        .text(item.VEHICLE_NUM + (item.CARSTATE == '0' ? '(精确)' : '(非精确)'))
      var close = $('<span>')
        .addClass('tw-close')
        .html('&times;')
        .on('click', function() {
          // this.infoWindow.close()
          _this.markerMouseout()
        })
      const address = item.ADDRESS || ''
      const stime = formatterDateTime(item.SPEED_TIME)
      return $('<div>')
        .addClass('tw-map-window')
        .html([
          $('<div>')
            .addClass('tw-map-window-header')
            .html([title, close]),
          $('<div>')
            .addClass('tw-map-window-body')
            .html([
              `<div class="el-row"><div class="el-col el-col-6 tw-align-right">定位时间：</div><div class="el-col el-col-18">${stime}</div></div>`,
              `<div class="el-row"><div class="el-col el-col-6 tw-align-right">当前地址：</div><div class="el-col el-col-18">${address}</div></div>`
            ])
        ])
    },
    handleTablePageCurrentChange(index) {
      this.table.gpsData.currentPage = index
    },
    handleVehicleQueryRemoteMethod(query) {
      if (query.length < 3) return
      this.getVehicleList(query)
    },
    handlePlayClick() {
      const { playType } = this.map
      if (this.table.gpsData.data.length === 0)
        return this.$message({ message: '无数据不支持播放', type: 'warning' })
      if (playType === 0) {
        this.map.playType = 1
        // let ttt = this.map.markerMovingControl.move();
        this.setIntervalgj = setInterval(() => {
          this.haldlestep()
        }, 200)
        // this.haldlestep();
      } else {
        this.map.playType = 0
        clearInterval(this.setIntervalgj)
        this.map.markerMovingControl.stop()
      }
    },
    haldlestep() {
      this.dqjd.jindu++
      let ttt = this.dqjd.jindu
      // let ttt = this.map.markerMovingControl.step();
      // console.log(ttt,this.table.gpsData.data.length)
      if (ttt >= this.table.gpsData.data.length) {
        clearInterval(this.setIntervalgj)
      }
      // if(ttt == this.dqjd.jindu){
      //   ttt = ttt+1
      // }
      this.map.playFrame = ttt
      this.info.speed = this.table.gpsData.data[ttt].SPEED
      this.info.fx = this.formatterDirectionType(
        this.table.gpsData.data[ttt].DIRECTION
      )
      this.info.px = this.table.gpsData.data[ttt].PX
      this.info.py = this.table.gpsData.data[ttt].PY
      this.info.dqlc = this.table.gpsData.data[ttt].MILEAGE
      this.info.zlc = this.table.gpsData.data[
        this.table.gpsData.data.length - 1
      ].MILEAGE
      this.info.time = moment(this.table.gpsData.data[ttt].SPEED_TIME).format(
        'YYYY-MM-DD HH:mm:ss'
      )
      this.info.zt = this.table.gpsData.data[ttt].STATE == 1 ? '重车' : '空车'
      this.dqjd.jindu = ttt
    },
    handleStopClick() {
      this.map.playType = 0
      this.map.playFrame = 0
      this.map.markerMovingControl.restart()
      clearInterval(this.setIntervalgj)
      this.map.markerMovingControl.stop()
      this.dqjd.jindu = 0
    },
    handleQueryClick() {
      console.info('handleQueryClick')
      this.getHistoryList()
    },
    handleVehicleSpeedChange() {
      this.map.markerMovingControl.speed(this.vehicleQuery.speed)
    },
    /**
     * 车辆轨迹播放
     */
    playVehicle() {},
    /**
     * 车辆轨迹暂停
     */
    vehicleTimeout() {},
    /**
     * 停止车辆轨迹
     */
    resetVehiclePosition() {},
    freezeData,
    formatterTDateTime,
    formatterTVehicleType,
    formatterDirectionType,
    formatterTDirectionType,
    getVehi_no() {
      const {vehi_no} = this.$route.params
      if(!vehi_no) return 
      this.vehicleQuery.vehicle = vehi_no
      this.getHistoryList()
    }
  },
  watch: {
    'map.playFrame'(value) {
      if (value) {
        this.dqjd.jindu = value
        this.info.speed = this.table.gpsData.data[value].SPEED
        this.info.fx = this.formatterDirectionType(
          this.table.gpsData.data[value].DIRECTION
        )
        this.info.px = this.table.gpsData.data[value].PX
        this.info.py = this.table.gpsData.data[value].PY
        this.info.dqlc = this.table.gpsData.data[value].MILEAGE
        this.info.zlc = this.table.gpsData.data[
          this.table.gpsData.data.length - 1
        ].MILEAGE
        this.info.time = moment(
          this.table.gpsData.data[value].SPEED_TIME
        ).format('YYYY-MM-DD HH:mm:ss')
        this.info.zt =
          this.table.gpsData.data[value].STATE == 1 ? '重车' : '空车'
        // this.map.markerMovingControl.jingdu(value)
        this.map.markerhistory.setAngle(
          parseInt(this.table.gpsData.data[value].DIRECTION) - 90
        )
        this.map.markerhistory.setPosition(
          new AMap.LngLat(
            this.table.gpsData.data[value].PX,
            this.table.gpsData.data[value].PY
          )
        )
      }
    },
    '$route.path'() {
      this.getVehi_no()
    }
  }
}
</script>

<style lang="scss" scoped>
.tw-calendar {
  // height: 300px;
  // margin-left: -2px;
  // margin-left: -1px;
}
.tw-item {
  padding-top: 4px;
  padding-bottom: 4px;
}
</style>
