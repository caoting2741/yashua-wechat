/*
 * @Author: CaoTing
 * @Date: 2023-03-18 14:18:39
 * @Description:
 */
import axios from "axios";
import Vue from "vue";
// import { LangKey, ResponseCode } from '../config'
import { Toast } from "vant";

Vue.use(Toast);

// 接口域名
const baseURL = process.env.VUE_APP_BASE_API;

// 创建axios实例
const createService = (option) => {
  const service = axios.create({ baseURL });

  service.interceptors.request.use((config) => {
    if (option) {
      config = { ...config, ...option };
    }

    return config;
  });

  service.interceptors.response.use((response) => {
    return response;
  });

  return service;
};

// 创建axios参数对象
const createConfig = (config, data = {}) => {
  const { method = "GET", url, ...resetConfig } = config;
  const key =
    method.toUpperCase() === "POST" || method.toUpperCase() === "DELETE"
      ? "data"
      : "params";
  const _ = {
    method,
    url,
    ...resetConfig,
  };
  _[key] = data;

  return _;
};

const service = createService();

export default function request(config, data) {
  // muted：是否静默错误提示
  const { muted = false } = config;
  const options = createConfig(config, data);
  // const { $toast = Toast } = this;
  return new Promise((resolve, reject) => {
    //const defaultMsg = "出错了！";
    service(options)
      .then((response) => {
        const { code, msg } = response.data;
        // 业务出错处理逻辑
        //console.log(msg);
        if (code !== 1000) {
          if (!muted) {
            Toast.fail(msg);
          }
          reject(response);
          return;
        }
        resolve(response);
      })
      .catch((error) => {
        if (!error.response) {
          reject(error);
          return;
        }
        if (!muted) {
          Toast.fail(error);
        }
        reject(error);
      });
  });
}
