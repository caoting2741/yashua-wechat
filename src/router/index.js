/*
 * @Author: CaoTing
 * @Date: 2023-03-18 11:28:43
 * @Description:
 */
import Vue from "vue";
import VueRouter from "vue-router";
Vue.use(VueRouter);
const RouterView = () => import("@/components/RouterView/RouterView.vue");
const routes = [
  {
    path: "/",
    redirect: "/device",
  },
  {
    path: "/device",
    component: RouterView,
    redirect: "/device/list",
    children: [
      {
        path: "list",
        component: () => import("@/views/MyDevice/MyDevice.vue"),
        meta:{
          title:"我的设备"
        }
      },
      {
        path: "detail",
        component: () => import("@/views/DeviceDetail/DeviceDetail.vue"),
        meta:{
          title:"设备详情"
        }
      },
    ],
  },
  {
    path: "/about",
    component: () => import("@/views/About/AboutPage.vue"),
    meta: { requiresAuth: true, title: "About" },
  },
  {
    path: "/notwx",
    component: () => import("@/views/NotWx/NotWx.vue"),
    meta: { requiresAuth: true, title: "不是微信公众号" },
  },
  {
    path: "/login",
    component: () => import("@/views/Login/LoginPage.vue"),
    meta: { requiresAuth: false, title: "Login" },
  },
];
let router = new VueRouter({
  mode: "history",
  routes,
});

export default router;
