<template>
    <div class="p">
        <!-- <div class="grey-block"></div> -->
        <div class="my-robot">
            <jt-row :gutter="16">
                <jt-col class="bgr-font-color bgr-font-size knowledge">知识概况</jt-col>
            </jt-row>
            <jt-row :gutter="16" style="margin-top:16px">
                <jt-col :span='7'>
                    <jt-row>
                        <jt-col :span="6">
                            <img src="@/assets/image/icon-qa.png" class="icon-attr" />
                        </jt-col>

                        <jt-col :span="18">
                            <p class="common-font-color num-font-size" style="margin:0px">{{qaaccount}}</p>
                            <p class="small-font-size gray-font-color">问答对数量</p>
                        </jt-col>
                    </jt-row>
                </jt-col>
                <jt-col  :span="1" >
                    <div style="background-color: #E9EBEF; height:72px; width:1px; margin-left:43px"></div>
                </jt-col>
                <jt-col :span='7'>
                    <jt-row>
                        <jt-col :span="7">
                            <img
                                src="@/assets/image/icon-leader.png"
                                class="icon-attr"
                                style="margin-left:9px"
                            />
                        </jt-col>

                        <jt-col :span="17">
                            <p class="common-font-color num-font-size" style="margin:0px">{{leaderaccount}}</p>
                            <p class="small-font-size gray-font-color">引导式对话意图数量</p>
                        </jt-col>
                    </jt-row>
                </jt-col>

                <jt-col  :span="1" >
                    <div style="background-color: #E9EBEF; height:72px; width:1px; margin-left:43px"></div>
                </jt-col>

                <jt-col :span='7'>
                    <jt-row>
                        <jt-col :span="7">
                            <img src="@/assets/image/icon-module.png" class="icon-attr" style="margin-left:9px"/>
                        </jt-col>

                        <jt-col :span="17">
                            <p class="common-font-color num-font-size" style="margin:0px">{{moduleaccount}}</p>
                            <p class="small-font-size gray-font-color">场景式对话意图数量</p>
                        </jt-col>
                    </jt-row>
                </jt-col>
            </jt-row>
        </div>
        <!-- <div class="grey-block"></div> -->
        <div class="platform-index" style="display : flex;flex_flow : row">
            <div class="my-serve">
                <jt-row class="wrapper-row">
                    <jt-col :span="7">
                        <span class='hot-issue'>热门问题TOP10</span>
                    </jt-col>
                    <jt-col :span='17'>
                        <jt-row type="flex" justify="end">
                            <jt-col :span="9" class="tag-item1">
                                <jt-button-group>
                                    <jt-button size='small' @click="option('day')" :class="{'btn-click': picker == 'day'}">昨日</jt-button>
                                    <jt-button size='small' @click="option('week')" :class="{'btn-click': picker == 'week'}">本周</jt-button>
                                    <jt-button size='small' @click="option('month')" :class="{'btn-click': picker == 'month'}">本月</jt-button>
                                </jt-button-group>
                            </jt-col>
                            <jt-col :span="15">
                                <jt-range-picker class='knowledge-date' @change="onChange" :value="value2" :format='dateFormat'>
                                    <jt-icon slot="suffixIcon" type="calendar" />
                                </jt-range-picker>
                            </jt-col>
                        </jt-row>
                    </jt-col>
                </jt-row>
                <jt-table class="customer-table" v-show="userfangwen"  :dataSource="tableData" :columns='tableColumns' rowKey='rank' :pagination="false">
                    <!-- <span slot="percent" slot-scope="text">
                        <jt-progress :percent='text' :strokeWidth='6' :format="percent => `${percent}%`" strokeColor='#73A0FA' ></jt-progress>
                    </span> -->
                    <span slot="knowledgename" slot-scope="text">
                        <jt-tooltip placement="topLeft">
                            <template slot="title">
                                <span>{{text}}</span>
                            </template>
                            <a style="max-width: 230px;color: #555555;">{{text}}</a>
                        </jt-tooltip>
                    </span>
                    <div slot="percent" slot-scope="text" style="display:flex">
                        <div style="color:#555555;width:40px;text-align:right">{{text+'%'}}</div>
                        <jt-progress :percent='text' :strokeWidth='6' :show-info="false" strokeColor='#73A0FA' ></jt-progress>
                    </div>
                </jt-table>
                <div class="table-type-3" v-show="!userfangwen">
                    <jt-empty :image="emptyImage" :imageStyle="{ margin:'168px auto auto auto',width:'64px',height:'40px',color:'#999999'}">
                        <div class="emptyDescriptS" slot="description" style="margin-top:7px">
                            <p class="emptyDescript" style="color:#bfbfbf;font-size:12px;margin-left:3px;">暂无数据</p>
                        </div>
                    </jt-empty>
                </div>             
            </div>
            <div class="grey-block"></div>
            <Userquestion></Userquestion>
        </div>
    </div>
