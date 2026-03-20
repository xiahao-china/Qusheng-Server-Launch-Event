import { post } from "@/util/request";
import { IApiResponse, IChestInfo, IJoinGlobalChestPayload } from "@/api/chest/types";

export const getGlobalChestInfo = () => {
  return post<IApiResponse<IChestInfo | null>>("/chest/global/info");
};

export const joinGlobalChest = (payload: IJoinGlobalChestPayload) => {
  return post<IApiResponse<null>>("/chest/global/join", payload);
};
