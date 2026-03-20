<template>
  <section class="million-task">
    <img class="million-task-bg" :src="millionCheckinAssets.panelBackground" alt="打卡背景" />
    <div class="million-task-content">
      <p class="million-task-desc">
        单次打卡金额 {{ props.singleParticipationAmount }}，当前进度
        {{ props.currentParticipationCount }}/{{ props.totalOpenTimes }}
      </p>
      <div class="million-task-grid">
        <article
          v-for="item in props.dressUpList"
          :key="item.id"
          class="million-task-card"
          :class="{ 'is-active': item.itemId === props.selectedDressUpItemId }"
        >
          <img class="million-task-image" :src="item.image" :alt="item.name" />
          <p class="million-task-name">{{ item.name }}</p>
          <button class="million-task-buy" type="button" @click="emit('select-dress-up', item.itemId)">
            {{ item.itemId === props.selectedDressUpItemId ? "已选择" : "选择" }}
          </button>
        </article>
      </div>
      <div class="million-task-quantity-row">
        <button class="million-task-quantity-btn" type="button" @click="handleMinus">-</button>
        <span class="million-task-quantity-value">{{ quantity }}</span>
        <button class="million-task-quantity-btn" type="button" @click="handlePlus">+</button>
      </div>
      <div class="million-task-progress">
        <img class="million-task-progress-bg" :src="millionCheckinAssets.progressBarBackground" alt="进度条" />
        <div class="million-task-progress-fill" :style="{ width: `${props.progressPercent}%` }" />
      </div>
      <div class="million-task-step-row">
        <span v-for="step in steps" :key="step">{{ step }}</span>
      </div>
      <div class="million-task-action-row">
        <button class="million-task-rule" type="button" @click="emit('show-rule')">活动规则</button>
        <button class="million-task-action" type="button" :disabled="props.isJoining || props.chestStatus !== 1" @click="emit('join', quantity)">
          <img :src="millionCheckinAssets.actionButton" alt="立即打卡" />
        </button>
        <button class="million-task-record" type="button" @click="emit('show-records')">我的记录</button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { IMillionDressUpItem } from "../../const";
import { millionCheckinAssets } from "../../const";

const props = defineProps<{
  dressUpList: IMillionDressUpItem[];
  selectedDressUpItemId: number;
  progressPercent: number;
  isJoining: boolean;
  chestStatus: number;
  currentParticipationCount: number;
  totalOpenTimes: number;
  singleParticipationAmount: number;
}>();

const emit = defineEmits<{
  (event: "select-dress-up", dressUpItemId: number): void;
  (event: "join", quantity: number): void;
  (event: "show-rule"): void;
  (event: "show-records"): void;
}>();

const quantity = ref(1);

const handleMinus = () => {
  quantity.value = Math.max(1, quantity.value - 1);
};

const handlePlus = () => {
  quantity.value += 1;
};

const steps = ["25%", "50%", "75%", "100%"];

import "./index.less";
</script>
