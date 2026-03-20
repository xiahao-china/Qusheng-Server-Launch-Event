export enum ChestMode {
  GLOBAL = "global", // 全服宝箱模式
  TEAM = "team", // 战队宝箱模式
}

export const homeTheme = {
  bgStart: "#9a63ff",
  bgEnd: "#3a148f",
};

export const homeSections = [
  "hero",
  "prize",
  "summary",
  "invite",
  "rank",
];

export const currentMode = ChestMode.TEAM;

export const PRIZE_IMAGE_MAP: Record<number, { name: string; img: string }> = {
  1: {
    name: "iPhone 17 Pro 256G",
    img: new URL("../../assets/first-prize.png", import.meta.url).href,
  },
  2: {
    name: "Apple Vision Pro",
    img: new URL("../../assets/second-prize.png", import.meta.url).href,
  },
  3: {
    name: "iPad Pro",
    img: new URL("../../assets/third-prize.png", import.meta.url).href,
  },
};
