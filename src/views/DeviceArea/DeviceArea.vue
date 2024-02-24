<!--
 * @Author: CaoTing
 * @Date: 2023-10-24 10:54:27
 * @Description: 
-->
<template>
  <div>
    <div class="GradeDetail-div">
      <div class="GradeDetail-list">
        <h3 style="display: flex; justify-content: center; align-items: center">
          <span style="margin-right: 5px">{{ deviceName }}</span>
          <van-icon name="edit" @click="changeName" />
        </h3>
        <h3>各个区域实时展示</h3>
        <h5>Area Scores</h5>
        <div class="toothImg">
          <img :src="require('@/assets/teethAreaNew.png')" alt="" />
          <div class="Grade-leftTop">
            <van-circle
              v-model="currentLeftTopRate"
              :stroke-width="60"
              size="40px"
              :text="currentLeftTopRate"
              color="#89ab46"
              layer-color="#bedd9b"
              class="lft"
            />
            <p>左牙上区得分</p>
          </div>
          <div class="Grade-rightTop">
            <van-circle
              v-model="currentRightTopRate"
              :stroke-width="60"
              size="40px"
              :text="currentRightTopRate"
              color="#009adc"
              layer-color="#9bc7eb"
              class="rgit"
            />
            <p>右牙上区得分</p>
          </div>
          <div class="Grade-leftBottom">
            <van-circle
              v-model="currentLeftBottomRate"
              :stroke-width="60"
              size="40px"
              :text="currentLeftBottomRate"
              color="#f47321"
              layer-color="#fcc594"
              class="lfb"
            />
            <p>左牙下区得分</p>
          </div>
          <div class="Grade-rightBottom">
            <van-circle
              v-model="currentRightBottomRate"
              :stroke-width="60"
              size="40px"
              :text="currentRightBottomRate"
              color="#ef4d55"
              layer-color="#fac4bc"
              class="rgib"
            />
            <p>右牙下区得分</p>
          </div>
        </div>
        <div class="GradeDetail-hint">
          刷牙的时候记得脑袋不要晃来晃去哦，不然分数可能会跑偏！
        </div>
      </div>
      <div class="GradeDetail-grade">
        <div class="Grade-time">
          <p>本次刷牙时间 TIME</p>
          <p class="GradeTime-btn">
            {{ date }}
          </p>
        </div>
        <div class="Grade-grade">
          <p>本次刷牙成绩 SCORES</p>
          <p class="GradeTime-btn">
            {{ detailData.result ? detailData.result.Value : "-" }}分
          </p>
        </div>
      </div>
      <div class="GradeDetail-grade" style="margin-bottom: 100px">
        <div class="Grade-time">
          <p>电池电量 %</p>
          <p class="GradeTime-btn">
            {{ detailData.battery ? detailData.battery.Value : "-" }}%
          </p>
        </div>
        <div class="Grade-grade">
          <p>牙刷更换时间 DAYS</p>
          <p class="GradeTime-btn">
            {{
              detailData.oldDate
                ? detailData.oldDate.value > 0
                  ? detailData.oldDate.value
                  : 0
                : "-"
            }}天
          </p>
        </div>
      </div>
    </div>
    <div class="van-contact-list__bottom fotbtn">
      <van-button
        @click="deleteDevice"
        type="danger"
        class="van-contact-list__add"
        size="large"
        round
        block
        >删除设备</van-button
      >
    </div>
    <!-- 修改昵称弹框 -->
    <van-dialog
      v-model="show"
      :before-close="beforeClose"
      title="修改设备昵称"
      @cancel="cancelD"
      confirm-button-color="#C7A3EF"
      @confirm="confirmClick()"
      show-cancel-button
    >
      <van-form ref="modifyDevNameRef" :key="formKey">
        <van-field
          name="devName"
          v-model="deviceName"
          label="设备昵称"
          placeholder="设备昵称"
          :rules="[{ required: true, message: '请输入设备昵称' }]"
        />
      </van-form>
    </van-dialog>
  </div>
