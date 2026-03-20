<template>
  <section class="million-notice">
    <img class="million-notice-bg" :src="millionCheckinAssets.panelBackground" alt="通告背景" />
    <div class="million-notice-content">
      <span class="million-notice-arrow">▶</span>
      <p class="million-notice-text">{{ props.noticeText }}</p>
      <span class="million-notice-arrow">◀</span>
    </div>
  </section>
</template>

<script setup lang="ts">
import { millionCheckinAssets } from "../../const";

const props = defineProps<{
  noticeText: string;
}>();

import "./index.less";
</script>
