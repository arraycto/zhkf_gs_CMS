<template>
    <div class="contentBody">
        <div style="display: flex; justify-content: space-between;">
            <div class="tableTitle">
                {{this.skillname}}技能
            </div>
            <div style="display: flex; align-items: center;">

                <jt-input placeholder="输入意图关键词" type="text" v-model="keyWord"  @keyup.enter="searchAction" style="width:210px" v-show="isShowSearch" class="search_">
                    <a slot="suffix" class="iconfont suffixSearch" @click="searchAction">
                        &#xe622;
                    </a>
                    <span slot="suffix" class="iconfont" style="margin:0 5px;color:#BBB" >|</span>
                    <jt-icon  slot="suffix" type="close" @click="destruction" style="color:#999"/>
                </jt-input>
                <a class="iconfont searchIcon" @click="search" style="margin-right: 16px; font-size: 18px; color: #555555;cursor: pointer;" v-show="!isShowSearch">&#xe622;</a>
                <!-- | -->
                <jt-divider type="vertical" style="margin-right: 16px;margin-left:0px; height: 16px; color: #E9EBEF;" />
                <!-- date change -->
                <jt-range-picker @change="changeDate" v-model="dates" :defaultPickerValue="calendarRange" valueFormat="YYYY-MM-DD" separator="-" style="width: 216px; margin-right: 8px;text-align:left;">
                    <jt-icon slot="suffixIcon" type="calendar" style="margin-left:8px;"/>
                </jt-range-picker>

                <!-- <jt-input placeholder="输入关键词搜索" v-model="keyWord" @keyup.enter="getInitData" ref="userNameInput" style="width: 200px">
                    <jt-tooltip slot="suffix" title="点击查询">
                        <span class="iconfont iconsousuo" @click="getInitData"></span>
                    </jt-tooltip>
                </jt-input> -->

                <jt-button v-show="$store.state.envInfo.env === 'test'" size="large" type="primary" @click="addIntent" class="createBtn">
                    <jt-icon type="plus" />新建意图
                </jt-button>
            </div>

        </div>

        <div v-if="showContentFlag == '0'" style="margin-top: 16px;">
            <div>
                <jt-table
                    class="jtTabel" tableLayout="fixed" 
                    v-show="$store.state.envInfo.env === 'test'"
                    :columns="showColumns"
                    :dataSource="showData"
                    :pagination="false"
                    rowKey="id"
                    :customRow="customRow"
                    :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange, columnWidth: 1 }"
                >
                    <span slot="ellipsisContent" slot-scope="text">
                        <jt-tooltip placement="topLeft">
                            <template slot="title">
                                <span>{{text}}</span>
                            </template>
                            <a style="max-width: 10;color: #555555;">{{text}}</a>
                        </jt-tooltip>
                    </span>

                    <span slot="action-slot" slot-scope="text, record">
                        <span class="btn-common" @click.stop="() => editIntent(record)">
                            <span class="iconfont btn-icon" style="vertical-align: middle; margin-right: 4px; color: #999999;">&#xe614;</span>
                            <span style="vertical-align: middle;">编辑</span>
                        </span>
                    </span>
                </jt-table>
                <jt-table
                    class="jtTabel" tableLayout="fixed" 
                    v-show="$store.state.envInfo.env !== 'test'"
                    :columns="showColumnsProduce"
                    :dataSource="showData"
                    :pagination="false"
                    rowKey="id"
                    :customRow="customRow"
                >
                    <span slot="ellipsisContent" slot-scope="text">
                        <jt-tooltip placement="topLeft">
                            <template slot="title">
                                <span>{{text}}</span>
                            </template>
                            <a style="max-width: 130px;color: #555555;">{{text}}</a>
                        </jt-tooltip>
                    </span>
                </jt-table>

                <!-- page -->
                <jt-row style="margin-top: 20px;">
                    <jt-col :span="9">
                        <jt-button size="large" type="default" class="delBtn" @click="deleteConfirm" v-if="env == 'test'">
                            删除
                        </jt-button>    
                        <span style="margin:0 16px;">共 {{recordCount}} 条记录</span>
                        <span v-if="isSlip">每页显示</span>
                        <jt-select  v-if="isSlip" :defaultValue="this.pageSize" style="min-width: 50px; margin: 0 5px;" @change="onShowSizeChange" >
                            <jt-icon slot="suffixIcon" type="caret-down" :style="{ color: '#606266',marginRight:'-7px' }"/>
                            <jt-select-option v-for='(item,index) in pageList' :key="index">{{item}}</jt-select-option>
                        </jt-select>
                        <span v-if="isSlip">条</span>  
                    </jt-col>
                    <jt-col :span="15">
                        <!-- <div style="width: 55px; text-align: right;float:right" v-if="totalPage > 1">
                            <jt-button size="large" class="exportBtn" style="width: 49px; height: 28px;">GO</jt-button>
                        </div> -->
                        <jt-pagination
                            size="large" :total="recordCount" :current="currentPageIndex" :pageSize="pageSize" showQuickJumper @change="onPageChange" hideOnSinglePage style="float:right"
                        />
                    </jt-col>
                </jt-row>

            </div>
            <div style="display: flex; flew-flow: row; margin-top: 16px;">

                <jt-modal
                    :closable="false"
                    :footer="null"
                    centered
                    v-model="deleteConfirmShow"
                    :bodyStyle="{padding: '0px', height: '160px'}"
                    width="320px"
                >
                    <div style="padding-top: 32px;">
                        <div style="margin-left: 32px;">
                            <jt-icon type="exclamation-circle" theme="filled" style="color: #F04134; font-size: 18px;" />
                            <span style="margin-left: 8px; font-size: 14px; font-weight: 500; color: #333333; line-height: 20px;">确定删除该</span>
                            <span style="margin-left: 8px; font-size: 14px; font-weight: 500; color: #F04134; line-height: 20px;">{{selectedRowKeys.length}}</span>
                            <span style="margin-left: 8px; font-size: 14px; font-weight: 500; color: #333333; line-height: 20px;">条意图吗？</span>
                        </div>
                        <div style="margin-top: 8px; margin-left: 58px;">
                            <span style="font-size: 12px; font-weight: 400; color: #555555; line-height: 18px;">删除后将无法恢复</span>
                        </div>
                        <div style="margin-top: 30px; margin-left: 164px;">
                            <jt-button style="width: 64px; height: 32px; background: #FFFFFF; border-radius:2px; border:1px solid #D9D9D9; padding: 7px 18px; color: #555555; font-size: 12px;" @click="function() {deleteConfirmShow = false}">取消</jt-button>
                            <jt-button style="margin-left: 8px; width: 64px; height: 32px; background: #FFFFFF; border-radius:2px; border:1px solid #F04134; padding: 7px 18px; color: #F04134; font-size: 12px;" @click="deleteSubmit">删除</jt-button>
                        </div>
                    </div>
                </jt-modal>    
                    

            </div>

        </div>
        <div v-if="showContentFlag == '1'" class="emptyData">
            <!-- <div class="emptyMsgTitle">您还没有添加任何场景式对话意图</div>
            <div class="emptyMsgDetail" v-show="$store.state.envInfo.env === 'test'">
                <span>您可以 </span>
                <a @click="addIntent()" style="font-size:14px;">新建意图</a>
                <span>，为机器人添加场景式对话意图 </span>
            </div> -->
            <jt-empty :image="questionEmptyImage" :imageStyle="{margin: 'auto',width: '400px',height: '400px'}">
                <div class="emptyContent" slot="description">
                    <p class="emptyTitle">您还没有添加任何场景式对话意图</p>
                    <p v-show="env === 'test'">您可以 <a href="javascript:;" @click="addIntent()">新建意图</a>，为机器人添加场景式对话意图</p>
                </div>
            </jt-empty>
        </div>
        <div v-if="showContentFlag == '2'">
            <jt-empty :image="questionSearchNoneImage" :imageStyle="{margin: 'auto',width: '400px',height: '400px'}">
                <div class="emptyContent" slot="description">
                    <p class="emptyTitle">抱歉，没有匹配到任何搜索结果</p>
                    <p>您可以换一个关键词试试哦～</p>
                </div>
            </jt-empty>
        </div>


    </div>
