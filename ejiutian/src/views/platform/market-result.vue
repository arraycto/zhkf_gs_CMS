<template>
    <div class="result">
        <div class="header">
            <span>智能交互中心</span>
        </div>
        <div class="info" v-show="type == 1">
            <div class='info-img'></div>
            <div class="fail">
                <div style="margin-top:7px">
                    <span class="result-word">{{errorTitle}}</span>
                </div>
                <div style="margin-top: 20px;font-size:12px">
                    <p>1.本活动仅针对未订购过智能交互平台的政企客户或已完成企业认证的互联网用户，活动期间仅可试用一次</p>
                    <p>2.您不是政企客户或未完成企业认证，暂时无法参加免费试用</p>
                    <p>3.如需订购，请完成企业认证参加免费试用活动，或选择“立即订购”按钮正式订购该产品</p>
                </div>
                <jt-button type="primary" class="bt-class" style="margin-top: 20px;"  @click="goHome">返回首页</jt-button>
            </div>
        </div>
        <div class="info" v-show="type == 0">
            <div class='info-img'></div>
            <div class="fail">
                <div style="margin-top:7px">
                    <span class="result-word">{{errorTitle}}</span>
                </div>
                <jt-button type="primary" class="bt-class" style="margin-top: 64px;"  @click="goHome">返回首页</jt-button>
            </div>
        </div>
    </div>
</template>
<script>
import {mapActions } from "vuex";
import { ECLOUD_PREFIX } from "@/utils/cloud.http";
export default {
    name: 'OrderResult',
    data() {
        return {
            type: 0,
            errorMsg: "",
            errorTitle: '',
            orderStatus: ''
        }
    },
    methods: {
        ...mapActions({
            queryUser: 'platform/queryUser'
        }),
        goHome() {
            window.location.href = ECLOUD_PREFIX + 'home/product-introduction/interactive'
        }
    },
    mounted() {
        this.type = this.$route.query.type
        this.errorTitle = this.$route.query.errorTitle
    }
}
</script>
<style lang="less" scoped>
@import "~@/assets/style/var.less";

.ant-alert-success {
    background-color: #fff;
    border: 0px;
    svg{
        width: 48px;
        height: 48px;
    }
}

.ant-alert-error {
    background-color: #fff;
    border: 0px;
    svg{
        width: 48px;
        height: 48px;
    }
}

.ant-alert-icon {
    top: 0px;
    left: 0px;
}

.result {
    position: absolute;
    bottom: 0px;
    left: 0;
    right: 0;
    top: 0;
    background: #eff1f4;
    overflow: auto;
    height: 100%;
}

.header {
    height: 60px;
    line-height: 60px;
    background: @jt-color-white;
    font-size: 16px;
    font-weight: 400;
    color: rgba(3,17,41,1);
    padding-left: 19px;
}

.info {
    display: flex;
    background: #fff;
    margin: 15px 10px 0;
    min-height: calc(100% - 60px );
    align-items: center;
}
.info-img {
    width: 400px;
    height: 400px;
    background: url('~@/assets/image/market.png') no-repeat right;
    flex: 1;
}
.fail, .success {
    text-align:left;
    flex: 1;
    margin-left: 50px;
}

.icon-pos {
    margin-top: 90px;
    display: inline-block
}
.icon-size {
   
    width: 48px;
    height: 48px;
    padding: 0px;
}

.result-word {
    width:80px;
    height:28px;
    font-size:20px;
    font-weight:400;
    color:rgba(3,17,41,1);
    line-height:28px;
}

.result-tips {
    width:266px;
    height:20px;
    font-size:14px;
    font-weight:400;
    color:rgba(153,153,153,1);
    line-height:20px;
    white-space: pre;
}

.bt-class {
    height:32px;
    border-radius:2px;
    width: auto;
}

</style>