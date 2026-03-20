export interface IRankItem {
  id: number;
  userName: string;
  contribution: number;
  rankIcon: string;
}

export const rankAssets = {
  boardBg: new URL("../../../../assets/ranking-background.png", import.meta.url).href,
  firstRowBg: new URL("../../../../assets/first-place-background.png", import.meta.url).href,
  normalRowBg: new URL("../../../../assets/other-rank-background.png", import.meta.url).href,
  diamond: new URL("../../../../assets/diamond.png", import.meta.url).href,
  rank1: new URL("../../../../assets/rank-1.png", import.meta.url).href,
  rank2: new URL("../../../../assets/rank-2.png", import.meta.url).href,
  rank3: new URL("../../../../assets/rank-3.png", import.meta.url).href,
  rank4: new URL("../../../../assets/rank-4.png", import.meta.url).href,
  rank5: new URL("../../../../assets/rank-5.png", import.meta.url).href,
};

export const rankTabs = ["排行", "个人名次", "支援", "展示"];

export const rankList: IRankItem[] = [
  { id: 1, userName: "用户A", contribution: 999999, rankIcon: rankAssets.rank1 },
  { id: 2, userName: "用户名的凤", contribution: 100000, rankIcon: rankAssets.rank2 },
  { id: 3, userName: "用户名", contribution: 100000, rankIcon: rankAssets.rank3 },
  { id: 4, userName: "用户的圆", contribution: 100000, rankIcon: rankAssets.rank4 },
  { id: 5, userName: "用户A", contribution: 99999, rankIcon: rankAssets.rank5 },
];
