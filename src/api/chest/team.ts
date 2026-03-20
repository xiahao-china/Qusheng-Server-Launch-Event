import { post } from "@/util/request";
import { IApiResponse, IRenameTeamPayload, ITeamMountConfig, ITeamQualificationInfo } from "@/api/chest/types";

export const getTeamQualificationInfo = () => {
  return post<IApiResponse<ITeamQualificationInfo>>("/chest/team/info");
};

export const getTeamMountConfig = () => {
  return post<IApiResponse<ITeamMountConfig>>("/chest/team/mountConfig");
};

export const createTeam = () => {
  return post<IApiResponse<ITeamQualificationInfo>>("/chest/team/create");
};

export const renameTeam = (payload: IRenameTeamPayload) => {
  return post<IApiResponse<null>>("/chest/team/rename", payload);
};
