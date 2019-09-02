<template ></template>
<script>
// import { mapState } from 'vuex'
export default {
  asyncData ({ req }) {
    return {
      name: req ? 'server' : 'client'
    }
  },
  head () {
    return {
      title: 'loading'
    }
  },
  beforeMount () {
    // const wx = window.wx
    const url = window.location.href

    this.$store
      .dispatch('wechat/getUserByOAuth', encodeURIComponent(url))
      .then(res => {
        console.log(res, res)
        if (res.data.success) {
          console.log(res.data)
        }
      })
  }
}
</script>

<style scoped>
.title {
  margin-top: 50px;
}
.info {
  font-weight: 300;
  color: #9aabb1;
  margin: 0;
  margin-top: 10px;
}
.button {
  margin-top: 50px;
}
</style>
