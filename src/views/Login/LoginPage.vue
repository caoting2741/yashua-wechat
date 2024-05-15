<!--
 * @Author: CaoTing
 * @Date: 2023-03-18 11:39:17
 * @Description: 
-->
<template>
  <div class="login">
    <van-form ref="loginForm" @submit="onSubmit">
      <van-field
        v-model="tel"
        name="手机号"
        label="手机号"
        placeholder="请输入手机号"
        type="tel"
        clearable
        :rules="telRules"
      />
      <van-field
        v-model="sms"
        clearable
        label="短信验证码"
        placeholder="请输入短信验证码"
        :rules="codeRules"
      >
        <template #button>
          <van-button
            size="small"
            type="info"
            native-type="button"
            :disabled="dis"
            @click="getSmsCode"
          >
            <span v-if="show">发送验证码</span>
            <span v-else>重新发送（{{ count }}s）</span>
          </van-button>
        </template>
      </van-field>
      <div style="margin: 16px 0">
        <van-button round block type="info" native-type="submit"
          >提交</van-button
        >
      </div>
    </van-form>
  </div>
</template>
<script>
import { apiRegisterUerPhone, apiSendSms } from "@/api/User";
import { mapGetters } from "vuex";
import { Toast } from "vant";
export default {
  data() {
    return {
      tel: "",
      sms: "",
      show: true,
      dis: false,
      count: "",
      timer: null,
      telRules: [
        {
          required: true,
          message: "手机号码不能为空",
          trigger: "onBlur",
        },
        {
          // 自定义校验规则
          validator: (value) => {
            // return /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/.test(
            //   value
            // );
            return /^((\+|00)86)?1[3-9]\d{9}$/.test(value);
          },
          message: "请输入正确格式的手机号码",
          trigger: "onBlur",
        },
      ],
      codeRules: [
        { required: true, message: "请填验证码" },
        { pattern: /^\d{6}$/, message: "验证码格式错误" },
      ],
    };
  },
  computed: {
    ...mapGetters(["openid"]),
  },
  methods: {
    onSubmit() {
      if (!this.tel) {
        return;
      }
      if (!this.sms) {
        return;
      }
      this.$request(apiRegisterUerPhone, {
        openid: this.openid,
        phone: this.tel,
        verificationCode: this.sms,
      })
        .then(() => {
          this.$router.push({ path: "/" });
        })
        .catch((err) => {
          console.log(err);
          //Toast.fail(err);
        });
      //this.$toast.success("提交成功");
    },
    //获取验证码
    getSmsCode() {
      let TIME_COUNT = 60;
      if (!this.timer) {
        this.count = TIME_COUNT;
        this.show = false;
        this.dis = true;
        this.timer = setInterval(() => {
          if (this.count > 0 && this.count <= TIME_COUNT) {
            this.count--;
          } else {
            this.dis = false;
            this.show = true;
            clearInterval(this.timer);
            this.timer = null;
          }
        }, 1000);
      }
      if (this.tel) {
        this.$request(apiSendSms, { phone: this.tel }).then(() => {
          Toast.success("验证码已发送，请查看手机");
        });
      } else {
        Toast.fail("请输入正确的手机号");
      }
    },
  },
};
</script>
<style>
.login {
  box-sizing: border-box;
  min-height: calc(100vh - 56px);
  padding: 0.23rem;
}
</style>
