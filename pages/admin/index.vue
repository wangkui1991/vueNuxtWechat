<template lang='pug'>
.content
    h3 登录成功 {{user.email}}
</template>

<script>
import { mapState } from 'vuex'
export default {
  middleware: 'auth',
  layout: 'admin',
  head () {
    return {
      title: '后台管理系统'
    }
  },
  data () {
    return {

    }
  },
  computed: mapState({
    user: state => state.product.user
  })
}
</script>
<style lang='sass' src='../../static/sass/admin.sass'></style>
