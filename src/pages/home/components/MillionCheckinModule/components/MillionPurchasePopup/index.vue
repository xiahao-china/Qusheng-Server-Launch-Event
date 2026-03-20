<template>
  <div class="million-purchase-popup-mask">
    <section class="million-purchase-popup-panel" :class="{'million-purchase-popup-panel-success-status': props.success}">
      <div class="million-purchase-popup-bg-shell">
        <img class="million-purchase-popup-bg" :src="millionCheckinAssets.modalBackground" alt="弹窗背景" />
      </div>
      <div class="million-purchase-popup-content" >
        <div class="million-purchase-popup-title-wrap">
          <img class="million-purchase-popup-title-bg" :src="millionCheckinAssets.titleBackground" alt="标题背景" />
          <h3 class="million-purchase-popup-title">{{ popupTitle }}</h3>
        </div>

        <p v-if="props.success" class="million-purchase-popup-success-text">恭喜您！您购买的头像框<br/>已经发放到您的个性装扮中！</p>

        <img class="million-purchase-popup-image" :src="props.dressUpImage" :alt="props.dressUpName" />
        <div class="million-reward-platform">
          <img :src="millionCheckinAssets.prizePlatform" alt="奖品平台">
          <p class="million-reward-name">{{ props.dressUpName }}</p>
        </div>

        <template v-if="!props.success">

          <div class="million-purchase-popup-quantity-row">
            <button class="million-purchase-popup-step-btn" type="button" @click="handleMinus">-</button>
            <span class="million-purchase-popup-quantity">{{ localQuantity }}个</span>
            <button class="million-purchase-popup-step-btn" type="button" @click="handlePlus">+</button>
          </div>
          <p class="million-purchase-popup-price">
            <img :src="millionCheckinAssets.diamond" alt="钻石" />
            <span>{{ totalPrice }}</span>
          </p>
          <p class="million-purchase-popup-balance">我的余额：<img :src="millionCheckinAssets.diamond" alt="钻石" />0 充值</p>
          <div class="million-purchase-popup-action-row">
            <button class="million-purchase-popup-btn" type="button" :disabled="props.submitting" @click="emit('close')">
              <img :src="millionCheckinAssets.cancelButton" alt="取消" />
              <div class="text">取消</div>
            </button>
            <button class="million-purchase-popup-btn" type="button" :disabled="props.submitting" @click="emit('confirm', localQuantity)">
              <img :src="millionCheckinAssets.confirmButton" alt="确定" />
              <div class="text">确定</div>
            </button>
          </div>
        </template>

        <button v-if="props.success" class="million-purchase-popup-btn million-purchase-popup-ok-btn" type="button" @click="emit('close')">
          <img :src="millionCheckinAssets.confirmButton" alt="我知道啦" />
          <div class="text">确定</div>
        </button>
      </div>
      <div class="million-purchase-popup-bg-shell bottom">
        <img class="million-purchase-popup-bg" :src="millionCheckinAssets.modalBackground" alt="弹窗背景" />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { millionCheckinAssets } from "../../const";

const props = defineProps<{
  dressUpName: string;
  dressUpImage: string;
  quantity: number;
  successQuantity: number;
  singleParticipationAmount: number;
  submitting: boolean;
  success: boolean;
}>();

const emit = defineEmits<{
  (event: "close"): void;
  (event: "confirm", quantity: number): void;
}>();

const localQuantity = ref(1);

watch(
  () => props.quantity,
  (value) => {
    localQuantity.value = Math.max(1, value);
  },
  { immediate: true }
);

const popupTitle = computed(() => {
  return props.success ? "恭喜你" : "获得头像框";
});

const totalPrice = computed(() => {
  return Math.max(1, localQuantity.value) * props.singleParticipationAmount;
});

const handleMinus = () => {
  localQuantity.value = Math.max(1, localQuantity.value - 1);
};

const handlePlus = () => {
  localQuantity.value += 1;
};

import "./index.less";
</script>
