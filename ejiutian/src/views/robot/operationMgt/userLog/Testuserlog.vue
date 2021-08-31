<template>
    <div class="contentBody">
        <div style="display: flex; justify-content: space-between;">
            <div class="tableTitle">
                用户日志
            </div>
            <div style="display: flex; align-items: right;">
                <jt-range-picker @change="onChange" :value="value" style="width: 219px; height:32px;">
                    <jt-icon slot="suffixIcon" type="calendar" />
                </jt-range-picker>
            </div>
        </div>
        <div style="margin-top:16px;">
            <div>
                <jt-configProvider>
                    <jt-table
                        :columns="testUserlogcolumns"
                        :dataSource="testUserlogshowData"
                        :pagination="false"
                        rowKey="id"
                    >
                        <span slot="id" slot-scope="text">
                            <jt-tooltip placement="topLeft">
                                <template slot="title">
                                    <span>{{text}}</span>
                                </template>
                                <a style="max-width: 230px;color: #555555;">{{text}}</a>
                            </jt-tooltip>
                        </span>
                        <span slot="question" slot-scope="text">
                            <jt-tooltip placement="topLeft">
                                <template slot="title">
                                    <span>{{text}}</span>
                                </template>
                                <a style="max-width: 230px;color: #555555;">{{text}}</a>
                            </jt-tooltip>
                        </span>
                        <span slot="content" slot-scope="text">
                            <jt-tooltip placement="topLeft">
                                <template slot="title">
                                    <span>{{text}}</span>
                                </template>
                                <a style="max-width: 230px;color: #555555;">{{text}}</a>
                            </jt-tooltip>
                        </span>
                        <span slot="message" slot-scope="text,record">
                            <jt-tooltip placement="topLeft">
                                <template slot="title">
                                    <span>{{(setPicOrVio(text))}}</span>
                                </template>
                                <a v-if="record.flag != '0'" style="max-width: 230px;color: #337dff;width:100%;display:block" @click.stop="answerLook(record)">查看</a>
                                <a v-else style="max-width: 230px;color: #555555;">{{text}}</a>
                            </jt-tooltip>
                        </span>
                    </jt-table>
                    <template  v-slot:renderEmpty>
                        <jt-empty :image="emptyImage" :imageStyle="{ margin: '50px auto 0px auto',width:'400px',height:'400px'}">
                            <div class="emptyDescriptS" slot="description" style="margin-top:-128px;font-size:18px;font-weight:600;font-family:PingFangSC-Semibold,PingFang SC;color:#333333;">
                                <p class="emptyDescript"> 当前时间范围内无用户日志记录 </p>
                            </div>
                        </jt-empty>
                    </template>
                </jt-configProvider>
            </div>
        </div>
        <div v-if="isNone">
            <div style="display: flex; justify-content: space-between; margin-top: 16px;">
                <div style="text-align: left;">
                    <span style="margin-left: 0px;">共 {{recordCount}} 条记录</span>
                    <span class="pageOption" v-if="isshow" style="margin-left: 15px;">每页显示</span>
                    <jt-select :defaultValue="10" v-if="isshow" style="min-width: 50px; margin: 0 5px;" @change="getShowSizeChangeData">
                        <jt-icon slot="suffixIcon" type="caret-down" :style="{ color: '#606266',marginRight:'-7px' }"/>
                        <jt-select-option :value="10">10</jt-select-option>
                        <jt-select-option :value="20">20</jt-select-option>
                        <jt-select-option :value="30">30</jt-select-option>
                    </jt-select>
                    <span v-if="isshow">条</span>
                </div>
                <div v-if="isshow" style="display: flex; text-align: right;">
                    <jt-pagination
                        showQuickJumper :current="currentPage" :pageSize="pageSize" :total="recordCount"
                        @change="getPageChangeData"
                    />
                </div>
            </div>
        </div>
        <jt-modal
            :closable="true"
            :footer="null"
            centered
            v-model="checkAnwer"
            :afterClose="afterClose"
            :bodyStyle="{padding: '0px'}"
            height='fit-content'
            v-dialogDrag
        >
            <img 
                v-if="editUrlImg != ''" 
                :src="editUrlImg" 
                style="width:100%;min-height:56px" 
                leftmargin=0 
                topmargin=0 
                oncontextmenu='return false' 
                ondragstart='return false' 
                onselectstart ='return false' 
                onbeforecopy='return false' 
            />
            <video id="multimedia" v-if="editUrlVio != ''" controls :src="editUrlVio" style="width:100%;height:79.8vh"></video>
        </jt-modal>
    </div>
