import { get, post } from "@/util/request";
import { IApiResponse } from "@/api/chest/types";

export interface IUserInfo {
  userNumber: string;
  avatar: string;
  userName: string;
}

export interface IWalletAmount {
  balance: number;
  phone: string;
}

export const getUserInfo = async (): Promise<IApiResponse<{ result: IUserInfo }>> => {
  // return get<IApiResponse<{ result: IUserInfo }>>("/user/getUserInfo");
  return Promise.resolve({
    code: 200,
    msg: "success",
    data: {
      result: {
        userNumber: "12345678",
        avatar: "https://minigame-img.feiguyuyin.com/gusheng_server_launch/first_prize_demo.png",
        userName: "测试用户",
      },
    },
  });
};

export const getWalletAmount = async (): Promise<IApiResponse<IWalletAmount>> => {
  // return post<IApiResponse<IWalletAmount>>("/wallet/amount");
  return Promise.resolve({
    code: 200,
    msg: "success",
    data: {
      balance: 10000,
      phone: "13800138000",
    },
  });
};
