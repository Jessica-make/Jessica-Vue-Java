<template>
  <div
    :class="{ 'has-logo': showLogo }"
    :style="{
      backgroundColor:
        settings.sideTheme === 'theme-dark'
          ? variables.menuBackground
          : variables.menuLightBackground,
    }"
  >
    <logo v-if="showLogo" :collapse="isCollapse" />
  </div>
</template>


<script>
import { mapState, mapGetters } from "vuex";
import Logo from "./Logo.vue";
import variables from "@/assets/styles/variables.scss";

export default {
  name: "SideBar",
  components: { Logo },
  computed: {
    ...mapState(["settings"]), //初始值
    ...mapGetters(["sidebarRouters", "sidebar"]), //产生修改的值
    showLogo() {
      return this.$store.state.settings.sidebarLogo;
    },
    variables() {
      return variables;
    },
    isCollapse() {
      return !this.sidebar.opened;
    },
  },
  methods: {},
};
</script>