<template>
  <section class="million-rank">
    <div class="million-rank-bg-shell">
      <img class="million-rank-bg" :src="millionCheckinAssets.panelBackground" alt="排行背景" />
    </div>
    <div class="million-rank-content">
      <div class="million-rank-title-wrap">
        <img class="million-rank-title-bg" :src="millionCheckinAssets.titleBackground" alt="标题背景" />
        <h3 class="million-rank-title">幸运用户</h3>
      </div>
      <div class="million-lucky-header">
        <span>用户名称</span>
        <span>贡献值</span>
        <span>幸运奖品</span>
      </div>
      <article v-for="item in props.luckyList" :key="item.id" class="million-lucky-row">
        <span>{{ item.userName }}</span>
        <span>{{ item.value }}</span>
        <span>{{ item.prize }}</span>
      </article>
      <p v-if="!props.luckyList.length" class="million-rank-empty">暂无幸运用户数据</p>
    </div>
    <div class="million-rank-bg-shell bottom">
      <img class="million-rank-bg" :src="millionCheckinAssets.panelBackground" alt="排行背景" />
    </div>
  </section>
</template>

<script setup lang="ts">
import { millionCheckinAssets } from "../../const";

interface IMillionLuckyDisplayItem {
  id: number;
  userName: string;
  value: number;
  prize: string;
}

const props = defineProps<{
  luckyList: IMillionLuckyDisplayItem[];
}>();

import "./index.less";
</script>