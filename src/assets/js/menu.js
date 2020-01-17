import _ from 'underscore'

const menuList = [
  {
    id: 'cljk',
    title: '车辆监控',
    icon: 'icon-vehicle-monitor',
    fullPath: '/cljk'
  },
  // { id: 'lsgj', title: '历史轨迹', icon: 'icon-kefu', fullPath: '/lsgj' },
  // { id: 'czsw', title: '查找失物', icon: 'icon-kefu', fullPath: '/czsw' },
  {
    id: 'cxfx',
    title: '查询分析',
    icon: 'icon-query-analysis',
    fullPath: '/cxfx'
  },
  {
    id: 'sjtj',
    title: '数据统计',
    icon: 'icon-data-statistics',
    fullPath: '/sjtj'
  },
  {
    id: 'hjgl',
    title: '函件管理',
    icon: 'icon-mail-manage',
    fullPath: '/hjgl'
  },
  { id: 'jcsj', title: '基础数据', icon: 'icon-basic-data', fullPath: '/jcsj' }
]

const childrenMenuList = {
  cljk: [
    {
      id: 'yyts',
      title: '营运态势',
      icon: 'tw-img-operation',
      href: '/cljk/yyts'
    },
    {
      id: 'wzjk',
      title: '位置监控',
      icon: 'tw-img-position',
      href: '/cljk/wzjk'
    },
    {
      id: 'dcjk',
      title: '多车监控',
      icon: 'tw-img-multiple-cars',
      href: '/cljk/dcjk'
    },
    {
      id: 'fpjk',
      title: '分屏监控',
      icon: 'tw-img-split-screen',
      href: '/cljk/fpjk'
    },
    {
      id: 'lsgj',
      title: '历史轨迹',
      icon: 'tw-img-historical-track',
      href: '/cljk/lsgj'
    },
    {
      id: 'qyjk',
      title: '区域监控',
      icon: 'tw-img-region',
      href: '/cljk/qyjk'
    },
    // {
    //   id: 'dzwl',
    //   title: '电子围栏',
    //   icon: 'tw-img-electric-fence',
    //   href: '/cljk/dzwl'
    // },
    // {
    //   id: 'zdqyjk',
    //   title: '重点区域监控',
    //   icon: 'tw-img-key-area',
    //   href: '/cljk/zdqyjk'
    // },
    {
      id: 'hksp',
      title: '海康视频',
      icon: 'tw-img-haikang',
      href: '/cljk/hksp'
    },
    { id: 'tysp', title: '通用视频', icon: 'tw-img-video', href: '/cljk/tysp' },
    {
      id: 'xxxf',
      title: '消息下发',
      icon: 'tw-img-message',
      href: '/cljk/xxxf'
    },
    {
      id: 'cssz',
      title: '参数设置',
      icon: 'tw-img-message',
      href: '/cljk/cssz'
    }
  ],
  // lsgj: [],
  // czsw: [],
  cxfx: [
    {
      id: 'sdqxbb',
      title: '速度曲线报表',
      icon: 'tw-img-speed-curve',
      href: '/cljk/sdqxbb'
    },
    {
      id: 'czsw',
      title: '查找失物(全部)',
      icon: 'tw-img-lost-search',
      href: '/cljk/czsw'
    },
    {
      id: 'czswbf',
      title: '查找失物(部分)',
      icon: 'tw-img-lost-search-b',
      href: '/cljk/czswbf'
    },
    {
      id: 'yyjlcx',
      title: '营运记录查询',
      icon: 'tw-img-operate-record',
      href: '/cljk/yyjlcx'
    },
    {
      id: 'yysjtj',
      title: '营运数据统计',
      icon: 'tw-img-operational-data',
      href: '/cljk/yysjtj'
    },
    {
      id: 'yyrb',
      title: '营运日报',
      icon: 'tw-img-operate-daily',
      href: '/cljk/yyrb'
    },
    {
      id: 'yyyb',
      title: '营运月报',
      icon: 'tw-img-operate-monthly',
      href: '/cljk/yyyb'
    },
    {
      id: 'wxjlcx',
      title: '维修记录查询',
      icon: 'tw-img-maintenance-records',
      href: '/cljk/wxjlcx'
    },
    {
      id: 'xxjlcx',
      title: '消息记录查询',
      icon: 'tw-img-message-record',
      href: '/cljk/xxjlcx'
    },
    {
      id: 'wzcx',
      title: '违章查询',
      icon: 'tw-img-violation',
      href: '/cljk/wzcx'
    },
    {
      id: 'tscx',
      title: '投诉查询',
      icon: 'tw-img-complaint-inquiry',
      href: '/cljk/tscx'
    }
  ],
  sjtj: [
    {
      id: 'szltj',
      title: '实载率统计',
      icon: 'tw-img-load-factor-statistics',
      href: '/sjtj/szltj'
    },
    {
      id: 'dccltj',
      title: '单车里程统计',
      icon: 'tw-img-bicycle-mileage-statistics',
      href: '/sjtj/dccltj'
    },
    {
      id: 'clsxtj',
      title: '车辆上线情况统计',
      icon: 'tw-img-vehicle-online-statistics',
      href: '/sjtj/clsxtj'
    },
    {
      id: 'wysjcl',
      title: '无营运数据车辆',
      icon: 'tw-img-vehicles-without-operational-data',
      href: '/sjtj/wyysj'
    },
    {
      id: 'wsxcl',
      title: '未上线车辆查询',
      icon: 'tw-img-vehicles-not-online',
      href: '/sjtj/wsxcl'
    },
    {
      id: 'sxwyy',
      title: '上线无营运车辆',
      icon: 'tw-img-no-operational-vehicles',
      href: '/sjtj/sxwyy'
    },
    {
      id: 'yywsx',
      title: '营运未上线车辆',
      icon: 'tw-img-off-line-vehicles-operation',
      href: '/sjtj/yywsx'
    },
    {
      id: 'wsxwyy',
      title: '未上线未营运车辆',
      icon: 'tw-img-unlisted-vehicles',
      href: '/sjtj/wsxwyy'
    },
    {
      id: 'wkzcbh',
      title: '无空重车变化车辆',
      icon: 'tw-img-no-aerial-vehicle-change',
      href: '/sjtj/wkzcbh'
    },
    {
      id: 'wqdqt',
      title: '无签到签退',
      icon: 'tw-img-no-sign-check-out',
      href: '/sjtj/wqdqt'
    }
  ],
  jcsj: [
    {
      id: 'clzgl',
      title: '车辆组管理',
      icon: 'tw-img-vehicle-group-manage',
      href: '/jcsj/clzgl'
    },
    {
      id: 'qygl',
      title: '区域管理',
      icon: 'tw-img-area-manage',
      href: '/jcsj/qygl'
    },
    // {
    //   id: 'dzwlgl',
    //   title: '电子围栏管理',
    //   icon: 'icon-kefu',
    //   href: '/jcsj/dzwlgl'
    // },
    {
      id: 'ptsyjl',
      title: '平台使用记录',
      icon: 'tw-img-platform-usage-records',
      href: '/jcsj/ptsyjl'
    },
    {
      id: 'yhgl',
      title: '用户管理',
      icon: 'tw-img-user-manage',
      href: '/jcsj/yhgl'
    },
    {
      id: 'gwgl',
      title: '岗位管理',
      icon: 'tw-img-job-manage',
      href: '/jcsj/gwgl'
    },
    {
      id: 'dlclzgl',
      title: '独立车辆组管理',
      icon: 'tw-img-independent-vehicle-group-manage',
      href: '/jcsj/dlclzgl'
    },
    {
      id: 'clzyhgl',
      title: '车辆组用户管理',
      icon: 'tw-img-vehicle-group-user-manage',
      href: '/jcsj/clzyhgl'
    }
    // { id: 'qxgl', title: '权限管理', icon: 'tw-img-authority-manage', href: '/jcsj/qxgl' }
  ],
  hjgl: [
    {
      id: 'zrsq',
      title: '转入申请',
      icon: 'tw-img-in-transfer-application',
      href: '/hjgl/zrsq'
    },
    {
      id: 'zcsq',
      title: '转出申请',
      icon: 'tw-img-out-transfer-application',
      href: '/hjgl/zcsq'
    },
    {
      id: 'btsq',
      title: '报停申请',
      icon: 'tw-img-application-suspension',
      href: '/hjgl/btsq'
    },
    {
      id: 'bgsq',
      title: '变更申请',
      icon: 'tw-img-change-request',
      href: '/hjgl/bgsq'
    },
    {
      id: 'sjjrsq',
      title: '数据接入申请',
      icon: 'tw-img-data-access-application',
      href: '/hjgl/sjjrsq'
    },
    {
      id: 'zrtj',
      title: '转入统计',
      icon: 'tw-img-in-transfer-statistics',
      href: '/hjgl/zrtj'
    },
    {
      id: 'zctj',
      title: '转出统计',
      icon: 'tw-img-out-transfer-statistics',
      href: '/hjgl/zctj'
    },
    {
      id: 'bttj',
      title: '报停统计',
      icon: 'tw-img-stop-statistics',
      href: '/hjgl/bttj'
    },
    {
      id: 'bgtj',
      title: '变更统计',
      icon: 'tw-img-change-statistics',
      href: '/hjgl/bgtj'
    }
  ]
}

export function getMenu(filter) {
  return _.map(menuList, item => {
    const ci = childrenMenuList[item.id]
    const children = _.filter(ci, _item => filter.indexOf(_item.id) >= 0)
    return { ...item, children }
  })
}
