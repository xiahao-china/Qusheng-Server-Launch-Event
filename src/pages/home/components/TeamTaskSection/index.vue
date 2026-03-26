<template>
  <section class="team-task-section">
    <div class="team-task-bg-shell">
      <img class="team-task-bg" :src="millionCheckinAssets.prizeModuleBackgroundLen" alt="背景" />
    </div>
    <div class="team-task-content">
      <!-- 搜索输入框 - 始终展示 -->
      <div class="search-bar-wrap" v-if="props.currentTab === TeamTab.OTHER">
        <div class="search-input-inner">
          <input
            v-model="searchTeamId"
            type="text"
            placeholder="输入发起人ID搜索战队活动"
            class="search-input"
            @keyup.enter="handleSearch"
          />
          <div class="search-icon-shell" @click="handleSearch">
            <svg class="search-icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
              <path d="M426.666667 85.333333c188.512 0 341.333333 152.821333 341.333333 341.333334 0 76.533333-25.130667 147.2-67.584 204.288l211.2 211.2c16.661333 16.661333 16.661333 43.648 0 60.314666a42.666667 42.666667 0 0 1-60.330667 0l-211.2-211.2c-57.088 42.453333-127.754667 67.584-204.288 67.584-188.512 0-341.333333-152.821333-341.333334-341.333333 0-188.512 152.821333-341.333333 341.333334-341.333334z m0 85.333334c-141.28 0-256 114.72-256 256s114.72 256 256 256 256-114.72 256-256-114.72-256-256-256z" fill="#fff" />
            </svg>
          </div>
        </div>
      </div>



      <!-- 完整活动内容区域 (仅在有 orderTeamId 时展示) -->
      <template v-if="props.orderTeamId || props.currentTab === TeamTab.MY">
        <div class="team-header-row">
          <div class="team-title-wrap">
            <span class="team-name">{{ props.currentTab === TeamTab.MY ? '您发起的活动:' : `${props.teamName}战队的活动:` }}</span>
          </div>
          <div class="header-links">
            <span class="link-item" @click="emit('show-rule', 'team-charge')">活动规则</span>
            <span class="link-item" @click="emit('show-records')">我的记录</span>
          </div>
        </div>

        <div class="team-info-reward-row">
          <div class="user-info">
            <img class="user-avatar" :src="userInfo?.avatar || defaultAvatar" alt="头像" />
            <div class="user-name">{{ userInfo?.userName || '战队长' }}</div>
          </div>

          <div class="reward-grid">
            <div v-for="item in props.rewardList" :key="item.id" class="million-reward-card" @click="emit('click-prize')">
              <div class="million-reward-image-shell">
                <img class="million-reward-image" :src="item.image" :alt="item.name" />
              </div>
              <div class="million-reward-platform">
                <img :src="millionCheckinAssets.prizePlatform" alt="奖品平台">
                <p class="million-reward-name">{{ item.name }}</p>
              </div>
              <p class="million-reward-label">{{ item.label }}</p>
            </div>
          </div>
        </div>

        <button class="share-btn" type="button" @click="emit('share')">
          <img :src="millionCheckinAssets.actionButton" alt="立即分享" />
          <div class="text">立即分享好友参与</div>
        </button>

        <p class="team-task-desc">
          购买开服限定头像框到广场页面发布动态打卡即有机会领取奖励
        </p>

        <div class="million-task-grid">
          <div
            v-for="item in props.dressUpList"
            :key="item.id"
            class="million-task-card"
          >
            <img class="million-task-image" :src="item.image" :alt="item.name" />
            <p class="million-task-name">{{ item.name }}</p>
            <button class="million-task-buy" type="button" @click="emit('purchase', item.itemId)">
              <img :src="millionCheckinAssets.confirmButton" alt="购买" />
              <div class="text">购买</div>
            </button>
          </div>
        </div>

        <div class="million-task-progress">
          <img class="million-task-progress-bg" :src="millionCheckinAssets.progressBarBackground" alt="进度条" />
          <div class="million-task-progress-fill" :style="{ width: `${props.progressPercent}%` }" />
        </div>
        
        <div class="million-task-step-row">
          <div class="step-item" v-for="step in steps" :key="step">
            <img class="step-icon" :src="millionCheckinAssets.camera" alt="camera" />
            <span>{{ step }}</span>
          </div>
        </div>
      </template>

      <!-- 搜索中间态展示 (没有 orderTeamId 时展示结果行或空状态) -->
      <template v-else>
        <!-- 搜索结果行 (图2) -->
        <div  class="search-result-container">
          <div class="result-header">
            <span class="label">战队名称</span>
            <span class="label">发起人</span>
          </div>
          <div class="result-row" v-if="searchResult">
            <div class="team-info-box">
              <span class="team-name-val">{{ searchResult.teamName || '未知战队' }}</span>
              <span class="owner-name-val">{{ searchResult.ownerUserId || '未知用户' }}</span>
            </div>
            <button class="join-btn" @click="handleJoin">立即参与</button>
          </div>
          <div v-else class="search-empty-state">
            <p class="empty-text">您搜索的战队暂无活动</p>
            <div class="back-link" @click="handleBackToSearch">返回战队搜索</div>
          </div>
        </div>
      </template>

    </div>
    <div class="team-task-bg-shell bottom">
      <img class="team-task-bg" :src="millionCheckinAssets.prizeModuleBackgroundLen" alt="背景" />
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import type { IMillionPrizeDisplayItem } from "../MillionCheckinModule/const";
import type { IMillionDressUpItem } from "../MillionCheckinModule/components/MillionTaskSection/const";
import { millionCheckinAssets } from "../MillionCheckinModule/const";
import defaultAvatar from "@/assets/first-prize.png";
import { getUserInfo } from "@/api/user";
import type { IUserInfo } from "@/api/user";
import { TeamTab, loadTeamInfo } from "../TeamChargeModule/const";
import { getTeamChestDetailByUserId} from "@/api/chest/teamChest";
import type { ITeamQualificationInfo } from "@/api/chest/types";

