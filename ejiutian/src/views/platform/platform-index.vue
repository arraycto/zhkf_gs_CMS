<template>
    <div class="platform-index">
        <div class="my-serve">
            <jt-row class="row-len" :gutter="16">
                <jt-col class="bgr-font-color bgr-font-size bg-font-weight" :span="2">
                    我的服务
                </jt-col>
                <jt-col class="" :span="22" style="text-align:right">
                    <span v-if="volumPpay">
                        <jt-icon type="exclamation-circle" style="color:#FF931D"/>
                        <span class='usedUp'>当前已转至按量后付费模式</span>
                    </span>
                    <span v-if="owe">
                        <jt-icon type="exclamation-circle" style="color:#FF931D"/>
                        <span class='usedUp'>您的移动云账户已欠费，仅可使用套餐内流量包。请尽快充值</span>
                    </span>
                    <div v-if='userinfo.id && !owe'>
                        <jt-button class="bt-top" v-if='unsubscribeButton' @click="unsubscribeModal" style="margin-right:8px">退订</jt-button>
                        <!-- <jt-button class="bt-top" :class="{'change':!zero && !government}" 
                                   :type='btnType' @click="change">变更</jt-button> -->
                        <jt-button class="bt-top" type="primary" style="margin-left:8px" 
                                   v-if="renewButton" @click="renewal">续费</jt-button>
                    </div>
                    
                </jt-col>
            </jt-row>
            <div class="gray-line" style="margin-top:16px"></div>
            <jt-row class="row-len" :gutter="16">
                <jt-col  :span="4" class='envflex'> 
                    <router-link to="/home/controlPlatform/test-env-detail">
                        <img src='../../assets/image/testenv_icon.png' class="icon-attr" style="margin-top:24px"/>
                    </router-link>
                    <div class='envname'>
                        <p class="bg-font-size common-font-color" style="margin-top:50px; margin-bottom:4px" >测试环境</p>
                    </div>
                </jt-col>
                <jt-col  :span="4" :offset="1">
                    <p class="common-font-color num-font-size num-style" v-if='testEnvDetail.used_quota <= 100'>{{testEnvDetail.used_quota}}</p>
                    <p class="common-font-color num-font-size num-style" v-else>100</p>
                    <p class="small-font-size gray-font-color num-tips-style">已用次数(今日)</p>
                </jt-col>
                <jt-col :span="2" :offset="0">
                    <jt-button class="bt-top" style="margin-top:50px" @click="EnvDetailClick">使用详情</jt-button>
                </jt-col>
                <jt-col  :span="1" >
                    <div style="background-color: #E9EBEF; height:72px; width:1px; margin-left:30px;margin-top:25px"></div>
                </jt-col>
                <!-- <jt-col  :span="5">
                    <p class="common-font-color num-font-size num-style" >{{testEnvDetail.residual_quota}}</p>
                    <p class="small-font-size gray-font-color num-tips-style">可用次数(今日)</p>
                </jt-col>
                <jt-col  :span="3">
                    <p class="common-font-color num-font-size num-style" >{{testEnvDetail.QPS_limit}}</p>
                    <p class="small-font-size gray-font-color num-tips-style">QPS限制(今日)</p>
                </jt-col> -->
                <jt-col  :span="4" class='envflex' style="margin-left:-14px">
                    <router-link to="/home/controlPlatform/production-env-detail">
                        <img src='../../assets/image/proenv_icon.png' class="icon-attr" style="margin-top:24px"/>
                    </router-link>
                    <div class='envname'>
                        <p class="bg-font-size common-font-color" style="margin-top:50px; margin-bottom:4px" >生产环境</p>
                    </div>
                </jt-col>
                <jt-col  :span="3" :offset="1">
                    <p class="common-font-color num-font-size num-style">{{proEnvDetail.used_quota}}</p>
                    <p class="small-font-size gray-font-color num-tips-style">已用次数(本月)</p>
                </jt-col>
                <jt-col :span="2" :offset="1" style="margin-left:68px">
                    <jt-button class="bt-top" style="margin-top:50px" @click="productionDetailClick">使用详情</jt-button>
                </jt-col>


            </jt-row>
            <!-- <div class="gray-line gray-line-env" style="margin-top:24px"></div> -->
            <!-- <jt-row class="row-len" :gutter="16"> -->
            <!-- <jt-col  :span="4" class='envflex'>
                    <router-link to="/home/controlPlatform/production-env-detail">
                        <img src='../../assets/image/proenv_icon.png' class="icon-attr" style="margin-top:24px"/>
                    </router-link>
                    <div class='envname'>
                        <p class="bg-font-size common-font-color" style="margin-top:33px; margin-bottom:4px" >生产环境</p>
                        <router-link to="/home/controlPlatform/production-env-detail">
                            <span class="small-font-size link-font-color">使用详情</span>
                        </router-link>
                    </div>
                </jt-col>
                <jt-col  :span="5" :offset="1">
                    <p class="common-font-color num-font-size num-style">{{proEnvDetail.used_quota}}</p>
                    <p class="small-font-size gray-font-color num-tips-style">已用次数(本月)</p>
                </jt-col> -->
            <!-- <jt-col  :span="5">
                    <p class="common-font-color num-font-size num-style" >{{proEnvDetail.residual_quota}}</p>
                    <p class="small-font-size gray-font-color num-tips-style">可用次数(本月)</p>
                </jt-col>
                <jt-col  :span="3">
                    <p class="common-font-color num-font-size num-style" >{{proEnvDetail.QPS_limit}}</p>
                    <p class="small-font-size gray-font-color num-tips-style">QPS限制(本月)</p>
                </jt-col> -->
            <!-- </jt-row> -->
        </div>
        <div class="grey-block">
        </div>
        <div class="my-robot">
            <jt-row  :gutter="16">
                <jt-col class="bgr-font-color bgr-font-size bg-font-weight" :span="3">
                    我的机器人
                </jt-col>
            </jt-row>
            <jt-row  :gutter="16" style="margin-top:16px">
                <jt-col  :span="5">
                    <img src='../../assets/image/testrobot_icon.png' class="icon-attr" @click="gotoEnvRobotList"/>
                    <span class="bg-font-size common-font-color envname">测试环境</span>
                </jt-col>
                <jt-col  :span="4">
                    <p class="common-font-color num-font-size" style="margin:0px" >{{teRobotNum}}</p>
                    <p class="small-font-size gray-font-color">测试中机器人</p>
                </jt-col>
                <jt-col  :span="2">
                    <jt-button class="bt-top" style="padding:4px 10px; margin-top:21px" @click="gotoEnvRobotList">机器人列表</jt-button>
                </jt-col>
                <jt-col  :span="1" >
                    <div style="background-color: #E9EBEF; height:72px; width:1px; margin-left:30px"></div>
                </jt-col>
                <jt-col  :span="5">
                    <img src='../../assets/image/prorobot_icon.png' class="icon-attr" style="margin-left:-14px" @click="gotoProRobotList"/>
                    <span class="bg-font-size common-font-color envname">生产环境</span>
                </jt-col>
                <jt-col  :span="4">
                    <p class="common-font-color num-font-size" style="margin:0px" >{{peRobotNum}}</p>
                    <p class="small-font-size gray-font-color">生产中机器人</p>
                </jt-col>
                <jt-col  :span="2">
                    <jt-button class="bt-top" style="padding:4px 10px; margin-top:21px" @click="gotoProRobotList">机器人列表</jt-button>
                </jt-col>
            </jt-row>
        </div>
    </div>
