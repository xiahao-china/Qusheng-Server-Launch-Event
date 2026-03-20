import { prizeList } from "../PrizeSection/const";

export type ActivityPopupType = "rule-description" | "all-prizes";

export const activityPopupAssets = {
  background: new URL("../../../../assets/modal-background.png", import.meta.url).href,
  titleBackground: new URL("../../../../assets/modal-title-background.png", import.meta.url).href,
  confirmButton: new URL("../../../../assets/confirm-button-background.png", import.meta.url).href,
};

export const activityRuleSections = [
  {
    title: "活动规则",
    content: [
      "活动开放期间，参与开服邀约玩法即可获得贡献值，贡献值用于排行榜展示。",
      "全服奖池与组队冲榜为独立玩法，奖励发放以活动页最终展示为准。",
      "如出现异常参与、恶意刷量等行为，平台有权取消对应奖励资格。",
    ],
  },
  {
    title: "奖励规则",
    content: [
      "全服奖池达到开启条件后统一开奖，中奖信息将同步在活动页展示。",
      "组队冲榜按照战队累计贡献排名发放，排名相同以先达成时间优先。",
      "所有奖励将在活动结束后通过系统邮件发放，请留意邮箱信息。",
    ],
  },
];

export const allPrizeList = prizeList;
