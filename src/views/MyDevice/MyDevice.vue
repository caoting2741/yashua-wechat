<!--
 * @Author: CaoTing
 * @Date: 2023-03-18 11:38:35
 * @Description: 
-->
<template>
  <div class="deviceList">
    <!-- <van-nav-bar title="我的设备" /> -->
    <section class="dev-section">
      <template v-if="deviceList.length > 0">
        <van-grid :border="false" :gutter="10" :column-num="2">
          <van-grid-item v-for="item in deviceList" :key="item.DevicePsk">
            <van-image
              class="imgS"
              :src="require('@/assets/product.png')"
              @click="jump(item)"
            />
            <span class="imgW">
              <span style="margin-right: 0.3rem"
                ><span class="devName">{{ item.AliasName || item.DeviceName }}</span></span
              >
              <!-- <van-icon
                name="delete-o"
                size="0.5rem"
                color="#ee0a24"
                @click="deleteDevice(item)"
              /> -->
            </span>
          </van-grid-item>
        </van-grid>
      </template>
      <template v-else>
        <van-empty description="暂无设备，请点击添加设备" />
      </template>

      <div class="van-contact-list__bottom fotbtn">
        <van-button
          @click="addDev"
          type="info"
          class="van-contact-list__add"
          size="large"
          round
          block
          >添加设备</van-button
        >
      </div>
    </section>
  </div>
</template>
<script>
import { apiDeviceList, getSdkConfig, bindDevice } from "@/api/Device.js";
import { Dialog, Toast } from "vant";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      deviceList: [],
    };
  },
  components: {
    [Dialog.Component.name]: Dialog.Component,
  },
  computed: {
    ...mapGetters(["openid"]),
  },
  methods: {
    getDeviceList() {
      this.$request({ ...apiDeviceList, muted: true }, { openid: this.openid })
        .then((res) => {
          this.deviceList = res.data.data;
        })
        .catch((err) => {
          if (err.data.code == 1101) {
            this.deviceList = [];
            this.$router.push({ path: "/login" });
          } else {
            Toast.fail(err.data.msg);
          }
        });
    },
    jump({ ProductId, DeviceName }) {
      // console.log(id);
      this.$router.push({
        path: "/device/areaShow",
        query: { pid: ProductId, id: DeviceName },
      });
    },

    addDev() {
      console.log("点击扫一扫");
      this.$wx.scanQRCode({
        needResult: 1,
        scanType: ["qrCode", "barCode"],
        success: (res) => {
          let result = res.resultStr;
          let devName = "";
          let productId = "";
          if (result.indexOf("devName=") >= 0) {
            productId = result.split("&")[0].split("productId=")[1];
            devName = result.split("&")[1].split("devName=")[1];
            this.bindDev(productId, devName);
          } else {
            Toast.fail("请扫正确的设备码");
          }
        },
        fail: (err) => {
          console.log(err);
          Toast.fail(err.errMsg);
        },
      });
    },
    bindDev(productId, name) {
      this.$request(bindDevice, {
        openid: this.openid,
        productId,
        deviceName: name,
      }).then((res) => {
        if (res.data.code == 1000) {
          Toast.success("设备添加成功");
          this.getDeviceList();
        } else {
          Toast.fail(res.data.msg);
        }
      });
    },

    async getWxJssdkConf() {
      const res = await this.$request(getSdkConfig);
      if (res.data.code == 1000) {
        this.$wx.config({
          debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
          appId: res.data.data.appId, // 必填，公众号的唯一标识
          timestamp: String(res.data.data.timestamp), // 必填，生成签名的时间戳
          nonceStr: String(res.data.data.nonceStr), // 必填，生成签名的随机串
          signature: res.data.data.signature, // 必填，签名，见附录1
          jsApiList: res.data.data.jsApiList, // ["checkJsApi", "scanQRCode"]必填，需要使用的JS接口列表，所有JS接口列表见附录2
        });
        this.$wx.ready(() => {
          this.$wx.checkJsApi({
            jsApiList: ["checkJsApi", "scanQRCode"], // 需要检测的JS接口列表，所有JS接口列表见附录2,
            success: function (res) {
              if (res.checkResult.scanQRCode != true) {
                Toast.fail("抱歉，当前客户端版本不支持扫一扫");
              } else {
                console.log("checkJsApi", res);
              }
              // Toast.setDefaultOptions({ duration: 0 });
              // Toast.success(JSON.stringify(res));
              // console.log("checkJsApi", res);
            },
          });
        });
        this.$wx.error((res) => {
          console.log("wx.error", res);
        });
      }
    },
  },
  mounted() {
    this.$nextTick(() => {
      //location.reload()
      this.getDeviceList();
      this.getWxJssdkConf();
    });
  },
};
</script>
<style>
.dev-section {
  box-sizing: border-box;
  min-height: calc(100vh - 56px);
  padding: 0.23rem 0;
}
.imgS {
  width: 150px;
  height: 150px;
}
.imgW {
  font-size: 0.4rem;
  margin-top: 0.2rem;
  display: flex;
}
.devName {
  display: inline-block;
  width: 3.2rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: center;
}
.fotbtn {
  bottom: calc(0px + env(safe-area-inset-bottom));
}
</style>
