import { post } from "@/util/request";
import {
  IApiResponse,
  IChestInfo,
  IInitTeamChestPayload,
  IJoinTeamChestPayload,
  ITeamHistoryItem,
} from "@/api/chest/types";

export const initTeamChest = async (payload: IInitTeamChestPayload) => {
  return post<IApiResponse<IChestInfo>>("/chest/team/init", payload);
};

export const getTeamChestDetail = async (teamId: string) => {
  const encodedTeamId = encodeURIComponent(teamId);
  return post<IApiResponse<IChestInfo>>(
    `/chest/team/detail?teamId=${encodedTeamId}`
  );
};

export const joinTeamChest = async (payload: IJoinTeamChestPayload) => {
  return post<IApiResponse<null>>("/chest/team/join", payload);
};

export const getTeamChestHistory = async () => {
  return post<IApiResponse<ITeamHistoryItem[]>>("/chest/team/history");
};
