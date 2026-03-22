<template>
  <section class="million-notice">
    <img class="million-notice-bg" :src="progressBarBackground" alt="通告背景" />
    <div class="million-notice-content">
      <van-swipe
        v-if="noticeTextList && noticeTextList.length > 0"
        class="notice-swipe"
        vertical
        :autoplay="3000"
        :show-indicators="false"
      >
        <van-swipe-item v-for="(text, index) in noticeTextList" :key="index">
          <div class="notice-swipe-item">
            <p class="million-notice-text">{{ text }}</p>
          </div>
        </van-swipe-item>
      </van-swipe>
    </div>
  </section>
</template>

<script setup lang="ts">
import progressBarBackground from "@/assets/scrollbar-background.png";

const props = defineProps<{
  noticeTextList: string[];
}>();

</script>

<style lang="less" scoped>
@import "./index.less";
</style>
