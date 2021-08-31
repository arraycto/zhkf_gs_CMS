<template>
    <div>
        <div id="custom-order" v-if='possibleOrder && proData.length>0'>
            <div id="order_detail" v-show="pageIdx==0">
                <div class="header">
                    <span>智能交互中心</span>
                </div>
                <div id="greyBg" style="font-size:12px">
                    <div id="addtion">
                        <div id="charge-div">
                            <div class="item-label">
                                <span class="p4">计费模式</span>
                            </div>
                            <jt-radio-group v-model="defaultChargModeValue">
                                <jt-radio-button v-for="(item, idx) in chargModeName" :key="idx" @click.native="selectChangeMode(idx)" :value='item' class='region-radio'>
                                    {{item}}
                                </jt-radio-button>
                            </jt-radio-group>
                        </div>
                        <div id="region-div">
                            <div class="item-label">
                                <span class="p4">地域</span>
                            </div>
                            <ul id="region-ul" v-if='productList.length>0'>
                                <jt-dropdown :trigger="['click']">
                                    <jt-menu slot="overlay" @click="handleMenuClick" class='region-menu'>
                                        <jt-menu-item v-for='(item,index) in productList' :key="index"> 
                                            <span class='region-name'>{{item.name}}</span>
                                            <div v-for='(dataList,dataIndex) in item.dataList' :key="dataIndex" class="radio-div">
                                                <jt-radio-group v-model="defaultProductValue" @change="onChange">
                                                    <jt-radio-button v-for="(data,index) in dataList" :key="index" :value='data.poolName'>
                                                        {{data.poolName}}
                                                    </jt-radio-button>
                                                </jt-radio-group>
                                            </div>
                                        </jt-menu-item>
                                    </jt-menu>
                                    <jt-button class='region-button'> {{defaultProductValue}} <jt-icon type="down" class='region-icon'/> </jt-button>
                                </jt-dropdown>
                                <jt-radio-group v-model="defaultRegionValue">
                                    <jt-radio-button v-for="(item, idx) in region" :key="idx" @click.native="sellectRegion(idx)" :value='item' class='region-radio'>
                                        {{item}}
                                    </jt-radio-button>
                                </jt-radio-group>
                                <div>
                                    <p class='poolMapping'>不同地域的实例之间内网互不相通；选择靠近您客户的地域，可降低网络时延、提高您客户的访问速度</p>
                                    <p class='poolMapping'>移动云各资源池命名全新改版，若您对新旧资源池命名关系存在疑惑，可查看
                                        <span class='poolTableLink' @click="toPoolLink">资源池名称新旧版映射表 </span>
                                    </p>
                                </div>
                            </ul>
                        </div>
                    </div>
                    <div id="env" >
                        <div class="test-env-div" style="height:85px">
                            <div class="item-label">
                                <span class="p4 env-word">测试环境</span>
                            </div>
                            <jt-table :columns="testColumns" :dataSource="testData"  rowKey='id' class="jtTabel table-pos" :pagination="false">
                                <span slot="flow" slot-scope="text">
                                    {{text}}次/天
                                </span>
                                <span slot="qps" slot-scope="text">
                                    {{text}}个
                                </span>
                            </jt-table>
                        </div>
                        <div class="test-env-div">
                            <div class="item-label">
                                <span class="p4 env-word">生产环境</span>
                            </div>
                            <jt-table :rowSelection="rowSelection" :columns="proColumns" :dataSource="proData" rowKey='id' class="jtTabel table-pos" :pagination="false">
                                <span slot="tips" slot-scope="text">
                                    {{text}}
                                    <span v-if="text==='初次订购用户'" style="color:#999999">
                                        （开通日起一个月内有效）
                                    </span>
                                </span>
                                <span slot="flow" slot-scope="text">
                                    {{text | capitalize}}次/月
                                </span>
                                <span slot="price" slot-scope="text">
                                    <span v-if='text!=0'>￥{{text | capitalize}}元/月</span>
                                    <span v-else>免费</span>
                                </span>
                                <span slot="qps" slot-scope="text">
                                    {{text}}个
                                </span>
                            </jt-table>
                            <div class="env-tips tips-color">
                                <span>测试环境流量包不可扩容。生产环境当月流量包不足后，每次调用需花费0.015元</span>
                            </div>
                        </div>
                        <div class="test-env-div use-term" v-if="!government && (opType==0 || opType==2)">
                            <div class="item-label">
                                <span class="p4">使用期限</span>
                            </div>
                            <div id="counter">
                                <jt-input-num :min=1 :max='maxNum' v-model="counter" @change="changeCounter" 
                                              :disabled="zeroDisabled">
                                </jt-input-num>
                                <span style="margin-left:5px">个月</span>
                            </div>
                            <div class="counter-tips tips-color-year">
                                <span>订购时最多{{maxNum}}个月</span>
                            </div>
                            <div class="counter-tips tips-color-error" v-if="!counter">
                                <span>请填写使用期限</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="order-foot foot-margin" v-show="pageIdx==0">
                <div class="fixed-bot-panel" id="bottom-panel" style="position: absolute; bottom: auto;">
                    <div class="fee-wrapper">
                        费用合计
                        <span class="total">
                            ¥
                            <span>{{spend}}</span>
                        </span>
                        <span>{{unit}}</span>
                        <div>
                            <span class="tips-color">{{totalCost}}</span>
                        </div>
                    </div>
                    <div class="btn-wrapper">
                        <jt-button size="large" type="primary" @click="submitOrder" style='width:auto' :disabled="isDisabled">确认订单</jt-button>
                    </div>
                </div>
            </div>
            <div id="order-config" v-show="pageIdx==1">
                <div class="header">
                    <span>智能交互中心</span>
                </div>
                <div class="grey-config">
                    <div>
                        <jt-button type="icon" class="bt-icon" @click="comeBack">
                            <span class="iconfont icondingdanyefanhui"></span>
                        </jt-button>
                        <jt-button size="large" type="link" @click="comeBack" style="padding-left:10px">
                            修改配置
                        </jt-button>
                    </div>
                    <div class="order-info">
                        <jt-table :columns="orderColumns" :dataSource="orderData"  rowKey='id' class="jtTabel" :pagination="false" v-if="proData.length>0">
                            <span slot="slot-config">
                                <div class='config'>
                                    <span class='config-name'>地域</span>
                                    <span style="margin-left:70px">{{getRegionStr(selRegion)}}</span>
                                </div>
                                <div class='config'>
                                    <span class='config-name'>服务配置</span>
                                    <span style="margin-left:45px">测试环境：{{testData[selTestEnv].flow}}次/天</span>
                                    <span style="margin-left:20px">{{testData[selTestEnv].qps}}QPS</span>
                                </div>
                                <div v-show="proData[selIdx]">
                                    <span style="margin-left:93px">生产环境：{{proData[selIdx].flow}}次/月</span>
                                    <span style="margin-left:20px">{{proData[selIdx].qps}}QPS</span>
                                </div>
                            </span>
                            <span slot="slot-price" slot-scope="text" style="color:#F04134">
                                ￥{{text}}元/月
                            </span>
                        </jt-table>
                    </div>
                    <div class="cost-info">
                        <div v-if="!government">
                            账户余额
                            <span style="color: #F04134; margin-left: 20px">
                                ¥{{balance}}
                            </span>
                            <jt-button size="large" type="link" @click="reCharge" style="padding-left:10px">
                                立即充值
                            </jt-button>
                        </div>
                        <div>
                            服务协议
                            <Checkbox @change="agree" style="margin-left: 20px; margin-right:5px"></Checkbox>
                            我已阅读并同意
                            <jt-button size="large" type="link" @click="openAgreement" style="padding-left:10px;width:auto">
                                《智能交互服务条款》
                            </jt-button>
                        </div>
                        <div class="recharge-wrapper fee-wrapper">
                            费用合计
                            <span class="total">
                                ¥
                                <span>{{spend}}</span>
                            </span>
                            {{unit}}
                            <div>
                                <!-- <jt-tooltip :title="tips" v-show="!bAgree">
                                    <jt-button size="large" type="primary" @click="payOrder" style='width:auto' :disabled="!bAgree">前往支付</jt-button>
                                </jt-tooltip>
                                <jt-button size="large" type="primary" @click="payOrder" style='width:auto' :disabled="!bAgree" v-show="bAgree">前往支付</jt-button> -->
                                <jt-button size="large" type="primary" @click="payOrder" style='width:auto' :disabled="isPayDisabled">{{btnName}}</jt-button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-if='!possibleOrder'>
            <empty-page :possibleOrder='possibleOrder' :questionSearchNoneImage='questionSearchNoneImage'
                        :emptyBtnName='emptyBtnName' :emptySubTitle='emptySubTitle' :emptyTitle='emptyTitle'>
            </empty-page>
        </div>
        <jt-loading v-if='loading'></jt-loading>
    </div>
