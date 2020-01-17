<!-- 区域管理 -->
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
            prop="AREA_NAME"
            label="区域名称"
            width="200"
            align="center"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="AREA_DESCRIBE"
            label="区域描述"
            min-width="280"
            header-align="center"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column prop="AREA_SIZE" label="区域面积" width="140" align="center"></el-table-column>
          <el-table-column prop="YJS" label="区域预报警数" width="120" align="center"></el-table-column>
          <el-table-column label="操作" width="90" align="center" :resizable="false">
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
        <el-form-item label="区域描述">
          <el-input v-model="dialog.form.description" type="textarea" rows="4"></el-input>
        </el-form-item>
        <!--<el-form-item label="用途">-->
          <!--<el-select class="tw-block" v-model="dialog.form.use">-->
            <!--<el-option-->
              <!--v-for="item in useOptions"-->
              <!--:key="item.value"-->
              <!--:label="item.label"-->
              <!--:value="item.value"-->
            <!--&gt;</el-option>-->
          <!--</el-select>-->
        <!--</el-form-item>-->
        <el-form-item label="区域面积">
          <el-input :value="formatterArea" readonly></el-input>
        </el-form-item>
        <el-form-item label="区域坐标">
          <el-input :value="formatterCoordinate" type="textarea" rows="4" readonly></el-input>
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
  name: 'RegionalManage',
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
          description: '',
          use: '',
          area: '',
          coordinate: '',
          id: ''
        }
      },
      useOptions: [
        { value: 1, label: '重点区域监控' },
        { value: 2, label: '电子围栏' },
        { value: 3, label: '场站' },
        { value: 4, label: '其他' }
      ]
    }
  },
  mounted() {
    this.map.bmap = new AMap.Map('baidu-map', {
      resizeEnable: true, //是否监控地图容器尺寸变化
      zoom: 12
    })
    this.handleGetArea()
  },
  computed: {
    formatterArea() {
      return `${this.dialog.form.area || 0}平方米`
    },
    formatterCoordinate() {
      const { coordinate } = this.dialog.form
      return (coordinate && coordinate.replace(/;/g, ';\r\n')) || ''
    }
  },
  methods: {
    handleGetArea() {
      axios.get('map/getArea' ,{baseURL}).then(res =>{
        this.map.bmap.clearMap()
        this.table.data = res.data
        _.map(res.data, item =>{
          this.displayPolygon(item.AREA_COORDINATES,item.AREA_NAME)
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
        var info = [];
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
        this.dialog.form.coordinate = jwd.substring(0,jwd.length-1)
        this.dialog.form.area = e.obj.getArea()
        this.dialog.display = true
      })
    },
    handerTableAreaClick(item) {
      var info = [];
      info.push(item.AREA_NAME);
      this.map.infoWindow = new AMap.InfoWindow({
        content: info.join("")  //使用默认信息窗体框样式，显示信息内容
      });
      this.map.infoWindow.open(this.map.bmap, [item.AREA_COORDINATES.split(';')[0].split(',')[0],item.AREA_COORDINATES.split(';')[0].split(',')[1]]);
      this.map.bmap.setCenter([item.AREA_COORDINATES.split(';')[0].split(',')[0],item.AREA_COORDINATES.split(';')[0].split(',')[1]])
    },
    handerTableEditClick(item) {
      this.dialog.display = true
      this.dialog.title = '修改区域'
      this.dialog.form.name = item.AREA_NAME
      this.dialog.form.description = item.AREA_DESCRIBE
      // this.dialog.form.use = item.use
      // this.dialog.form.number = item.number
      this.dialog.form.area = item.AREA_SIZE
      this.dialog.form.coordinate = item.AREA_COORDINATES
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
        axios.post('map/delArea', params, { baseURL }).then(res => {
          this.$message(res.data.info);
          this.handleGetArea()
        })
      }).catch(() => {
      });
    },
    handleDialogClosed() {
      if(this.map.mouseTool) this.map.mouseTool.close(true)
      this.dialog.title = ''
      this.dialog.form.name = ''
      this.dialog.form.description = ''
      this.dialog.form.use = ''
      this.dialog.form.area = ''
      this.dialog.form.coordinate = ''
    },
    handleDialogCancel() {
      this.dialog.display = false
    },
    handleDialogSubmit() {
      let params = new URLSearchParams()
      params.append('name', this.dialog.form.name)
      params.append('ms', this.dialog.form.description)
      params.append('size', this.dialog.form.area)
      params.append('jwd', this.dialog.form.coordinate)
      if(this.dialog.title == '添加区域') {
        axios.post('map/addArea', params, { baseURL }).then(res => {
          this.$message(res.data.info);
          this.dialog.display = false
          this.handleGetArea()
        })
      }else{
        params.append('id', this.dialog.form.id)
        axios.post('map/editArea', params, { baseURL }).then(res => {
          this.$message(res.data.info);
          this.dialog.display = false
          this.handleGetArea()
        })
      }

    }
  }
}
</script>
