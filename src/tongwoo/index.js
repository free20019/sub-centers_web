import Layout from './packages/layout'
import GridLayout from './packages/grid-layout'
import Icon from './packages/icon'
// import Menu from './packages/menu'
import MenuGroup from './packages/menu-group'
import MenuItem from './packages/menu-item'
import TablePage from './packages/table-page'
import Tabs from './packages/tabs'
import Panel from './packages/panel'
import CardQuery from './packages/card-query'
import QueryPanel from './packages/query-panel'
import QueryBar from './packages/query-bar'
import Group from './packages/group'

const components = [
  Layout,
  GridLayout,
  Icon,
  MenuGroup,
  MenuItem,
  TablePage,
  Tabs,
  Panel,
  CardQuery,
  QueryPanel,
  QueryBar,
  Group
]

const install = function(Vue) {
  components.forEach(component => {
    Vue.component(component.name, component)
  })
}

export default {
  version: '1.0.0',
  install,
  ...components
}
