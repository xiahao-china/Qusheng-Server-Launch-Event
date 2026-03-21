export enum TeamModuleStatus {
  NoQualification = "no-qualification",
  Opened = "opened",
  Initiated = "initiated",
}

export const resolveApiResult = <T>(response: { code: number; msg: string; data: T }) => {
  if (response.code !== 200) {
    throw new Error(response.msg || "请求失败");
  }
  return response.data;
};
