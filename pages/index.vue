<template lang="pug">
  .container
    .houses(ref='houses')
      .houses-items(v-for='(item ,index) in houses' :key='index' @click='showHouse(item)' )
        .houses-desc
          .words {{item.words}}
          .name {{item.name}}
          .cname {{item.cname}}

    .characters
      .title 主要人物
      .characters-container
        .characters-items(v-for='(item, index) in characters' :key='index' @click='showCharacter(item)')
          img(:src='item.profile')
          .characters-desc
            .cname {{item.cname}}
            .name {{item.name}}
            .playedBy {{item.playedBy}}
           

    .cities
      .title 维斯特洛
      .cities-intro 作家阿康健身房阿娇的阿三六九等福利卡三等奖阿的后果阿考试大纲阿卡高回落速度快噶可贵阿睡了端口埃里克风急浪大看飞机啊了饭卡上
      .cities-items(v-for='(item,index) in cities' :key='index'  )
        .title {{item.title}}
        .body {{item.body}}
</template>

<script>
import { mapState } from 'vuex'
export default {
  head () {
    return {
      title: '冰火脸谱'
    }
  },
  computed: {
    ...mapState({
      'houses': state => state.vuessr.houses,
      'characters': state => state.vuessr.characters,
      'cities': state => state.vuessr.cities})
  },
  mounted () {
    console.log('houses', this.houses)
  },
  methods: {
    showHouse (item) {
      this.$router.push({
        path: '/house',
        query: {
          id: item.id
        }
      })
    },
    showCharacter (item) {
      this.$router.push({
        path: '/character',
        query: {
          id: item.id
        }
      })
    }
  },
  beforeCreate () {
    this.$store.dispatch('vuessr/fetchHouses')
    console.log(432)
    this.$store.dispatch('vuessr/fetchCharacters')
    this.$store.dispatch('vuessr/fetchCities')
  }

}
</script>
<style scoped lang='sass' src='../static/sass/index.sass'>

</style>
