/*
 * @Author: CaoTing
 * @Date: 2023-03-29 13:34:56
 * @Description:
 */
import { Gateways } from "@/config";
const userPrefix = Gateways.interfacePre;
export const apiGetUerInfo = {
  url: userPrefix + "/userinfo",
  method: "get",
};
export const apiRegisterUerPhone = {
  url: userPrefix + "/register",
  method: "post",
};
export const apiSendSms = {
  url: userPrefix + "/sendSms",
  method: "post",
};
export const apiUserExists = {
  url: userPrefix + "/user/exists",
  method: "get",
};