<template>
  <section class="million-reward">
    <div class="million-reward-bg-shell">
      <img class="million-reward-bg" :src="millionCheckinAssets.panelBackground" alt="奖励背景" />
    </div>
    <div class="million-reward-content">
      <div class="million-reward-title-wrap">
        <h3 class="million-reward-title">参与打卡得奖励</h3>
      </div>
      <div class="million-reward-grid">
        <article v-for="item in props.rewardList" :key="item.id" class="million-reward-card">
          <div class="million-reward-image-shell">
            <img class="million-reward-image" :src="item.image" :alt="item.name" />
          </div>
          <div class="million-reward-platform">
            <img :src="millionCheckinAssets.prizePlatform" alt="奖品平台">
            <p class="million-reward-name">{{ item.name }}</p>
          </div>
          <p class="million-reward-label">{{ item.label }} x{{ item.quantity }}</p>
        </article>
      </div>
    </div>
    <div class="million-reward-bg-shell bottom">
      <img class="million-reward-bg" :src="millionCheckinAssets.panelBackground" alt="奖励背景" />
    </div>
  </section>
</template>

<script setup lang="ts">
import type { IMillionPrizeDisplayItem } from "../../const";
import { millionCheckinAssets } from "../../const";

const props = defineProps<{
  rewardList: IMillionPrizeDisplayItem[];
}>();

</script>

<style lang="less" scoped>
@import "./index.less";
</style>
