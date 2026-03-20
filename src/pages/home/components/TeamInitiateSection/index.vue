<template>
  <section class="team-initiate">
    <div class="team-initiate-bg-shell">
      <img class="team-initiate-bg" :src="backgroundImage" alt="背景" />
    </div>
    
    <div class="initiate-content">
      <div class="team-header">
        <span class="team-name" @click="handleRename">{{ props.teamName || '我的战队' }} <span class="edit-icon">✎</span></span>
      </div>
      
      <div class="user-info">
        <img class="user-avatar" :src="props.avatar || defaultAvatar" alt="头像" />
        <div class="user-name">{{ props.userName || '战队长' }}</div>
      </div>
      
      <button class="action-btn" type="button" @click="handleInitiate">
        <img :src="millionCheckinAssets.actionButton" alt="立即发起活动" />
        <div class="text">立即发起活动</div>
      </button>
    </div>
    
    <div class="team-initiate-bg-shell bottom">
      <img class="team-initiate-bg" :src="backgroundImage" alt="背景" />
    </div>
  </section>
</template>

<script setup lang="ts">
import bgImg from "@/assets/prize-module-background.png";
import defaultAvatar from "@/assets/first-prize.png"; // Fallback avatar
import { millionCheckinAssets } from "@/pages/home/components/MillionCheckinModule/const.ts";

const backgroundImage = bgImg;

const props = defineProps<{
  teamName: string;
  userName?: string;
  avatar?: string;
}>();

const emit = defineEmits<{
  rename: [];
  initiate: [];
}>();

const handleRename = () => {
  emit("rename");
};

const handleInitiate = () => {
  emit("initiate");
};
</script>

<style lang="less" scoped>
@import "./index.less";
</style>
