<template>
    <div class="contentBody">
        <div style="display: flex; justify-content: space-between;">
            <div class="toptext">
                <p class="text1">数据标注  <span class="text2"> 
                    已确认
                    <span style="color: #337DFF;font-size: 16px;">{{yiqueren}}</span>
                    条 待确认
                    <span style="color: #337DFF;font-size: 16px;">{{daiqueren}}</span>
                    条</span></p>
            </div>
            <div style="display: flex; align-items: center;">
                <a  @click="showsearch" v-show="!showInput" class="icon iconfont iconsousuo"  style="font-size: 18px;margin-right: 16px;color: #555555;"></a>
                <jt-input placeholder="请输入问题关键词搜索" v-show="showInput" style="width: 250px;margin-right: 16px;color: #555555;" v-model = "searchname" v-on:keyup.enter="search">
                    <jt-tooltip slot="suffix" class = "btn-stop" >
                        <a class="icon iconfont iconsousuo" style="font-size: 16px; color: #555555;" @click = "search"></a>
                        <span class="dividerLineIn"></span>
                        <jt-icon type="close" style="font-size: 16px;color: #555555;" @click="offshow"></jt-icon>
                    </jt-tooltip>
                </jt-input>
                <!-- <a class="iconfont searchIcon" @click="todo" style="margin-right: 18px; font-size: 18px; color: #555555;">&#xe622;</a> -->
                <!-- <a class="iconfont reloadIcon" @click="todo" style="margin-right: 10px; font-size: 18px; color: #555555;">&#xe623;</a> -->
                <jt-divider type="vertical" style="margin-right: 18px; height: 16px; color: #E9EBEF;" />
                <jt-range-picker
                    :allowClear="true"
                    @change="datesearch"
                    separator="-"
                    style="width: 216px; margin-right: 8px;"
                    :defaultPickerValue="calendarRange"
                >
                    <jt-icon slot="suffixIcon" type="calendar" style="margin-left:8px;"/>
                </jt-range-picker>
                <!-- <jt-range-picker @change="datesearch" :allowClear="true" valueFormat="YYYY-MM-DD" separator="-"  :defaultPickerValue="calendarRange" style="width: 216px; margin-right: 8px;">
                    <jt-icon slot="suffixIcon" type="calendar" />
                </jt-range-picker> -->
                <!-- 
                <jt-range-picker @change="changeDate" valueFormat="YYYY-MM-DD" v-model="dates" separator="-" :defaultPickerValue="calendarRange" style="width: 216px; margin-right: 8px;text-align:left;">
                    <jt-icon slot="suffixIcon" type="calendar" style="margin-left:8px;"/>
                </jt-range-picker> -->
            </div>
        </div>

        <jt-modal
            title="编辑匹配内容"
            @ok="handleOk"
            :visible="show"
            :confirmLoading="confirmLoading"
            @cancel="handleCancel"
            width="600px"
            height="412px"
            
        >
            <div style="height: 32px;">
                <jt-input
                    placeholder="请输入问题关键词搜索"
                    style="font-size: 12px;width: 480px;height: 32px;"
                    v-model = "content1" 
                    v-on:keyup.enter = "searchstdquestion"
                >
                    <jt-tooltip slot="suffix">
                        <a class="icon iconfont iconsousuo" style="font-size: 16px; color: #555555;" @click = "searchstdquestion"></a>
                    </jt-tooltip>
                </jt-input>   
            </div>


            <div v-show = "searchdatashow" style="overflow-y: auto;width: 480px;height: 207px;
                background-color: #FFFFFF;
                border-left: 1px solid rgba(217,217,217,1);
                border-bottom: 1px solid rgba(217,217,217,1);
                border-right: 1px solid rgba(217,217,217,1);">
                
                <jt-radio-group v-model="valuedata" @change="onChange">
                    <div  class = "selsctstyle" v-for ="(data,index) in searchData" :key="index" style="padding-left: 11px;width: 478px;" > 
                        <jt-radio  class="selection" :style="radioStyle" :value="searchData.indexOf(data)">
                            {{data}}
                        </jt-radio>
                    </div>
                </jt-radio-group>
            </div>
        </jt-modal>

        <!-- <transfer
            :data-source="mockData"
            show-search
            :visible="show"
            :filter-option="filterOption"
            :target-keys="targetKeys"
            :render="item => item.title"
            @change="handleChange"
            @search="handleSearch"
        /> -->
        <!-- 表格暂无数据  -->
        <div class="table-type-3" v-if = "isNone && searchNone && !TimeSeach">
            <jt-empty :image="emptyImage" :imageStyle="{ margin: '50px auto 0px auto',width:'400px',height:'400px'}">
                <div class="emptyDescriptS" slot="description" style="margin-top:-128px;font-size:18px;font-weight:600;font-family:PingFangSC-Semibold,PingFang SC;color:#333333;">
                    <p class="emptyDescript"> 您还没有添加任何数据标注 </p>
                    <!-- <p v-show = "this.$store.state.envInfo.env == 'test'">您可以点击 <a href="javascript:;" @click="showDrawer">添加预置技能 </a>为机器人添加预置技能</p> -->
                </div>
            </jt-empty>
        </div>
        <!-- 搜索无结果 -->
        <div v-if = "(!searchNone || TimeSeach) && isNone" style="margin-top: 55px;">
            <jt-empty :image="searchnoneImage" :imageStyle="{ margin: 'auto',width:'400px',height:'400px'}">
                <div class="emptyDescriptS" slot="description" style="margin-top:-145px">
                    <p class="emptyDescript">抱歉，没有匹配到任何搜索结果</p>
                    <p>您可以换一个关键词试试哦～</p>
                </div>
            </jt-empty>
        </div>
        <div style="margin-top: 16px;" v-if = "!isNone">
            <jt-configProvider>
                <jt-table
                    :columns="columns"
                    :dataSource="showData"
                    :pagination="false"
                    rowKey="id"
                    :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange, columnWidth: 40 }"
                >
                    <div slot="env_status">
                        <span>标注来源</span>
                        <jt-dropdown placement = "bottomCenter">
                            <span class="iconfont btn-icon" style="vertical-align: middle;margin-left: 5px; color: #999999;">&#xe638;</span>
                            <!-- <a class="ant-dropdown-link" @click="e => e.preventDefault()">
                                Click me <a-icon type="down" />
                            </a> -->
                            <jt-menu slot="overlay">
                                <jt-menu-item key="0" style="width: 120px;">
                                    <a @click = "filterfunctionenv(0)">全部</a>
                                </jt-menu-item>
                                <jt-menu-item key="1" style="width: 120px;">
                                    <a @click = "filterfunctionenv(1)">测试环境</a>
                                </jt-menu-item>
                                <jt-menu-item key="2">
                                    <a @click = "filterfunctionenv(2)">生产环境</a>
                                </jt-menu-item>
                            </jt-menu>
                        </jt-dropdown>    
                    </div>
                    <div slot="data_status">
                        <span>标注状态</span>
                        <jt-dropdown placement = "bottomCenter">
                            <span class="iconfont btn-icon" style="vertical-align: middle;margin-left: 5px; color: #999999;">&#xe638;</span>
                            <!-- <a class="ant-dropdown-link" @click="e => e.preventDefault()">
                                Click me <a-icon type="down" />
                            </a> -->
                            <jt-menu slot="overlay">
                                <jt-menu-item key="0" style="width: 120px;">
                                    <a @click = "filterfunction(0)">全部</a>
                                </jt-menu-item>
                                <jt-menu-item key="1" style="width: 120px;">
                                    <a @click = "filterfunction(1)">已确认</a>
                                </jt-menu-item>
                                <jt-menu-item key="2">
                                    <a @click = "filterfunction(2)">待确认</a>
                                </jt-menu-item>
                            </jt-menu>
                        </jt-dropdown>    
                    </div>

                    <span  slot="data-status-slot" slot-scope="text" :class="['status-common', getStatusMarkStyle(text)]">
                        {{getStatusMarkWord(text)}}
                    </span>

                    <span slot="action-slot" slot-scope="text, record">
                        <span class="btn-common" @click.stop="showModal(record)">
                            <span class="iconfont btn-icon" style="vertical-align: middle; margin-right: 4px; color: #999999;">&#xe614;</span>
                            <span style="width: 100px;" >编辑</span>
                        </span>
                    </span>
                </jt-table>
            </jt-configProvider>
        </div>

        <div style="display: flex; flew-flow: row; justify-content: space-between; margin-top: 16px;">
            <div style="text-align: left;">
                <!-- <jt-button size="large" @click="deleteConfirm" class="delBtn" 
                           style="width: 64px;
                                height: 32px;
                                padding: 6px 0;
                                font-size: 12px;
                                font-family: 'PingFangSC-Regular,PingFang SC';
                                font-weight: 400;
                                line-height: 17px;">删除</jt-button> -->
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
                            <jt-button style="width: 64px; height: 32px; background: #FFFFFF; border-radius:2px; padding: 7px 18px;  font-size: 12px;" size ="large" @click="deleteCancel">取消</jt-button>
                            <jt-button style="margin-left: 8px; width: 64px; height: 32px; background: #FFFFFF; border-radius:2px; border:1px solid #F04134; padding: 7px 18px; color: #F04134; font-size: 12px;" @click="deleteOk">删除</jt-button>
                        </div>
                    </div>
                </jt-modal>
                <jt-button size="large" class="deleteBtn" type="danger" @click="deleteConfirm" v-if="showData.length>0">删除</jt-button>
                <span style="margin-left: 16px;" v-show = "recordCount > 10">共 {{recordCount}} 条记录</span>
                <span style="margin-left: 15px;" v-show = "recordCount > 10">每页显示</span>
                <jt-select
                    :defaultValue="10"
                    style="min-width: 50px; margin: 0 5px;"
                    @change="getShowSizeChangeData"
                    v-show = "recordCount > 10"
                >
                    <jt-icon slot="suffixIcon" type="caret-down" :style="{ color: '#606266',marginRight:'-7px' }"/>
                    <jt-select-option :value="10">10</jt-select-option>
                    <jt-select-option :value="20">20</jt-select-option>
                    <jt-select-option :value="30">30</jt-select-option>
                </jt-select>
                <span v-show = "recordCount > 10">条</span>
            </div>
            <div style="text-align: right;">
                <jt-pagination
                    showQuickJumper
                    :current="currentPage"
                    :pageSize="pageSize"
                    :total="recordCount"
                    @change="getPageChangeData"
                    style="text-align: right;"
                />
            </div>
            <!-- <span style="margin-left: 16px;">共 {{recordCount}} 条记录</span>
                <span class="pageOption" style="margin-left: 15px;">每页显示</span>
                <jt-select :defaultValue="10" style="min-width: 50px; margin: 0 5px;" @change="getShowSizeChangeData">
                    <jt-icon slot="suffixIcon" type="caret-down" :style="{ color: '#606266',marginRight:'-7px' }"/>
                    <jt-select-option :value="10">10</jt-select-option>
                    <jt-select-option :value="20">20</jt-select-option>
                    <jt-select-option :value="30">30</jt-select-option>
                </jt-select>
                <span>条</span>
            </div>
            <div style="width: 650px; text-align: right;float: right;margin-right: 5px;height: 28px;">
                <jt-pagination
                    showQuickJumper :current="currentPage" :pageSize="pageSize" :total="recordCount"
                    @change="getPageChangeData" style="text-align: right;float: right;"
                />
            </div> -->
            <!-- <div style="width: 49px;height: 28px; text-align: right;float: right;">
                <jt-button size="large" @click="todo" class="exportBtn" style="width: 49px;height: 28px">GO</jt-button>
            </div> -->
        </div>

    </div>

