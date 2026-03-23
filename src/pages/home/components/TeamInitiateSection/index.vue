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
        <img class="user-avatar" :src="userInfo.avatar" alt="头像" />
        <div class="user-name">{{ userInfo.userName }}</div>
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
import { ref, onMounted } from "vue";
import bgImg from "@/assets/prize-module-background.png";
import defaultAvatar from "@/assets/first-prize.png";
import { millionCheckinAssets } from "@/pages/home/components/MillionCheckinModule/const.ts";
import { getUserInfo } from "@/api/user";

const backgroundImage = bgImg;

const props = defineProps<{
  teamName: string;
}>();

const emit = defineEmits<{
  rename: [];
  initiate: [];
}>();

const userInfo = ref<{ avatar: string; userName: string }>({
  avatar: defaultAvatar,
  userName: "战队长",
});

onMounted(async () => {
  try {
    const res = await getUserInfo();
    if (res.code === 200 && res.data?.result) {
      userInfo.value = {
        avatar: res.data.result.avatar || defaultAvatar,
        userName: res.data.result.userName || "战队长",
      };
    }
  } catch (error) {
    console.error("获取用户信息失败", error);
  }
});

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
