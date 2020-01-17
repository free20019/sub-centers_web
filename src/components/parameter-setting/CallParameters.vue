<template>
  <div class="tw-setting-template">
    <div class="tw-setting tab" style="height:100%">
      <div class="el-divider__text is-left">通信电话设置</div>
      <div class="tw-setting-form long">
        <el-form label-width="200px" label-position="left">
          <el-form-item label="监控平台电话号码">
            <el-input @change="editEvent('0x0040')" v-model="setting['0x0040']"></el-input>
          </el-form-item>
          <el-form-item label="复位电话号码">
            <el-input @change="editEvent('0x0041')" v-model="setting['0x0041']"></el-input>
          </el-form-item>
          <el-form-item label="恢复出厂设置电话">
            <el-input @change="editEvent('0x0012')" v-model="setting['0x0012']"></el-input>
          </el-form-item>
          <el-form-item label="监控平台SMS电话">
            <el-input @change="editEvent('0x0013')" v-model="setting['0x0013']"></el-input>
          </el-form-item>
          <el-form-item label="接收终端SMS文本报警号码">
            <el-input @change="editEvent('0x0014')" v-model="setting['0x0014']"></el-input>
          </el-form-item>
        </el-form>
        <el-form>
          <span class="setting-label">每次最长通话时间（秒）</span>
          <el-form-item>
            <el-input @change="editEvent('0x0046')" v-model="setting['0x0046']"></el-input>
            <!--<el-radio-group>-->
            <!--<el-radio :label="0">不通话</el-radio>-->
            <!--<el-radio :label="1">无限制</el-radio>-->
            <!--<el-radio :label="2">取消</el-radio>-->
            <!--</el-radio-group>-->
          </el-form-item>
          <span class="setting-label">当月最长通话时间（秒）</span>
          <el-form-item>
            <el-input @change="editEvent('0x0047')" v-model="setting['0x0047']"></el-input>
            <!--<el-radio-group>-->
              <!--<el-radio :label="0">不通话</el-radio>-->
              <!--<el-radio :label="1">无限制</el-radio>-->
              <!--<el-radio :label="2">取消</el-radio>-->
            <!--</el-radio-group>-->
          </el-form-item>
        </el-form>
        <el-form label-width="150px" label-position="left">
          <el-form-item label="电话短号长度">
            <el-input @change="editEvent('0x0048')" v-model="setting['0x0048']"></el-input>
          </el-form-item>
          <el-form-item label="监听电话号码">
            <el-input @change="editEvent('0x0049')" v-model="setting['0x0049']"></el-input>
          </el-form-item>
          <el-form-item label="语音播报音量（0-9）">
            <el-input @change="editEvent('0x004b')" v-model="setting['0x004b']"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="tw-setting tab">
      <div class="el-divider__text is-left">终端电话接听策略</div>
      <div class="tw-setting-form radio">
        <el-form>
          <el-form-item>
            <el-radio-group @change="editEvent('0x0045')" v-model="setting['0x0045']">
            <el-radio :label="0">自动接听</el-radio>
            <el-radio :label="1">ACC ON时自动接听；OFF时手动接听</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CallParameters',
  data() {
    return {
      radio: 3
    }
  },
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
  width: 40%;
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
.setting-label {
  line-height: 40px;
}
</style>
