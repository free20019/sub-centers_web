<!-- 用户管理 -->
<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <t-query-panel :model="query" footer="300">
    <template v-slot:querybar>
      <el-form-item>
        <el-button type="primary" @click="handleExportClick">导出</el-button>
        <el-button type="primary" @click="handleTableAddClick">添加</el-button>
      </el-form-item>
    </template>
    <t-table-page :data="table.data" :loading="table.display" :page-size="20">
      <el-table-column type="index" label="序号" align="center" width="50" :resizable="false"></el-table-column>
      <el-table-column prop="CLZ_NAME" label="车辆组名" align="center" width="240"></el-table-column>
      <el-table-column prop="VEHI" label="车牌号码" align="center"></el-table-column>
      <el-table-column :resizable="false" width="100" align="center">
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
        <el-form-item label="车辆组名">
          <el-input v-model="dialog.form.clz_name" placeholder="车辆组名"></el-input>
        </el-form-item>
        <el-form-item label="车牌号码">
          <el-input type="textarea" v-model="dialog.form.cphm" placeholder="多个车牌中间以英文,分隔"></el-input>
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
      dialog: {
        title: '',
        display: false,
        form: {
          clz_name: '',
          cphm: '',
          id: ''
        }
      }
    }
  },
  mounted() {
    this.findUserManage()
  },
  methods: {
    iconClassName,
    findUserManage() {
      this.table.display = true
      let params = new URLSearchParams()
      params.append('name', '')
      axios.post('map/finddlclzb', params, { baseURL }).then(res => {
        this.table.data = res.data || []
        this.table.all = res.data || []
        this.table.display = false
      })
    },
    addUserManage() {
      if(this.dialog.form.clz_name.trim() == ''){
        this.$message.error('车辆组名称不能为空');
        return
      }
      _.map(this.table.data,item =>  {
        if(item == this.dialog.form.clz_name){
          this.$message.error('车辆组名称已存在');
          return
        }
      })
      if(this.dialog.form.cphm.trim() == ''){
        this.$message.error('车牌号码不能为空');
        return
      }
      let params = new URLSearchParams()
      params.append('CLZ_NAME', this.dialog.form.clz_name.trim())
      params.append('CLZ_CP', this.dialog.form.cphm.trim())
      axios.post('map/adddlclzb', params, { baseURL }).then(res => {
        this.dialog.display = false
        this.$message(res.data.info);
        this.findUserManage()
      })
    },
    updateUserManage() {
      if(this.dialog.form.clz_name.trim() == ''){
        this.$message.error('车辆组名称不能为空');
        return
      }
      _.map(this.table.data,item =>  {
        if(item.ID != this.dialog.form.id){
          if(item.CLZ_NAME == this.dialog.form.clz_name){
            this.$message.error('车辆组名称已存在');
            return
          }
        }
      })
      if(this.dialog.form.cphm.trim() == ''){
        this.$message.error('车牌号码不能为空');
        return
      }
      let params = new URLSearchParams()
      params.append('CLZ_NAME', this.dialog.form.clz_name.trim())
      params.append('CLZ_CP', this.dialog.form.cphm.trim())
      params.append('ID', this.dialog.form.id)
      axios.post('map/editdlclzb', params, { baseURL }).then(res => {
        this.dialog.display = false
        this.$message(res.data.info);
        this.findUserManage()
      })
    },
    /*事件*/
    handleTableAddClick() {
      this.dialog.title = '添加'
      this.dialog.display = true
    },
    handleTableEditClick(item) {
      this.dialog.title = '修改'
      this.dialog.display = true
      this.table.selectItem = item
      this.dialog.form.clz_name = item.CLZ_NAME
      this.dialog.form.cphm = item.CLZ_CP
      this.dialog.form.id = item.ID
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
          axios.post('map/deldlclzb', params, { baseURL }).then(res => {
            this.dialog.display = false
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
      this.dialog.form.clz_name = ''
      this.dialog.form.cphm = ''
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
        window.open(`${baseURL}map/finddlclzbexcle?name=`);
      }).catch(() => {

      });
    }
  }
}
</script>


