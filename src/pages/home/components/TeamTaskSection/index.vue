<template>
  <section class="team-task-section">
    <div class="team-task-bg-shell">
      <img class="team-task-bg" :src="millionCheckinAssets.prizeModuleBackgroundLen" alt="背景" />
    </div>
    <div class="team-task-content">
      
      <div class="team-header-row">
        <div class="team-title-wrap">
          <span class="team-name">您发起的活动:</span>
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
<!--          <div class="contribution-label">贡献</div>-->
<!--          <div class="contribution-value">{{ props.contribution || 0 }}</div>-->
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

const props = defineProps<{
  teamName: string;
  contribution?: number | string;
  rewardList: IMillionPrizeDisplayItem[];
  dressUpList: IMillionDressUpItem[];
  progressPercent: number;
  chestStatus: number;
}>();

const emit = defineEmits<{
  (event: "show-rule", type: string): void;
  (event: "show-records"): void;
  (event: "share"): void;
  (event: "purchase", dressUpItemId: number): void;
  (event: "click-prize"): void;
}>();

const userInfo = ref<IUserInfo | null>(null);

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
