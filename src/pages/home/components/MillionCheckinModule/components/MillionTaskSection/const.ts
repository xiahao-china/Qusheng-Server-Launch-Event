import { millionCheckinAssets } from "../../const";

export interface IMillionDressUpItem {
    id: number;
    itemId: number;
    name: string;
    image: string;
}

export const millionDressUpList: IMillionDressUpItem[] = [
    {id: 1, itemId: 5287, name: "圣翼之光", image: millionCheckinAssets.frame1},
    {id: 2, itemId: 5286, name: "盛典之星", image: millionCheckinAssets.frame2},
    {id: 3, itemId: 5285, name: "璀璨之星", image: millionCheckinAssets.frame3},
];

export interface IPurchaseItem {
    id: number;
    price: number;
    image: string;
    name: string;
}
