import { post } from "@/util/request";
import {
  IApiResponse,
  IRenameTeamPayload,
  ITeamMountConfig,
  ITeamQualificationInfo,
} from "@/api/chest/types";

export const getTeamQualificationInfo = async () => {
  return post<IApiResponse<ITeamQualificationInfo>>("/chest/team/info");
};

export const getTeamMountConfig = async () => {
  return post<IApiResponse<ITeamMountConfig>>("/chest/team/mountConfig");
};

export const createTeam = async () => {
  return post<IApiResponse<ITeamQualificationInfo>>("/chest/team/create");
};

export const renameTeam = async (payload: IRenameTeamPayload) => {
  return post<IApiResponse<null>>("/chest/team/rename", payload);
};
