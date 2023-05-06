<template>

    
</template>

<script>
//正则表达式 判断是否外部请求开头 http/https /mailto /tel
import { isExternal } from "@/utils/validate";

export default {
  props: {
    to: {
      type: [String, Object],
      required: true,
    },
  },
  computed: {
    isExternal() {
      return isExternal(this.to);
    },
    type() {
      if (this.isExternal) {
        return "a";
      }
      return "router-link";
    },
  },
};
</script>

<style scoped>
</style>