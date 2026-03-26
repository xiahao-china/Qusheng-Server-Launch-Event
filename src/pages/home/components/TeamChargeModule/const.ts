import type {IChestInfo, IPrizeItem, ITeamQualificationInfo} from "@/api/chest/types";
import type {IMillionPrizeDisplayItem} from "../MillionCheckinModule/const";
import {getTeamQualificationInfo, getTeamQualificationInfoDetail} from "@/api/chest/team";

export enum TeamModuleStatus {
    NoQualification = "no-qualification",
    Opened = "opened",
    Initiated = "initiated",
}

export enum TeamTab {
    MY = "my",
    OTHER = "other",
}

export const resolveApiResult = <T>(response: { code: number; msg: string; data: T }) => {
    if (response.code !== 200) {
        throw new Error(response.msg || "请求失败");
    }
    return response.data;
};

const buildPrizeItem = (
    level: number,
    prizeItemId: number,
    quantity: number,
    prizeList: IPrizeItem[]
): IMillionPrizeDisplayItem => {
    const prizeItem = prizeList.find((item) => item.id === prizeItemId);
    const prizeName = prizeItem?.name || `奖品ID ${prizeItemId}`;
    return {
        id: prizeItemId,
        itemId: prizeItemId,
        name: prizeName,
        label: `${level === 1 ? '一' : level === 2 ? '二' : '三'}等奖`,
        image: prizeItem?.imageUrl || "",
        quantity: quantity,
    };
};

export const composeTeamPrizeList = (chestInfo: IChestInfo, prizeList: IPrizeItem[]): IMillionPrizeDisplayItem[] => {
    return [
        buildPrizeItem(1, chestInfo.firstPrizeItemId, chestInfo.firstPrizeQuantity, prizeList),
        buildPrizeItem(2, chestInfo.secondPrizeItemId, chestInfo.secondPrizeQuantity, prizeList),
        buildPrizeItem(3, chestInfo.thirdPrizeItemId, chestInfo.thirdPrizeQuantity, prizeList),
    ];
};

/**
 * 获取战队信息
 * @param teamId 可选的战队ID，若提供则获取特定战队详情，否则获取当前用户的战队资格信息
 */
export const loadTeamInfo = async (teamId?: number | string): Promise<ITeamQualificationInfo | null> => {
    if (teamId) {
        const response = await getTeamQualificationInfoDetail(teamId.toString());
        return resolveApiResult(response);
    }
    const response = await getTeamQualificationInfo();
    return resolveApiResult(response);
};
