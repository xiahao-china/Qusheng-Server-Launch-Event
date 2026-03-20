<template>
  <section class="hero-section">
    <button class="hero-back-btn" type="button" @click="handleClosePage">
      <img :src="heroAssets.backButton" alt="返回" />
    </button>
    <div class="hero-mode-group hero-mode-group-left">
      <button
        v-for="item in leftModeOptions"
        :key="item.mode"
        class="hero-mode-btn"
        :class="{ 'is-active': item.mode === props.currentMode }"
        type="button"
        @click="handleModeChange(item.mode)"
      >
        <img :src="item.image" :alt="item.alt" />
      </button>
    </div>
    <div class="hero-mode-group hero-mode-group-right">
      <button
        v-for="item in rightModeOptions"
        :key="item.mode"
        class="hero-mode-btn"
        :class="{ 'is-active': item.mode === props.currentMode }"
        type="button"
        @click="handleModeChange(item.mode)"
      >
        <img :src="item.image" :alt="item.alt" />
      </button>
    </div>
    <img class="hero-top-bg" :src="heroAssets.topBackground" alt="活动头图" />

  </section>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { heroAssets, heroModeOptions, type HeroMode } from "./const";

const props = defineProps<{
  currentMode: HeroMode;
}>();

const emit = defineEmits<{
  (event: "mode-change", mode: HeroMode): void;
}>();

const handleClosePage = () => {
  window.close();
};

const leftModeOptions = computed(() => heroModeOptions.filter((item) => item.side === "left"));
const rightModeOptions = computed(() => heroModeOptions.filter((item) => item.side === "right"));

const handleModeChange = (mode: HeroMode) => {
  emit("mode-change", mode);
};

</script>

<style lang="less" scoped>
@import "./index.less";
</style>
