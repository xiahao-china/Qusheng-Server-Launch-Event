<template>
  <section class="team-charge-module">
    <PrizeSection :prize-list="teamPrizeList" :action-buttons="actionButtons" @action="handleAction" />
    <TeamSummarySection
      :title="summaryTitle"
      :count="summaryCount"
      :unit="summaryUnit"
      :can-prev="canPrevHistory"
      :can-next="canNextHistory"
      @prev="showPrevHistory"
      @next="showNextHistory"
    />
    <TeamInviteSection
      :title="inviteTitle"
      :description="inviteDescription"
      :button-text="inviteButtonText"
      @action="handleInviteAction"
    />
    <RankSection :rank-list="rankDisplayList" />
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { showToast } from "vant";
import { getUserRecordList } from "@/api/chest/record";
import { createTeam, getTeamMountConfig, getTeamQualificationInfo, renameTeam } from "@/api/chest/team";
import { getTeamChestDetail, getTeamChestHistory, initTeamChest, joinTeamChest } from "@/api/chest/teamChest";
import type { IChestInfo, ITeamHistoryItem, ITeamMountConfig, ITeamQualificationInfo, IUserRecordItem } from "@/api/chest/types";
import PrizeSection from "../PrizeSection/index.vue";
import RankSection from "../RankSection/index.vue";
import TeamInviteSection from "../TeamInviteSection/index.vue";
import TeamSummarySection from "../TeamSummarySection/index.vue";
import { prizeList as prizeFallbackList } from "../PrizeSection/const";
import { rankAssets, type IRankItem } from "../RankSection/const";

const teamInfo = ref<ITeamQualificationInfo | null>(null);
const teamMountConfig = ref<ITeamMountConfig | null>(null);
const teamChestInfo = ref<IChestInfo | null>(null);
const historyList = ref<ITeamHistoryItem[]>([]);
const selectedHistoryIndex = ref(0);

const loading = ref(false);
const operating = ref(false);

const actionButtons = computed(() => {
  if (!teamInfo.value?.hasTeam) {
    return ["开通战队", "刷新信息", "我的记录"];
  }
  if (teamChestInfo.value?.status === 1) {
    return ["参与战队宝箱", "发起战队宝箱", "历史宝箱"];
  }
  return ["发起战队宝箱", "刷新宝箱", "历史宝箱"];
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
        ...prizeFallbackList[0],
        name: `奖品ID ${teamChestInfo.value.firstPrizeItemId} x${teamChestInfo.value.firstPrizeQuantity}`,
      },
      {
        ...prizeFallbackList[1],
        name: `奖品ID ${teamChestInfo.value.secondPrizeItemId} x${teamChestInfo.value.secondPrizeQuantity}`,
      },
      {
        ...prizeFallbackList[2],
        name: `奖品ID ${teamChestInfo.value.thirdPrizeItemId} x${teamChestInfo.value.thirdPrizeQuantity}`,
      },
    ];
  }
  if (currentHistoryItem.value) {
    return [
      {
        ...prizeFallbackList[0],
        name: `${currentHistoryItem.value.firstPrizeName} x${currentHistoryItem.value.firstPrizeQuantity}`,
      },
      {
        ...prizeFallbackList[1],
        name: `${currentHistoryItem.value.secondPrizeName} x${currentHistoryItem.value.secondPrizeQuantity}`,
      },
      {
        ...prizeFallbackList[2],
        name: `${currentHistoryItem.value.thirdPrizeName} x${currentHistoryItem.value.thirdPrizeQuantity}`,
      },
    ];
  }
  return prizeFallbackList;
});

const summaryTitle = computed(() => {
  if (teamInfo.value?.hasTeam && teamInfo.value.teamName) {
    return `战队${teamInfo.value.teamName}历史宝箱`;
  }
  return "当前可开通";
});

const summaryCount = computed(() => {
  if (historyList.value.length) {
    return selectedHistoryIndex.value + 1;
  }
  if (teamInfo.value?.hasTeam) {
    return teamChestInfo.value?.currentParticipationCount ?? 0;
  }
  return teamMountConfig.value?.price ?? 0;
});

const summaryUnit = computed(() => {
  if (historyList.value.length) {
    return `/ ${historyList.value.length}`;
  }
  if (teamInfo.value?.hasTeam) {
    return "次参与";
  }
  return "GGD";
});

const canPrevHistory = computed(() => historyList.value.length > 1 && selectedHistoryIndex.value > 0);
const canNextHistory = computed(
  () => historyList.value.length > 1 && selectedHistoryIndex.value < historyList.value.length - 1
);

const inviteTitle = computed(() => {
  if (!teamInfo.value?.hasTeam) {
    return "战队集结令";
  }
  return teamInfo.value.teamName || "我的战队";
});

