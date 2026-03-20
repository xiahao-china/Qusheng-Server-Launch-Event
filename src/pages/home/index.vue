<script setup lang="ts">
import HeroSection from "./components/HeroSection/index.vue";
import PrizeSection from "./components/PrizeSection/index.vue";
import RankSection from "./components/RankSection/index.vue";
import TeamInviteSection from "./components/TeamInviteSection/index.vue";
import TeamSummarySection from "./components/TeamSummarySection/index.vue";
import { homeTheme } from "./const";
import "./index.less";
</script>

<template>
  <div
    class="home-page"
    :style="{
      '--home-bg-start': homeTheme.bgStart,
      '--home-bg-end': homeTheme.bgEnd,
    }"
  >
    <main class="home-main">
      <HeroSection />
      <PrizeSection />
      <TeamSummarySection />
      <TeamInviteSection />
      <RankSection />
    </main>
  </div>
</template>
