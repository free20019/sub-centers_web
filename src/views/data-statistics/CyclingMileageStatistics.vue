<!-- 单车里程统计 -->
<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <t-query-panel :model="query" footer="300">
    <template v-slot:querybar>
      <el-form-item>
        <el-date-picker v-model="query.startTime" type="datetime" placeholder="开始时间"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-date-picker v-model="query.endTime" type="datetime"  placeholder="结束时间"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-select
          class="tw-select"
          v-model="query.vehicle"
          multiple
          filterable
          remote
          reserve-keyword
          :remote-method="handleVehicleQuerySearch"
          collapse-tags
          style="margin-left: 20px;"
          placeholder="车牌号码"
          :no-data-text='select.noDataText'
          @click.native="select.selectedVehicle=[]"
          :loading="select.loading">
          <el-option
            v-for="item in select.selectedVehicle"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="query.vehicleGroupId" filterable clearable  placeholder="请选择车辆组" v-if="loginType==='111111'">
          <el-option
            v-for="item in select.vehicleGroup"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleQueryClick">查询</el-button>
        <el-button type="primary" @click="handleExportClick">导出</el-button>
        <span  style="color: blueviolet;margin-left: 15px;"  @mouseover="table.dataDisabled=1" @mouseleave="table.dataDisabled=0" v-if="table.data.length>0">鼠标悬浮查看车辆里程</span>
      </el-form-item>
    </template>
    <template v-if="table.dataDisabled===1">
        <el-button type="info" size="mini" disabled v-for="item in table.vehicle_mileage">{{item+'公里'}}</el-button>
    </template>
    <t-table-page :data="table.data" :loading="table.display" :page-size="20">
      <el-table-column type="index" label="序号" align="center" width="50" :resizable="false"></el-table-column>
      <el-table-column prop="VEHICLE_NUM" label="车牌号码" align="center" width="120"></el-table-column>
      <el-table-column prop="PX" label="经度" align="center" width="120"></el-table-column>
      <el-table-column prop="PY" label="纬度" align="center" width="120"></el-table-column>
      <el-table-column prop="SPEED" label="速度" align="center" width="120"></el-table-column>
      <el-table-column prop="SPEED_TIME" label="时间" align="center" min-width="240"  :resizable="false"></el-table-column>
      <!--<el-table-column prop="ADDRESS" label="所在位置" align="center" min-width="240" :resizable="false"></el-table-column>-->
    </t-table-page>
  </t-query-panel>
</template>

