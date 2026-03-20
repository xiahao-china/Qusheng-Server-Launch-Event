export const heroAssets = {
  topBackground: new URL("../../../../assets/top-background.png", import.meta.url).href,
  backButton: new URL("../../../../assets/back-button.png", import.meta.url).href,
  allPrizes: new URL("../../../../assets/all-prizes.png", import.meta.url).href,
  millionCheckin: new URL("../../../../assets/million-checkin.png", import.meta.url).href,
  ruleDescription: new URL("../../../../assets/rule-description.png", import.meta.url).href,
  teamCharge: new URL("../../../../assets/team-charge.png", import.meta.url).href,
};

export type HeroMode = "all-prizes" | "million-checkin" | "rule-description" | "team-charge";

export interface IHeroModeOption {
  mode: HeroMode;
  image: string;
  alt: string;
  side: "left" | "right";
}

export const heroModeOptions: IHeroModeOption[] = [
  { mode: "all-prizes", image: heroAssets.allPrizes, alt: "全服奖品", side: "left" },
  { mode: "million-checkin", image: heroAssets.millionCheckin, alt: "百万打卡", side: "left" },
  { mode: "rule-description", image: heroAssets.ruleDescription, alt: "规则说明", side: "right" },
  { mode: "team-charge", image: heroAssets.teamCharge, alt: "组队冲榜", side: "right" },
];

export const heroText = {
  season: "第 01 期",
  title: "开服邀约",
  subTitle: "参与贡献排名，赢取万⼴豪礼",
};
