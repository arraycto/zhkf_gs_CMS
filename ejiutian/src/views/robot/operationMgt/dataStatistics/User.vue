<template>
    <div class="p" ref="p">
        <!-- <div class="grey-block"></div> -->
        <div class="sector sectorTraffic" >
            <jt-row class="wrapper-row" type="flex" justify="space-between">
                <jt-col :span="10">
                    <span class="traffic">访问量（PV）</span>
                    <!-- <span class='cumulative'>累计访问量</span>
                    <span class='cumulative-value'>{{typeACount}}</span>
                    <span class='cumulative'>昨日同比</span>
                    <span class='cumulative-value'>12%</span>
                    <span class="iconfont btn-icon">&#xe62b;</span>-->
                </jt-col>
                <jt-col :span="14">
                    <jt-row type="flex" justify="end">
                        <jt-col class="tag-item">
                            <jt-button-group>
                                <jt-button
                                    size="small"
                                    @click="option('day')"
                                    :class="{'btn-click': picker == 'day'}"
                                >昨日</jt-button>
                                <jt-button
                                    size="small"
                                    @click="option('week')"
                                    :class="{'btn-click': picker == 'week'}"
                                >本周</jt-button>
                                <jt-button
                                    size="small"
                                    @click="option('month')"
                                    :class="{'btn-click': picker == 'month'}"
                                >本月</jt-button>
                            </jt-button-group>
                        </jt-col>
                        <jt-col>
                            <jt-range-picker
                                @change="onChange"
                                :value="value2"
                                :format="dateFormat"
                                style="width: 200px;"
                            >
                                <jt-icon slot="suffixIcon" type="calendar" />
                            </jt-range-picker>
                        </jt-col>
                    </jt-row>
                </jt-col>
            </jt-row>
            <div
                id="main"
                v-show="userfangwen"
                style="width:100%;height:300px;background:rgba(255,255,255,1);margin:6px"
            ></div>
            <div class="table-type-3" v-show="!userfangwen" style="height:300px;">
                <jt-empty
                    :image="emptyImage"
                    :imageStyle="{ margin:'0 auto',width:'64px',height:'40px',color:'#999999'}"
                >
                    <div class="emptyDescriptS" slot="description" style="margin-top:7px">
                        <p
                            class="emptyDescript"
                            style="color:#bfbfbf;font-size:12px;margin-left:3px;"
                        >暂无数据</p>
                    </div>
                </jt-empty>
            </div>
        </div>
        <!-- <div class="grey-block"></div> -->
        <Fangkeliang></Fangkeliang>
    </div>
</template>

<style lang="less" scoped>
@import "~@/assets/style/var.less";
.icon-attr {
    width: 72px;
    height: 72px;
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

.my-serve {
    height: 378px;
    background: #ffffff;
    padding: 20px 0px 30px 0px;
    margin-left: 20px;
    margin-right: 20px;
    margin-top: 22px;
    margin-bottom: 0px;
}

.my-robot {
    height: 165px;
    background: #ffffff;
    padding: 20px;

    margin-left: 20px;
    margin-right: 20px;
    margin-top: 22px;
    margin-bottom: 0px;
}

.sector {
    background: #fff;
    margin-top: 20px;
    padding: 20px 20px 34px 20px;
    .wrapper-row {
        .ant-btn-group {
            .ant-btn {
                height: 32px;
                width: 42px;
            }
        }
        display: flex;
        .traffic {
            font-size: 16px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 600;
            color: rgba(51, 51, 51, 1);
        }
        .cumulative {
            font-size: 12px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: rgba(153, 153, 153, 1);
        }
        .cumulative-value {
            color: #337dff;
            font-size: 16px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            display: inline-block;
            margin-right: 10px;
        }
        .tag-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            // width: 300px;
            margin-right: 8px;
            .el-button--primary {
                color: #555555;
                background-color: #ffffff;
                border-color: #d9d9d9;
            }
            .el-button--primary:hover {
                color: #555555;
            }
            .btn-click {
                color: #337dff;
                background-color: rgba(234, 242, 255, 1);
                border-color: rgba(153, 190, 255, 1);
                z-index: 2;
            }
            .el-button--small,
            .el-button--small.is-round {
                padding: 9px 8px;
            }
        }
    }
}
.sectorTraffic {
    width:auto;
    margin-top: 4px;
}
.ant-empty {
    position: relative;
    top: 35%;
}
.ant-calendar-picker-clear, .ant-calendar-picker-icon {
    margin-right: -5px;
}
</style>

