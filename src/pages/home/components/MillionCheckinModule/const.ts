export const millionCheckinAssets = {
  panelBackground: new URL("../../../../assets/ranking-background.png", import.meta.url).href,
  modalBackground: new URL("../../../../assets/modal-background.png", import.meta.url).href,
  titleBackground: new URL("../../../../assets/modal-title-background.png", import.meta.url).href,
  progressBarBackground: new URL("../../../../assets/scrollbar-background.png", import.meta.url).href,
  actionButton: new URL("../../../../assets/pink-button.png", import.meta.url).href,
  cancelButton: new URL("../../../../assets/cancel-button-background.png", import.meta.url).href,
  confirmButton: new URL("../../../../assets/confirm-button-background.png", import.meta.url).href,
  diamond: new URL("../../../../assets/diamond.png", import.meta.url).href,
  prize1: new URL("../../../../assets/first-prize.png", import.meta.url).href,
  prize2: new URL("../../../../assets/second-prize.png", import.meta.url).href,
  prize3: new URL("../../../../assets/third-prize.png", import.meta.url).href,
  frame1: new URL("../../../../assets/other-prize-one.png", import.meta.url).href,
  frame2: new URL("../../../../assets/other-prize-two.png", import.meta.url).href,
  frame3: new URL("../../../../assets/first-prize.png", import.meta.url).href,
  avatar1: new URL("../../../../assets/rank-1.png", import.meta.url).href,
  avatar2: new URL("../../../../assets/rank-2.png", import.meta.url).href,
  avatar3: new URL("../../../../assets/rank-3.png", import.meta.url).href,
};

export const millionDefaultNoticeText = "暂无最新打卡动态";

export interface IMillionPrizeDisplayItem {
  id: number;
  itemId: number;
  name: string;
  label: string;
  image: string;
  quantity: number;
}

export const millionPrizeFallbackList: IMillionPrizeDisplayItem[] = [
  { id: 1, itemId: 1, name: "一等奖奖品", label: "一等奖", image: millionCheckinAssets.prize1, quantity: 1 },
  { id: 2, itemId: 2, name: "二等奖奖品", label: "二等奖", image: millionCheckinAssets.prize2, quantity: 1 },
  { id: 3, itemId: 3, name: "三等奖奖品", label: "三等奖", image: millionCheckinAssets.prize3, quantity: 1 },
];

export interface IMillionDressUpItem {
  id: number;
  itemId: number;
  name: string;
  image: string;
}

export const millionDressUpList: IMillionDressUpItem[] = [
  { id: 1, itemId: 10086, name: "圣墅之光", image: millionCheckinAssets.frame1 },
  { id: 2, itemId: 10087, name: "盛典之星", image: millionCheckinAssets.frame2 },
  { id: 3, itemId: 10088, name: "璀璨之星", image: millionCheckinAssets.frame3 },
];

export const millionAvatarFallbacks = [
  millionCheckinAssets.avatar1,
  millionCheckinAssets.avatar2,
  millionCheckinAssets.avatar3,
];
