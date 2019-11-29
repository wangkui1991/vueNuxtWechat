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
function getUrlParam (param) {
  const reg = new RegExp('(^|&)' + param + '=([^&]*)(&|$)')
  const result = window.location.search.substr(1).match(reg)
  return result ? decodeURIComponent(result[2]) : null
}

// import { mapState } from 'vuex'
export default {
  asyncData ({ req }) {
    return {
      name: req ? 'server' : 'client'
    }
  },
  head () {
    return {
      title: '测试'
    }
  },
  data () {
    return {
      auth: {}
    }
  },
  async beforeMount () {
    // const wx = window.wx
    const url = window.location.href
    const {data} = await this.$store.dispatch('wechat/getWechatOAuth', url)
    console.log('wangkui', data)

    if (data.success) {
      await this.$store.dispatch('wechat/setAuthUser', data.data)
      const paramsArr = getUrlParam('state').split('_')
      const visit2 = paramsArr.length === 1 ? `/${paramsArr[0]}` : `/${paramsArr[0]}?id=${paramsArr[1]}`

  // `    const visit = '/' + getUrlParam('state')`
      console.log(2, 'visit2', this.$router)
      this.$router.replace(visit2)
    } else {
      throw new Error('用户信息获取失败')
    }
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
