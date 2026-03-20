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
      :user-name="teamInfo?.teamName?.replace('战队', '') || '战队长'"
      :contribution="teamChestInfo?.currentParticipationCount ?? 0"
      :reward-list="teamPrizeList"
      :dress-up-list="millionDressUpList"
      :progress-percent="progressPercent"
      :is-joining="operating"
      :chest-status="teamChestInfo?.status ?? 0"
      @rename="renameCurrentTeam"
      @show-rule="() => {}"
      @show-records="showRecords"
      @share="handleShare"
      @purchase="handlePurchaseDressUp"
      @join="joinCurrentTeamChest"
      @click-prize="openAddressPopup"
    />
    <LuckySection :lucky-list="luckyList" />
    <BoardSection :rank-list="rankDisplayList" />
    <ServerLaunchMountPopup
      v-if="mountPopupVisible"
      @close="closeMountPopup"
      @success="handleMountSuccess"
    />
    <RenameTeamPopup
      v-if="renamePopupVisible"
      :initial-name="teamInfo?.teamName || ''"
      @close="closeRenamePopup"
      @confirm="handleRenameConfirm"
    />
    <InitiateActivityPopup
      v-if="initiatePopupVisible"
      title="选择您想发起的活动一等奖"
      @close="closeInitiatePopup"
      @confirm="handleInitiateConfirm"
    />
    <SharePopup
      v-if="sharePopupVisible"
      :team-id="String(teamInfo?.teamId || '')"
      @close="closeSharePopup"
    />
    <AddressPopup
      v-if="addressPopupVisible"
      @close="closeAddressPopup"
      @confirm="handleAddressConfirm"
    />
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { showToast } from "vant";
import { getUserRecordList } from "@/api/chest/record";
import { getTeamMountConfig, getTeamQualificationInfo, renameTeam } from "@/api/chest/team";
import { getTeamChestDetail, getTeamChestHistory, initTeamChest, joinTeamChest } from "@/api/chest/teamChest";
import type { IChestInfo, ITeamHistoryItem, ITeamMountConfig, ITeamQualificationInfo, IUserRecordItem } from "@/api/chest/types";
import NoticeSection from "../NoticeSection/index.vue";
import BoardSection from "../BoardSection/index.vue";
import type { IBoardDisplayItem } from "../BoardSection/index.vue";
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
import { millionAvatarFallbacks, millionDressUpList, millionPrizeFallbackList } from "../MillionCheckinModule/const";

enum TeamModuleStatus {
  NoQualification = "no-qualification",
  Opened = "opened",
  Initiated = "initiated",
}

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
  if (!teamChestInfo.value) {
    return TeamModuleStatus.Opened;
  }
  return TeamModuleStatus.Initiated;
});

const loading = ref(false);
const operating = ref(false);

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