</template>

<style>
.ant-modal-title{
    font-size: 16px
}
.ant-modal-footer{
    padding-top: 16px;
    padding-bottom: 16px;
    padding-right: 20px;
    }
    .ant-btn{
        width: 64px;
        height: 32px;
    }

.ant-radio-group{
    margin-top: 8px;
}
</style>

<style lang="less" scoped>
@import "~@/assets/style/var.less";

div.contentBody {
    flex: auto;
    background: #FFFFFF;
    border-radius: 2px;
    padding: 20px 20px 40px 20px;
    overflow-y: auto;
}
.toptext{
    float: left;
}
.text1{
    height:24px;
    font-size:16px;
    font-family:PingFangSC-Medium,PingFang SC;
    font-weight:600;
    color:rgba(51,51,51,1);
    line-height:22px;
}
.text2{
    /* width:243px; */
    height:24px;
    font-size:12px;
    font-family:PingFangSC-Regular,PingFang SC;
    font-weight:400;
    color:rgba(153,153,153,1);
    line-height:17px;
    /* margin-left: 74px; */
}
.btn-stop{
        cursor: pointer;
        &:hover{
                color: #337DFF;
            }
    }
    /deep/ .ant-form.ant-form-vertical{
        font-size: 12px;
    }
    /deep/ .ant-form-explain{
        font-size: 12px;
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
.dividerLine{
        height: 16px;
        width: 1px;
        background:#E9EBEF;
        margin-right: 16px;
        display: inline-block;
        vertical-align: text-top;
    }
    .status-common{
        position: relative;
        &::before{
            content: '';
            display: inline-block;
            width: 8px;
            height: 8px;
            border-radius: 8px;
            position: absolute;
            left: -12px;
            top: 6px;
        }
}

.selsctstyle:hover{
    background-color: rgba(245,248,255,1);
}
.selection:hover {
        color: #337DFF;
    }
.status-common{
    position: relative;
    padding-left: 14px;
    &::before{
        content: '';
        display: inline-block;
        width: 6px;
        height: 6px;
        border-radius: 8px;
        position: absolute;
        left: 0px;
        top: 6px;
    }
}
.status-unconfirmed::before{
    background-color: #75849B;
    }
.status-confirmed::before{
    background-color: #10C038;
}
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
.delBtn:hover{
        color: #F04134;
        border-color:#F04134;
    }
.exportBtn {
    font-size: 12px;
    font-family: 'PingFangSC-Regular,PingFang SC';
    font-weight: 400;
    line-height:17px;
}
.btn-common {
    cursor: pointer;
    color: #555555;
    width: 100px;
}
/deep/ tr {
    transition: color 0s;
    font-family: PingFangSC-Regular,PingFang SC;
    font-weight: 400;
    line-height: 18px;
    &:hover {
        .action-slot, .btn-icon, .btn-iconn, .btn-common {
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
        width: 100px;
    }
}
.emptyDescriptS{
    font-size:14px;
    font-family:'PingFangSC-Regular,PingFang SC';
    font-weight:400;
    color:#555555;
    text-align: center;
    margin-bottom:35px;
    a{
      color:#337DFF;
    }
}
.emptyDescript{
    font-size:18px;
    font-family:'PingFangSC-Semibold,PingFang SC';
    font-weight:600;
    color:#333333;
    text-align: center;
    margin-bottom:16px;
}
</style>

<script>
import {
    Icon,
    DatePicker,
    Select,
    Pagination,
    Modal,
    Radio,
    Empty,
    ConfigProvider
} from "ant-design-vue";
import { mapActions } from "vuex";
import md5 from 'js-md5';
import moment from 'moment'
import { getRandomNum } from "@/utils/common";
// enum STATUS {unconfirmed = 1, confirmed = 2}


const columns = [
    {
        title: '用户ID',
        dataIndex: 'userid',
        key: 'userid',
        width: 100,
        ellipsis: true,
    },
    {
        title: '用户问题',
        dataIndex: 'uquestion',
        key: 'uquestion',
        width: 120,
        ellipsis: true,
    },
    {
        title: '匹配内容',
        dataIndex: 'squestion',
        key: 'squestion',
        width: 120,
        ellipsis: true,
    },
    {
        // title: '标注来源',
        // dataIndex: 'env',
        // key: 'env',
        // width: 89,
        // ellipsis: true,

        dataIndex: 'env',
        key: 'env', 
        slots: { title: 'env_status' },
        scopedSlots: { customRender: "env-status-slot" },
        width: 100,
        paddingleft: 8,
    },
    {
        dataIndex: 'evaluate',
        key: 'evaluate', 
        slots: { title: 'data_status' },
        scopedSlots: { customRender: "data-status-slot" },
        width: 100,
        paddingleft: 8,
        // filters: [
        //     { text: '已确认', value: '已确认'},
        //     { text: '待确认', value: '待确认'},
        // ],
        // onFilter: (value, record) => record.data_status.indexOf(value) === 0,
    },
    {
        title: '时间',
        dataIndex: 'signtime',
        key: 'signtime',
        width: 130
    },
    {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        width: 120,
        scopedSlots: { customRender: 'action-slot' },
    }
];

const allData = [];
const showData = [];
const pageSize = 10;
const recordCount = 0;
const yiqueren = 0;
const daiqueren = 0;
const currentPage = 1;
const selectedRowKeys = [];
const showEmpty = false;
const rawdata = []

// export default class TableTypeA extends Vue {
export default {
    name: "RobotHome",
    components: {
        "jt-icon":Icon, 
        "jt-range-picker": DatePicker.RangePicker,
        "jt-select": Select,
        "jt-select-option": Select.Option,
        "jt-pagination":Pagination,
        "jt-modal": Modal,
        "jt-radio":Radio,
        "jt-radio-group":Radio.Group,
        "jt-empty":Empty,
        "jt-configProvider":ConfigProvider,
        // Radio,
        // RadioGroup: Radio.Group,
    },
    data() {
        return {
            emptyImage: require("@/assets/image/noneProject.png"),
            calendarRange: [moment().subtract(1, "months").format("YYYY-MM-DD")],
            searchdatashow:false,
            datestartstr : "",
            dateendend : "",
            robotId: "",
            showInput:false,
            searchname:"",
            searchparam:{
                "botid": "",
                "keyword":"",
                "size":"100",
                "datestart":"",
                "dateend":"",
                "evaluate":"",
                "env":"",
            },
            modifyparam:[{
                "id" : "",
                "sqid" : "",
                "squestion":"",
                "uquestion" : "",
                "faqid" : "",
                "botid" : "",
                "userid":"",
                "answer" : "",
                "signtime" : "",
                "signer":"",
                "evaluate" : "true",
                "province" : "GD",
                "status": 1,
                "env":0,
                "delflag":"0"
            }],
            dataAnnotationlabelpageresult:[],
            dataAnnotationstdresult:[],
            dataAnnotationdelresult:[],
            dataAnnotationdelresultmongodb:[],
            dataAnnotationdelmodifyresult:[],
            dataAnnotationdelmodifyresultmongodb:[],
            status :{
                unconfirmed : 1, 
                confirmed : 2
            },
            errorMesAll:"系统繁忙，请稍后再试",
            content1:"",
            valuedata:"",
            selectstd:"",
            mockData: [],
            targetKeys: [],   
            show:false,
            confirmLoading: false,
            pageIndex: 0,
            columns,
            allData,
            rawdata,
            showData,
            pageSize,
            recordCount,
            yiqueren,
            daiqueren,
            currentPage,
            selectedRowKeys,
            showEmpty,
            deleteConfirmShow: false,
            searchData:[],
            radioStyle: {
                display: 'block',
                height: '30px',
                lineHeight: '30px',
            },
        }
    },
    // mounted() {
    //     this.getInitData();
    //     this.getMock();
    // },
    methods: {
        showsearch(){
            this.showInput = !this.showInput;
        },
        offshow(){
            this.searchname = '';
            this.showInput = !this.showInput;
            this.yiqueren = 0;
            this.daiqueren = 0;
            this.searchparam.botid = this.robotId;
            this.searchparam.keyword = '';
            this.searchparam.datestart = this.datestartstr;
            this.searchparam.dateend = this.dateendend;
            // this.searchparam.evaluate = '';
            // this.searchparam.env = '';
            // this.dataAnnotationlabelpageVuexPostfunction(this.searchparam);
            this.getInitData()
        },
        search(){
            this.yiqueren = 0;
            this.daiqueren = 0;
            this.currentPage = 1;
            this.searchparam.botid = this.robotId;
            this.searchparam.keyword = this.searchname;
            // this.searchparam.evaluate = ""
            this.dataAnnotationlabelpageVuexPostfunction(this.searchparam);
            // console.log(this.searchname)
            // this.$message.info("TODO:"); 
        },
        datesearch(dates,datestring){
            console.log(dates)
            console.log(datestring)
            this.yiqueren = 0;
            this.daiqueren = 0;
            this.currentPage = 1;
            this.searchparam.botid = this.robotId;
            this.searchparam.datestart = datestring[0];
            this.datestartstr = datestring[0];
            this.searchparam.dateend = datestring[1];
            this.dateendend = datestring[1];
            this.searchparam.keyword = this.searchname;
            // this.searchparam.evaluate = "";
            this.dataAnnotationlabelpageVuexPostfunction(this.searchparam);

        },
        searchstdquestion(){
            // console.log(this.content1)
            // this.searchparam = {};
            this.searchData = [];
            this.searchparam.botid = this.robotId;
            this.searchparam.keyword = this.content1;
            // this.searchData = [];
            // console.log(this.searchparam);
            this.dataAnnotationstdVuexPostfunction(this.searchparam)
        },
        onChange(){
            // console.log(this.searchData[this.valuedata])
            console.log(this.valuedata)
            console.log(this.dataAnnotationstdresult.result[this.valuedata].id)
            this.modifyparam[0].squestion = this.searchData[this.valuedata]
            // sqid是标准问题字符串的md5值
            this.modifyparam[0].sqid = md5(this.searchData[this.valuedata])
            // faqid是标准问题的id
            this.modifyparam[0].faqid = getRandomNum(this.dataAnnotationstdresult.result[this.valuedata].id)
            console.log(this.dataAnnotationstdresult.result)
        },
        showModal(record) {
            this.valuedata = ""
            console.log(record)
            if(record.evaluate == "待确认"){
                this.valuedata = ""
                this.selectstd = ""
            }
            else{
                // this.valuedata = "-1"
                this.selectstd = record.squestion
            }
            this.show = true;
            this.searchdatashow = false;
            this.searchData = [];
            this.content1 = "";
            // id是这条数据的id
            this.modifyparam[0].id = record.id;
            console.log(this.modifyparam[0].id)
            // this.modifyparam[0].sqid = record.ssqid;
            this.modifyparam[0].uquestion = record.uquestion;
            if(record.env == "测试环境"){
                this.modifyparam[0].env = 0
            }
            else{
                this.modifyparam[0].env = 1
            }
            console.log(this.modifyparam[0].env) 
            // this.modifyparam[0].faqid = record.faqid;
            // console.log(this.modifyparam[0].sqid)
            this.modifyparam[0].botid = this.robotId;
            this.modifyparam[0].userid = getRandomNum(record.userid);
            this.modifyparam[0].answer = record.answer;
            this.modifyparam[0].signer = record.signer;
            // console.log(this.modifyparam)
        },
        handleOk() {
            // console.log(e);
            // console.log(this.modifyparam)
            // console.log(this.modifyparam)
            this.dataAnnotationmodifyVuexPostfunction(this.modifyparam)
            console.log(this.modifyparam)
            this.dataAnnotationmodifyVuexPostfunction2(this.modifyparam)
            

            // this.ModalText = "test";
            this.confirmLoading = true;
            // setTimeout(() => {
            this.show = false;
            this.confirmLoading = false;
        },
        handleCancel() {
            // this.searchData = [];
            // console.log(e);
            // console.log("Clicked cancel button");
            this.show = false;
        },
        filterfunctionenv(param){
            this.yiqueren = 0;
            this.daiqueren = 0;
            if(param == 0){
                this.searchparam.env = ''
            }
            else if(param == 1){
                this.searchparam.env = 0
            }
            else{
                this.searchparam.env = 1
            }
            this.searchparam.botid = this.robotId;
            // console.log(this.sea)
            this.searchparam.keyword = this.searchname;
            console.log(this.searchparam)
            this.currentPage = 1;
            console.log(this.currentPage)
            this.dataAnnotationlabelpageVuexPostfunction(this.searchparam);
        },
        filterfunction(param){
            this.yiqueren = 0;
            this.daiqueren = 0;
            if(param == 0){
                this.searchparam.evaluate = ""
            }
            else if(param == 1){
                this.searchparam.evaluate = "true"
            }
            else{
                this.searchparam.evaluate = "false"
            }
            this.searchparam.botid = this.robotId;
            // console.log(this.sea)
            this.searchparam.keyword = this.searchname;
            this.dataAnnotationlabelpageVuexPostfunction(this.searchparam);
        },
        getInitData() {
            this.$store.commit(
                'setBreadcrumb',
                [
                    {breadcrumbName: this.$store.state.envInfo.envName, breadcrumbPath: this.$store.state.fromPath},
                    {breadcrumbName: "数据标注"}
                ]
            );
            this.searchparam.botid = this.robotId
            this.dataAnnotationlabelpageVuexPostfunction(this.searchparam);
                     
        },
        getshowData(pageIndex) {
            return this.allData.slice((pageIndex - 1 ) * this.pageSize, pageIndex * this.pageSize);
        },
        getShowSizeChangeData(showSizeSelected) {
            const dataIndexBeforeChange = (this.currentPage - 1) * this.pageSize
            this.pageSize = showSizeSelected;
            const currentPageAfterChange = Math.floor(dataIndexBeforeChange / this.pageSize) + 1
            this.currentPage = currentPageAfterChange;
            this.showData = this.getshowData(this.currentPage)
        },
        getPageChangeData(pageIndex) {
            this.currentPage = pageIndex;
            this.showData = this.getshowData(pageIndex);
        },
        onSelectChange(selectedRowKeys) {
            // console.log('selectedRowKeys changed: ', selectedRowKeys);
            this.selectedRowKeys = selectedRowKeys;
        },
        todo() {
            this.$message.info("TODO:");
        },
        changeResult() {
            this.showEmpty = !this.showEmpty;
        },
        getMock() {
            const targetKeys = [];
            const mockData = [];
            for (let i = 0; i < 20; i++) {
                const data = {
                    key: i.toString(),
                    title: `content${i + 1}`,
                    description: `description of content${i + 1}`,
                    chosen: Math.random() * 2 > 1,
                };
                if (data.chosen) {
                    targetKeys.push(data.key);
                }
                mockData.push(data);
            }
            this.mockData = mockData;
            this.targetKeys = targetKeys;
        },
        filterOption(inputValue, option) {
            return option.description.indexOf(inputValue) > -1;
        },
        handleChange(targetKeys) {
            // console.log(targetKeys, direction, moveKeys);
            this.targetKeys = targetKeys;
        },
        handleSearch(dir, value) {
            console.log('search:', dir, value);
        },

        getStatusMarkStyle(status){
            const statusClassnamemap = new Map();
            statusClassnamemap.set('待确认','status-unconfirmed');
            statusClassnamemap.set('已确认','status-confirmed');
            if(!statusClassnamemap.has(status)){
                return status;
            }
            return statusClassnamemap.get(status);
        },
        getStatusMarkWord(status){
            const statusWordmap = new Map([
                [1, '待确认'],
                [2, '已确认'],
            ]);
            if(!statusWordmap.has(status)){
                return status;
            }
            return statusWordmap.get(status);
        },
        deleteConfirm() {
            if (this.selectedRowKeys.length > 0) {
                this.deleteConfirmShow = true;
                // console.log(this.selectedRowKeys[0])
            } else {
                
                this.$message.warning("您未选择任何数据");
            }
        },
        deleteOk() {
            this.deleteConfirmShow = false;
            // console.log(this.selectedRowKeys)
            this.dataAnnotationdelVuexPostfunction(this.selectedRowKeys);
            // console.log(this.dataAnnotationdelresult)
        },
        deleteCancel() {
            this.deleteConfirmShow = false;
        },
        deleteFaile(des) {
            this.$notification.open({
                message: '删除失败！',
                description: des,
                icon: <jt-icon type="exclamation-circle" theme="filled" style="color:#F04134"/>,
            });
        },
        deleteSucceed() {
            this.$message.success("删除成功");
        },
        formDate (time) {
            const thisTime = time
            let nowTime = new Date(thisTime)
            nowTime = nowTime.getTime()
            return nowTime
        },
        ...mapActions({
            dataAnnotationlabelpageVuexPost: "dataAnnotation/dataAnnotationlabelpagePost",
            dataAnnotationstdVuexPost:"dataAnnotation/dataAnnotationstdPost",
            dataAnnotationdelVuexPost:"dataAnnotation/dataAnnotationdelPost",
            dataAnnotationdelVuexPost2:"dataAnnotation/dataAnnotationdelPost2",
            dataAnnotationmodifyVuexPost:"dataAnnotation/dataAnnotationmodifyPost",
            dataAnnotationmodifyVuexPost2:"dataAnnotation/dataAnnotationmodifyPost2",
        }),
        error(Mestype,mes,time){
            this.$notification['error']({
                message: <div style="font-size:14px;font-family:PingFangSC-Semibold,PingFang SC;font-weight:600;color:rgba(38,38,38,1);">{Mestype}</div>,
                description:
                    <div style="font-size:12px; padding:8px 0px 8px 0px;">
                        {mes}
                    </div>,
                icon:()=><jt-icon type="close-circle" theme="filled" style="color:#F04134"/>,
                duration: time,
            });
        },
        dataAnnotationlabelpageVuexPostfunction(param){
            this.dataAnnotationlabelpageVuexPost(param).then(res => {
                console.log(param)
                this.dataAnnotationlabelpageresult = res;
                if(this.dataAnnotationlabelpageresult.errno == 999){
                    this.error("查询数据库失败",this.errorMesAll,0)
                }
                else{
                    this.rawdata = this.dataAnnotationlabelpageresult.result;
                    console.log(this.rawdata)
                    for (let i = 0; i < this.rawdata.length; i++) {
                        if(this.rawdata[i].evaluate == "true"){
                            this.rawdata[i].evaluate = "已确认"
                            this.yiqueren += 1
                        }
                        else{
                            this.rawdata[i].evaluate = "待确认"
                            this.daiqueren += 1
                        }
                        if(this.rawdata[i].env == 0){
                            this.rawdata[i].env = "测试环境"
                        }
                        else{
                            this.rawdata[i].env = "生产环境"
                        }
                        
                    }
                    this.recordCount = this.rawdata.length;
                    // console.log(this.rawdata)
                    this.allData = this.rawdata.sort((a, b) => this.formDate(b.signtime) > this.formDate(a.signtime) ? 1 : -1)
                    const newData = [];
                    const newData2 = [];
                    for (let i = 0; i < this.allData.length; i++) {
                        if (this.allData[i].evaluate === "已确认") {
                            newData.push(this.allData[i])
                        }else {
                            newData2.push(this.allData[i])
                        }
                    }
                    this.allData = [...newData2.concat(newData)];
                    this.currentPage = 1
                    console.log(this.rawdata)
                    console.log(this.allData)
                    console.log(this.allData)
                    this.showData = this.getshowData(this.currentPage);
                }
                // console.log(this.dataAnnotationlabelpageresult.result[0])
                // console.log(this.dataAnnotationlabelpageresult)
                // console.log(this.dataAnnotationlabelpageresult.result);

                // this.getInitData();
                // this.getMock(); 
            })
        },
        // dataAnnotationlabelpageVuexPostfunction(param){
        //     this.dataAnnotationlabelpageVuexPost(param).then(res => {
        //         console.log(param)
        //         this.dataAnnotationlabelpageresult = res;
        //         // console.log(this.dataAnnotationlabelpageresult.result[0])
        //         // console.log(this.dataAnnotationlabelpageresult)
        //         // console.log(this.dataAnnotationlabelpageresult.result);
        //         this.allData = this.dataAnnotationlabelpageresult.result;
        //         console.log(this.allData)
        //         for (let i = 0; i < this.allData.length; i++) {
        //             if(this.allData[i].evaluate == "true"){
        //                 this.allData[i].evaluate = "已确认"
        //                 this.yiqueren += 1
        //             }
        //             else{
        //                 this.allData[i].evaluate = "待确认"
        //                 this.daiqueren += 1
        //             }
        //             if(this.allData[i].env == 0){
        //                 this.allData[i].env = "测试环境"
        //             }
        //             else{
        //                 this.allData[i].env = "生产环境"
        //             }
                    
        //         }
        //         this.recordCount = this.allData.length;
        //         console.log(this.currentPage)
        //         this.currentPage = 1
        //         console.log(currentPage)
        //         this.showData = this.getshowData(this.currentPage);
        //         // this.getInitData();
        //         // this.getMock(); 
        //     })
        // },
        dataAnnotationstdVuexPostfunction(param){
            this.dataAnnotationstdVuexPost(param).then(res => {
                this.dataAnnotationstdresult = res;
                if(this.dataAnnotationstdresult.errno == 999){
                    this.error("查询数据库失败",this.errorMesAll,0)
                }
                else{
                    if(this.dataAnnotationstdresult.result != ''){
                    // console.log(md5(this.dataAnnotationstdresult.result[0].squestion))
                    // console.log(this.dataAnnotationstdresult.result[0].squestion)
                        for (let i = 0; i < this.dataAnnotationstdresult.result.length; i++) {
                            // this.searchData[i] = this.dataAnnotationstdresult.result[i].squestion
                            this.$set(this.searchData,i,this.dataAnnotationstdresult.result[i].squestion)
                            if(this.selectstd == ""){
                                this.valuedata = ""
                            }
                            else if(this.dataAnnotationstdresult.result[i].squestion == this.selectstd){
                                this.valuedata = i
                            }
                        }
                        if(this.searchData != ''){
                            this.searchdatashow = true 
                        }
                    }
                    else{
                        console.log(this.dataAnnotationstdresult.totalnum)
                        this.searchdatashow = false
                    }                    
                }
                // if(this.dataAnnotationstdresult.result != ''){
                //     // console.log(md5(this.dataAnnotationstdresult.result[0].squestion))
                //     // console.log(this.dataAnnotationstdresult.result[0].squestion)
                //     for (let i = 0; i < this.dataAnnotationstdresult.result.length; i++) {
                //         // this.searchData[i] = this.dataAnnotationstdresult.result[i].squestion
                //         this.$set(this.searchData,i,this.dataAnnotationstdresult.result[i].squestion)
                //         if(this.selectstd == ""){
                //             this.valuedata = ""
                //         }
                //         else if(this.dataAnnotationstdresult.result[i].squestion == this.selectstd){
                //             this.valuedata = i
                //         }
                //     }
                //     if(this.searchData != ''){
                //         this.searchdatashow = true 
                //     }
                // }
                // else{
                //     console.log(this.dataAnnotationstdresult.totalnum)
                //     this.searchdatashow = false
                // }
            })
            
        },
        dataAnnotationdelVuexPostfunction(param){
            this.dataAnnotationdelVuexPost(param).then(res => {
                this.dataAnnotationdelresult = res;
                this.dataAnnotationdelVuexPost2(param).then(res2 => {
                    this.dataAnnotationdelresultmongodb = res2;
                    if(this.dataAnnotationdelresultmongodb.errno == 999 || this.dataAnnotationdelresult.errno == 999){
                        this.error("删除数据失败",this.errorMesAll,0)
                    }
                    else{
                        // console.log(this.dataAnnotationdelresultmongodb)
                        if (this.dataAnnotationdelresult.err_code == 0 && this.dataAnnotationdelresultmongodb.errno == 0) {
                            this.yiqueren = 0;
                            this.daiqueren = 0;
                            // console.log(this.searchparam)
                            this.searchparam.keyword = "";
                            this.searchparam.evaluate = "";
                            this.dataAnnotationlabelpageVuexPostfunction(this.searchparam);
                            this.deleteSucceed();
                            this.selectedRowKeys = [];
                        } else {
                            this.deleteFaile(this.dataAnnotationdelresult.err_msg);
                        }
                    }

                })
                // console.log(this.dataAnnotationdelresult)
                

            })
        },

        dataAnnotationmodifyVuexPostfunction(param){
            console.log(param)
            this.dataAnnotationmodifyVuexPost(param).then(res => {
                // this.dataAnnotationmodifyVuexPostfunction2(this.modifyparam)
                this.dataAnnotationdelmodifyresult = res;
                if(this.dataAnnotationdelmodifyresult.errno == 999 ){
                    this.error("编辑数据失败",this.errorMesAll,0)
                }
                else{
                    this.yiqueren = 0;
                    this.daiqueren = 0;
                    this.searchparam.keyword = "";
                    this.searchparam.evaluate = "";
                    this.dataAnnotationlabelpageVuexPostfunction(this.searchparam);
                }           
            })
        },
        dataAnnotationmodifyVuexPostfunction2(param){
            // console.log(param)
            this.dataAnnotationmodifyVuexPost2(param).then(res => {
                this.dataAnnotationdelmodifyresultmongodb = res;
                if(this.dataAnnotationdelmodifyresultmongodb.errno == 999 ){
                    this.error("编辑数据失败",this.errorMesAll,0)
                }
                console.log(this.dataAnnotationdelmodifyresultmongodb)
            })
        },
    },
    mounted(){   
        // console.log(this.result[0].botid);  
        const b = document.querySelector(".ant-calendar-range-picker-separator");
        if(b){
            b.innerHTML = '<i class="anticon anticon-swap-right" aria-label="图标: swap-right"><svg viewBox="0 0 1024 1024" data-icon="swap-right" width="1em" height="1em" fill="currentColor" aria-hidden="true" focusable="false" class=""><path d="M873.1 596.2l-164-208A32 32 0 0 0 684 376h-64.8c-6.7 0-10.4 7.7-6.3 13l144.3 183H152c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h695.9c26.8 0 41.7-30.8 25.2-51.8z"></path></svg></i>';
        } 
        this.robotId = getRandomNum(this.$store.state.robotInfo.robotId);
        // console.log(this.robotId);
        this.getInitData();
        this.getMock(); 
        // this.dataAnnotationlabelpageVuexPostfunction();
        // this.dataAnnotationstdVuexPostfunction();
        // this.dataAnnotationdelVuexPostfunction(); 
        // this.dataAnnotationdelVuexPostfunction2();
        // this.dataAnnotationmodifyVuexPostfunction();
        // this.dataAnnotationmodifyVuexPostfunction2();        
    }
}
</script>
