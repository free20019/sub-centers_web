<!-- 用户管理 -->
<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <t-query-panel footer="300">
    <template v-slot:querybar>
      <el-form-item>
        <el-button type="primary" @click="handleExportClick">导出</el-button>
        <el-button type="primary" @click="handleTableAddClick">添加</el-button>
      </el-form-item>
    </template>
    <t-table-page :data="table.data" :loading="table.display" :page-size="20">
      <el-table-column type="index" label="序号" align="center" width="50" :resizable="false"></el-table-column>
      <el-table-column prop="REAL_NAME" label="姓名" align="center" width="240"></el-table-column>
      <el-table-column prop="STATION_NAME" label="页面权限" align="center" width="200"></el-table-column>
      <el-table-column prop="USERNAME" label="用户名" align="center" width="100"></el-table-column>
      <el-table-column
        prop="CLZM"
        label="车辆组"
        :show-overflow-tooltip="true"
        align="center"
        min-width="160"
        :resizable="false"
      ></el-table-column>
      <el-table-column :resizable="false" width="100" align="center">
        <!--<template slot="header">-->
          <!--<el-button size="mini" icon="el-icon-plus" @click="handleTableAddClick"></el-button>-->
        <!--</template>-->
        <template slot-scope="scope">
          <el-button
            size="mini"
            icon="el-icon-edit"
            type="text"
            @click="handleTableEditClick(scope.row)"
          ></el-button>
          <el-button
            size="mini"
            icon="el-icon-delete"
            type="text"
            @click="handleTableDeleteClick(scope.row)"
          ></el-button>
        </template>
      </el-table-column>
    </t-table-page>
    <el-dialog
      :title="dialog.title"
      :visible.sync="dialog.display"
      width="700px"
      @closed="handleDialogClosed"
    >
      <el-form
        ref="form"
        :model="dialog.form"
        size="small"
        label-width="100px"
        label-position="right"
      >
        <el-form-item label="姓名">
          <el-input v-model="dialog.form.real_name" placeholder="姓名"></el-input>
        </el-form-item>
        <el-form-item label="用户名">
          <el-input v-model="dialog.form.username" placeholder="用户名"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input
            type="password"
            v-model="dialog.form.password"
            placeholder="密码"
          ></el-input>
        </el-form-item>
        <el-form-item label="岗位">
          <el-select v-model="dialog.form.station" clearable placeholder="岗位" style="width: 560px">
            <el-option
              v-for="item in select.station"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="车辆组">
          <el-select v-model="dialog.form.clzm" clearable placeholder="岗位" style="width: 560px" multiple>
            <el-option
              v-for="item in groupData"
              :key="item.ID"
              :label="item.CLZ_NAME"
              :value="item.ID"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="地图中心点">
          <el-select v-model="dialog.form.center" placeholder="地图中心点" style="width: 560px;">
            <el-option
              v-for="item in center"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialog.display = false">取 消</el-button>
        <el-button type="primary" @click="handleDialogSaveClick">提 交</el-button>
      </div>
    </el-dialog>
  </t-query-panel>
</template>

