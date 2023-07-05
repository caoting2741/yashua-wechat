/*
 * @Author: CaoTing
 * @Date: 2023-03-18 09:22:15
 * @Description:
 */
import Vue from "vue";
import App from "./App.vue";
import "amfe-flexible";
import "normalize.css";

import Vant from "vant";
import "vant/lib/index.css";
Vue.use(Vant);

import wx from "weixin-js-sdk";
Vue.prototype.$wx = wx;
import router from "@/router";
import { toothStore } from "@/store";

import * as utils from "./utils";
Object.keys(utils).forEach((key) => {
  Vue.prototype[`$${key}`] = utils[key];
});

// import wechatAuth from "./utils/useWechatAuth";
// Vue.use(wechatAuth, {
//   appid: "wx114fea0fbea37f16",
//   scope: "snsapi_userinfo",
// });
import dayjs from "dayjs";
Vue.prototype.$dayjs = dayjs;
Vue.config.productionTip = false;

new Vue({
  router,
  store: toothStore,
  render: (h) => h(App),
}).$mount("#app");

// export default vm;
