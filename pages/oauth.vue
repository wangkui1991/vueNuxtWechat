<template lang='pug'>
.container
  ul
    li {{auth.city}}
    li {{auth.country}}
    li 
      img(:src='auth.headimgurl')
    li {{auth.language}}
    li {{auth.nickname}}
    li {{auth.openid}}
    li {{auth.privilege}}
    li {{auth.province}}
    li {{auth.sex}}
</template>
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
  data () {
    return {
      auth: {}
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
          this.auth = res.data.data
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