<script>
import { iconClassName, baseURL } from 'util'
import axios from 'axios'
import _ from 'underscore'
export default {
  name: 'UserManage',
  data() {
    return {
      inputVehicle: {
        loading: false,
        option: []
      },
      table: {
        display: false,
        selectItem: [],
        data: [],
        all: []
      },
      select: {
        station: []
      },
      groupData: [],
      dialog: {
        title: '',
        display: false,
        form: {
          real_name: '',
          username: '',
          password: '',
          station: '',
          clzm:[],
          id: '',
          center: '120.19323,30.273969'
        }
      },
      center:[{
          value: '120.19323,30.273969', 
          label: '主城区'
        },{
          value: '120.321289,30.404195',
          label: '余杭区'
        },{
          value: '120.292808,30.160695',
          label: '萧山区'
        }, {
          value: '119.710775,30.225034',
          label: '临安区'
        }, {
          value: '119.931332,30.060479',
          label: '富阳区'
        }, {
          value: '119.071183,29.610557',
          label: '淳安区'
        }, {
          value: '119.291417,29.479555',
          label: '建德市'
        }, {
          value: '120.89942,29.507935',
          label: '新昌县'
        }]
    }
  },
  mounted() {
    this.findUserManage()
    this.getStation()
    this.getVhicGroup()
  },
  methods: {
    iconClassName,
    getStation() {
      axios
        .get('common/station', {
          baseURL,
          params: {}
        })
        .then(res => {
          this.select.station = _.map(res.data, item => {
            return {
              label: item.STATION_NAME,
              value: item.ID
            }
          })
        })
        .catch(function(error) {
          console.log(error);
        })
    },
    getVhicGroup() {
      let params = new URLSearchParams()
      params.append('name', '')
      axios.post('map/finddlclzb', params, { baseURL }).then(res => {
        this.groupData = res.data || []
      })
    },
    findUserManage() {
      this.table.display = true
      let params = new URLSearchParams()
      params.append('gjz', '')
      axios.post('map/finddlclzzhb', params, { baseURL }).then(res => {
            this.table.data = res.data || []
            this.table.all = res.data || []
            this.table.display = false
      })
    },
    addUserManage() {
      let params = new URLSearchParams()
      params.append('USERNAME', this.dialog.form.username)
      params.append('PASSWORD', this.dialog.form.password)
      params.append('REALNAME', this.dialog.form.real_name)
      params.append('CLZM', this.dialog.form.clzm)
      params.append('STATION_ID', this.dialog.form.station)
      params.append('CENTER', this.dialog.form.center)
      axios.post('map/adddlclzzhb', params, { baseURL }).then(res => {
        this.dialog.display = false
        this.$message(res.data.info);
        this.findUserManage()
      })
    },
    updateUserManage() {
      let params = new URLSearchParams()
      params.append('USERNAME', this.dialog.form.username)
      params.append('PASSWORD', this.dialog.form.password)
      params.append('REALNAME', this.dialog.form.real_name)
      params.append('CLZM', this.dialog.form.clzm)
      params.append('STATION_ID', this.dialog.form.station)
      params.append('ID', this.dialog.form.id)
      params.append('CENTER', this.dialog.form.center)
      console.log(this.dialog.form.clzm)
      axios.post('map/editdlclzzhb', params, { baseURL }).then(res => {
        this.dialog.display = false
        this.$message(res.data.info);
        this.findUserManage()
      })
    },
    handleTableAddClick() {
      this.dialog.title = '添加'
      this.dialog.display = true
    },
    handleTableEditClick(item) {
      this.dialog.title = '修改'
      this.dialog.display = true
      this.table.selectItem = item
      this.dialog.form.id = item.ID
      this.dialog.form.real_name = item.REAL_NAME
      this.dialog.form.username = item.USERNAME
      this.dialog.form.password = item.PASSWORD
      this.dialog.form.station = item.STATION_ID
      this.dialog.form.center = item.CENTER
      this.dialog.form.clzm = item.CLZS.split(',')
    },
    handleTableDeleteClick(item) {
      this.$confirm('是否删除?', '提示', {
        confirmButtonText: '是',
        cancelButtonText: '否',
        cancelButtonClass: 'el-button--danger',
        closeOnClickModal: false,
        type: 'info',
        center: true
      })
        .then(() => {
          let params = new URLSearchParams()
          params.append('id', item.ID)
          axios.post('map/deldlclzzhb', params, { baseURL }).then(res => {
            this.$message(res.data.info);
            this.findUserManage()
          })
        })
        .catch(() => {})
    },
    handleDialogSaveClick() {
      if (this.dialog.title === '修改') {
        this.updateUserManage()
      } else if (this.dialog.title === '添加') {
        this.addUserManage()
      }
    },
    handleDialogClosed() {
      this.dialog.title = ''
      this.dialog.form.real_name = ''
      this.dialog.form.username = ''
      this.dialog.form.password = ''
      this.dialog.form.station = ''
      this.dialog.form.clzm = []
      this.table.selectItem = []
    },
    handleExportClick() {
      this.$confirm('是否需要导出?', '提示', {
        confirmButtonText: '是',
        cancelButtonText: '否',
        cancelButtonClass: 'el-button--danger',
        closeOnClickModal: false,
        type: 'info',
        center: true
      }).then(() => {
        window.open(`${baseURL}map/finddlclzzhbexcle?gjz=`);
      }).catch(() => {

      });
    }
  }
}
</script>


