<template>
  <div class="tw-template-wrapper">
    <div class="login__background"></div>
    <img class="tw-login-img" :src="getBackgroundImage" />
    <div class="tw-login-icon"></div>
    <div class="tw-login-header">
      <div class="tw-title">出租车分中心监控平台</div>
      <div class="tw-title_sub">提供全方位的出租车资讯与服务，定制个性化的运营平台</div>
    </div>
    <div class="tw-login__panel">
      <el-form class="tw-login-box" :model="login" ref="login">
        <el-form-item>
          <div class="tw-login-title">
            <span class="tw-title__prompt">欢迎您登录出租车分中心监控平台</span>
          </div>
          <div class="tw-login-title">
            <span class="tw-title">用户登录</span>
            <span class="tw-title__sub">user login</span>
          </div>
        </el-form-item>
        <el-form-item>
          <template v-slot:label>
            <span class="tw-title">用户名</span>
            <span class="tw-title__sub">user name</span>
          </template>
          <el-input v-model="login.username"></el-input>
        </el-form-item>
        <el-form-item>
          <template v-slot:label>
            <span class="tw-title">密码</span>
            <span class="tw-title__sub">password</span>
          </template>
          <el-input v-model="login.password" @keyup.native.enter="handleLoginClick" show-password></el-input>
        </el-form-item>
        <el-form-item>
          <template v-slot:label>
            <span class="tw-title">登录类型</span>
            <span class="tw-title__sub">login type</span>
          </template>
          <el-select v-model="login.type" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <template v-slot:label>
            <el-checkbox v-model="login.checked">记住密码</el-checkbox>
          </template>
        </el-form-item>
        <el-form-item>
          <el-button class="btn-login tw-block" type="primary" @click="handleLoginClick">登&emsp;陆</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
import { baseURL } from 'util'
import bgImg from 'images/bg-img.png'

export default {
  name: 'Login',
  data() {
    return {
      login: {
        username: '',
        password: '',
        type: '0',
        checked: true
      },
      options: [{
        value: '0',
        label: '企业用户'
      }, {
        value: '1',
        label: '车辆组用户'
      }]
    }
  },
  computed: {
    getBackgroundImage() {
      return bgImg
    }
  },
  mounted() {
    this.loginCookie()
  },
  methods: {
    loginCookie() {
      this.login.username = this.$cookies.get('username')
      this.login.password = this.$cookies.get('password')
      if(this.$cookies.get('type') != null)
         this.login.type = this.$cookies.get('type')
    },
    userLogin() {
      const { username, password, type } = this.login
      const params = new URLSearchParams()
      params.append('username', username)
      params.append('password', password)
      params.append('type', type)
      // this.table.gpsData.loading = true
      if(this.login.checked){
        this.$cookies.set('username', username)
        this.$cookies.set('password', password)
        this.$cookies.set('type', type)
      }
      return axios.post('common/login', params, { baseURL }).then(async res => {
        console.log(res.data)
        if (res.data.info != 0)
          return this.$message({ message: '登录失败', type: 'warning' })
        const data = (res.data.list && res.data.list[0]) || {}
        const name = data.REAL_NAME || ''
        const power = (data.POWER_IDS && data.POWER_IDS.split(',')) || []
        this.$cookies.set('loginType', data.LOGINTYPE)
        this.$cookies.set('userId', data.ID)
        await this.$store.commit('LOGIN', { name, power })
        this.$router.push({ name: 'Index' })
      })
    },
    handleLoginClick() {
      const { username, password } = this.login
      if (!username)
        return this.$message({ message: '用户名不能为空', type: 'warning' })
      if (!password)
        return this.$message({ message: '密码不能为空', type: 'warning' })
      this.userLogin()
    }
  }
}
</script>
<style lang="scss">
.tw-login {
  $width: 400px;

  &-img {
    position: absolute;
    top: 50%;
    width: calc(100% - #{$width});
    height: 100%;
    transform: translateY(-50%);
  }
  &__panel {
    position: absolute;
    top: 0;
    right: 0;
    width: $width;

    .el-form-item {
      &__label {
        margin-top: -10px;
        font-size: 18px;
        color: #ffffff;
        .tw-title {
          margin-right: 10px;
          &__sub {
            font-variant: small-caps;
            letter-spacing: 0.08em;
            color: rgba(255, 255, 255, 0.8);
          }
        }
      }
    }
  }
  &-icon {
    position: absolute;
    top: 10%;
    left: 40px;
    display: inline-block;
    width: 60px;
    height: 60px;
    background-image: url(../assets/image/icon-car.png);
    background-size: 100% 100%;
    background-repeat: no-repeat;
    transform: translateY(-50%);
  }
  &-header {
    position: absolute;
    top: 18%;
    left: calc((100% - #{$width}) / 2);
    font-family: '微软雅黑', 'Franklin Gothic Medium', Arial, sans-serif;
    font-size: 36px;
    font-weight: 400;
    letter-spacing: 4px;
    text-align: center;
    text-shadow: 2px 2px 4px #666666;
    color: #ffffff;
    transform: translateX(-50%);

    .tw-title {
      margin-bottom: 10px;
      font-weight: 600;
      &_sub {
        font-size: 16px;
        letter-spacing: 0.01em;
      }
    }
  }
  &-title {
    font-size: 18px;
    color: #ffffff;
    user-select: none;
    .tw-title {
      display: block;
      padding-bottom: 3px;
      border-bottom: 1px solid #ffffff;
      font-size: 28px;
      font-weight: 500;
      letter-spacing: 0.2em;
      &__prompt {
        color: rgba(255, 255, 255, 0.8);
      }
      &__sub {
        font-size: 28px;
        font-variant: small-caps;
        line-height: 1;
      }
    }

    + .tw-login-title {
      margin-bottom: 15px;
    }
  }
  &-box {
    width: $width;
    padding: 60% 100px 0 22px;
    border-top-right-radius: inherit;
    border-bottom-right-radius: inherit;
    transition: padding 0.3s linear;

    .el-input {
      &__inner {
        height: 40px;
        border: none;
        // border-radius: 0;
        // border-bottom: 4px solid #f5f3f4;
        font-size: 22px;
        line-height: 1.5;
        background-color: rgba(255, 255, 255, 0.85);

        &:focus {
          box-shadow: none;
        }
      }
    }
    .btn-login {
      text-indent: -9999px;
      background-image: url(../assets/image/btn-login.png);
      background-size: 100% 100%;
    }
  }
}
</style>

<style lang="scss" scope>
  .login__background {
    height: 100%;
    background-image: url(../assets/image/bg-color-img.png);
    background-size: 100% 100%;
    background-repeat: no-repeat;
  }
@media screen and (max-width: 1000px) {
  .tw-login {
    &-img {
      width: 100%;
    }
    &__panel {
      top: calc(50% + 8px);
      left: 50%;
      transform: translate(-50%, -50%);
    }
    &-header {
      left: 50%;
      white-space: nowrap;
    }
    &-box {
      padding-top: 40%;
    }
  }
}
@media screen and (max-height: 800px) {
  .tw-login {
    &-box {
      padding-top: 45%;
    }
  }
}
</style>
