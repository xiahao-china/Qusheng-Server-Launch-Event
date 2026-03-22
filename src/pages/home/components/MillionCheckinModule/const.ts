export const millionCheckinAssets = {
    panelBackground: new URL("../../../../assets/ranking-background.png", import.meta.url).href,
    prizeModuleBackground: new URL("../../../../assets/prize-module-background.png", import.meta.url).href,
    modalBackground: new URL("../../../../assets/modal-background.png", import.meta.url).href,
    titleBackground: new URL("../../../../assets/modal-title-background.png", import.meta.url).href,
    progressBarBackground: new URL("../../../../assets/scrollbar-background.png", import.meta.url).href,
    actionButton: new URL("../../../../assets/pink-button.png", import.meta.url).href,
    cancelButton: new URL("../../../../assets/cancel-button-background.png", import.meta.url).href,
    confirmButton: new URL("../../../../assets/confirm-button-background.png", import.meta.url).href,
    diamond: new URL("../../../../assets/diamond.png", import.meta.url).href,
    camera: new URL("../../../../assets/camera.png", import.meta.url).href,
    prize1: new URL("../../../../assets/first-prize.png", import.meta.url).href,
    prize2: new URL("../../../../assets/second-prize.png", import.meta.url).href,
    prize3: new URL("../../../../assets/third-prize.png", import.meta.url).href,
    frame1: new URL("../../../../assets/NO.106505.png", import.meta.url).href,
    frame2: new URL("../../../../assets/NO.106803.png", import.meta.url).href,
    frame3: new URL("../../../../assets/NO.1086452.png", import.meta.url).href,
    avatar1: new URL("../../../../assets/rank-1.png", import.meta.url).href,
    avatar2: new URL("../../../../assets/rank-2.png", import.meta.url).href,
    avatar3: new URL("../../../../assets/rank-3.png", import.meta.url).href,
    prizePlatform: new URL("../../../../assets/prize-platform.png", import.meta.url).href
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
    {id: 1, itemId: 1, name: "iPhone17 Pro 256G", label: "一等奖", image: millionCheckinAssets.prize1, quantity: 1},
    {id: 2, itemId: 2, name: "HUAWEI WATCH" + "", label: "二等奖", image: millionCheckinAssets.prize2, quantity: 1},
    {id: 3, itemId: 3, name: "Apple Watch Ultra 3", label: "三等奖", image: millionCheckinAssets.prize3, quantity: 1},
];

export const millionAvatarFallbacks = [
    millionCheckinAssets.avatar1,
    millionCheckinAssets.avatar2,
    millionCheckinAssets.avatar3,
];