</template>
<script>
import { deviceProperties, unbindDevice } from "@/api/Device";
import { Dialog, Toast } from "vant";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      currentRightBottomRate: 0,
      currentLeftBottomRate: 0,
      currentLeftTopRate: 0,
      currentRightTopRate: 0,
      detailData: {},
      date: "",
      show: false,
      formKey: 0,
    };
  },
  computed: {
    // scoreDetail() {
    //   return this.$route.query.scoreDetail;
    // },
    // time() {
    //   return this.$route.query.time;
    // },
    // score() {
    //   return this.$route.query.score;
    // },
    deviceName() {
      return this.$route.query.id;
    },
    productId() {
      return this.$route.query.pid;
    },
    ...mapGetters(["openid"]),
  },
  methods: {
    changeName() {
      this.show = true;
    },
    beforeClose() {
      new Promise((resolve) => {
        setTimeout(() => {
          // 拦截确认操作
          console.log(222);
          resolve(false);
        }, 0);
      });
    },
    cancelD() {
      this.formKey++;
      this.show = false;
    },
    confirmClick() {
      this.$refs.modifyDevNameRef
        .validate()
        .then(() => {
          // sdkRequest("AppUpdateDeviceInFamily", {
          //   ProductId: sdk.productId,
          //   DeviceName: sdk.deviceName,
          //   AliasName: deviceName.value,
          // }).then(() => {
          //   deviceInfo.value.AliasName = deviceName.value;
          //   Toast.success(`设备昵称修改为：${deviceName.value}`);
          // });
        })
        .catch(() => {
          // show.value = false;
          console.log("validate is error");
        });
      this.show = false;
    },
    getDetail() {
      this.$request(deviceProperties, {
        openid: this.openid,
        productId: this.productId,
        deviceName: this.deviceName,
      }).then((res) => {
        this.detailData = res.data.data;
        if (this.detailData) {
          if (this.detailData.oldDate.Value) {
            let a1 = this.$dayjs(new Date()).unix();
            let a2 = this.detailData.oldDate.Value;
            let day = parseInt((a1 - a2) / (60 * 60 * 24));
            let days = 90 - day;
            this.detailData.oldDate.value = days;
          }
          if (this.detailData.date) {
            this.date = this.$dayjs
              .unix(this.detailData.date.Value)
              .format("YYYY-MM-DD HH:mm:ss");
          } else {
            this.date = "-";
          }
          if (this.detailData.detailed) {
            this.currentLeftTopRate =
              this.detailData.detailed.Value.split(",")[0];
            this.currentRightTopRate =
              this.detailData.detailed.Value.split(",")[1];
            this.currentLeftBottomRate =
              this.detailData.detailed.Value.split(",")[2];
            this.currentRightBottomRate =
              this.detailData.detailed.Value.split(",")[3];
          } else {
            this.currentLeftTopRate = 0;
            this.currentRightTopRate = 0;
            this.currentLeftBottomRate = 0;
            this.currentRightBottomRate = 0;
          }
        }
      });
    },
    deleteDevice() {
      Dialog.confirm({
        title: "删除设备",
        message:
          "一旦点击确认后，设备将会被删除，后续将无法在公众号内查看设备信息，以及接收不到设备相关的信息推送",
      })
        .then(() => {
          // on confirm
          this.$request(unbindDevice, {
            openid: this.openid,
            productId: this.productId,
            deviceName: this.deviceName,
          }).then(() => {
            Toast.success("设备删除成功");
            this.$router.push("/device/list");
          });
        })
        .catch(() => {
          // on cancel
        });
    },
  },
  // mounted() {
  //   this.currentLeftTopRate = this.scoreDetail.split(",")[0];
  //   this.currentRightTopRate = this.scoreDetail.split(",")[1];
  //   this.currentLeftBottomRate = this.scoreDetail.split(",")[2];
  //   this.currentRightBottomRate = this.scoreDetail.split(",")[3];
  // },
  created() {
    this.getDetail();
  },
};
</script>
<style scoped>
.GradeDetail-div {
  width: 100%;
  min-height: 100vh;
  background: #f7f6fa;
  padding-top: 10px;
  overflow: auto;
}

.GradeDetail-bg {
  position: absolute;
  width: 100%;
  height: 45%;
  bottom: 0;
  background: #f7f6fa;
}

.GradeDetail-list {
  width: 300px;
  height: 376px;
  background: #fff;
  border-radius: 20px;
  position: relative;
  margin: auto;
  padding-top: 10px;
}

h3 {
  text-align: center;
  font-size: 15px;
}

h5 {
  text-align: center;
  margin-top: 5px;
  font-size: 12px;
}

.toothImg {
  width: 100%;
  height: 208px;
  position: relative;
}

.toothImg img {
  width: 58%;
  position: absolute;
  left: 0;
  right: 0;
  margin: auto;
}

.Grade-leftTop {
  position: absolute;
  left: 0;
  width: 90px;
  height: 90px;
  display: flex;
  align-items: center;
  flex-direction: column;
}

.Grade-leftTop p {
  font-size: 12px;
  padding-left: 5px;
  color: #8a8a8a;
}

.Grade-rightTop {
  position: absolute;
  right: 0px;
  width: 90px;
  height: 90px;
  display: flex;
  align-items: center;
  flex-direction: column;
}

.Grade-rightTop p {
  font-size: 12px;
  padding-left: 5px;
  color: #8a8a8a;
}

.Grade-leftBottom {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 90px;
  height: 90px;
  display: flex;
  align-items: center;
  flex-direction: column;
}

.Grade-leftBottom p {
  font-size: 12px;
  padding-left: 5px;
  color: #8a8a8a;
}

.Grade-rightBottom {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 90px;
  height: 90px;
  display: flex;
  align-items: center;
  flex-direction: column;
}

.Grade-rightBottom p {
  font-size: 12px;
  padding-left: 5px;
  color: #8a8a8a;
}

.GradeDetail-hint {
  text-align: center;
  margin-top: 10px;
  padding: 10px 40px;
  color: #f47321;
  font-size: 12px;
}

.GradeDetail-grade {
  width: 300px;
  height: 96px;
  background: #fde0c6;
  border-radius: 20px;
  margin: 10px auto 0;
  display: flex;
  justify-content: space-between;
  /* padding-top: 10px; */
}

.Grade-time,
.Grade-grade {
  width: 50%;
  text-align: center;
}

.Grade-time,
.Grade-grade p:first-child {
  margin-bottom: 12px;
  font-size: 14px;
  color: #f47321;
}

.GradeTime-btn {
  width: 130px;
  height: 40px;
  border-radius: 10px;
  line-height: 30px;
  background: #fcc594;
  text-align: center;
  line-height: 40px;
  margin: 0 auto;
  color: #fff;
  font-size: 12px;
}

.fotbtn {
  bottom: calc(0px + env(safe-area-inset-bottom));
}

.lft :deep(.van-circle__text) {
  color: #89ab46;
  font-size: 18px;
  font-weight: bold;
}

.rgit :deep(.van-circle__text) {
  color: #009adc;
  font-size: 18px;
  font-weight: bold;
}

.lfb :deep(.van-circle__text) {
  color: #f47321;
  font-size: 18px;
  font-weight: bold;
}

.rgib :deep(.van-circle__text) {
  color: #ef4d55;
  font-size: 18px;
  font-weight: bold;
}
</style>
