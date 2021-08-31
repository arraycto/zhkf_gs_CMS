<template>
    <div class="contentBody">
        <div style="display: flex; justify-content: space-between;">
            <div class="tableTitle">
                技能列表
            </div>
            <div style="display: flex; align-items: center;">
                <!-- <a class="iconfont searchIcon" @click="todo" style="margin-right: 18px; font-size: 18px; color: #555555;">&#xe622;</a> -->
                <!-- <a class="iconfont reloadIcon" @click="todo" style="margin-right: 10px; font-size: 18px; color: #555555;">&#xe623;</a> -->
                
                <jt-input placeholder="输入技能关键词" type="text" v-model="keyWord"  @keyup.enter="searchAction" style="width:210px;margin-right:16px;" v-show="isShowSearch" class="search_">
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

                <!-- <jt-button v-show="this.env === 'test'" size="large" type="primary" @click="createSkill" class="createBtn">
                    <jt-icon type="plus" style="width:16px; height:16px;" />新建技能
                </jt-button> -->
                <jt-button size="large" type="primary" @click="createSkill" class="newaddbutton" v-if="this.env == 'test'">
                    <jt-icon type="plus" style="margin-right:9px;width:16px;height:16px;line-height:16px;"/><span style="margin-left:0">新建技能</span>
                </jt-button>

                <!-- edit -->
                <jt-modal :width="600" :title="titleName" mask centered :visible="isvisible" :confirmLoading="confirmLoading" @cancel="handleCancel"  @ok="handleOk"> 
                    <jt-form-model :model="form" :rules="rules" :label-col="labelCol" ref="ruleForm">
                        <jt-form-model-item label="技能名称" prop="name" ref="name"  :wrapper-col="wrapperCol">
                            <jt-input placeholder="仅支持中文、英文、数字与下划线，12字以内" v-model="form.name" />
                        </jt-form-model-item>
                        <jt-form-model-item label="技能描述" :wrapper-col="wrapperColTextArea" style="margin-bottom:0;" prop="text" class="formitem">
                            <jt-input type="textarea" placeholder="机器人的功能和使用场景说明" class="text_area" :rows="6" v-model="form.text" @keyup="totalword" :maxLength=249 />
                            <!-- <jt-row style="position: absolute;top:-6px;right:7px;line-height:20px">
                                <jt-col class="totalAreaWord">已输入 <span>{{totalAreaWord}}</span>/200字</jt-col>
                            </jt-row> -->
                        </jt-form-model-item>
                    </jt-form-model>
                    <template slot="footer">
                        <jt-button key="back" style="width: 64px;margin-top: 6px;margin-bottom: 6px;" @click="handleCancel">
                            取消
                        </jt-button>
                        <jt-button :disabled="addRobotSubmit" type="primary" style="width: 64px; margin-right: 4px;" @click="handleOk">
                            确定
                        </jt-button>
                    </template>
                </jt-modal>

            </div>

        </div>

        <div v-if="showContentFlag == '0'" style="margin-top: 16px;">

            <div><!-- :scroll="{y:233}" -->

                <jt-table 
                    class="jtTabel"
                    v-show="env === 'test'"
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
                            <a style="max-width: 230px;color: #555555;">{{text}}</a>
                        </jt-tooltip>
                    </span>

                    <span slot="action-slot" slot-scope="text, record">
                        <span class="btn-common" @click.stop="() => editSkill(record)">
                            <span class="iconfont btn-icon" style="vertical-align: middle; margin-right: 4px; color: #999999;">&#xe614;</span>
                            <span style="vertical-align: middle;">编辑</span>
                        </span>
                    </span>
                </jt-table>
                <jt-table
                    class="jtTabel" tableLayout="fixed"
                    v-show="env !== 'test'"
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
                            <a style="max-width: 230px;color: #555555;">{{text}}</a>
                        </jt-tooltip>
                    </span>
                </jt-table>

                <!-- page  -->
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

                <!-- 删除提示框 -->
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
                            <span style="margin-left: 8px; font-size: 14px; font-weight: 500; color: #333333; line-height: 20px;">条技能吗？</span>
                        </div>
                        <div style="margin-top: 8px; margin-left: 58px;">
                            <span style="font-size: 12px; font-weight: 400; color: #555555; line-height: 18px;">删除后将无法恢复</span>
                        </div>
                        <div style="margin-top: 30px; margin-left: 164px;">
                            <jt-button style="width: 64px; height: 32px; background: #FFFFFF; border-radius:2px; border:1px solid #D9D9D9; padding: 7px 18px; color: #555555; font-size: 12px;" @click="close">取消</jt-button>
                            <jt-button style="margin-left: 8px; width: 64px; height: 32px; background: #FFFFFF; border-radius:2px; border:1px solid #F04134; padding: 7px 18px; color: #F04134; font-size: 12px;" @click="deleteSubmit">删除</jt-button>
                        </div>
                    </div>
                </jt-modal>

            </div>

        </div>
        <div v-if="showContentFlag == '1'" class="emptyData">
            <!-- <div class="emptyMsgTitle">您还没有添加任何场景式对话技能</div>
            <div class="emptyMsgDetail" v-show="env === 'test'">
                <span>您可以 </span>
                <a @click="createSkill()" style="font-size:14px;" >新建技能</a>
                <span>，为机器人添加场景式对话技能 </span>
            </div> -->
            <jt-empty :image="questionEmptyImage" :imageStyle="{margin: 'auto',width: '400px',height: '400px'}">
                <div class="emptyContent" slot="description">
                    <p class="emptyTitle">您还没有添加任何场景式对话技能</p>
                    <p v-show="env === 'test'">您可以 <a href="javascript:;" @click="createSkill()">新建技能</a>，为机器人添加场景式对话技能</p>
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

