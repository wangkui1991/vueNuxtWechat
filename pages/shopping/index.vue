<template lang='pug'>
.container
    .shopping
        .shopping-title 权游周边
        .shopping-list
            .shopping-item(v-for='(item,index) in products' :key='index' @click='focusProduct(item)')
                img(:src="imageCDN+item.images[0]")
                .shopping-item-body
                    .title {{item.title}}
                    .content {{item.intro}}

</template>
<script>
import { mapState } from 'vuex'

export default {
  middleware: 'wechat-auth',
  head () {
    return {
      title: '周边手办'
    }
  },
  computed: {
    ...mapState({
      imageCDN: state => state.vuessr.imageCDN,
      products: state => state.product.products
    })
  },
  methods: {
    focusProduct (item) {
      this.$router.push({path: '/deal', query: {id: item._id}})
    }
  },

  beforeCreate () {
    console.log('this.store', this.$store)
    this.$store.dispatch('product/fetchProducts')
  },
  mounted () {
    setTimeout(() => {
      this.$el.scrollTop = this.shoppingScroll
    }, 50)
  },
  beforeDestroy () {
    console.log('this.store', this.$store)
    this.$store.commit('product/SET_SHOPPING_SCROLL', this.$el.scrollTop)
  }

}
</script>
<style lang="sass" src='../../static/sass/shopping.sass'></style>
