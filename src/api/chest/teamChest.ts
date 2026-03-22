import { post } from "@/util/request";
import { IApiResponse, IChestInfo, IInitTeamChestPayload, IJoinTeamChestPayload, ITeamHistoryItem, IPrizeItem } from "@/api/chest/types";

export const initTeamChest = (payload: IInitTeamChestPayload): Promise<IApiResponse<IChestInfo>> => {
  return post<IApiResponse<IChestInfo>>("/act/chest/team/init", payload);
  // return Promise.resolve({
  //   code: 200,
  //   msg: "success",
  //   data: {
  //     chestActivityId: 2,
  //     chestId: "team-chest-1",
  //     type: 2,
  //     status: 0,
  //     totalPrizeAmount: payload.totalPrizeAmount,
  //     singleParticipationAmount: payload.singleParticipationAmount,
  //     totalOpenTimes: 50,
  //     currentParticipationCount: 1,
  //     firstPrizeItemId: payload.firstPrizeItemId,
  //     firstPrizeQuantity: payload.firstPrizeQuantity,
  //     secondPrizeItemId: payload.secondPrizeItemId,
  //     secondPrizeQuantity: payload.secondPrizeQuantity,
  //     thirdPrizeItemId: payload.thirdPrizeItemId,
  //     thirdPrizeQuantity: payload.thirdPrizeQuantity,
  //     result: null,
  //     participants: [
  //       {
  //         userId: 1001,
  //         userName: "User A",
  //         unitPrice: payload.singleParticipationAmount,
  //         quantity: 1,
  //         purchaseTime: "2023-10-01T12:00:00Z"
  //       }
  //     ],
  //     teamId: "team-1001",
  //     initiatorUserId: 1001
  //   }
  // });
};

export const getTeamChestDetail = (teamId: string): Promise<IApiResponse<IChestInfo | null>> => {
  return post<IApiResponse<IChestInfo | null>>(`/act/chest/team/detail?teamId=${encodeURIComponent(teamId)}`);
  // return Promise.resolve({
  //   code: 200,
  //   msg: "success",
  //   data: {
  //     chestActivityId: 2,
  //     chestId: "team-chest-1",
  //     type: 2,
  //     status: 1,
  //     totalPrizeAmount: 5000,
  //     singleParticipationAmount: 100,
  //     totalOpenTimes: 50,
  //     currentParticipationCount: 10,
  //     firstPrizeItemId: 201,
  //     firstPrizeQuantity: 1,
  //     secondPrizeItemId: 202,
  //     secondPrizeQuantity: 2,
  //     thirdPrizeItemId: 203,
  //     thirdPrizeQuantity: 5,
  //     result: null,
  //     participants: [],
  //     teamId: teamId,
  //     initiatorUserId: 1001
  //   }
  // });
};

export const joinTeamChest = (payload: IJoinTeamChestPayload): Promise<IApiResponse<null>> => {
  return post<IApiResponse<null>>("/act/chest/team/join", payload);
  // return Promise.resolve({
  //   code: 200,
  //   msg: "success",
  //   data: null
  // });
};

export const getTeamChestHistory = (): Promise<IApiResponse<ITeamHistoryItem[]>> => {
  return post<IApiResponse<ITeamHistoryItem[]>>("/act/chest/team/history");
  // return Promise.resolve({
  //   code: 200,
  //   msg: "success",
  //   data: [
  //     {
  //       chestActivityId: 2,
  //       createTime: "2023-10-01T10:00:00Z",
  //       status: 2,
  //       statusDesc: "已完成",
  //       currentParticipationCount: 50,
  //       totalOpenTimes: 50,
  //       firstPrizeItemId: 201,
  //       firstPrizeName: "大奖",
  //       firstPrizeValue: 1000,
  //       firstPrizeQuantity: 1,
  //       secondPrizeItemId: 202,
  //       secondPrizeName: "二等奖",
  //       secondPrizeValue: 500,
  //       secondPrizeQuantity: 2,
  //       thirdPrizeItemId: 203,
  //       thirdPrizeName: "三等奖",
  //       thirdPrizeValue: 100,
  //       thirdPrizeQuantity: 5,
  //       firstPrizeUserId: "1001",
  //       secondPrizeUserId: "1002",
  //       thirdPrizeUserId: "1003"
  //     }
  //   ]
  // });
};

export const getTeamChestPrizeList = (): Promise<IApiResponse<IPrizeItem[]>> => {
  return post<IApiResponse<IPrizeItem[]>>("/act/chest/team/prizeList");
  // mock for now
  // return Promise.resolve({
  //   code: 200,
  //   msg: "success",
  //   data: [
  //     { id: 1, itemId: 1, name: "HUAWEI Mate 60 RS", image: "https://minigame-img.feiguyuyin.com/gusheng_server_launch/first_prize_demo.png", value: 1000 },
  //     { id: 2, itemId: 2, name: "PS5", image: "https://minigame-img.feiguyuyin.com/gusheng_server_launch/first_prize_demo.png", value: 800 },
  //     { id: 3, itemId: 3, name: "Nintendo Switch", image: "https://minigame-img.feiguyuyin.com/gusheng_server_launch/first_prize_demo.png", value: 600 },
  //     { id: 4, itemId: 4, name: "Apple iPad", image: "https://minigame-img.feiguyuyin.com/gusheng_server_launch/first_prize_demo.png", value: 500 },
  //     { id: 5, itemId: 5, name: "京东卡 500元", image: "https://minigame-img.feiguyuyin.com/gusheng_server_launch/first_prize_demo.png", value: 100 },
  //     { id: 6, itemId: 6, name: "定制周边", image: "https://minigame-img.feiguyuyin.com/gusheng_server_launch/first_prize_demo.png", value: 50 },
  //   ],
  // });
};
