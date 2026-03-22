import { post } from "@/util/request";
import { IApiResponse, IRenameTeamPayload, ITeamMountConfig, ITeamQualificationInfo } from "@/api/chest/types";

export const getTeamQualificationInfo = (): Promise<IApiResponse<ITeamQualificationInfo>> => {
  return post<IApiResponse<ITeamQualificationInfo>>("/act/chest/team/info");
  // return Promise.resolve({
  //   code: 200,
  //   msg: "success",
  //   data: {
  //     hasTeam: true,
  //     teamId: 1001,
  //     teamName: "Awesome Team",
  //     ownerUserId: 2001
  //   }
  // });
};

export const getTeamMountConfig = (): Promise<IApiResponse<ITeamMountConfig>> => {
  return post<IApiResponse<ITeamMountConfig>>("/act/chest/team/mountConfig");
  // return Promise.resolve({
  //   code: 200,
  //   msg: "success",
  //   data: {
  //     mountItemId: 501,
  //     mountName: "Epic Mount",
  //     mountUrl: "https://example.com/mount.png",
  //     price: 1000
  //   }
  // });
};

export const createTeam = (): Promise<IApiResponse<ITeamQualificationInfo>> => {
  return post<IApiResponse<ITeamQualificationInfo>>("/act/chest/team/create");
  // return Promise.resolve({
  //   code: 200,
  //   msg: "success",
  //   data: {
  //     hasTeam: true,
  //     teamId: 1002,
  //     teamName: "New Team",
  //     ownerUserId: 2002
  //   }
  // });
};

export const renameTeam = (payload: IRenameTeamPayload): Promise<IApiResponse<null>> => {
  return post<IApiResponse<null>>("/act/chest/team/rename", payload);
  // return Promise.resolve({
  //   code: 200,
  //   msg: "success",
  //   data: null
  // });
};
