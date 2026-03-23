<template>
  <div class="million-purchase-popup-mask">
    <section class="million-purchase-popup-panel" :class="{'million-purchase-popup-panel-success-status': success}">
      <div class="million-purchase-popup-bg-shell">
        <img class="million-purchase-popup-bg" :src="millionCheckinAssets.modalBackground" alt="弹窗背景" />
      </div>
      <div class="million-purchase-popup-content" >
        <div class="million-purchase-popup-title-wrap">
          <img class="million-purchase-popup-title-bg" :src="millionCheckinAssets.titleBackground" alt="标题背景" />
          <h3 class="million-purchase-popup-title">{{ popupTitle }}</h3>
        </div>

        <p v-if="success" class="million-purchase-popup-success-text">恭喜您！您购买的座驾<br/>已经发放到您的个性装扮中！</p>

        <img class="million-purchase-popup-image" :src="mountUrl" :alt="mountConfig?.mountName" />
        <div class="million-reward-platform">
          <img :src="millionCheckinAssets.prizePlatform" alt="奖品平台">
          <p class="million-reward-name">{{ mountConfig?.mountName }}</p>
        </div>

        <template v-if="!success">
          <p class="million-purchase-popup-price">
            <img :src="millionCheckinAssets.diamond" alt="钻石" />
            <span>{{ mountConfig?.price }}</span>
          </p>
          <p class="million-purchase-popup-balance" @click="handleRecharge">
            我的余额：<img :src="millionCheckinAssets.diamond" alt="钻石" /> <span>{{ balance }}</span> 充值
          </p>
          <div class="million-purchase-popup-action-row">
            <button class="million-purchase-popup-btn" type="button" :disabled="submitting" @click="emit('close')">
              <img :src="millionCheckinAssets.cancelButton" alt="取消" />
              <div class="text">取消</div>
            </button>
            <button class="million-purchase-popup-btn" :class="{ 'is-insufficient': balance < (mountConfig?.price || 0) }" type="button" :disabled="submitting" @click="handleConfirm">
              <img :src="millionCheckinAssets.confirmButton" alt="确定" />
              <div class="text">确定</div>
            </button>
          </div>
        </template>

        <button v-if="success" class="million-purchase-popup-btn million-purchase-popup-ok-btn" type="button" @click="handleSuccessClose">
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
import { computed, ref, onMounted } from "vue";
import { showToast } from "vant";
import { getTeamMountConfig, createTeam } from "@/api/chest/team";
import { getWalletAmount } from "@/api/user";
import { rechargeMoney } from "@/util/bridge";
import type { ITeamMountConfig } from "@/api/chest/types";
import { millionCheckinAssets } from "../MillionCheckinModule/const";

const emit = defineEmits<{
  (event: "close"): void;
  (event: "success"): void;
}>();

const mountConfig = ref<ITeamMountConfig | null>(null);
const submitting = ref(false);
const success = ref(false);
const balance = ref(0);

const popupTitle = computed(() => {
  return success.value ? "恭喜你" : "获得开服座驾";
});

const mountUrl = computed(() => {
  const url = mountConfig.value?.mountUrl;
  if (url && !url.startsWith("http://") && !url.startsWith("https://")) {
    return `https://${url}`;
  }
  return url;
});

const loadWalletAmount = async () => {
  try {
    const res = await getWalletAmount();
    if (res.code === 200 && res.data) {
      balance.value = (res.data.balance || 0)/100;
    }
  } catch (error) {
    console.error("Failed to load wallet amount", error);
  }
};

const handleRecharge = () => {
  rechargeMoney();
};

const loadConfig = async () => {
  try {
    const response = await getTeamMountConfig();
    if (response.code === 200) {
      mountConfig.value = response.data;
    } else {
      showToast(response.msg || "获取坐骑配置失败");
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "获取坐骑配置失败";
    showToast(message);
  }
};

const handleConfirm = async () => {
  if (submitting.value) return;
  if (balance.value < (mountConfig.value?.price || 0)) {
    showToast("余额不足");
    return;
  }
  submitting.value = true;
  try {
    const response = await createTeam();
    if (response.code === 200) {
      success.value = true;
      showToast("开通战队成功");
    } else {
      showToast(response.msg || "开通战队失败");
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "开通战队失败";
    showToast(message);
  } finally {
    submitting.value = false;
  }
};

const handleSuccessClose = () => {
  emit("success");
  emit("close");
};

onMounted(() => {
  loadConfig();
  loadWalletAmount();
});
</script>

<style lang="less" scoped>
@import "./index.less";
</style>
