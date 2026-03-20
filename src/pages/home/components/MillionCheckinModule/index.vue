<template>
  <section class="million-checkin">
    <MillionNoticeSection :notice-text="noticeText" />
    <MillionRewardSection :reward-list="rewardList" />
    <MillionTaskSection
      :dress-up-list="millionDressUpList"
      :progress-percent="progressPercent"
      :is-joining="joining"
      :chest-status="chestInfo?.status ?? 0"
      :current-participation-count="chestInfo?.currentParticipationCount ?? 0"
      :total-open-times="chestInfo?.totalOpenTimes ?? 0"
      :single-participation-amount="chestInfo?.singleParticipationAmount ?? 0"
      @purchase="handlePurchaseDressUp"
      @join="handleJoin"
      @show-rule="showRule"
      @show-records="showRecords"
    />
    <MillionLuckySection :lucky-list="luckyList" />
    <MillionBoardSection :rank-list="rankList" />
    <MillionPurchasePopup
      v-if="purchasePopupVisible && selectedDressUpItem"
      :dress-up-name="selectedDressUpItem.name"
      :dress-up-image="selectedDressUpItem.image"
      :quantity="pendingJoinQuantity"
      :success-quantity="successJoinQuantity"
      :single-participation-amount="chestInfo?.singleParticipationAmount ?? 0"
      :submitting="joining"
      :success="purchaseSuccess"
      @close="handleClosePurchasePopup"
      @confirm="handleConfirmPurchase"
    />
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { showToast } from "vant";
import { getGlobalChestInfo, joinGlobalChest } from "@/api/chest/global";
import { getUserRecordList } from "@/api/chest/record";
import type { IChestInfo, IUserRecordItem } from "@/api/chest/types";
import MillionNoticeSection from "./components/MillionNoticeSection/index.vue";
import MillionPurchasePopup from "./components/MillionPurchasePopup/index.vue";
import MillionLuckySection from "./components/MillionLuckySection/index.vue";
import MillionBoardSection from "./components/MillionBoardSection/index.vue";
import MillionRewardSection from "./components/MillionRewardSection/index.vue";
import MillionTaskSection from "./components/MillionTaskSection/index.vue";
import { millionAvatarFallbacks, millionDefaultNoticeText, millionDressUpList, millionPrizeFallbackList } from "./const";

interface IMillionLuckyDisplayItem {
  id: number;
  userName: string;
  value: number;
  prize: string;
}

interface IMillionRankDisplayItem {
  id: number;
  name: string;
  value: number;
  avatars: string[];
}

const chestInfo = ref<IChestInfo | null>(null);
const loading = ref(false);
const joining = ref(false);
const selectedDressUpItemId = ref<number>(millionDressUpList[0]?.itemId ?? 0);
const purchasePopupVisible = ref(false);
const purchaseSuccess = ref(false);
const pendingJoinQuantity = ref(1);
const successJoinQuantity = ref(1);

const selectedDressUpItem = computed(() => {
  return millionDressUpList.find((item) => item.itemId === selectedDressUpItemId.value) ?? null;
});

const rewardList = computed(() => {
  if (!chestInfo.value) {
    return millionPrizeFallbackList;
  }
  return [
    {
      id: 1,
      itemId: chestInfo.value.firstPrizeItemId,
      name: `奖品ID ${chestInfo.value.firstPrizeItemId}`,
      label: "一等奖",
      image: millionPrizeFallbackList[0].image,
      quantity: chestInfo.value.firstPrizeQuantity,
    },
    {
      id: 2,
      itemId: chestInfo.value.secondPrizeItemId,
      name: `奖品ID ${chestInfo.value.secondPrizeItemId}`,
      label: "二等奖",
      image: millionPrizeFallbackList[1].image,
      quantity: chestInfo.value.secondPrizeQuantity,
    },
    {
      id: 3,
      itemId: chestInfo.value.thirdPrizeItemId,
      name: `奖品ID ${chestInfo.value.thirdPrizeItemId}`,
      label: "三等奖",
      image: millionPrizeFallbackList[2].image,
      quantity: chestInfo.value.thirdPrizeQuantity,
    },
  ];
});

const progressPercent = computed(() => {
  if (!chestInfo.value || chestInfo.value.totalOpenTimes <= 0) {
    return 0;
  }
  const rawValue = (chestInfo.value.currentParticipationCount / chestInfo.value.totalOpenTimes) * 100;
  return Math.max(0, Math.min(rawValue, 100));
});

