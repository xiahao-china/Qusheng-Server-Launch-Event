import { post } from "@/util/request";
import { IApiResponse, IChestInfo, IJoinGlobalChestPayload } from "@/api/chest/types";

export const getGlobalChestInfo = (): Promise<IApiResponse<IChestInfo | null>> => {
  // return post<IApiResponse<IChestInfo | null>>("/chest/global/info");
  return Promise.resolve({
    code: 200,
    msg: "success",
    data: {
      chestActivityId: 1,
      chestId: "global-123",
      type: 1,
      status: 1,
      totalPrizeAmount: 10000,
      singleParticipationAmount: 100,
      totalOpenTimes: 100,
      currentParticipationCount: 50,
      firstPrizeItemId: 101,
      firstPrizeQuantity: 1,
      secondPrizeItemId: 102,
      secondPrizeQuantity: 2,
      thirdPrizeItemId: 103,
      thirdPrizeQuantity: 5,
      result: null,
      participants: [
        {
          userId: 1001,
          userName: "User A",
          unitPrice: 100,
          quantity: 2,
          purchaseTime: "2023-10-01T12:00:00Z"
        }
      ]
    }
  });
};

export const joinGlobalChest = (payload: IJoinGlobalChestPayload): Promise<IApiResponse<null>> => {
  // return post<IApiResponse<null>>("/chest/global/join", payload);
  return Promise.resolve({
    code: 200,
    msg: "success",
    data: null
  });
};