<script>
  import moment from 'moment'
  import { iconClassName ,baseURL} from 'util'
  import axios from 'axios'
  import _ from 'underscore'

  export default {
    name: 'CyclingMileageStatistics',
    data() {
      return {
        loginType:'',
        query: {
          startTime: '',
          endTime: '',
          vehicle: [],
          vehicleGroupId: '',
        },
        inputVehicle: {
          loading: false,
          option: []
        },
        table: {
          display: false,
          data: [],
          vehicle_mileage: [],
          dataDisabled: 0
        },
        select:{
          vehicle:[],
          selectedVehicle: [],
          noDataText:'请输入三个字符以上',
          loading: false,
          vehicleGroup:[],
        },
      }
    },
    mounted() {
      this.query.startTime = moment(moment().subtract(2, 'hours'));
      this.query.endTime = moment();
      this.loginType=this.$cookies.get('loginType');
      this.getVehicleGroup();
      this.getVehicle();
      // this.findCyclingMileageStatistics();
    },
    methods: {
      iconClassName,
      handleVehicleQuerySearch(query) {
        this.select.selectedVehicle=[];
        this.select.noDataText='请输入三个字符以上'
        if (query.length >= 3){
          this.select.loading = true;
          setTimeout(() => {
            this.select.loading = false;
            this.select.selectedVehicle=_.filter(this.select.vehicle, item => item.value.indexOf(query) > -1)
          }, 200);
          this.select.noDataText='无数据'
        }

      },
      getVehicleGroup(){
        if(this.loginType!=='1') return null;
        axios.get('common/vehicleGroup', {
          baseURL,
          params: {
            userId:this.$cookies.get('userId'),
          }
        }).then(res=> {
          this.select.vehicleGroup = _.map(res.data, item => {
            return {value: item.CLZS, label:item.CLZ_NAME}
          });
        }).catch(function (error) {
        });
      },
      getVehicle(){
        axios.get('common/vehicle', {
          baseURL,
          params: {

          }
        }).then(res=> {
          this.select.vehicle = _.map(res.data, item => {
            return { label:item.VEHICLE_NO,value: item.VEHICLE_NO }
          });
        }).catch(function (error) {
        });
      },
      findCyclingMileageStatistics() {
        // this.query.vehicle=['浙AT2478','浙AT6158'];
        const {startTime, endTime, vehicle, vehicleGroupId} = this.query;
        if(!startTime||!endTime) return this.$message.error('请选择时间！');
        if((startTime&&moment(startTime).format('YYYY-MM'))!==(endTime&&moment(endTime).format('YYYY-MM'))) return this.$message.error('无法跨月查询！');
        if(vehicle.length===0) return this.$message.error("请选择车牌！")
        this.table.display = true;
        this.table.data = [];
        axios.get('dataStatistics/findCyclingMileageStatistics', {
          baseURL,
          params: {
            startTime: startTime && moment(startTime).format('YYYY-MM-DD HH:mm:ss'),
            endTime: endTime && moment(endTime).format('YYYY-MM-DD HH:mm:ss'),
            vehicle:vehicle.toString(),
            vehicleGroupId,
          }
        }).then(res=> {
          this.table.data = res.data.datas||[];
          // alert(res.data.count);
          this.table.vehicle_mileage=res.data.count.split(";");
          this.table.display = false;
        }).catch(function (error) {
          console.log(error);
        });
      },
      /*事件*/
      handleQueryClick() {
        this.findCyclingMileageStatistics();
      },
      handleExportClick() {
        const {startTime, endTime, vehicle, vehicleGroupId} = this.query;
        if(vehicle.length===0) return this.$message.error("请选择车牌！")
        if(!startTime||!endTime) return this.$message.error('请选择时间！');
        if((startTime&&moment(startTime).format('YYYY-MM'))!==(endTime&&moment(endTime).format('YYYY-MM'))) return this.$message.error('无法跨月查询！');
        this.$confirm('是否需要导出?', '提示', {
          confirmButtonText: '是',
          cancelButtonText: '否',
          cancelButtonClass: 'el-button--danger',
          closeOnClickModal: false,
          type: 'info',
          center: true
        }).then(() => {
          window.open(`${baseURL}dataStatistics/findCyclingMileageStatisticsExcel?startTime=${startTime && moment(startTime).format('YYYY-MM-DD HH:mm:ss')}&endTime=${endTime && moment(endTime).format('YYYY-MM-DD HH:mm:ss')}&vehicle=${vehicle.toString()}&vehicleGroupId=${vehicleGroupId}`);
        }).catch(() => {

        });
      }
    }
  }
</script>





<!--&lt;!&ndash; 单车里程统计 &ndash;&gt;-->
<!--<template>-->
  <!--<t-query-panel :model="query" footer="300">-->
    <!--<template v-slot:querybar>-->
      <!--<el-form-item>-->
        <!--<el-date-picker v-model="query.time" type="date" placeholder="时间"></el-date-picker>-->
      <!--</el-form-item>-->
      <!--<el-form-item>-->
        <!--<el-button type="primary" @click="handleQueryClick">查询</el-button>-->
        <!--<el-button type="primary" @click="handleExportClick">导出</el-button>-->
      <!--</el-form-item>-->
    <!--</template>-->
    <!--<t-table-page :data="table.data" :loading="table.display">-->
      <!--<el-table-column prop="message" label="时间" align="center" width="100" :resizable="false"></el-table-column>-->
      <!--<el-table-column prop="y0" label="00:00" align="center" width="70"></el-table-column>-->
      <!--<el-table-column prop="y1" label="01:00" align="center" width="70"></el-table-column>-->
      <!--<el-table-column prop="y2" label="02:00" align="center" width="70"></el-table-column>-->
      <!--<el-table-column prop="y3" label="03:00" align="center" width="70"></el-table-column>-->
      <!--<el-table-column prop="y4" label="04:00" align="center" width="70"></el-table-column>-->
      <!--<el-table-column prop="y5" label="05:00" align="center" width="70"></el-table-column>-->
      <!--<el-table-column prop="y6" label="06:00" align="center" width="70"></el-table-column>-->
      <!--<el-table-column prop="y7" label="07:00" align="center" width="70"></el-table-column>-->
      <!--<el-table-column prop="y8" label="08:00" align="center" width="70"></el-table-column>-->
      <!--<el-table-column prop="y9" label="09:00" align="center" width="70"></el-table-column>-->
      <!--<el-table-column prop="y10" label="10:00" align="center" width="70"></el-table-column>-->
      <!--<el-table-column prop="y11" label="11:00" align="center" width="70"></el-table-column>-->
      <!--<el-table-column prop="y12" label="12:00" align="center" width="70"></el-table-column>-->
      <!--<el-table-column prop="y13" label="13:00" align="center" width="70"></el-table-column>-->
      <!--<el-table-column prop="y14" label="14:00" align="center" width="70"></el-table-column>-->
      <!--<el-table-column prop="y15" label="15:00" align="center" width="70"></el-table-column>-->
      <!--<el-table-column prop="y16" label="16:00" align="center" width="70"></el-table-column>-->
      <!--<el-table-column prop="y17" label="17:00" align="center" width="70"></el-table-column>-->
      <!--<el-table-column prop="y18" label="18:00" align="center" width="70"></el-table-column>-->
      <!--<el-table-column prop="y19" label="19:00" align="center" width="70"></el-table-column>-->
      <!--<el-table-column prop="y20" label="20:00" align="center" width="70"></el-table-column>-->
      <!--<el-table-column prop="y21" label="21:00" align="center" width="70"></el-table-column>-->
      <!--<el-table-column prop="y22" label="22:00" align="center" width="70"></el-table-column>-->
      <!--<el-table-column prop="y23" label="23:00" align="center" min-width="70" :resizable="false"></el-table-column>-->
    <!--</t-table-page>-->
    <!--<template v-slot:footer>-->
      <!--<div id="e-chart" class="tw-chart"></div>-->
    <!--</template>-->
  <!--</t-query-panel>-->
