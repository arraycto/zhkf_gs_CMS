<template>
    <div class="contentBody">
        <div style="display: flex; justify-content: space-between;">
            <div style="display: flex; align-items: left;">
                <div class="tableTitle">问题列表</div>
                <!-- <div class="subTitle" style="margin-left: 10px;">新增标准问题可在6h后查看推荐相似问题</div> -->
            </div>
            <div style="display: flex; align-items: right;">
                <a class="iconfont searchIcon" @click="()=>{this.showInput = !this.showInput;}" v-if="!showInput" style="margin-right: 0px; height:30px; font-size: 20px; color: #555555;">&#xe622;</a>
                <jt-input 
                    placeholder="请输入标准问题关键字" 
                    v-model="inputMessage" 
                    style="width: 200px; height:30px;margin-right:0px; color: #555555;" 
                    v-on:keyup.enter="searchtodo" 
                    v-if="showInput"
                    class="searchInput">
                    <a slot="suffix" class="iconfont iconsousuo" style="font-size: 16px; color: #999999;" @click="searchtodo" ></a>
                    <span slot="suffix" class="dividerLineIn"></span>
                    <jt-icon slot="suffix" type="close" class="searchClose" style="font-size: 14px;color: #999999;" @click="closeKeywordSearch"></jt-icon>
                </jt-input>
            </div>
        </div>
        <div style="margin-top: 20px;"></div>
        <jt-row>
            <jt-col :span="8">
                <jt-configProvider>
                    <u-table
                        :data="tableData"
                        use-virtual
                        :height="441.2"
                        class="xqTable table"
                        style="min-height:400px;border-left:none; border-bottom:1px solid;border-right:none;color:#E9EBEF;"
                        row-key="key"
                        :row-class-name="setRowClassName"
                        cellpadding="0" 
                        cellspacing="0" 
                        :row-height="40"
                        size="mini"
                        :border="true"
                    >
                        <u-table-column
                            label="标准问题"
                            prop="stQues"
                            align="left"
                            :resizable="false"
                        >
                            <template slot-scope="scope">
                                <div style="display: flex; align-items: left; " @click="showSimques(scope.row.key,scope.row.stQues)" :class="changeColor === scope.row.key? 'blue' : ''">
                                    <input class="radio_type" :value='scope.row.key' type='radio' style="margin-right:8px; width:15px; margin-top:0px;" v-model='radioValue'>
                                    <jt-tooltip :title ="scope.row.stQues" style="cursor: pointer;">
                                        <div class="ellipsis" :value='scope.row.key' style="margin-top:0px; " >{{scope.row.stQues}}</div>
                                    </jt-tooltip>
                                </div>
                            </template>
                        </u-table-column>
                        <template  slot="empty">
                            <jt-empty :image="emptyImage" :imageStyle="{ margin: '141px auto 0px auto',width:'64px',height:'40px', color:'#181B20'}">
                                <div class="emptyDescriptS" slot="description" style="margin-top:-5px;margin-left:2px;font-size:12px;font-weight:400;color:#bfbfbf;">
                                    <p class="emptyDescript"> 暂无数据 </p>
                                </div>
                            </jt-empty>
                        </template>
                    </u-table>
                    <!-- 数据量大导致下面表格太卡所以用了上面的 -->
                    <!-- <jt-table
                        class="table"
                        border = "1px"
                        cellpadding="0" 
                        cellspacing="0" 
                        style="height:440px;border-left-style:none; border-bottom:1px solid;border-right:1px solid;color:#E9EBEF;"
                        :columns="tableColumns" 
                        :dataSource="sQuesData"
                        rowKey="key" 
                        :pagination="false" 
                        :scroll="{ y: sQuesData.length > 10 && 400 }"
                        :rowClassName="setRowClassName"
                    >
                        <span slot="stQues" slot-scope="text,record">
                            <div style="display: flex; align-items: left; " @click="showSimques(record.key,text)" :class="changeColor === record.key? 'blue' : ''">
                                <input class="radio_type" :value='record.key' type='radio' style="margin-right:8px; width:15px; margin-top:0px;" v-model='radioValue'>
                                <jt-tooltip :title ="text" style="cursor: pointer;">
                                    <div class="ellipsis" :value='record.key' style="margin-top:0px; " >{{text}}</div>
                                </jt-tooltip>
                            </div>
                        </span>
                    </jt-table> -->
                    <!-- <template  v-slot:renderEmpty>
                        <jt-empty :image="emptyImage" :imageStyle="{ margin: '141px auto 0px auto',width:'64px',height:'40px', color:'#181B20'}">
                            <div class="emptyDescriptS" slot="description" style="margin-top:-5px;margin-left:2px;font-size:12px;font-weight:400;color:#bfbfbf;">
                                <p class="emptyDescript"> 暂无数据 </p>
                            </div>
                        </jt-empty>
                    </template> -->
                </jt-configProvider>
            </jt-col>
            <jt-col :span="16">
                <jt-configProvider>
                    <u-table
                        :data="simQuesData"
                        :columns="tableColumns1" 
                        use-virtual
                        :height="441.2"
                        class="xqTable table"
                        style="min-height:400px;border-left:none; border-bottom:1px solid;border-right:none;color:#E9EBEF;"
                        row-key="key"
                        :row-class-name="setRowClassName"
                        cellpadding="0" 
                        cellspacing="0" 
                        :row-height="40"
                        size="mini"
                    >
                        <u-table-column
                            label="推荐相似问题"
                            prop="simQues"
                            align="left"
                            :resizable="false"
                            width="420"
                        >
                            <template slot-scope="scope">
                                <jt-tooltip placement="topLeft">
                                    <template slot="title">
                                        <span>{{scope.row.simQues}}</span>
                                    </template>
                                    <a style="max-width: 230px;color: #555555;">{{scope.row.simQues}}</a>
                                </jt-tooltip>
                            </template>
                        </u-table-column>
                        <u-table-column
                            label="操作"
                            prop="status"
                            align="left"
                            :resizable="false"
                        >
                            <template slot-scope="scope">
                                <span class="btn-icon" v-if="scope.row.status" @click="changestatus(scope.row.status,scope.row);judgedel(scope.row.simQues);" ><jt-icon type="minus-square" style="margin-right:5px;cursor:pointer;" />移除该相似问题</span>
                                <span class="btn-icon" v-if="!scope.row.status" @click="changestatus(scope.row.status,scope.row);judgeadd(scope.row.simQues);" ><jt-icon type="plus-square" style="margin-right:5px;cursor:pointer;"/>添加到相似问题</span>
                            </template>
                        </u-table-column>
                        <template  slot="empty">
                            <jt-empty :image="emptyImage" :imageStyle="{ margin: '141px auto 0px auto',width:'64px',height:'40px', color:'#181B20'}">
                                <div class="emptyDescriptS" slot="description" style="margin-top:-5px;margin-left:2px;font-size:12px;font-weight:400;color:#bfbfbf;">
                                    <p class="emptyDescript"> 暂无数据 </p>
                                </div>
                            </jt-empty>
                        </template>
                    </u-table>

                    <!-- <jt-table 
                        border = "1px"
                        cellpadding="0" 
                        cellspacing="0" 
                        style="height:440px;border-left-style:none; border-bottom:1px solid;border-right-style:none;color:#E9EBEF;"
                        :columns="tableColumns1" 
                        :dataSource="simQuesData"
                        rowKey="key" 
                        :pagination="false"
                        :scroll="{y:simQuesData.length>10&&400}"
                        class="tableRight"
                    >
                        <span slot="simQues" slot-scope="text">
                            <jt-tooltip placement="topLeft">
                                <template slot="title">
                                    <span>{{text}}</span>
                                </template>
                                <a style="max-width: 230px;color: #555555;">{{text}}</a>
                            </jt-tooltip>
                        </span>
                        <template slot="status" slot-scope="text,record">
                            <span class="btn-icon" v-if="record.status" @click="changestatus(text,record);judgedel(record.simQues);" ><jt-icon type="minus-square" style="margin-right:5px;cursor:pointer;" />移除该相似问题</span>
                            <span class="btn-icon" v-if="!record.status" @click="changestatus(text,record);judgeadd(record.simQues);" ><jt-icon type="plus-square" style="margin-right:5px;cursor:pointer;"/>添加到相似问题</span>
                        </template>
                        
                    </jt-table>
                    <template  v-slot:renderEmpty>
                        <jt-empty :image="emptyImage" :imageStyle="{ margin: '141px auto 0px auto',width:'64px',height:'40px', color:'#181B20'}">
                            <div class="emptyDescriptS" slot="description" style="margin-top:-5px;margin-left:2px;font-size:12px;font-weight:400;color:#bfbfbf;">
                                <p class="emptyDescript"> 暂无数据 </p>
                            </div>
                        </jt-empty>
                    </template> -->
                </jt-configProvider> 
            </jt-col>
        </jt-row>
    </div>