<style lang="less" scoped>
@import "~@/assets/style/var.less";


div.contentBody {
    // width: 100%;
    flex: auto;

    // min-height: 609px;
    background: #FFFFFF;
    border-radius: 2px;
    padding: 20px 20px 8px 20px;
    overflow-y: auto;
    // height: 100%;
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
    .text_area{
        resize: none;
        // resize: none!important;

    }

    // .emptyData {
    //     display: flex;
    //     flex-direction: column;
    //     margin: 0 auto;
    //     width: 400px;
    //     height: 360px;
    //     background: url('~@/assets/image/noneProject.png') no-repeat center;
    //     background-size: 400px 400px;
    //     background-size:100% 100%;
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
        width: 201px;
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
    .newaddbutton{
        width:88px;
        height:32px;
        padding: 0;
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

            
        }
        td {
            height: 40px;
            font-size: 12px;
            color: #555555;
            background: #FFFFFF;
        }
    }
    /deep/.ant-table-thead th{
        padding: 10px 16px;
        background:#F4F5F7;
        height: 40px;
    }
    /deep/.ant-table-row td{
        height: 40px;
        padding: 10px 16px;
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
.contentMain {
    width: 100%;
    position: absolute;
    top: 58px;
    bottom: 0px;
    padding: 20px 20px 40px 20px;
    display: flex;
}

</style>

<script>
// import Vue from 'vue';
import { axiosGet, axiosPost, axiosDelete }  from "../../../../utils/http.js";
import API from '../../../../constant/api';
import { judgeSensitiveWord, getRandomNum } from "@/utils/common.ts";



const showColumns =[
    {title: '技能名称', dataIndex: 'name', key: 'name', width: 3, ellipsis: true, scopedSlots: {customRender: "ellipsisContent"}},
    {title: '技能描述', dataIndex: 'describe', key: 'describe', width: 6,  ellipsis: true,  scopedSlots: {customRender: "ellipsisContent"}},
    {title: '意图数量', dataIndex: 'count',  key: 'count', width: 3,},
    {title: '编辑人', dataIndex: 'author',  key: 'author', width: 3, ellipsis: true,  scopedSlots: {customRender: "ellipsisContent"}},
    {title: '编辑时间', dataIndex: 'updateTime',  key: 'updateTime', width: 5, },
    {title: '操作', dataIndex: 'action', key: 'action', scopedSlots: { customRender: 'action-slot' }, width: 3 }
];
const showColumnsProduce =[
    {title: '技能名称', dataIndex: 'name', key: 'name', width: 3, ellipsis: true, scopedSlots: {customRender: "ellipsisContent"}},
    {title: '技能描述', dataIndex: 'describe', key: 'describe', width: 7, ellipsis: true, scopedSlots: {customRender: "ellipsisContent"}},
    {title: '意图数量', dataIndex: 'count',  key: 'count', width: 2, },
    {title: '编辑人', dataIndex: 'author',  key: 'author', width: 2, ellipsis: true,  scopedSlots: {customRender: "ellipsisContent"}},
    {title: '编辑时间', dataIndex: 'updateTime',  key: 'updateTime', width: 3,},
];
const selectedRowKeys = [];
// const recordCount = 0;

// edit
const titleName = "新建场景式对话技能";
const isvisible = false;//modal是否可见
const confirmLoading = false;
const labelCol = { span: 4 };//表单文字布局
const wrapperCol = { span: 16 };//表单控件布局
const wrapperColTextArea = { span: 19};
const totalAreaWord = 0;//Textarea统计字数初始化为0
//表单初始赋值
const form  = {
    name:'',
    text:'',
    id: '',
    desc: '',
};

const host = API.port5001.host;
// const host = "http://127.0.0.1:5001";


import {Modal as JtModal} from "ant-design-vue";
import {FormModel  as JtFormModel} from "ant-design-vue";
import {Pagination as JtPagination} from "ant-design-vue";
import {DatePicker as JtDatePicker}  from "ant-design-vue";
// import { Inject } from 'vue-property-decorator';
// import api from '../../../../constant/api';
import moment from 'moment'

export default {
    // Inject: ["getInitData"],
    inject: ['reload'],
    components:{
        // eslint-disable-next-line vue/no-unused-components
        JtModal,
        JtFormModel,
        // eslint-disable-next-line vue/no-unused-components
        JtPagination,
        // eslint-disable-next-line vue/no-unused-components
        JtDatePicker,
        
    },
    data(){
        return{
            env: "",
            botid: "",
            userid: "",

            showColumns,
            showColumnsProduce,

            allData: [],
            showData: [],
            pageSize: 10,
            pageList: [ 10, 20, 30],
            totalPage: 1,
            recordCount: 0, // 总数
            currentPageIndex: 1,//当前页码
            isSlip: false,//是否显示每页多少条
            selectedRowKeys,

            titleName,
            isvisible,
            confirmLoading,
            labelCol,
            wrapperCol,
            wrapperColTextArea,
            totalAreaWord,
            form: {
                name:'',
                text: ''
            },
            rules : {
                name: [
                    {required:true, trigger: ['change','blur'], validator:this.validatorName},
                ],
                text: [
                    { trigger: ['change','blur'], validator: this.validatorText}
                ]
            },

            dates: [],
            rangDate: [],
            keyWord: '',

            deleteConfirmShow: false,

            // showEmpty: false, // 是否显示空数据页面
            showContentFlag: "0",
            isShowSearch: false, //搜索框是否显示

            calendarRange: [moment().subtract(1, "months").format("YYYY-MM-DD")],

            questionEmptyImage: require("@/assets/image/noneProject.png"),
            questionSearchNoneImage: require("@/assets/image/noneData.png"),
            nameValid: false,
            textValid: false,

        }
    },
    mounted(){
        this.env = this.$store.state.envInfo.env;
        this.botid = this.$store.state.robotInfo.robotId;
        // this.botid = "002a1e55db5e6d414bfce578c7be6b7631e";
        // this.botid = "5dac8bf474051a2e15e14cd723138db2";

        this.userid = getRandomNum(this.$store.state.userId);
        // this.userid = getRandomNum("CIDC-U-fd0c6a552e3a47bc87dec9f3671bd57d");
        // this.userid = "CIDC-U-fd0c6a552e3a47bc87dec9f3671bd57d";

        //日历开日期和结束日期中间的符号修改
        const b = document.querySelector(".ant-calendar-range-picker-separator");
        if(b){
            b.innerHTML = '<i class="anticon anticon-swap-right" aria-label="图标: swap-right"><svg viewBox="0 0 1024 1024" data-icon="swap-right" width="1em" height="1em" fill="currentColor" aria-hidden="true" focusable="false" class=""><path d="M873.1 596.2l-164-208A32 32 0 0 0 684 376h-64.8c-6.7 0-10.4 7.7-6.3 13l144.3 183H152c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h695.9c26.8 0 41.7-30.8 25.2-51.8z"></path></svg></i>';
        }

        // init data
        this.getInitData();

        this.$store.commit(
            'setBreadcrumb',
            [
                {breadcrumbName: this.$store.state.envInfo.envName, breadcrumbPath: this.$store.state.fromPath},
                {breadcrumbName: "场景式对话"}
            ]
        );
    },
    computed: {
        addRobotSubmit() {
            return !(this.nameValid && this.textValid)
        }
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

            const url = host + '/api/skill/query';
            const headers = {};
            const params = {
                'botid': getRandomNum(this.botid),
                'type': "1",
                'startDate': this.rangDate[0],
                'endDate': this.rangDate[1],
                'keyWord': this.keyWord,
                'envType': this.env === 'test' ? 0 : 1,

                'userid': this.userid,
            };
            axiosGet(url, params, null, headers).then((res) => {
                // const response = res;
                const code = res.code;
                if(code == 1){
                    this.showContentFlag = "1";
                    this.showErrorNotification('查询失败', res.msg)
                } else if(code == -101){
                    this.$store.commit('setGlobalFreeze', {}, { root: true });
                }
                else{
                    this.allData = res.data;
                    // total count
                    this.recordCount =  this.allData.length;
                    this.totalPage = Math.ceil(this.recordCount / this.pageSize);

                    // page show
                    this.currentPageIndex = this.currentPageIndex > this.totalPage && this.totalPage > 0 ? this.totalPage : this.currentPageIndex;
                    this.showData = this.getshowData(this.currentPageIndex);

                    if (this.allData.length === 0 ) {
                        if (this.rangDate.length === 0 && this.keyWord === ''){
                            this.showContentFlag = "1";
                        }else{
                            this.showContentFlag = "2";
                        }
                        
                    } else{
                        this.showContentFlag = "0";
                    }

                    this.isSlip = this.recordCount > this.pageSize ? true : false;
                }

                this.$store.commit('hideLoading', {}, { root: true });
            }).catch( (error) => {
                console.log({ "errno": 999, "errorMsg": "系统繁忙，请稍后重试。" + error });
                this.showCatchNotification('查询失败', '系统繁忙，请稍后重试。');
                // this.showEmpty = true;
                this.showContentFlag = "2";
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

        createSkill() {
            this.form.name = '';
            this.form.text = '';
            this.form.id = '';
            this.isvisible = true;
            this.totalAreaWord = 0;
            this.nameValid = false
            this.textValid = false
        },
        //技能名称验证
        validatorName(rule ,value ,callback){
            // const pattern = /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/img;
            const pattern=/^[a-zA-Z0-9_\u4e00-\u9fa5\uff41-\uff5a\uff21-\uff3a\uFF10-\uFF19]+$/;

            // MGC
            const responseMGC = judgeSensitiveWord(value);

            if (value === '') {
                this.nameValid = false;
                callback(new Error('技能名称为必填项'));
            }else if(value.length>12){
                this.nameValid = false;
                callback(new Error('超出字数限制，最多12字'));
            }
            else if(!pattern.test(value)){
                this.nameValid = false;
                callback(new Error('只能为英文、数字、下划线和中文'));
            }
            else if(!responseMGC.detectedResult){
                this.nameValid = false;
                callback(new Error(responseMGC.errorMsg));
            }else{
                this.nameValid = true;
                if(this.form.text.match(/^[ ]*$/)){
                    this.textValid = true
                }
                callback();
            }
        },
        //技能描述验证
        validatorText(rule ,value ,callback){
            if(value) {
                // MGC
                const responseMGC = judgeSensitiveWord(value);
                if(value.length>200){
                    this.textValid = false;
                    callback(new Error('超出字数限制，最多200字'));
                }else if(!responseMGC.detectedResult){
                    this.textValid = false;
                    callback(new Error(responseMGC.errorMsg));
                }else{
                    this.textValid = true;
                    callback();
                }
            }else {
                this.textValid = true;
                callback();
            }
            
        },
        //Textarea字数统计
        totalword(){
            const areaObj = document.querySelector(".text_area");
            if(areaObj){
                const word = areaObj.value.length;
                this.totalAreaWord = word;
            }
        },
        //modal框各个执行函数
        handleCancel(){
            this.$refs.ruleForm.resetFields();//表单重置
            this.isvisible = false;
            this.nameValid = false
            this.textValid = false
        },
        handleOk(){
            console.log('ok')
            this.$refs.ruleForm.validate(valid =>{
                if(valid){
                    console.log('ok111')
                    // this.$store.commit('showLoading', {}, { root: true });
                    
                    const url = host + '/api/skill/update';
                    const data = {
                        "describe": this.form.text,
                        "name": this.form.name,
                        "type": "1",
                        "userid": this.userid,
                        "botid": getRandomNum(this.botid),
                        "id": this.form.id,
                    };
                    
                    let saveMsg = "技能创建成功";
                    if (this.form.id.length > 0){
                        saveMsg = "保存成功";
                    }

                    const params = {};
                    axiosPost(url, params, data, {}).then((response) => {
                        const code = response.code;
                        if(code === 1){
                            this.showErrorNotification('保存失败', response.msg)
                        }else if(code == -101){
                            this.$store.commit('setGlobalFreeze', {}, { root: true });
                        }
                        else{
                            this.$message.success(saveMsg);
                            
                            this.handleCancel();
                            this.getInitData();
                        }

                        // this.$store.commit('hideLoading', {}, { root: true });
                    }).catch( (error) => {
                        console.log({ "errno": 999, "errorMsg": "系统繁忙，请稍后重试。" + error });
                        this.showCatchNotification('保存失败', '系统繁忙，请稍后重试。');

                        // this.$store.commit('hideLoading', {}, { root: true });
                    });
                }
            });
        },
        close(){
            this.deleteConfirmShow = false;
        },
        editSkill(record){
            this.titleName = "编辑场景式对话技能";
            this.isvisible = true;
            this.form.name = record.name;//技能名称赋值
            this.form.text = record.describe;
            this.form.id = record.id;
            this.totalAreaWord = record.describe.length;
            this.nameValid = true
            this.textValid = true
        },

        deleteSubmit(){
            this.deleteConfirmShow = false;
            const url = host + '/api/skill/remove';
            const headers = {};
            // this.selectedRowKeys.join(',')
            const params = {
                "ids":  this.selectedRowKeys.join(','),
                "type": "1",

                "userid": this.userid,
                "botid": getRandomNum(this.botid),
            };

            axiosDelete(url, params, null, headers).then((response)  => {
                
                if(response != undefined){
                    const code = response.code;
                    if(code === 1){
                        // this.$message.error("删除失败！失败原因：" + response.msg + "。 请稍后重试");
                        this.showErrorNotification('删除失败', response.msg )
                    }else if(code == -101){
                        this.$store.commit('setGlobalFreeze', {}, { root: true });
                    }
                    else{
                        this.$message.success("删除成功！");
                        // 刷新数据
                        this.selectedRowKeys = [];
                        // page 

                        this.getInitData();

                    }
                }else{
                    console.log("error: ", response);
                }
                
            }).catch( (error) => {
                console.log({ "errno": 999, "errorMsg": "系统繁忙，请稍后重试。" + error });
                this.showCatchNotification('删除失败', '系统繁忙，请稍后重试。');
            });
            
        },

        deleteConfirm(){
            if (this.selectedRowKeys.length > 0) {
                this.deleteConfirmShow = true;
            } else {
                this.$message.warning("您未选择任何技能");
            }
        },

        //tr点击跳转
        customRow(record){
            return{
                on:{
                    click: (event) => {
                        console.log(event);
                        this.$router.push({ name: 'sceneIntent', query: { skillname:record.name, skillid:record.id }});
                    }, 
                }
            }
        },

        
        todo() {
            this.$message.info("TODO");
        },

        showErrorNotification(title, errorMsg) {
            this.$notification.open({
                message: title,
                description: "失败原因：" + errorMsg ,
                icon: (<jt-icon type="exclamation-circle" theme="filled" style="color:#F04134"/>)
            });
        },
        showCatchNotification(title, errorMsg) {
            this.$notification.open({
                message: title,
                description: "失败原因：" + errorMsg ,
                icon: (<jt-icon type="exclamation-circle" theme="filled" style="color:#F04134"/>),
                duration: 0
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
            this.getInitData()
        },
        
        

    },
    
};
</script>
