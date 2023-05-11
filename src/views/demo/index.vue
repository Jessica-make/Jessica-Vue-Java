<template>
  <div>
    <el-button type="primary" size="default" @click="hasOneShowingChild()"
      >test</el-button
    >
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {
    hasOneShowingChild(children = [], parent) {
      if (!children) {
        children = [];
      }
      
    },

  },
};
</script>