<script>
import { Empty } from "ant-design-vue";
import { mapActions } from "vuex";
import Vue from "vue";
import * as Api from "@/utils/http.js";
Vue.prototype.$api = Api;

import moment from "moment";
import Fangkeliang from "./Fangkeliang";
Date.prototype.format = function(fmt) {
    const o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        S: this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(
            RegExp.$1,
            (this.getFullYear() + "").substr(4 - RegExp.$1.length)
        );
    for (const k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(
                RegExp.$1,
                RegExp.$1.length == 1
                    ? o[k]
                    : ("00" + o[k]).substr(("" + o[k]).length)
            );
    return fmt;
};
export default {
    name: "PlatfromIndex",
    components: {
        Fangkeliang,
        "jt-empty": Empty
    },
    destroyed() {
        clearInterval(this.timer);
    },
    methods: {
        ...mapActions({
            fangwenGet: "shujutongji/fangwenGet"
        }),
        initPage() {

            // this.fangwenGet();
            this.tablefangwen = this.$store.state.shujutongji.tablefangwen;
            this.tablefangwenheng = this.$store.state.shujutongji.tablefangwenheng;
            if (this.tablefangwen.length > 0) {
                this.userfangwen = true;
            } else {
                this.userfangwen = false;
            }

            // console.log(this.tablefangwenheng)
            // console.log("eeeeeee")

            // console.log(this.$store.state.shujutongji.tablefangwen)
        },
        moment,
        onChange(date, dateString) {
            this.picker = '';
            this.value2 = date;
            const param = [];
            const startDate = dateString[0].replace(new RegExp("/", "gm"), "-");
            const endDate = dateString[1].replace(new RegExp("/", "gm"), "-");
            param.push(startDate);
            param.push(endDate);
            // console.log("qqqqq"+param)
            this.fangwenGet(param).then(() => {
                this.initPage();
                console.log(dateString);
                if (dateString[0] == dateString[1]) {
                    // this.picker = "day";
                    this.tablefangwenheng = [
                        "00:00",
                        "01:00",
                        "02:00",
                        "03:00",
                        "04:00",
                        "05:00",
                        "06:00",
                        "07:00",
                        "08:00",
                        "09:00",
                        "10:00",
                        "11:00",
                        "12:00",
                        "13:00",
                        "14:00",
                        "15:00",
                        "16:00",
                        "17:00",
                        "18:00",
                        "19:00",
                        "20:00",
                        "21:00",
                        "22:00",
                        "23:59"
                    ];
                    console.log("///////////");
                } else {
                    this.picker = "";
                }
                this.myEcharts();

                // this.getCurrentTime();
                // this.option('day');
            });
        },
        test() {
            // console.log('33', this.value2)
        },
        getPreMonth() {
            const daysInMonth = [
                0,
                31,
                28,
                31,
                30,
                31,
                30,
                31,
                31,
                30,
                31,
                30,
                31
            ];
            const currentDate = new Date();
            let strYear = currentDate.getFullYear();
            let strDay = currentDate.getDate();
            let strMonth = currentDate.getMonth();
            if (
                (strYear % 4 === 0) && (strYear % 100 !== 0) ||
                strYear % 400 === 0
            ) {
                daysInMonth[2] = 29;
            }
            if (strMonth === 0) {
                strYear -= 1;
                strMonth = 12;
            }
            strDay = Math.min(strDay, daysInMonth[strMonth]);
            if (strMonth < 10) {
                strMonth = "0" + strMonth;
            }
            if (strDay < 10) {
                strDay = "0" + strDay;
            }
            const dateStr = strYear + "-" + strMonth + "-" + strDay;
            // const dateList = [];
            const startDate = new Date(dateStr);
            return startDate;
        },

        option(picker) {
            
            this.picker = picker;
            const end = new Date();
            const start = new Date();
            // this.value2 = new Date()
            this.value2 = [];
            let starttime = "";
            let endtime = "";
            // this.weekX = [];
            if (picker === "day") {
                // this.tablefangwenheng=["00:00","01:00", "02:00", "03:00", "04:00", "05:00", "06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00","14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:59"]
                starttime = new Date(
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 1)
                ).format("yyyy/MM/dd");
                this.value2.push(moment(starttime, this.dateFormat));
                endtime = new Date(start.setTime(start.getTime())).format(
                    "yyyy/MM/dd"
                );
                this.value2.push(moment(endtime, this.dateFormat));
                // this.value2.push(moment(new Date(end.setTime(end.getTime())).format("yyyy/MM/dd"),this.dateFormat));
            }
            if (picker === "week") {
                starttime = new Date(
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
                ).format("yyyy/MM/dd");
                this.value2.push(moment(starttime, this.dateFormat));
                endtime = new Date(
                    end.setTime(end.getTime() - 3600 * 1000 * 24 * 1)
                ).format("yyyy/MM/dd");
                this.value2.push(moment(endtime, this.dateFormat));
            }
            if (picker === "month") {
                const day = this.getPreMonth();
                starttime = new Date(
                    day.getFullYear(),
                    day.getMonth(),
                    day.getDate()
                ).format("yyyy/MM/dd");
                this.value2.push(moment(starttime, this.dateFormat));
                endtime = new Date(
                    end.setTime(end.getTime() - 3600 * 1000 * 24 * 1)
                ).format("yyyy/MM/dd");
                this.value2.push(moment(endtime, this.dateFormat));
            }
            const param = [];
            // console.log(this.value2)
            const startDate = starttime.replace(new RegExp("/", "gm"), "-");
            const endDate = endtime.replace(new RegExp("/", "gm"), "-");
            param.push(startDate);
            param.push(endDate);
            // picker.$emit("pick", [start, end]);
            this.fangwenGet(param).then(() => {
                this.initPage();
                // this.getCurrentTime();
                // this.option('day');
                this.myEcharts();
            });
        },

        getCurrentTime() {
            const d = new Date();
            this.value2 = [];
            // d.setHours(0);
            // d.setMinutes(0);
            // d.setSeconds(0);
            this.value2.push(new Date(d));
            this.value2.push(new Date(d).getTime() - 3600 * 1000 * 24);
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
        myEcharts() {

            // 基于准备好的dom，初始化echarts实例
            const myChart = this.$echarts.init(document.getElementById("main"));
            // const myChart2 = this.$echarts.init(document.getElementById('main4'));
            const _p = this.$refs.p;
            // console.log(_p)
            // console.log(_p.getAttribute("width"), _p.clientWidth)

            this.timer = setInterval(() => {
                if (_p.getAttribute("width") !=  _p.clientWidth) {
                    // console.log(_p.getAttribute("width"), _p.clientWidth)
                    // console.log(_p.getAttribute("width"), _p.clientWidth)
                    // console.log(_p)
                   
                    // console.log(_p.getAttribute("width"), _p.clientWidth)
                    // window.onresize = myChart.resize;
                    myChart.resize();
                    // console.log(_p.getAttribute("width"), _p.clientWidth)
                    _p.setAttribute("width",  _p.clientWidth);
                    // console.log(_p.getAttribute("width"), _p.clientWidth)
                }
            }, 200);

            // let currentAxis = 0;
            // const num=0;
            const condition = this.picker;
            const day1 = Math.floor(parseInt(this.tablefangwenheng.length) / 6);
            console.log(day1);
            const length = this.tablefangwenheng.length;
            const option = {
                tooltip: {
                    transitionDuration: 0.4,
                    trigger: "axis",
                    showContent: false,
                    axisPointer: {
                        lineStyle: {
                            color: "#d9d9d9"
                        },
                        z: 1
                    },
                    confine: false
                    //renderMode:'html'
                },
                legend: {
                    left: "10%",
                    top: "94%",
                    itemHeight: 4,
                    itemWidth: 10,
                    textStyle: {
                        fontFamily: "PingFangSC-Regular,PingFang SC",
                        fontWeight: 400,
                        color: "rgba(0,0,0,0.65)"
                    },
                    data: [
                        {
                            name: "访问量",
                            icon: "rect"
                        }
                    ]
                },
                xAxis: {
                    type: "category",
                    boundaryGap: false,
                    num: 0,
                    // data: this.weekX,
                    data: this.tablefangwenheng,
                   
                    name: "时间段",
                    nameTextStyle: {
                        color: "rgba(0,0,0,0.45)"
                    },
                    axisLabel: {
                        interval: function(index) {
                            // console.log(index+":"+value)
                            if (condition == "day") {
                                if (index % 4 == 0 || index == 23) {
                                    return true;
                                } else {
                                    return false;
                                }
                            } else if (length > 1 && length <= 7) {
                                return true;
                            } else {
                                if (day1 <= 1) {
                                    if (day1<1&&index <= 6) {
                                        return true;
                                    }
                                    if (day1==1&&index%2==0) {
                                        return true
                                    }

                                } else {
                                    if (index % day1 == 0) {
                                        console.log('eeeeeeexxxx')
                                        console.log(day1);
                                        // console.log(index);
                                        //num = num+day1
                                        // this.num ++;
                                        return true;
                                    } else {
                                        return false;
                                    }
                                }
                            }
                        }
                    },
                    axisTick: {
                        lineStyle: {
                            // color: 'rgba(0,0,0,0.45)'
                            color: "#bfbfbf"
                        }
                    },
                    axisLine: {
                        lineStyle: {
                            // color: 'rgba(0,0,0,0.45)'
                            color: "#bfbfbf"
                        }
                    }
                },
                yAxis: {
                    type: "value",
                    name: "访问量(pv)",
                    nameLocation: "middle",
                    nameGap: 45,
                    nameTextStyle: {
                        color: "rgba(0,0,0,0.45)"
                    },
                    axisLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    },
                    splitLine: {
                        lineStyle: {
                            type: "dotted",
                            color: "#e9e9e9"
                        }
                    }
                },
                grid: {
                    // left:100,
                    right: 150
                },
                series: [
                    {
                        name: "访问量",
                        // data: [820, 932, 901, 934, 1290, 1330, 1320,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                        // data: this.tablefangwen,
                        data: this.$store.state.shujutongji.tablefangwen,
                        type: "line",
                        smooth: true,
                        symbol: "circle",
                        showSymbol: false,
                        areaStyle: {
                            color: "#337DFF",
                            opacity: 0.05
                        },
                        lineStyle: {
                            color: "#73A0FA"
                        },
                        emphasis: {
                            label: {
                                show: true,
                                position: "right",

                                distance: 8,
                                padding: [16, 16],
                                borderRadius: 3,
                                backgroundColor: "rgba(255,255,255,0.9)",
                                color: "rgba(0,0,0,0.65)",
                                fontFamily: "PingFangSC-Regular,PingFang SC",
                                fontWeight: 400,
                                lineHeight: 22,
                                shadowColor: "rgba(1,47,92,0.29)",
                                shadowBlur: 20,
                                shadowOffsetX: 0,
                                shadowOffsetY: 6,
                                formatter: function(params) {
                                    if (condition == "day") {
                                        const arr = params.name.split(":");
                                        let preTime = arr[0];
                                        let period = "";
                                        if (preTime != 23) {
                                            preTime = preTime + ":59";
                                            period =
                                                params.name + "-" + preTime;
                                        } else {
                                            preTime = preTime + ":00";
                                            period =
                                                preTime + "-" + params.name;
                                        }
                                        return (
                                            "访问量(pv)   " +
                                            params.value +
                                            "\n" +
                                            period
                                        );
                                    } else {
                                        return (
                                            "访问量(pv)   " +
                                            params.value +
                                            "\n" +
                                            params.name
                                        );
                                    }
                                }
                            }
                        }
                    }
                ],
                itemStyle: {
                    color: "#73A0FA",
                    borderColor: "#fff",
                    borderWidth: 1
                },
                textStyle: {
                    color: "rgba(0,0,0,0.65)",
                    fontFamily: "PingFangSC-Regular,PingFang SC",
                    fontWeight: 400
                }
            };
            /* const option2 = {
                // title: {
                //     text: '独立用户数（UV）',
                //     subtext: '独立用户数'
                // },
                xAxis: {
                    type: "category",
                    data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
                },
                yAxis: {
                    type: "value"
                },
                series: [
                    {
                        data: [82, 93, 90, 93, 1290, 1330, 1320],
                        type: "line"
                    }
                ]
            }; */

            // 使用刚指定的配置项和数据显示图表。
            myChart.setOption(option);
            window.onresize = function(){
                myChart.resize();
            };
           
        }
    },

    mounted() {
        const b = document.getElementsByClassName("ant-calendar-range-picker-separator");
        if(b.length){
            for(let i=0;i<b.length;i++){
                b[i].innerHTML = '<i class="anticon anticon-swap-right" aria-label="图标: swap-right"><svg viewBox="0 0 1024 1024" data-icon="swap-right" width="1em" height="1em" fill="currentColor" aria-hidden="true" focusable="false" class=""><path d="M873.1 596.2l-164-208A32 32 0 0 0 684 376h-64.8c-6.7 0-10.4 7.7-6.3 13l144.3 183H152c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h695.9c26.8 0 41.7-30.8 25.2-51.8z"></path></svg></i>';
            }
        }
        this.option("day");
    },
    data: () => ({
        timer: null,
        dateFormat: "YYYY/MM/DD",
        picker: "day",
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
        num: 0,
        userfangwen: false,
        value2: [],
        weekX: ["0", "4", "8", "12", "16", "20", "24"],
        typeACount: "875",
        qaaccount: "1234345",
        leaderaccount: "34789",
        moduleaccount: "54345",
        tablefangwen: [],
        tablefangwenheng: [],
        emptyImage: require("@/assets/image/nodata.png")
    })
};
</script>
