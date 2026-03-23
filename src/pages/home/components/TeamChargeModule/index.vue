<template>
  <section class="team-charge-module">
    <NoticeSection :notice-text-list="noticeTextList" />
    <TeamQualificationSection
      v-if="moduleStatus === TeamModuleStatus.NoQualification && !orderTeamId"
      :mount-config="teamMountConfig"
      @action="handleInviteAction"
    />
    <TeamInitiateSection
      v-else-if="moduleStatus === TeamModuleStatus.Opened && !orderTeamId"
      :team-name="teamInfo?.teamName || '我的战队'"
      @rename="renameCurrentTeam"
      @initiate="initTeamChestWithDefault"
    />
    <TeamTaskSection
      v-else
      :team-name="teamInfo?.teamName || '我的战队'"
      :contribution="teamChestInfo?.currentParticipationCount ?? 0"
      :reward-list="teamPrizeList"
      :dress-up-list="millionDressUpList"
      :progress-percent="progressPercent"
      :chest-status="teamChestInfo?.status ?? 0"
      @show-rule="(type) => emit('show-rule', type)"
      @show-records="showRecords"
      @share="handleShare"
      @purchase="handlePurchaseDressUp"
      @click-prize="openAddressPopup"
    />
    <LuckySection :chest-type="2" :team-id="teamInfo?.teamId ? String(teamInfo.teamId) : undefined" />
    <!-- <BoardSection :rank-list="rankDisplayList" /> -->
    <ServerLaunchMountPopup
      v-if="mountPopupVisible"
      @close="closeMountPopup"
      @success="handleMountSuccess"
    />
    <RenameTeamPopup
      v-if="renamePopupVisible"
      :initial-name="teamInfo?.teamName || ''"
      @close="closeRenamePopup"
      @success="handleRenameSuccess"
    />
    <InitiateActivityPopup
      v-if="initiatePopupVisible"
      @close="initiatePopupVisible = false"
      @success="handleInitiateSuccess"
    />
    <SharePopup
      v-if="sharePopupVisible"
      :team-id="String(teamInfo?.teamId || '')"
      @close="closeSharePopup"
    />
    <AddressPopup
      v-if="addressPopupVisible"
      @close="closeAddressPopup"
      @success="handleAddressSuccess"
    />
    <MillionPurchasePopup
      v-if="purchasePopupVisible && selectedDressUpItem"
      :dress-up-item="selectedDressUpItem"
      :quantity="pendingJoinQuantity"
      purchase-mode="team"
      :team-id="teamInfo?.teamId ? String(teamInfo.teamId) : ''"
      @close="handleClosePurchasePopup"
      @success="handlePurchaseSuccess"
    />
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { showToast } from "vant";
import {getTeamMountConfig, getTeamQualificationInfo, getTeamQualificationInfoDetail} from "@/api/chest/team";
import { getTeamChestDetail, getTeamChestHistory, getTeamChestPrizeList } from "@/api/chest/teamChest";
import type { IChestInfo, IPrizeItem, ITeamHistoryItem, ITeamMountConfig, ITeamQualificationInfo } from "@/api/chest/types";
import NoticeSection from "../NoticeSection/index.vue";
import MillionPurchasePopup from "../MillionCheckinModule/components/MillionPurchasePopup/index.vue";
import TeamQualificationSection from "../TeamQualificationSection/index.vue";
import TeamInitiateSection from "../TeamInitiateSection/index.vue";
import TeamTaskSection from "../TeamTaskSection/index.vue";
import ServerLaunchMountPopup from "../ServerLaunchMountPopup/index.vue";
import RenameTeamPopup from "../RenameTeamPopup/index.vue";
import InitiateActivityPopup from "../InitiateActivityPopup/index.vue";
import SharePopup from "../SharePopup/index.vue";
import AddressPopup from "../AddressPopup/index.vue";
import LuckySection from "../LuckySection/index.vue";
import { millionDressUpList } from "../MillionCheckinModule/components/MillionTaskSection/const";
import type { IPurchaseItem } from "../MillionCheckinModule/components/MillionTaskSection/const";
import { composeTeamPrizeList, TeamModuleStatus, resolveApiResult } from "./const";

const emit = defineEmits<{
  (event: "show-rule", type: string): void;
  (event: "mode-change", mode: string): void;
}>();

const teamInfo = ref<ITeamQualificationInfo | null>(null);
const teamMountConfig = ref<ITeamMountConfig | null>(null);
const teamChestInfo = ref<IChestInfo | null>(null);
const teamChestPrizeList = ref<IPrizeItem[]>([]);
const historyList = ref<ITeamHistoryItem[]>([]);
const selectedHistoryIndex = ref(0);
const mountPopupVisible = ref(false);
const renamePopupVisible = ref(false);
const initiatePopupVisible = ref(false);
const sharePopupVisible = ref(false);
const addressPopupVisible = ref(false);
const selectedDressUpItem = ref<IPurchaseItem | null>(null);
const purchasePopupVisible = ref(false);
const pendingJoinQuantity = ref(1);

const orderTeamId = ref<string | undefined>(undefined);

const moduleStatus = computed<TeamModuleStatus>(() => {
  if (!teamInfo.value?.hasTeam) {
    return TeamModuleStatus.NoQualification;
  }
  console.log('teamChestInfo.value?.status', teamChestInfo.value?.status);
  if (teamChestInfo.value?.status) {
    return TeamModuleStatus.Initiated;
  }
  return TeamModuleStatus.Opened;
});

