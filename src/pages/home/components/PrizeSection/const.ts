export interface IPrizeItem {
  id: number;
  name: string;
  image: string;
  badge: string;
}

export const prizeAssets = {
  platform: new URL("../../../../assets/prize-platform.png", import.meta.url).href,
};

export const prizeList: IPrizeItem[] = [
  {
    id: 1,
    name: "iPhone 17 Pro 256G",
    image: new URL("../../../../assets/first-prize.png", import.meta.url).href,
    badge: "一等奖",
  },
  {
    id: 2,
    name: "Apple Vision Pro",
    image: new URL("../../../../assets/second-prize.png", import.meta.url).href,
    badge: "二等奖",
  },
  {
    id: 3,
    name: "iPad Pro",
    image: new URL("../../../../assets/third-prize.png", import.meta.url).href,
    badge: "三等奖",
  },
  {
    id: 4,
    name: "Apple Watch Ultra",
    image: new URL("../../../../assets/other-prize-1.png", import.meta.url).href,
    badge: "幸运奖",
  },
  {
    id: 5,
    name: "AirPods Max",
    image: new URL("../../../../assets/other-prize-2.png", import.meta.url).href,
    badge: "幸运奖",
  },
];

export const actionButtons = ["去开箱", "抽奖冲榜", "战队组队"];
