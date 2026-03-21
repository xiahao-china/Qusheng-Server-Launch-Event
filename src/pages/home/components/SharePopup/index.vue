<template>
  <div class="activity-popup-mask" @click.self="emitClose">
    <div class="share-popup-container">
      <div class="share-image-wrap">
        <img :src="invitationImg" alt="邀请好友" class="share-main-img" />
      </div>

      <div class="share-actions-wrap">
        <img class="action-item"  :src="weixinIcon" @click="handleShareWechat" alt="微信" />
        <img class="action-item"  :src="saveIcon" @click="handleSaveImage" alt="保存" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { showToast } from "vant";
import invitationImg from "@/assets/invitation.png";
import weixinIcon from "@/assets/weixin-icon.png";
import saveIcon from "@/assets/save-icon.png";

const props = defineProps<{
  teamId?: string;
}>();

const emit = defineEmits<{
  (event: "close"): void;
}>();

const emitClose = () => {
  emit("close");
};

const handleCopy = async () => {
  const code = `快来帮我助力战队吧！我的战队口令是：【${props.teamId || "测试口令"}】`;
  try {
    await navigator.clipboard.writeText(code);
    showToast("复制成功");
  } catch (err) {
    showToast("复制失败，请手动复制");
  }
};

const handleShareWechat = () => {
  showToast("调起微信分享");
};

const handleSaveImage = () => {
  showToast("保存图片成功");
};
</script>

<style lang="less" scoped>
@import "./index.less";
</style>
