<template>
  <section class="million-checkin">
    <NoticeSection :notice-text-list="noticeTextList" />
    <MillionRewardSection :reward-list="rewardList" />
    <MillionTaskSection
      :progress-percent="progressPercent"
      :chest-status="chestInfo?.status ?? 0"
      :current-participation-count="chestInfo?.currentParticipationCount ?? 0"
      :total-open-times="chestInfo?.totalOpenTimes ?? 0"
      :single-participation-amount="chestInfo?.singleParticipationAmount ?? 0"
      @purchase="handlePurchaseDressUp"
      @show-rule="(type) => emit('show-rule', type)"
      @show-records="showRecords"
    />
    <LuckySection :chest-type="1" />
    <!-- <BoardSection :rank-list="rankList" /> -->
    <MillionPurchasePopup
      v-if="purchasePopupVisible && selectedDressUpItem"
      :dress-up-item="selectedDressUpItem"
      :quantity="pendingJoinQuantity"
      @close="handleClosePurchasePopup"
      @success="handlePurchaseSuccess"
    />
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { showToast } from "vant";
import { getGlobalChestInfo } from "@/api/chest/global";
import type { IChestInfo } from "@/api/chest/types";
import NoticeSection from "../NoticeSection/index.vue";
import MillionPurchasePopup from "./components/MillionPurchasePopup/index.vue";
import LuckySection from "../LuckySection/index.vue";
import MillionRewardSection from "./components/MillionRewardSection/index.vue";
import MillionTaskSection from "./components/MillionTaskSection/index.vue";
import type { IPurchaseItem } from "./components/MillionTaskSection/const";
import { millionDefaultNoticeText, millionPrizeFallbackList } from "./const";

const chestInfo = ref<IChestInfo | null>(null);
const loading = ref(false);
const selectedDressUpItem = ref<IPurchaseItem | null>(null);
const purchasePopupVisible = ref(false);
const pendingJoinQuantity = ref(1);

const emit = defineEmits<{
  (event: "mode-change", mode: string): void;
  (event: "show-rule", type: string): void;
}>();

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

const noticeTextList = computed(() => {
  if (!chestInfo.value?.participants.length) {
    return [millionDefaultNoticeText];
  }
  return chestInfo.value.participants.map((participant) => {
    return `${participant.userName} 购买${participant.quantity}次并成功打卡`;
  });
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

const handlePurchaseDressUp = (item: IPurchaseItem) => {
  selectedDressUpItem.value = item;
  pendingJoinQuantity.value = 1;
  purchasePopupVisible.value = true;
};

const handlePurchaseSuccess = async () => {
  await loadGlobalChestInfo();
};

const handleClosePurchasePopup = () => {
  purchasePopupVisible.value = false;
  pendingJoinQuantity.value = 1;
};

const showRecords = () => {
  emit("mode-change", "show-records");
};

onMounted(() => {
  loadGlobalChestInfo();
});
</script>

<style lang="less" scoped>
@import "./index.less";
</style>
