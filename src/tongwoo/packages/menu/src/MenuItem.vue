<script>
export default {
  name: 'TMenuItem',
  props: {
    url: String,
    title: String,
    fullPath: String,
    prefixIcon: String,
    suffixIcon: String
  },
  computed: {
    hasActive() {
      const { path } = this.$route
      const { url, fullPath } = this
      const hasPath = fullPath && fullPath.indexOf(path) === 0
      return hasPath || url === path
    },
    menuItemData() {
      const item = {}
      item.href = this.url || ''
      item.title = this.title || ''
      if (this.prefixIcon) item.icon = this.prefixIcon
      if (this.fullPath) item.fullPath = this.fullPath
      return item
    }
  },
  methods: {
    handleMenuHrefClick() {
      const item = this.menuItemData
      if (this.$listeners['menu-item-click'])
        this.$emit('menu-item-click', item)
      if (this.url) this.$router.push({ path: this.url })
    }
  },
  render() {
    const tchildern = [<span class="tw-title">{this.title}</span>]
    if (this.prefixIcon)
      tchildern.unshift(
        <t-icon class="tw-icon__prefix" name={this.prefixIcon}></t-icon>
      )
    if (this.suffixIcon)
      tchildern.push(
        <t-icon class="tw-icon__suffix" name={this.suffixIcon}></t-icon>
      )
    return (
      <div
        class={{ 'tw-menu-item': true, active: this.hasActive }}
        on={{
          click: this.handleMenuHrefClick
        }}
      >
        {this.$slots.default ? this.$slots.default : tchildern}
      </div>
    )
  }
}
</script>