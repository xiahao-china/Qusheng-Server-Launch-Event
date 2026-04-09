<template>
  <section class="million-rank">
    <div class="million-rank-bg-shell">
      <img class="million-rank-bg" :src="millionCheckinAssets.panelBackground" alt="排行背景" />
    </div>
    <div class="million-rank-content">
      <div class="million-rank-title-wrap">
        <h3 class="million-rank-title">幸运用户</h3>
      </div>
      <div class="million-lucky-header">
        <span>用户名称</span>
        <span>贡献值</span>
        <span>幸运奖品</span>
      </div>
      <div class="million-lucky-content">
        <article v-for="item in luckyList" :key="item.id" class="million-lucky-row">
          <span>{{ item.userName }}</span>
          <span>{{ item.value }}</span>
          <van-notice-bar
            class="prize-name"
            scrollable
            :text="item.prize"
            background="transparent"
            :delay="0"
            :speed="30"
          />
        </article>
      </div>

      <p v-if="!luckyList.length" class="million-rank-empty">暂无幸运用户数据</p>
    </div>
    <div class="million-rank-bg-shell bottom">
      <img class="million-rank-bg" :src="millionCheckinAssets.panelBackground" alt="排行背景" />
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { millionCheckinAssets } from "../MillionCheckinModule/const";
import { getChestWinnerList } from "@/api/chest/global";

export interface ILuckyDisplayItem {
  id: number;
  userName: string;
  value: number | string;
  prize: string;
}

const props = defineProps<{
  chestType: number;
  teamId?: string;
}>();

const luckyList = ref<ILuckyDisplayItem[]>([]);

const fetchLuckyList = async () => {
  try {
    const res = await getChestWinnerList({
      chestType: props.chestType,
      teamId: props.teamId,
      page: 1,
      size: 20
    });
    if (res.code === 200 && res.data && res.data.list) {
      const list: ILuckyDisplayItem[] = [];
      let idCounter = 1;
      res.data.list.forEach((winner) => {
        if (winner.firstPrizeUserId) {
          list.push({
            id: idCounter++,
            userName: winner.firstPrizeUserName || winner.firstPrizeUserId,
            value: "-",
            prize: winner.firstPrizeName,
          });
        }
        if (winner.secondPrizeUserId) {
          list.push({
            id: idCounter++,
            userName: winner.secondPrizeUserName || winner.secondPrizeUserId,
            value: "-",
            prize: winner.secondPrizeName,
          });
        }
        if (winner.thirdPrizeUserId) {
          list.push({
            id: idCounter++,
            userName: winner.thirdPrizeUserName || winner.thirdPrizeUserId,
            value: "-",
            prize: winner.thirdPrizeName,
          });
        }
      });
      luckyList.value = list;
    }
  } catch (error) {
    console.error("获取幸运用户失败", error);
  }
};

onMounted(() => {
  fetchLuckyList();
});

watch(() => [props.chestType, props.teamId], () => {
  fetchLuckyList();
});
</script>

<style lang="less" scoped>
@import "./index.less";
</style>
