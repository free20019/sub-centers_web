<template>
  <t-layout header="75" header-class="tw-header" style="overflow: hidden;">
    <template v-slot:header>
      <div class="tw-header">出租车分中心监控平台</div>
      <div class="tw-menu-nav">
        <t-menu-group
          class="tw-menu-nav-item"
          tpClass="tw-menu-nav"
          v-for="item in menuList"
          :key="item.id"
          :id="item.id"
          :icon="item.icon"
          :title="item.title"
          @title-click="handleMenuGroupTitleClick"
          :visible="menuGroupActive === item.id"
        >
          <t-menu-item
            v-for="child in item.children"
            :key="child.id"
            :url="child.href"
            @menu-item-click="handleMenuItemClick(child)"
          >
            <i class="tw-icon-img" :class="child.icon"></i>
            <span class="tw-title">{{ child.title }}</span>
          </t-menu-item>
        </t-menu-group>
        <transition name="menu-modal">
          <div
            class="tw-menu-modal"
            v-if="menuGroupActive"
            @click="handleMenuModalClick"
          ></div>
        </transition>
      </div>
      <div class="tw-system-box">
        <div class="tw-system-item">
          <i class="el-icon-user"></i>
          {{ realname }}
        </div>
        <div class="tw-system-item">
          <i class="el-icon-switch-button" @click="handleCloseClick"></i>
        </div>
      </div>
      <div class="tw-heading-box">
        <i class="el-icon-caret-right"></i>
        {{ routerName }}
      </div>
    </template>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <div
      class="tw-box tw-call-police iconfont icon-call-police"
      :class="{ alarm: table.isAlarmNum }"
      @click="handleCallPoliceClick"
    >
      <div class="tw-num" v-if="table.isAlarmNum">{{ table.num }}</div>
    </div>
    <el-dialog
      class="tw-dialog"
      :title="dialog.title"
      :visible.sync="dialog.display"
      width="900px"
    >
      <t-table-page :data="table.data" height="560" :page-size="table.pageSize">
        <el-table-column
          type="index"
          label="编号"
          align="center"
          width="60"
        ></el-table-column>
        <el-table-column
          prop="COMP_NAME"
          label="公司名称"
          align="center"
          width="250"
        ></el-table-column>
        <el-table-column
          prop="VEHI_NO"
          label="车牌号码"
          align="center"
          width="90"
        ></el-table-column>
        <el-table-column
          prop="MDT_NO"
          label="终端编号"
          align="center"
          width="110"
        ></el-table-column>
        <el-table-column
          prop="VEHI_SIM"
          label="SIM卡号"
          align="center"
          width="100"
        ></el-table-column>
        <el-table-column
          prop="SPEED"
          label="速度(KM/H)"
          align="center"
          width="90"
        ></el-table-column>
        <el-table-column
          prop="STIME"
          label="报警时间"
          align="center"
          min-width="130"
          show-overflow-tooltip
          :resizable="false"
        >
          <template slot-scope="scope">
            <span v-text="stime(scope.row.STIME)"></span>
          </template>
        </el-table-column>
      </t-table-page>
    </el-dialog>
  </t-layout>
</template>

