<template>
  <section class="rank-section">
    <img class="rank-bg" :src="rankAssets.boardBg" alt="贡献榜单" />
    <div class="rank-content">
      <div class="rank-tab-row">
        <span v-for="tab in rankTabs" :key="tab">{{ tab }}</span>
      </div>
      <div class="rank-list">
        <article
          v-for="item in props.rankList"
          :key="item.id"
          class="rank-row"
          :style="{ backgroundImage: `url(${item.id === 1 ? rankAssets.firstRowBg : rankAssets.normalRowBg})` }"
        >
          <img class="rank-icon" :src="item.rankIcon" :alt="`第${item.id}名`" />
          <span class="rank-name">{{ item.userName }}</span>
          <span class="rank-value">{{ item.contribution }}</span>
          <img class="diamond-icon" :src="rankAssets.diamond" alt="钻石" />
        </article>
        <p v-if="!props.rankList.length" class="rank-empty">暂无参与排行数据</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { IRankItem } from "./const";
import { rankAssets, rankTabs } from "./const";

const props = defineProps<{
  rankList: IRankItem[];
}>();

import "./index.less";
</script>
