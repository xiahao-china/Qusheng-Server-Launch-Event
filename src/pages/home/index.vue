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
      <MillionCheckinModule v-else-if="currentMode === 'million-checkin'" @mode-change="handleModeChange" />
    </main>
    <RulePopup v-if="visiblePopup === 'rule-description'" @close="closePopup" />
    <AllPrizesPopup v-if="visiblePopup === 'all-prizes'" @close="closePopup" />
    <RecordPopup v-if="visiblePopup === 'show-records'" :record-list="[]" @close="closePopup" />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import RulePopup from "./components/RulePopup/index.vue";
import AllPrizesPopup from "./components/AllPrizesPopup/index.vue";
import RecordPopup from "./components/RecordPopup/index.vue";
import HeroSection from "./components/HeroSection/index.vue";
import MillionCheckinModule from "./components/MillionCheckinModule/index.vue";
import TeamChargeModule from "./components/TeamChargeModule/index.vue";
import type { HeroMode } from "./components/HeroSection/const";
import { homeTheme } from "./const";

const currentMode = ref<HeroMode>("million-checkin");
const visiblePopup = ref<"rule-description" | "all-prizes" | "show-records" | null>(null);

const handleModeChange = (mode: HeroMode) => {
  if (mode === "rule-description" || mode === "all-prizes" || mode === "show-records") {
    visiblePopup.value = mode as any;
    return;
  }
  currentMode.value = mode;
};

const closePopup = () => {
  visiblePopup.value = null;
};

import "./index.less";
</script>
