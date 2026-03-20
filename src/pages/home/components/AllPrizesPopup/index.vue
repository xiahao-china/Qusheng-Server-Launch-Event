<template>
  <div class="activity-popup-mask">
    <section class="activity-popup-panel">
      <button class="activity-popup-close" type="button" @click="emitClose">×</button>
      <div class="activity-popup-content">
        <div class="activity-popup-title-wrap">
          <h3 class="activity-popup-title">全部奖品</h3>
        </div>
        <div class="activity-popup-scroll">
          <img :src="activityPopupAssets.allPrize" alt="全部奖品" style="width: 100%; display: block;" />
        </div>
        <button class="activity-popup-confirm" type="button" @click="emitClose">
          <img :src="activityPopupAssets.confirmButton" alt="我知道了" />
          <div class="text">我要参加</div>
        </button>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { activityPopupAssets } from "./const";

const emit = defineEmits<{
  (event: "close"): void;
}>();

const emitClose = () => {
  emit("close");
};

import "./index.less";
</script>