</template>

<script>
import { mapState,mapActions } from "vuex";
import {Table, InputNumber,Checkbox} from "ant-design-vue";
import { ECLOUD_PREFIX, ZNJHCONSOLE, POOLLINK } from "@/utils/cloud.http";
import { axiosGet, axiosPost } from "../../utils/http.js";
import API from '../../constant/api';
import emptyPage from './empty-page'

const goodsInxName = ["一", "二", "三", "四"]

export default {
    name: 'CustomOrder',
    components:{
        Checkbox,
        "jt-table": Table,
        "jt-input-num": InputNumber,
        'empty-page': emptyPage
    },
    data: function () {
        return {
            defaultChargModeValue: '',
            defaultRegionValue: '',
            defaultProductValue: '',
            productList: [],
            possibleOrder: true,
            questionSearchNoneImage: '',
            emptyBtnName: '',
            emptyTitle: '',
            emptySubTitle: '',
            government: false, //是否是政府用户
            testColumns: [
                {title: ' ', dataIndex: 'id', key: 'id', className:"col-empty"},
                {title: '流量包数量', dataIndex: 'flow', key: 'flow' , className:"col-att",scopedSlots: { customRender: 'flow' }},
                {title: 'QPS限制', dataIndex: 'qps', key: 'qps', className:"col-att",scopedSlots: { customRender: 'qps' }},
            ],
            testData: [
                {id: ' ', flow: '100', qps:"1", env: 0},
            ],
            proColumns: [
                {title: '套餐名称', dataIndex: 'name', key: 'name', className:"col-att"},
                {title: '流量包数量', dataIndex: 'flow', key: 'flow' , className:"col-att",scopedSlots: { customRender: 'flow' }},
                {title: 'QPS限制', dataIndex: 'qps', key: 'qps', className:"col-att",scopedSlots: { customRender: 'qps' }},
                {title: '适用对象', dataIndex: 'tips', key: 'tips', className:"col-att",scopedSlots: { customRender: 'tips' }},
                {title: '资费', dataIndex: 'price', key: 'price', className:"col-att",scopedSlots: { customRender: 'price' }},
            
            ],
            proData: [],
            orderColumns: [
                {title: '产品名称', dataIndex: 'id', key: 'id'},
                {title: '配置信息', dataIndex: 'config', key: 'config', scopedSlots:{customRender: "slot-config"}},
                {title: '单价', dataIndex: 'price', key: 'price', scopedSlots:{customRender: "slot-price"} },
                {title: '计费方式', dataIndex: 'chargeMode', key: 'chargeMode',},
            ],

            orderData:[
                {id: "智能交互中心", config: "aaa", term: "1", price: "0", chargeMode:"bbb"}
            ],

            pageIdx: 0,
            selIdx: 0,
            selChargeMode: 0,
            selRegion: 0,
            selTestEnv:0,
            spend:0,
            counter:1,
            zeroDisabled: false,
            balance: 0,
            bAgree: false,
            region: [],
            resp: {
                chargemode: [
                    0
                ],
                region:[
                    0,1
                ],
                tips : "当月套餐内次数包不足时，每一千次调用花费15元"
            },
            maxNum:12,
            instanceId: '',
            tips:'您尚未同意《xxx服务条款》',
            chargModeName: [],
            unit: '',
            totalCost: '',
            btnName: '',
            url: '',
            poolId: '',
            paymentType: '',//-1 为没查到，1:预付费；2：内部审批；3：后付费
            orderInfo: {},//订单详情
            paymentUrl: '',//支付链接
            isFirstOrder: true, //是否首次订购
            firstPro: -1,//免费版是否可以点击
            secondPro: -1,//标准版版是否可以点击
            thirdPro: -1, //企业版是否可以点击
            productId:1,//已订购产品id
            defaultCheckedId:1,//默认选择的产品id
            isDisabled: false,
            isPayDisabled: true
        }
    },
    props: ["opType"], //0正常订购，1变更，2续费
    methods:{
        ...mapActions({
            getPool: "platform/getPool",
            getMeasure: 'platform/getMeasure',
            getProducts: 'platform/getProducts',
            queryUser: 'platform/queryUser',
            getCertificate: 'platform/getCertificate',
            getUserInfo: 'platform/getUserInfo',
            getThreshold: 'platform/getThreshold'
        }),
        toPoolLink() {
            window.open(POOLLINK)
        },
        onChange(e) {
            console.log(`checked = ${e.target.value}`);
            this.defaultProductValue = e.target.value
        },
        handleMenuClick(e) {
            console.log('click', e);
        },
        comeBack() {
            this.pageIdx--
            this.isDisabled = false
        },
        getIdxStr(idx) {
            return  "套餐" + goodsInxName[idx]
        },
        getRegionStr(idx) {
            return this.region[idx]
        },
        getChargeModeStr(idx) {
            return this.chargModeName[idx]
        },
        selectItem(idx) {
            this.serviceId = this.proData[idx].serviceId
            this.maxNum = idx == 0?1:12
            this.zeroDisabled = idx == 0?true:false
            this.selIdx = idx
            this.calSpend()

        },
        changeCounter() {
            this.counter = Math.round(this.counter)
            this.calSpend()
        },
        selectChangeMode(idx) {
            this.selChargeMode = idx
        },
        sellectRegion(idx) {
            this.selRegion = idx
        },
        selectTestEnv(idx) {
            this.selTestEnv = idx
        },
        calSpend() {
            if(this.proData[this.selIdx].price == '免费'){
                this.spend = 0
                this.maxNum = 1
            } else {
                const price = this.proData[this.selIdx].price
                this.spend = this.counter * price
            }
           
        },
        submitOrder() {
            this.orderData[0].term = this.counter + "个月"
            this.orderData[0].price = this.proData[this.selIdx].price
            this.orderData[0].chargeMode = this.chargModeName[this.selChargeMode]
            this.orderData[0].config = this.region[this.selRegion] + "," + this.testData[this.selTestEnv].flow + "," + this.testData[this.selTestEnv].qps + "," + this.proData[this.selIdx].flow + "," + this.proData[this.selIdx].qps
            if(this.paymentType == 1) {
                this.isDisabled = true
                console.log('预付费')
                this.getThreshold(this.serviceId).then((res) => {
                    this.balance = res.body.accountMoney
                }).catch((error) => {
                    console.log({"errno": error.errno, "errorMsg": error.errorMsg});
                })
                if(this.counter<=0) {
                    return
                }
                this.internetUsers()
                this.order().then((res)=>{
                    if(res.state == 'OK') {
                        this.pageIdx++
                        this.paymentUrl = res.body
                    }else if(res.state == 'repeat'){
                        this.$router.push({path:'/order-result', query: {type:3,errorMessage:res.errorMessage}})
                    }else {
                        this.$router.push({path:'/order-result', query: {type:1,errorMessage:res.errorMessage}})
                    }
                }).catch((error) => {
                    console.log({"errno": error.errno, "errorMsg": error.errorMsg});
                });
            }else {
                this.pageIdx++
            }
        },
        agree() {
            this.bAgree = !this.bAgree
            this.isPayDisabled = !this.bAgree
        },
        openAgreement() {
            const url = 'https://ecloud.10086.cn/op-help-center/show/7416E9B1E4480BDB'
            //打开服务协议
            window.open(url)
        },
        reCharge() {
            // 打开充值页面
            window.open(ECLOUD_PREFIX + 'usercenter/assets/charge')
        },
        payOrder() {
            //-1 为没查到，1:预付费；2：内部审批；3：后付费
            if(this.paymentType == 1){
                console.log('预付费支付')
                if(this.proData[this.selIdx].id == 1) {
                    this.$router.push({path:'/order-result', query: {type:0}})
                }else{
                    window.location.href = this.paymentUrl
                }
                // this.$router.push({path:'/order-result', query: {type:2}})
            }else if(this.paymentType == 2){
                this.isPayDisabled = true
                console.log('内部审批')
                this.quantity = 1
                this.counter = 0
                if(this.opType == 0) {
                    this.enterpriseUsersApproval()
                }else {
                    this.enterpriseUsersNoApproval()
                }
            }else if(this.paymentType == 3) {
                this.isPayDisabled = true
                console.log('后付费')
                this.quantity = 1
                this.counter = 0
                this.enterpriseUsersNoApproval()
            }
        },
        //订购
        async order() {
            let data = {}
            const jsonArray = [];
            jsonArray.push(this.proData[this.selIdx])
            jsonArray.push(this.testData[0])
            const url = this.url
            let extId = ''
            //0正常订购，1变更，2续费
            if(this.opType == 0) {
                extId = ''
                const res = await this.queryUser()
                const instanceId = res.body.instanceId
                if(instanceId) {
                    return new Promise((resolve)=>{
                        resolve({ "state": 'repeat', 'errorMessage': '资源已创建或创建中，无需重复提交' })
                    })
                }
               
            }else{
                extId = this.orderInfo.id
            }
            const products = [{
                'extId': extId,//订单项Id
                'serviceId': this.serviceId,//产品Id
                'quantity': this.quantity,//订购数量
                'duration': this.counter,//订购时长
                'totalPrice': this.spend,//总费用
                'customParams': JSON.stringify(jsonArray)
            }]
            data = {
                "preCharge": !this.government,//是否为预付费
                "returnUrl": ZNJHCONSOLE + '#/order-result?type=0',//回调url
                'products': products,//产品集合
                'orderSource' :  'CLOUD_INTELLIGENT_INTEGRACTION_SUBSYSTEM'
            };
            //0正常订购，1变更，2续费
            if(this.opType == 1) {
                data.oldOrderId = this.orderInfo.orderId//旧订单id
            }else if(this.opType == 2){
                data.orderId = this.orderInfo.orderId//续费订单id
            }
            const headers = {}
            const params = {}
            return axiosPost(url, params, data, headers)
           
        },
        //预付费订购/变更/续订
        internetUsers() {
            this.quantity = 1
            if(this.opType == 0) {
                this.url = ECLOUD_PREFIX + 'api/web/paycenter/create/payIntegration';
            }else if(this.opType == 2) {
                this.url = ECLOUD_PREFIX + 'api/web/paycenter/renew/payIntegration';
            }else{
                this.url = ECLOUD_PREFIX + 'api/web/paycenter/change/payIntegration';
            }
        },
        //审批后付费订购
        async enterpriseUsersApproval() {
            const res = await this.queryUser()
            const instanceId = res.body.instanceId
            if(instanceId) {
                this.$router.push({path:'/order-result', query: {type:3,errorMessage:'资源已创建或创建中，无需重复提交'}})
                return
            }
            this.url = ECLOUD_PREFIX + 'api/web/ordercenter/innerPreference/orderPostpayIntegration';
            this.order().then((res)=>{
                if(res.state == 'OK') {
                    this.$router.push({path:'/order-result', query: {type:2}})
                }else {
                    this.$router.push({path:'/order-result', query: {type:1,errorMessage:res.errorMessage}})
                }
            }).catch((error) => {
                console.log({"errno": error.errno, "errorMsg": error.errorMsg});
            });
        },
        //非审批后付费订购/变更（包括审批）
        async enterpriseUsersNoApproval() {
            let orderType = ''
            //0正常订购，1变更，2续费
            if(this.opType == 0) {
                const res = await this.queryUser()
                const instanceId = res.body.instanceId
                if(instanceId) {
                    this.$router.push({path:'/order-result', query: {type:3,errorMessage:'资源已创建或创建中，无需重复提交'}})
                    return
                }
                this.url = API.wuxi.resourceCreate;
                orderType = 1
            }else if(this.opType == 1) {
                this.url = API.wuxi.resourceModify;
                orderType = 5
            }
            const headers = {
                "userId": this.userinfo.id,
                'requestId': this.requestid,
                "currentUser": this.userinfo.id
            }
            const params = {}
            const url = this.url
            let data = {}
            const jsonArray = [];
            jsonArray.push(this.proData[this.selIdx])
            jsonArray.push(this.testData[0])
            const obj = {
                "chargingMode": 0,
                "customerRemarks": JSON.stringify(jsonArray),
                "duration": this.counter,
                "orderExtId": '',
                "payType": 0,//后付费 0、预付费1
                "periodType": 1,
                "quantity": this.quantity,
                "regionId": this.poolId,
                "relInstanceId": this.instanceId,
                "resourceType": "",
                "serviceInfoId": this.serviceId
            }
            if(this.opType == 0 && this.proData[this.selIdx].id == 1) {
                obj.periodNum = 1
            }
            const exts = [obj]
            data = {
                'exts': exts,
                "instanceId": this.instanceId,
                "orderSource": "CLOUD_INTELLIGENT_INTEGRACTION_SUBSYSTEM",
                "orderType": orderType,//订单类型，1：创建;2:删除;3:暂停,4:恢复 5变更
                "productType": "intelligentInteraction",
                "userId": this.userinfo.id,
                "userType": 2//用户类型：1 互联网用户；2政企用户，前端调用必传
            };
            axiosPost(url, params, data, headers).then((res)=>{
                if(res.state == 'OK') {
                    this.$router.push({path:'/order-result', query: {type:0}})
                }else {
                    this.$router.push({path:'/order-result', query: {type:1,errorMessage:res.errorMessage}})
                }
            }).catch((error) => {
                console.log({"errno": error.errno, "errorMsg": error.errorMsg});
            });
        },
        //判断是否是政府用户和根用户
        async isGoverment() {
            if(this.userinfo && this.userinfo.customerType) {
                if(this.userinfo.customerType == '互联网客户') {
                    this.government = false
                    this.unit = '元'
                    this.totalCost = '费用合计=所选套餐单价*使用期限'
                    this.btnName = '前往支付'
                    const obj = {title: '使用期限', dataIndex: 'term', key: 'term', scopedSlots:{customRender: "slot-term"}}
                    this.orderColumns.splice(2, 0, obj);
                }else {
                    this.government = true
                    this.unit = '元/月'
                    this.totalCost = '费用合计=所选套餐单价，具体扣费请以月末账单为准'
                    this.btnName = '订购服务'
                }
                //判断是否是根账号
                if(this.userinfo.isCustomer == 1 ) {
                    this.possibleOrder = true
                    if(!this.government) {
                        //互联网用户判断是否实名认证
                        const res = await this.getCertificate()
                        const userState = res.state
                        const stateArr = {
                            'AUDITING': '实名认证审核中',
                            'AUDIT_FAIL': '实名认证审核失败',
                            'NO_AUDIT': '未实名认证',
                            'AUDIT_ERROR': '实名认证审核异常',
                            'ERROR': res.errorMessage
                        }
                        if(userState in stateArr) {
                            this.possibleOrder = false
                            this.questionSearchNoneImage = require("@/assets/image/realName.png")
                            this.emptyTitle = stateArr[userState]
                            this.emptySubTitle = '您的账户' + stateArr[userState] + '，无法订购，请先前往认证'
                            this.emptyBtnName = '前往认证'
                            this.$store.commit('hideLoading', {}, { root: true });
                            return
                        }
                    }
                    if(this.possibleOrder) {
                        //订单查询
                        this.queryUser().then((res)=>{
                            this.isFirstOrder = res.body.ifFirstOrder
                            this.instanceId  = res.body.instanceId
                            console.log('instanceId-------' + this.instanceId)
                            if(this.opType){
                                this.getOrderInfo()
                                this.getUserInfo().then((res) => {
                                    this.productId = res.result.productId
                                })
                            }
                            this.getVuexPool()
                        })
                    }
                    
                }else{
                    this.possibleOrder =  false
                    this.questionSearchNoneImage = require("@/assets/image/shelves.png")
                    this.emptyBtnName = '返回首页'
                    this.emptyTitle = '无法订购'
                    this.emptySubTitle = '非常抱歉，您暂无订购及使用权限'
                    this.$store.commit('hideLoading', {}, { root: true });
                }
            }else{
                location.reload()
            }
        },
        //获取局数据
        getAllProducts() {
            this.$store.commit('showLoading', {}, { root: true });
            //信息
            this.$store.dispatch("fetchUsers").then(() => {
                //是否是政府用户
                this.isGoverment()
            });
        },
        dealProductList() {
            this.productList.forEach((item,i)=>{
                let index =0;
                const count = 4;
                const arrTemp = [];
                const experts = item.dataList;
                for(let i=0;i<experts.length;i++){
                    index = parseInt(i/count);
                    if (arrTemp.length <= index) {
                        arrTemp.push([]);
                    }
                    arrTemp[index].push(experts[i])
                }
                item.dataList = arrTemp
            })
            this.defaultProductValue = this.productList[0].dataList[0][0].poolName
        },
        //获取资源池
        getVuexPool() {
            this.getPool().then((res)=>{
                const poolList = res.body
                if(poolList.length>0) {
                    const productList = []
                    for(const pool of poolList){
                        if(productList.length<=0) {
                            const obj = {'name':pool.zoneId,dataList:[pool]}
                            productList.push(obj)
                        }else{
                            for(const product of productList) {
                                if(pool.zoneId != product.zoneId) {
                                    const obj = {'name':pool.zoneId,dataList:[pool]}
                                    productList.push(obj)
                                }else {
                                    product.data.push(pool)
                                }
                            }
                        }
                    }
                    this.productList = productList
                    this.dealProductList()

                    this.region.push('可用区2')
                    this.defaultRegionValue = this.region[0]
                    const poolId = poolList[0].poolId
                    this.poolId = poolId
                    this.getVuexMeasure(poolId)
                }else {
                    this.shelves()
                }
            })
        },
        //获取计费模式
        getVuexMeasure(poolId) {
            this.getMeasure(poolId).then((res)=>{
                const newArr = res.body.filter(item => item.measureType == '1')
                if(newArr.length>0){
                    this.$nextTick(()=>{
                        this.chargModeName.push(newArr[0].measureName)
                        this.defaultChargModeValue = this.chargModeName[0]
                    })
                    const productReq = newArr[0]
                    productReq.poolId = poolId
                    this.getVuexProducts(productReq)
                }else{
                    this.shelves()
                }
            })
        },
        //获取产品信息
        getVuexProducts(productReq) {
            this.getProducts(productReq).then((res)=>{
                const respBody = res.body
                if(respBody.length>0) {
                    this.possibleOrder = true
                    for(let i=0;i<respBody.length;i++){
                        let obj = {}
                        if(respBody[i].configs.FlavorType == "企业版"){
                            obj = {id: 3, name: '', flow: '100000', qps:"30", tips: "大中型企业", price: '',env: 1 }
                            obj.price = respBody[i].pays[0].feePrice
                            obj.name = respBody[i].configs.FlavorType
                            obj.serviceId = respBody[i].serviceId
                            this.$set(this.proData,2,obj)
                        }else if(respBody[i].configs.FlavorType == "免费版") {
                            obj = {id: 1, name: '', flow: '1000', qps:"1", tips: "初次订购用户", price: 0,env: 1}
                            obj.name = respBody[i].configs.FlavorType
                            obj.serviceId = respBody[i].serviceId
                            this.$set(this.proData,0,obj)
                        }else{
                            obj = {id: 2, name: '', flow: '10000', qps:"20", tips: "开发者和小微企业", price: '',env: 1}
                            obj.price = respBody[i].pays[0].feePrice 
                            obj.name = respBody[i].configs.FlavorType
                            obj.serviceId = respBody[i].serviceId
                            this.$set(this.proData,1,obj)
                        }
                    }
                    this.proData = this.proData.filter(item => item)
                    this.queryUserVuex()
                    this.$store.commit('hideLoading', {}, { root: true });
                }else{
                    this.shelves()
                }
                
            })
        },
        shelves() {
            this.possibleOrder =  false
            this.questionSearchNoneImage = require("@/assets/image/shelves.png")
            this.emptyBtnName = '返回首页'
            this.emptyTitle = '产品已下架'
            this.emptySubTitle = '非常抱歉，产品已下架'
            this.$store.commit('hideLoading', {}, { root: true });
        },
        //查询变更流程
        procedure() {
            const url = API.wuxi.productProcedure
            const headers = {}
            const params = {
                'userId': this.userinfo.id,
                'serviceId': this.serviceId
            }
            axiosGet(url, params, null,headers).then((res)=>{
                //-1 为没查到，1:预付费；2：内部审批；3：后付费
                this.paymentType = res.body
            }).catch((error) => {
                console.log({"errno": error.errno, "errorMsg": error.errorMsg});
            });
        },
        //变更和续订订单详情
        getOrderInfo() {
            if(this.opType){
                //获取serveiceId
                const url = ECLOUD_PREFIX + 'api/web/ordercenter/getOrderExtInfo/'+this.instanceId;
                const params = {};
                const headers = {
                    'request_id': this.requestid,
                    'user_id': this.userinfo.id,
                };
                axiosGet(url, params, headers).then((res)=>{
                    this.orderInfo = res.body
                }).catch((error) => {
                    console.log({"errno": error.errno, "errorMsg": error.errorMsg});
                });
            }
        },
        //获取是否首次订购和订单状态
        queryUserVuex() {
            if(this.isFirstOrder){
                this.firstPro = -1
                this.defaultCheckedId = this.proData[0].id
                this.selIdx = 0
                this.maxNum = 1
                this.zeroDisabled = this.selIdx == 0?true:false
            }else{
                const productData = this.proData.filter(item => item.id != 1)
                this.firstPro = 1
                if(productData.length > 0) {
                    this.defaultCheckedId = productData[0].id
                    this.selIdx = this.proData.indexOf(productData[0])
                }
            }
            if(this.opType) {
                this.defaultCheckedId = this.productId
            }
            //1变更2续订
            if(this.opType ==1) {
                let productData = []
                if(this.productId==3) {
                    this.firstPro = 1
                    this.secondPro = 2
                    this.thirdPro = 3
                    this.isDisabled = true
                    productData = this.proData.filter(item => item.id == 3)
                }
                if(this.productId==2) {
                    this.firstPro = 1
                    this.secondPro = 2
                    productData = this.proData.filter(item => item.id == 3)
                }
                if(this.productId==1) {
                    this.firstPro = 1
                    productData = this.proData.filter(item => item.id != 1)
                }
                if(productData.length > 0) {
                    this.defaultCheckedId = productData[0].id
                    this.selIdx = this.proData.indexOf(productData[0])
                }
            }else if(this.opType ==2) {
                const productData = this.proData.filter(item => item.id == this.productId)
                if(productData.length > 0) {
                    if(this.productId == 3) {
                        this.firstPro = 1
                        this.secondPro = 2
                    }
                    if(this.productId == 2) {
                        this.firstPro = 1
                        this.thirdPro = 3
                    }
                    this.selIdx = this.proData.indexOf(productData[0])
                }else {
                    this.possibleOrder =  false
                    this.questionSearchNoneImage = require("@/assets/image/shelves.png")
                    this.emptyBtnName = '返回首页'
                    this.emptyTitle = '套餐已下架'
                    this.emptySubTitle = '非常抱歉，您当前订购的套餐已下架，无法续订'
                }
                
            }
            this.serviceId = this.proData[this.selIdx].serviceId
            this.calSpend()
            //流程查询
            this.procedure()
        }
    },
    filters: {
        capitalize: function (value) {
            return (value+ '').replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g,'$1,'); 
        }
    },
    computed: {
        ...mapState(["userinfo",'pool','requestid','loading']),
        rowSelection() {
            return {
                type: "radio",
                //hideDefaultSelections: true,
                onChange: (selectedRowKeys) => {
                    this.selectItem(selectedRowKeys - 1)
                },
                getCheckboxProps: record => ({
                    props: {
                        defaultChecked: record.id == this.defaultCheckedId, 
                        disabled: record.id == this.firstPro || record.id == this.secondPro || record.id == this.thirdPro, 
                    },
                }),
            }
        }
    },
    created() {
        this.isDisabled = false
        this.isPayDisabled = true
        this.getAllProducts()
    }
}
</script>
<style lang="less">
@import "~@/assets/style/var.less";
#custom-order{
.table-pos {
    position: relative;
    bottom: 33px;
    left: 140px;
    width: calc(100% - 140px);
}

