/*
 * @Author: CaoTing
 * @Date: 2023-03-21 14:57:38
 * @Description:
 */
import { Gateways } from "@/config";
const devicePrefix = Gateways.interfacePre;
export const apiDeviceList = {
  url: `${devicePrefix}/user/devices`,
  method: "get",
};
export const getSdkConfig = {
  url: `${devicePrefix}/jsapi/config`,
  method: "get",
};
export const bindDevice = {
  url: `${devicePrefix}/user/device/bind`,
  method: "post",
};
export const unbindDevice = {
  url: `${devicePrefix}/user/devices`,
  method: "delete",
};
export const deviceProperties = {
  url: `${devicePrefix}/user/devices/properties`,
  method: "get",
};
export const deviceAliasName = {
  url: `${devicePrefix}/user/device/aliasName`,
  method: "post",
};
export const deviceAliasNameGet = {
  url: `${devicePrefix}/user/device/aliasName/get`,
  method: "post",
};
