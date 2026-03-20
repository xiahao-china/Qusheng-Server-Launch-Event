<template>
  <div class="activity-popup-mask">
    <section class="activity-popup-panel">
      <div class="activity-popup-content">
        <div class="activity-popup-title-wrap">
          <h3 class="activity-popup-title">参与记录</h3>
        </div>
        <div class="record-popup-header">
          <span>时间</span>
          <span>购买装扮</span>
          <span>活动类型</span>
          <span>参与状态</span>
        </div>
        <div class="activity-popup-scroll">
          <article v-for="item in props.recordList" :key="item.id" class="record-popup-row">
            <span>{{ item.time }}</span>
            <span>{{ item.dressUpName }}</span>
            <span>{{ item.activityType }}</span>
            <span :class="{'highlight': item.status !== '未中奖'}">{{ item.status }}</span>
          </article>
          <p v-if="!props.recordList.length" class="record-popup-empty">暂无参与记录</p>
        </div>
        <button class="activity-popup-confirm" type="button" @click="emitClose">
          <img :src="activityPopupAssets.confirmButton" alt="关闭" />
          <div class="text">关闭</div>
        </button>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { activityPopupAssets } from "./const";

export interface IRecordDisplayItem {
  id: number;
  time: string;
  dressUpName: string;
  activityType: string;
  status: string;
}

const props = defineProps<{
  recordList: IRecordDisplayItem[];
}>();

const emit = defineEmits<{
  (event: "close"): void;
}>();

const emitClose = () => {
  emit("close");
};

import "./index.less";
</script>