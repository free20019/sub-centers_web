<template>
  <div class="tw-template-wrapper">
    <t-card-query height="300px">
      <template v-slot:query>
        <el-input
          v-show="is_display"
          class="tw-panel__query-input"
          v-model="companyName"
          placeholder="请输入公司名称"
          style="width: calc(100% - 38px);"
        ></el-input>
        <el-button icon="el-icon-search" v-show="is_display"></el-button>
      </template>
      <el-tree
        class="tw-tree"
        :data="companyList"
        @node-click="handleNodeClick"
        :filter-node-method="filterNode"
        ref="tree"
      ></el-tree>
    </t-card-query>
    <t-card-query height="calc(100% - 350px)">
      <!--calc(100% - 350px)overflow-y: auto;-->
      <template v-slot:query>
        <el-tooltip :content="queryPlaceholderList" placement="top">
          <el-autocomplete
            class="tw-panel__query-input"
            :fetch-suggestions="querySearchAsync"
            :placeholder="queryPlaceholderInfo"
            style="width: calc(100% - 82px); float:left;margin-right: -1px;"
            v-model="vehicle"
            :clearable="true"
            popper-class="vehicleWidth"
            @select="handleSelect"
          ></el-autocomplete>
        </el-tooltip>
        <el-button
          type="danger"
          @click="delTableInfo()"
          icon="el-icon-delete"
        ></el-button>
        <el-button icon="el-icon-search"></el-button>
      </template>
      <pl-table
        :datas="vehicleList"
        class="tw-table tw-table__towLines tw-item__click"
        big-data-checkbox
        ref="vehicleTableLeft"
        size="mini"
        header-drag-style
        :pagination-show="false"
        @selection-change="changeVhic"
        @row-dblclick="tableDblick"
      >
        <!-- use-virtual-->
        <!--show-overflow-tooltip属性代表超出则内容部分给出提示框-->
        <pl-table-column
          v-if="ischeckbox"
          type="selection"
          align="center"
          width="55"
        />
        <pl-table-column
          prop="SPEED"
          min-width="120"
          align="center"
          label="车牌"
          style="color: black"
        >
          <template v-slot="scope">
            <span :class="['tw-radius', scope.row.VEHI_DONOT]"></span>
            {{ scope.row.VEHI_NO }}
          </template>
        </pl-table-column>
        <!--<pl-table-column prop="SPEED" align="center" label="速度" /> -->
        <pl-table-column
                prop="SPEED"
                label="速度"
                align="center"
              >
              <template slot-scope="scope">
                  <span
                    v-text="speedType(scope.row)"
                  ></span>
                </template>
              </pl-table-column>
      </pl-table>
    </t-card-query>
    <div class="tw-list tw-vehicle-status">
      <el-badge
        class="tw-list-item"
        type="info"
        :value="vehicleTypeNum.lx"
        :max="999"
      >
        <div class="tw-list-wrapper" @click="statusSelection(1)">
          <t-icon class="tw-list-item__icon" name="icon-car"></t-icon>
          <span>离线</span>
        </div>
      </el-badge>
      <el-badge
        class="tw-list-item"
        type="success"
        :value="vehicleTypeNum.kc"
        :max="999"
      >
        <div class="tw-list-wrapper" @click="statusSelection(2)">
          <t-icon class="tw-list-item__icon" name="icon-car"></t-icon>
          <span>空车</span>
        </div>
      </el-badge>
      <el-badge
        class="tw-list-item"
        type="danger"
        :value="vehicleTypeNum.zc"
        :max="999"
      >
        <div class="tw-list-wrapper" @click="statusSelection(3)">
          <t-icon class="tw-list-item__icon" name="icon-car"></t-icon>
          <span>重车</span>
        </div>
      </el-badge>
      <el-badge
        class="tw-list-item"
        type="warning"
        :value="vehicleTypeNum.bj"
        :max="999"
      >
        <div class="tw-list-wrapper" @click="statusSelection(4)">
          <t-icon class="tw-list-item__icon" name="icon-car"></t-icon>
          <span>报警</span>
        </div>
      </el-badge>
    </div>
  </div>
</template>

<script>
import { baseURL } from 'util'
import axios from 'axios'
import _ from 'underscore'

