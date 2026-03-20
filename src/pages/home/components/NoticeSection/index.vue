<template>
  <section class="million-notice">
    <img class="million-notice-bg" :src="progressBarBackground" alt="通告背景" />
    <div class="million-notice-content">
      <span class="million-notice-arrow">▶</span>
      <p class="million-notice-text">{{ currentText }}</p>
      <span class="million-notice-arrow">◀</span>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import progressBarBackground from "@/assets/scrollbar-background.png";

const props = defineProps<{
  noticeTextList: string[];
}>();

const currentIndex = ref(0);
let timer: ReturnType<typeof setInterval> | null = null;

const currentText = computed(() => {
  if (!props.noticeTextList || props.noticeTextList.length === 0) {
    return "";
  }
  return props.noticeTextList[currentIndex.value] || "";
});

const startCarousel = () => {
  stopCarousel();
  if (props.noticeTextList && props.noticeTextList.length > 1) {
    timer = setInterval(() => {
      currentIndex.value = (currentIndex.value + 1) % props.noticeTextList.length;
    }, 3000);
  }
};

const stopCarousel = () => {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
};

watch(
  () => props.noticeTextList,
  () => {
    currentIndex.value = 0;
    startCarousel();
  },
  { deep: true, immediate: true }
);

onMounted(() => {
  startCarousel();
});

onUnmounted(() => {
  stopCarousel();
});

</script>

<style lang="less" scoped>
@import "./index.less";
</style>
