<template>
  <div class="activity-popup-mask" @click.self="emitClose">
    <div class="share-popup-container">
      <div class="share-image-wrap">
        <img :src="invitationImg" alt="邀请好友" class="share-main-img" />
        <img :src="qrcodeImg" alt="qrcode" class="qrcode-img" />
      </div>

      <div class="share-actions-wrap">
        <img class="action-item"  :src="weixinIcon" @click="handleShareWechat" alt="微信" />
        <img class="action-item"  :src="saveIcon" @click="handleSaveImage" alt="保存" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { showToast, showLoadingToast } from "vant";
import { shareImageToWechat, saveImageToLocal } from "@/util/bridge";
import { generateShareImageBase64 } from "./const";
import invitationImg from "@/assets/invitation.png";
import qrcodeImg from "@/assets/qrcode.png";
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

const handleShareWechat = async () => {
  const loading = showLoadingToast({
    message: "生成中...",
    forbidClick: true,
  });
  try {
    const base64 = await generateShareImageBase64(invitationImg, qrcodeImg);
    await shareImageToWechat(base64);
    showToast("调起微信分享成功");
  } catch (error) {
    showToast("生成分享图失败");
  } finally {
    loading.close();
  }
};

const handleSaveImage = async () => {
  const loading = showLoadingToast({
    message: "生成中...",
    forbidClick: true,
  });
  try {
    const base64 = await generateShareImageBase64(invitationImg, qrcodeImg);
    console.log('base64',base64);
    
    // 用于测试预览生成的图片
    const img = document.createElement('img');
    img.src = base64;
    img.style.position = 'fixed';
    img.style.top = '0';
    img.style.left = '0';
    img.style.width = '100%';
    img.style.zIndex = '9999';
    // 点击图片时移除，方便继续操作
    img.onclick = () => document.body.removeChild(img);
    document.body.appendChild(img);

    await saveImageToLocal(base64);
    showToast("保存图片成功");
  } catch (error) {
    showToast("保存图片失败");
  } finally {
    loading.close();
  }
};
</script>

<style lang="less" scoped>
@import "./index.less";
</style>
