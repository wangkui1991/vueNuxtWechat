<template lang="pug">
.container
  .focusHouse-media
    img(v-if='house.cname' :src="imageCDN + house.cname + '.jpg?imageView2/1/w/750/h/460/format/jpg/q/90|imageslim'")
    .focusHouse-text
      .words {{ house.words }}
      .name {{ house.name }}

  .focusHouse-body
    .focusHouse-item-title {{ house.cname }}
    .focusHouse-item-body(v-for='(item, index) in house.intro' :key='index') {{item}}

    .focusHouse-item-title 主要角色
    .focusHouse-item-body(v-for='(item, index) in house.swornMembers' :key='index')
      .swornMembers
        img(v-if='item.character.profile.includes("http")' :src="item.character.profile")
        img(v-else :src="imageCDN + item.character.profile + '?imageView2/1/w/280/h/440/format/jpg/q/75|imageslim' ")
        .swornMembers-body
          .name {{ item.character.cname }}
          .introduction {{ item.text }}

    .focusHouse-item-section(v-for='(item, index) in house.sections' :key='index')
      .focusHouse-item-title {{ item.title }}
      .focusHouse-item-body(v-for='text in item.content') {{ text }}
</template>

<script>
import { mapState } from 'vuex'

export default {
  // middleware: 'wechat-auth',
  transition: {
    name: 'slide-left'
  },
  head () {
    return {
      title: '家族详情'
    }
  },
  computed: {
    ...mapState({
      house: state => state.vuessr.focusHouse,
      imageCDN: state => state.vuessr.imageCDN
    })
  },
  beforeCreate () {
    let id = this.$route.query.id

    this.$store.dispatch('vuessr/focusHouse', id)
  }
}
</script>

<style scoped lang="sass" src='../../static/sass/house.sass'></style>
