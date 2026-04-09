export const heroAssets = {
  topBackground: new URL("../../../../assets/top-background.png", import.meta.url).href,
  backButton: new URL("../../../../assets/back-button.png", import.meta.url).href,
  allPrizes: new URL("../../../../assets/all-prize.png", import.meta.url).href,
  mainBtnActive: new URL("../../../../assets/main-btn-active.png", import.meta.url).href,
  mainBtnNormal: new URL("../../../../assets/main-btn-normal.png", import.meta.url).href,
};

export enum HeroMode {
  MILLION_CHECKIN = "million-checkin",
  RULE_DESCRIPTION = "rule-description",
  TEAM_CHARGE = "team-charge"
}

export interface IHeroModeOption {
  mode: HeroMode;
  label: string;
}

export const heroModeOptions: IHeroModeOption[] = [
  { mode: HeroMode.MILLION_CHECKIN, label: "百万打卡" },
  { mode: HeroMode.TEAM_CHARGE, label: "战队冲锋" },
  { mode: HeroMode.RULE_DESCRIPTION, label: "规则说明" },
];

export const heroText = {
  season: "第 01 期",
  title: "开服邀约",
  subTitle: "参与贡献排名，赢取万⼴豪礼",
};