<!--</template>-->

<!--<script>-->
  <!--import moment from 'moment'-->
  <!--import echarts from 'echarts'-->
  <!--import { iconClassName ,baseURL} from 'util'-->
  <!--import axios from 'axios'-->
  <!--import _ from 'underscore'-->
  <!--export default {-->
    <!--name: 'CyclingMileageStatistics',-->
    <!--data() {-->
      <!--return {-->
        <!--query: {-->
          <!--time: '',-->
          <!--field1: 'ACTUAL_LOAD_MILEAGE',-->
          <!--field2: 'ACTUAL_LOAD_MILEAGE',-->
          <!--field3: 'ACTUAL_LOAD_MILEAGE',-->
          <!--module: 'CyclingMileageStatistics',-->
        <!--},-->
        <!--inputVehicle: {-->
          <!--loading: false,-->
          <!--option: []-->
        <!--},-->
        <!--table: {-->
          <!--display: false,-->
          <!--data: []-->
        <!--},-->
        <!--select:{-->
          <!--vehicle:[],-->
        <!--},-->
        <!--chart: {-->
          <!--el: null,-->
          <!--jint: [],-->
          <!--zuo: [],-->
          <!--qiant: [],-->
          <!--shangz: [],-->
          <!--pingj: [],-->
          <!--shangy: [],-->
          <!--shangn: [],-->
          <!--max: [],-->
          <!--min: [],-->
        <!--}-->
      <!--}-->
    <!--},-->
    <!--mounted() {-->
      <!--this.query.time = new Date();-->
      <!--this.findDataStatistics();-->
      <!--this.$nextTick(() => {-->
        <!--this.chart.el = echarts.init(document.getElementById('e-chart'))-->
      <!--})-->
    <!--},-->
    <!--methods: {-->
      <!--iconClassName,-->
      <!--setChart: function(data) {-->
        <!--if (data !== []) {-->
          <!--_.map(data, (item, index) => {-->
            <!--if (index === 0) {-->
              <!--this.chart.jint = this.addContent(item)-->
            <!--} else if (index === 1) {-->
              <!--this.chart.zuot = this.addContent(item)-->
            <!--} else if (index === 2) {-->
              <!--this.chart.qiant = this.addContent(item)-->
            <!--} else if (index === 3) {-->
              <!--this.chart.shangz = this.addContent(item)-->
            <!--} else if (index === 4) {-->
              <!--this.chart.pingj = this.addContent(item)-->
            <!--} else if (index === 5) {-->
              <!--this.chart.max = this.addContent(item)-->
            <!--} else if (index === 6) {-->
              <!--this.chart.min = this.addContent(item)-->
            <!--} else if (index === 7) {-->
              <!--this.chart.shangy = this.addContent(item)-->
            <!--} else if (index === 8) {-->
              <!--this.chart.shangn = this.addContent(item)-->
            <!--}-->
          <!--});-->
        <!--}-->
        <!--this.chart.el.clear();-->
        <!--this.chart.el.setOption({-->
          <!--title : {-->
            <!--text: '',-->
            <!--subtext: ''-->
          <!--},-->
          <!--tooltip : {-->
            <!--trigger: 'axis'-->
          <!--},-->
          <!--legend: {-->
            <!--data:['今天','昨天','前天','上周','上周平均','前半月最大','前半月最小','上月','上年']-->
          <!--},-->
          <!--toolbox: {-->
            <!--show : true,-->
            <!--feature : {-->
              <!--mark : {show: true},-->
              <!--dataView : {show: true, readOnly: false},-->
              <!--magicType : {show: true, type: ['line', 'bar']},-->
              <!--restore : {show: true},-->
              <!--saveAsImage : {show: true}-->
            <!--}-->
          <!--},-->
          <!--grid: {-->
            <!--top: '70px',-->
            <!--left: '50px',-->
            <!--right: '80px',-->
            <!--bottom: '60px'-->
          <!--},-->
          <!--calculable : true,-->
          <!--xAxis : [-->
            <!--{-->
              <!--type : 'category',-->
              <!--boundaryGap : false,-->
              <!--data : ['00:00','01:00', '02:00',-->
                <!--'03:00', '04:00', '05:00', '06:00',-->
                <!--'07:00', '08:00', '09:00', '10:00',-->
                <!--'11:00', '12:00', '13:00', '14:00',-->
                <!--'15:00', '16:00', '17:00', '18:00',-->
                <!--'19:00', '20:00', '21:00', '22:00',-->
                <!--'23:00']-->
            <!--}-->
          <!--],-->
          <!--yAxis : [-->
            <!--{-->
              <!--type : 'value',-->
              <!--axisLabel : {-->
                <!--formatter: '{value}'-->
              <!--}-->
            <!--}-->
          <!--],-->
          <!--series : [-->
            <!--{-->
              <!--name:'今天',-->
              <!--type:'line',-->
              <!--data:this.chart.jint-->
            <!--},{-->
              <!--name:'昨天',-->
              <!--type:'line',-->
              <!--data:this.chart.zuot-->
            <!--},{-->
              <!--name:'前天',-->
              <!--type:'line',-->
              <!--data:this.chart.qiant-->
            <!--},{-->
              <!--name:'上周',-->
              <!--type:'line',-->
              <!--data:this.chart.shangz-->
            <!--},{-->
              <!--name:'上周平均',-->
              <!--type:'line',-->
              <!--data:this.chart.pingj-->
            <!--},{-->
              <!--name:'前半月最大',-->
              <!--type:'line',-->
              <!--data:this.chart.max-->
            <!--},{-->
              <!--name:'前半月最小',-->
              <!--type:'line',-->
              <!--data:this.chart.min-->
            <!--},{-->
              <!--name:'上月',-->
              <!--type:'line',-->
              <!--data:this.chart.shangy-->
            <!--},{-->
              <!--name:'上年',-->
              <!--type:'line',-->
              <!--data:this.chart.shangn-->
            <!--}-->
          <!--]-->
        <!--})-->
      <!--},-->
      <!--//将map转为list-->
      <!--addContent(list){-->
        <!--let arr=[];-->
        <!--for(let i=0;i<24;i++){-->
          <!--if(list['y'+i]!=null){-->
            <!--arr.push(list['y'+i]);-->
          <!--}-->
        <!--}-->
        <!--return arr;-->
      <!--},-->
      <!--findDataStatistics() {-->
        <!--const {time, field1, field2, field3, module} = this.query;-->
        <!--if(!time) return this.$message.error("请选择时间！")-->
        <!--this.table.display = true;-->
        <!--axios.get('dataStatistics/findDataStatistics', {-->
          <!--baseURL,-->
          <!--params: {-->
            <!--time: time && moment(time).format('YYYY-MM-DD'),-->
            <!--field1,-->
            <!--field2,-->
            <!--field3,-->
            <!--module-->
          <!--}-->
        <!--}).then(res=> {-->
          <!--this.table.data = res.data||[];-->
          <!--this.setChart(res.data||[]);-->
          <!--this.table.display = false;-->
        <!--}).catch(function (error) {-->
          <!--console.log(error);-->
        <!--});-->
      <!--},-->
      <!--/*事件*/-->
      <!--handleQueryClick() {-->
        <!--this.findDataStatistics();-->
      <!--},-->
      <!--handleExportClick() {-->
        <!--const {time, field1, field2, field3, module} = this.query;-->
        <!--if(!time) return this.$message.error("请选择时间！")-->
        <!--this.$confirm('是否需要导出?', '提示', {-->
          <!--confirmButtonText: '是',-->
          <!--cancelButtonText: '否',-->
          <!--cancelButtonClass: 'el-button&#45;&#45;danger',-->
          <!--closeOnClickModal: false,-->
          <!--type: 'info',-->
          <!--center: true-->
        <!--}).then(() => {-->
          <!--window.open(`${baseURL}dataStatistics/findDataStatisticsExcel?time=${time && moment(time).format('YYYY-MM-DD')}&field1=${field1}&field2=${field2}&field3=${field3}&module=${module}`);-->
        <!--}).catch(() => {-->

        <!--});-->
      <!--}-->
    <!--}-->
  <!--}-->
<!--</script>-->


