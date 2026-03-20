export interface IApiResponse<T> {
  code: number;
  msg: string;
  data: T;
}

export interface IChestResult {
  chestId: string;
  firstPrizeUserId: string;
  secondPrizeUserId: string;
  thirdPrizeUserId: string;
}

export interface IChestParticipant {
  userId: number;
  userName: string;
  unitPrice: number;
  quantity: number;
  purchaseTime: string;
}

export interface IChestInfo {
  chestActivityId: number;
  chestId: string;
  type: number;
  status: number;
  totalPrizeAmount: number;
  singleParticipationAmount: number;
  totalOpenTimes: number;
  currentParticipationCount: number;
  firstPrizeItemId: number;
  firstPrizeQuantity: number;
  secondPrizeItemId: number;
  secondPrizeQuantity: number;
  thirdPrizeItemId: number;
  thirdPrizeQuantity: number;
  result: IChestResult | null;
  participants: IChestParticipant[];
  teamId?: string;
  initiatorUserId?: number;
}

export interface IJoinGlobalChestPayload {
  dressUpItemId: number;
  quantity: number;
}

export interface ITeamQualificationInfo {
  hasTeam: boolean;
  teamId?: number;
  teamName?: string;
  ownerUserId?: number;
}

export interface ITeamMountConfig {
  mountItemId: number;
  mountName: string;
  mountUrl: string;
  price: number;
}

export interface IRenameTeamPayload {
  teamName: string;
}

export interface IInitTeamChestPayload {
  firstPrizeItemId: number;
  firstPrizeQuantity: number;
  secondPrizeItemId: number;
  secondPrizeQuantity: number;
  thirdPrizeItemId: number;
  thirdPrizeQuantity: number;
  totalPrizeAmount: number;
  singleParticipationAmount: number;
}

export interface IJoinTeamChestPayload {
  teamId: string;
  dressUpItemId: number;
  quantity: number;
}

export interface ITeamHistoryItem {
  chestActivityId: number;
  createTime: string;
  status: number;
  statusDesc: string;
  currentParticipationCount: number;
  totalOpenTimes: number;
  firstPrizeItemId: number;
  firstPrizeName: string;
  firstPrizeValue: number;
  firstPrizeQuantity: number;
  secondPrizeItemId: number;
  secondPrizeName: string;
  secondPrizeValue: number;
  secondPrizeQuantity: number;
  thirdPrizeItemId: number;
  thirdPrizeName: string;
  thirdPrizeValue: number;
  thirdPrizeQuantity: number;
  firstPrizeUserId?: string;
  secondPrizeUserId?: string;
  thirdPrizeUserId?: string;
}

export interface IUserRecordItem {
  chestType: number;
  dressUpName: string;
  quantity: number;
  purchaseTime: string;
  prizeStatus: number;
  prizeDesc: string;
}

export interface IPaginationData<T> {
  total: number;
  page: number;
  size: number;
  list: T[];
}
