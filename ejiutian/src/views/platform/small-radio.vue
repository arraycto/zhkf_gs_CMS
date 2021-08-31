<template>
    <li class="square" :class="idx==selIdx? 'sq2' : 'sq1'">
        {{infoStr}}
    </li>
</template>

<style lang="less" scoped>
@import "~@/assets/style/var.less";

.square {
    width: 120px;
    height: 32px;
    line-height: 32px;
    display: inline-block;
    margin: 0px;
    text-align: center;
    font-size: @jt-font-size-sm;
}

.sq1 {
    background: rgba(245, 245, 245, 1);
    border: 1px solid rgba(217, 217, 217, 1);
}

.sq2 {
    background: rgba(234, 242, 255, 1);
    border: 1px solid rgba(153, 190, 255, 1);
    color: #337dff;
}

</style>

<script>
export default {
    name: 'SmallRadio',
    props:['infoStr', "idx", "selIdx"],
    data: function () {
        return {
            bShow: (this.idx==this.selIdx)
        }
    },
    methods:{
        showSel: function() {
            return (this.idx==this.selIdx)
        }
    }
}
</script>