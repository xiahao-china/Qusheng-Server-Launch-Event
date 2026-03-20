import { post } from "@/util/request";
import { IApiResponse, IPaginationData, IUserRecordItem } from "@/api/chest/types";

interface IRecordListQuery {
  page?: number;
  size?: number;
}

export const getUserRecordList = async (query: IRecordListQuery = {}) => {
  const page = query.page ?? 1;
  const size = query.size ?? 20;
  return post<IApiResponse<IPaginationData<IUserRecordItem>>>(`/chest/record/list?page=${page}&size=${size}`);
};