</template>
<script>
import {mapActions} from 'vuex';
import Vue from 'vue';
import UmyUi from 'umy-ui';
import 'umy-ui/lib/theme-chalk/index.css';// 引入样式

import {Tabs, Table, Input, Checkbox, Steps, Empty, ConfigProvider} from 'ant-design-vue';
Vue.use(Tabs).use(Table).use(Input).use(Checkbox).use(Steps).use(Empty).use(ConfigProvider)
Vue.use(UmyUi);
const tableColumns= [
    {title:'标准问题', dataIndex: 'stQues', key: 'stQues', ellipsis: true, scopedSlots: { customRender: 'stQues' }},
];
const tableColumns1= [
    {title:'推荐相似问题', dataIndex: 'simQues', key: 'simQues', width: 420, ellipsis: true, scopedSlots: { customRender: "simQues" }},
    {title:'操作', dataIndex: 'status', key: 'status', scopedSlots: { customRender: 'status' }},
];
const sQuesData = [];
const simQuesData = [];
const radioValue = '';
const inputMessage = '';
export default {
    name: 'contentBody',
    components: {
        "jt-configProvider":ConfigProvider,
        "jt-empty":Empty,
        "jt-input":Input
    },
    data(){
        return {
            inputMessage,
            radioValue,
            tableColumns,
            sQuesData,
            tableColumns1,
            simQuesData,
            visible: false,
            confirmLoading: false,
            showInput: false,
            changeColor: -1,
            emptyImage: require("@/assets/image/nodata.png"),
            tableData: []
            
        }
    },
    mounted() {
        this.$store.commit(
            'setBreadcrumb',
            [
                {breadcrumbName: this.$store.state.envInfo.envName, breadcrumbPath: this.$store.state.fromPath},
                {breadcrumbName: "扩展问推荐"}
            ]
        );
        this.getexQuesPost().then(res => {
            this.getInitData();
        })
    },
    methods: {
        ...mapActions({
            getexQuesPost: 'exQues/getexQuesPost',
            getSimQuesPost: 'exQues/getSimQuesPost',
            addSimquesPost: 'exQues/addSimquesPost',
            delSimquesPost: 'exQues/delSimquesPost',
            searchSQuesPost: 'exQues/searchSQuesPost',
            delSimquesPostES:'exQues/delSimquesPostES',
            addSimquesPostES: 'exQues/addSimquesPostES'

        }),
        getInitData() {
            this.simQuesData = [];
            this.sQuesData = this.$store.state.exQues.sQuesData;
            this.tableData = this.$store.state.exQues.sQuesData;
            let paramSimquesdict = [];
            // console.log(this.$store.state.exQues.sQuesData[0].stQues)
            if(this.$store.state.exQues.sQuesData.length>0) {
                paramSimquesdict = this.$store.state.exQues.sQuesgetSim[this.$store.state.exQues.sQuesData[0].stQues]
            }
            // console.log(this.paramSimquesdict)
            // console.log(this.$store.state.exQues.simQuesData)
            paramSimquesdict.length && this.getSimQuesPost(paramSimquesdict).then(res => {
                console.log(this.$store.state.exQues.simQuesData)
                this.simQuesData = this.$store.state.exQues.simQuesData;
            })
            
        },
        setRowClassName(record){
            return record.key === this.changeColor ? 'clickRowStyl' :'';
        },
        changestatus(text,record){
            const dataSource = [...this.simQuesData];
            dataSource.forEach(item => {
                if(record.key == item.key){
                    this.simQuesData[item.key].status = !this.simQuesData[item.key].status;
                }
            });
        },
        searchtodo() {
            console.log(this.inputMessage)
            this.radioValue = ''; 
            this.changeColor = '';
            console.log('start going search interface')
            // const botid = this.$store.state.exQues.sQuesgetSim[this.$store.state.exQues.sQuesData[0].stQues].botId
            // console.log(botid)
            if (this.inputMessage == ''){
                console.log('The keyword is none')
                this.getexQuesPost().then(res => {
                    this.getInitData();
                })
            }
            else{
                const searchParam = [];
                searchParam.push(this.$store.state.robotInfo.robotId)
                searchParam.push(this.inputMessage)
                console.log(searchParam)
                // console.log(this.searchParam)
                this.searchSQuesPost(searchParam).then(res => {
                    console.log('in search interface')
                    console.log(this.$store.state.exQues.sQuesData);
                    this.getInitData();
                })
            }
        } ,
        closeKeywordSearch() {
            this.showInput = !this.showInput;
            this.radioValue = ''; 
            this.changeColor = '';
            this.inputMessage = '';
            console.log('Use get standard question interface when close search')
            this.getexQuesPost().then(res => {
                this.getInitData();
            })
        },
        judgedel(text) {
            const paramDelques = [];
            this.paramDelques = this.$store.state.exQues.simGetSques[text]
            const userquesid = this.$store.state.exQues.simGetSques[text].uquesid
            console.log(userquesid)
            this.paramDelques["uquestion"]= text;
            console.log(this.paramDelques)
            this.delSimquesPost(userquesid).then(res => {
                this.delSimquesPostES(userquesid).then(res => {
                    // console.log(this.$store.state.exQues.delMessage);
                    const delMessage = this.$store.state.exQues.delMessage;
                    const delMessageEs = this.$store.state.exQues.delMessageEs;
                    if(delMessage == '0' && delMessageEs == '0') {
                        this.$message.success("移除成功");
                    }
                    else{
                        // this.openNotification('数据库操作失败，请稍后再试。','移除')
                        this.openNotification('系统繁忙，请稍后重试。','移除')
                    }
                })
            })
        },
        judgeadd(text) {
            const paramAddques = [];
            this.paramAddques = this.$store.state.exQues.simGetSques[text]
            const userquesid = this.$store.state.exQues.simGetSques[text].uquesid
            console.log(userquesid)
            this.paramAddques["uquestion"]= text;
            console.log(this.paramAddques)
            this.addSimquesPost(userquesid).then(res => {
                this.addSimquesPostES(this.paramAddques).then(res => {
                    // console.log(this.$store.state.exQues.addMessage);
                    const addMessage = this.$store.state.exQues.addMessage;
                    const addMessageEs = this.$store.state.exQues.addMessageEs;
                    // console.log(addMessage)
                    if(addMessage == '0' && addMessageEs == '0') {
                        this.$message.success("添加成功");
                    }
                    else{
                        // this.openNotification('数据库操作失败，请稍后再试。','添加')
                        this.openNotification('系统繁忙，请稍后重试。','添加')
                    }
                })
            })
        },
        openNotification(content, status) {
            this.$notification.open({
                message: 
                    <div style="width:70px;height:20px;font-size:14px;font-family:PingFangSC-Semibold,PingFang SC;font-weight:600;color:rgba(38,38,38,1);line-height:20px;">{status}失败！</div>,
                description:
                    <div style="width:310px;height:36px;font-size:12px;font-family:PingFangSC-Regular,PingFang SC;font-weight:400;color:rgba(85,85,85,1);line-height:18px;">失败原因：{content}</div>,
                icon:()=><jt-icon type="close-circle" theme="filled" style="color:#F04134"/>,
                type: 'error',
                placement: 'topRight',
            })
        },
        showSimques(recordkey,text) {
            // console.log(this.$store.state.exQues.sQuesgetSim)
            this.changeColor = recordkey;
            this.radioValue = recordkey; 
            const paramSimques = [];
            this.paramSimques = this.$store.state.exQues.sQuesgetSim[text];
            // console.log(this.paramSimques)
            this.getSimQuesPost(this.paramSimques).then(res => {
                console.log(this.$store.state.exQues.simQuesData)
                this.simQuesData = this.$store.state.exQues.simQuesData;
            })
        },
    }
}
</script>
<style lang="less" scoped>
div.contentBody{
    flex: auto;
    // width: auto;
    // min-height: 609px;
    background: #FFFFFF;
    border-radius: 2px;
    padding: 20px 20px 40px 20px;
    overflow-y: auto;
    .tableTitle {
        // width: 64px;
        height: 24px;
        font-size: 16px;
        font-family: 'PingFangSC-Medium,PingFang SC';
        font-weight: 600;
        color: #333333;
        line-height: 22px;
    }
    // .subTitle {
    //     height: 18px;
    //     font-size: 12px;
    //     font-family: 'PingFangSC-Regular,PingFang SC';
    //     font-weight: 400;
    //     color: rgba(153,153,153,1);
    //     line-height: 24px;
    // }
    .code-box-demo .config-provider h3 {
        font-size: inherit;
        margin: 16px 0 8px 0;
    }
    .btn-stop {
        &:hover {
            color: #337DFF!important;
        }
    }
    /deep/.clickRowStyl{
        td{
            background-color: #EAF2FF;
        }
    }
    .iconfont.iconsousuo {
        font-size: 16px; 
        color: #999999;
        &:hover {
            color: #337DFF!important;
        }
    }
    .iconfont.searchIcon{
        font-size: 18px;
        color: #555555;
        &:hover {
            color: #337DFF!important;
        }
    }
    .dividerLineIn{
        height: 16px;
        width: 1px;
        background:#E9EBEF;
        margin-right: 6px;
        margin-left: 6px;
        display: inline-block;
        vertical-align: text-top;
    }
    .ellipsis{
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    /deep/.ant-input-affix-wrapper .ant-input:not(:last-child){
        padding-right: 60px;
    }
    /deep/.ant-table-fixed-header {
        .ant-table-scroll {
             .ant-table-header {
                overflow: hidden!important;
                height: 46px;
            }
        }
    }
    /deep/.ant-table-tbody>tr>td, .ant-table-thead>tr>th {
        padding: 10px 16px;
        overflow-wrap: break-word;
    }
    /deep/ tr{
        transition: color 0s;
        font-family: 'PingFangSC-Regular,PingFang SC';
        font-weight: 400;
        line-height: 18px;
        height: 100%;
        &:hover {
            .btn-icon {
                color: #337DFF!important;
            }
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
    .searchInput {
        width: 210px;
        animation: inputMove 0.3s ease-in-out 0s 1 alternate forwards;
    }
    @keyframes inputMove {
        0% {width: 100px;}
        100% {width: 210px;}
    }
    .searchClose {
        &:hover {
            color: #337DFF!important;
        }
        animation: inputClose 0.3s ease-in-out;
    }
    @keyframes inputClose {
        0% {width: 0px;}
        100% {width: 16px;}
    }
    .key-input{
        width: 118px;
        height: 32px;
        margin-bottom: 8px;
        font-size: 12px;
    }
    .key-check{
        display: block;
        width: 118px;
        height: 25px;
        margin: 0 auto;
        text-align: left;
        font-size: 12px;
    }
    /deep/ .contentBody[data-v-2b0822cd] .ant-empty-image svg{
        height:70px;
    }
    /deep/ .ant-table-placeholder{
        height:400px;
        margin-top:0px;
        border-top:0px #fff;
    }
    /deep/ .ant-empty-normal .ant-empty-image{
        margin-top:140px;
    }
    /deep/ .ant-empty-image svg{
        width: 70px;
        height: 59px;
    }
    /deep/ .ant-empty{
        font-size:14px;
        line-height:40px;
    }
    /deep/ .ant-steps-item-title{
        font-size: 14px;
    }
    .blue{
        color: #337DFF;
    }
    .radio_type{
        // width: 14px;
        // height:14px;
        appearance: none;
        position: relative;
        outline: none;
        text-align: center;
        cursor: pointer;
        /deep/&:hover {
            color: #337DFF!important;
        }
        
    }
    .ant-table-tbody > tr:hover {
        .radio_type:before{
            border: 1px solid #337DFF;
        }
    }
    .radio_type:before{
        content: '';
        width: 14px;
        height: 14px;
        border: 1px solid #D9D9D9;
        display: inline-block;
        border-radius: 50%;
        text-align: center;
        vertical-align: middle;
        cursor: pointer;
        /deep/&:hover {
            color: #337DFF!important;
        }
        
    }
    .radio_type:checked:before{
        content: '';
        width: 14px;
        height: 14px;
        border: none;
        display: inline-block;
        text-align: center;
        border-radius: 50%;
        vertical-align: middle;
        background-color: #337DFF;
        cursor: pointer;
    }
    .radio_type:checked:after{
        content: '';
        width: 5px;
        height: 5px;
        text-align: center;
        background-color:#fff;
        border-radius: 50%;
        display: block;
        position: absolute;
        cursor: pointer;
        top: 10.2px;
        left: 4.8px;
    }
    .xqTable /deep/.el-loading-spinner {
        top: 200px;
    }
    .xqTable /deep/.el-table__header-wrapper {
        height: 40.2px;
    }
    .xqTable /deep/th {
        border-right: none;
    }
}
</style>