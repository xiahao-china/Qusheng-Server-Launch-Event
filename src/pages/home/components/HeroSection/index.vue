<template>
  <section class="hero-section">
    <button class="hero-back-btn" type="button" @click="handleClosePage">
      <img :src="heroAssets.backButton" alt="返回" />
    </button>
    <div class="hero-mode-group">
      <button
        v-for="item in displayOptions"
        :key="item.mode"
        class="hero-mode-btn"
        :class="{ 'is-active': item.mode === props.currentMode }"
        type="button"
        @click="handleModeChange(item.mode)"
      >
        <img class="hero-mode-btn-bg" :src="item.mode === props.currentMode ? heroAssets.mainBtnActive : heroAssets.mainBtnNormal" :alt="item.label" />
        <div class="hero-mode-btn-text">{{ item.label }}</div>
      </button>
    </div>
    <img class="hero-top-bg" :src="heroAssets.topBackground" alt="活动头图" />

  </section>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { heroAssets, heroModeOptions, HeroMode } from "./const";
import { closeWebView } from "@/util/bridge";

const props = defineProps<{
  currentMode: HeroMode;
}>();

const emit = defineEmits<{
  (event: "mode-change", mode: HeroMode): void;
}>();

const displayOptions = computed(() => {
  // 全服模式 (百万打卡)
  if (props.currentMode === HeroMode.MILLION_CHECKIN) {
    return heroModeOptions.filter((item) => item.mode !== HeroMode.TEAM_CHARGE);
  }
  // 战队冲锋模式
  if (props.currentMode === HeroMode.TEAM_CHARGE) {
    return heroModeOptions.filter((item) => item.mode !== HeroMode.MILLION_CHECKIN);
  }
  // 兜底返回全部 (理论上不会触发)
  return heroModeOptions;
});

const handleClosePage = () => {
  closeWebView();
};

const handleModeChange = (mode: HeroMode) => {
  emit("mode-change", mode);
};

</script>

<style lang="less" scoped>
@import "./index.less";
</style>
