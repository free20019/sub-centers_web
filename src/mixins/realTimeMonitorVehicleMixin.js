export const companyVehicleMixin = {
  data() {
    return {
      _placeholderIndex: 0,
      _queryPlaceholder: ['车牌号码', '终端编号', '终端类型']
    }
  },
  computed: {
    queryPlaceholder() {
      return '请输入' + this._queryPlaceholder[this._placeholderIndex % 3]
    },
    queryPlaceholderList() {
      return '可输入' + this._queryPlaceholder.join('、')
    }
  },
  methods: {
    /**公司树结构点击事件 */
    handleNodeClick(data) {
      console.log(data)
    },
    /**清除车辆表格选中的状态 */
    handelClearSelectedVehicleClick() {
      this.tableToggleSelection()
    },
    /**删除车辆表格的数据 */
    handelClearVehicleDataClick() {
      this.table.left.data = []
    },
    /**
     * 表格多选按钮的选中与清除
     * @param {*} rows :选中的数据
     */
    tableToggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.vehicleTableLeft.toggleRowSelection(row)
        })
      } else {
        this.$refs.vehicleTableLeft.clearSelection()
      }
    }
  }
}
