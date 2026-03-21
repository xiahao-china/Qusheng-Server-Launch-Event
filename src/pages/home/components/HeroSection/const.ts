export const heroAssets = {
  topBackground: new URL("../../../../assets/top-background.png", import.meta.url).href,
  backButton: new URL("../../../../assets/back-button.png", import.meta.url).href,
  allPrizes: new URL("../../../../assets/all-prizes.png", import.meta.url).href,
  millionCheckin: new URL("../../../../assets/million-checkin.png", import.meta.url).href,
  ruleDescription: new URL("../../../../assets/rule-description.png", import.meta.url).href,
  teamCharge: new URL("../../../../assets/team-charge.png", import.meta.url).href,
};

export enum HeroMode {
  MILLION_CHECKIN = "million-checkin",
  RULE_DESCRIPTION = "rule-description",
  TEAM_CHARGE = "team-charge"
}

export interface IHeroModeOption {
  mode: HeroMode;
  image: string;
  alt: string;
}

export const heroModeOptions: IHeroModeOption[] = [
  { mode: HeroMode.MILLION_CHECKIN, image: heroAssets.millionCheckin, alt: "百万打卡" },
  { mode: HeroMode.TEAM_CHARGE, image: heroAssets.teamCharge, alt: "组队冲榜" },
  { mode: HeroMode.RULE_DESCRIPTION, image: heroAssets.ruleDescription, alt: "规则说明" },
];

export const heroText = {
  season: "第 01 期",
  title: "开服邀约",
  subTitle: "参与贡献排名，赢取万⼴豪礼",
};