</template>

<script>
// import ref from 'vue-ref';
// Vue.use(ref, { name: 'ant-ref' });

import { axiosGet, axiosDelete }  from "../../../../utils/http.js";
import API from '../../../../constant/api';
import { getRandomNum } from "@/utils/common.ts";


import {Modal as JtModal} from "ant-design-vue";
import {FormModel  as JtFormModel} from "ant-design-vue";
import {Pagination as JtPagination} from "ant-design-vue";
import moment from 'moment'


const showColumns =[
    {title: '意图', dataIndex: 'name',  key: 'name', width: 10, ellipsis: true, scopedSlots: {customRender: "ellipsisContent"}},
    {title: '编辑人', dataIndex: 'author',  key: 'author', width: 4, ellipsis: true, scopedSlots: {customRender: "ellipsisContent"}},
    {title: '编辑时间', dataIndex: 'updateTime',  key: 'updateTime', width: 6}, 
    {title: '操作', dataIndex: 'action', key: 'action', scopedSlots: { customRender: 'action-slot' } , width: 4}   
];
const showColumnsProduce =[
    {title: '意图', dataIndex: 'name',  key: 'name', width: 12, ellipsis: true, scopedSlots: {customRender: "ellipsisContent"}},
    {title: '编辑人', dataIndex: 'author',  key: 'author', width: 4, ellipsis: true, scopedSlots: {customRender: "ellipsisContent"}},
    {title: '编辑时间', dataIndex: 'updateTime',  key: 'updateTime', width: 6}, 
];

