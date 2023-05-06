<template>
    <div>
      <svg-icon icon-class="github" @click="goto" />
    </div>
  </template>
  
  <script>
  export default {
    name: 'GitHub-Jessica',
    data() {
      return {
        url: 'https://github.com/Jessica-make/Jessica-Vue-Java'
      }
    },
    methods: {
      goto() {
        window.open(this.url)
      }
    }
  }
  </script>