</template>
<style>
.customer-table .ant-table-tbody > tr > td {
    padding: 7px 16px;
    border: none
}
.customer-table .ant-table-thead > tr > th {
    padding: 7px 16px!important;
    background: none;
}
.customer-table .ant-progress-inner {
    background: none;
}
.customer-table .ant-table-thead > tr.ant-table-row-hover:not(.ant-table-expanded-row):not(.ant-table-row-selected) > td, .ant-table-tbody > tr.ant-table-row-hover:not(.ant-table-expanded-row):not(.ant-table-row-selected) > td, .ant-table-thead > tr:hover:not(.ant-table-expanded-row):not(.ant-table-row-selected) > td, .ant-table-tbody > tr:hover:not(.ant-table-expanded-row):not(.ant-table-row-selected) > td {
    background: #F5F8FF;
}
/* progress, 100%时文字颜色修正 */
.ant-progress-status-success .ant-progress-text{
    color: #999999;
}
</style>
<style lang="less" scoped>
@import "~@/assets/style/var.less";
.icon-attr {
    width: 64px;
    height: 64px;
}

.row-len {
    padding-left: 20px;
    padding-right: 20px;
}
.gray-line {
    background-color: #e9ebef;
    height: 1px;
}
.grey-block {
    height: 20px;
    background-color: rgba(239, 241, 244, 1);
}
.num-style {
    margin-top: 22px;
    margin-bottom: 0px;
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
    color: #337dff;
}

.gray-font-color {
    color: #999999;
}

.bt-top {
    width: 80px;
    height: 32px;
}

.main-header {
    height: 58px;
    background-color: #fff;
    padding-left: 20px;
    line-height: 58px;
    font-weight: 500;
    font-size: @jt-font-size-lg;
    color: @jt-color-text-strong;
}

.my-robot {
    height: 164px;
    background: #ffffff;
    padding: 0px 0px 0px 0px;
    margin-left: 0px;
    margin-right: 0px;
    margin-top: 0px;
    margin-bottom: 0px;
    // width:1096px;
    padding:20px 20px 36px 20px;
    .knowledge {
        font-size:16px;
        font-family:PingFangSC-Medium,PingFang SC;
        font-weight:600;
        color:rgba(51,51,51,1);
    }
}

.my-serve {
    height: 444px;
    background: #ffffff;
    padding: 20px 2% 31px 2%;
    margin-top: 20px;
    margin-bottom: 40px;
    flex:1;
    // width:556px;
    .wrapper-row {
        .ant-btn-group {
        .ant-btn {
            height:32px;
            width:42px;

        }}
        .tag-item1 {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-right: 0px;
            .el-button--primary {
                color: #555555;
                background-color: #FFFFFF;
                border-color: #D9D9D9;
            }
            .el-button--primary:hover {
                color: #555555
            }
            .btn-click {
                color: #337DFF;
                background-color: rgba(234,242,255,1);
                border-color: rgba(153,190,255,1);
                z-index: 2;
            }
            .el-button--mini, .el-button--mini.is-round {
                padding: 9px 7px
            }
            .ant-btn {
                width: 36px;
            }
            .ant-btn-sm {
                padding: 2px 4px;
            }
        }
        .knowledge-date{
            min-width: 172px;
        }
        .ant-calendar-range-picker-input {
            width:42%;
        }
        .ant-calendar-picker-clear, .ant-calendar-picker-icon {
            margin-right: -5px;
        }
        .tag-item2 {
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 250px;
            margin-right: 0px;
        }
        .hot-issue {
            font-size:16px;
            font-family:PingFangSC-Medium,PingFang SC;
            font-weight:600;
            color:rgba(51,51,51,1);
        }
    }
    .customer-table {
        margin-top: 24px;
    }
}
.sector {
    margin-left: 20px;
}
.customColor{
    color:#73A0FA;
}
.ant-progress-line {
    width: 73%;
    margin-left: 8px;
}
</style>

<script>
import {Empty} from "ant-design-vue";
import {mapActions} from 'vuex';
import Vue from 'vue';
import * as Api from '@/utils/http.js';
Vue.prototype.$api = Api;

import moment from 'moment';

