<template>
  <section class="million-task">
    <div class="million-task-bg-shell">
      <img class="million-task-bg" :src="millionCheckinAssets.prizeModuleBackground" alt="打卡背景" />
    </div>
    <div class="million-task-content">
      <p class="million-task-desc">
        购买开服限定头像框到广场页面发布动态打卡即有机会领取全服奖励
      </p>
      <div class="million-task-grid">
        <article
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
        </article>
      </div>
      <div class="million-task-progress">
        <img class="million-task-progress-bg" :src="millionCheckinAssets.progressBarBackground" alt="进度条" />
        <div class="million-task-progress-fill" :style="{ width: `${props.progressPercent}%` }" />
      </div>
      <div class="million-task-step-row">
        <span v-for="step in steps" :key="step">{{ step }}</span>
      </div>
      <div class="million-task-action-row">
        <div class="million-task-rule" type="button" @click="emit('show-rule')">活动规则</div>
        <button class="million-task-action" type="button" :disabled="props.isJoining || props.chestStatus !== 1" @click="emit('join', quantity)">
          <img :src="millionCheckinAssets.actionButton" alt="立即打卡" />
          <div class="text">立即打卡</div>
        </button>
        <div class="million-task-record" type="button" @click="emit('show-records')">我的记录</div>
      </div>
    </div>
    <div class="million-task-bg-shell bottom">
      <img class="million-task-bg" :src="millionCheckinAssets.prizeModuleBackground" alt="打卡背景" />
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { IMillionDressUpItem } from "../../const";
import { millionCheckinAssets } from "../../const";

const props = defineProps<{
  dressUpList: IMillionDressUpItem[];
  progressPercent: number;
  isJoining: boolean;
  chestStatus: number;
  currentParticipationCount: number;
  totalOpenTimes: number;
  singleParticipationAmount: number;
}>();

const emit = defineEmits<{
  (event: "purchase", dressUpItemId: number): void;
  (event: "join", quantity: number): void;
  (event: "show-rule"): void;
  (event: "show-records"): void;
}>();

const quantity = ref(1);

const steps = ["25%", "50%", "75%", "100%"];

import "./index.less";
</script>
