/*
 * @Author: CaoTing
 * @Date: 2023-03-18 11:48:19
 * @Description:
 */
import Vue from 'vue'
import router from "@/router";
import localStorageUtil from "@/utils/localStorageUtil";
import useWechatAuth from "@/utils/useWechatAuth";
import { toothStore } from "@/store";
import { apiGetUerInfo, apiUserExists } from "@/api/User";
import { request } from "@/utils";
import { Toast } from "vant";
Vue.use(useWechatAuth, {
  appid: process.env.VUE_APP_WECHAT_APP_ID,
  scope: "snsapi_userinfo",
})
router.beforeEach((to, from, next) => {
  const ua = navigator.userAgent.toLowerCase();
  if (
    to.path !== "/notwx" &&
    !(ua.match(/MicroMessenger/i) == "micromessenger")
  ) {
    next("/notwx");
    //getSign(next, to);
  } else {
    getSign(next, to);
    next();
  }
});
const getCode = () => {
  var url = location.search;
  var code = ""; 
  if (url.indexOf("code=") != -1) {
    var split = url.split("code=");
    code = split[1].split("&")[0];
  }

  return code;
};

const getSign = (next, to) => {
  let _this = this;
  let theCode = getCode();
  console.log(to.path);
  if (theCode) {
    //请求后端接口
    request.call(_this, apiGetUerInfo, { code: theCode }).then((res) => {
      if (res.data.code === 1000) {
        const { registered } = res.data.data;
        if (toothStore) {
          toothStore.commit("saveWechatUserInfo", res.data.data);
        }
        if (!registered) {
          // let realUrl = window.location.href.split("?")[0];
          // console.log(22 + ":" + realUrl);
          next({ path: "/login" });
          //window.location.href = realUrl + "login";
        } else {
          //console.log(window.location.href)
          if (window.location.href.indexOf("?code=") >= 0) {
            let realUrl = window.location.href.split("?")[0];
            window.location.href = realUrl;
          } else {
            next({ path: "/" });
          }
          // let realUrl = window.location.href.split("?")[0];
          // window.location.href = realUrl;
        }
      }
    });
  } else if (localStorageUtil.get("openid") == null) {
    useWechatAuth.redirectUri = window.location.href;
    window.location.href = useWechatAuth.authUrl;
  } else {
    window.document.title = to.meta.title;
    request
      .call(
        _this,
        { ...apiUserExists, muted: true },
        { openid: localStorageUtil.get("openid") }
      )
      .then((res) => {
        const { registered } = res.data.data;
        if (!registered) {
          next({ path: "/login" });
        } else {
          //console.log(window.location.href)
          //location.href = window.location.href
          next();
        }
      })
      .catch((err) => {
        if (err.data.code == 1101) {
          if (toothStore) {
            toothStore.commit("saveWechatUserInfo", {});
            location.reload();
          }
        } else {
          Toast.fail(err.data.msg);
        }
      });
  }
};
router.afterEach(() => {
  window.scrollTo(0, 0);
});
