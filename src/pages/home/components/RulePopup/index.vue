<template>
  <div class="activity-popup-mask">
    <section class="activity-popup-panel">
      <button class="activity-popup-close" type="button" @click="emitClose">×</button>
      <div class="activity-popup-content">
        <div class="activity-popup-scroll">
          <div class="activity-popup-title-wrap">
            <h3 class="activity-popup-title">活动规则</h3>
          </div>
          <p class="activity-popup-subtitle">{{ currentSubtitle }}</p>
          <section v-for="item in currentRuleSections" :key="item.title" class="activity-popup-block">
            <h4 class="activity-popup-block-title">{{ item.title }}</h4>
            <p v-for="line in item.content" :key="line" class="activity-popup-line">{{ line }}</p>
          </section>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { activityRuleSections, millionCheckinRuleSections, teamChargeRuleSections } from "./const";
import { HeroMode } from "../HeroSection/const";

const props = defineProps<{
  ruleType?: HeroMode | "default";
}>();

const emit = defineEmits<{
  (event: "close"): void;
}>();

const currentSubtitle = computed(() => {
  if (props.ruleType === HeroMode.MILLION_CHECKIN) {
    return "百万打卡·全服狂欢";
  }
  if (props.ruleType === HeroMode.TEAM_CHARGE) {
    return "战队自定义·奖品由你定";
  }
  return "为保障消费者的合法权益，确保平台活动公开、公平、公正，趣声平台（以下简称“本平台”）依据《中华人民共和国反不正当竞争法》《中华人民共和国消费者权益保护法》《规范促销行为暂行规定》等相关法律法规，特就本次开服活动作出如下合规声明：";
});

const currentRuleSections = computed(() => {
  if (props.ruleType === HeroMode.MILLION_CHECKIN) {
    return millionCheckinRuleSections;
  }
  if (props.ruleType === HeroMode.TEAM_CHARGE) {
    return teamChargeRuleSections;
  }
  return activityRuleSections;
});

const emitClose = () => {
  emit("close");
};

</script>

<style lang="less" scoped>
@import "./index.less";
</style>
