<template>
  <section class="hero-section">
    <button class="hero-back-btn" type="button" @click="handleClosePage">
      <img :src="heroAssets.backButton" alt="返回" />
    </button>
    <div class="hero-mode-group">
      <button
        v-for="item in heroModeOptions"
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
import { heroAssets, heroModeOptions, HeroMode } from "./const";
import { closeWebView } from "@/util/bridge";

const props = defineProps<{
  currentMode: HeroMode;
}>();

const emit = defineEmits<{
  (event: "mode-change", mode: HeroMode): void;
}>();

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
