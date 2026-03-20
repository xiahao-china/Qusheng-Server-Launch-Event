<script setup lang="ts">
import { heroAssets, heroText } from "./const";
import "./index.less";
</script>

<template>
  <section class="hero-section">
    <img class="hero-top-bg" :src="heroAssets.topBackground" alt="活动头图" />
    <div class="hero-content">
      <span class="hero-season">{{ heroText.season }}</span>
      <h1 class="hero-title">{{ heroText.title }}</h1>
      <p class="hero-sub-title">{{ heroText.subTitle }}</p>
    </div>
  </section>
</template>
