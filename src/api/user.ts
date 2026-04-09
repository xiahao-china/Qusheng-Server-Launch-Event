import { get, post } from "@/util/request";
import { IApiResponse } from "@/api/chest/types";

export interface IUserInfo {
  userNumber: string;
  avatar: string;
  userName: string;
}

export interface IWalletAmount {
  actUrl: string;
  balance: number;
  bugeCoin: number;
  charmWallet: number;
  conversionUrl: string;
  frozenBalance: number;
  needFaceRealName: boolean;
  phone: string;
  silverBalance: number;
  sliverIncome: number;
}

export const getUserInfo = async (): Promise<IApiResponse<{ result: IUserInfo }>> => {
  return get<IApiResponse<{ result: IUserInfo }>>("/intf/user/getUserInfo");
  // return Promise.resolve({
  //   code: 200,
  //   msg: "success",
  //   data: {
  //     result: {
  //       userNumber: "12345678",
  //       avatar: "https://minigame-img.feiguyuyin.com/gusheng_server_launch/first_prize_demo.png",
  //       userName: "测试用户",
  //     },
  //   },
  // });
};

/**
 * 查询指定用户信息
 * @param targetUid 目标用户ID
 */
export const getMyInfoV2 = async (targetUid: string): Promise<IApiResponse<IUserInfo>> => {
  return get<IApiResponse<IUserInfo>>("/intf/userCtrl/myInfo/V2", {
    params: { targetUid },
  });
};

export const getWalletAmount = async (): Promise<IApiResponse<IWalletAmount>> => {
  return post<IApiResponse<IWalletAmount>>("/base/wallet/amount");
  // return Promise.resolve({
  //   code: 200,
  //   msg: "success",
  //   data: {
  //     actUrl: "",
  //     balance: 400000,
  //     bugeCoin: 0,
  //     charmWallet: 0,
  //     conversionUrl: "https://testh5.bugegaming.com/pay/exchange.html",
  //     frozenBalance: 0,
  //     needFaceRealName: false,
  //     phone: "17666061474",
  //     silverBalance: 0,
  //     sliverIncome: 0
  //   },
  // });
};
