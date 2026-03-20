<template>
  <div class="activity-popup-mask">
    <section class="activity-popup-panel">
      <button class="activity-popup-close" type="button" @click="emitClose">×</button>
      <div class="activity-popup-content">
        <div class="activity-popup-scroll">
          <img :src="activityPopupAssets.allPrize" alt="全部奖品" style="width: 100%; display: block;" />
        </div>
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

</script>

<style lang="less" scoped>
@import "./index.less";

</style>