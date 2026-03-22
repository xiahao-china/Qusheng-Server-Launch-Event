<template>
  <section class="team-charge-module">
    <NoticeSection :notice-text-list="noticeTextList" />
    <TeamQualificationSection
      v-if="moduleStatus === TeamModuleStatus.NoQualification"
      :mount-config="teamMountConfig"
      @action="handleInviteAction"
    />
    <TeamInitiateSection
      v-else-if="moduleStatus === TeamModuleStatus.Opened || teamChestInfo?.status !== 1"
      :team-name="teamInfo?.teamName || '我的战队'"
      :user-name="teamInfo?.teamName?.replace('战队', '') || '战队长'"
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
    <LuckySection :lucky-list="luckyList" />
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
      @close="closeInitiatePopup"
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
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { showToast } from "vant";
import { getTeamMountConfig, getTeamQualificationInfo } from "@/api/chest/team";
import { getTeamChestDetail, getTeamChestHistory } from "@/api/chest/teamChest";
import type { IChestInfo, ITeamHistoryItem, ITeamMountConfig, ITeamQualificationInfo } from "@/api/chest/types";
import NoticeSection from "../NoticeSection/index.vue";
import TeamQualificationSection from "../TeamQualificationSection/index.vue";
import TeamInitiateSection from "../TeamInitiateSection/index.vue";
import TeamTaskSection from "../TeamTaskSection/index.vue";
import ServerLaunchMountPopup from "../ServerLaunchMountPopup/index.vue";
import RenameTeamPopup from "../RenameTeamPopup/index.vue";
import InitiateActivityPopup from "../InitiateActivityPopup/index.vue";
import SharePopup from "../SharePopup/index.vue";
import AddressPopup from "../AddressPopup/index.vue";
import LuckySection from "../LuckySection/index.vue";
import type { ILuckyDisplayItem } from "../LuckySection/index.vue";
import { millionDressUpList, millionPrizeFallbackList } from "../MillionCheckinModule/const";
import { TeamModuleStatus, resolveApiResult } from "./const";

const emit = defineEmits<{
  (event: "show-rule", type: string): void;
  (event: "mode-change", mode: string): void;
}>();

const teamInfo = ref<ITeamQualificationInfo | null>(null);
const teamMountConfig = ref<ITeamMountConfig | null>(null);
const teamChestInfo = ref<IChestInfo | null>(null);
const historyList = ref<ITeamHistoryItem[]>([]);
const selectedHistoryIndex = ref(0);
const mountPopupVisible = ref(false);
const renamePopupVisible = ref(false);
const initiatePopupVisible = ref(false);
const sharePopupVisible = ref(false);
const addressPopupVisible = ref(false);

const moduleStatus = computed<TeamModuleStatus>(() => {
  if (!teamInfo.value?.hasTeam) {
    return TeamModuleStatus.NoQualification;
  }
  if (teamChestInfo.value?.status === 1) {
    return TeamModuleStatus.Opened;
  }
  return TeamModuleStatus.Initiated;
});

const loading = ref(false);

const noticeTextList = computed(() => {
  if (!teamChestInfo.value?.participants.length) {
    return ["暂无最新战队打卡动态"];
  }
  return teamChestInfo.value.participants.map((participant) => {
    return `${participant.userName} 参与${participant.quantity}次战队宝箱`;
  });
});

const currentHistoryItem = computed(() => {
  if (!historyList.value.length) {
    return null;
  }
  return historyList.value[selectedHistoryIndex.value] ?? null;
});

const teamPrizeList = computed(() => {
  if (teamChestInfo.value) {
    return [
      {
        ...millionPrizeFallbackList[0],
        name: `奖品ID ${teamChestInfo.value.firstPrizeItemId} x${teamChestInfo.value.firstPrizeQuantity}`,
      },
      {
        ...millionPrizeFallbackList[1],
        name: `奖品ID ${teamChestInfo.value.secondPrizeItemId} x${teamChestInfo.value.secondPrizeQuantity}`,
      },
      {
        ...millionPrizeFallbackList[2],
        name: `奖品ID ${teamChestInfo.value.thirdPrizeItemId} x${teamChestInfo.value.thirdPrizeQuantity}`,
      },
    ];
  }
  if (currentHistoryItem.value) {
    return [
      {
        ...millionPrizeFallbackList[0],
        name: `${currentHistoryItem.value.firstPrizeName} x${currentHistoryItem.value.firstPrizeQuantity}`,
      },
      {
        ...millionPrizeFallbackList[1],
        name: `${currentHistoryItem.value.secondPrizeName} x${currentHistoryItem.value.secondPrizeQuantity}`,
      },
      {
        ...millionPrizeFallbackList[2],
        name: `${currentHistoryItem.value.thirdPrizeName} x${currentHistoryItem.value.thirdPrizeQuantity}`,
      },
    ];
  }
  return millionPrizeFallbackList;
});

const progressPercent = computed(() => {
  if (!teamChestInfo.value || teamChestInfo.value.totalOpenTimes <= 0) {
    return 0;
  }
  const rawValue = (teamChestInfo.value.currentParticipationCount / teamChestInfo.value.totalOpenTimes) * 100;
  return Math.max(0, Math.min(rawValue, 100));
});

const luckyList = computed<ILuckyDisplayItem[]>(() => {
  if (!teamChestInfo.value && !currentHistoryItem.value) {
    return [];
  }
  
  const status = teamChestInfo.value ? teamChestInfo.value.status : currentHistoryItem.value?.status;
  const singleParticipationAmount = teamChestInfo.value ? teamChestInfo.value.singleParticipationAmount : 0;
  
  const winnerUserIds = teamChestInfo.value ? [
    teamChestInfo.value.result?.firstPrizeUserId ?? "",
    teamChestInfo.value.result?.secondPrizeUserId ?? "",
    teamChestInfo.value.result?.thirdPrizeUserId ?? "",
  ] : [
    currentHistoryItem.value?.firstPrizeUserId ?? "",
    currentHistoryItem.value?.secondPrizeUserId ?? "",
    currentHistoryItem.value?.thirdPrizeUserId ?? "",
  ];

  return teamPrizeList.value.map((item, index) => ({
    id: index + 1,
    userName: status === 2 ? winnerUserIds[index] || "未知用户" : "开奖中",
    value: singleParticipationAmount,
    prize: item.name,
  }));
});

const loadTeamInfo = async () => {
  const response = await getTeamQualificationInfo();
  teamInfo.value = resolveApiResult(response);
};

const loadMountConfig = async () => {
  const response = await getTeamMountConfig();
  teamMountConfig.value = resolveApiResult(response);
};

const loadTeamChestDetail = async () => {
  const teamId = teamInfo.value?.teamId;
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
    await loadTeamInfo();
    if (moduleStatus.value === TeamModuleStatus.NoQualification) {
      await loadMountConfig();
      historyList.value = [];
      teamChestInfo.value = null;
      return;
    }
    await Promise.all([loadTeamChestDetail(), loadTeamHistory()]);
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

const closeInitiatePopup = () => {
  initiatePopupVisible.value = false;
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

const handlePurchaseDressUp = (_dressUpItemId: number) => {
  // handle purchase dress up for team task
  // similar logic as MillionCheckinModule
};

onMounted(() => {
  init();
});

</script>

<style lang="less" scoped>
@import "./index.less";
</style>
