<template>
  <div class="activity-popup-mask">
    <section class="activity-popup-panel">
      <div class="activity-popup-content">
        <div class="activity-popup-title-wrap">
          <h3 class="activity-popup-title">参与记录</h3>
        </div>
        <div class="record-popup-header">
          <span>时间</span>
          <span>购买装扮</span>
          <span>活动类型</span>
          <span>参与状态</span>
        </div>
        <div class="activity-popup-scroll">
          <div v-if="loading" class="record-popup-empty">加载中...</div>
          <template v-else>
            <article v-for="item in recordList" :key="item.id" class="record-popup-row">
              <span class="time">{{ item.time }}</span>
              <span>{{ item.dressUpName }}</span>
              <span class="highlight">{{ item.activityType }}</span>
              <span :class="{'highlight': item.status !== '未中奖'}">{{ item.status }}</span>
            </article>
            <p v-if="!recordList.length" class="record-popup-empty">暂无参与记录</p>
          </template>
        </div>
        <button class="activity-popup-confirm" type="button" @click="emitClose">
          <img :src="activityPopupAssets.confirmButton" alt="关闭" />
          <div class="text">关闭</div>
        </button>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { activityPopupAssets } from "./const";
import { getUserRecordList } from "@/api/chest/record";

export interface IRecordDisplayItem {
  id: number | string;
  time: string;
  dressUpName: string;
  activityType: string;
  status: string;
}

const emit = defineEmits<{
  (event: "close"): void;
}>();

const recordList = ref<IRecordDisplayItem[]>([]);
const loading = ref(false);

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const fetchRecordList = async () => {
  loading.value = true;
  try {
    const res = await getUserRecordList({ page: 1, size: 50 });
    if (res.code === 200 && res.data) {
      recordList.value = res.data.list.map((item, index) => ({
        id: index,
        time: formatDate(item.purchaseTime),
        dressUpName: `${item.dressUpName}*${item.quantity}`,
        activityType: item.chestType === 1 ? "百万夺宝" : "组队夺宝",
        status: item.prizeDesc || (item.prizeStatus === 0 ? "未中奖" : "已中奖")
      }));
    }
  } catch (error) {
    console.error("Failed to fetch records:", error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchRecordList();
});

const emitClose = () => {
  emit("close");
};

</script>

<style lang="less" scoped>
@import "./index.less";
</style>
