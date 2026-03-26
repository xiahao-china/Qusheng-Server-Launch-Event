<template>
  <section class="team-charge-module">
    <NoticeSection :notice-text-list="noticeTextList" />
    <TeamSwitchTab v-model="currentTab" />
    <TeamQualificationSection
      v-if="moduleStatus === TeamModuleStatus.NoQualification && currentTab === TeamTab.MY"
      :mount-config="teamMountConfig"
      @action="mountPopupVisible = true"
    />
    <TeamInitiateSection
      v-else-if="moduleStatus === TeamModuleStatus.Opened && currentTab === TeamTab.MY"
      :team-name="teamInfo?.teamName || '我的战队'"
      @rename="renamePopupVisible = true"
      @initiate="initiatePopupVisible = true"
    />
    <TeamTaskSection
      v-else
      :team-name="teamInfo?.teamName || '我的战队'"
      :contribution="teamChestInfo?.currentParticipationCount ?? 0"
      :reward-list="teamPrizeList"
      :dress-up-list="millionDressUpList"
      :progress-percent="progressPercent"
      :chest-status="teamChestInfo?.status ?? 0"
      :current-tab="currentTab"
      :order-team-id="orderTeamId"
      @show-rule="(type) => emit('show-rule', type)"
      @show-records="emit('mode-change', 'show-records')"
      @share="sharePopupVisible = true"
      @purchase="handlePurchaseDressUp"
      @click-prize="addressPopupVisible = true"
      @search="handleSearch"
    />
    <LuckySection :chest-type="2" :team-id="teamInfo?.teamId ? String(teamInfo.teamId) : undefined" />
    <!-- <BoardSection :rank-list="rankDisplayList" /> -->
    <ServerLaunchMountPopup
      v-if="mountPopupVisible"
      @close="mountPopupVisible = false"
      @success="handleMountSuccess"
    />
    <RenameTeamPopup
      v-if="renamePopupVisible"
      :initial-name="teamInfo?.teamName || ''"
      @close="renamePopupVisible = false"
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
      @close="sharePopupVisible = false"
    />
<!--    <AddressPopup-->
<!--      v-if="addressPopupVisible"-->
<!--      @close="closeAddressPopup"-->
<!--      @success="handleAddressSuccess"-->
<!--    />-->
    <MillionPurchasePopup
      v-if="purchasePopupVisible && selectedDressUpItem"
      :dress-up-item="selectedDressUpItem"
      :quantity="pendingJoinQuantity"
      purchase-mode="team"
      :team-id="teamInfo?.teamId ? String(teamInfo.teamId) : ''"
      @close="handleClosePurchasePopup"
      @success="loadTeamChestDetail"
    />
  </section>
</template>

<script setup lang="ts">
import {computed, onMounted, ref, watch} from "vue";
import {showToast} from "vant";
import {getTeamMountConfig} from "@/api/chest/team";
import {getTeamChestDetail, getTeamChestPrizeList} from "@/api/chest/teamChest";
import type {IChestInfo, IPrizeItem, ITeamMountConfig, ITeamQualificationInfo} from "@/api/chest/types";
import NoticeSection from "../NoticeSection/index.vue";
import MillionPurchasePopup from "../MillionCheckinModule/components/MillionPurchasePopup/index.vue";
import TeamQualificationSection from "../TeamQualificationSection/index.vue";
import TeamInitiateSection from "../TeamInitiateSection/index.vue";
import TeamTaskSection from "../TeamTaskSection/index.vue";
import ServerLaunchMountPopup from "../ServerLaunchMountPopup/index.vue";
import RenameTeamPopup from "../RenameTeamPopup/index.vue";
import InitiateActivityPopup from "../InitiateActivityPopup/index.vue";
import TeamSwitchTab from "../TeamSwitchTab/index.vue";
import SharePopup from "../SharePopup/index.vue";
// import AddressPopup from "../AddressPopup/index.vue";
import LuckySection from "../LuckySection/index.vue";
import type {IPurchaseItem} from "../MillionCheckinModule/components/MillionTaskSection/const";
import {millionDressUpList} from "../MillionCheckinModule/components/MillionTaskSection/const";
import {composeTeamPrizeList, loadTeamInfo, resolveApiResult, TeamModuleStatus, TeamTab} from "./const";
import {getUserInfo} from "@/api/user.ts";

const emit = defineEmits<{
  (event: "show-rule", type: string): void;
  (event: "mode-change", mode: string): void;
}>();

const teamInfo = ref<ITeamQualificationInfo | null>(null);
const teamMountConfig = ref<ITeamMountConfig | null>(null);
const teamChestInfo = ref<IChestInfo | null>(null);
const teamChestPrizeList = ref<IPrizeItem[]>([]);
const currentTab = ref<TeamTab>(TeamTab.MY);
const mountPopupVisible = ref(false);
const renamePopupVisible = ref(false);
const initiatePopupVisible = ref(false);
const sharePopupVisible = ref(false);
const addressPopupVisible = ref(false);
const selectedDressUpItem = ref<IPurchaseItem | null>(null);
const purchasePopupVisible = ref(false);
const pendingJoinQuantity = ref(1);

const orderTeamId = ref<string | undefined>(undefined);