const noticeText = computed(() => {
  if (!chestInfo.value?.participants.length) {
    return millionDefaultNoticeText;
  }
  const latestParticipant = chestInfo.value.participants[chestInfo.value.participants.length - 1];
  return `${latestParticipant.userName} 购买${latestParticipant.quantity}次并成功打卡`;
});

const luckyList = computed<IMillionLuckyDisplayItem[]>(() => {
  const winnerUserIds = [
    chestInfo.value?.result?.firstPrizeUserId ?? "",
    chestInfo.value?.result?.secondPrizeUserId ?? "",
    chestInfo.value?.result?.thirdPrizeUserId ?? "",
  ];
  return rewardList.value.map((item, index) => ({
    id: index + 1,
    userName: chestInfo.value?.status === 2 ? winnerUserIds[index] || "未知用户" : "开奖中",
    value: chestInfo.value?.singleParticipationAmount ?? 0,
    prize: item.label,
  }));
});

const rankList = computed<IMillionRankDisplayItem[]>(() => {
  if (!chestInfo.value?.participants.length) {
    return [];
  }
  const contributionMap = new Map<string, number>();
  chestInfo.value.participants.forEach((item) => {
    const currentValue = contributionMap.get(item.userName) ?? 0;
    contributionMap.set(item.userName, currentValue + item.unitPrice * item.quantity);
  });
  return Array.from(contributionMap.entries())
    .map(([name, value], index) => ({
      id: index + 1,
      name,
      value,
      avatars: [millionAvatarFallbacks[index % millionAvatarFallbacks.length]],
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5)
    .map((item, index) => ({
      ...item,
      id: index + 1,
    }));
});

const resolveApiResult = <T>(response: { code: number; msg: string; data: T }) => {
  if (response.code !== 200) {
    throw new Error(response.msg || "请求失败");
  }
  return response.data;
};

const loadGlobalChestInfo = async () => {
  if (loading.value) {
    return;
  }
  loading.value = true;
  try {
    const response = await getGlobalChestInfo();
    chestInfo.value = resolveApiResult(response);
  } catch (error) {
    const message = error instanceof Error ? error.message : "获取全服宝箱信息失败";
    showToast(message);
    chestInfo.value = null;
  } finally {
    loading.value = false;
  }
};

const handlePurchaseDressUp = (dressUpItemId: number) => {
  selectedDressUpItemId.value = dressUpItemId;
  pendingJoinQuantity.value = 1;
  purchaseSuccess.value = false;
  purchasePopupVisible.value = true;
};

const handleJoin = async (quantity: number) => {
  if (!chestInfo.value) {
    showToast("当前暂无进行中的全服宝箱");
    return;
  }
  if (chestInfo.value.status !== 1) {
    showToast("当前宝箱不可参与");
    return;
  }
  if (!selectedDressUpItemId.value) {
    showToast("请选择要购买的装扮");
    return;
  }
  if (quantity < 1) {
    showToast("参与数量至少为1");
    return;
  }
  pendingJoinQuantity.value = quantity;
  purchaseSuccess.value = false;
  purchasePopupVisible.value = true;
};

const handleConfirmPurchase = async (quantity: number) => {
  if (!purchasePopupVisible.value) {
    return;
  }
  if (quantity < 1) {
    showToast("参与数量至少为1");
    return;
  }
  joining.value = true;
  try {
    const response = await joinGlobalChest({
      dressUpItemId: selectedDressUpItemId.value,
      quantity,
    });
    resolveApiResult(response);
    successJoinQuantity.value = quantity;
    purchaseSuccess.value = true;
    showToast("购买成功");
    await loadGlobalChestInfo();
  } catch (error) {
    const message = error instanceof Error ? error.message : "打卡失败";
    showToast(message);
  } finally {
    joining.value = false;
  }
};

const handleClosePurchasePopup = () => {
  purchasePopupVisible.value = false;
  purchaseSuccess.value = false;
  pendingJoinQuantity.value = 1;
};

const buildRecordText = (records: IUserRecordItem[]) => {
  if (!records.length) {
    return "暂无参与记录";
  }
  return records
    .map((item) => `${item.purchaseTime} ${item.dressUpName} x${item.quantity}（${item.prizeDesc}）`)
    .join("\n");
};

const emit = defineEmits<{
  (event: "mode-change", mode: "rule-description" | "show-records"): void;
}>();

const showRule = () => {
  emit("mode-change", "rule-description");
};

const showRecords = () => {
  emit("mode-change", "show-records");
};

onMounted(() => {
  loadGlobalChestInfo();
});
import "./index.less";
</script>