.jtTabel{
    table tbody tr {
        border-bottom-color: #fff;
    }
    table tbody tr:hover>td{
        background: #F5F8FF!important;
        button{
            color:#337DFF;
            .anticon{
                color:#337DFF;
            }
        }
        a{
            color:#337DFF!important;
            .anticon{
                color:#337DFF; 
            }
        }
    }
    tbody>tr>td{
        padding:10px 0 20px 11px!important;
        font-size: @jt-font-size-sm!important;
        color:@jt-color-text!important;
        border-bottom: 1px solid #E9EBEF;
        a{
            color:@jt-color-text!important;
            .anticon{
                color:@jt-color-text-secondary; 
            }
            span{
                height: 16px;
                line-height: 16px;
                margin-left:6px;
            }
        } 
    }
}

.col-empty {
    width: 60px;
}

.recharge-wrapper {
    position: absolute;
    top: 20px;
    right: 20px;
    text-align:right;
}

.use-term {
    margin: 0px 0px 0px 0px
}

.number_unit {
    margin: 10px;
}

#counter {
    display: inline-block;
    margin: 0px 0px 0px 20px
}
////////////////////////////////
#charge-div {
    height:32px;
}

#region-div {
    margin: 20px 0px 0px 0px;
    height: 32px;
}

.test-env-div {
     padding: 20px 0px 0px 0px;
     .jtTabel {
        thead>tr>th{
            background: #F4F5F7;
            height: 32px;
            line-height: 32px;
            padding:0px 0px 0px 10px!important;
            font-size: @jt-font-size-sm!important;
            color:@jt-color-text-strong!important;
            background: #F4F5F7;
            border-bottom: 0;
            .ant-table-header-column{
                display: inline-block!important;
                height: 22px!important;
                line-height: 22px!important;
                width: 100%!important;
                border-right: 1px solid #fff!important;
                margin-top: 5px!important;
            }
        }
        tbody > tr > td {
            padding: 6.5px 0 6.5px 11px!important;
        }
     }

}