export default {
  name: 'RealTimeMonitorVehiclePanel',
  data() {
    return {
      companyList: [],
      placeholderIndex: 0,
      queryPlaceholder: ['车牌号码', '终端编号', 'SIM卡号'],
      vehicleList: [],
      companyName: '',
      vehicle: '',
      checkVehicleList: [],
      vehicleTypeNum: {
        lx: 0,
        kc: 0,
        zc: 0,
        bj: 0,
        lxlist: [],
        kclist: [],
        zclist: [],
        bjlist: []
      },
      is_display: false,
      loginType: '',
      columns: [{}],
      setinterInfo: {
        type : 0,
        timedRefresh: null,
        data: {
          label: '',
          value: null,
          cp: null
        }
      }
    }
  },
  props: {
    vhic: Array,
    ischeckbox: {
      type: Boolean,
      defaule: false
    }
  },
  mounted() {
    setInterval(() => this.placeholderIndex++, 3000)
    this.companyList = []
    this.vehicleList = []
    this.handlegetCompTree()
  },
  computed: {
    queryPlaceholderInfo() {
      return '请输入' + this.queryPlaceholder[this.placeholderIndex % 3]
    },
    queryPlaceholderList() {
      return '可输入' + this.queryPlaceholder.join('、')
    },
    selectedVehicleNumber() {
      return `车辆数：${this.vehicleList.length}辆`
    }
  },
  watch: {
    companyName(val) {
      this.$refs.tree.filter(val)
    },
    checkVehicleList(val) {
      if (this.$listeners['update:vhic']) this.$emit('update:vhic', val)
    },
    vhic(val) {
      this.checkVehicleList = val
    },
    vehicleList(value) {}
  },
  methods: {
    /**车辆查找输入框中输入3位以上显示内容**/
    querySearchAsync(query, cb) {
      if (query.length < 3) return cb([])
      this.getVehiList(query).then(res => {
        cb(
          (res.data &&
            _.map(res.data, item => {
              return { value: item.INFO, label: item.VEHI_NO }
            })) ||
            []
        )
      })
    },
    speedType(row) {
      if (new Date().getTime() - row.STIME > 1000 * 60 * 30) {
        return '0'
      } else {
        return row.SPEED
      }
    },
    /**查询车辆**/
    getVehiList(val) {
      let params = new URLSearchParams()
      params.append('vhic', val)
      return axios.post('map/getVhic', params, { baseURL })
    },
    /**车辆查找输入框中输入3位以上显示内容后选中一条后执行**/
    handleSelect(item) {
      console.log(item,item.label)
      let params = new URLSearchParams()
      params.append('type', '1')
      params.append('vhic', item.label)
      axios.post('map/getOneVhic', params, { baseURL }).then(res => {
        this.setinterInfo.type = 1
        this.setinterInfo.data.label = item.label
        this.statisticalReset()
        this.vehicleList = res.data
        this.statisticalResults()
        // this.timedRefresh()
      })
    },
    /*定时刷新左侧下方表格内容*/
    // timedRefresh() {
    //   clearInterval(this.setinterInfo.timedRefresh)
    //   let _this = this
    //   if(this.setinterInfo.type ==0){
    //     // this.setinterInfo.timedRefresh = setInterval(this.handleNodeClick[this.setinterInfo.data], 30000)
    //     this.setinterInfo.timedRefresh = setInterval( () => {
    //       _this.handleNodeClick(this.setinterInfo.data)
    //     }, 30000)
    //   }else if(this.setinterInfo.type == 1) setInterval(this.test,10000)
    //     // this.setinterInfo.timedRefresh = setInterval(this.handleSelect(this.setinterInfo.data), 30000)
    //     this.setinterInfo.timedRefresh = setInterval(() => {
    //       _this.handleSelect(this.setinterInfo.data)
    //     }, 30000)
    // },
    /**对树节点进行筛选时执行的方法，返回 true 表示这个节点可以显示，返回 false 则表示这个节点会被隐藏**/
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    /**获取公司树结构**/
    handlegetCompTree() {
      let loginType = this.$cookies.get('loginType')
      this.loginType = loginType
      if (loginType == '0') {
        // this.loginType.compDisplay = true
        this.is_display = true
        axios.get('map/getComp', { baseURL }).then(res => {
          this.companyList = Object.freeze(res.data) || []
        })
      } else if (loginType == '1') {
        axios.get('map/getClzTree', { baseURL }).then(res => {
          this.companyList = Object.freeze(res.data) || []
        })
      }
    },
    /**公司树结构点击事件 */
    handleNodeClick(data) {
      let params = new URLSearchParams()
      if (this.loginType == '0') {
        params.append('id', data.value)
        axios.post('map/getVhicList', params, { baseURL }).then(res => {
          this.setinterInfo.type = 0
          this.setinterInfo.data.value = data.value
          this.statisticalReset()
          this.vehicleList = Object.freeze(res.data)
          this.statisticalResults()
          // this.timedRefresh()
        })
      } else if (this.loginType == '1') {
        params.append('cp', data.cp)
        axios.post('map/getClzVhic', params, { baseURL }).then(res => {
          this.setinterInfo.type = 0
          this.setinterInfo.data.cp = data.cp
          this.statisticalReset()
          this.vehicleList = Object.freeze(res.data)
          this.statisticalResults()
          // this.timedRefresh()
        })
      }
    },
    /**清除车辆表格选中的状态 */
    handelClearSelectedVehicleClick() {
      this.tableToggleSelection()
    },
    /**删除车辆表格的数据 */
    handelClearVehicleDataClick() {
      this.vehicleList = []
    },
    /**
     * 表格多选按钮的选中与清除
     * @param {*} rows :选中的数据
     */
    tableToggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.vehicleTableLeft.$refs.singleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.vehicleTableLeft.$refs.singleTable.clearSelection()
      }
    },
    /**表格复选框选中**/
    changeVhic(selection) {
      if (!this.ischeckbox) return
      this.checkVehicleList = selection
    },
    tableDblick(row) {
      if (this.ischeckbox) return
      this.checkVehicleList = []
      this.checkVehicleList = [row]
    },
    /**点击公司或者查找车辆将数据结果各种类型的车辆统计出来**/
    statisticalResults() {
      _.map(this.vehicleList, item => {
        if (item.VEHI_DONOT == 'tw-radius-offLine') {
          this.vehicleTypeNum.lx++
          this.vehicleTypeNum.lxlist.push(item)
        } else if (item.VEHI_DONOT == 'tw-radius-emptyCar') {
          this.vehicleTypeNum.kc++
          this.vehicleTypeNum.kclist.push(item)
        } else if (item.VEHI_DONOT == 'tw-radius-heavyCar') {
          this.vehicleTypeNum.zc++
          this.vehicleTypeNum.zclist.push(item)
        } else if (item.VEHI_DONOT == 'tw-radius-callPolice') {
          this.vehicleTypeNum.bj++
          this.vehicleTypeNum.bjlist.push(item)
        }
      })
    },
    /**车辆类型统计类型重置**/
    statisticalReset() {
      this.vehicleTypeNum.lx = 0
      this.vehicleTypeNum.lxlist = []
      this.vehicleTypeNum.kc = 0
      this.vehicleTypeNum.kclist = []
      this.vehicleTypeNum.zc = 0
      this.vehicleTypeNum.zclist = []
      this.vehicleTypeNum.bj = 0
      this.vehicleTypeNum.bjlist = []
    },
    /**车辆类型状态选中**/
    statusSelection(type) {
      this.tableToggleSelection()
      if (type == 1) {
        this.tableToggleSelection(this.vehicleTypeNum.lxlist)
        return
      } else if (type == 2) {
        this.tableToggleSelection(this.vehicleTypeNum.kclist)
        return
      } else if (type == 3) {
        this.tableToggleSelection(this.vehicleTypeNum.zclist)
        return
      } else if (type == 4) {
        this.tableToggleSelection(this.vehicleTypeNum.bjlist)
        return
      }
    },
    /**
     * @description: 点击删除按钮 删除表格的数据
     * @param {type}
     * @return:
     */

    delTableInfo() {
      this.$emit('clear-table')
      this.vehicleList = []
    }
  }
}
</script>

<style lang="scss" scoped>
.tw-list {
  display: block;
  height: 40px;
  margin-top: -10px;
  &-item {
    display: inline-block;
    width: 25%;
    height: 40px;
    line-height: 40px;
    text-align: center;
    cursor: pointer;

    &__icon {
      margin-right: 5px;
    }
    &:nth-child(1) {
      .tw-list-item__icon {
        color: #909399;
      }
    }
    &:nth-child(2) {
      .tw-list-item__icon {
        color: #67c23a;
      }
    }
    &:nth-child(3) {
      .tw-list-item__icon {
        color: #f56c6c;
      }
    }
    &:nth-child(4) {
      .tw-list-item__icon {
        color: #e6a23c;
      }
    }
  }
  &-wrapper {
    height: 100%;
  }
}
</style>
