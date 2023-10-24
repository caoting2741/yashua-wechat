<!--
 * @Author: CaoTing
 * @Date: 2023-03-21 20:37:15
 * @Description: 
-->
<template>
  <div>
    <section class="detail-section">
      <van-cell-group v-if="detailData">
        <van-cell
          title="刷牙时长"
          :value="`${detailData.duration.Value} s`"
          label="最后一次刷牙时长"
        />
        <van-cell
          title="刷牙时间"
          :value="`${$dayjs
            .unix(detailData.date.Value)
            .format('YYYY-MM-DD HH:mm:ss')}`"
          label="最后一次刷牙时长"
        />
        <van-cell
          title="刷牙分数"
          :value="`${detailData.result.Value} 分`"
          label="最后一次刷牙得分"
        />
        <van-cell
          title="得分明细"
          :value="`${detailData.detailed.Value} 分`"
          label="左牙上区、右牙上区、左牙下区、右牙下区"
          is-link
          :to="`/device/areaShow?scoreDetail=${
            detailData.detailed.Value
          }&time=${$dayjs
            .unix(detailData.date.Value)
            .format('YYYY-MM-DD HH:mm:ss')}&score=${detailData.result.Value}`"
        />
        <van-cell
          title="电池电量"
          :value="`${detailData.battery.Value}%`"
          label="电池剩余电量"
        />
        <van-cell
          title="牙刷更换时间"
          :value="`${detailData.oldDate.value} 天`"
          label="刷头剩余使用天数"
        />
        <!-- <van-cell title="刷牙排名" value="2分钟" label="最后一次刷牙时长" /> -->
      </van-cell-group>
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
    </section>
  </div>
</template>
<script>
import { deviceProperties, unbindDevice } from "@/api/Device";
import { Dialog, Toast } from "vant";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      detailData: {},
    };
  },
  computed: {
    deviceName() {
      return this.$route.query.id;
    },
    ...mapGetters(["openid"]),
  },
  methods: {
    getDetail() {
      this.$request(deviceProperties, {
        openid: this.openid,
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
            deviceName: this.deviceName,
          }).then(() => {
            Toast.success("设备删除成功");
            this.getDeviceList();
          });
        })
        .catch(() => {
          // on cancel
        });
    },
  },
  created() {
    this.getDetail();
  },
};
</script>
<style>
.detail-section {
  box-sizing: border-box;
  min-height: calc(100vh - 56px);
  padding: 0.23rem;
}
.fotbtn {
  bottom: calc(20px + env(safe-area-inset-bottom));
}
</style>
