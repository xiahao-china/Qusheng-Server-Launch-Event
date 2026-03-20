<template>
  <section class="team-summary">
    <button class="arrow-btn" type="button">
      <img :src="summaryAssets.back" alt="上一队伍" />
    </button>
    <p class="team-summary-text">
      {{ summaryText.title }}
      <span class="team-summary-highlight">{{ summaryText.count }}</span>
      {{ summaryText.unit }}
    </p>
    <button class="arrow-btn arrow-btn-right" type="button">
      <img :src="summaryAssets.back" alt="下一队伍" />
    </button>
  </section>
</template>

<script setup lang="ts">
import { summaryAssets, summaryText } from "./const";
import "./index.less";
</script>