/*
 * @Author: CaoTing
 * @Date: 2023-03-18 14:54:26
 * @Description:
 */
// import _ from "lodash";
import Vue from "vue";
import Vuex from "vuex";
import localStorageUtil from "@/utils/localStorageUtil";
Vue.use(Vuex);

export const toothStore =  new Vuex.Store({
  state: {
    unionId: "",
    openid: "",
    wechatUserInfo: {},
  },
  getters: {
    unionId: (state) => {
      return state.unionId || localStorageUtil.get("unionId");
    },
    openid: (state) => {
      return state.openid || localStorageUtil.get("openid");
    },
    wechatUserInfo: (state) => {
      return state.wechatUserInfo || localStorageUtil.get("wechatUserInfo");
    },
  },
  mutations: {
    saveWechatUserInfo: (state, res) => {
      //console.log(res);
      state.wechatUserInfo = res;
      state.unionId = res.unionId?res.unionId:null;
      state.openid = res.openid?res.openid:null;
      console.log(state.openid);
      localStorageUtil.set("unionId", res.unionId);
      localStorageUtil.set("openid", res.openid);
      localStorageUtil.set("wechatUserInfo", res);
    },
  },
});

// export default store;
