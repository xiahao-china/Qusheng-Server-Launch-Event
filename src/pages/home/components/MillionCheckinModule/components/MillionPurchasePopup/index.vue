<template>
  <div class="million-purchase-popup-mask">
    <section class="million-purchase-popup-panel" :class="{'million-purchase-popup-panel-success-status': isSuccess}">
      <div class="million-purchase-popup-bg-shell">
        <img class="million-purchase-popup-bg" :src="millionCheckinAssets.modalBackground" alt="弹窗背景" />
      </div>
      <div class="million-purchase-popup-content" >
        <div class="million-purchase-popup-title-wrap">
          <img class="million-purchase-popup-title-bg" :src="millionCheckinAssets.titleBackground" alt="标题背景" />
          <h3 class="million-purchase-popup-title">{{ popupTitle }}</h3>
        </div>

        <p v-if="isSuccess" class="million-purchase-popup-success-text">恭喜您！您购买的头像框<br/>已经发放到您的个性装扮中！</p>

        <img class="million-purchase-popup-image" :src="props.dressUpImage" :alt="props.dressUpName" />
        <div class="million-reward-platform">
          <img :src="millionCheckinAssets.prizePlatform" alt="奖品平台">
          <p class="million-reward-name">{{ props.dressUpName }}</p>
        </div>

        <template v-if="!isSuccess">

          <div class="million-purchase-popup-quantity-row">
            <button class="million-purchase-popup-step-btn" type="button" :disabled="localQuantity <= 1" @click="handleMinus">-</button>
            <span class="million-purchase-popup-quantity">{{ localQuantity }}个</span>
            <button class="million-purchase-popup-step-btn" type="button" :disabled="localQuantity >= 99" @click="handlePlus">+</button>
          </div>
          <p class="million-purchase-popup-price">
            <img :src="millionCheckinAssets.diamond" alt="钻石" />
            <span>{{ totalPrice }}</span>
          </p>
          <p class="million-purchase-popup-balance" @click="handleRecharge">我的余额：<img :src="millionCheckinAssets.diamond" alt="钻石" />{{ balance }} 充值</p>
          <div class="million-purchase-popup-action-row">
            <button class="million-purchase-popup-btn" type="button" :disabled="submitting" @click="emit('close')">
              <img :src="millionCheckinAssets.cancelButton" alt="取消" />
              <div class="text">取消</div>
            </button>
            <button class="million-purchase-popup-btn" type="button" :disabled="submitting" @click="handleConfirm">
              <img :src="millionCheckinAssets.confirmButton" alt="确定" />
              <div class="text">确定</div>
            </button>
          </div>
        </template>

        <button v-if="isSuccess" class="million-purchase-popup-btn million-purchase-popup-ok-btn" type="button" @click="handleSuccessClose">
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
import { computed, onMounted, ref, watch } from "vue";
import { showToast } from "vant";
import { joinGlobalChest } from "@/api/chest/global";
import { getWalletAmount } from "@/api/user";
import { rechargeMoney } from "@/util/bridge";
import { millionCheckinAssets } from "../../const";

const props = defineProps<{
  dressUpItemId: number;
  dressUpName: string;
  dressUpImage: string;
  quantity: number;
  singleParticipationAmount: number;
}>();

const emit = defineEmits<{
  (event: "close"): void;
  (event: "success"): void;
}>();

const localQuantity = ref(1);
const submitting = ref(false);
const isSuccess = ref(false);
const balance = ref(0);

const loadWalletAmount = async () => {
  try {
    const res = await getWalletAmount();
    if (res.code === 200 && res.data) {
      balance.value = res.data.balance || 0;
    }
  } catch (error) {
    console.error("Failed to load wallet amount", error);
  }
};

onMounted(() => {
  loadWalletAmount();
});

watch(
  () => props.quantity,
  (value) => {
    localQuantity.value = Math.max(1, value);
  },
  { immediate: true }
);

const popupTitle = computed(() => {
  return isSuccess.value ? "恭喜你" : "获得头像框";
});

const totalPrice = computed(() => {
  return Math.max(1, localQuantity.value) * props.singleParticipationAmount;
});

const handleMinus = () => {
  if (localQuantity.value > 1) {
    localQuantity.value -= 1;
  }
};

const handlePlus = () => {
  if (localQuantity.value < 99) {
    localQuantity.value += 1;
  }
};

const handleRecharge = () => {
  rechargeMoney();
};

const resolveApiResult = <T>(response: { code: number; msg: string; data: T }) => {
  if (response.code !== 200) {
    throw new Error(response.msg || "请求失败");
  }
  return response.data;
};

const handleConfirm = async () => {
  if (localQuantity.value < 1) {
    showToast("参与数量至少为1");
    return;
  }
  submitting.value = true;
  try {
    const response = await joinGlobalChest({
      dressUpItemId: props.dressUpItemId,
      quantity: localQuantity.value,
    });
    resolveApiResult(response);
    isSuccess.value = true;
    showToast("购买成功");
    emit("success");
  } catch (error) {
    const message = error instanceof Error ? error.message : "打卡失败";
    showToast(message);
  } finally {
    submitting.value = false;
  }
};

const handleSuccessClose = () => {
  emit('close');
};

</script>

<style lang="less" scoped>
@import "./index.less";
</style>
