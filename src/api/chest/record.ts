import { post } from "@/util/request";
import { IApiResponse, IPaginationData, IUserRecordItem } from "@/api/chest/types";

interface IRecordListQuery {
  page?: number;
  size?: number;
}

export const getUserRecordList = async (query: IRecordListQuery = {}): Promise<IApiResponse<IPaginationData<IUserRecordItem>>> => {
  const page = query.page ?? 1;
  const size = query.size ?? 20;
  return post<IApiResponse<IPaginationData<IUserRecordItem>>>(`/act/chest/record/list?page=${page}&size=${size}`);
  // return Promise.resolve({
  //   code: 200,
  //   msg: "success",
  //   data: {
  //     total: 100,
  //     page,
  //     size,
  //     list: [
  //       {
  //         chestType: 1,
  //         dressUpName: "装扮A",
  //         quantity: 1,
  //         purchaseTime: "2023-10-01T12:00:00Z",
  //         prizeStatus: 1,
  //         prizeDesc: "一等奖"
  //       },
  //       {
  //         chestType: 2,
  //         dressUpName: "装扮B",
  //         quantity: 2,
  //         purchaseTime: "2023-10-02T12:00:00Z",
  //         prizeStatus: 0,
  //         prizeDesc: "未中奖"
  //       }
  //     ]
  //   }
  // });
};