import Userquestion from './Userquestion'
Date.prototype.format = function (fmt) {
    const o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (const k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}
export default {
    name: "PlatfromIndex",
    components: {
        Userquestion,
        'jt-empty':Empty,
    },
    methods: {
        ...mapActions({
            top10Get: "shujutongji/top10Get",
            qaGet:"shujutongji/qaGet",
            leadmoduleGet:"shujutongji/leadmoduleGet"
        }),
        moment,
        onChange(date, dateString){
            this.value2 = date;
            const param = [];
            const startDate = dateString[0].replace(new RegExp('/','gm'),'-')
            const endDate = dateString[1].replace(new RegExp('/','gm'),'-');
            param.push(startDate);
            param.push(endDate);
            // console.log("qqqqq"+param)
            // this.fangwenGet(param).then(res =>{
            //     this.initPage();
            //     console.log(dateString);
            //     // if (dateString[0] == dateString[1] ){

            //     //     this.tablefangwenheng=["00:00","01:00", "02:00", "03:00", "04:00", "05:00", "06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00","14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:59"]
            //     //     console.log("///////////")
            //     // }
            //     // this.myEcharts();

            //     // this.getCurrentTime();
            //     // this.option('day');
            // })
            // this.leadmoduleGet().then(res =>{
            //     this.qaGet().then(res =>{
            //         this.top10Get(param).then(res =>{
            //             this.initPage();
            //             this.picker = ''
            //             console.log("333333")
            //             // this.option('day')
            //             // this.option(this.picker)
            //         })
            //     })
            // })
            this.leadmoduleGet();
            this.qaGet();
            this.top10Get(param).then(res =>{
                if(res.errno=='999'){
                    this.showCatchNotification('查询失败!','系统繁忙，请稍后再试')
                }
                this.initPage();
                this.picker = ''
            })
        },
        initPage() {
            console.log("fffff"+this.$store.state.shujutongji.table1);
            // this.top10Get();
            this.tableData = this.$store.state.shujutongji.table1;
            if (this.tableData.length>0){
                this.userfangwen = true
            }else{
                this.userfangwen = false
            }
            // setting breadcrumb of robot home
            // this.$store.commit(
            //     'setBreadcrumb',
            //     [
            //         {breadcrumbName: this.$store.state.envInfo.envName, breadcrumbPath: this.$store.state.fromPath},
            //         {breadcrumbName: "数据统计"}
            //     ]
            // );
            // this.qaGet();
            
            // console.log("gggg"+this.$store.state.shujutongji.tableqa)
        },
        test(){
            console.log('33', this.value2)
        },
        showCatchNotification(title, content) {
            this.$notification.open({
                message: title,
                description: "失败原因：" + content,
                icon: (<jt-icon type="exclamation-circle" theme="filled" style="color:#F04134"/>),
                duration: 0
            });
        },
        getPreMonth () {
            const daysInMonth = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
            const currentDate = new Date()
            let strYear = currentDate.getFullYear()
            let strDay = currentDate.getDate()
            let strMonth = currentDate.getMonth()
            if (((strYear % 4) === 0) && ((strYear % 100) !== 0) || ((strYear % 400) === 0)) {
                daysInMonth[2] = 29
            }
            if (strMonth === 0) {
                strYear -= 1
                strMonth = 12
            }
            strDay = Math.min(strDay, daysInMonth[strMonth])
            if (strMonth < 10) {
                strMonth = '0' + strMonth
            }
            if (strDay < 10) {
                strDay = '0' + strDay
            }
            const dateStr = strYear + '-' + strMonth + '-' + strDay
            const startDate = new Date(dateStr)
            return startDate
        },
        option(picker) {
            this.picker = picker;
            const end = new Date();
            const start = new Date();
            // this.value2 = new Date()
            this.value2 = [];
            let starttime = '';
            let endtime = '';
            // this.weekX = [];
            if (picker === "day") {
                // this.tablefangwenheng=["00:00","01:00", "02:00", "03:00", "04:00", "05:00", "06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00","14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:59"]
                starttime = new Date(start.setTime(start.getTime() - 3600 * 1000 * 24 * 1)).format("yyyy/MM/dd");
                this.value2.push(
                    moment(starttime,this.dateFormat)
                );
                endtime= new Date(start.setTime(start.getTime())).format("yyyy/MM/dd")
                this.value2.push(
                    moment(endtime,this.dateFormat)
                );
                // this.value2.push(moment(new Date(end.setTime(end.getTime())).format("yyyy/MM/dd"),this.dateFormat));

            }
            if (picker === "week") {
                starttime = new Date(start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)).format("yyyy/MM/dd")
                this.value2.push(
                    moment(starttime,this.dateFormat)
                );
                endtime = new Date(end.setTime(end.getTime()-3600 * 1000 * 24 * 1)).format("yyyy/MM/dd")
                this.value2.push(moment(endtime,this.dateFormat));
            }
            if (picker === "month") {
                const day = this.getPreMonth();
                starttime = new Date(day.getFullYear(),day.getMonth(),day.getDate()).format("yyyy/MM/dd")
                this.value2.push(
                    moment(starttime,this.dateFormat)
                );
                endtime = new Date(end.setTime(end.getTime() - 3600 * 1000 * 24 * 1)).format("yyyy/MM/dd")
                this.value2.push(
                    moment(endtime,this.dateFormat)
                );
            // this.picker = picker
            // const end = new Date();
            // const start = new Date();
            // // this.value2 = new Date()
            // this.value2 = [];
            // this.weekX = [];
            // if (picker === "day") {
            //     this.value2.push(
            //         moment(new Date(
            //             start.setTime(start.getTime() - 3600 * 1000 * 24 * 1)
            //         ).format("yyyy/MM/dd"),this.dateFormat)
            //     );
            //     this.value2.push(moment(new Date(end.setTime(end.getTime())).format("yyyy/MM/dd"),this.dateFormat));
            // }
            // if (picker === "week") {
            //     this.value2.push(
            //         moment(new Date(
            //             start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            //         ).format("yyyy/MM/dd"),this.dateFormat)
            //     );
            //     this.value2.push(moment(new Date(end.setTime(end.getTime())).format("yyyy/MM/dd"),this.dateFormat));
            //     for (let i = 0; i < 7; i++) {
            //         this.weekX.push(
            //             new Date(start.getTime() + 3600 * 1000 * 24 * i)
            //                 .toJSON()
            //                 .substr(0, 19)
            //                 .replace("T", " ")
            //         );
            //     }
            //     this.myEcharts();
            // }
            // if (picker === "month") {
            //     this.value2.push(
            //         moment(new Date(
            //             start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            //         ).format("yyyy/MM/dd"),this.dateFormat)
            //     );
            //     this.value2.push(moment(new Date(end.setTime(end.getTime())).format("yyyy/MM/dd"),this.dateFormat));
            //     for (let i = 0; i < 7; i++) {
            //         this.weekX.push(
            //             new Date(start.getTime() + 3600 * 1000 * 24 * 5 * i)
            //                 .toJSON()
            //                 .substr(0, 19)
            //                 .replace("T", " ")
            //         );
            //     }
            //     this.myEcharts();
            //     console.log("11", this.weekX);
            }
            const param = [];
            // console.log(this.value2)
            const startDate = starttime.replace(new RegExp('/','gm'),'-')
            const endDate = endtime.replace(new RegExp('/','gm'),'-');
            param.push(startDate);
            param.push(endDate);
            // picker.$emit("pick", [start, end]);
            // this.fangwenGet(param).then(res =>{
            //     this.initPage();
            //     // this.getCurrentTime();
            //     // this.option('day');
            //     // this.myEcharts();
            // })
            this.leadmoduleGet();
            this.qaGet();
            this.top10Get(param).then(() =>{
                this.initPage();
            })
            // picker.$emit("pick", [start, end]);
        },
        gotoEnvRobotList() {
            this.$router.push({ path: "/home/testEnv", query: {} });
        },
        gotoProRobotList() {
            this.$router.push({ path: "/home/productionEnv", query: {} });
        },
        clickMenu() {
            //alert("aaa" + idx)
        },


    },
    computed:{
        qaaccount(){
            return this.$store.state.shujutongji.tableqa;
        },
        leaderaccount() {
            return this.$store.state.shujutongji.tablelead;
        },
        moduleaccount(){
            return this.$store.state.shujutongji.tablemodule;
        }
    },
    mounted() {
        // setting breadcrumb of robot home
        this.$store.commit(
            'setBreadcrumb',
            [
                {breadcrumbName: this.$store.state.envInfo.envName, breadcrumbPath: this.$store.state.fromPath},
                {breadcrumbName: "数据统计"}
            ]
        );
        // const b = document.querySelector(".ant-calendar-range-picker-separator");
        // console.log('sdsdsd',b)
        // if(b){
        //     b.innerHTML = '<i class="anticon anticon-swap-right" aria-label="图标: swap-right"><svg viewBox="0 0 1024 1024" data-icon="swap-right" width="1em" height="1em" fill="currentColor" aria-hidden="true" focusable="false" class=""><path d="M873.1 596.2l-164-208A32 32 0 0 0 684 376h-64.8c-6.7 0-10.4 7.7-6.3 13l144.3 183H152c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h695.9c26.8 0 41.7-30.8 25.2-51.8z"></path></svg></i>';
        // }
        const b = document.getElementsByClassName("ant-calendar-range-picker-separator");
        if(b.length){
            for(let i=0;i<b.length;i++){
                b[i].innerHTML = '<i class="anticon anticon-swap-right" aria-label="图标: swap-right"><svg viewBox="0 0 1024 1024" data-icon="swap-right" width="1em" height="1em" fill="currentColor" aria-hidden="true" focusable="false" class=""><path d="M873.1 596.2l-164-208A32 32 0 0 0 684 376h-64.8c-6.7 0-10.4 7.7-6.3 13l144.3 183H152c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h695.9c26.8 0 41.7-30.8 25.2-51.8z"></path></svg></i>';
            }
        }
        // this.leadmoduleGet().then(res =>{
        //     console.log("1112222")
        //     this.qaGet().then(res =>{
        //         console.log("111111")
        //         this.top10Get().then(res =>{
        //             console.log("2222222")
        //             this.initPage();
        //             console.log("333333")
        //             this.option('day')
        //             // this.option(this.picker)
        //         })
        //     })
        // })

        this.option('day')
    },
    // data: () => ({
    data() {
        return{
            dateFormat: 'YYYY/MM/DD',
            customColor: '',
            picker: 'day',
            resp: {
                testEnv: {
                    useTimes: 100,
                    leftTimes: 200,
                    qpsLimit: 10,
                    robotNum: 5
                },
                proEnv: {
                    useTimes: 5500,
                    leftTimes: 4500,
                    qpsAvg: 10,
                    qpsPeak: 25,
                    qpsLimit: 25,
                    rototNum: 1
                }
            },
            // tabledata: '',
            value2: [],
            weekX: [],
            // qaaccount: "1234345",
            // leaderaccount: "34789",
            // moduleaccount: "54345",
            // qaaccount: 0,
            // leaderaccount: 0,
            // moduleaccount: 0,
            // problemnum:"12345",
            num:'',
            tableColumns: [
                {title: '排名', dataIndex: 'rank', key: 'rank',width:4},
                {title: '知识名称', dataIndex: 'knowledgename', key: 'knowledgename', ellipsis:true,scopedSlots:{customRender:"knowledgename"},width:6},
                {title: '命中次数', dataIndex: 'numright', key: 'numright',width:6},
                {title: '占比', dataIndex: 'percent', key: 'percent', width:8,scopedSlots:{customRender: "percent"} ,},
            ],
            tableData:[],
            emptyImage: require("@/assets/image/nodata.png"),
            userfangwen:false,
            //tableData: this.$store.state.shujutongji.tableData,
            // tableData: [{
            //     rank:1,
            //     knowledgename: '知识名称',
            //     numright: '20',
            //     percent: 100,

            // },
            // {
            //     rank:   2,
            //     knowledgename: '知识名称',
            //     numright :'20',
            //     percent: 35,

            // },
            // {
            //     rank:   3,
            //     knowledgename: '知识名称',
            //     numright :'20',
            //     percent: 30,

            // },
            // {
            //     rank:   4,
            //     knowledgename: '知识名称',
            //     numright :'10',
            //     percent: 28,
            // },
            // {
            //     rank:   5,
            //     knowledgename: '知识名称',
            //     numright :'10',
            //     percent: 26,
            // },
            // {
            //     rank:   6,
            //     knowledgename: '知识名称',
            //     numright :'10',
            //     percent: 20,
            // },
            // {
            //     rank:   7,
            //     knowledgename: '知识名称',
            //     numright :'10',
            //     percent: 19,
            // },
            // {
            //     rank:   8,
            //     knowledgename: '知识名称',
            //     numright :'10',
            //     percent: 17,
            // },
            // {
            //     rank:   9,
            //     knowledgename: '知识名称',
            //     numright :'10',
            //     percent: 14,
            // },
            // {
            //     rank:   10,
            //     knowledgename: '知识名称',
            //     numright :'10',
            //     percent: 11,
            // }
            // ]

        }
    }
};
// this.$store.state.robotHome.name;
// import {mapActions,mapGetters,mapMutations} from 'vuex';
// import Vue from 'vue';
// import Api from '../utils/http.ts';
// Vue.prototype.$api = Api;
</script>

