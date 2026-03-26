<template>
  <div class="team-switch-tab">
    <div
      class="switch-item"
      :class="{ active: modelValue === TeamTab.MY }"
      :style="{ backgroundImage: `url(${modelValue === TeamTab.MY ? millionCheckinAssets.cancelButton : millionCheckinAssets.confirmButton})` }"
      @click="emit('update:modelValue', TeamTab.MY)"
    >
      <span class="item-text">我的战队</span>
    </div>
    <div
      class="switch-item"
      :class="{ active: modelValue === TeamTab.OTHER }"
      :style="{ backgroundImage: `url(${modelValue === TeamTab.OTHER ? millionCheckinAssets.cancelButton : millionCheckinAssets.confirmButton})` }"
      @click="emit('update:modelValue', TeamTab.OTHER)"
    >
      <span class="item-text">其他战队</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { millionCheckinAssets } from "../MillionCheckinModule/const";
import { TeamTab } from "../TeamChargeModule/const";

const props = defineProps<{
  modelValue: TeamTab;
}>();

const emit = defineEmits<{
  (event: "update:modelValue", value: TeamTab): void;
}>();
</script>

<style lang="less" scoped>
@import "./index.less";
</style>