const props = defineProps<{
  teamName: string;
  contribution?: number | string;
  rewardList: IMillionPrizeDisplayItem[];
  dressUpList: IMillionDressUpItem[];
  progressPercent: number;
  chestStatus: number;
  currentTab: TeamTab;
  orderTeamId?: string;
}>();

const emit = defineEmits<{
  (event: "show-rule", type: string): void;
  (event: "show-records"): void;
  (event: "share"): void;
  (event: "purchase", dressUpItemId: number): void;
  (event: "click-prize"): void;
  (event: "search", teamId: string): void;
}>();

const userInfo = ref<IUserInfo | null>(null);
const searchTeamId = ref(props.orderTeamId || "");
const searchResult = ref<ITeamQualificationInfo | null>(null);

const handleSearch = async () => {
   const teamId = searchTeamId.value;
   if (!teamId) return;
   
   emit("search", ""); // 触发搜索前通知父组件清空 orderTeamId
   
   try {
    // 首先检查战队宝箱活动是否存在
    const res = await getTeamChestDetailByUserId(teamId);
    if (res.code === 200 && res.data) {
      // 如果存在活动，再获取战队基本信息（名称、发起人等）
      const teamInfo = await loadTeamInfo(res.data.teamId);
      searchResult.value = teamInfo;
    } else {
      searchResult.value = null;
    }
  } catch (error) {
    console.error("Search failed:", error);
    searchResult.value = null;
  }
};

const handleJoin = () => {
  emit("search", searchResult.value?.teamId || "");
};

const handleBackToSearch = () => {
  searchTeamId.value = "";
  searchResult.value = null;
  emit("search", "");
};

onMounted(async () => {
  try {
    const res = await getUserInfo();
    if (res.code === 200) {
      userInfo.value = res.data.result;
    }
  } catch (error) {
    console.error("Failed to get user info:", error);
  }
});

const steps = ["25%", "50%", "75%", "100%"];

</script>

<style lang="less" scoped>
@import "./index.less";
</style>
