<template>
  <section class="prize-section">
    <div class="prize-platform">
      <img class="prize-platform-bg" :src="prizeAssets.platform" alt="奖池展示" />
      <div class="prize-grid">
        <article v-for="item in prizeList" :key="item.id" class="prize-card">
          <span class="prize-badge">{{ item.badge }}</span>
          <img class="prize-image" :src="item.image" :alt="item.name" />
          <p class="prize-name">{{ item.name }}</p>
        </article>
      </div>
    </div>
    <div class="action-row">
      <button v-for="text in actionButtons" :key="text" class="action-btn">{{ text }}</button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { actionButtons, prizeAssets, prizeList } from "./const";
import "./index.less";
</script>