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
