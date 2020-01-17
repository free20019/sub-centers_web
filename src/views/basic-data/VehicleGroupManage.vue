<!-- 车辆组管理 -->
<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <t-query-panel :model="query" footer="300">
    <template v-slot:querybar>
      <el-form-item>
        <el-select v-model="query.group" clearable filterable placeholder="车辆组">
          <el-option
            v-for="item in select.group"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleQueryClick">查询</el-button>
        <el-button type="primary" @click="handleExportClick">导出</el-button>
        <el-button type="primary" @click="handleTableAddClick">添加</el-button>
      </el-form-item>
    </template>
    <t-table-page :data="table.data" :loading="table.display" :page-size="20">
      <el-table-column type="index" label="序号" align="center" width="50" :resizable="false"></el-table-column>
      <el-table-column prop="GROUP_NAME" label="车辆组名称" align="center" width="340"></el-table-column>
      <el-table-column prop="COUNT" label="车辆数量" align="center" min-width="300" :resizable="false"></el-table-column>
      <el-table-column :resizable="false" width="200" align="center">
        <!--<template slot="header" slot-scope="scope">-->
          <!--<el-button size="mini" icon="el-icon-plus" @click="handleTableAddClick"></el-button>-->
        <!--</template>-->
        <template slot-scope="scope">
          <el-button
            size="mini"
            icon="el-icon-search"
            type="text"
            @click="handleTableSearchClick(scope.row)"
          ></el-button>
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
      <el-form ref="form" :model="dialog.form" size="small" label-position="right">
        <el-form-item label="车辆组名称" label-width="100px" style="width:300px;">
          <el-input v-model="dialog.form.group_name" placeholder="车辆组名称"></el-input>
        </el-form-item>
        <el-form-item>
          <template>
            <transfer
              class="tw-transfer-customize"
              :value.sync="dialog.form.vehicles"
              :data="transfer.data"
              :titles="['车辆', '车辆组车辆']"
            ></transfer>
          </template>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialog.display = false">取 消</el-button>
        <el-button type="primary" @click="handleDialogSaveClick">提 交</el-button>
      </div>
    </el-dialog>
    <el-dialog title="车辆组详情" :visible.sync="dialog.detail.display" width="90%" center>
      <t-table-page
        :data="table.detail.data"
        :loading="table.detail.display"
        :page-size="10"
        style="height: 500px"
      >
        <el-table-column type="index" label="序号" align="center" width="50" :resizable="false"></el-table-column>
        <el-table-column prop="GROUP_VHIC" label="车牌号码" align="center" width="140"></el-table-column>
        <el-table-column prop="VEHI_SIM" label="SIM卡号" align="center" width="140"></el-table-column>
        <el-table-column prop="OWN_NAME" label="司机姓名" align="center" width="140"></el-table-column>
        <el-table-column prop="OWN_TEL" label="联系电话" align="center" width="240"></el-table-column>
        <el-table-column prop="VC_NAME" label="车辆颜色" align="center" width="140"></el-table-column>
        <el-table-column prop="MT_NAME" label="终端类型" align="center" width="140"></el-table-column>
        <el-table-column
          prop="VT_NAME"
          label="车辆类型"
          align="center"
          min-width="140"
          :resizable="false"
        ></el-table-column>
      </t-table-page>
    </el-dialog>
  </t-query-panel>
</template>
<script>
import { iconClassName, baseURL } from 'util'
import axios from 'axios'
import _ from 'underscore'
import Transfer from 'components/Transfer.vue'

