import { post } from "@/util/request";
import {
  IApiResponse,
  IChestInfo,
  IJoinGlobalChestPayload,
} from "@/api/chest/types";

export const getGlobalChestInfo = async () => {
  return post<IApiResponse<IChestInfo>>("/chest/global/info");
};

export const joinGlobalChest = async (payload: IJoinGlobalChestPayload) => {
  return post<IApiResponse<null>>("/chest/global/join", payload);
};