.env-tips {
    margin: -30px 0px 0px 140px;
}

.counter-tips{
    margin: 0px 0px 0px 138px;
    
}

.tips-color {
    color: #999;
    font-size: @jt-font-size-sm;
}
.tips-color-year {
    color: #ccc;
}
.tips-color-error {
    color: red
}
.item-label {
    height: 32px;
    width: 120px;
    line-height: 32px;
    display: inline-block;
    vertical-align: top;
    font-weight:400;
}

.env-word {
    height: 32px;
    width: 120px;
    line-height: 32px;
    font-weight:400;
}

#region-ul {
    display: inline-block;
    // margin: 0px 0px 0px 20px; 
    .region-button{
        margin-right: 10px;
        width:240px;
        height:32px;
        border: 1px solid #99beff;
        font-size: 12px;
        color: #333;
        text-align: left;
    }
    .region-icon{
        color:#999;
        float: right;
        margin-top: 2px;
    }
}
.region-radio {
    width: 120px;
    text-align: center;
}
#charge-ul {
    display: inline-block;
    margin: 0px 0px 0px 20px; 
}

#order_detail {
    position: absolute;
    bottom: 80px;
    left: 0;
    right: 0;
    top: 0;
    background: #eff1f4;
    overflow: auto;
    min-width: 1000px;
}

