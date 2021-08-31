<template>
    <div class="my-serve sector">
        <jt-row class="wrapper-row">
            <jt-col :span="8">
                <span class='hot-issue'>用户问题类型分布</span>
            </jt-col>
            <jt-col :span='16'>
                <jt-row type="flex" justify="end">
                    <jt-col :span="10" class="tag-item1">
                        <jt-button-group>
                            <jt-button size='small' @click="option('day')" :class="{'btn-click': picker == 'day'}">昨日</jt-button>
                            <jt-button size='small' @click="option('week')" :class="{'btn-click': picker == 'week'}">本周</jt-button>
                            <jt-button size='small' @click="option('month')" :class="{'btn-click': picker == 'month'}">本月</jt-button>
                        </jt-button-group>
                    </jt-col>
                    <jt-col :span="14">
                        <jt-range-picker class='knowledge-date' @change="onChange" :value="value2" :format='dateFormat'>
                            <jt-icon slot="suffixIcon" type="calendar" />
                        </jt-range-picker>
                    </jt-col>
                </jt-row>
            </jt-col>
        </jt-row>
        <div id="main3" v-show="userfangwen" style="width:28vw;min-width: 356px;height:300px;background:rgba(255,255,255,1);margin-top:80px;margin-left:44px;"></div> 
        <div class="table-type-3" v-show="!userfangwen">
            <jt-empty :image="emptyImage" :imageStyle="{ margin:'168px auto auto auto',width:'64px',height:'40px',color:'#999999'}">
                <div class="emptyDescriptS" slot="description" style="margin-top:7px">
                    <p class="emptyDescript" style="color:#bfbfbf;font-size:12px;margin-left:3px;">暂无数据</p>
                </div>
            </jt-empty>
        </div> 
    </div>