const recordCount = 0;
const selectedRowKeys = [];

const host = API.port5001.host;
// const host = "http://127.0.0.1:5001";




export default {
    components:{
        // eslint-disable-next-line vue/no-unused-components
        JtModal,
        // eslint-disable-next-line vue/no-unused-components
        JtFormModel,
        // eslint-disable-next-line vue/no-unused-components
        JtPagination,
    },
    data(){
        return{
            env: "",
            botid: "",
            userid: "",

            showColumns,
            showColumnsProduce,

            // page
            selectedRowKeys,
            // showEmpty: false,
            showContentFlag: "0",
            allData: [],
            showData: [],

            totalPage: 1,
            recordCount, // 总数
            currentPageIndex: 1,//当前页码
            pageSize: 10,
            pageList: [10, 20, 30],
            isSlip: false,//是否显示每页多少条

            skillid: "",
            skillname: this.$route.query.skillname,

            dates:[],
            rangDate:[],
            keyWord: "",

            deleteConfirmShow: false,
            isShowSearch: false, //搜索框是否显示

            calendarRange: [moment().subtract(1, "months").format("YYYY-MM-DD")],

            questionEmptyImage: require("@/assets/image/noneProject.png"),
            questionSearchNoneImage: require("@/assets/image/noneData.png"),
            
        }
    },
    mounted(){
        this.env = this.$store.state.envInfo.env;
        this.botid = this.$store.state.robotInfo.robotId;
        this.userid = getRandomNum(this.$store.state.userId);

        // this.botid = "5dac8bf474051a2e15e14cd723138db2";
        // this.userid = "CIDC-U-fd0c6a552e3a47bc87dec9f3671bd57d";

        // pre page
        // this.skillname = this.$route.query.skillname;
        this.skillid = this.$route.query.skillid;

        //日历开日期和结束日期中间的符号修改
        const b = document.querySelector(".ant-calendar-range-picker-separator");
        if(b){
            b.innerHTML = '<i class="anticon anticon-swap-right" aria-label="图标: swap-right"><svg viewBox="0 0 1024 1024" data-icon="swap-right" width="1em" height="1em" fill="currentColor" aria-hidden="true" focusable="false" class=""><path d="M873.1 596.2l-164-208A32 32 0 0 0 684 376h-64.8c-6.7 0-10.4 7.7-6.3 13l144.3 183H152c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h695.9c26.8 0 41.7-30.8 25.2-51.8z"></path></svg></i>';
        }

        this.getInitData();

        this.$store.commit(
            'setBreadcrumb',
            [
                {breadcrumbName: this.$store.state.envInfo.envName, breadcrumbPath: this.$store.state.fromPath},
                {breadcrumbName: "场景式对话", breadcrumbPath: "/home/robotHome/sceneDialog"},
                {breadcrumbName: "场景式意图列表"},
            ]
        );
    },
    methods:{
        search(){
            this.isShowSearch = true;
        },
        searchAction(){
            this.getInitData();
        },
        destruction(){
            this.isShowSearch = false;
            this.keyWord = '';
            // query
            this.getInitData();
        },

        getInitData() {
            this.$store.commit('showLoading', {}, { root: true });

            // const skillid = this.$route.params.data.id;
            const url = host + '/api/dialog/query';
            const headers = {};
            const params = {
                "skillid": this.skillid,
                'startDate': this.rangDate[0],
                'endDate': this.rangDate[1],
                'keyWord': this.keyWord,
                'envType': this.env === 'test' ? 0 : 1,
                'userid': this.userid,

                'botid': getRandomNum(this.botid),
            };
            axiosGet(url, params, null, headers).then((response) => {
                const code = response.code;
                if(code === 1){
                    this.showContentFlag = "1";
                    // this.$message.error("查询失败！失败原因：" + response.msg);
                    this.$notification.open({
                        message: "查询失败",
                        description: "失败原因：" + response.msg,
                        icon: ( <jt-icon type="exclamation-circle" theme="filled" style="color:#F04134" /> )
                    });
                }else if(code == -101){
                    this.$store.commit('setGlobalFreeze', {}, { root: true });
                }
                else {
                    this.allData = response.data;
                    // total count
                    this.recordCount =  this.allData.length;
                    this.totalPage = Math.ceil(this.recordCount / this.pageSize);
                    // page show
                    this.currentPageIndex = this.currentPageIndex > this.totalPage && this.totalPage > 0 ? this.totalPage : this.currentPageIndex;
                    this.showData = this.getshowData(this.currentPageIndex);

                    if (this.allData.length === 0 ) {
                        // this.showEmpty = true;
                        if (this.rangDate.length === 0 && this.keyWord === ''){
                            this.showContentFlag = "1";
                        }else{
                            this.showContentFlag = "2";
                        }
                    }else{
                        this.showContentFlag = "0";
                    }

                    this.isSlip = this.recordCount > this.pageSize ? true : false;
                }

                this.$store.commit('hideLoading', {}, { root: true });
            }).catch((error) => {
                // this.showEmpty = true;
                this.showContentFlag = "2";

                console.log({ "errno": 999, "errorMsg": "系统繁忙，请稍后重试。" + error });
                this.$notification.open({
                    message: "查询失败",
                    description: "失败原因：系统繁忙, 请稍后重试。",
                    duration: 0,
                    icon: ( <jt-icon type="exclamation-circle" theme="filled" style="color:#F04134" /> )
                });

                this.$store.commit('hideLoading', {}, { root: true });
            });

        },

        /** page */
        getshowData(pageIndex) {
            return this.allData.slice((pageIndex - 1 ) * this.pageSize, pageIndex * this.pageSize);
        },
        onShowSizeChange(showSizeSelected){
            this.pageSize=this.pageList[showSizeSelected];
            this.currentPageIndex = 1;
            this.totalPage = Math.ceil(this.recordCount / this.pageSize);
            this.showData = this.getshowData(1);
        },
        onPageChange(pageIndex){
            this.currentPageIndex = pageIndex;
            this.showData = this.getshowData(pageIndex);
        },


        onSelectChange(selectedRowKeys) {
            this.selectedRowKeys = selectedRowKeys;
        },

        addIntent(){
            const url = host + '/api/user/intent/count';
            const headers = {};
            const params = {
                'userid': this.userid,

                'botid': getRandomNum(this.botid),
            };
            axiosGet(url, params, null, headers).then((response) => {
                const code = response.code;
                if(code === 1){
                    // this.$message.error("查询失败！失败原因：" + response.msg);
                    this.$notification.open({
                        message: "查询失败",
                        description: "失败原因：" + response.msg,
                        icon: ( <jt-icon type="exclamation-circle" theme="filled" style="color:#F04134" /> )
                    });
                }else if(code == -101){
                    this.$store.commit('setGlobalFreeze', {}, { root: true });
                }
                else {
                    const ok = response.data.ok;
                    if (ok === true){
                        this.$router.push({ name: 'addsceneIntent', query: {skillid: this.skillid, skillname: this.skillname}});
                    }else{
                        this.$message.warn('您当前的对话意图数量已超出限制');
                        console.log('intent_count:', response.data.n)
                    }
                }

            }).catch((error) => {
                this.$notification.open({
                    message: "查询失败",
                    description: "失败原因：系统繁忙, 请稍后重试。",
                    duration: 0,
                    icon: ( <jt-icon type="exclamation-circle" theme="filled" style="color:#F04134" /> )
                });
            });

        },

        editIntent(record){
            this.$router.push({ name: 'addsceneIntent', query: {skillid: this.skillid, skillname: this.skillname, type:"edit", intentid: record.id }});
        },

        //tr点击跳转
        customRow(record){
            return{
                on:{
                    click: (event) => {
                        console.log(event);
                        // this.$router.push({ name: 'addsceneIntent', params: {skillid: this.skillid, skillname: this.skillname, type:"edit", record: record }});
                        this.editIntent(record);
                    }, 
                }
            }
        },

        deleteConfirm(){
            if (this.selectedRowKeys.length > 0) {
                this.deleteConfirmShow = true;
            } else {
                this.$message.warning("您未选择任何意图");
            }
        },

        deleteSubmit(){
            this.deleteConfirmShow = false;
            const url = host + '/api/dialog/remove';
            const headers = {};
            const params = {
                "ids": this.selectedRowKeys.join(",") ,

                "userid": this.userid,
                "botid": getRandomNum(this.botid),
            };
            axiosDelete(url, params, null, headers).then((response) => {
                const code = response.code;
                if(code === 1){
                    this.$notification.open({
                        message: "删除失败",
                        description: "失败原因："+ response.msg ,
                        icon: ( <jt-icon type="exclamation-circle" theme="filled" style="color:#F04134" /> )
                    });
                }else if(code == -101){
                    this.$store.commit('setGlobalFreeze', {}, { root: true });
                }
                else{
                    // this.$message.info("删除成功！");
                    this.$message.success("删除成功！");
                    // 刷新
                    this.selectedRowKeys = [];
                    this.getInitData();
                }
            }).catch((error) => {
                console.log({ "errno": 999, "errorMsg": "系统繁忙，请稍后重试。" + error });
                this.$notification.open({
                    message: "删除失败",
                    description: "失败原因：系统繁忙, 请稍后重试。",
                    duration: 0,
                    icon: ( <jt-icon type="exclamation-circle" theme="filled" style="color:#F04134" /> )
                });
            });
        },

        changeDate(dates, dateStrings){
            let start = dateStrings[0] ;
            let end = dateStrings[1] ;

            if (start.length > 0 &&  end.length > 0){
                start = start + " 00:00:00";
                end = end + " 23:59:59";
            }

            this.rangDate[0] = start;
            this.rangDate[1] = end;
            // query
            this.getInitData();
        },

    },
}
</script>
<style lang="less" scoped>
@import "~@/assets/style/var.less";

