<template>
  <section class="team-charge-module">
    <PrizeSection />
    <TeamSummarySection />
    <TeamInviteSection />
    <RankSection />
  </section>
</template>

<script setup lang="ts">
import PrizeSection from "../PrizeSection/index.vue";
import RankSection from "../RankSection/index.vue";
import TeamInviteSection from "../TeamInviteSection/index.vue";
import TeamSummarySection from "../TeamSummarySection/index.vue";
import "./index.less";
</script>
