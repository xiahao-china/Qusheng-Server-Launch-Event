<template>
  <div class="activity-popup-mask">
    <section class="activity-popup-panel initiate-popup-panel">
      <div class="activity-popup-bg-shell">
        <img class="activity-popup-bg" :src="millionCheckinAssets.modalBackground" alt="弹窗背景" />
      </div>
      <div class="activity-popup-content" >
        <div class="activity-popup-title-wrap">
          <img class="activity-popup-title-bg" :src="millionCheckinAssets.titleBackground" alt="标题背景" />
          <h3 class="activity-popup-title">{{ title }}</h3>
        </div>

        <div class="initiate-reward-grid">
          <article 
            v-for="item in prizeList" 
            :key="item.id" 
            class="million-reward-card"
            :class="{ 'selected': selectedPrizeId === item.id }"
            @click="selectPrize(item.id)"
          >
            <div class="million-reward-image-shell">
              <img class="million-reward-image" :src="item.image" :alt="item.name" />
            </div>
            <div class="million-reward-platform">
              <img :src="millionCheckinAssets.prizePlatform" alt="奖品平台">
              <p class="million-reward-name">{{ item.name }}</p>
            </div>
          </article>
        </div>

        <div class="rename-action-row">
          <button class="rename-action-btn" type="button" @click="emitClose">
            <img :src="millionCheckinAssets.cancelButton" alt="取消" />
            <div class="text">取消</div>
          </button>
          <button class="rename-action-btn" type="button" @click="emitConfirm">
            <img :src="millionCheckinAssets.confirmButton" alt="确定" />
            <div class="text">确定</div>
          </button>
        </div>

      </div>
      <div class="activity-popup-bg-shell bottom">
        <img class="activity-popup-bg" :src="millionCheckinAssets.modalBackground" alt="弹窗背景" />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { showToast } from "vant";
import { millionCheckinAssets, millionPrizeFallbackList } from "../MillionCheckinModule/const";

const props = defineProps<{
  title: string;
}>();

const emit = defineEmits<{
  (event: "close"): void;
  (event: "confirm", prizeId: number): void;
}>();

// using a fallback mock list for now
const prizeList = [
  {id: 1, itemId: 1, name: "HUAWEI Mate 60 RS 非凡大师", image: millionPrizeFallbackList[0].image, quantity: 1},
  {id: 2, itemId: 2, name: "HUAWEI Mate 60 RS 非凡大师", image: millionPrizeFallbackList[0].image, quantity: 1},
  {id: 3, itemId: 3, name: "HUAWEI Mate 60 RS 非凡大师", image: millionPrizeFallbackList[0].image, quantity: 1},
  {id: 4, itemId: 4, name: "HUAWEI Mate 60 RS 非凡大师", image: millionPrizeFallbackList[0].image, quantity: 1},
  {id: 5, itemId: 5, name: "HUAWEI Mate 60 RS 非凡大师", image: millionPrizeFallbackList[0].image, quantity: 1},
  {id: 6, itemId: 6, name: "HUAWEI Mate 60 RS 非凡大师", image: millionPrizeFallbackList[0].image, quantity: 1},
];

const selectedPrizeId = ref<number | null>(null);

const selectPrize = (id: number) => {
  selectedPrizeId.value = id;
};

const emitClose = () => {
  emit("close");
};

const emitConfirm = () => {
  if (selectedPrizeId.value === null) {
    showToast("请选择奖品");
    return;
  }
  emit("confirm", selectedPrizeId.value);
};
</script>

<style lang="less" scoped>
@import "./index.less";
</style>
