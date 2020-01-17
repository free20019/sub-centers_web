import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
const router = new Router({
  routes: [
    {
      path: '/',
      name: 'Index',
      redirect: { name: '位置监控', path: '/cljk/wzjk' },
      component: () => import('./views/Index.vue'),
      children: [
        /** 车辆监控 */
        {
          path: '/cljk/yyts',
          name: '营运态势',
          component: () =>
            import('./views/vehicle-monitor/OperationalSituation.vue')
        },
        {
          path: '/cljk/wzjk',
          name: '位置监控',
          component: () => import('./views/vehicle-monitor/LocationMonitor.vue')
        },
        {
          path: '/cljk/dcjk',
          name: '多车监控',
          component: () =>
            import('./views/vehicle-monitor/MultiVehicleMonitor.vue')
        },
        {
          path: '/cljk/fpjk',
          name: '分屏监控',
          component: () =>
            import('./views/vehicle-monitor/SplitScreenMonitor.vue')
        },
        {
          path: '/cljk/lsgj',
          name: '历史轨迹',
          component: () => import('./views/vehicle-monitor/HistoricalTrack.vue')
        },
        {
          path: '/cljk/qyjk',
          name: '区域监控',
          component: () => import('./views/vehicle-monitor/RegionalMonitor.vue')
        },
        {
          path: '/cljk/dzwl',
          name: '电子围栏',
          component: () => import('./views/vehicle-monitor/ElectricFence.vue')
        },
        {
          path: '/cljk/zdqyjk',
          name: '重点区域监控',
          component: () => import('./views/vehicle-monitor/KeyAreaMonitor.vue')
        },
        {
          path: '/cljk/hksp',
          name: '海康视频',
          component: () => import('./views/vehicle-monitor/HaikangVideo.vue')
        },
        {
          path: '/cljk/tysp',
          name: '通用视频',
          component: () => import('./views/vehicle-monitor/UniversalVideo.vue')
        },
        {
          path: '/cljk/xxxf',
          name: '消息下发',
          component: () => import('./views/vehicle-monitor/MessageSent.vue')
        },
        {
          path: '/cljk/cssz',
          name: '参数设置',
          component: () => import('./views/vehicle-monitor/ParameterSetting.vue')
        },
        /** 查询分析 */
        {
          path: '/cljk/sdqxbb',
          name: '速度曲线报表',
          component: () => import('./views/query-analysis/SpeedCurveReport.vue')
        },
        {
          path: '/cljk/czsw',
          name: '查找失物(全部)',
          component: () => import('./views/query-analysis/FindLostProperty.vue')
        },
        {
          path: '/cljk/czswbf',
          name: '查找失物(部分)',
          component: () => import('./views/query-analysis/FindLostPropertyPart.vue')
        },
        {
          path: '/cljk/yyjlcx',
          name: '营运记录查询',
          component: () =>
            import('./views/query-analysis/OperationRecordInquiry.vue')
        },
        {
          path: '/cljk/yysjtj',
          name: '营运数据统计',
          component: () =>
            import('./views/query-analysis/OperationalDataStatistics.vue')
        },
        {
          path: '/cljk/yyrb',
          name: '营运日报',
          component: () => import('./views/query-analysis/OperatingDaily.vue')
        },
        {
          path: '/cljk/yyyb',
          name: '营运月报',
          component: () =>
            import('./views/query-analysis/OperatingMonthlyReport.vue')
        },
        {
          path: '/cljk/wxjlcx',
          name: '维修记录查询',
          component: () =>
            import('./views/query-analysis/MaintenanceRecordInquiry.vue')
        },
        {
          path: '/cljk/xxjlcx',
          name: '消息记录查询',
          component: () =>
            import('./views/query-analysis/MessageRecordQuery.vue')
        },
        {
          path: '/cljk/wzcx',
          name: '违章查询',
          component: () => import('./views/query-analysis/Violation.vue')
        },
        {
          path: '/cljk/tscx',
          name: '投诉查询',
          component: () => import('./views/query-analysis/ComplaintInquiry.vue')
        },
        /**数据查询 */
        {
          path: '/sjtj/szltj',
          name: '实载率统计',
          component: () =>
            import('./views/data-statistics/MileageStatistics.vue')
        },
        {
          path: '/sjtj/dccltj',
          name: '单车里程统计',
          component: () =>
            import('./views/data-statistics/CyclingMileageStatistics.vue')
        },
        {
          path: '/sjtj/clsxtj',
          name: '车辆上线情况统计',
          component: () =>
            import('./views/data-statistics/VehicleOnlineStatistics.vue')
        },
        {
          path: '/sjtj/wyysj',
          name: '无营运数据车辆',
          component: () =>
            import('./views/data-statistics/NoCampDataVehicle.vue')
        },
        {
          path: '/sjtj/wsxcl',
          name: '未上线车辆查询',
          component: () =>
            import('./views/data-statistics/UnlistedVehicleInquiry.vue')
        },
        {
          path: '/sjtj/sxwyy',
          name: '上线无营运车辆',
          component: () =>
            import('./views/data-statistics/NoOperatingVehicleOnLine.vue')
        },
        {
          path: '/sjtj/yywsx',
          name: '营运未上线车辆',
          component: () =>
            import('./views/data-statistics/OperatingUnlistedVehicles.vue')
        },
        {
          path: '/sjtj/wsxwyy',
          name: '未上线未营运车辆',
          component: () =>
            import('./views/data-statistics/UnoperatedVehicle.vue')
        },
        {
          path: '/sjtj/wkzcbh',
          name: '无空重车变化车辆',
          component: () =>
            import('./views/data-statistics/NoEmptyVehicleChangeVehicle.vue')
        },
        {
          path: '/sjtj/wqdqt',
          name: '无签到签退',
          component: () =>
            import('./views/data-statistics/UnSignInAndSignOff.vue')
        },
        /**基础数据 */
        {
          path: '/jcsj/clzgl',
          name: '车辆组管理',
          component: () => import('./views/basic-data/VehicleGroupManage.vue')
        },
        {
          path: '/jcsj/qygl',
          name: '区域管理',
          component: () => import('./views/basic-data/RegionalManage.vue')
        },
        {
          path: '/jcsj/dzwlgl',
          name: '电子围栏管理',
          component: () =>
            import('./views/basic-data/ElectronicFenceManage.vue')
        },
        {
          path: '/jcsj/ptsyjl',
          name: '平台使用记录',
          component: () => import('./views/basic-data/PlatformUsageRecord.vue')
        },
        {
          path: '/jcsj/yhgl',
          name: '用户管理',
          component: () => import('./views/basic-data/UserManage.vue')
        },
        {
          path: '/jcsj/gwgl',
          name: '岗位管理',
          component: () => import('./views/basic-data/JobManage.vue')
        },
        {
          path: '/jcsj/dlclzgl',
          name: '独立车辆组管理',
          component: () => import('./views/basic-data/IndependentVehicle.vue')
        },
        {
          path: '/jcsj/clzyhgl',
          name: '车辆组用户管理',
          component: () => import('./views/basic-data/VehicleGroupUsers.vue')
        },
        // {
        //   path: '/jcsj/qxgl',
        //   name: '权限管理',
        //   component: () => import('./views/basic-data/AuthorityManage.vue')
        // },
        /**函件管理 */
        {
          path: '/hjgl/zrsq',
          name: '转入申请',
          component: () => import('./views/mail-manage/TransferApplication.vue')
        },
        {
          path: '/hjgl/zcsq',
          name: '转出申请',
          component: () =>
            import('./views/mail-manage/OutTransferApplication.vue')
        },
        {
          path: '/hjgl/btsq',
          name: '报停申请',
          component: () => import('./views/mail-manage/StopApplication.vue')
        },
        {
          path: '/hjgl/bgsq',
          name: '变更申请',
          component: () =>
            import('./views/mail-manage/ApplicationRegardingChanges.vue')
        },
        {
          path: '/hjgl/sjjrsq',
          name: '数据接入申请',
          component: () =>
            import('./views/mail-manage/DataAccessApplication.vue')
        },
        {
          path: '/hjgl/zrtj',
          name: '转入统计',
          component: () => import('./views/mail-manage/TransferStatistics.vue')
        },
        {
          path: '/hjgl/zctj',
          name: '转出统计',
          component: () =>
            import('./views/mail-manage/OutTransferStatistics.vue')
        },
        {
          path: '/hjgl/bttj',
          name: '报停统计',
          component: () => import('./views/mail-manage/StopStatistics.vue')
        },
        {
          path: '/hjgl/bgtj',
          name: '变更统计',
          component: () => import('./views/mail-manage/ChangeStatistics.vue')
        }
      ]
    },
    {
      path: '/login',
      name: '登录',
      component: () => import('./views/Login.vue')
    },
    { path: '*', redirect: '/404', hidden: true },
    {
      path: '/404',
      name: '404',
      component: () => import('./views/NotFound.vue')
    }
  ]
})

export default router