const loading = ref(false);

const noticeTextList = computed(() => {
  if (!teamChestInfo.value?.participants?.length) {
    return ["暂无最新战队打卡动态"];
  }
  return teamChestInfo.value.participants.map((participant) => {
    return `${participant.userName} 参与${participant.quantity}次战队宝箱`;
  });
});

const teamPrizeList = computed(() => {
  if (teamChestInfo.value) {
    return composeTeamPrizeList(teamChestInfo.value, teamChestPrizeList.value);
  }
  return [];
});

const progressPercent = computed(() => {
  if (!teamChestInfo.value || teamChestInfo.value.totalOpenTimes <= 0) {
    return 0;
  }
  const rawValue = (teamChestInfo.value.currentParticipationCount / teamChestInfo.value.totalOpenTimes) * 100;
  return Math.max(0, Math.min(rawValue, 100));
});

const loadTeamInfo = async (teamId?: number | string) => {
  if (teamId){
    const response = await getTeamQualificationInfoDetail(teamId.toString());
    teamInfo.value = resolveApiResult(response);
    return;
  }
  const response = await getTeamQualificationInfo();
  teamInfo.value = resolveApiResult(response);
};

const loadMountConfig = async () => {
  const response = await getTeamMountConfig();
  teamMountConfig.value = resolveApiResult(response);
};

const loadTeamChestDetail = async (orderTeamId?: string) => {
  const teamId = orderTeamId ? orderTeamId : teamInfo.value?.teamId;
  if (moduleStatus.value === TeamModuleStatus.NoQualification || !teamId) {
    teamChestInfo.value = null;
    return;
  }
  const response = await getTeamChestDetail(String(teamId));
  teamChestInfo.value = resolveApiResult(response);
};

const loadTeamHistory = async () => {
  if (moduleStatus.value === TeamModuleStatus.NoQualification) {
    historyList.value = [];
    selectedHistoryIndex.value = 0;
    return;
  }
  const response = await getTeamChestHistory();
  historyList.value = resolveApiResult(response);
  selectedHistoryIndex.value = 0;
};

const init = async () => {
  if (loading.value) {
    return;
  }
  loading.value = true;
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const teamId = urlParams.get("teamId");
    orderTeamId.value = teamId || undefined;
    await loadTeamInfo(teamId || undefined);
    if (moduleStatus.value === TeamModuleStatus.NoQualification) {
      await loadMountConfig();
      historyList.value = [];
      teamChestInfo.value = null;
      teamChestPrizeList.value = [];
      return;
    }
    await Promise.all([loadTeamChestDetail(teamId || undefined), loadTeamHistory(), loadTeamChestPrizeList()]);
  } catch (error) {
    const message = error instanceof Error ? error.message : "加载战队信息失败";
    showToast(message);
  } finally {
    loading.value = false;
  }
};

const closeMountPopup = () => {
  mountPopupVisible.value = false;
};

const handleMountSuccess = async () => {
  mountPopupVisible.value = false;
  await init();
};

const createTeamAndRefresh = async () => {
  mountPopupVisible.value = true;
};

const renameCurrentTeam = async () => {
  if (moduleStatus.value === TeamModuleStatus.NoQualification) {
    return;
  }
  renamePopupVisible.value = true;
};

const closeRenamePopup = () => {
  renamePopupVisible.value = false;
};

const handleRenameSuccess = async () => {
  renamePopupVisible.value = false;
  await init();
};

const initTeamChestWithDefault = async () => {
  if (moduleStatus.value === TeamModuleStatus.NoQualification) {
    return;
  }
  initiatePopupVisible.value = true;
};

const handleShare = () => {
  sharePopupVisible.value = true;
};

const closeSharePopup = () => {
  sharePopupVisible.value = false;
};

const openAddressPopup = () => {
  addressPopupVisible.value = true;
};

const closeAddressPopup = () => {
  addressPopupVisible.value = false;
};

const handleAddressSuccess = () => {
  addressPopupVisible.value = false;
};

const handleInitiateSuccess = async () => {
  initiatePopupVisible.value = false;
  await init();
};

const showRecords = () => {
  emit("mode-change", "show-records");
};

const handleInviteAction = async () => {
  if (moduleStatus.value === TeamModuleStatus.NoQualification) {
    await createTeamAndRefresh();
    return;
  }
};

const handlePurchaseDressUp = (dressUpItemId: number) => {
  const targetItem = millionDressUpList.find((item) => item.itemId === dressUpItemId);
  if (!targetItem) {
    showToast("未找到装扮配置");
    return;
  }
  const unitPrice = teamChestInfo.value?.singleParticipationAmount ?? 0;
  selectedDressUpItem.value = {
    id: targetItem.itemId,
    price: unitPrice,
    image: targetItem.image,
    name: targetItem.name,
  };
  pendingJoinQuantity.value = 1;
  purchasePopupVisible.value = true;
};

const loadTeamChestPrizeList = async () => {
  if (moduleStatus.value === TeamModuleStatus.NoQualification) {
    teamChestPrizeList.value = [];
    return;
  }
  const response = await getTeamChestPrizeList();
  teamChestPrizeList.value = resolveApiResult(response);
};

const handleClosePurchasePopup = () => {
  purchasePopupVisible.value = false;
  pendingJoinQuantity.value = 1;
};

const handlePurchaseSuccess = async () => {
  await loadTeamChestDetail();
};

onMounted(() => {
  init();
});

</script>

<style lang="less" scoped>
@import "./index.less";
</style>
