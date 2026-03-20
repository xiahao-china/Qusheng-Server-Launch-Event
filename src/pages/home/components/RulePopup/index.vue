<template>
  <div class="activity-popup-mask">
    <section class="activity-popup-panel">
      <button class="activity-popup-close" type="button" @click="emitClose">×</button>
      <div class="activity-popup-content">
        <div class="activity-popup-title-wrap">
          <h3 class="activity-popup-title">活动规则</h3>
        </div>
        <div class="activity-popup-scroll">
          <section v-for="item in activityRuleSections" :key="item.title" class="activity-popup-block">
            <h4 class="activity-popup-block-title">{{ item.title }}</h4>
            <p v-for="line in item.content" :key="line" class="activity-popup-line">{{ line }}</p>
          </section>
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
import { activityPopupAssets, activityRuleSections } from "./const";

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