const rankDisplayList = computed<IBoardDisplayItem[]>(() => {
  if (!teamChestInfo.value?.participants.length) {
    return [];
  }
  const contributionMap = new Map<string, number>();
  teamChestInfo.value.participants.forEach((item) => {
    const current = contributionMap.get(item.userName) ?? 0;
    contributionMap.set(item.userName, current + item.unitPrice * item.quantity);
  });
  return Array.from(contributionMap.entries())
    .map(([userName, contribution], index) => ({
      id: index + 1,
      name: userName,
      value: contribution,
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

const loadTeamModuleData = async () => {
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
  await loadTeamModuleData();
};

const createTeamAndRefresh = async () => {
  if (operating.value) {
    return;
  }
  mountPopupVisible.value = true;
};

const renameCurrentTeam = async () => {
  if (moduleStatus.value === TeamModuleStatus.NoQualification || operating.value) {
    return;
  }
  renamePopupVisible.value = true;
};

const closeRenamePopup = () => {
  renamePopupVisible.value = false;
};

const handleRenameConfirm = async (newName: string) => {
  if (operating.value) return;
  operating.value = true;
  try {
    const response = await renameTeam({ teamName: newName });
    resolveApiResult(response);
    showToast("战队名称修改成功");
    renamePopupVisible.value = false;
    await loadTeamInfo();
  } catch (error) {
    const message = error instanceof Error ? error.message : "修改战队名称失败";
    showToast(message);
  } finally {
    operating.value = false;
  }
};

const initTeamChestWithDefault = async () => {
  if (moduleStatus.value === TeamModuleStatus.NoQualification || operating.value) {
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

const handleAddressConfirm = (addressInfo: { name: string; phone: string; address: string }) => {
  console.log("Address submitted:", addressInfo);
  showToast("地址提交成功");
  addressPopupVisible.value = false;
};

const handleInitiateConfirm = async (prizeId: number) => {
  if (operating.value) return;
  operating.value = true;
  try {
    const response = await initTeamChest({
      firstPrizeItemId: prizeId,
      firstPrizeQuantity: 1,
      secondPrizeItemId: 2,
      secondPrizeQuantity: 1,
      thirdPrizeItemId: 3,
      thirdPrizeQuantity: 1,
      totalPrizeAmount: 3000,
      singleParticipationAmount: 100,
    });
    teamChestInfo.value = resolveApiResult(response);
    showToast("战队宝箱发起成功");
    initiatePopupVisible.value = false;
    await loadTeamHistory();
  } catch (error) {
    const message = error instanceof Error ? error.message : "发起战队宝箱失败";
    showToast(message);
  } finally {
    operating.value = false;
  }
};

const joinCurrentTeamChest = async () => {
  if (moduleStatus.value !== TeamModuleStatus.Initiated || !teamInfo.value?.teamId || operating.value) {
    showToast("当前暂无可参与的战队宝箱");
    return;
  }
  if (teamChestInfo.value?.status !== 1) {
    showToast("当前宝箱不可参与");
    return;
  }
  operating.value = true;
  try {
    const response = await joinTeamChest({
      teamId: String(teamInfo.value.teamId),
      dressUpItemId: 10086,
      quantity: 1,
    });
    resolveApiResult(response);
    showToast("参与成功");
    await loadTeamChestDetail();
  } catch (error) {
    const message = error instanceof Error ? error.message : "参与战队宝箱失败";
    showToast(message);
  } finally {
    operating.value = false;
  }
};

const buildHistoryText = (items: ITeamHistoryItem[]) => {
  if (!items.length) {
    return "暂无历史宝箱记录";
  }
  return items
    .map(
      (item) =>
        `${item.createTime} ${item.statusDesc} ${item.currentParticipationCount}/${item.totalOpenTimes} 一等奖：${item.firstPrizeName}`
    )
    .join("\n");
};

const showHistory = async () => {
  try {
    if (!historyList.value.length && moduleStatus.value !== TeamModuleStatus.NoQualification) {
      await loadTeamHistory();
    }
    showToast({
      message: buildHistoryText(historyList.value),
      duration: 5000,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "获取历史记录失败";
    showToast(message);
  }
};

const buildRecordText = (records: IUserRecordItem[]) => {
  if (!records.length) {
    return "暂无参与记录";
  }
  return records
    .map((item) => `${item.purchaseTime} ${item.dressUpName} x${item.quantity}（${item.prizeDesc}）`)
    .join("\n");
};

const showRecords = async () => {
  try {
    const response = await getUserRecordList({ page: 1, size: 20 });
    const data = resolveApiResult(response);
    showToast({
      message: buildRecordText(data.list),
      duration: 4000,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "获取记录失败";
    showToast(message);
  }
};

const handleInviteAction = async () => {
  if (moduleStatus.value === TeamModuleStatus.NoQualification) {
    await createTeamAndRefresh();
    return;
  }
};

const handlePurchaseDressUp = (dressUpItemId: number) => {
  // handle purchase dress up for team task
  // similar logic as MillionCheckinModule
};

onMounted(() => {
  loadTeamModuleData();
});

</script>

<style lang="less" scoped>
@import "./index.less";
</style>