div.contentBody {
    // width: 1096px;
    flex: auto;
    // min-height: 609px;
    background: #FFFFFF;
    border-radius: 2px;
    padding: 20px 20px 8px 20px;
    overflow-y: auto;

    .jtTabel{
        table tbody tr {
            border-bottom-color: #fff;
        }
        table tbody tr:hover>td{
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
        /deep/.ant-table-tbody > tr:hover:not(.ant-table-expanded-row):not(.ant-table-row-selected) > td {
            background: #f5f8ff
        }
        tbody>tr>td{
            padding:10px 0 20px 11px!important;
            font-size: @jt-font-size-sm!important;
            color:@jt-color-text!important;
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


    // .emptyData {
    //     display: flex;
    //     flex-direction: column;
    //     // margin-top: 36px;
    //     // margin-left: 348px;
    //     margin: 0 auto;
    //     width: 400px;
    //     height: 360px;
    //     background: url('~@/assets/image/noneData.png') no-repeat center;
    //     background-size: 400px 400px;
    //     .emptyMsgTitle {
    //         text-align: center;
    //         margin-top: 267px;
    //         font-size: 18px;
    //         font-family: 'PingFangSC-Semibold,PingFang SC';
    //         font-weight: 600;
    //         color: #333333;
    //         text-align: center;
    //         margin-bottom: 16px;
    //     }
    //     .emptyMsgDetail {
    //         text-align: center;
    //         font-size: 14px;
    //         font-family: 'PingFangSC-Regular,PingFang SC';
    //         font-weight: 400;
    //         color: #555555;
    //         text-align: center;
    //         margin-bottom: 35px;
    //         a {
    //             color: #337DFF;
    //         }
    //     }
    // }


    .tableTitle {
        width: 231px;
        height: 24px;
        font-size: 16px;
        font-family: 'PingFangSC-Medium,PingFang SC';
        font-weight: 500;
        color: #333333;
        line-height: 22px;
    }
    .createBtn {
        margin-left: 8px;
        width: 88px;
        height: 32px;
        padding: 6px 0;
        font-size: 12px;
        font-family: 'PingFangSC-Regular,PingFang SC';
        font-weight: 400;
        color: #FFFFFF;
        line-height: 20px;
    }
    .exportBtn {
        width: 68px;
        height: 32px;
        padding: 6px 0;
        font-size: 12px;
        font-family: 'PingFangSC-Regular,PingFang SC';
        font-weight: 400;
        color: #333333;
        line-height: 17px;
    }
    .btn-common {
        cursor: pointer;
        color: #555555;
    }
    /deep/ tr {
        transition: color 0s;
        font-family: PingFangSC-Regular,PingFang SC;
        font-weight: 400;
        line-height: 18px;
        &:hover {
            .action-slot, .btn-icon, .btn-common {
                color: #337DFF!important;
            }
        }
        th {
            height: 40px;
            font-size: 12px;
            color: #333333;
            background: #F4F5F7;
            padding: 10px 16px;
        }
        td {
            height: 40px;
            font-size: 12px;
            color: #555555;
            background: #FFFFFF;
            padding: 10px 16px;
        }
    }
}


.search_{
    width:210px;
    animation: mymove 0.5s ease-in-out 0s 1 alternate forwards;    
}
@keyframes mymove
{
    0%{
        width:0px;
    }
    
    100%{
        width:210px;
    }
}
.suffixSearch{
    color: #999;
}
.suffixSearch:hover{
    color: #999;
}

/deep/.ant-table-thead th{
    padding: 0px;
    background:#F4F5F7;
    height: 40px;
}
/deep/.ant-table-row td{
    height: 40px;
    padding: 0px;
}
/deep/.ant-modal-footer{
    padding-top: 16px;
    padding-bottom: 16px;
}
/deep/.ant-modal-footer .ant-btn{
    padding: 0;
    width: 64px;
    height: 32px;
}
/deep/.ant-modal-confirm-body > .anticon + .ant-modal-confirm-title + .ant-modal-confirm-content{
    margin-left: 0;
}
.delBtn:hover{
    color: #F04134;
    border-color:#F04134;
}

</style>