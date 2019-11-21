<template lang='pug'>
aside
    ul
        li
            nuxt-link(to='/admin/product') 宝贝列表
</template>

<style lang="sass">
aside
    width: 230px
    height: calc(100vh-56px)
    overflow: scroll
    padding-top: 20px
    
    ul
        list-style: none
        padding: 0
        
        a
            display: block
            font-size: 14px
            height: 40px
            line-height: 40px
            padding-left: 40px
            color: #666
</style>