.header {
    height: 60px;
    line-height: 60px;
    background: @jt-color-white;
    font-size: 16px;
    font-weight: 600;
    color: rgba(3,17,41,1);
    padding-left: 19px;
}

#addtion {
    height:160px;
    background: #ffffff;
    padding: 20px 0px 20px 30px;
    margin: 20px;
    border-radius:2px;
    .poolMapping {
        font-size: 12px;
        color:#BBB;
        margin: 0;
    }
    .poolTableLink {
        color: #337DFF;
        cursor: pointer;
    }
}

#env {
    min-height:200px;
    background: #ffffff;
    margin:20px 20px 40px 20px;
    padding: 0px 30px 20px 30px;
    border-radius:2px;
}

.order-foot{
    position: absolute;
    height:80px;
    bottom:0px;
    left: 0;
    right: 0;
}

.foot-margin {
    margin: 0 auto;
}

.order-foot .fixed-bot-panel{
    background: #FFF;
    width: 100%;
    margin: 0 auto;
    z-index: 103;
    bottom: 0;
    position: absolute;
    box-shadow:0px -3px 10px 0px rgba(0,0,0,0.1);
    height: 80px;
    padding: 10px 20px;
}

.total{
    font-size: 26px;
    color: #F04134;
}

.btn-wrapper{
    //padding-top:auto, 20px;
    position: absolute;
    right:  32px;
    top: 26px;
}

