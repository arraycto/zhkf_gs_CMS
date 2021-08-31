<template>
    <jt-empty :image="questionSearchNoneImage" :imageStyle="{margin: 'auto',width: '400px',height: '400px'}">
        <div class="emptyContent" slot="description">
            <p class="emptyTitle">{{emptyTitle}}</p>
            <p>{{emptySubTitle}}</p>
        </div>
        <jt-button type="primary" @click="toLink()" style="width:auto">
            {{emptyBtnName}}
        </jt-button>
    </jt-empty>
</template>
<script>
import { ECLOUD_PREFIX } from "@/utils/cloud.http";
export default {
    data(){
        return{}
    },
    methods: {
        toLink() {
            if(this.emptyBtnName == '返回首页') {
                window.open(ECLOUD_PREFIX + 'home/product-introduction/interactive')
            }else {
                //前往认证
                window.open(ECLOUD_PREFIX + 'usercenter/users/certificate','_blank');
            }
        }
    },
    props:['possibleOrder','questionSearchNoneImage','emptyBtnName','emptySubTitle','emptyTitle']
}
</script>
<style scoped lang="less">
.emptyContent {
    font-size: 14px;
    font-family: 'PingFangSC-Regular,PingFang SC';
    font-weight: 400;
    color: #555555;
    text-align: center;
    margin-top: -125px;
    a {
        color: #337DFF;
    }
    .emptyTitle {
        font-size: 18px;
        font-family: 'PingFangSC-Semibold,PingFang SC';
        font-weight: 600;
        color: #333333;
        text-align: center;
        margin-bottom: 16px;
    }
}
/deep/ .ant-empty-image {
    margin-top: 93px!important;
}
/deep/ .ant-empty-image img {
    width: 100%!important;
    height: auto;
}
</style>