const moduleStatus = ref<TeamModuleStatus>(TeamModuleStatus.NoQualification);

const loading = ref(false);

/**
 * 格式化通知文本列表
 */
const noticeTextList = computed(() => {
  if (!teamChestInfo.value?.participants?.length) {
    return ["暂无最新战队打卡动态"];
  }
  return teamChestInfo.value.participants.map((participant) => {
    return `${participant.userName} 参与${participant.quantity}次战队宝箱`;
  });
});

/**
 * 组装战队奖品列表数据
 */
const teamPrizeList = computed(() => {
  if (teamChestInfo.value) {
    return composeTeamPrizeList(teamChestInfo.value, teamChestPrizeList.value);
  }
  return [];
});

/**
 * 计算宝箱进度百分比
 */
const progressPercent = computed(() => {
  if (!teamChestInfo.value || teamChestInfo.value.totalOpenTimes <= 0) {
    return 0;
  }
  const rawValue = (teamChestInfo.value.currentParticipationCount / teamChestInfo.value.totalOpenTimes) * 100;
  return Math.max(0, Math.min(rawValue, 100));
});

/**
 * 加载开通战队所需的坐骑配置
 */
const loadMountConfig = async () => {
  const response = await getTeamMountConfig();
  teamMountConfig.value = resolveApiResult(response);
};

/**
 * 加载战队宝箱详情
 * @param searchId 可选的特定战队ID
 */
const loadTeamChestDetail = async (searchId?: string) => {
  const teamId = searchId ? searchId : teamInfo.value?.teamId;
  if (!teamId) {
    teamChestInfo.value = null;
    return;
  }
  try {
    const response = await getTeamChestDetail(String(teamId));
    teamChestInfo.value = resolveApiResult(response);
    if (teamChestInfo.value?.status) {
      searchId && (currentTab.value = TeamTab.OTHER);
      moduleStatus.value = TeamModuleStatus.Initiated;
    }else {
      moduleStatus.value = TeamModuleStatus.Opened;
    }
  } catch (error) {
    teamChestInfo.value = null;
    console.error("Failed to load team chest detail:", error);
  }
};

/**
 * 处理战队搜索
 * @param teamId 搜索的战队ID
 */
const handleSearch = async (teamId: string) => {
     orderTeamId.value = teamId;
    await init();
};

/**
 * 初始化组件数据
 */
const init = async () => {
  if (loading.value) {
    return;
  }
  loading.value = true;
  try {
    // 有id 战队 获取战队详情判断我的还是其他 切换重新init合适的数据给TeamTaskSection
    // 无id 战队 默认我的 切换重新init合适的数据给TeamTaskSection
    teamInfo.value = await loadTeamInfo(orderTeamId.value || undefined);
    if (!teamInfo.value?.hasTeam){
      orderTeamId.value = undefined;
      currentTab.value = TeamTab.MY;
      teamInfo.value = await loadTeamInfo(undefined);
    }
    if (!teamInfo.value?.hasTeam) {
      moduleStatus.value = TeamModuleStatus.NoQualification;
      await loadMountConfig();
      teamChestInfo.value = null;
      teamChestPrizeList.value = [];
      return;
    }
    await loadTeamChestDetail(orderTeamId.value);
    await loadTeamChestPrizeList();
  } catch (error) {
    const message = error instanceof Error ? error.message : "加载战队信息失败";
    showToast(message);
  } finally {
    loading.value = false;
  }
};

/**
 * 坐骑购买/战队开通成功回调
 */
const handleMountSuccess = async () => {
  mountPopupVisible.value = false;
  await init();
};

/**
 * 战队重命名成功回调
 */
const handleRenameSuccess = async () => {
  renamePopupVisible.value = false;
  await init();
};

/**
 * 发起战队活动成功回调
 */
const handleInitiateSuccess = async () => {
  initiatePopupVisible.value = false;
  await init();
};


/**
 * 处理购买装扮参与活动的点击动作
 * @param dressUpItemId 装扮项ID
 */
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

/**
 * 加载战队宝箱奖品配置列表
 */
const loadTeamChestPrizeList = async () => {
  if (moduleStatus.value === TeamModuleStatus.NoQualification) {
    teamChestPrizeList.value = [];
    return;
  }
  const response = await getTeamChestPrizeList();
  teamChestPrizeList.value = resolveApiResult(response);
};

/**
 * 关闭购买/参与弹窗并重置待选数量
 */
const handleClosePurchasePopup = () => {
  purchasePopupVisible.value = false;
  pendingJoinQuantity.value = 1;
};

// 初始化加载
onMounted(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const teamId = urlParams.get("teamId");
    orderTeamId.value = teamId || undefined;
    init();
});

// 监听标签切换
watch(currentTab, async (newTab) => {
  if (newTab === TeamTab.MY) {
    // 切换到我的战队，清除搜索 ID 并重新初始化
    orderTeamId.value = undefined;
    await init();
  } else if (newTab === TeamTab.OTHER && !orderTeamId.value) {
    // 切换到其他战队但还没有搜索 ID 时，展示空状态
    teamChestInfo.value = null;
  }
});

</script>

<style lang="less" scoped>
@import "./index.less";
</style>
