<template>
  <section class="team-summary">
    <button class="arrow-btn" :disabled="!props.canPrev" type="button" @click="emit('prev')">
      <img :src="summaryAssets.back" alt="上一队伍" />
    </button>
    <p class="team-summary-text">
      {{ props.title }}
      <span class="team-summary-highlight">{{ props.count }}</span>
      {{ props.unit }}
    </p>
    <button class="arrow-btn arrow-btn-right" :disabled="!props.canNext" type="button" @click="emit('next')">
      <img :src="summaryAssets.back" alt="下一队伍" />
    </button>
  </section>
</template>

<script setup lang="ts">
import { summaryAssets } from "./const";

const props = defineProps<{
  title: string;
  count: number | string;
  unit: string;
  canPrev: boolean;
  canNext: boolean;
}>();

const emit = defineEmits<{
  prev: [];
  next: [];
}>();

import "./index.less";
</script>
