<template>
  <section class="prize-section">
    <div class="prize-platform">
      <img class="prize-platform-bg" :src="prizeAssets.platform" alt="奖池展示" />
      <div class="prize-grid">
        <article v-for="item in props.prizeList" :key="item.id" class="prize-card">
          <span class="prize-badge">{{ item.badge }}</span>
          <img class="prize-image" :src="item.image" :alt="item.name" />
          <p class="prize-name">{{ item.name }}</p>
        </article>
      </div>
    </div>
    <div class="action-row">
      <button
        v-for="text in props.actionButtons"
        :key="text"
        class="action-btn"
        type="button"
        @click="handleAction(text)"
      >
        {{ text }}
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { IPrizeItem } from "./const";
import { prizeAssets } from "./const";

const props = defineProps<{
  prizeList: IPrizeItem[];
  actionButtons: string[];
}>();

const emit = defineEmits<{
  action: [action: string];
}>();

const handleAction = (action: string) => {
  emit("action", action);
};

import "./index.less";
</script>
