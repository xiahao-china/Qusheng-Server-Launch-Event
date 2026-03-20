<template>
  <div class="activity-popup-mask">
    <section class="activity-popup-panel">
      <button class="activity-popup-close" type="button" @click="emitClose">×</button>
      <div class="activity-popup-content">
        <div class="activity-popup-title-wrap">
          <h3 class="activity-popup-title">{{ popupTitle }}</h3>
        </div>
        <div class="activity-popup-scroll">
          <template v-if="props.popupType === 'rule-description'">
            <section v-for="item in activityRuleSections" :key="item.title" class="activity-popup-block">
              <h4 class="activity-popup-block-title">{{ item.title }}</h4>
              <p v-for="line in item.content" :key="line" class="activity-popup-line">{{ line }}</p>
            </section>
          </template>
          <template v-else>
            <section class="activity-popup-block">
              <article v-for="item in allPrizeList" :key="item.id" class="activity-prize-row">
                <img class="activity-prize-image" :src="item.image" :alt="item.name" />
                <div class="activity-prize-text">
                  <span class="activity-prize-badge">{{ item.badge }}</span>
                  <span class="activity-prize-name">{{ item.name }}</span>
                </div>
              </article>
            </section>
          </template>
        </div>
        <button class="activity-popup-confirm" type="button" @click="emitClose">
          <img :src="activityPopupAssets.confirmButton" alt="我知道了" />
          <div class="text">我要参加</div>
        </button>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { activityPopupAssets, activityRuleSections, allPrizeList, type ActivityPopupType } from "./const";

const props = defineProps<{
  popupType: ActivityPopupType;
}>();

const emit = defineEmits<{
  (event: "close"): void;
}>();

const popupTitle = computed(() => {
  return props.popupType === "rule-description" ? "活动规则" : "全部奖品";
});

const emitClose = () => {
  emit("close");
};

import "./index.less";
</script>