</template>
<script>
import {Modal} from "ant-design-vue";
import API from '../../constant/api';
import { mapActions,mapState } from "vuex";
import { axiosPost } from "../../utils/http.js";
import { ECLOUD_PREFIX } from "@/utils/cloud.http";
import { getRandomNum } from "../../utils/common";

export default {
    name: "PlatfromIndex",
    data: function () {
        return {
            teQueryResult: {},
            queryResult: {},
            errorDescription: '',
            btnType: '', //按钮类型
            government: true, //是否是政府用户
            zero: false, //是否是0元套餐
            volumPpay: false,//转为按量后付费
            owe: false,//欠费
            state: 0,
            modalTitle: "",
            modalText: "",
            modalTips: "",
            modalOkText:"",
            teRobotNum: 0,//测试环境机器人数量
            peRobotNum: 0,//生产环境机器人数量
            instanceId: '',//资源id
            productId: 1,//产品id
            unsubscribeButton: false,
            renewButton: false
        }
    },
    methods: {
        ...mapActions({
            teVuexQuery: "platform/teQuery",
            peVuexQuery: "platform/peQuery",
            terobotVuexQuery: "platform/terobotQuery",
            perobotVuexQuery: "platform/perobotQuery",
            getAuthority: 'platform/getAuthority',
            queryUser: 'platform/queryUser',
            getUserInfo: 'platform/getUserInfo'
        }),
        //变更
        change() {
            const param = {
                'instanceId': this.instanceId,
                'actionType': 5
            }
            this.getAuthority(param).then((res) => {
                if(res.state!='ERROR'){ 
                    if(res.body.operate4Action == 'ALLOW') {
                        this.$router.push({
                            path: '/custom-order',
                            query: {
                                opType: 1,
                                instanceId: this.instanceId,
                                productId: this.productId
                            }
                        })
                    }else {
                        this.showErrorNotification('无法变更',res.body.message)
                    }
                }else{
                    this.showErrorNotification('无法变更',res.errorMessage)
                }
            })
        },
        //续订
        renewal() {
            const param = {
                'instanceId': this.instanceId,
                'actionType': 6
            }
            this.getAuthority(param).then((res) => {
                if(res.state!='ERROR'){ 
                    if(res.body.operate4Action == 'ALLOW') {
                        this.$router.push({
                            path: '/custom-order',
                            query: {
                                opType: 2,
                                instanceId: this.instanceId,
                                productId: this.productId
                            }
                        })
                    }else {
                        this.showErrorNotification('无法续订',res.body.message)
                    }
                }else {
                    this.showErrorNotification('无法续订',res.errorMessage)
                }
            })
        },
        handleModalOk: () => {
            console.log("ccc")
        },
        EnvDetailClick() {
            this.$router.push({path:'/home/controlPlatform/test-env-detail',query: {}})
        },
        productionDetailClick() {
            this.$router.push({path:'/home/controlPlatform/production-env-detail',query: {}})
        },
        gotoEnvRobotList() {
            this.$router.push({path:'/home/testEnv', query: {}})
        },
        gotoProRobotList() {
            this.$router.push({path:'/home/productionEnv', query: {}})
        },
        //退订弹窗
        unsubscribeModal() {
            const param = {
                'instanceId': this.instanceId,
                'actionType': 2
            }
            this.getAuthority(param).then((res) => {
                if(res.state!='ERROR'){
                    if(res.body.operate4Action == 'ALLOW') {
                        Modal.confirm({
                            title :  <div style="font-size:14px;">确定退订已订购的服务吗？</div>,
                            content: 
                                <div style="font-size:12px">
                                    退订后，机器人数据将被删除退订立即生效。
                                </div>,
                            centered : true,
                            okText : '退订',
                            cancelText: '取消',
                            okType: 'danger',
                            onOk:() => this.unsubscribe(),
                            width:336,
                            okButtonProps:{ style:{width:'64px'}},
                            cancelButtonProps:{ style:{width:'64px'}},
                            icon:()=><jt-icon type="exclamation-circle" theme="filled" style="color:#F04134"/>
                        });
                    }else {
                        this.showErrorNotification('无法退订',res.body.message)
                    }
                }else{
                    this.showErrorNotification('无法退订',res.errorMessage)
                }
            })
        },
        unsubscribeLoading(modal) {
            //退订中
            modal.update({
                title :  <div style="font-size:14px;">您的账户正在退订中…</div>,
                class: 'unsubscribeSuccess',
                centered : true,
                okText : '',
                width:240,
                okButtonProps: { style: { display: 'none' } },
                icon:()=><jt-icon type="exclamation-circle" theme="filled" style="color:#337DFF"/>
            });
        },
        //退订
        unsubscribe() {
            const url = API.wuxi.orderCancel;
            const data = {
                'userId': this.userinfo.id,
                'actionType': 2,
                'instanceId': this.instanceId,
            };
            const params = {}
            const headers = {};
            const modal = Modal.warning();
            this.unsubscribeLoading(modal)
            axiosPost(url, params, data, headers).then((res)=>{
                modal.destroy();
                if('OK' == res.state) {
                    //退订成功
                    Modal.success({
                        title :  <div style="font-size:14px;">退订成功！</div>,
                        class: 'unsubscribeSuccess',
                        centered : true,
                        okText : '',
                        width:180,
                        maskClosable: true,
                        okButtonProps: { style: { display: 'none' } }
                    });
                }else {
                    this.showErrorNotification('退订失败！',res.errorMessage)
                }
            })
        },
        showErrorNotification(title, content) {
            this.$notification.open({
                message: title,
                description: "失败原因：" + content,
                icon: (<jt-icon type="exclamation-circle" theme="filled" style="color:#F04134"/>)
            });
        },
        //测试环境
        teQuotaQuery() {
            this.$store.commit('showLoading', {}, { root: true });
            this.teVuexQuery({"userId": getRandomNum(this.userId), "env": 0}).then((res)=>{
                if(res.errno == '999') {
                    this.showCatchNotification('查询失败！','系统繁忙,请稍后再试')
                }
            })
        },
        //生产环境
        peQuotaQuery() {
            this.peVuexQuery({"userId":  getRandomNum(this.userId), "env": 1}).then((res)=>{
                if(res.errno == '999') {
                    this.showCatchNotification('查询失败！','系统繁忙,请稍后再试')
                }
            })
        },
        //测试环境机器人个数
        terobotQuery() {
            this.terobotVuexQuery(this.userId).then((res) => {
                if(res.errno == '-101') {
                    this.$store.commit('setGlobalFreeze', {}, { root: true });
                }else{
                    this.teRobotNum = res.result.length
                }
            }).catch((error) => {
                this.showCatchNotification("查询失败！",'系统繁忙,请稍后再试')
            });
        },
        showCatchNotification(title, content) {
            this.$notification.open({
                message: title,
                description: "失败原因：" + content,
                icon: (<jt-icon type="exclamation-circle" theme="filled" style="color:#F04134"/>),
                duration: 0
            });
        },
        //生产环境机器人个数
        perobotQuery() {
            this.perobotVuexQuery(this.userId).then((res) => {
                if(res.errno == '-101') {
                    this.$store.commit('setGlobalFreeze', {}, { root: true });
                }else{
                    this.peRobotNum = res.result.length
                }
                this.$store.commit('hideLoading', {}, { root: true });
            }).catch(() => {
                this.$store.commit('hideLoading', {}, { root: true });
                this.showCatchNotification("查询失败！",'系统繁忙,请稍后再试')
            });
        },
        //获取是否首次订购和订单状态
        queryUserVuex() {
            this.queryUser().then((res)=>{
                this.instanceId = res.body.instanceId
                if(!this.instanceId) {
                    window.location.href = ECLOUD_PREFIX + 'api/page/op-order-static/product/jiutianbot'
                }else {
                    //1订购中  3变更中 4、5退订中 6已退订 7冻结中 8已冻结 10订购成功或已恢复
                    const statusList = [4,5]
                    const status = res.body.status
                    if(statusList.includes(status)) {
                        const modal = Modal.warning();
                        this.unsubscribeLoading(modal)
                    }
                }
            })
        },
        //获取用户数据，包括instanceId
        getUserInfoVuex() {
            this.getUserInfo().then((res)=>{
                if(res.errno == '-101') {
                    this.$store.commit('setGlobalFreeze', {}, { root: true });
                }else {
                    this.productId = res.result.productId
                    if(this.productId  == 1) {
                        this.zero = true
                    }
                    const consoleState = res.result.consoleState
                    this.changeConsoleState(consoleState)
                }
            }).catch((error) => {
                console.log({"errno": error.errno, "errorMsg": error.errorMsg});
            });
        },
        //控制台状态
        changeConsoleState(consoleState) {
            if(!this.government) {
                if(consoleState == 'EXCEED' || consoleState == 'UNEXCEED') {
                    this.owe = true
                }
            }
        },
        initPage() {
            this.teQuotaQuery();
            this.peQuotaQuery();
            this.terobotQuery();
            this.perobotQuery();
        }
    },
    created() {
        //获取用户信息
        // this.$store.dispatch("fetchUsers").then(() => {
        //     if (this.userinfo.isCustomer == 1) {
        //是否是政府用户
        this.government = this.userinfo.customerType == '互联网客户'?false:true
        this.unsubscribeButton = this.government
        if (this.userinfo.isCustomer == 1) {
            this.queryUserVuex()
            this.getUserInfoVuex()
        }
        this.initPage()
        if(!this.government){
            this.zero ? this.btnType = 'primary' : this.btnType = ''
            this.renewButton = !this.zero && !this.government
        }else{
            this.btnType = 'primary'
        }
        //     }
        // });
    },
    computed: {
        testEnvDetail() {
            return this.$store.state.platform.testEnvDetail
        },
        proEnvDetail() {
            return this.$store.state.platform.proEnvDetail
        },
        userId() {
            return this.$store.state.userId
        },
        ...mapState(["userinfo"])
    }
};
</script>
<style lang="less" scoped>
@import "~@/assets/style/var.less";
    .errorAlert {
        position: fixed;
        z-index: 99;
        right: 27px;
        top: 85px;
        .ant-alert-error {
            width: 359px;
            height: 110px;
            background: #fff;
            border: none;
            box-shadow: inset 0 1px 1px rgba(0,0,0,.075), 0 0 8px #ccc;
        }
    }
    .icon-attr {
        width: 72px;
        height: 72px;
        cursor: pointer;
    }

    .row-len {
        padding-left: 20px;
        padding-right: 20px;
        .envflex {
            display: flex;
            .envname {
                margin-left: 16px;
            }
        }
    }
    .gray-line {
        background-color: #E9EBEF;
        height: 1px;
    }
    .gray-line-env {
        margin: 0 20px
    }
    .grey-block {
      height: 20px;
      background-color: rgba(239,241,244,1);
    }
    .num-style {
        margin-top:22px;
        margin-bottom:0px;
    }

    .num-tips-style {
        margin-bottom: 0px;
    }

    .num-font-size {
        font-size: 30px;
    }
    .bgr-font-size {
        font-size: @jt-font-size-lg;
        
        //font-weight:bold
    }
    .bg-font-size {
         font-size: @jt-font-size-lg;
         
    }
    .bg-font-weight {
        font-weight: 600;
    }
    .small-font-size {
        font-size: @jt-font-size-sm;
    }

    .bgr-font-color {
        color: @jt-color-text-strong;
    }

    .common-font-color {
        color: @jt-color-text-strong;
    }

    .link-font-color {
        color: #337DFF
    }

    .gray-font-color {
        color: #999999
    }
    .usedUp {
        font-size:12px;
        font-family:PingFangSC-Regular,PingFang SC;
        font-weight:400;
        color:rgba(255,147,29,1);
        margin-right: 16px;
        margin-left: 5px;
    }
    .bt-top {
        width: 80px;
        height: 32px;
    }
    .change {
        border:1px solid rgba(51,125,255,1);
        color:rgba(51,125,255,1);
    }
    .change:hover {
        background: #eaf2ff;
    }
    .main-header{
        height: 58px;
        background-color: #fff;
        padding-left: 20px;
        line-height: 58px;
        font-weight: 500;
        font-size: @jt-font-size-lg;
        color: @jt-color-text-strong;
    }

    .my-serve {
        height: 185px;
        background: #ffffff;
        padding: 20px 0px 30px 0px;
        border-radius: 2px;
    }

    .my-robot {
        height: 165px;
        background: #ffffff;
        padding: 20px;
        border-radius: 2px;
         .envname {
             display: inline-block;
            margin-left: 16px;
        }
    }

</style>
<style>    
    .unsubscribeSuccess .ant-modal-confirm-btns{
        margin:0!important;
    }
</style>
