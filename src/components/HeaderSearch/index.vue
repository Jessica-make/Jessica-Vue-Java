<template>
   <div :class="{'show':show}" class="header-search">
    <!-- @click.stop 阻止事件冒泡 -->
    <svg-icon class-name="search-icon" icon-class="search" @click.stop="click" />
    <el-select
      ref="headerSearchSelect"
      v-model="search"
      :remote-method="querySearch"
      filterable
      default-first-option
      remote
      placeholder="Search"
      class="header-search-select"
      @change="change"
    >
      <el-option v-for="option in options" :key="option.item.path" :value="option.item" :label="option.item.title.join(' > ')" />
    </el-select>
  </div>
</template>

<script>
// fuse is a lightweight fuzzy-search module
// make search results more in line with expectations
import Fuse from 'fuse.js/dist/fuse.min.js'
import path from 'path'

export default {
  name: 'HeaderSearch',
  data() {
    return {
      search: '',
      options: [],
      searchPool: [],
      show: false,
      fuse: undefined
    }
  },
  computed: {
    //routes 会在 mounted() 挂载时调用
    routes() {
      return this.$store.getters.permission_routes
    }
  },
  watch: {
    //这里的目的是，一旦后台的路由修改了，这边就会监听到
    //不过一般不会修改，这个方法触发的机会很少
    routes() {
      this.searchPool = this.generateRoutes(this.routes)
    },
    searchPool(list) {
      this.initFuse(list)
    },

    // show(value) 的value值就是 show:true/false 
    //这里增加这个方法，是让我们可以在放大镜之外的任何地方 加上或者关闭放大镜
    show(value) {
      if (value) {
        document.body.addEventListener('click', this.close)
      } else {
        document.body.removeEventListener('click', this.close)
      }
    }
  },
  mounted() {
    this.searchPool = this.generateRoutes(this.routes)
  },
  methods: {
    click() {
      this.show = !this.show
      if (this.show) {
        this.$refs.headerSearchSelect && this.$refs.headerSearchSelect.focus()
      }
    },
    close() {
      this.$refs.headerSearchSelect && this.$refs.headerSearchSelect.blur()
      this.options = []
      this.show = false
    },
    change(val) {
      const path = val.path;
      if(this.ishttp(val.path)) {
        // http(s):// 路径新窗口打开
        const pindex = path.indexOf("http");
        window.open(path.substr(pindex, path.length), "_blank");
      } else {
        this.$router.push(val.path)
      }
      this.search = ''
      this.options = []
      this.$nextTick(() => {
        this.show = false
      })
    },
    initFuse(list) {
      this.fuse = new Fuse(list, {
        shouldSort: true,
        threshold: 0.4,
        location: 0,
        distance: 100,
        minMatchCharLength: 1,
        keys: [{
          name: 'title',
          weight: 0.7
        }, {
          name: 'path',
          weight: 0.3
        }]
      })
    },
    // Filter out the routes that can be displayed in the sidebar
    // And generate the internationalized title
    generateRoutes(routes, basePath = '/', prefixTitle = []) {
      if(routes === undefined){
         return
      }

      let res = []

      for (const router of routes) {
        // skip hidden router
        if (router.hidden) { continue }

        const data = {
          path: !this.ishttp(router.path) ? path.resolve(basePath, router.path) : router.path,
          title: [...prefixTitle]
        }

        if (router.meta && router.meta.title) {
          data.title = [...data.title, router.meta.title]

          if (router.redirect !== 'noRedirect') {
            // only push the routes with title
            // special case: need to exclude parent router without redirect
            res.push(data)
          }
        }

        // recursive child routes
        if (router.children) {
          const tempRoutes = this.generateRoutes(router.children, data.path, data.title)
          if (tempRoutes.length >= 1) {
            res = [...res, ...tempRoutes]
          }
        }
      }
      return res
    },
    querySearch(query) {
      if (query !== '') {
        this.options = this.fuse.search(query)
      } else {
        this.options = []
      }
    },
    ishttp(url) {
      return url.indexOf('http://') !== -1 || url.indexOf('https://') !== -1
    }
  }
}
</script>

<style lang="scss" scoped>
.header-search {
  font-size: 0 !important;

  .search-icon {
    cursor: pointer;
    font-size: 18px;
    vertical-align: middle;
  }

  .header-search-select {
    font-size: 18px;
    transition: width 0.2s;
    width: 0;
    overflow: hidden;
    background: transparent;
    border-radius: 0;
    display: inline-block;
    vertical-align: middle;

    ::v-deep .el-input__inner {
      border-radius: 0;
      border: 0;
      padding-left: 0;
      padding-right: 0;
      box-shadow: none !important;
      border-bottom: 1px solid #d9d9d9;
      vertical-align: middle;
    }
  }

  &.show {
    .header-search-select {
      width: 210px;
      margin-left: 10px;
    }
  }
}
</style>