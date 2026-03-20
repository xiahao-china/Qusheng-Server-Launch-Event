<script setup lang="ts">
import { rankAssets, rankList, rankTabs } from "./const";
import "./index.less";
</script>

<template>
  <section class="rank-section">
    <img class="rank-bg" :src="rankAssets.boardBg" alt="贡献榜单" />
    <div class="rank-content">
      <div class="rank-tab-row">
        <span v-for="tab in rankTabs" :key="tab">{{ tab }}</span>
      </div>
      <div class="rank-list">
        <article
          v-for="item in rankList"
          :key="item.id"
          class="rank-row"
          :style="{ backgroundImage: `url(${item.id === 1 ? rankAssets.firstRowBg : rankAssets.normalRowBg})` }"
        >
          <img class="rank-icon" :src="item.rankIcon" :alt="`第${item.id}名`" />
          <span class="rank-name">{{ item.userName }}</span>
          <span class="rank-value">{{ item.contribution }}</span>
          <img class="diamond-icon" :src="rankAssets.diamond" alt="钻石" />
        </article>
      </div>
    </div>
  </section>
</template>
