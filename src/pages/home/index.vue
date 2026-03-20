<template>
  <div
    class="home-page"
    :style="{
      '--home-bg-start': homeTheme.bgStart,
      '--home-bg-end': homeTheme.bgEnd,
    }"
  >
    <main class="home-main">
      <HeroSection :current-mode="currentMode" @mode-change="handleModeChange" />
      <TeamChargeModule v-if="currentMode === 'team-charge'" />
      <MillionCheckinModule v-else-if="currentMode === 'million-checkin'" />
    </main>
    <ActivityPopup v-if="visiblePopup" :popup-type="visiblePopup" @close="closePopup" />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import ActivityPopup from "./components/ActivityPopup/index.vue";
import HeroSection from "./components/HeroSection/index.vue";
import MillionCheckinModule from "./components/MillionCheckinModule/index.vue";
import TeamChargeModule from "./components/TeamChargeModule/index.vue";
import type { HeroMode } from "./components/HeroSection/const";
import type { ActivityPopupType } from "./components/ActivityPopup/const";
import { homeTheme } from "./const";

const currentMode = ref<HeroMode>("million-checkin");
const visiblePopup = ref<ActivityPopupType | null>(null);

const handleModeChange = (mode: HeroMode) => {
  if (mode === "rule-description" || mode === "all-prizes") {
    visiblePopup.value = mode;
    return;
  }
  currentMode.value = mode;
};

const closePopup = () => {
  visiblePopup.value = null;
};

import "./index.less";
</script>
