<!-- 服务评价数据 -->
<template>
  <div class="tw-template-wrapper">
    <div class="tw-for" v-for="(item, index) in table.data" :key="index">
      <div class="tw-title">
        <span>>></span>
        <span>车牌号码：{{ formatterTableText('', '', item.VEHICLENO) }}</span>
        <span
          >司机代码：{{ formatterTableText('', '', item.CERTIFICATE) }}</span
        >
        <span
          >评价时间：{{ formatterTableTime('', '', item.EVALUATETIME) }}</span
        >
        <span>评价意见：{{ formatterTableResult('', '', item.RESULT) }}</span>
      </div>
    </div>
  </div>
  <!-- <t-table-page :data="table.data" :loading="table.loading" :page-size="20">
      <el-table-column
        type="index"
        label="序号"
        align="center"
        width="80"
        :resizable="false"
      ></el-table-column>
      <el-table-column
        prop="VEHICLENO"
        label="车牌号码"
        align="center"
        width="340"
        :formatter="formatterTableText"
      ></el-table-column>
      <el-table-column
        prop="CERTIFICATE"
        label="司机代码"
        align="center"
        :formatter="formatterTableText"
        width="340"
      ></el-table-column>
      <el-table-column
        prop="EVALUATETIME"
        label="评价时间"
        align="center"
        :formatter="formatterTableTime"
        width="340"
      ></el-table-column>
      <el-table-column
        prop="RESULT"
        label="评价意见"
        align="center"
        :formatter="formatterTableResult"
        min-width="220"
      ></el-table-column>
    </t-table-page> -->
</template>

<script>
import moment from 'moment'
import axios from 'axios'
import { iconClassName, baseURL } from 'util'
import { format } from 'url'
import _ from 'underscore'
export default {
  name: 'ServiceEvaluationData',
  data() {
    return {
      query: {
        startTime: '',
        endTime: ''
      },
      table: {
        loading: false,
        data: []
      },
      firstFlag: true,
      changeFlag: false,
      setInterTable: null,
      beforeEachFlag: false
    }
  },
  mounted() {
    this.beforeEachFlag = false
    // 先访问当前时间之前10分钟的数据 然后每隔3十秒查询之前30秒的数据 插入
    this.$router.beforeEach((to, from, next) => {
      this.beforeEachFlag = true
      if (to.path == '/zdsz/fwpjsj') {
        this.getTableData()
        this.setInterTable = setInterval(() => {
          this.getTableData()
        }, 30000)
        next()
      } else {
        clearInterval(this.setInterTable)
        next()
      }
      next()
    })
    if (!this.beforeEachFlag) {
      this.getTableData()
      this.setInterTable = setInterval(() => {
        this.getTableData()
      }, 30000)
    }
  },
  methods: {
    formatterTableText(a, b, val) {
      return val.replace(/\u0000/g, '')
    },
    // 格式化表格 时间
    formatterTableTime(a, b, val) {
      return (val && moment(val).format('YYYY-MM-DD HH:mm:ss')) || ''
    },
    // 格式化表格 评价意见
    formatterTableResult(a, b, val) {
      return val == 1
        ? '不满意'
        : val == 2
        ? '基本满意'
        : val == 3
        ? '满意'
        : ''
    },
    // handleQueryClick() {
    //   this.getTableData()
    //   clearInterval(this.setInterTable)
    //   this.setInterTable = setInterval(() => {
    //     this.getTableData()
    //   }, 6000)
    // },
    getTableData() {
      let stime = ''
      if (this.firstFlag) {
        stime = moment(new Date()).subtract(10, 'm')
      } else {
        stime = moment(new Date()).subtract(30, 's')
      }
      axios
        .get('map/getServiceEvaluation', {
          baseURL,
          params: {
            stime: moment(stime).format('YYYY-MM-DD HH:mm:ss'),
            etime: moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
          }
        })
        .then(res => {
          this.firstFlag = false
          _.each(res.data, item => {
            ;(() => {
              this.table.data.unshift(item)
            })()
          })
        })
    },
    // getTableData() {
    //   // 需求：查询前把结束时间设置为当前时间
    //   const { startTime, endTime } = this.query
    //   if (!startTime) return this.$message.error('请先选择开始时间')
    //   if (!endTime) this.query.endTime = new Date()
    //   if (endTime && !this.firstFlag && !this.changeFlag)
    //     this.query.endTime = new Date()
    //   axios
    //     .get('map/getServiceEvaluation', {
    //       baseURL,
    //       params: {
    //         stime:
    //           (this.query.startTime &&
    //             moment(this.query.startTime).format('YYYY-MM-DD HH:mm:ss')) ||
    //           '',
    //         etime:
    //           (this.query.endTime &&
    //             moment(this.query.endTime).format('YYYY-MM-DD HH:mm:ss')) ||
    //           ''
    //       }
    //     })
    //     .then(res => {
    //       this.table.data = res.data
    //     })
    //   this.firstFlag = false
    //   this.changeFlag = false
    // },
    handleChangeEndTime() {
      this.changeFlag = true
    }
  }
}
</script>

<style lang="scss" scoped>
.tw-template-wrapper {
  overflow: auto;
}
.tw-for {
  .tw-title {
    line-height: 30px;
    font-size: 15px;
    span {
      display: inline-block;
      &:nth-child(1) {
        padding-left: 10px;
        width: 30px;
        text-align: center;
      }
      &:nth-child(2) {
        width: 170px;
        text-align: center;
      }
      &:nth-child(3) {
        width: 270px;
        padding-left: 10px;
      }
      &:nth-child(4) {
        width: 270px;
        padding-left: 10px;
      }
      &:nth-child(5) {
        width: 270px;
        padding-left: 10px;
      }
    }
  }
  border-bottom: 1px solid #eeeeee;
}
</style>
