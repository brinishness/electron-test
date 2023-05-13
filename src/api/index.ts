import request from "@/utils/request";
import { ElMessage } from "element-plus";
import { CheckSum, getCurTime, getNonce } from "@/utils/utils";

export const getToken = (data: object) => {
  const demoServer: string =
    "https://roomkit.netease.im/apps/v1/getToken";
  return request({
    url: demoServer,
    method: "post",
    headers: {
      AppKey: "a88f59cb25cdc1dbf437529f03d6f062",
      Nonce: nonce,
      CurTime: curTime,
      CheckSum: checkSum,
    },
    data: data,
  })
    .then((res) => {
      console.log(res);
      if (res.data.code !== 200) {
        ElMessage.error(`请求token失败，errorCode:${res.data.code}`);
      }
      return res;
    })
    .catch((e) => {
      ElMessage.error(`请求token异常，e:${e}`);
    });
};
const nonce = getNonce;
const curTime = getCurTime;
const checkSum = CheckSum("973987f81ca3", nonce, curTime);
export const createUser = (data: object) => {
  const demoServer: string =
    "https://api.netease.im/nimserver/user/create.action";
  return request({
    url: demoServer,
    method: "post",
    headers: {
      AppKey: "a88f59cb25cdc1dbf437529f03d6f062",
      Nonce: nonce,
      CurTime: curTime,
      CheckSum: checkSum,
    },
    data: data,
  })
    .then((res) => {
      console.log(res);
      if (res.data.code !== 200) {
        ElMessage.error(`请求token失败，errorCode:${res.data.code}`);
      }
      return res;
    })
    .catch((e) => {
      ElMessage.error(`请求token异常，e:${e}`);
    });
};

export const createRoomUser = (userUuid, data: object) => {
      const demoServer: string =
    `https://roomkit.netease.im/apps/a88f59cb25cdc1dbf437529f03d6f062/v1/users/${userUuid}`;
  return request({
    url: demoServer,
    method: "put",
    headers: {
      AppKey: "a88f59cb25cdc1dbf437529f03d6f062",
      Nonce: nonce,
      CurTime: curTime,
      CheckSum: checkSum,
    },
    data: data,
  })
    .then((res) => {
      console.log(res);
      if (res.data.code !== 200) {
        ElMessage.error(`请求token失败，errorCode:${res.data.code}`);
      }
      return res;
    })
    .catch((e) => {
      ElMessage.error(`请求token异常，e:${e}`);
    });
}