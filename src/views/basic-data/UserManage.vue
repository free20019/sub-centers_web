<!-- 用户管理 -->
<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <t-query-panel :model="query" footer="300">
    <template v-slot:querybar>
      <el-form-item>
        <el-input v-model="query.filter" placeholder="Filter" @input="handleFilterClick()"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleExportClick">导出</el-button>
        <el-button type="primary" @click="handleTableAddClick">添加</el-button>
      </el-form-item>
    </template>
    <t-table-page :data="table.data" :loading="table.display" :page-size="20">
      <el-table-column type="index" label="序号" align="center" width="50" :resizable="false"></el-table-column>
      <el-table-column prop="REAL_NAME" label="姓名" align="center" width="240"></el-table-column>
      <el-table-column prop="STATION_NAME" label="页面权限" align="center" width="200"></el-table-column>
      <el-table-column prop="USER_NAME" label="用户名" align="center" width="100"></el-table-column>
      <el-table-column
        prop="DATE_VIEW_TYPE"
        label="数据权限"
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
          <el-input v-model="dialog.form.real_name" placeholder="姓名" style="width: 250px;"></el-input>
        </el-form-item>
        <el-form-item label="用户名">
          <el-input v-model="dialog.form.username" placeholder="用户名" style="width: 250px;"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input
            type="password"
            v-model="dialog.form.password"
            placeholder="密码"
            style="width: 250px;"
          ></el-input>
        </el-form-item>
        <el-form-item label="地图中心点">
          <el-select v-model="dialog.form.center" placeholder="地图中心点" style="width: 250px;">
            <el-option
              v-for="item in center"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="岗位">
          <el-select v-model="dialog.form.station" clearable placeholder="岗位" style="width: 250px;">
            <el-option
              v-for="item in select.station"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="数据权限">
          <template>
            <el-transfer
              class="tw-transfer-customize"
              v-model="dialog.form.company"
              filterable
              :data="dialog.form.data"
              :titles="['公司', '所属公司']"
            >
              <span slot-scope="{ option }">
                <el-tooltip class="item" effect="dark" :content="option.key" placement="right">
                  <div>{{ option.key }}</div>
                </el-tooltip>
              </span>
            </el-transfer>
          </template>
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
      query: {
        filter: ''
      },
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
      dialog: {
        title: '',
        display: false,
        form: {
          real_name: '',
          username: '',
          password: '',
          station: '',
          company: [],
          data: [],
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
    this.getCompany()
    this.getStation()
  },
  methods: {
    iconClassName,
    handleCompanyQuerySearch(query, cb) {
      cb(_.filter(this.select.company, item => item.value.indexOf(query) > -1))
    },
    getCompany() {
      axios
        .get('common/userCompany', {
          baseURL,
          params: {}
        })
        .then(res => {
          this.dialog.form.data = _.map(res.data, item => {
            return {
              key: item.COMP_NAME,
              value: item.COMP_NAME
            }
          })
        })
        .catch(function(error) {
          console.log(error);
        })
    },
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
    findUserManage() {
      this.table.display = true
      const {filter} = this.query;
      axios
        .get('basicData/findUserManage', {
          baseURL,
          params: {
            filter
          }
        })
        .then(res => {
          this.table.data = res.data || []
          this.table.all = res.data || []
          this.table.display = false
        })
        .catch(function(error) {
          console.log(error);
        })
    },
    addUserManage() {
      const {
        real_name,
        username,
        password,
        station,
        company,
        center
      } = this.dialog.form
      if (
        real_name === '' ||
        username === '' ||
        password === '' ||
        station === '' ||
        company.length === 0
      ) {
        this.$message.error('请填写完整信息！')
        return false
      }
      let params = new URLSearchParams()
      params.append('real_name', real_name)
      params.append('username', username)
      params.append('password', password)
      params.append('station', station)
      params.append('center', center)
      params.append('company', company.toString())
      axios.post('basicData/addUserManage', params, { baseURL }).then(res => {
          if (res.data > 0) {
            this.$message({ message: '操作成功!', type: 'success' })
            this.dialog.display = false
            this.findUserManage()
          } else if (res.data === 0) {
            this.$message.error('操作失败！')
          } else if (res.data === -1) {
            this.$message.error('该用户已添加！')
          }
        })
        .catch(function(error) {
          console.log(error);
        })
    },
    updateUserManage() {
      const {
        real_name,
        username,
        password,
        station,
        company,
        center
      } = this.dialog.form
      if (
        real_name === '' ||
        username === '' ||
        password === '' ||
        station === '' ||
        company.length === 0
      ) {
        this.$message.error('请填写完整信息！')
        return false
      }
      let params = new URLSearchParams()
      params.append('id', this.table.selectItem.ID)
      params.append('real_name', real_name)
      params.append('username', username)
      params.append('password', password)
      params.append('station', station)
      params.append('center', center)
      params.append('company', company.toString())
      axios.post('basicData/updateUserManage', params, { baseURL }).then(res => {
          if (res.data > 0) {
            this.$message({ message: '操作成功!', type: 'success' })
            this.dialog.display = false
            this.findUserManage()
          } else if (res.data === 0) {
            this.$message.error('操作失败！')
          } else if (res.data === -1) {
            this.$message.error('该用户已添加！')
          }
        }).catch(function(error) {
          console.log(error);
        })
    },
    /*事件*/
    handleFilterClick() {
      const { filter } = this.query
      this.table.data = _.filter(this.table.all, item => {
        return (
          item.REAL_NAME.indexOf(filter) > -1 ||
          item.USER_NAME.indexOf(filter) > -1 ||
          item.DATE_VIEW_TYPE.indexOf(filter) > -1 ||
          item.STATION_NAME.indexOf(filter) > -1
        )
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
      this.dialog.form.real_name = item.REAL_NAME
      this.dialog.form.username = item.USER_NAME
      this.dialog.form.password = item.PASSWORD
      this.dialog.form.station = item.STATION_ID
      this.dialog.form.cneter = item.CENTER
      this.dialog.form.company = item.DATE_VIEW_TYPE.split(',')
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
          axios
            .get('basicData/deleteUserManage', {
              baseURL,
              params: { id: item.ID }
            })
            .then(res => {
              if (res.data > 0) {
                this.$message({ message: '操作成功!', type: 'success' })
                this.findUserManage()
              } else {
                this.$message.error('操作失败！')
              }
            })
            .catch(function(error) {
              console.log(error);
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
      this.dialog.form.company = []
      this.table.selectItem = []
    },
    handleExportClick() {
      const {filter} = this.query;
      this.$confirm('是否需要导出?', '提示', {
        confirmButtonText: '是',
        cancelButtonText: '否',
        cancelButtonClass: 'el-button--danger',
        closeOnClickModal: false,
        type: 'info',
        center: true
      }).then(() => {
        window.open(`${baseURL}basicData/findUserManageExcel?filter=${filter}`);
      }).catch(() => {

      });
    }
  }
}
</script>