</template>

<style lang="less" scoped>
@import "~@/assets/style/var.less";

div.contentBody {
    flex: auto;
    // width: auto;
    // min-height: 609px;
    background: #FFFFFF;
    border-radius: 2px;
    padding: 20px 20px 40px 20px;
    overflow-y: auto;
    .tableTitle {
        width: 201px;
        height: 24px;
        font-size: 16px;
        font-family: 'PingFangSC-Medium,PingFang SC';
        font-weight: 600;
        color: #333333;
        line-height: 22px;
    }
    /deep/ .ant-table-placeholder{
        height:400px;
        margin-top:0px;
        border-top:0px #fff;
        border-bottom:0px #fff;
    }
    .exportBtn {
        width: 68px;
        height: 32px;
        padding: 0;
        font-size: 12px;
        font-family: 'PingFangSC-Regular,PingFang SC';
        font-weight: 400;
        color: #333333;
        line-height: 17px;
    }
    .iconfont {
        &:hover {
            color: #337DFF!important;
        }
    }
    /deep/ tr {
        transition: color 0s;
        font-family: 'PingFangSC-Regular,PingFang SC';
        font-weight: 400;
        line-height: 18px;
        &:hover{
            color: #337DFF;
        }
        th {
            height: 40px;
            font-size: 12px;
            color: #333333;
            background: #F4F5F7;
        }
        td {
            height: 40px;
            font-size: 12px;
            color: #555555;
            background: #FFFFFF;
        }
    }
}
</style>

<script>
import {Table, Empty, ConfigProvider, DatePicker} from 'ant-design-vue';
import {mapActions, mapMutations} from 'vuex';
import Vue from 'vue'
const testUserlogcolumns = [
    {
        title: '用户ID',
        dataIndex: 'id',
        key: 'id',
        width: 100,
        ellipsis: true,
        scopedSlots: { customRender: "id" }
    },
    {
        title: '用户问题',
        dataIndex: 'question',
        key: 'question',
        ellipsis: true,
        scopedSlots: { customRender: "question" }
    },
    {
        title: '匹配内容',
        dataIndex: 'content',
        key: 'content',
        width: 220,
        ellipsis: true,
        scopedSlots: { customRender: "content" }
    },
    {
        title: '回复信息',
        dataIndex: 'message',
        key: 'message',
        width: 210,
        ellipsis: true,
        scopedSlots: { customRender: "message" }
    },
    {
        title: '类型',
        dataIndex: 'type',
        key: 'type',
        width: 110
    },
    {
        title: '时间',
        dataIndex: 'time',
        width: 180,
        key: 'time',
    }
];

const testUserlogshowData = [];
const pageSize = 10;
const recordCount = 0;
const currentPage = 1;
const showInput = false;

