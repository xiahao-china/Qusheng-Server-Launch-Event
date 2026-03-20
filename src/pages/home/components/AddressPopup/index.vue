<template>
  <div class="activity-popup-mask">
    <section class="activity-popup-panel rename-popup-panel address-popup-panel">
      <div class="activity-popup-content">
        <div class="activity-popup-title-wrap">
          <h3 class="activity-popup-title rename-title address-title">开服邀约，送百万豪礼</h3>
        </div>
        
        <p class="address-countdown">剩余{{ countdownDays }}天截止领奖</p>
        
        <div class="address-prize-wrap">
          <p class="address-prize-label">您的实物奖品</p>
          <div class="million-reward-platform address-prize-platform">
            <div class="million-reward-image-shell">
              <img class="million-reward-image" :src="prizeImage" alt="实物奖品" />
            </div>
            <img :src="millionCheckinAssets.prizePlatform" alt="奖品平台" class="platform-bg">
          </div>
        </div>

        <div class="address-form">
          <div class="form-item">
            <span class="form-label">收件人</span>
            <input 
              type="text" 
              class="rename-input form-input" 
              v-model="formData.name" 
              placeholder="" 
            />
          </div>
          <div class="form-item">
            <span class="form-label">手机号码</span>
            <input 
              type="tel" 
              class="rename-input form-input" 
              v-model="formData.phone" 
              placeholder="" 
              maxlength="11"
            />
          </div>
          <div class="form-item">
            <span class="form-label">收件地址</span>
            <input 
              type="text" 
              class="rename-input form-input" 
              v-model="formData.address" 
              placeholder="" 
            />
          </div>
        </div>

        <div class="rename-action-row">
          <button class="rename-action-btn" type="button" @click="emitClose">
            <img :src="millionCheckinAssets.cancelButton" alt="取消" />
            <div class="text">取消</div>
          </button>
          <button class="rename-action-btn" type="button" @click="emitConfirm">
            <img :src="millionCheckinAssets.confirmButton" alt="确定" />
            <div class="text">确定</div>
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { showToast } from "vant";
import { millionCheckinAssets, millionPrizeFallbackList } from "../MillionCheckinModule/const";

const props = defineProps<{
  prizeImage?: string;
  countdownDays?: number;
}>();

const emit = defineEmits<{
  (event: "close"): void;
  (event: "confirm", addressInfo: { name: string; phone: string; address: string }): void;
}>();

const prizeImage = props.prizeImage || millionPrizeFallbackList[0].image;
const countdownDays = props.countdownDays ?? 3;

const formData = reactive({
  name: "假面超人",
  phone: "",
  address: "",
});

const emitClose = () => {
  emit("close");
};

const emitConfirm = () => {
  const { name, phone, address } = formData;
  if (!name.trim()) {
    showToast("请输入收件人姓名");
    return;
  }
  if (!phone.trim() || !/^1[3-9]\d{9}$/.test(phone)) {
    showToast("请输入正确的手机号码");
    return;
  }
  if (!address.trim()) {
    showToast("请输入收件地址");
    return;
  }
  emit("confirm", { name: name.trim(), phone: phone.trim(), address: address.trim() });
};
</script>

<style lang="less" scoped>
@import "../RenameTeamPopup/index.less";

.address-popup-panel {
  .activity-popup-content {
    padding: 20px 20px 24px;
  }

  .address-title {
    font-size: 18px;
    font-weight: bold;
    color: #fff;
    margin-bottom: 8px;
    justify-content: center;
  }

  .address-countdown {
    text-align: center;
    font-size: 12px;
    color: rgba(255, 255, 255, 0.8);
    margin-bottom: 16px;
  }

  .address-prize-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 24px;

    .address-prize-label {
      font-size: 12px;
      color: rgba(255, 255, 255, 0.6);
      margin-bottom: 8px;
    }

    .address-prize-platform {
      position: relative;
      width: 100px;
      display: flex;
      flex-direction: column;
      align-items: center;

      .million-reward-image-shell {
        width: 80px;
        height: 80px;
        position: relative;
        z-index: 2;
        margin-bottom: -20px;
        
        .million-reward-image {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
      }

      .platform-bg {
        width: 100px;
        height: auto;
        position: relative;
        z-index: 1;
      }
    }
  }

  .address-form {
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-bottom: 30px;
    padding: 0 10px;

    .form-item {
      display: flex;
      align-items: center;
      gap: 12px;

      .form-label {
        width: 60px;
        font-size: 13px;
        color: rgba(255, 255, 255, 0.8);
        text-align: right;
        flex-shrink: 0;
      }

      .form-input {
        flex: 1;
        height: 36px;
        margin: 0;
        text-align: left;
        padding: 0 16px;
        font-size: 14px;
        border-radius: 18px;
        max-width: none;
      }
    }
  }

  .rename-action-row {
    margin-top: 0;
  }
}
</style>
