<template>
  <section class="container">
    <img src="../static/img/logo.png" alt="Nuxt.js Logo" class="logo" />
    <h1 class="title">
      This page is loaded from the {{ name }}
    </h1>
    <h2 class="info" v-if="name === 'client'">
      Please refresh the page
    </h2>
    <nuxt-link class="button" to="/">
      Home page
    </nuxt-link>
  </section>
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
      title: `About Page (${this.name}-side)`
    }
  },
  beforeMount () {
    const wx = window.wx
    const url = window.location.href
    console.log('this,', this.$store)
    this.$store.dispatch('wechat/getWechatSignature', url).then(res => {
      console.log(res, res)
      if (res.data.success) {
        const params = res.data.params
        wx.config({
          debug: true,
          appId: params.appId,
          timestamp: params.timestamp, // 必填，生成签名的时间戳
          nonceStr: params.noncestr, // 必填，生成签名的随机串
          signature: params.signature, // 必填，签名
          jsApiList: [
            'chooseImage',
            'previewImage',
            'uploadImage',
            'downloadImage',
            'onMenuShareTimeline',
            'hideAllNonBaseMenuItem',
            'showMenuItems'

          ] // 必填，需要使用的JS接口列表
        })
        wx.ready(() => {
          wx.hideAllNonBaseMenuItem()
          console.log('ab')
        })
      }
    })
  }
}
</script>

<style scoped>
.title
{
  margin-top: 50px;
}
.info
{
  font-weight: 300;
  color: #9aabb1;
  margin: 0;
  margin-top: 10px;
}
.button
{
  margin-top: 50px;
}
</style>
