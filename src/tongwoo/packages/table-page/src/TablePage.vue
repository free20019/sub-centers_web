<template>
  <div class="tw-table-panel">
    <el-table
      class="tw-table"
      :data="filterTableList"
      :height="tableHeight"
      :max-height="maxHeigh"
      :stripe="stripe"
      :border="border"
      :highlight-current-row="highlightCurrentRow"
      :row-class-name="rowClassName"
      :default-expand-all="defaultExpandAll"
      :tooltip-effect="tooltipEffect"
      :show-summary="showSummary"
      :sum-text="sumText"
      :summary-method="summaryMethod"
      :span-method="spanMethod"
      :lazy="lazy"
      :load="load"
      :tree-props="treeProps"
      size="small"
      @select="handleSelect"
      @select-all="handleSelectAll"
      @selection-change="handleSelectionChange"
      @row-click="handleRowClick"
      @row-contextmenu="handleRowContextmenu"
      @row-dblclick="handleRowDblclick"
      @header-click="handleHeaderClick"
      @header-contextmenu="handleHeaderContextmenu"
      @header-dragend="handleHeaderDragend"
      v-loading="loading"
      v-scrollbar:table
    >
      <slot></slot>
    </el-table>
    <el-pagination
      background
      layout="prev, pager, next, jumper, ->, total"
      :total="getPageTotal"
      :page-size="getPageSize"
      :current-page="currentPage"
      :prev-text="prevText"
      :next-text="nextText"
      :disabled="pageDisabled"
      hide-on-single-page
      @current-change="handlePaginationCurrentChange"
    ></el-pagination>
  </div>
</template>

<script>
import _ from 'underscore'

