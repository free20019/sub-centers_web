<template>
  <div class="tw-setting-template">
    <div style="float:left;width:33.333%">
      <div class="tw-setting tab">
        <div class="el-divider__text is-left">车辆信息设置</div>
        <div class="tw-setting-form tab">
          <el-form>
            <span class="setting-label">车辆里程表读数，1/10km</span>
            <el-form-item>
              <el-input @change="editEvent('0x0080')" v-model="setting['0x0080']"></el-input>
            </el-form-item>
            <span class="setting-label">车辆所在的省域ID</span>
            <el-form-item>
              <el-input @change="editEvent('0x0081')" v-model="setting['0x0081']"></el-input>
            </el-form-item>
            <span class="setting-label">车辆所在的市域ID</span>
            <el-form-item>
              <el-input @change="editEvent('0x0082')" v-model="setting['0x0082']"></el-input>
            </el-form-item>
            <span class="setting-label">出租车企业营运许可证号</span>
            <el-form-item>
              <el-input @change="editEvent('0x00892')" v-model="setting['0x0092']"></el-input>
            </el-form-item>
            <span class="setting-label">出租车企业简称</span>
            <el-form-item>
              <el-input @change="editEvent('0x0093')" v-model="setting['0x0093']"></el-input>
            </el-form-item>
            <span class="setting-label">出租车车牌号码（不包含汉字）</span>
            <el-form-item>
              <el-input @change="editEvent('0x0094')" v-model="setting['0x0094']"></el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="tw-setting-form tab" style="padding-top:0px">
        <el-form>
          <span class="setting-label">终端设备维护密码</span>
          <el-form-item>
            <el-input @change="editEvent('0x004a')" v-model="setting['0x004a']"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div style="float:left;width:33.333%;height:100%">
      <div class="tw-setting tab" style="height:100%">
        <div class="el-divider__text is-left">驾驶设置</div>
        <div class="tw-setting-form tab">
          <el-form>
            <span class="setting-label">最高速度（km/h）</span>
            <el-form-item>
              <el-input @change="editEvent('0x0055')" v-model="setting['0x0055']"></el-input>
            </el-form-item>
            <span class="setting-label">超速持续时间（秒）</span>
            <el-form-item>
              <el-input @change="editEvent('0x0056')" v-model="setting['0x0056']"></el-input>
            </el-form-item>
            <span class="setting-label">连续驾驶时间门限（秒）</span>
            <el-form-item>
              <el-input @change="editEvent('0x0057')" v-model="setting['0x0057']"></el-input>
            </el-form-item>
            <span class="setting-label">当天累计驾驶时间门限（秒）</span>
            <el-form-item>
              <el-input @change="editEvent('0x005a')" v-model="setting['0x005a']"></el-input>
            </el-form-item>
            <span class="setting-label">最小休息时间（秒）</span>
            <el-form-item>
              <el-input @change="editEvent('0x0058')" v-model="setting['0x0058']"></el-input>
            </el-form-item>
            <span class="setting-label">最长停车时间（秒）</span>
            <el-form-item>
              <el-input @change="editEvent('0x0059')" v-model="setting['0x0059']"></el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
    <div style="float:left;width:33.333%">
      <div class="tw-setting tab">
        <div class="el-divider__text is-left">计价器设置</div>
        <div class="tw-setting-form tab">
          <el-form>
            <span class="setting-label">营运次数限制：0-9999；0：不限制</span>
            <el-form-item>
              <el-input @change="editEvent('0x0090')" v-model="setting['0x0090']"></el-input>
            </el-form-item>
            <span class="setting-label">营运时间限制(yyyyMMDDhh);0000000000：不限制</span>
            <el-form-item>
              <el-input @change="editEvent('0x0091')" v-model="setting['0x0091']"></el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="tw-setting tab">
        <div class="el-divider__text is-left">智能终端录音模式</div>
        <div class="tw-setting-form tab">
          <el-form>
            <el-radio-group @change="editEvent('0x00a0')" v-model="setting['0x00a0']">
              <el-radio :label="1">全程录音</el-radio>
              <el-radio :label="2">翻盘录音</el-radio>
            </el-radio-group>
          </el-form>
        </div>
      </div>
      <div class="tw-setting-form tab" style="padding-top:0px">
        <el-form>
          <span class="setting-label">智能终端录音文件最大时长（0-255）分钟</span>
          <el-form-item>
            <el-input @change="editEvent('0x00a1')" v-model="setting['0x00a1']"></el-input>
          </el-form-item>
          <span class="setting-label">液晶（LCD）心跳间隔（单位S 1-60）</span>
          <el-form-item>
            <el-input @change="editEvent('0x00a2')" v-model="setting['0x00a2']"></el-input>
          </el-form-item>
          <span class="setting-label">LED心跳时间间隔（单位S 1-60）</span>
          <el-form-item>
            <el-input @change="editEvent('0x00a3')" v-model="setting['0x00a3']"></el-input>
          </el-form-item>
          <span class="setting-label">ACC OFF后进入休眠模式时间间隔， 单位S</span>
          <el-form-item>
            <el-input @change="editEvent('0x00af')" v-model="setting['0x00af']"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BasicInfo',
  data() {
    return {
      radio: 1
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
  width: 90%;
  margin-right: 5%;
}
.tw-setting-form {
  padding: 15px 5px 5px 10px;
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
