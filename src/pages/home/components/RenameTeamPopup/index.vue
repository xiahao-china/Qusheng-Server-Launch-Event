<template>
  <div class="activity-popup-mask">
    <section class="activity-popup-panel rename-popup-panel">
      <div class="activity-popup-content">
        <div class="activity-popup-title-wrap">
          <h3 class="activity-popup-title rename-title">我的战队名称</h3>
        </div>
        
        <div class="rename-input-wrap">
          <input 
            type="text" 
            class="rename-input" 
            v-model="localName" 
            placeholder="请输入战队名称" 
            maxlength="20"
          />
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
import { ref, watch } from "vue";
import { showToast } from "vant";
import { renameTeam } from "@/api/chest/team";
import { millionCheckinAssets } from "../MillionCheckinModule/const";

const props = defineProps<{
  initialName: string;
}>();

const emit = defineEmits<{
  (event: "close"): void;
  (event: "success"): void;
}>();

const localName = ref(props.initialName);
const operating = ref(false);

watch(() => props.initialName, (newVal) => {
  localName.value = newVal;
});

const emitClose = () => {
  if (operating.value) return;
  emit("close");
};

const emitConfirm = async () => {
  const trimmedName = localName.value.trim();
  if (!trimmedName) {
    showToast("请输入战队名称");
    return;
  }
  if (trimmedName.length > 20) {
    showToast("战队名称不能超过20个字符");
    return;
  }
  if (operating.value) return;
  operating.value = true;
  try {
    const response = await renameTeam({ teamName: trimmedName });
    if (response.code !== 200) {
      throw new Error(response.msg || "修改战队名称失败");
    }
    showToast("战队名称修改成功");
    emit("success");
  } catch (error) {
    const message = error instanceof Error ? error.message : "修改战队名称失败";
    showToast(message);
  } finally {
    operating.value = false;
  }
};
</script>

<style lang="less" scoped>
@import "./index.less";
</style>
