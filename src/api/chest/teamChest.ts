import { post } from "@/util/request";
import { IApiResponse, IChestInfo, IInitTeamChestPayload, IJoinTeamChestPayload, ITeamHistoryItem } from "@/api/chest/types";

export const initTeamChest = (payload: IInitTeamChestPayload) => {
  return post<IApiResponse<IChestInfo>>("/chest/team/init", payload);
};

export const getTeamChestDetail = (teamId: string) => {
  return post<IApiResponse<IChestInfo | null>>(`/chest/team/detail?teamId=${encodeURIComponent(teamId)}`);
};

export const joinTeamChest = (payload: IJoinTeamChestPayload) => {
  return post<IApiResponse<null>>("/chest/team/join", payload);
};

export const getTeamChestHistory = () => {
  return post<IApiResponse<ITeamHistoryItem[]>>("/chest/team/history");
};
