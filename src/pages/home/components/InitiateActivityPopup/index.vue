<template>
  <div class="activity-popup-mask">
    <section class="activity-popup-panel initiate-popup-panel">
      <div class="activity-popup-bg-shell">
        <img class="activity-popup-bg" :src="millionCheckinAssets.modalBackground" alt="弹窗背景" />
      </div>
      <div class="activity-popup-content" >
        <div class="activity-popup-title-wrap">
          <img class="activity-popup-title-bg" :src="millionCheckinAssets.titleBackground" alt="标题背景" />
          <h3 class="activity-popup-title">{{ title }}</h3>
        </div>

        <div class="initiate-reward-grid">
          <article 
            v-for="item in prizeList" 
            :key="item.id" 
            class="million-reward-card"
            :class="{ 'selected': selectedPrizeId === item.id }"
            @click="selectPrize(item.id)"
          >
            <div class="million-reward-image-shell">
              <img class="million-reward-image" :src="item.imageUrl" :alt="item.name" />
            </div>
            <div class="million-reward-platform">
              <img :src="millionCheckinAssets.prizePlatform" alt="奖品平台">
              <p class="million-reward-name">{{ item.name }}</p>
            </div>
          </article>
        </div>

        <div class="million-purchase-popup-quantity-row">
          <button class="million-purchase-popup-step-btn" type="button" :disabled="quantity <= 1" @click="handleMinus">-</button>
          <span class="million-purchase-popup-quantity">{{ quantity }}个</span>
          <button class="million-purchase-popup-step-btn" type="button" :disabled="quantity >= 5" @click="handlePlus">+</button>
        </div>

        <div class="rename-action-row">
          <button class="rename-action-btn" type="button" @click="emitClose">
            <img :src="millionCheckinAssets.cancelButton" alt="取消" />
            <div class="text">取消</div>
          </button>
          <button class="rename-action-btn" type="button" @click="emitNext">
            <img :src="millionCheckinAssets.confirmButton" alt="下一步" />
            <div class="text">{{ step === 3 ? '确定' : '下一步' }}</div>
          </button>
        </div>

      </div>
      <div class="activity-popup-bg-shell bottom">
        <img class="activity-popup-bg" :src="millionCheckinAssets.modalBackground" alt="弹窗背景" />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { showToast } from "vant";
import { initTeamChest, getTeamChestPrizeList } from "@/api/chest/teamChest";
import type { IPrizeItem } from "@/api/chest/types";
import { millionCheckinAssets } from "../MillionCheckinModule/const";

const emit = defineEmits<{
  (event: "close"): void;
  (event: "success"): void;
}>();

const prizeList = ref<IPrizeItem[]>([]);
const step = ref(1);
const selectedPrizeId = ref<number | null>(null);
const quantity = ref(1);
const operating = ref(false);

const selections = ref<{ itemId: number; quantity: number }[]>([]);

const title = computed(() => {
  const stepMap: Record<number, string> = {
    1: "一",
    2: "二",
    3: "三"
  };
  return `选择您想发起的活动${stepMap[step.value]}等奖`;
});

const loadPrizeList = async () => {
  try {
    const res = await getTeamChestPrizeList();
    if (res.code === 200) {
      prizeList.value = res.data;
    }
  } catch (error) {
    showToast("获取奖品列表失败");
  }
};

onMounted(() => {
  loadPrizeList();
});

const selectPrize = (id: number) => {
  selectedPrizeId.value = id;
};

const handleMinus = () => {
  if (quantity.value > 1) {
    quantity.value -= 1;
  }
};

const handlePlus = () => {
  if (quantity.value < 5) {
    quantity.value += 1;
  }
};

const emitClose = () => {
  if (operating.value) return;
  emit("close");
};

const emitNext = async () => {
  if (selectedPrizeId.value === null) {
    showToast("请选择奖品");
    return;
  }

  const selectedPrize = prizeList.value.find(p => p.id === selectedPrizeId.value);
  if (!selectedPrize) return;

  selections.value.push({
    itemId: selectedPrize.id,
    quantity: quantity.value
  });

  if (step.value < 3) {
    step.value += 1;
    selectedPrizeId.value = null;
    quantity.value = 1;
    return;
  }

  if (operating.value) return;
  operating.value = true;
  try {
    const response = await initTeamChest({
      firstPrizeItemId: selections.value[0].itemId,
      firstPrizeQuantity: selections.value[0].quantity,
      secondPrizeItemId: selections.value[1].itemId,
      secondPrizeQuantity: selections.value[1].quantity,
      thirdPrizeItemId: selections.value[2].itemId,
      thirdPrizeQuantity: selections.value[2].quantity,
    });
    if (response.code !== 200) {
      throw new Error(response.msg || "发起战队宝箱失败");
    }
    showToast("战队宝箱发起成功");
    emit("success");
  } catch (error) {
    const message = error instanceof Error ? error.message : "发起战队宝箱失败";
    showToast(message);
  } finally {
    operating.value = false;
  }
};
</script>

<style lang="less" scoped>
@import "./index.less";
</style>
