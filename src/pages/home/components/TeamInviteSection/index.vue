<template>
  <section class="team-invite">
    <img class="team-invite-bg" :src="inviteAssets.background" alt="战队邀请卡片" />
    <div class="team-invite-content">
      <img class="invite-icon" :src="inviteAssets.icon" alt="战队图标" />
      <div class="invite-main">
        <h3 class="invite-title">{{ inviteText.title }}</h3>
        <p class="invite-desc">{{ inviteText.description }}</p>
      </div>
      <button class="invite-btn" type="button">{{ inviteText.button }}</button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { inviteAssets, inviteText } from "./const";
import "./index.less";
</script>