<script>
import { baseURL } from 'util'
import { mapState } from 'vuex'
import { getMenu } from 'assets/js/menu'
import axios from 'axios'
import moment from 'moment'
export default {
  name: 'Index',
  data() {
    return {
      menuList: [],
      menuGroupActive: '',
      realname: '',
      dialog: {
        display: false,
        title: '紧急报警'
      },
      table: {
        data: [],
        pageSize: 10,
        isAlarmNum: false,
        num: 0
      }
    }
  },
  mounted() {
    this.getLoginType()
    this.getMenuList()
    this.getEmergencyAlarm()
    setInterval(this.getEmergencyAlarm, 1000 * 30)
  },
  computed: {
    ...mapState(['username']),
    routerName() {
      return this.$route.name || ''
    }
  },
  methods: {
    stime(date) {
      return moment(date).format('YYYY-MM-DD HH:mm:ss')
    },
    getLoginType() {
      console.log(baseURL,'map/loginType')
      axios.get('map/loginType', { baseURL }).then(res => {
        this.$cookies.set('loginType', res.data.loginType)
        this.$cookies.set('userId', res.data.userId)
      })
    },
    getMenuList() {
      axios.get('map/getUser', { baseURL }).then(res => {
        if (res.data.power == 'null') {
          this.$router.push({ name: '登录' })
        } else {
          this.realname = res.data.realname
          console.log(res.data.power)
          const power = res.data.power.split(',')
          this.menuList = getMenu(power)
          this.$cookies.set('center', res.data.center)
        }
      })
      // const power = 'jjbjclcl,ddsjtc,zdxxxf,fwpjsj,cssz,xxxf,lsgj,wzjk,dcjk,tysp,fpjk,qyjk,hksp,yyrb,wzcx,yysjtj,yyjlcx,xxjlcx,czsw,wxjlcx,sdqxbb,yyyb,zrsq,bttj,clzgl,cltj,wsxcl,sxwyy,dccltj,clsxtj,yywsx,wsxwyy,wsxwyy,wysjcl,gwgl,yhgl,ptsyjl,qygl,zcsq,bgtj,axywycjl,cljsygl,btsq,bgsq,zrtj,zctj,tscx,sjjrsq,wqdqt,dlclzgl,clzyhgl,czswbf,szltj,wkzcbh'
      // this.menuList = getMenu(power.split(','))
    },
    handleMenuGroupTitleClick(id) {
      if (this.menuGroupActive === id) this.menuGroupActive = ''
      else this.menuGroupActive = id
    },
    handleMenuItemClick(item) {
      if (item.title == '通用视频') {
        axios
          .post(
            'http://localhost:55123/dhvideo.html?dest=http://localhost:8080/subcenters/tongyong.html&username=1'
          )
          .then(function() {})
      } else if (item.title == '海康视频') {
        axios
          .post(
            'http://localhost:55123/hkvideo.html?dest=http://localhost:8080/subcenters/haikang.html&username=1'
          )
          .then(function() {})
      }
      this.handleMenuModalClick()
    },
    handleMenuModalClick() {
      this.menuGroupActive = ''
    },
    handleCloseClick() {
      this.$confirm('是否登出?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        axios.get('map/logout', { baseURL }).then(res => {})
        this.$store.commit('LOGIN', { name: '', power: [] })
        this.$router.push({ name: '登录' })
      })
    },
    handleCallPoliceClick() {
      if (this.table.num > 0) this.dialog.display = true
    },
    getEmergencyAlarm() {
      axios.get('map/getMonitor', { baseURL }).then(res => {
        let vehilist = Object.freeze(res.data.vehilist)
        let one = ''
        let data = []
        for (let i = 0; i < vehilist.length; i++) {
          if (
            new Date().getTime() - parseFloat(vehilist[i].STIME) <=
            1000 * 60 * 5
          ) {
            if (vehilist[i].ALARMSTATUS.length == 8) {
              one = vehilist[i].ALARMSTATUS.substring(7, 8)
              if (
                one == '1' ||
                one == '3' ||
                one == '5' ||
                one == '7' ||
                one == '9' ||
                one == 'B' ||
                one == 'D' ||
                one == 'F'
              ) {
                data.push(vehilist[i])
              }
            }
          }
        }
        this.table.data = data
        if (data.length > 0) {
          this.table.num = data.length
          this.table.isAlarmNum = true
        }
      })
    }
  }
}
</script>

<style lang="scss"></style>
<style lang="scss" scoped>
.tw-menu {
  &-modal {
    position: fixed;
    top: 40px;
    left: 0;
    width: 100%;
    height: calc(100% - 40px);
    background-color: rgba(0, 0, 0, 0.3);
    z-index: 2001;
  }
}
.tw-system {
  &-box {
    position: absolute;
    top: calc(50% - 18px);
    right: 15px;
    font-size: 18px;
    color: #ffffff;
    transform: translateY(-50%);
  }
  &-item {
    display: inline-block;
    margin-right: 10px;
    &:last-child {
      margin-right: 0;
    }
    i {
      display: inline-block;
      width: 30px;
      height: 30px;
      line-height: 30px;
      text-align: center;
      &.el-icon-switch-button {
        &:hover {
          color: #e81123;
        }
      }
    }
  }
}
.tw-heading-box {
  height: 35px;
  padding-left: 20px;
  padding-right: 20px;
  border-bottom: 1px solid #eeeeee;
  font-size: 20px;
  font-weight: 400;
  line-height: 35px;
  letter-spacing: 0.1em;
  background-color: #ffffff;
}

.tw-box {
  &.tw-call-police {
    position: absolute;
    bottom: 4px;
    right: 4px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    box-shadow: 0 0 0 2px #aaaaaa, 0 0 6px 4px #eeeeee, inset 0 0 4px #eeeeee;
    background-color: #ffffff;
    transform: translate(29px, 29px);
    transition: transform 0.3s linear;
    z-index: 10;
    user-select: none;
    cursor: pointer;

    &::before {
      display: inline-block;
      width: 50px;
      height: 50px;
      margin-top: -5px;
      font-size: 28px;
      text-align: center;
      line-height: 50px;
      color: #999999;
    }

    &::after {
      content: '';
      position: absolute;
      width: calc(100% + 30px);
      height: calc(100% + 30px);
      margin: -15px;
      border-radius: inherit;
    }

    &:hover {
      transform: translate(0, 0);
    }

    &.alarm {
      box-shadow: 0 0 0 2px #e81123, 0 0 6px 4px #ee5b06, inset 0 0 4px #ee9106;

      &::before {
        color: #e81123;
        animation: callPolice 0.5s;
        animation-iteration-count: 0;
      }
    }

    .tw-num {
      position: absolute;
      top: 55%;
      width: 100%;
      margin-top: 5px;
      font-size: 12px;
      font-weight: 500;
      text-align: center;
      color: #e81123;
    }
  }
}

@keyframes callPolice {
  0% {
    text-shadow: 0 0 2px #e81123;
  }
  30% {
    text-shadow: 0 0 2px #ee5b06;
  }
  60% {
    text-shadow: 0 0 2px #ee8206;
  }
}
</style>