.fee-wrapper{
    color: #555555;
    font-size: @jt-font-size-sm;
}

#cost{
    font-size: @jt-font-size-lg;
    color: @jt-color-highlight; 
}

.p1 {
    font-size: @jt-font-size-lger;
}
.p2 {
    font-size: @jt-font-size-lg;
    color: #031129;
}
.p3 {
    font-size: @jt-font-size-base;
}
.p4 {
    font-size: @jt-font-size-sm;
    color:@jt-color-text-strong
}
////////////ordier-config////////////////
.grey-config {
    height: auto;
    width: 100%;
    min-width: 1100px;
    padding: 10px 20px 20px 20px;
    background: #eff1f4;
    font-size: 12px;
}

.bt-icon {
    width:17px;
    height:18px;
    background:rgba(255,255,255,1);
    border-radius:1px;
    border:1px solid rgba(217,217,217,1);
    padding:0px;
}

.order-info {
    background:rgba(255,255,255,1);
    margin-top: 5px;
    padding: 20px 20px 0px 20px;
    .config {
        height:20px;
        line-height:20px;
        margin-bottom:10px;
        .config-name {
            color:#999
        }
    }
    thead>tr>th{
        height: 40px;
        line-height: 40px;
        padding:0px 0px 0px 10px!important;
        font-size: @jt-font-size-sm!important;
        color:@jt-color-text-strong!important;
        background: #F4F5F7;
        border-bottom: 0;
        .ant-table-header-column{
            display: inline-block!important;
            height: 30px!important;
            line-height: 30px!important;
            width: 100%!important;
            border-right: 1px solid #fff!important;
            margin-top: 5px!important;
        }
    }
}

.cost-info {
    background:rgba(255,255,255,1);
    margin-top: 20px;
    padding: 20px 20px 40px 20px;
    position: relative;
    height: 117px;
}
}
.region-menu {
    max-height: 450px;
    overflow: auto;
    padding-left: 8px;
    padding-bottom: 20px;
    padding-top: 10px;
    .ant-dropdown-menu-item {
        .radio-div:not(:first-of-type) {
            margin-top: 10px;
        }
    }
    .ant-radio-button-wrapper:not(:first-child) {
        margin-left: 10px;
    }
    .ant-radio-button-wrapper {
        width: 130px;
        text-align: center;
    }
}
.ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled) {
    background: #E1ECFF;
}
.ant-dropdown-menu-item:hover, .ant-dropdown-menu-submenu-title:hover {
    background: none;
}
.region-name {
    font-size: 14px;
    color: #333;
}
.square {
    width: 120px;
    height: 32px;
    line-height: 30px;
    display: inline-block;
    margin: 0px;
    text-align: center;
    font-size: @jt-font-size-sm;
}

</style>