</template>
<style>
    .customer-table  .el-table__body tr:hover>td {
        background:rgba(245,248,255,1);
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
    font-weight: 600;
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
    overflow: hidden;
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
            min-width: 180px;
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

</style>

<script>
import {Empty} from "ant-design-vue";
import {mapActions} from 'vuex';
import Vue from 'vue';
import * as Api from '@/utils/http.js';
Vue.prototype.$api = Api;

import moment from 'moment';
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
        'jt-empty':Empty,
    },
    methods: {
        ...mapActions({
            distributionGet: "shujutongji/distributionGet"
        }),
        onChange(date, dateString){
            this.picker = '';
            this.value2 = date;
            console.log(date, dateString);
            console.log(this.$store.state.shujutongji.tableData);
            const param = [];
            const startDate = dateString[0].replace(new RegExp('/','gm'),'-')
            const endDate = dateString[1].replace(new RegExp('/','gm'),'-');
            param.push(startDate);
            param.push(endDate);

            this.distributionGet(param).then(() =>{
                this.initPage();
                // this.picker = ''
                // console.log(dateString);
                this.myEcharts();

                // this.getCurrentTime();
                // this.option('day');
            })

        },
        initPage() {
            this.tabledistri = this.$store.state.shujutongji.tabledistri;
            this.num = this.$store.state.shujutongji.tablenum;
            if (this.num==0){
                this.userfangwen = false
            }else{
                this.userfangwen = true
                // this.myEcharts();
            }
            // console.log(this.$store.state.shujutongji.tabledistri);
            // console.log("gfgf"+this.$store.state.shujutongji.tabledistri);
            // this.distributionGet();

 
            // console.log(this.tabledistri)
        },
        moment,

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
            // const dateList = []
            const startDate = new Date(dateStr)
            return startDate
        },
        test(){
            console.log('33', this.value2)
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
            }
            const param = [];
            // console.log(this.value2)
            const startDate = starttime.replace(new RegExp('/','gm'),'-')
            const endDate = endtime.replace(new RegExp('/','gm'),'-');
            param.push(startDate);
            param.push(endDate);
            // picker.$emit("pick", [start, end]);
            this.distributionGet(param).then(() =>{
                this.initPage();
                // this.getCurrentTime();
                // this.option('day');
                this.myEcharts();
            })
        },
        // getCurrentTime() {
        //     const d = new Date();
        //     this.value2 = [];
        //     // d.setHours(0);
        //     // d.setMinutes(0);
        //     // d.setSeconds(0);
        //     this.value2.push(new Date(d));
        //     this.value2.push(new Date(d).getTime() - 3600 * 1000 * 24);
        // },
        gotoEnvRobotList() {
            this.$router.push({ path: "/home/testEnv", query: {} });
        },
        gotoProRobotList() {
            this.$router.push({ path: "/home/productionEnv", query: {} });
        },
        clickMenu() {
            //alert("aaa" + idx)
        },
        myEcharts() {
            // 基于准备好的dom，初始化echarts实例
            // console.log("1111", this.weekX);
            const myChart = this.$echarts.init(document.getElementById("main3"));
            window.onresize = function() {
                myChart.resize();
            };
            const option = {
                color:['#5B8FF9','#5AD8A6','#5D7092'],   //环形颜色
                title:{
                    text:'问题总数',
                    subtext:this.num,
                    left:'30%',
                    top:"30%",
                    // top:'53%',
                    center: ['40%', '40%'],
                    padding:[24,0],
                    textStyle:{
                        color:'#999999',
                        fontSize:12,
                        align:'center'
                    },
                    subtextStyle:{
                        color:'#031129',
                        fontSize:18,
                        align:'center'
                    },
                    textAlign: 'center'

                },


                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b}: {c} ({d}%)',
                    // show:false,
                },
                // legend: {
                //     orient: 'vertical',
                //     left: 10,
                //     data: ['引导式对话', '场景式对话', '问答']
                    
                // },
                legend: [
                    {
                        orient: 'vertical',
                        icon: "circle",
                        x: "65%",
                        y: "30%",
                        selectedMode:false,
                        // padding:['189px','115px','237px','363px'],
                        data: ['引导式对话', '场景式对话', '问答'],
                        textStyle: {
                            color: "#666",
                            fontSize: 12,
                            padding: [2, 0, 0, 0],
                        },
                        itemWidth: 8,  // 设置宽度
                        itemHeight: 8, // 设置高度
                        itemGap: 16, // 设置间距
                        textAlign: 'center',
                    },
                    {
                        selectedMode:false,
                        orient: 'vertical',
                        icon: "none",
                        x: "83%",
                        y: "30%",
                        data: ['引导式对话', '场景式对话', '问答'],
                        formatter: function(name) {
                            const oa = option.series[0].data;
                            const num = oa[0].value + oa[1].value + oa[2].value;
                            for (let i = 0; i < option.series[0].data.length; i++) {
                                
                                if (name == oa[i].name) {
                                    let m=0;
                                    m = (oa[i].value / num * 100).toFixed(1) + "%";
                                    return m;
                                }
                            }
                        },
                        textStyle: {
                            color: "#555555",
                            fontFamily: "Roboto",
                            fontWeight: "bold",
                            fontSize: 12,
                            padding: [2, 0, 0, 0],
                            fontweight:400,
                            lineheight:18,
                            textAlign: 'right',
                        },
                        itemWidth: 8,  // 设置宽度
                        itemHeight: 8, // 设置高度
                        itemGap: 16, // 设置间距
                        textAlign: 'right',

                    }],                
                series: [
                    {
                        name: '类型分布',
                        type: 'pie',
                        radius: ['50%', '70%'],
                        center: ['30%', '40%'],
                        avoidLabelOverlap: false,
                        label: {
                            show: false,
                            position: 'center',

                        },
                        emphasis: {
                            label: {
                                show: false,
                                fontSize: '30',
                                fontWeight: 'bold'
                            }
                        },
                        labelLine: {
                            show: false
                        },
                        // console.log("asdfee"+this.tabledistri),
                        data:this.tabledistri,
                        hoverAnimation:false,
                        // data:this.$store.state.shujutongji.tabledistri
                        // data: [
                        //     {value: 335, name: '引导式对话'},
                        //     {value: 310, name: '场景式对话'},
                        //     {value: 234, name: '问答'},
                        // ]

                    }
                ]

            };
            // 使用刚指定的配置项和数据显示图表。
            myChart.setOption(option);
            
        }
    },
    mounted() {
        const b = document.getElementsByClassName("ant-calendar-range-picker-separator");
        if(b.length){
            for(let i=0;i<b.length;i++){
                b[i].innerHTML = '<i class="anticon anticon-swap-right" aria-label="图标: swap-right"><svg viewBox="0 0 1024 1024" data-icon="swap-right" width="1em" height="1em" fill="currentColor" aria-hidden="true" focusable="false" class=""><path d="M873.1 596.2l-164-208A32 32 0 0 0 684 376h-64.8c-6.7 0-10.4 7.7-6.3 13l144.3 183H152c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h695.9c26.8 0 41.7-30.8 25.2-51.8z"></path></svg></i>';
            }
        }
        this.option('day');
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
            qaaccount: "1234345",
            leaderaccount: "34789",
            moduleaccount: "54345",
            // problemnum:"12345",
            // num:"123567",
            num:'' ,
            tabledistri:[],
            emptyImage: require("@/assets/image/nodata.png"),
            userfangwen:false,
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

        }}
};
</script>

