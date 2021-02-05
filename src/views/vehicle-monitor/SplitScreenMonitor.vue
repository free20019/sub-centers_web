<!-- 分屏监控 -->
<template>
  <t-layout border>
    <template v-slot:left>
      <real-time-monitor-vehicle-panel :vhic.sync="vhicinfo"></real-time-monitor-vehicle-panel>
    </template>
    <t-layout>
      <t-grid-layout margin="5" style="padding: 10px;">
        <div id="baidu-map-1" class="tw-panel tw-map-panel" :class="{action: isMapAction(1)}" @click="mapActionClick(1)">
          <div class="tw-map-tool-bar" @click="clearMap(1)">
            <el-tooltip class="tw-map-tool-item" content="清除" placement="bottom">
              <i class="el-icon-delete" style="padding: 4px 4px 3px 4px;"></i>
            </el-tooltip>
          </div>
        </div>
        <div id="baidu-map-2" class="tw-panel tw-map-panel" :class="{action: isMapAction(2)}" @click="mapActionClick(2)">
          <div class="tw-map-tool-bar" @click="clearMap(2)">
            <el-tooltip class="tw-map-tool-item" content="清除" placement="bottom">
              <i class="el-icon-delete" style="padding: 4px 4px 3px 4px;"></i>
            </el-tooltip>
          </div>
        </div>
        <div id="baidu-map-3" class="tw-panel tw-map-panel" :class="{action: isMapAction(3)}" @click="mapActionClick(3)">
          <div class="tw-map-tool-bar" @click="clearMap(3)">
            <el-tooltip class="tw-map-tool-item" content="清除" placement="bottom">
              <i class="el-icon-delete" style="padding: 4px 4px 3px 4px;"></i>
            </el-tooltip>
          </div>
        </div>
        <div id="baidu-map-4" class="tw-panel tw-map-panel" :class="{action: isMapAction(4)}" @click="mapActionClick(4)">
          <div class="tw-map-tool-bar" @click="clearMap(4)">
            <el-tooltip class="tw-map-tool-item" content="清除" placement="bottom">
              <i class="el-icon-delete" style="padding: 4px 4px 3px 4px;"></i>
            </el-tooltip>
          </div>
        </div>
      </t-grid-layout>
    </t-layout>
  </t-layout>
</template>

<script>
  import axios from 'axios'
import RealTimeMonitorVehiclePanel from 'components/RealTimeMonitorVehiclePanel'
import AMap from 'AMap';
  import { baseURL } from 'util'
  import $ from 'jquery'
  import _ from 'underscore'
  import moment from 'moment'
  import  lxImg from 'images/xhcar/l3.png'
  import  zcImg from 'images/xhcar/z3.png'
  import  kcImg from 'images/xhcar/k3.png'
