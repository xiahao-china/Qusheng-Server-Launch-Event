<template>
  <section class="million-reward">
    <img class="million-reward-bg" :src="millionCheckinAssets.panelBackground" alt="奖励背景" />
    <div class="million-reward-content">
      <div class="million-reward-title-wrap">
        <img class="million-reward-title-bg" :src="millionCheckinAssets.titleBackground" alt="标题背景" />
        <h3 class="million-reward-title">参与打卡得奖励</h3>
      </div>
      <div class="million-reward-grid">
        <article v-for="item in props.rewardList" :key="item.id" class="million-reward-card">
          <img class="million-reward-image" :src="item.image" :alt="item.name" />
          <p class="million-reward-name">{{ item.name }}</p>
          <p class="million-reward-label">{{ item.label }} x{{ item.quantity }}</p>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { IMillionPrizeDisplayItem } from "../../const";
import { millionCheckinAssets } from "../../const";

const props = defineProps<{
  rewardList: IMillionPrizeDisplayItem[];
}>();

import "./index.less";
</script>
