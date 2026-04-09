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
  status: number;
  teamId: string | null;
  teamName: string | null;
  teamOwnerAvatar: string | null;
  teamOwnerUserName: string | null;
  singleParticipationAmount: number;
  totalOpenTimes: number;
  currentParticipationCount: number;
  firstPrizeItemId: number;
  firstPrizeName: string;
  firstPrizeImageUrl: string;
  firstPrizeQuantity: number;
  secondPrizeItemId: number;
  secondPrizeName: string;
  secondPrizeImageUrl: string;
  secondPrizeQuantity: number;
  thirdPrizeItemId: number;
  thirdPrizeName: string;
  thirdPrizeImageUrl: string;
  thirdPrizeQuantity: number;
  specialGiftName: string | null;
  specialGiftIconUrl: string | null;
  chestActivityId?: number;
  chestId?: string;
  type?: number;
  totalPrizeAmount?: number;
  result?: IChestResult | null;
  participants?: IChestParticipant[];
  initiatorUserId?: number;
}

export interface ITermsConfig {
  content: string;
  createTime: string;
  createUserName: string;
  effectiveTime: string | null;
  forceAgree: boolean;
  id: string;
  remark: string;
  status: number;
  statusName: string;
  title: string;
  type: string;
  typeName: string;
  updateTime: string;
  updateUserName: string;
  version: string;
}

export interface IJoinGlobalChestPayload {
  dressUpItemId: number;
  quantity: number;
}

export interface ITeamQualificationInfo {
  hasTeam: boolean;
  teamId?: string;
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

export interface IChestWinner {
  chestActivityId: number;
  chestType: number;
  openTime: string;
  firstPrizeUserId: string;
  firstPrizeUserName: string | null;
  firstPrizeUserAvatar: string | null;
  firstPrizeName: string;
  firstPrizeQuantity: number;
  secondPrizeUserId: string;
  secondPrizeUserName: string | null;
  secondPrizeUserAvatar: string | null;
  secondPrizeName: string;
  secondPrizeQuantity: number;
  thirdPrizeUserId: string;
  thirdPrizeUserName: string | null;
  thirdPrizeUserAvatar: string | null;
  thirdPrizeName: string;
  thirdPrizeQuantity: number;
}

export interface IChestWinnerListPayload {
  chestActivityId?: number;
  chestType?: number;
  teamId?: string;
  page?: number;
  size?: number;
}

export interface IPaginationData<T> {
  total: number;
  page: number;
  size: number;
  list: T[];
}

export interface IPrizeItem {
  id: number;
  name: string;
  imageUrl: string;
  value: number;
  description?: string;
  enabled?: number;
  createTime?: string;
  updateTime?: string;
}