export default {
  name: 'SplitScreenMonitor',
  data() {
    return {
      map: {
        select: 1,
        map1:null,
        map2:null,
        map3:null,
        map4:null,
        mapvhic1: '',
        mapvhic2: '',
        mapvhic3: '',
        mapvhic4: '',
        jwd1: '',
        jwd2: '',
        jwd3: '',
        jwd4: '',
        setinterval1:null,
        mar1: [],
        mar2: [],
        mar3: [],
        mar4: []
      },
      vhicinfo:[],
      geocoder : new AMap.Geocoder({
        city: "010", //城市设为北京，默认：“全国”
        radius: 1000 //范围，默认：500
      })
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.map.map1 = new AMap.Map('baidu-map-1', {
        resizeEnable: true, //是否监控地图容器尺寸变化
        zoom: 12
      });
      this.map.map2 = new AMap.Map('baidu-map-2', {
        resizeEnable: true, //是否监控地图容器尺寸变化
        zoom: 12
      });
      this.map.map3 = new AMap.Map('baidu-map-3', {
        resizeEnable: true, //是否监控地图容器尺寸变化
        zoom: 12
      });
      this.map.map4 = new AMap.Map('baidu-map-4', {
        resizeEnable: true, //是否监控地图容器尺寸变化
        zoom: 12
      });
    })
  },
  methods: {
    stime(date) {
      return moment(date).format('YYYY-MM-DD HH:mm:ss')
    },
    /**清除地图上的点**/
    clearMap(value) {
      let mapvhic = 'mapvhic' + value;
      this.map[mapvhic] = '';
      let jwd = 'jwd' + value;
      this.map[jwd] = '';
      let map = 'map' + value;
      this.map[map].clearMap()
      let mar = 'mar' + value
      this.map[mar] = []
    },
    isMapAction(index) {
      return this.map.select === index;
    },
    mapActionClick(index) {
      this.map.select = index;
    },
    getSplitScreenMonitor(vhic) {
      if(this.$route.path != '/cljk/fpjk') return
      let mapvhic = 'mapvhic' + this.map.select;
      this.map[mapvhic] = vhic;
      let jwd = 'jwd' + this.map.select;
      this.map[jwd] = '';
      let map = 'map' + this.map.select;
      let params = new URLSearchParams();
      params.append('type','1')
      params.append('vhic',vhic)
      axios.post('map/getOneVhic', params ,{baseURL}).then(res =>{
        this.map[map].clearMap();
        clearInterval(this.map.setinterval1);
        this.map[map].setCenter([res.data[0].PX, res.data[0].PY]);
        this.addmar(res.data[0],this.map[map],this.map.select)
        this.addText(res.data[0],this.map[map],this.map.select)
        this.map[jwd] = res.data[0].PX+','+res.data[0].PY;
        this.map.setinterval1 = setInterval(this.vehicleTimer, 30000)
      })
    },
    vehicleTimer() {
      let vhic = '';
      if(this.map.mapvhic1 != '') vhic += "'" + this.map.mapvhic1 + "',"
      if(this.map.mapvhic2 != '') vhic += "'" + this.map.mapvhic2 + "',"
      if(this.map.mapvhic3 != '') vhic += "'" + this.map.mapvhic3 + "',"
      if(this.map.mapvhic4 != '') vhic += "'" + this.map.mapvhic4 + "',"
      vhic = vhic.substring(0,vhic.length-1)
      if(vhic.length <3) {
        if(this.map.setinterval1) clearInterval(this.map.setinterval1)
        return
      }
      let params = new URLSearchParams();
      params.append('type','2')
      params.append('vhic',vhic)
      axios.post('map/getOneVhic', params ,{baseURL}).then(res =>{
        _.map(res.data,item =>{
          if(item.VEHI_NO == this.map.mapvhic1){
            this.mapUtil(this.map.map1,this.map.mar1,this.map.jwd1,item,1)
          }else if(item.VEHI_NO == this.map.mapvhic2){
            this.mapUtil(this.map.map2,this.map.mar2,this.map.jwd2,item,2)
          }else if(item.VEHI_NO == this.map.mapvhic3){
            this.mapUtil(this.map.map3,this.map.mar3,this.map.jwd3,item,3)
          }else if(item.VEHI_NO == this.map.mapvhic4){
            this.mapUtil(this.map.map4,this.map.mar4,this.map.jwd4,item,4)
          }
        })
      })
    },
    mapUtil(map,mar,jwd,item,index){
      map.remove(mar);
      let m = 'mar'+index
      this.map[m] = [];
      map.setCenter([item.PX, item.PY]);
      this.addmar(item,map,index);
      this.addText(item,map,index);
      let j = 'jwd'+index
      let path = [
        [this.map[j].split(',')[0],this.map[j].split(',')[1]],
        [item.PX,item.PY]
      ]
      this.addLine(path,map)
      this.map[j] = item.PX+','+item.PY;
    },
    addmar(item,map,index) {
      let mar = 'mar' + index;
      let icon = '';
      if(item.TYPE == '1') icon = lxImg
      else{
        if(item.state == '1') icon = zcImg
        else icon = kcImg
      }
      let marker = new AMap.Marker({
        position: [item.PX, item.PY],
        map: map,
        icon: icon,
        offset: new AMap.Pixel(-16, -16),
        angle: item.ANGLE,
      });
      this.map[mar].push(marker)
      AMap.event.addListener(marker,"click",e => {
        this.markerClick(item,map)
      });
    },
    addLine(path,map) {
      let line = new AMap.Polyline({
        path:path,
        showDir:true,
        strokeColor: "#28F",  //线颜色
        // strokeOpacity: 1,     //线透明度
        strokeWeight: 6,      //线宽
        // strokeStyle: "solid"  //线样式
      });
      line.setMap(map)
    },
    markerMouseout() {
      javascript: this.infoWindow.close()
    },
    getAddress(item) {
      // let address = '';
      this.geocoder.getAddress([item.PX,item.PY], (status, result) =>{
        if (status === 'complete'&&result.regeocode) {
          let set = setInterval(()=>{
            if($('#multaddress')){
              clearInterval(set)
              $('#multaddress').text(result.regeocode.formattedAddress)
            }
          },100)
        }else{
          $('#multaddress').text('无')
        }
      })
      // return address;
    },
    createInfoWindowHtml(item) {
      let _this = this;
      var title = $('<span>')
        .addClass('tw-title')
        .text(item.VEHI_NO+(item.CARSTATE == '0'?'(精确)':'(非精确)'))
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
      const type = item.MDT_SUB_TYPE || ''
      const address = item.ADDRESS || ''
      const stime = _this.stime(item.STIME) || ''
      return $('<div>')
        .addClass('tw-map-window')
        .html([
          $('<div>')
            .addClass('tw-map-window-header')
            .html([title, close]),
          $('<div>')
            .addClass('tw-map-window-body')
            .css({width:'250px'})
            .html([
              `<div class="el-row"><div class="el-col el-col-8 tw-align-right">公司名称：</div><div class="el-col el-col-16">${compName}</div></div>`,
              `<div class="el-row"><div class="el-col el-col-8 tw-align-right">终端编号：</div><div class="el-col el-col-16">${mdtNo}</div></div>`,
              `<div class="el-row"><div class="el-col el-col-8 tw-align-right">SIM卡号：</div><div class="el-col el-col-16">${phoneNum}</div></div>`,
              `<div class="el-row"><div class="el-col el-col-8 tw-align-right">GPS速度：</div><div class="el-col el-col-16">${speed}</div></div>`,
              `<div class="el-row"><div class="el-col el-col-8 tw-align-right">终端类型：</div><div class="el-col el-col-16">${type}</div></div>`,
              `<div class="el-row"><div class="el-col el-col-8 tw-align-right">定位时间：</div><div class="el-col el-col-16">${stime}</div></div>`,
              `<div class="el-row"><div class="el-col el-col-8 tw-align-right">当前地址：</div><div class="el-col el-col-16">${address}</div></div>`
            ])
        ])
    },
    addText(item,map,index) {
      let mar = 'mar' + index;
      let text1 = new AMap.Text({
        text:item.VEHI_NO,
        anchor:'bottom-center', // 设置文本标记锚点
        cursor:'pointer',
        offset: new AMap.Pixel(5, 30),
        style:{
          // 'padding': '.75rem 1.25rem',
          // 'margin-bottom': '1rem',
          'border-radius': '.25rem',
          'background-color': 'white',
          'width': '6em',
          'border-width': 0,
          'box-shadow': '0 2px 6px 0 rgba(114, 124, 245, .5)',
          'text-align': 'center',
          'font-size': '10px',
          'font-weight':'bold ',
          'color': 'blue'
        },
        position: [item.PX,item.PY]
      });
      text1.setMap(map);
      this.map[mar].push(text1)
    },
    markerClick(item,map) {
      const newMapWindow = item => {
        this.infoWindow = new AMap.InfoWindow({
          isCustom: true, //使用自定义窗体
          content: this.createInfoWindowHtml(item)[0],
          offset: new AMap.Pixel(0, -20),
          autoMove: true,
          closeWhenClickMap: true
        })
        this.infoWindow.open(map, [item.PX, item.PY])
      }
      this.geocoder.getAddress([item.PX, item.PY], (status, res) => {
        if (status === 'complete' && res.regeocode)
          item.ADDRESS = res.regeocode.formattedAddress
        else log.error('根据经纬度查询地址失败')
        newMapWindow(item)
      })
      newMapWindow(item)
      map.setCenter([item.PX, item.PY]);
    }
  },
  components: {
    RealTimeMonitorVehiclePanel
  },
  watch: {
    'vhicinfo'(value) {
      this.getSplitScreenMonitor(value[0].VEHI_NO)
    }
  },
  destroyed() {
    if(this.map.setinterval1) clearInterval(this.map.setinterval1);
  }
}
</script>
