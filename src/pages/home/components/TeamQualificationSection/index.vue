<template>
  <section class="team-qualification">
    <div class="team-qualification-bg-shell">
      <img class="team-qualification-bg" :src="backgroundImage" alt="背景" />
    </div>
    <div class="qualification-content">
      <div class="status-box">
        您暂未拥有开通战队资格！
      </div>
      
      <div class="mount-requirement">
        <span class="text-prefix">拥有</span>
        <div class="mount-display">
          <div class="mount-platform-container">
            <img class="mount-image" :src="mountUrl" alt="坐骑" />
            <div class="platform">
              <img class="platform-image" :src="platformImage" alt="底座" />
              <div class="mount-name-tag">{{ mountName }}</div>
            </div>
          </div>
        </div>
        <span class="text-suffix">座驾，即可拥有战队资格！</span>
      </div>

      <button class="action-btn" type="button" @click="handleAction">
        <img :src="millionCheckinAssets.actionButton" alt="立即打卡" />
        <div class="text">立即获得战队资格</div>
      </button>
    </div>
    <div class="team-qualification-bg-shell bottom">
      <img class="team-qualification-bg" :src="backgroundImage" alt="背景" />
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { ITeamMountConfig } from "@/api/chest/types";
import fallbackImage from "@/assets/first-prize.png";
import platformImg from "@/assets/prize-platform.png";
import bgImg from "@/assets/prize-module-background.png";
import {millionCheckinAssets} from "@/pages/home/components/MillionCheckinModule/const.ts";

const platformImage = platformImg;
const backgroundImage = bgImg;

const props = defineProps<{
  mountConfig: ITeamMountConfig | null;
}>();

const emit = defineEmits<{
  action: [];
}>();

const mountUrl = computed(() => {
  const url = props.mountConfig?.mountUrl || fallbackImage;
  if (url && !url.startsWith("http://") && !url.startsWith("https://")) {
    return `https://${url}`;
  }
  return url;
});
const mountName = computed(() => props.mountConfig?.mountName || "专属坐骑");

const handleAction = () => {
  emit("action");
};
</script>

<style lang="less" scoped>
@import "./index.less";
</style>