export default {
  name: 'TTablePage',
  data() {
    return {
      currentPage: 1,
      pageStandard: 500
    }
  },
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    /**显示的数据 */
    data: Array,
    /**Table 的最大高度 */
    maxHeigh: {
      type: [String, Number]
    },
    /**是否为斑马纹 table */
    stripe: {
      type: Boolean,
      default: true
    },
    /**是否带有纵向边框 */
    border: {
      type: Boolean,
      default: true
    },
    /**是否要高亮当前行 */
    highlightCurrentRow: {
      type: Boolean,
      default: false
    },
    /**
     * 行的 className 的回调方法，也可以使用字符串为所有行设置一个固定的 className。
     * @param {row, rowIndex}
     */
    rowClassName: {
      type: [Function, String]
    },
    /**是否默认展开所有行，当 Table 包含展开行存在或者为树形表格时有效 */
    defaultExpandAll: {
      type: Boolean,
      default: false
    },
    /**tooltip effect 属性, value: dark/light */
    tooltipEffect: {
      type: String
    },
    /**是否在表尾显示合计行 */
    showSummary: {
      type: Boolean,
      default: false
    },
    /**合计行第一列的文本 */
    sumText: {
      type: String,
      default: '合计'
    },
    /**
     * 自定义的合计计算方法
     * @param { columns, data }
     */
    summaryMethod: Function,
    /**
     * 合并行或列的计算方法
     * @param { row, column, rowIndex, columnIndex }
     */
    spanMethod: Function,
    /**是否懒加载子节点数据 */
    lazy: Boolean,
    /**
     * 加载子节点数据的函数，lazy 为 true 时生效，函数第二个参数包含了节点的层级信息
     * @param row
     * @param treeNode
     * @param resolve
     */
    load: Function,
    /**
     * 渲染嵌套数据的配置选项
     * 默认值：{ hasChildren: 'hasChildren', children: 'children' }
     */
    treeProps: Object,
    /**是否冻结数据 */
    hasFreeze: {
      type: Boolean,
      default: true
    },
    /**
     * 每页数量
     */
    pageSize: Number,
    pageDisabled: {
      type: Boolean,
      default: false
    },
    realTimePage: {
      type: Number,
      default: 1
    },
    /**
     * 总页数
     * 如果是前端分页无需传入，插件会自动生成
     * 后端分页必填
     */
    pageTotal: Number,
    prevText: String,
    nextText: String
  },
  computed: {
    /**计算表格高度 */
    tableHeight() {
      const data = this.data || []
      if (this.getPageTotal / this.getPageSize > 1) return 'calc(100% - 42px)'
      else return '100%'
    },
    /**表格数据展示 */
    filterTableList() {
      const { pageTotal, pageStandard } = this
      const data = this.data || []
      const flag = !pageSize && data.length >= pageStandard
      const pageSize = this.getPageSize
      if (flag || (pageSize && !pageTotal)) {
        const currentPage = this.currentPage
        const pageIndex = currentPage - 1
        return _.filter(data, (item, index) => {
          return index >= pageIndex * pageSize && index < currentPage * pageSize
        })
      } else if (this.hasFreeze && data.length > 100) return Object.freeze(data)
      else return data
    },
    /**总页数 */
    getPageTotal() {
      const data = this.data || []
      return this.pageTotal || data.length
    },
    getPageSize() {
      const { pageTotal, pageSize, pageStandard } = this
      if (pageTotal && !pageSize) return pageStandard
      return pageSize || 10
    }
  },
  methods: {
    /**
     * 当用户手动勾选数据行的 Checkbox 时触发的事件
     * @param selection 选中的数据
     * @param row
     */
    handleSelect(selection, row) {
      if (this.$listeners['select']) this.$emit('select', selection, row)
    },
    /**
     * 当用户手动勾选全选 Checkbox 时触发的事件
     * @param selection 选中的数据
     */
    handleSelectAll(selection) {
      if (this.$listeners['select-all']) this.$emit('select-all', selection)
    },
    /**
     * 当选择项发生变化时会触发该事件
     * @param selection 选中的数据
     */
    handleSelectionChange(selection) {
      if (this.$listeners['selection-change'])
        this.$emit('selection-change', selection)
    },
    /**
     * 当某一行被点击时会触发该事件
     * @param row
     * @param column
     * @param event
     */
    handleRowClick(row, column, event) {
      if (this.$listeners['row-click'])
        this.$emit('row-click', row, column, event)
    },
    /**
     * 当某一行被鼠标右键点击时会触发该事件
     * @param row
     * @param column
     * @param event
     */
    handleRowContextmenu(row, column, event) {
      if (this.$listeners['row-contextmenu'])
        this.$emit('row-contextmenu', row, column, event)
    },
    /**
     * 当某一行被双击时会触发该事件
     * @param row
     * @param column
     * @param event
     */
    handleRowDblclick(row, column, event) {
      if (this.$listeners['row-dblclick'])
        this.$emit('row-dblclick', row, column, event)
    },
    /**
     * 当某一列的表头被点击时会触发该事件
     * @param column
     * @param event
     */
    handleHeaderClick(column, event) {
      if (this.$listeners['header-click'])
        this.$emit('header-click', column, event)
    },
    /**
     * 当某一列的表头被鼠标右键点击时触发该事件
     * @param column
     * @param event
     */
    handleHeaderContextmenu(column, event) {
      if (this.$listeners['header-contextmenu'])
        this.$emit('header-contextmenu', column, event)
    },
    /**
     * 当拖动表头改变了列的宽度的时候会触发该事件
     * @param newWidth
     * @param oldWidth
     * @param column
     * @param event
     */
    handleHeaderDragend(newWidth, oldWidth, column, event) {
      if (this.$listeners['header-dragend'])
        this.$emit('header-dragend', newWidth, oldWidth, column, event)
    },
    /**
     * currentPage 改变时会触发
     * @param index 当前页
     */
    handlePaginationCurrentChange(index) {
      this.currentPage = index
      if (this.pageTotal && this.$listeners['current-change'])
        this.$emit('current-change', {
          currentPage: index,
          pageSize: this.getPageSize
        })
    }
  },
  watch: {
    loading(value) {
      if (!value && this.pageTotal === undefined) this.currentPage = 1
    },
    currentPage(value) {
      if (this.$listeners['update:real-time-page'])
        this.$emit('update:real-time-page', value)
    },
    realTimePage(value) {
      this.currentPage = value
    }
  }
}
</script>
