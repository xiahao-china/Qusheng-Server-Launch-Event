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
      <TeamChargeModule v-if="currentMode === HeroMode.TEAM_CHARGE" @mode-change="handleModeChange" @show-rule="handleShowRule" />
      <MillionCheckinModule v-else-if="currentMode === HeroMode.MILLION_CHECKIN" @mode-change="handleModeChange" @show-rule="handleShowRule" />
    </main>
    <RulePopup v-if="visiblePopup === HeroMode.RULE_DESCRIPTION" :rule-type="currentRuleType" @close="closePopup" />
    <RecordPopup v-if="visiblePopup === 'show-records'" @close="closePopup" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import RulePopup from "./components/RulePopup/index.vue";
import RecordPopup from "./components/RecordPopup/index.vue";
import HeroSection from "./components/HeroSection/index.vue";
import MillionCheckinModule from "./components/MillionCheckinModule/index.vue";
import TeamChargeModule from "./components/TeamChargeModule/index.vue";
import { HeroMode } from "./components/HeroSection/const";
import { homeTheme } from "./const";

const currentMode = ref<HeroMode>(HeroMode.MILLION_CHECKIN);
const visiblePopup = ref<HeroMode.RULE_DESCRIPTION | "show-records" | null>(null);
const currentRuleType = ref<HeroMode | "default">("default");

onMounted(() => {
  const urlParams = new URLSearchParams(window.location.search);
  const teamId = urlParams.get("teamId");
  if (teamId) {
    currentMode.value = HeroMode.TEAM_CHARGE;
  } else {
    currentMode.value = HeroMode.MILLION_CHECKIN;
  }
});

const handleModeChange = (mode: string) => {
  if (mode === HeroMode.RULE_DESCRIPTION) {
    currentRuleType.value = "default";
    visiblePopup.value = mode;
    return;
  }
  // @ts-ignore
  if (mode === "show-records") {
    visiblePopup.value = "show-records";
    return;
  }
  currentMode.value = mode as HeroMode;
};

const handleShowRule = (type: string) => {
  currentRuleType.value = type as HeroMode;
  visiblePopup.value = HeroMode.RULE_DESCRIPTION;
};

const closePopup = () => {
  visiblePopup.value = null;
};

</script>

<style lang="less" scoped>
@import "./index.less";
</style>
