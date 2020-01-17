<!-- 消息记录查询 -->
<template>
  <t-query-panel :model="query" footer="300">
    <template v-slot:querybar>
      <el-form-item>
        <el-input v-model="query.content" placeholder="内容"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleQueryClick">查询</el-button>
        <el-button type="primary" @click="handleExportClick">导出</el-button>
      </el-form-item>
    </template>
    <t-table-page :data="table.data" :loading="table.display" :page-size="20">
      <el-table-column type="index" label="序号" align="center" width="50" :resizable="false"></el-table-column>
      <el-table-column prop="MDT_NO" label="终端编号" align="center" width="250"></el-table-column>
      <el-table-column prop="VEHI_NO" label="车牌号码" align="center" width="250"></el-table-column>
      <el-table-column prop="CONTENT" label="消息内容" align="center" width="280" show-overflow-tooltip></el-table-column>
      <el-table-column prop="DB_TIME" label="时间" align="center" min-width="240" :resizable="false"></el-table-column>
    </t-table-page>
  </t-query-panel>
</template>

<script>
  import moment from 'moment'
  import { iconClassName ,baseURL} from 'util'
  import axios from 'axios'
  import _ from 'underscore'
  export default {
    name: 'MessageRecordQuery',
    data() {
      return {
        query: {
          content: '',
        },
        inputVehicle: {
          loading: false,
          option: []
        },
        table: {
          display: false,
          data: []
        },
      }
    },
    mounted() {
      this.findMessageRecordQuery();
    },
    methods: {
      iconClassName,
      findMessageRecordQuery() {
        const {content} = this.query;
        this.table.display = true;
        axios.get('queryAnalysis/findMessageRecordQuery', {
          baseURL,
          params: {
            content,
          }
        }).then(res=> {
          this.table.data = res.data||[];
          this.table.display = false;
        }).catch(function (error) {
        });
      },
      /*事件*/
      handleQueryClick() {
        this.findMessageRecordQuery();
      },
      handleExportClick() {
        const {content} = this.query;
        this.$confirm('是否需要导出?', '提示', {
          confirmButtonText: '是',
          cancelButtonText: '否',
          cancelButtonClass: 'el-button--danger',
          closeOnClickModal: false,
          type: 'info',
          center: true
        }).then(() => {
          window.open(`${baseURL}queryAnalysis/findMessageRecordQueryExcel?content=${content}`);
        }).catch(() => {

        });
      }
    }
  }
</script>




