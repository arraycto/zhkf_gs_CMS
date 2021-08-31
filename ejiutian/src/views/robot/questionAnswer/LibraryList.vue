<template>
    <div class="contentBody">
        <div style="display: flex; justify-content: space-between;">
            <div class="tableTitle">
                问答列表
            </div>
            <div style="display: flex; align-items: center;overflow:hidden">
                <a @click="openKeywordSearch" v-show="!keywordSearchDisplay" class="icon iconfont iconsousuo searchIcon" />
                <jt-input placeholder="请输入标准问题关键字" v-show="keywordSearchDisplay" style="width: 200px; margin-right: 8px; color: #555555;" v-model="searchKeyword" v-on:keyup.enter="keywordSearchSubmit" class="searchInput">
                    <a slot="suffix" class="icon iconfont iconsousuo" style="font-size: 16px; color: #999999;" @click="keywordSearchSubmit"></a>
                    <span slot="suffix" class="searchDividerLine"></span>
                    <jt-icon slot="suffix" type="close" style="font-size: 14px; color: #999999;" @click="closeKeywordSearch" class="searchClose"></jt-icon>
                </jt-input>
                <jt-divider type="vertical" style="margin-right: 18px; height: 16px; color: #E9EBEF;" />
                <jt-range-picker
                    :allowClear="true"
                    @change="keywordSearchSubmit"
                    separator="-"
                    style="width: 216px; margin-right: 8px;"
                    :popupStyle="{zIndex:0}"
                    :defaultPickerValue="calendarRange"
                >
                    <jt-icon slot="suffixIcon" type="calendar" style="margin-left:8px;"/>
                </jt-range-picker>
                <div
                    class="exportBtn importBtn"
                    v-if="env === 'test'" 
                >
                    <span class="iconfont icondaoru" style="font-size: 14px;" @click="importportExcel"/>
                    <span style="font-size: 12px; margin-left: 8px;padding-right:12px" @click="importportExcel">导入 </span>
                    <span style="color:#D9D9D9">|</span>
                    <span style="padding: 0 12px;color:#337DFF;" @click="toImportDetail">详情</span>
                </div>

                <jt-button
                    v-show="showContentFlag == '0'"
                    size="large"
                    @click="exportExcel"
                    class="exportBtn"
                >
                    <span class="iconfont icondaochu" style="font-size: 14px;" />
                    <span style="font-size: 12px; margin-left: 8px;">导出</span>
                </jt-button>
                <jt-modal v-model="importVisible" :title="exportTitle"  :width='600' class='import-modal'>
                    <jt-upload-dragger
                        :file-list="fileList" :remove="handleRemove" :before-upload="beforeUpload"
                        v-show="upload"
                    >

                        <p class="ant-upload-drag-icon">
                            <jt-icon type="cloud-upload" class='icon'/>
                        </p>
                        <p class="ant-upload-text">
                            <span>拖拽文件到此处或者 </span>
                            <span class="ant-upload-color">点击上传</span>
                        </p>
                        <p style="color:red;height:14px">
                            {{uploadErrorMsg}}
                        </p>
                    </jt-upload-dragger>
                    <div v-show="!upload" class='uploaded-file'>
                        <p class="ant-upload-drag-icon" style="margin-top:20px;">
                            <jt-icon type="file-excel" class='icon' theme="filled" :style="{ fontSize: '48px',color:'#51AD6C'}" />
                        </p>
                        <p style="margin-bottom:0;line-height:18px">{{importFileName}}</p>
                        <jt-upload :file-list="fileList" :remove="handleRemove" :before-upload="beforeUpload">
                            <p class="ant-upload-text" style="line-height:18px">
                                <span style="color:red;height:14px;margin-right:5px">{{uploadErrorMsg | splitError}}</span>
                                <span class="ant-upload-color">重新上传</span>
                            </p>
                        </jt-upload>
                    </div>
                    <div>
                        <ul class='upload-require'>
                            <li>
                                支持上传.xlsx格式文件， 不超过10MB，编码仅支持UTF-8
                            </li>
                            <li>
                                每次导入限一个文件，文件中标准问题数量不超过2000
                            </li>
                            <li>
                                仅支持导入标准问题、相似问题、答案，问题字数不超过125字，答案字数不超过2000字，相似问题数目不超过100条
                            </li>
                            <li>
                                首行为表头，请勿修改。内容之间不允许有空行
                            </li>
                            <span class="ant-upload-color" @click="downloaddemo">参考demo下载</span>
                        </ul>
                    </div>
                    <!-- <div>
                        <jt-checkbox @change="onChange">
                            覆盖导入
                        </jt-checkbox>
                        <span style="color:#999">（问答库的内容将被清空，替换为导入的内容）</span>
                    </div> -->
                    <template slot="footer">
                        <jt-button key="back" @click="handleCancel">
                            取消
                        </jt-button>
                        <jt-button key="submit" type="primary"  @click="handleOk" :disabled="isClick">
                            确定
                        </jt-button>
                    </template>
                </jt-modal>
                <jt-button
                    v-show="showContentFlag != '0'"
                    disabled
                    size="large"
                    style="width: 78px; height: 32px;"
                >
                    <span class="iconfont icondaochu" style="font-size: 14px;" />
                    <span style="font-size: 12px; margin-left: 8px;">导出</span>
                </jt-button>
                <!-- <jt-button
                    :disabled="showEmpty"
                    size="large"
                    @click="function() {exportVisible = true}"
                    class="exportBtn"
                    style="border-radius:0px 2px 2px 0px;"
                >
                    <span class="iconfont icondaochu" style="font-size: 12px;">导出</span>
                </jt-button>
                <jt-modal
                    title="导出问答"
                    :visible="exportVisible"
                    centered
                    :bodyStyle="{padding: '0px'}"
                    width="500px"
                    @ok="exportSubmit"
                    @cancel="function() {exportVisible = false}"
                >
                    <div style="padding: 40px 0px 32px 64px; display: flex; flex-flow: column;">
                        <div><span style="font-size: 12px; color: #333333;">{{exportFileName}}</span></div>
                        <div style="margin-top: 16px; display: flex; flex-flow: row; align-items: center;">
                            <span style="font-size: 12px; color: #333333;">保存至</span>
                            <jt-input type="file" id="exportPath" style="width: 240px; margin-left: 9px; color: #FFFFFF; border-radius:2px; border:1px solid #D9D9D9;" v-model="exportFilePath"/>
                            <jt-button size="large" @click="openFile" style="margin-left: 8px; width: 32px; height: 32px; color: #555555; border-radius:2px; border:1px solid #D9D9D9;">选择</jt-button>
                        </div>
                        <div style="margin-top: 16px; margin-left: 55px; display: flex; flex-flow: row; align-items: center;">
                            <span>设为默认路径</span>
                        </div>
                    </div>
                </jt-modal> -->
                <jt-button v-show="env === 'test'" size="large" type="primary" @click="createQA" class="createBtn">
                    <jt-icon type="plus" style="font-size: 14px;" />
                    <span style="font-size: 12px; margin-left: 9px;">新建问答</span>
                </jt-button>
            </div>
        </div>
        <div v-if="showContentFlag == '0'" style="margin-top: 16px;">
            <div>
                <jt-table
                    :columns="tableTitles"
                    :dataSource="showData"
                    :pagination="false"
                    rowKey="id"
                    :row-selection="env === 'test' ? { selectedRowKeys: selectedRowKeys, onChange: onSelectChange, columnWidth: 40 } : null"
                    :customRow="showDetail"
                >
                    <span slot="questionId" slot-scope="text">
                        <jt-tooltip placement="topLeft">
                            <template slot="title">
                                <span>{{text}}</span>
                            </template>
                            <a style="max-width: 230px;color: #555555;">{{text}}</a>
                        </jt-tooltip>
                    </span>
                    <span slot="questionContent" slot-scope="text">
                        <jt-tooltip placement="topLeft">
                            <template slot="title">
                                <span>{{text}}</span>
                            </template>
                            <a style="max-width: 230px;color: #555555;">{{text}}</a>
                        </jt-tooltip>
                    </span>
                    <span slot="answerContent" slot-scope="text,record">
                        <jt-tooltip placement="topLeft">
                            <template slot="title">
                                <span>{{ setPicOrVio(text) }}</span>
                            </template>
                            <a v-if="record.flag != '0'" style="max-width: 230px;color: #337dff;width:100%;display:block" @click.stop="answerLook(record)">查看</a>
                            <a v-else style="max-width: 230px;color: #555555;width:100%;display:block">{{ text }}</a>
                        </jt-tooltip>
                    </span>
                    <span slot="questionEditor" slot-scope="text">
                        <jt-tooltip placement="topLeft">
                            <template slot="title">
                                <span>{{text}}</span>
                            </template>
                            <a style="max-width: 230px;color: #555555;">{{text}}</a>
                        </jt-tooltip>
                    </span>
                    <span slot="questionEditTime" slot-scope="text">
                        <jt-tooltip placement="topLeft">
                            <template slot="title">
                                <span>{{text}}</span>
                            </template>
                            <a style="max-width: 230px;color: #555555;">{{text}}</a>
                        </jt-tooltip>
                    </span>
                    <!-- <span slot="action-slot" slot-scope="">
                        <span class="btn-common" @click="todo">
                            <span class="iconfont btn-icon" style="vertical-align: middle; margin-right: 4px; color: #999999;">&#xe614;</span>
                            <span style="vertical-align: middle;">编辑</span>
                        </span>
                    </span> -->
                </jt-table>
            </div>
            <div style="display: flex; flew-flow: row; justify-content: space-between; margin-top: 16px;">
                <div style="text-align: left;">
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
                                <span style="margin-left: 8px; font-size: 14px; font-weight: 500; color: #333333; line-height: 20px;">条问题吗？</span>
                            </div>
                            <div style="margin-top: 8px; margin-left: 58px;">
                                <span style="font-size: 12px; font-weight: 400; color: #555555; line-height: 18px;">删除后将无法恢复</span>
                            </div>
                            <div style="margin-top: 30px; margin-left: 164px;">
                                <jt-button size="large" @click="function() {deleteConfirmShow = false}">取消</jt-button>
                                <jt-button size="large" style="margin-left: 8px;" class="deleteBtn" type="danger" @click="deleteSubmit">删除</jt-button>
                            </div>
                        </div>
                    </jt-modal>
                    <jt-button v-show="env === 'test'" size="large" class="deleteBtn" @click="deleteConfirm">删除</jt-button>
                    <span style="margin-left: 16px;">共 {{recordCount}} 条记录</span>
                    <span class="pageOption" style="margin-left: 15px;" v-show="recordCount > 10">每页显示</span>
                    <jt-select
                        :defaultValue="10"
                        style="min-width: 50px; margin: 0 5px;"
                        @change="getShowSizeChangeData"
                        v-show="recordCount > 10"
                    >
                        <jt-icon slot="suffixIcon" type="caret-down" :style="{ color: '#606266',marginRight:'-7px' }"/>
                        <jt-select-option :value="10">10</jt-select-option>
                        <jt-select-option :value="20">20</jt-select-option>
                        <jt-select-option :value="30">30</jt-select-option>
                    </jt-select>
                    <span v-show="recordCount > 10">条</span>
                </div>
                <div style="text-align: right;">
                    <jt-pagination
                        showQuickJumper
                        :current="currentPage"
                        :pageSize="pageSize"
                        :total="recordCount"
                        @change="getPageChangeData"
                        style="text-align: right;"
                        v-show="recordCount > 10"
                    />
                </div>
            </div>
        </div>
        <div v-if="showContentFlag == '1'" style="margin-top: 55px;">
            <jt-empty :image="questionEmptyImage" :imageStyle="{margin: 'auto',width: '400px',height: '400px'}">
                <div class="emptyContent" slot="description">
                    <p class="emptyTitle">你还没有添加任何问答</p>
                    <p v-show="env === 'test'">您可以 <a href="javascript:;" @click="createQA">新建问答</a>，为机器人添加问答</p>
                </div>
            </jt-empty>
        </div>
        <div v-if="showContentFlag == '2'" style="margin-top: 55px;">
            <jt-empty :image="questionSearchNoneImage" :imageStyle="{margin: 'auto',width: '400px',height: '400px'}">
                <div class="emptyContent" slot="description">
                    <p class="emptyTitle">抱歉，没有匹配到任何搜索结果</p>
                    <p>您可以换一个关键词试试哦～</p>
                </div>
            </jt-empty>
        </div>
        <jt-modal
            :closable="true"
            :footer="null"
            centered
            v-model="checkAnwer"
            :afterClose="afterClose"
            :bodyStyle="{padding: '0px'}"
            height='fit-content'
            class="examine"
            v-dialogDrag
        >
            <div class="titleMoal">点此拖拽</div>
            <img 
                v-if="editUrlImg != ''" 
                :src="editUrlImg" 
                style="width:100%;min-height:56px" 
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
    background: #FFFFFF;
    border-radius: 2px;
    padding: 20px 20px 40px 20px;
    overflow-y: auto;
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
    .searchIcon {
        font-size: 18px;
        margin-right: 8px;
        color: #555555;
        &:hover {
            color: #337DFF!important;
        }
    }
    .tableTitle {
        width: auto;
        height: 24px;
        font-size: 16px;
        font-family: "PingFangSC-Medium,PingFang SC";
        font-weight: 500;
        color: #333333;
        line-height: 22px;
    }
    /deep/ .createBtn {
        margin-left: 8px;
        width: 88px;
        height: 32px;
        font-size: 12px;
        font-family: "PingFangSC-Regular,PingFang SC";
        font-weight: 400;
        color: #FFFFFF;
        line-height: 20px;
        padding: 0px;
    }
    /deep/ .exportBtn {
        width: 78px;
        height: 32px;
        font-size: 12px;
        font-family: "PingFangSC-Regular,PingFang SC";
        font-weight: 400;
        color: #333333;
        line-height: 30px;
        border-radius:0px 2px 2px 0px;
        padding: 0px;
        &:hover {
            color: #337DFF!important;
        }
    }
    //导入
    .importBtn {
        width:auto;
        padding-left:12px;
        background-color:#fff;
        border-radius: 2px 0px 0px 2px;
        border: 1px solid #D9D9D9;
        cursor: pointer;
    }
    .importBtn:hover,.importBtn:focus {
        border-color: #337DFF;
        outline: 0;
    }
    /deep/.import-modal .ant-modal-body {
        padding: 15px 100px;
        font-size: 12px;
        .ant-upload.ant-upload-drag .ant-upload {
            padding: 16px 0 9px 0
        }
        .ant-upload.ant-upload-drag {
            background: #fff;
        }
        .ant-upload-drag-icon {
            margin-bottom:8px;
        }
        .ant-upload.ant-upload-drag p.ant-upload-drag-icon .anticon {
            color: #999899;
        }
        .ant-upload-text {
            color: #999;
        }
        .ant-upload-color {
            color: #337DFF;
            cursor: pointer;
        }
        .upload-require {
            list-style: disc;
            color: #999;
            margin-left: 15px;
            margin-top: 8px;
            margin-bottom: 16px;
        }
        .uploaded-file {
            background: #FFFFFF;
            border-radius: 2px;
            border: 1px solid #D9D9D9;
            text-align: center;
            .ant-upload.ant-upload-select {
                margin-bottom: 8px;
            }
        }
        .ant-upload-list.ant-upload-list-text {
            display: none;
        }
    }
    //导入
    .deleteBtn {
        width: 64px;
        height: 32px;
        padding: 6px 0;
        font-size: 12px;
        font-family: "PingFangSC-Regular,PingFang SC";
        font-weight: 400;
        color: #555555;
        line-height: 17px;
        border-radius:2px;
        border:1px solid #D9D9D9;
    }
    .deleteBtn:hover {
        border:1px solid #E02020;
        color: #F04134;
    }
    .searchInput {
        width: 210px;
        animation: inputMove 0.3s ease-in-out 0s 1 alternate forwards;
    }
    @keyframes inputMove {
        0% {width: 0px;}
        100% {width: 210px;}
    }
    .searchClose {
        animation: inputClose 0.3s ease-in-out;
    }
    @keyframes inputClose {
        0% {width: 0px;}
        100% {width: 16px;}
    }
    .searchDividerLine {
        height: 16px;
        width: 1px;
        background: #E9EBEF;
        margin-right: 6px;
        margin-left: 6px;
        display: inline-block;
        vertical-align: text-top;
    }
    .btn-common {
        cursor: pointer;
        color: #555555;
    }
    /deep/ tr {
        transition: color 0s;
        font-family: "PingFangSC-Regular,PingFang SC";
        font-weight: 400;
        line-height: 18px;
        &:hover {
            cursor: pointer;
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
    .examine {
        /deep/.ant-modal {
            max-width: 600px;
        }
        .titleMoal {
            width: 100%;
            height: 20px;
            background-color: #ccc;
            border-radius: 2px 2px 0 0;
            text-align: center;
            color: #fff;
            font-size: 12px;
        }   
        /deep/.ant-modal-close {
            height: 20px;
            width: 20px;
            .ant-modal-close-x {
                height: 20px;
                width: 20px;
                line-height: 20px;
                color: #fff;
            }
        }
        /deep/.ant-modal-body {
            video {
                width:100%;
                max-height:500px;
            }
            img {
                width:100%;
                min-height:56px;
            }
        }
    }
}
</style>

<script>
import { mapActions } from "vuex";
import { Md5 } from "ts-md5/dist/md5";
import { exportJsonToExcel, formatJson } from "@/components/Export2Excel.js";
import moment from 'moment';
import { Upload } from "ant-design-vue";
import { axiosPost,axiosDownLoad } from "@/utils/http.js";
import API from '@/constant/api';
// import { Card } from 'ant-design-vue';

const tableTitles = [
    {
        title: "问题ID",
        dataIndex: "id",
        key: "id",
        width: 120,
        ellipsis: true,
        scopedSlots: {customRender: "questionId"}
    },
    {
        title: "标准问",
        dataIndex: "question",
        key: "question",
        width: 200,
        ellipsis: true,
        scopedSlots: {customRender: "questionContent"}
    },
    {
        title: "答案",
        dataIndex: "answer",
        key: "answer",
        width: 280,
        ellipsis: true,
        scopedSlots: {customRender: "answerContent"}
    },
    {
        title: "编辑人",
        dataIndex: "editor",
        key: "editor",
        width: 130,
        ellipsis: true,
        scopedSlots: {customRender: "questionEditor"}
    },
    {
        title: "编辑时间",
        dataIndex: "editTime",
        key: "editTime",
        width: 180,
        ellipsis: true,
        scopedSlots: {customRender: "questionEditTime"}
    },
    // {
    //     title: "操作",
    //     dataIndex: "action",
    //     key: "action",
    //     scopedSlots: { customRender: "action-slot" }
    // }
];

export default {
    name: "RobotHome",
    inject: ['reload'],
    components:{
        'jt-upload':Upload,
        'jt-upload-dragger':Upload.Dragger
    },
    data() {
        return {

            //导入
            fileList: [],
            importVisible: false,
            exportTitle: '导入问答',
            upload: true,
            importFileName:'',
            isCover: false,
            uploadErrorMsg: '',
            isClick: true,
            
            //导 入

            env: "",
            tableTitles,
            keywordSearchDisplay: false,
            searchKeyword: "",
            startDate: "",
            endDate: "",
            allData: [],
            showData: [],
            pageSize: 10,
            recordCount: 0,
            currentPage: 1,
            selectedRowKeys: [],
            selectedRows:[],
            selectedRowQuestionMd5: [],
            showContentFlag: "0",
            exportVisible: false,
            exportFileName: "",
            exportFilePath: "",
            deleteConfirmShow: false,
            calendarRange: [moment().subtract(1, "months").format("YYYY-MM-DD")],
            questionEmptyImage: require("@/assets/image/noneProject.png"),
            questionSearchNoneImage: require("@/assets/image/noneData.png"),
            checkAnwer: false,
            editUrlImg: "",
            editUrlVio: ""
        }
    },
    mounted() {
        this.initPage();
        this.setExportFileName();
        const separatorSymbol = document.querySelector(".ant-calendar-range-picker-separator");
        if(separatorSymbol){
            separatorSymbol.innerHTML = '<i class="anticon anticon-swap-right" aria-label="图标: swap-right"><svg viewBox="0 0 1024 1024" data-icon="swap-right" width="1em" height="1em" fill="currentColor" aria-hidden="true" focusable="false" class=""><path d="M873.1 596.2l-164-208A32 32 0 0 0 684 376h-64.8c-6.7 0-10.4 7.7-6.3 13l144.3 183H152c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h695.9c26.8 0 41.7-30.8 25.2-51.8z"></path></svg></i>';
        }
    },
    methods: {
        moment,
        ...mapActions({
            queryQuestionList: "questionAnswer/queryQuestionList",
            deleteQuestion: "questionAnswer/deleteQuestion",
            queryStandardQuestionByParams: "questionAnswer/queryStandardQuestionByParams",
            getPicOrVio: "questionAnswer/getPicOrVio"
        }),
        setExportFileName() {
            const year = new Date().getFullYear();
            const month = new Date().getMonth() + 1;
            const day = new Date().getDate();
            this.exportFileName = "问答" + year + month + day;
        },
        initPage() {
            const data = {
                route: this.$route.query,
                pageSize: this.pageSize,
                currentPage: this.currentPage
            };
            this.env = this.$store.state.envInfo.env,
            this.queryQuestionList(data).then(res => {
                if (res.errno === 0 || res.errno === -100) {
                    this.allData = this.$store.state.questionAnswer.questionList;
                    this.recordCount = this.allData[0].faqNum;
                    // this.showData = this.getshowData(this.currentPage);
                    this.showData = this.allData;
                    if (res.errno === -100) {
                        this.$message.warning("您当前的问答数量已超出限制");
                    }
                    if (this.allData.length === 0) {
                        this.showContentFlag = "1";
                    }else{
                        this.showContentFlag = "0";
                    }
                } else {
                    this.showErrorNotification("查询失败！", res.errno, res.errorMsg);
                }
            });
            // setting breadcrumb of robot home
            this.$store.commit(
                'setBreadcrumb',
                [
                    {breadcrumbName: this.$store.state.envInfo.envName, breadcrumbPath: this.$store.state.fromPath},
                    {breadcrumbName: "问答库"}
                ]
            );
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
        openKeywordSearch() {
            this.keywordSearchDisplay = !this.keywordSearchDisplay;
            this.searchKeyword = "";
        },
        closeKeywordSearch() {
            this.keywordSearchDisplay = !this.keywordSearchDisplay;
            this.searchKeyword = "";
            this.keywordSearchSubmit();
        },
        keywordSearchSubmit(date, dateString) {
            if (dateString) {
                this.startDate = dateString[0];
                this.endDate = dateString[1];
            }
            const params = {
                keyword: this.searchKeyword,
                startDate: this.startDate,
                endDate: this.endDate
            }
            this.queryStandardQuestionByParams(params).then(res => {
                if (res.errno === 0) {
                    this.currentPage = 1;
                    this.allData = res.result;
                    this.recordCount = this.allData.length;
                    this.showData = this.getshowData(this.currentPage);
                    if (this.allData.length === 0) {
                        this.showContentFlag = "2";
                    } else {
                        this.showContentFlag = "0";
                    }
                } else {
                    this.showErrorNotification("查询失败！", res.errno, res.errorMsg);
                }
            });
        },
        getshowData(pageIndex) {
            return this.allData.slice((pageIndex - 1 ) * this.pageSize, pageIndex * this.pageSize);
        },
        getShowSizeChangeData(showSizeSelected) {
            const dataIndexBeforeChange = (this.currentPage - 1) * this.pageSize
            this.pageSize = showSizeSelected;
            const currentPageAfterChange = Math.floor(dataIndexBeforeChange / this.pageSize) + 1
            this.currentPage = currentPageAfterChange;
            // this.showData = this.getshowData(this.currentPage)
            this.initPage();
        },
        getPageChangeData(pageIndex) {
            this.currentPage = pageIndex;
            // this.showData = this.getshowData(pageIndex);
            this.initPage();
        },
        onSelectChange(selectedRowKeys, selectedRows) {
            this.selectedRowKeys = selectedRowKeys;
            this.selectedRows = selectedRows;
            for (const item of selectedRows) {
                this.selectedRowQuestionMd5.push(Md5.hashStr(item.question));
            }
        },

        //下载demo
        downloaddemo(){
            const params = {}
            const headers = {
                "userId": this.userId,
            }
            const url = API.port8000.downloaddemo;
            const data = {userId:this.userId}
            axiosDownLoad(url, params, data, headers, 'arraybuffer').then((res)=>{
                const data = res
                const blob = new Blob([data], {
                    type: 'application/vnd.ms-excel'
                });// 转化为blob对象
                const filename = 'demo.xlsx';// 判断是否使用默认文件名
                if (typeof window.navigator.msSaveBlob !== 'undefined') {
                    window.navigator.msSaveBlob(blob, filename);
                } else {
                    const blobURL = window.URL.createObjectURL(blob);// 将blob对象转为一个URL
                    const tempLink = document.createElement('a');// 创建一个a标签
                    tempLink.style.display = 'none';
                    tempLink.href = blobURL;
                    tempLink.setAttribute('download', filename);// 给a标签添加下载属性
                    if (typeof tempLink.download === 'undefined') {
                        tempLink.setAttribute('target', '_blank');
                    }
                    document.body.appendChild(tempLink);// 将a标签添加到body当中
                    tempLink.click();// 启动下载
                    document.body.removeChild(tempLink);// 下载完毕删除a标签
                    window.URL.revokeObjectURL(blobURL);
                }
            }).catch((error) => {
                console.log({"errno": error.errno, "errorMsg": error.errorMsg});
            });
        },
        toImportDetail() {
            this.$router.push('/home/robotHome/ImportDetail')
        },
        importportExcel() {
            this.importVisible = true
            this.fileList = []
            this.importFileName = ''
            this.upload = true
            this.uploadErrorMsg = ''
        },
        handleCancel() {
            this.importVisible = false
        },
        handleOk() {
            if(this.count > 0) {
                this.importVisible = false
                this.$message.warning('当前存在正在校验中的文件，请稍后尝试导入新文件');
                return
            }
            const { fileList } = this;
            const formData = new FormData();

            formData.append('file', fileList[0]);
            formData.append('botId', this.robotId);
            formData.append('userId', this.userId);
            formData.append('userName', this.userinfo.username);
            formData.append('fileId', fileList[0].uid);

            const params = {}
            const headers = {
                "userId": this.userId,
            }
            const url = API.port8000.bulk;
            this.importVisible = false
            this.$store.commit('setIsCheck',true)
            const arr = this.checkData.filter((item) => item.result == 2)
            if(arr.length <= 0) {
                const fileObj = {filename: fileList[0].name,result: '2',resultname: '校验中', 'fileid': fileList[0].uid, 'date': new Date()}
                this.checkData.unshift(fileObj)
                if(this.checkData.length>6) {
                    this.checkData.pop()
                }
                this.$store.commit('setCheckData',this.checkData)
            }
            axiosPost(url, params, formData, headers,90000).then((res)=>{
                if(res.errorMsg == 'OK') { 
                    this.initPage()
                }else if(res.errno == '-221'){
                    this.$message.warning(res.errorMsg);
                    return
                }
                const  resultname = ['校验通过','校验未通过']
                if(!res.result.fileid) {
                    this.checkData[0].result = 1
                    this.checkData[0].resultname = resultname[this.checkData[0].result]
                }else{
                    this.checkData.forEach((item)=> {
                        if(item.fileid == res.result.fileid) {
                            if(res.errorMsg == 'OK') {
                                item.result = 0 
                            }else{
                                item.result = 1
                            }
                            item.resultname = resultname[item.result]
                        }
                    })
                }
                
                this.$store.commit('setCheckData',this.checkData)
            }).catch((error) => {
                console.log({"errno": error.errno, "errorMsg": error.errorMsg});
            });
        },
        handleRemove(file) {
            const index = this.fileList.indexOf(file);
            const newFileList = this.fileList.slice();
            newFileList.splice(index, 1);
            this.fileList = newFileList;
        },
        beforeUpload(file) {
            console.log(file)
            const suffix = file.name.slice(file.name.lastIndexOf(".") + 1)
            const suffixList = ['xlsx']
            const filesize = file.size
            if(suffixList.includes(suffix)) {
                this.fileList = [file];
                this.importFileName = file.name
                if(filesize/ 1024 / 1024 > 10) {
                    this.uploadErrorMsg = '上传失败，文件大小超过10M，请修改后重新上传'
                    this.isClick = true
                    return
                }else {
                    this.upload =false
                    this.uploadErrorMsg = ''
                    this.isClick = false
                }
            }else {
                this.uploadErrorMsg = '上传失败，文件扩展名非.xlsx，请修改后重新上传'
            }
            return false;
        },
        onChange(e) {
            this.isCover = e.target.checked
        },

        //导出
        exportExcel() {
            require.ensure([], () => {
                const tHeader = ["问题ID", "标准问", "答案", "编辑人", "编辑时间"];
                const filterVal = ["id", "question", "answer", "editor", "editTime"];
                const list = this.allData;
                const data = formatJson(filterVal, list);
                exportJsonToExcel(tHeader, data, this.exportFileName);
            })
        },
        createQA() {
            this.$router.push({
                path: "/home/robotHome/questionAnswer",
                query: {mode: "create"}
            });
        },
        showDetail(record) {
            return {
                on: {
                    click: () => {
                        this.$router.push({
                            path: "/home/robotHome/questionAnswer",
                            query: {mode: "query", recordId: record.id, rowData:JSON.stringify(record)},
                        });
                    }
                }
            }
        },
        deleteConfirm() {
            if (this.selectedRowKeys.length > 0) {
                this.deleteConfirmShow = true;
            } else {
                this.$message.warning("您未选择任何问题");
            }
        },
        deleteSubmit() {
            this.deleteConfirmShow = false;
            const selectedRows = {
                key: this.selectedRowKeys,
                questionMd5: this.selectedRowQuestionMd5,
                selectedRows: this.selectedRows,
                userId: this.userId,
                botId: this.robotId
            }
            this.deleteQuestion(selectedRows).then(res => {
                if (res.errno === 0) {
                    this.$message.success("删除成功");
                    this.reload();
                } else {
                    this.showErrorNotification("删除失败！", res.errno, res.errorMsg);
                }
            })
            if (this.allData.length === 0) {
                this.showContentFlag = "1";
            }
        },
        answerLook(row) {
            this.$store.commit('showLoading')
            const answerCut = row.answer.split("%")[0]
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
        }
    },
    computed: {
        userId() {
            return this.$store.state.userId
        },
        robotId() {
            return this.$store.state.robotInfo.robotId
        },
        userinfo() {
            return this.$store.state.userinfo
        },
        checkData() {
            return this.$store.state.checkData
        },
        count() {
            const arr = this.$store.state.checkData.filter((item) => item.result == 2)
            return arr.length
        }

    },
    filters: {
        splitError: function(value) {
            return value.substring(0,value.length-4)
        }
    }
}
</script>
