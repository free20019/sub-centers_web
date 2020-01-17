<template>
  <div class="tw-setting-template">
    <div style="float:left;width:50%">
      <div class="tw-setting tab" ref="setting">
        <div class="el-divider__text is-left">终端发送设置</div>
        <div class="tw-setting-form tab">
          <el-form label-width="180px">
            <el-form-item label="终端心跳发送间隔（秒）">
              <el-input @change="editEvent('0x0001')" v-model="setting['0x0001']"></el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="tw-setting tab">
        <div class="el-divider__text is-left">位置汇报位置</div>
        <div class="tw-setting-inside">
          <div class="el-divider__text is-left">位置汇报策略</div>
          <div class="tw-setting-form tab">
            <el-form label-width="10px">
              <el-form-item>
                <el-radio-group @change="editEvent('0x0020')" v-model="setting['0x0020']">
                  <el-radio :label="0">定时汇报</el-radio>
                  <el-radio :label="1">定距汇报</el-radio>
                  <el-radio :label="2">定时和定距</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-form>
          </div>
        </div>
        <div class="tw-setting-inside">
          <div class="el-divider__text is-left">位置汇报方案</div>
          <div class="tw-setting-form tab">
            <el-form>
              <el-form-item label-width="30px">
                <el-radio-group @change="editEvent('0x0021')" v-model="setting['0x0021']">
                  <el-radio :label="0">根据ACC状态</el-radio>
                  <el-radio :label="1">根据空重车状态</el-radio>
                  <el-radio :label="3">根据登录状态和空重车状态</el-radio>
                  <el-radio :label="2">根据登录状态和ACC状态</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
      <div class="tw-setting tab">
        <div class="el-divider__text is-left">终端发送设置</div>
        <div class="tw-setting-form tab">
          <el-form label-width="230px" label-position="left">
            <el-form-item label="驾驶员未登录汇报时间间隔（秒）">
              <el-input @change="editEvent('0x0022')" v-model="setting['0x0022']"></el-input>
            </el-form-item>
            <el-form-item label="ACC OFF汇报时间间隔（秒）">
              <el-input @change="editEvent('0x0023')" v-model="setting['0x0023']"></el-input>
            </el-form-item>
            <el-form-item label="ACC ON时间汇报时间间隔（秒）">
              <el-input @change="editEvent('0x0024')" v-model="setting['0x0024']"></el-input>
            </el-form-item>
            <el-form-item label="空车时间汇报时间间隔（秒）">
              <el-input @change="editEvent('0x0025')" v-model="setting['0x0025']"></el-input>
            </el-form-item>
            <el-form-item label="重车时间汇报时间间隔（秒）">
              <el-input @change="editEvent('0x0026')" v-model="setting['0x0026']"></el-input>
            </el-form-item>
            <el-form-item label="休眠时汇报时间间隔（秒）">
              <el-input @change="editEvent('0x0027')" v-model="setting['0x0027']"></el-input>
            </el-form-item>
            <el-form-item label="紧急报警时汇报时间间隔（秒）">
              <el-input @change="editEvent('0x0028')" v-model="setting['0x0028']"></el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
    <div style="float:left;width:50%">
      <div class="tw-setting tab">
        <div class="el-divider__text is-left">其他设置</div>
        <div class="tw-setting-form tab">
          <el-form label-width="120px">
            <el-form-item label="拐点补传角度">
              <el-input @change="editEvent('0x0030')" v-model="setting['0x0030']"></el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>

      <div class="tw-setting tab" style="margin-bottom:68px">
        <div class="el-divider__text is-left">SMS设置</div>
        <div class="tw-setting-form tab">
          <el-form label-width="180px" label-position="left">
            <el-form-item label="消息应答超时时间（秒）">
              <el-input @change="editEvent('0x0004')" v-model="setting['0x0004']"></el-input>
            </el-form-item>
            <el-form-item label="消息重传次数">
              <el-input @change="editEvent('0x0005')" v-model="setting['0x0005']"></el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>

      <div class="tw-setting tab">
        <div class="el-divider__text is-left">距离间隔汇报设置</div>
        <div class="tw-setting-form tab">
          <el-form label-width="230px" label-position="left">
            <el-form-item label="驾驶员未登录汇报时间间隔（米）">
              <el-input @change="editEvent('0x0029')" v-model="setting['0x0029']"></el-input>
            </el-form-item>
            <el-form-item label="ACC OFF汇报时间间隔（米）">
              <el-input @change="editEvent('0x002a')" v-model="setting['0x002a']"></el-input>
            </el-form-item>
            <el-form-item label="ACC ON时间汇报时间间隔（米）">
              <el-input @change="editEvent('0x002b')" v-model="setting['0x002b']"></el-input>
            </el-form-item>
            <el-form-item label="空车时间汇报时间间隔（米）">
              <el-input @change="editEvent('0x002c')" v-model="setting['0x002c']"></el-input>
            </el-form-item>
            <el-form-item label="重车时间汇报时间间隔（米）">
              <el-input @change="editEvent('0x002d')" v-model="setting['0x002d']"></el-input>
            </el-form-item>
            <el-form-item label="休眠时汇报时间间隔（米）">
              <el-input @change="editEvent('0x002e')" v-model="setting['0x002e']"></el-input>
            </el-form-item>
            <el-form-item label="紧急报警时汇报时间间隔（米）">
              <el-input @change="editEvent('0x002f')" v-model="setting['0x002f']"></el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ReportingParameters',
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
  width: 90%;
  margin-right: 5%;
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
