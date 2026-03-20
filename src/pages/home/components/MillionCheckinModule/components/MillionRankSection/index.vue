<template>
  <section class="million-rank">
    <img class="million-rank-bg" :src="millionCheckinAssets.panelBackground" alt="排行背景" />
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
      <div class="million-rank-title-wrap million-rank-title-wrap-second">
        <img class="million-rank-title-bg" :src="millionCheckinAssets.titleBackground" alt="标题背景" />
        <h3 class="million-rank-title">参与排行榜</h3>
      </div>
      <div class="million-board-header">
        <span>排名</span>
        <span>个人名称</span>
        <span>贡献值</span>
        <span>成员</span>
      </div>
      <article v-for="item in props.rankList" :key="item.id" class="million-board-row">
        <span class="million-board-rank">{{ item.id }}</span>
        <span class="million-board-name">{{ item.name }}</span>
        <span class="million-board-value">{{ item.value }}</span>
        <span class="million-board-members">
          <img v-for="(avatar, index) in item.avatars" :key="`${item.id}-${index}`" :src="avatar" alt="成员头像" />
        </span>
      </article>
      <p v-if="!props.rankList.length" class="million-rank-empty">暂无排行数据</p>
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

interface IMillionRankDisplayItem {
  id: number;
  name: string;
  value: number;
  avatars: string[];
}

const props = defineProps<{
  luckyList: IMillionLuckyDisplayItem[];
  rankList: IMillionRankDisplayItem[];
}>();

import "./index.less";
</script>