const inviteDescription = computed(() => {
  if (!teamInfo.value?.hasTeam) {
    if (!teamMountConfig.value) {
      return "开通战队后可发起战队宝箱";
    }
    return `开通需要坐骑：${teamMountConfig.value.mountName}（${teamMountConfig.value.price} GGD）`;
  }
  if (!teamChestInfo.value) {
    return "暂无进行中的战队宝箱，点击按钮可发起";
  }
  return `当前进度 ${teamChestInfo.value.currentParticipationCount}/${teamChestInfo.value.totalOpenTimes}`;
});

const inviteButtonText = computed(() => {
  if (!teamInfo.value?.hasTeam) {
    return "立即开通战队";
  }
  return "修改战队名称";
});

const rankDisplayList = computed<IRankItem[]>(() => {
  if (!teamChestInfo.value?.participants.length) {
    return [];
  }
  const rankIconMap = [rankAssets.rank1, rankAssets.rank2, rankAssets.rank3, rankAssets.rank4, rankAssets.rank5];
  const contributionMap = new Map<string, number>();
  teamChestInfo.value.participants.forEach((item) => {
    const current = contributionMap.get(item.userName) ?? 0;
    contributionMap.set(item.userName, current + item.unitPrice * item.quantity);
  });
  return Array.from(contributionMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([userName, contribution], index) => ({
      id: index + 1,
      userName,
      contribution,
      rankIcon: rankIconMap[index] ?? rankAssets.rank5,
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
  if (!teamInfo.value?.hasTeam || !teamId) {
    teamChestInfo.value = null;
    return;
  }
  const response = await getTeamChestDetail(String(teamId));
  teamChestInfo.value = resolveApiResult(response);
};

const loadTeamHistory = async () => {
  if (!teamInfo.value?.hasTeam) {
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
    if (!teamInfo.value?.hasTeam) {
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

const createTeamAndRefresh = async () => {
  if (operating.value) {
    return;
  }
  operating.value = true;
  try {
    const response = await createTeam();
    teamInfo.value = resolveApiResult(response);
    showToast("开通战队成功");
    await loadTeamModuleData();
  } catch (error) {
    const message = error instanceof Error ? error.message : "开通战队失败";
    showToast(message);
  } finally {
    operating.value = false;
  }
};

const renameCurrentTeam = async () => {
  if (!teamInfo.value?.hasTeam || operating.value) {
    return;
  }
  const nextName = window.prompt("请输入新的战队名称（1-20个字符）", teamInfo.value.teamName || "");
  if (!nextName) {
    return;
  }
  const trimmedName = nextName.trim();
  if (!trimmedName || trimmedName.length > 20) {
    showToast("战队名称需为1-20个字符");
    return;
  }
  operating.value = true;
  try {
    const response = await renameTeam({ teamName: trimmedName });
    resolveApiResult(response);
    showToast("战队名称修改成功");
    await loadTeamInfo();
  } catch (error) {
    const message = error instanceof Error ? error.message : "修改战队名称失败";
    showToast(message);
  } finally {
    operating.value = false;
  }
};

const initTeamChestWithDefault = async () => {
  if (!teamInfo.value?.hasTeam || operating.value) {
    return;
  }
  operating.value = true;
  try {
    const response = await initTeamChest({
      firstPrizeItemId: 1,
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
    await loadTeamHistory();
  } catch (error) {
    const message = error instanceof Error ? error.message : "发起战队宝箱失败";
    showToast(message);
  } finally {
    operating.value = false;
  }
};

const joinCurrentTeamChest = async () => {
  if (!teamInfo.value?.hasTeam || !teamInfo.value.teamId || !teamChestInfo.value || operating.value) {
    showToast("当前暂无可参与的战队宝箱");
    return;
  }
  if (teamChestInfo.value.status !== 1) {
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
    if (!historyList.value.length && teamInfo.value?.hasTeam) {
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

const handleAction = async (action: string) => {
  if (action === "开通战队") {
    await createTeamAndRefresh();
    return;
  }
  if (action === "刷新信息" || action === "刷新宝箱") {
    await loadTeamModuleData();
    return;
  }
  if (action === "我的记录") {
    await showRecords();
    return;
  }
  if (action === "参与战队宝箱") {
    await joinCurrentTeamChest();
    return;
  }
  if (action === "发起战队宝箱") {
    await initTeamChestWithDefault();
    return;
  }
  if (action === "历史宝箱") {
    await showHistory();
  }
};

const handleInviteAction = async () => {
  if (!teamInfo.value?.hasTeam) {
    await createTeamAndRefresh();
    return;
  }
  await renameCurrentTeam();
};

const showPrevHistory = () => {
  if (!canPrevHistory.value) {
    return;
  }
  selectedHistoryIndex.value -= 1;
};

const showNextHistory = () => {
  if (!canNextHistory.value) {
    return;
  }
  selectedHistoryIndex.value += 1;
};

onMounted(() => {
  loadTeamModuleData();
});

import "./index.less";
</script>
