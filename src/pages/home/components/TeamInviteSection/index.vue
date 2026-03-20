<template>
  <section class="team-invite">
    <img class="team-invite-bg" :src="inviteAssets.background" alt="战队邀请卡片" />
    <div class="team-invite-content">
      <img class="invite-icon" :src="inviteAssets.icon" alt="战队图标" />
      <div class="invite-main">
        <h3 class="invite-title">{{ props.title }}</h3>
        <p class="invite-desc">{{ props.description }}</p>
      </div>
      <button class="invite-btn" type="button" @click="emit('action')">{{ props.buttonText }}</button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { inviteAssets } from "./const";

const props = defineProps<{
  title: string;
  description: string;
  buttonText: string;
}>();

const emit = defineEmits<{
  action: [];
}>();

import "./index.less";
</script>