export default {
    name: "Testuserlog",
    components: {
        "jt-configProvider":ConfigProvider,
        "jt-empty":Empty,
        "jt-table":Table,
        "jt-range-picker":DatePicker.RangePicker,
    },
    data() {
        return {
            env: "",
            emptyImage: require("@/assets/image/noneProject.png"),
            testUserlogcolumns,
            testUserlogshowData,
            pageSize,
            recordCount,
            currentPage,
            showInput,
            isNone:false,
            isshow:false,
            value:[],
            nowTimes:{
                yy:0,
                mm:0,
                dd:0,
                hou:0,
                min:'00',
                sec:'00'
            },
            recentOneMonthTimes:{
                yy:0,
                mm:0,
                dd:'00',
            },
            nows:{
                yy:0,
                mm:0,
                dd:0,
                hou:0,
                min:'00',
                sec:'00'
            },
            editUrlVio: "",
            editUrlImg: "",
            checkAnwer: false
        }
    },
    beforeMount(){
        this.setNowTimes();
    },
    mounted() {
        const b = document.querySelector(".ant-calendar-range-picker-separator");
        if(b){
            b.innerHTML = '<i class="anticon anticon-swap-right" aria-label="图标: swap-right"><svg viewBox="0 0 1024 1024" data-icon="swap-right" width="1em" height="1em" fill="currentColor" aria-hidden="true" focusable="false" class=""><path d="M873.1 596.2l-164-208A32 32 0 0 0 684 376h-64.8c-6.7 0-10.4 7.7-6.3 13l144.3 183H152c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h695.9c26.8 0 41.7-30.8 25.2-51.8z"></path></svg></i>';
        }
        this.$store.commit(
            'setBreadcrumb',
            [
                {breadcrumbName: this.$store.state.envInfo.envName, breadcrumbPath: this.$store.state.fromPath},
                {breadcrumbName: "用户日志"}
            ]
        );
        // userlogTestPost: 获取全部表格数据
        this.userlogTestPost().then(res => {
            this.getInitData();
            this.getshowData();
        })
        setInterval(()=>{
            this.setNowTimes();
        },1000)
    },
    methods: {
        ...mapActions({
            userlogTestPost: 'exQues/userlogTestPost',
            userlogProducePost: 'exQues/userlogProducePost',
            modifyName: "exQues/modifyName",
            getPicOrVio: "questionAnswer/getPicOrVio"
        }),
        ...mapMutations({
            mutation: 'exQues/setTestUserlogData'
        }),
        getInitData() {
            // this.$set(this.$store.state.exQues.testUserlogData,);
            console.log(this.$store.state.exQues.testUserlogData,'获取列表');
            if(this.$store.state.exQues.testUserlogData.length > 10){
                this.isNone = true;
                this.isshow = true;
                this.currentPage = 1;
            }
            else if(this.$store.state.exQues.testUserlogData.length > 0){
                this.isNone = true;
                this.isshow = false;
                this.currentPage = 1;
            }
            else{
                this.isNone = false;
                this.pageSize = 10;
                this.currentPage = 1;
            }
            this.recordCount = this.$store.state.exQues.testUserlogData.length;
            this.testUserlogshowData = this.getshowData(this.currentPage);
            
        },
        getshowData(pageIndex) {
            return this.$store.state.exQues.testUserlogData.slice((pageIndex - 1 ) * this.pageSize, pageIndex * this.pageSize);
        },
        getShowSizeChangeData(showSizeSelected) {
            const dataIndexBeforeChange = (this.currentPage - 1) * this.pageSize
            this.pageSize = showSizeSelected;
            const currentPageAfterChange = Math.floor(dataIndexBeforeChange / this.pageSize) + 1
            this.currentPage = currentPageAfterChange;
            this.testUserlogshowData = this.getshowData(this.currentPage)
        },
        getPageChangeData(pageIndex) {
            this.currentPage = pageIndex;
            this.testUserlogshowData = this.getshowData(pageIndex);
        },
        setNowTimes(){
            const myDate = new Date();
            console.log(myDate);
            const nowTime = '';
            this.nowTimes.yy = myDate.getFullYear();
            this.nowTimes.mm = myDate.getMonth()+1;
            this.nowTimes.dd = myDate.getDate();
            this.nowTimes.hou = myDate.getHours();
            this.nowTimes.min = String(myDate.getMinutes()<10?'0'+myDate.getMinutes():myDate.getMinutes());
            this.nowTimes.sec = String(myDate.getSeconds()<10?'0'+myDate.getSeconds():myDate.getSeconds());
            const nowTimeYMD = this.nowTimes.yy+'-'+String(this.nowTimes.mm<10?'0'+this.nowTimes.mm:this.nowTimes.mm)+'-'+String(this.nowTimes.dd<10?'0'+this.nowTimes.dd:this.nowTimes.dd);

            console.log(this.nowTimes.hou)
            if (this.nowTimes.hou < 6){
                console.log('now time is before 6:00')
                this.nowTime = this.nowTimes.yy+'-'+ this.nowTimes.mm+'-'+(this.nowTimes.dd-1)+'-23-59-59';
            }
            else{
                console.log('now time is after 6:00')
                this.nowTime = this.nowTimes.yy+'-'+ this.nowTimes.mm+'-'+this.nowTimes.dd+'-'+(this.nowTimes.hou-6)+'-'+this.nowTimes.min+'-'+this.nowTimes.sec;
            }
            // console.log(nowTime)
            const recentThirtyDay = new Date(myDate - 2592000000);
            console.log(recentThirtyDay)
            this.recentOneMonthTimes.yy = recentThirtyDay.getFullYear();
            this.recentOneMonthTimes.mm = recentThirtyDay.getMonth()+1;
            this.recentOneMonthTimes.dd = recentThirtyDay.getDate();
            const recentOneMonthTime = this.recentOneMonthTimes.yy+'-'+ this.recentOneMonthTimes.mm +'-'+this.recentOneMonthTimes.dd+'-0-0-0';
            const recentThirtyYMD = this.recentOneMonthTimes.yy+'-'+String(this.recentOneMonthTimes.mm<10?'0'+this.recentOneMonthTimes.mm:this.recentOneMonthTimes.mm)+'-'+String(this.recentOneMonthTimes.dd<10?'0'+this.recentOneMonthTimes.dd:this.recentOneMonthTimes.dd);
            // console.log(recentOneMonthTime)
            // console.log(this.nowTime)
            this.value = [];
            // console.log(recentThirtyYMD)
            this.value.push(recentThirtyYMD);
            this.value.push(nowTimeYMD);
            console.log(this.value)
            const uselogTestParam = [];
            console.log(this.$store.state.userId)
            uselogTestParam.push(this.$store.state.userId);
            uselogTestParam.push(this.$store.state.robotInfo.robotId);
            uselogTestParam.push(recentOneMonthTime);
            uselogTestParam.push(this.nowTime);
            console.log(uselogTestParam)
            this.env = this.$store.state.envInfo.env;
            if (this.env === "test"){
                this.userlogTestPost(uselogTestParam).then(res => {
                    console.log('Test interface')
                    this.getInitData();
                })
            }
            else{
                this.userlogProducePost(uselogTestParam).then(res => {
                    console.log('Produce interface')
                    this.getInitData();
                })
            }
        },
        onChange(date, dateString) {
            // console.log('***',date, dateString)
            const datearr = dateString;
            const startDate = '';
            const endDate = '';
            this.value = [];
            this.value.push(datearr[0]);
            this.value.push(datearr[1]);
            if (datearr[0] == ""){
                console.log('Click cross recover default data.')
                this.setNowTimes();
                this.value = [];
            }
            else{
                const nowDate = new Date();
                const nows = '';
                this.nows.yy = nowDate.getFullYear();
                this.nows.mm = nowDate.getMonth()+1;
                this.nows.dd = nowDate.getDate();
                this.nows.hou = nowDate.getHours();
                this.nows.min = String(nowDate.getMinutes()<10?'0'+nowDate.getMinutes():nowDate.getMinutes());
                this.nows.sec = String(nowDate.getSeconds()<10?'0'+nowDate.getSeconds():nowDate.getSeconds());
                const nowsYMD = nowDate.getFullYear() +'-'+String(this.nows.mm<10?'0'+this.nows.mm:this.nows.mm)+'-'+String(this.nows.dd<10?'0'+this.nows.dd:this.nows.dd)
                const nowsYMDH = nowsYMD + '-' + this.nows.hou;

                const firstdateList = [];
                firstdateList.push(datearr[0].split('-'));

                const lastdateList = [];
                lastdateList.push(datearr[1].split('-'));

                if(datearr[1] < nowsYMD){
                    console.log('The last day is before today.')
                    this.startDate = datearr[0] + '-0-0-0';
                    this.endDate = datearr[1] + '-23-59-59';
                }
                else if(datearr[1] == nowsYMD){
                    console.log('The last day is today.')
                    if(this.nows.hou < 6){
                        console.log('The last day is today and nowtime is before 6.')
                        if(datearr[0] < nowsYMD){
                            console.log('The first day is before today, the last day is today and nowtime is before 6.')
                            this.startDate = datearr[0] + '-0-0-0';
                            this.endDate = datearr[1] + '-0-0-0';
                        }
                        else{
                            console.log('The first day is today, the last day is today and nowtime is before 6.')
                            this.startDate = datearr[0] + '-0-0-0';
                            this.endDate = datearr[1] + '-0-0-0';
                        }
                    }
                    else{
                        console.log('The last day is today and nowtime is after 6.')
                        this.startDate = datearr[0] + '-0-0-0';
                        // this.endDate = datearr[1] + '-' +(this.nows.hou-6)+'-'+this.nows.min+'-'+this.nows.sec;
                        this.endDate = datearr[1] + '-' +(this.nows.hou)+'-'+this.nows.min+'-'+this.nows.sec;
                    }
                }
                else{
                    if (datearr[0] <= nowsYMD){
                        if (this.nows.hou < 6){
                            console.log('The first day is before today or is today, the last day is after today.Now is before 6.')
                            this.startDate = datearr[0] + '-0-0-0';
                            this.endDate = nowsYMD + '-0-0-0';
                        }
                        else{
                            console.log('The first day is before today or is today, the last day is after today.Now is after 6.')
                            this.startDate = datearr[0] + '-0-0-0';
                            // this.endDate = nowsYMD + '-' +(this.nows.hou-6)+'-'+this.nows.min+'-'+this.nows.sec;
                            this.endDate = nowsYMD + '-' +(this.nows.hou)+'-'+this.nows.min+'-'+this.nows.sec;
                        }
                    }
                    else{
                        console.log('The first day and the last day are both after today.')
                        this.startDate = datearr[0] + '-0-0-0';
                        this.endDate = datearr[1] + '-23-59-59';
                    }
                }
                const uselogTestParam = [];
                uselogTestParam.push(this.$store.state.userId);
                uselogTestParam.push(this.$store.state.robotInfo.robotId);
                uselogTestParam.push(this.startDate);
                uselogTestParam.push(this.endDate);
                this.env = this.$store.state.envInfo.env;
                if (this.env === "test"){
                    this.userlogTestPost(uselogTestParam).then(res => {
                        console.log('Test interface')
                        this.getInitData();
                    })
                }
                else{
                    this.userlogProducePost(uselogTestParam).then(res => {
                        console.log('Produce interface')
                        this.getInitData();
                    })
                }
            }
        },
        answerLook(row) {
            this.$store.commit('showLoading')
            const answerCut ='^' + row.message.split("%")[0]
            const obj = {
                answer: answerCut
            }
            if (row.flag == '1') {
                this.getPicOrVio(obj).then(res => {
                    if (res.errno == 0) {
                        this.editUrlVio = "";
                        this.editUrlImg = 'data:' + res.result[0].file_message + ';base64,' + res.result[0].body;
                        this.checkAnwer = true;
                    }else {
                        this.showErrorNotification("查询失败！", res.errno, res.errorMsg);
                    }
                })
            }else if (row.flag == '2') {
                this.getPicOrVio(obj).then(res => {
                    if (res.errno == 0) {
                        this.editUrlImg = "";
                        this.editUrlVio = 'data:' + res.result[0].file_message + ';base64,' + res.result[0].body;
                        this.checkAnwer = true;
                        this.$store.commit('hideLoading')
                    }else {
                        this.showErrorNotification("查询失败！", res.errno, res.errorMsg);
                    }
                })
            }
            
        },
        afterClose() {
            if (document.querySelector('#multimedia')) {
                const Vio = document.querySelector('#multimedia');
                Vio.pause();
            }
            
        },
        setPicOrVio(val) {
            const answerCut = val.split("%");
            if (answerCut.length && answerCut.length > 1) {
                return answerCut[1]
            }else {
                return val
            }
        },
        showErrorNotification(title, errorCode, errorMsg) {
            if (errorCode != "-101") {
                this.$notification.open({
                    duration: (errorCode == 999) ? 0 : 4.5,
                    message: title,
                    description: "失败原因：" + errorMsg,
                    icon: (<jt-icon type="exclamation-circle" theme="filled" style="color:#F04134"/>)
                });
            }
        },
    }
}
</script>