export default {
  name: 'VehicleGroupManage',
  data() {
    return {
      query: {
        group: ''
      },
      inputVehicle: {
        loading: false,
        option: []
      },
      table: {
        display: false,
        selectItem: [],
        data: [],
        detail: {
          display: false,
          data: []
        }
      },
      select: {
        group: [],
        vehicle: []
      },
      dialog: {
        title: '',
        display: false,
        form: {
          group_name: '',
          vehicles: [],
          arr: []
        },
        detail: {
          display: false
        }
      },
      transfer: {
        data: [],
        length: 20
      },
      visibleLength: 0,
      currentPage: 0,
      queryLicensePlate: ''
    }
  },
  mounted() {
    this.findVehicleGroup()
    this.getGroupVehicle()
    this.getVehicle()
  },
  computed: {},
  methods: {
    iconClassName,
    getVehicle() {
      axios
        .get('common/vehicle', {
          baseURL,
          params: {
            type:1
          }
        })
        .then(res => {
          this.select.vehicle = _.map(res.data, item => {
            return {
              value: item.VEHICLE_NO
            }
          })
          this.transfer.data = []
          const { data } = this.transfer
          _.each(this.select.vehicle, function(item, index) {
            let t = {}
            t.id = item.value
            t.label = item.value
            data.push(t)
          })
        })
        .catch(function(error) {})
    },
    getGroupVehicle() {
      axios
        .get('common/groupVehicle', {
          baseURL,
          params: {}
        })
        .then(res => {
          this.select.group = _.map(res.data, item => {
            return {
              value: item.GROUP_NAME,
              label: item.GROUP_NAME
            }
          })
        })
        .catch(function(error) {})
    },
    findVehicleGroup() {
      const { group } = this.query
      this.table.display = true
      axios
        .get('basicData/findVehicleGroup', {
          baseURL,
          params: {
            group
          }
        })
        .then(res => {
          this.table.data = res.data || []
          this.table.display = false
        })
        .catch(function(error) {})
    },
    addTransferApplication() {
      this.dialog.form.arr = []
      const { group_name, vehicles, arr } = this.dialog.form
      _.each(vehicles, function(item) {
        arr.push(item.label)
      })
      if (group_name === '' || arr === '') {
        this.$message.error('请填写完整信息！')
        return false
      }
      axios
        .get('basicData/addVehicleGroup', {
          baseURL,
          params: {
            group_name,
            vehicles: arr.toString()
          }
        })
        .then(res => {
          if (res.data > 0) {
            this.$message({ message: '操作成功!', type: 'success' })
            this.dialog.display = false
            this.findVehicleGroup()
            this.getGroupVehicle()
          } else if (res.data === 0) {
            this.$message.error('操作失败！')
          } else if (res.data === -1) {
            this.$message.error('该车辆组已存在！')
          }
        })
        .catch(function(error) {})
    },
    updateTransferApplication() {
      this.dialog.form.arr = []
      const { group_name, vehicles, arr } = this.dialog.form
      _.each(vehicles, function(item) {
        arr.push(item.label)
      })
      if (group_name === '' || arr === '') {
        this.$message.error('请填写完整信息！')
        return false
      }
      axios
        .get('basicData/updateVehicleGroup', {
          baseURL,
          params: {
            id: this.table.selectItem.GROUP_ID,
            group_name,
            vehicles: arr.toString()
          }
        })
        .then(res => {
          if (res.data > 0) {
            this.$message({ message: '操作成功!', type: 'success' })
            this.dialog.display = false
            this.findVehicleGroup()
            this.getGroupVehicle()
          } else if (res.data === 0) {
            this.$message.error('操作失败！')
          } else if (res.data === -1) {
            this.$message.error('该车辆组已存在！')
          }
        })
        .catch(function(error) {})
    },
    findVehicleGroupDetail(item) {
      axios
        .get('basicData/findVehicleGroupDetail', {
          baseURL,
          params: {
            id: item.GROUP_ID
          }
        })
        .then(res => {
          const { vehicles } = this.dialog.form
          _.each(res.data, function(item) {
            let t = {}
            t.id = item.GROUP_VHIC
            t.label = item.GROUP_VHIC
            vehicles.push(t)
          })
        })
        .catch(function(error) {})
    },
    /*事件*/
    handleQueryClick() {
      this.findVehicleGroup()
    },
    handleTableAddClick() {
      this.dialog.title = '添加'
      this.dialog.display = true
    },
    handleTableSearchClick(item) {
      this.dialog.detail.display = true
      this.table.detail.display = true
      axios
        .get('basicData/findVehicleGroupDetail', {
          baseURL,
          params: {
            id: item.GROUP_ID
          }
        })
        .then(res => {
          this.table.detail.data = res.data || []
          this.table.detail.display = false
        })
        .catch(function(error) {})
    },
    handleTableEditClick(item) {
      this.dialog.title = '修改'
      this.dialog.display = true
      this.table.selectItem = item
      this.dialog.form.group_name = item.GROUP_NAME
      this.dialog.form.vehicles = []
      this.findVehicleGroupDetail(item)
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
            .get('basicData/deleteVehicleGroup', {
              baseURL,
              params: { id: item.GROUP_ID }
            })
            .then(res => {
              if (res.data > 0) {
                this.$message({ message: '操作成功!', type: 'success' })
                this.findVehicleGroup()
                this.getGroupVehicle()
              } else {
                this.$message.error('操作失败！')
              }
            })
            .catch(function(error) {})
        })
        .catch(() => {})
    },
    handleDialogSaveClick() {
      if (this.dialog.title === '修改') {
        this.updateTransferApplication()
      } else if (this.dialog.title === '添加') {
        this.addTransferApplication()
      }
    },
    handleDialogClosed() {
      this.dialog.title = ''
      this.dialog.form.group_name = ''
      this.dialog.form.vehicles = []
      this.table.selectItem = []
    },
    handleExportClick() {
      const { group } = this.query
      this.$confirm('是否需要导出?', '提示', {
        confirmButtonText: '是',
        cancelButtonText: '否',
        cancelButtonClass: 'el-button--danger',
        closeOnClickModal: false,
        type: 'info',
        center: true
      }).then(() => {
        window.open(`${baseURL}basicData/findVehicleGroupExcel?group=${group}`);
      }).catch(() => {

      });
    }
  },
  watch: {
    queryLicensePlate: function() {
      this.currentPage = 1
    }
  },
  components: {
    Transfer
  }
}
</script>







