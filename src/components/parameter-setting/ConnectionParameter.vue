<template>
  <div class="tw-setting-template">
    <div class="tw-setting tab">
      <div class="el-divider__text is-left">主服务器设置</div>
      <div class="tw-setting-form tab">
        <el-form label-width="180px" label-position="left">
          <el-form-item label="无线通信拨号访问点">
            <el-input @change="editEvent('0x0010')" v-model="setting['0x0010']"></el-input>
          </el-form-item>
          <el-form-item label="无线通信拨号用户名">
            <el-input @change="editEvent('0x0011')" v-model="setting['0x0011']"></el-input>
          </el-form-item>
          <el-form-item label="无线通信拨号密码">
            <el-input @change="editEvent('0x0012')" v-model="setting['0x0012']"></el-input>
          </el-form-item>
          <el-form-item label="地址、IP或域名">
            <el-input @change="editEvent('0x0013')" v-model="setting['0x0013']"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="tw-setting tab">
      <div class="el-divider__text is-left">备份服务器设置</div>
      <div class="tw-setting-form tab">
        <el-form label-width="180px">
          <el-form-item label="无线通信拨号访问点">
            <el-input @change="editEvent('0x0014')" v-model="setting['0x0014']"></el-input>
          </el-form-item>
          <el-form-item label="无线通信拨号用户名">
            <el-input @change="editEvent('0x0015')" v-model="setting['0x0015']"></el-input>
          </el-form-item>
          <el-form-item label="无线通信拨号密码">
            <el-input @change="editEvent('0x0016')" v-model="setting['0x0016']"></el-input>
          </el-form-item>
          <el-form-item label="地址、IP或域名">
            <el-input @change="editEvent('0x0017')" v-model="setting['0x0017']"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="tw-setting tab">
      <div class="el-divider__text is-left">TCP设置</div>
      <div class="tw-setting-form tab">
        <el-form label-width="180px">
          <el-form-item label="消息应答超时时间（S）">
            <el-input @change="editEvent('0x0002')" v-model="setting['0x0002']"></el-input>
          </el-form-item>
          <el-form-item label="消息重传次数">
            <el-input @change="editEvent('0x0003')" v-model="setting['0x0003']"></el-input>
          </el-form-item>
          <el-form-item label="主服务器TCP端口">
            <el-input @change="editEvent('0x0018')" v-model="setting['0x0018']"></el-input>
          </el-form-item>
          <el-form-item label="备份服务器TCP端口">
            <el-input @change="editEvent('0x0019')" v-model="setting['0x0019']"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="tw-setting tab">
      <div class="el-divider__text is-left">一卡通或支付平台服务器</div>
      <div class="tw-setting-form tab">
        <el-form label-width="180px">
          <el-form-item label="消息应答超时时间（S）">
            <el-input></el-input>
          </el-form-item>
          <el-form-item label="消息重传次数">
            <el-input></el-input>
          </el-form-item>
          <el-form-item label="主服务器TCP端口">
            <el-input @change="editEvent('0x001b')" v-model="setting['0x001b']"></el-input>
          </el-form-item>
          <el-form-item label="备份服务器TCP端口">
            <el-input @change="editEvent('0x001d')" v-model="setting['0x001d']"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ConnectionParameter',
  methods: {
    editEvent(info) {
      this.$emit('test',info)
    }
  },
  props: ['setting']
}
</script>

<style lang="scss" scoped>
.tw-setting-template {
  padding: 15px;
  height: 100%;
}
.tw-setting {
  position: relative;
  border: 1px solid #dcdfe6;
  border-radius: 5px;
  box-sizing: border-box;
  width: 45%;
  margin-right: 5%;
  float: left;
}
.tw-setting-form {
  padding: 5px;
}
.tw-setting-inside {
  position: relative;
  margin: 20px 5px 5px 5px;
  border: 1px solid #dcdfe6;
  border-radius: 5px;
  box-sizing: border-box;
}
</style>
