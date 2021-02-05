<!-- 电子围栏管理 -->
<template>
  <t-layout footer="300">
    <div id="baidu-map" class="tw-map-panel"></div>
    <template v-slot:footer>
      <t-query-panel>
        <template v-slot:querybar>
          <el-form-item>
            <el-button type="primary" @click="handleAddAreaClick">添加区域</el-button>
          </el-form-item>
        </template>
        <t-table-page :data="table.data">
          <el-table-column type="index" label="序号" width="50" align="center" :resizable="false"></el-table-column>
          <el-table-column
            prop="NAME"
            label="区域名称"
            width="200"
            align="center"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column prop="AREA_SIZE" label="区域面积（平方米）" width="240" align="center"></el-table-column>
          <el-table-column prop="SPEED" label="区域限速" width="120" align="center"></el-table-column>
          <el-table-column prop="OUT_IN" label="报警类型" width="120" align="center" :formatter="formatterOutIn"></el-table-column>
          <el-table-column prop="TELEPHONE" label="报警电话" width="120" align="center"></el-table-column>
          <el-table-column prop="CARS" label="设置车辆" width="400" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column label="操作" min-width="90" align="center" :resizable="false">
            <template v-slot="data">
              <el-button
                type="text"
                size="mini"
                icon="el-icon-map-location"
                @click="handerTableAreaClick(data.row)"
              ></el-button>
              <el-button
                type="text"
                size="mini"
                icon="el-icon-edit"
                @click="handerTableEditClick(data.row)"
              ></el-button>
              <el-button
                type="text"
                size="mini"
                icon="el-icon-delete"
                @click="handerTableDeleteClick(data.row.ID)"
              ></el-button>
            </template>
          </el-table-column>
        </t-table-page>
      </t-query-panel>
    </template>
    <el-dialog
      :title="dialog.title"
      :visible.sync="dialog.display"
      :close-on-click-modal="false"
      width="500px"
      @closed="handleDialogClosed"
    >
      <el-form class="tw-form" :model="dialog.form" label-width="80px">
        <el-form-item label="区域名称">
          <el-input v-model="dialog.form.name"></el-input>
        </el-form-item>
        <el-form-item label="区域面积（平方米）">
          <el-input :value="formatterArea" readonly></el-input>
        </el-form-item>
        <el-form-item label="区域坐标">
          <el-input :value="formatterCoordinate" type="textarea" rows="1" readonly></el-input>
        </el-form-item>
        <el-form-item label="区域限速">
          <el-input v-model="dialog.form.speed"></el-input>
        </el-form-item>
        <el-form-item label="报警类型">
          <el-select class="tw-block" v-model="dialog.form.out_in">
            <el-option
              v-for="item in alarmType"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="报警电话">
          <el-input v-model="dialog.form.telephone"></el-input>
        </el-form-item>
        <el-form-item label="设置车辆">
          <el-tree
            style="height: 200px"
            v-scrollbar
            class="tw-tree"
            :data="companyList"
            node-key="value"
            :filter-node-method="filterNode"
            ref="tree"
            show-checkbox
            highlight-current
          ></el-tree>
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
  import _ from 'underscore'
  import AMap from 'AMap'
  import { baseURL } from 'util'

  export default {
    name: 'ElectronicFenceManage',
    data() {
      return {
        map: {
          bmap: null,
          mouseTool: null,
          infoWindow:null,
          styleOptions: {
            strokeColor: 'red',
            fillColor: 'red',
            strokeWeight: 3,
            strokeOpacity: 0.8,
            fillOpacity: 0.6,
            strokeStyle: 'solid'
          },
          polygon: null,
          areaPolygon: null
        },
        table: {
          data: []
        },
        dialog: {
          display: false,
          loading: false,
          title: '',
          form: {
            name: '',
            area_size: '',
            speed: '',
            telephone: '',
            cars: '',
            area: '',
            out_in: '0',
            id: ''
          }
        },
        alarmType: [
          { value: '0', label: '区域进出报警' },
          { value: '1', label: '区域动车报警' },
          { value: '2', label: '暂时不用' }
        ],
        companyList: []
      }
    },
    mounted() {
      this.map.bmap = new AMap.Map('baidu-map', {
        resizeEnable: true, //是否监控地图容器尺寸变化
        zoom: 12
      })
      this.handleGetArea()
      this.getCompanyVehicleTree()
    },
    computed: {
      formatterArea() {
        return `${this.dialog.form.area_size || 0}平方米`
      },
      formatterCoordinate() {
        const { area } = this.dialog.form
        return (area && area.replace(/;/g, ';\r\n')) || ''
      }
    },
    methods: {
      formatterOutIn(row, col, value){
        let label = ''
        _.map(this.alarmType, item =>{
          if(item.value.toString() === value){
            label = item.label
          }
        })
        return label
      },
      /**对树节点进行筛选时执行的方法，返回 true 表示这个节点可以显示，返回 false 则表示这个节点会被隐藏**/
      filterNode(value, data) {
        if (!value) return true
        return data.label.indexOf(value) !== -1
      },
      /**获取公司树结构**/
      getCompanyVehicleTree() {
        axios.get('areaAlarm/getCompanyVehicleTree', { baseURL }).then(res => {
          this.companyList = Object.freeze(res.data) || []
        })
      },
      handleGetArea() {
        axios.get('areaAlarm/findAreaSetting' ,{baseURL}).then(res =>{
          this.map.bmap.clearMap()
          this.table.data = res.data
          _.map(res.data, item =>{
            this.displayPolygon(item.AREA,item.NAME)
          })
        })
      },
      displayPolygon(path,name) {
        let p = path.split(';')
        let path1 = [];
        let p1 = [];
        _.map(p, item =>{
          path1 = []
          if(item.length>5){
            path1.push(item.split(',')[0],item.split(',')[1])
            p1.push(path1)
          }
        })
        let polygon = new AMap.Polygon({
          path: p1,
          strokeColor: "#409eff",
          strokeWeight: 1,
          strokeOpacity: 0.2,
          fillOpacity: 0.6,
          fillColor: '#076cd0',
          zIndex: 50,
        })

        this.map.bmap.add(polygon)
        polygon.on('click', () =>{
          let info = [];
          info.push(name);
          this.map.infoWindow = new AMap.InfoWindow({
            content: info.join("")  //使用默认信息窗体框样式，显示信息内容
          });

          this.map.infoWindow.open(this.map.bmap, [p[0].split(',')[0],p[0].split(',')[1]]);
        })
        // 缩放地图到合适的视野级别
        this.map.bmap.setFitView()
      },
      handleAddAreaClick() {
        this.map.mouseTool = new AMap.MouseTool(this.map.bmap)
        this.map.mouseTool.polygon({
          fillColor:'#00b0ff',
          strokeColor:'#80d8ff'
          //同Polygon的Option设置
        });
        this.map.mouseTool.on('draw',(e) =>{
          let jwd = ''
          _.map(e.obj.getPath(), item=>{
            jwd += item.lng+','+item.lat+';'
          })
          this.dialog.title = '添加区域'
          this.dialog.form.area = jwd.substring(0,jwd.length-1)
          this.dialog.form.area_size = e.obj.getArea()
          this.dialog.display = true
        })
      },
      handerTableAreaClick(item) {
        var info = [];
        info.push(item.NAME);
        this.map.infoWindow = new AMap.InfoWindow({
          content: info.join("")  //使用默认信息窗体框样式，显示信息内容
        });
        this.map.infoWindow.open(this.map.bmap, [item.AREA.split(';')[0].split(',')[0],item.AREA.split(';')[0].split(',')[1]]);
        this.map.bmap.setCenter([item.AREA.split(';')[0].split(',')[0],item.AREA.split(';')[0].split(',')[1]])
      },
      handerTableEditClick(item) {
        this.dialog.display = true
        this.dialog.title = '修改区域'
        this.dialog.form.name = item.NAME
        this.dialog.form.area = item.AREA
        this.dialog.form.area_size = item.AREA_SIZE
        this.dialog.form.speed = item.SPEED
        this.dialog.form.telephone = item.TELEPHONE
        this.dialog.form.out_in =  item.OUT_IN
        if(this.companyList.length===0){
          setTimeout(()=>{
            this.dialog.form.cars = this.$refs.tree.setCheckedKeys(item.CARS.split(','))
          },500)
        }else{
          this.dialog.form.cars = this.$refs.tree.setCheckedKeys(item.CARS.split(','))
        }
        this.dialog.form.id = item.ID
      },
      handerTableDeleteClick(id) {
        this.$confirm('此操作将永久删除该区域, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let params = new URLSearchParams()
          params.append('id', id)
          axios.post('areaAlarm/deleteAreaSetting', params, { baseURL }).then(res => {
            if (res.data > 0) {
              this.$message({ message: '操作成功!', type: 'success' })
              this.handleGetArea()
            } else if (res.data === 0) {
              this.$message.error('操作失败！')
            } else if (res.data === -1) {
            }
          })
        }).catch(() => {
        });
      },
      handleDialogClosed() {
        if(this.map.mouseTool) this.map.mouseTool.close(true)
        this.dialog.title = ''
        this.dialog.form.name = ''
        this.dialog.form.area =''
        this.dialog.form.area_size = ''
        this.dialog.form.speed = ''
        this.dialog.form.telephone = ''
        this.dialog.form.out_in =  '0'
        this.dialog.form.cars = this.$refs.tree.setCheckedKeys([])
        this.dialog.form.id = ''
      },
      handleDialogCancel() {
        this.dialog.display = false
      },
      handleDialogSubmit() {
        this.dialog.form.cars = this.$refs.tree.getCheckedKeys(true).toString()
        let params = new URLSearchParams()
        params.append('name', this.dialog.form.name)
        params.append('area_size', this.dialog.form.area_size)
        params.append('speed', this.dialog.form.speed)
        params.append('telephone', this.dialog.form.telephone)
        params.append('cars', this.dialog.form.cars)
        params.append('area', this.dialog.form.area)
        params.append('out_in', this.dialog.form.out_in)
        if(this.dialog.title === '添加区域') {
          axios.post('areaAlarm/addAreaSetting', params, { baseURL }).then(res => {
            if (res.data > 0) {
              this.$message({ message: '操作成功!', type: 'success' })
              this.dialog.display = false
              this.handleGetArea()
            } else if (res.data === 0) {
              this.$message.error('操作失败！')
            } else if (res.data === -1) {
            }
          })
        }else{
          params.append('id', this.dialog.form.id)
          axios.post('areaAlarm/updateAreaSetting', params, { baseURL }).then(res => {
            if (res.data > 0) {
              this.$message({ message: '操作成功!', type: 'success' })
              this.dialog.display = false
              this.handleGetArea()
            } else if (res.data === 0) {
              this.$message.error('操作失败！')
            } else if (res.data === -1) {
            }
          })
        }

      }
    }
  }
</script>

