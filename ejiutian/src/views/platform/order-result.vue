<template>
    <div class="result">
        <div class="header">
            <span>智能交互中心</span>
        </div>
        <div class="info">
            <div class="fail" v-show="result==3">
                <div class="icon-pos">
                    <jt-alert type="error" class="icon-size" showIcon/>
                </div>
                <div style="margin-top:7px">
                    <span class="result-word">订购失败</span>
                </div>
                <div style="margin-top:20px">
                    <span class="result-tips">失败原因：{{errorMsg}}</span>
                </div>
                <jt-button type="primary" class="bt-class"   @click="goPlatform">管理控制台</jt-button>
            </div>
            <div class="fail" v-show="result==2">
                <div class="icon-pos">
                    <jt-icon type="clock-circle" theme="filled" style="color:#337DFF;font-size:50px"/>
                </div>
                <div style="margin-top:7px">
                    <span class="result-word">订单审批中</span>
                </div>
                <div style="margin-top:20px">
                    <span class="result-tips">{{errorMsg}}</span>
                </div>
                <jt-button type="primary" class="bt-class"   @click="goHome">返回首页</jt-button>
            </div>
            <div class="fail" v-show="result==1">
                <div class="icon-pos">
                    <jt-alert type="error" class="icon-size" showIcon/>
                </div>
                <div style="margin-top:7px">
                    <span class="result-word">订购失败</span>
                </div>
                <div style="margin-top:20px">
                    <span class="result-tips">失败原因：{{errorMsg}}</span>
                </div>
                <jt-button type="primary" class="bt-class"   @click="reOrder">重新订购</jt-button>
            </div>
            <div class="success" v-show="result==0">
                <div class="icon-pos">
                    <jt-alert type="success" class="icon-size" showIcon/>
                </div>
                <div style="margin-top:7px">
                    <span class="result-word">订购成功</span>
                </div>
                <div style="margin-top:20px">
                    <span class="result-tips">{{errorMsg}}</span>
                </div>
                <jt-button @click="goPlatform" class='bt-class' style="margin-right:10px">管理控制台</jt-button>
                <jt-button type="primary" class="bt-class" @click="viewOrder">查看订单</jt-button>
            </div>
        </div>
    </div>
</template>
<script>
import {Alert} from "ant-design-vue";
import {mapActions } from "vuex";
import { ECLOUD_PREFIX,ZNJHCONSOLE } from "@/utils/cloud.http";
export default {
    name: 'OrderResult',
    components:{
        "jt-alert": Alert,
    },
    data() {
        return {
            result: 0,
            errorMsg: "您已订购成功，进入控制台创建属于你自己的机器人吧",
            orderStatus: ''
        }
    },
    methods: {
        ...mapActions({
            queryUser: 'platform/queryUser'
        }),
        goHome() {
            window.location.href = ECLOUD_PREFIX + 'home/product-introduction/interactive'
        },
        reOrder() {
            this.$router.go(-1);
        },
        goPlatform() {
            window.open(ZNJHCONSOLE);  
        },
        viewOrder() {
            window.open(ECLOUD_PREFIX + 'usercenter/orders/list','_blank');  
        },
        //获取审批中订单状态是否审批通过
        queryUserVuex() {
            this.queryUser().then((res)=>{
                this.orderStatus = res.body.status
                if(this.orderStatus == 10) {
                    this.$route.query.type = 0
                    this.result = 0
                    this.errorMsg = '您已订购成功，进入控制台创建属于你自己的机器人吧'
                }
            })
        }
    },
    mounted() {
        this.result = this.$route.query.type
        if (this.result == 0) {
            this.errorMsg = '您已订购成功，进入控制台创建属于你自己的机器人吧'
        } else if(this.result == 1) {
            this.errorMsg = this.$route.query.errorMessage
        } else if(this.result == 2){
            this.errorMsg = `您的订单正在审批中，审批通过后可直接进入控制台\n\t审批时间较长，您可稍后查看审批状态`
            setTimeout(function()  {
                this.queryUserVuex()
            }, 3000);
        }else if(this.result == 3) {
            this.errorMsg = this.$route.query.errorMessage
        }
    }
}
</script>
<style lang="less">
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
    min-height:400px;
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
    position: absolute;
    top: 80px;
    left: 20px;
    right: 20px;
    bottom: 20px;
    background:rgba(255,255,255,1);
    border-radius:2px;
}

.fail, .success {
    text-align:center
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
    margin-top: 20px;
    width: auto;
}

</style>