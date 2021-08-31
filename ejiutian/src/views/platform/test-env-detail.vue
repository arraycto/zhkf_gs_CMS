<template>
    <div class="table-type-4">
        <jt-row type="flex" align="middle">
            <h4 class="titleName">测试环境使用详情</h4>
            <div class="subTitle" style="margin-left: 10px;">合计调用量中包含已删除机器人的调用量</div>
        </jt-row>
        <jt-table :columns="typeAColumns" :dataSource="typeADataShow"  rowKey='botnameid' class="mt8 jtTabel" :pagination="false"  >
            <span slot="botid" slot-scope="text">
                {{text.split(' ')[1]}}
            </span>
            <span slot="botname" slot-scope="text">
                {{text.split(' ')[0]}}
            </span>
        </jt-table>
        <jt-row style="" class="total-attr">
            <jt-col :span="16">
                <span >合计</span>
            </jt-col>
            <jt-col :span="4" style="margin-left:7px" v-if="totalFlow <= 100">
                {{totalFlow}}
            </jt-col>
            <jt-col :span="4" style="margin-left:7px" v-else>
                100
            </jt-col>
        </jt-row>
        <jt-row style="" class="total-bottom">
        </jt-row>
        <jt-row class="mt16">
            <jt-col :span="6" class="pageOptionWrap">
                <span> 共 {{typeACount}} 条记录</span>
                <span class="pageOption" v-if='showSelect'>每页显示</span>
                <jt-select :defaultValue="typeAPageSize"  style="width: 50px" @change="onTypeAShowSizeChange" class="pageOptionSel" v-if='showSelect'>
                    <jt-icon slot="suffixIcon" type="caret-down" :style="{ color: '#606266',marginRight:'-7px' }"/>
                    <jt-select-option v-for='(item,index) in pageList' :key="index">{{item}}</jt-select-option>
                </jt-select>
                <span v-if='showSelect'>条</span>
            </jt-col>
            <jt-col :span="18">
                <jt-pagination  :total="typeACount" :pageSize="typeAPageSize" :current='typeACurrentPage' showQuickJumper hideOnSinglePage style="text-align: right;"   @change="onTypeAPageChange">
                </jt-pagination>
            </jt-col>
        </jt-row>
    </div>    
</template>

<script>
import {Pagination, DatePicker, Select} from "ant-design-vue";
import moment from 'moment'
import 'moment/locale/zh-cn'
moment.locale('zh-cn');
import { mapActions } from "vuex";
import { axiosGet, axiosPost, axiosPut, axiosDelete } from "../../utils/http.js";
import { getRandomNum } from "../../utils/common";
import API from '../../constant/api';

export default {
    name:'test-env-detail',
    components:{
        "jt-pagination":Pagination,
        "jt-select": Select,
        "jt-select-option": Select.Option,
    },

    data: () => ({
        typeADataShow: [],
        typeACurrentPage: 1,
        typeAPageSize: 10,
        typeACount: 0,
        showSelect: false,

        totalFlow: 0,
        amount: 0,
        amountList:[],
        flowIndexList: [],
        pageList: [10,20,30],
        testEnvDetailList: []
    }),
    
    methods:{
        ...mapActions({
            terobotVuexQuery: "platform/terobotQuery"
        }),
        //测试环境使用详情
        async terobotQuery() {
            this.$store.commit('showLoading', {}, { root: true });
            this.terobotVuexQuery(this.userId).then((res) => {
                if(res.errno == '-101') {
                    this.$store.commit('setGlobalFreeze', {}, { root: true });
                }else{
                    this.testEnvDetailList = res.result
                    this.typeACount = this.testEnvDetailList.length;
                    this.typeADataShow = this.calctypeADataShow(1);
                    if(this.typeACount > 10){
                        this.showSelect = true
                    } else {
                        this.showSelect = false
                    }
                }
                this.$store.commit('hideLoading', {}, { root: true });
            }).catch((error) => {
                this.$store.commit('hideLoading', {}, { root: true });
                this.$notification.open({
                    message: "查询失败！",
                    description:'系统繁忙,请稍后再试',
                    icon: (
                        <jt-icon
                            type="exclamation-circle"
                            theme="filled"
                            style="color:#F04134"
                        />
                    ),
                    duration:0
                });
            });
        },
        calctypeADataShow(pageIndex){
            return this.testEnvDetailList.slice((pageIndex - 1 ) * this.typeAPageSize, pageIndex * this.typeAPageSize);
        },
        onTypeAShowSizeChange(showSizeSelected){
            this.flowIndexList = []
            this.typeAPageSize=this.pageList[showSizeSelected];
            this.typeACurrentPage = 1;
            this.typeADataShow = this.calctypeADataShow(1);
        },
        onTypeAPageChange(pageIndex){
            this.flowIndexList = []
            this.typeACurrentPage = pageIndex;
            this.typeADataShow = this.calctypeADataShow(pageIndex);
        },
        clickMenu(idx) {
            alert("ccc" + idx)
        },
        getAmount(index,botid) {
            const url = API.port7057.quotaQuery;
            const headers = {};
            const params = {
                "botid": getRandomNum(botid),
                "userId": getRandomNum(this.userId),
                "env": 0
            };
            if(!this.flowIndexList.includes(index)){
                this.flowIndexList.push(index)
                axiosGet(url, params, null, headers).then((res)=>{
                    if(res.errno == 0){
                        this.amount =  res.result.bot_used_quota
                        this.totalFlow = res.result.used_quota
                    }else if(res.errno == '-101'){
                        this.$store.commit('setGlobalFreeze', {}, { root: true });
                    }else {
                        this.amount = 0 
                    }
                    this.$set(this.amountList,index,this.amount)
                }).catch((error) => {
                    console.log({"errno": error.errno, "errorMsg": error.errorMsg});
                });
            }
            return this.amountList[index]
        }
    },
    computed: {
        userId() {
            return this.$store.state.userId
        },
        typeAColumns() {
            return [
                {title: '机器人ID', dataIndex: 'botnameid', key: 'botid', className:"col-att",scopedSlots: { customRender: 'botid' },width:351},
                {title: '机器人名称', dataIndex: 'botnameid', key: 'botname' , className:"col-att",scopedSlots: { customRender: 'botname' },width:367},
                {title: '测试环境调用量', dataIndex: 'usedQuota', key: 'usedQuota', className:"col-att",scopedSlots: { customRender: 'usedQuota' },width:365,
                    customRender: (value, row, index) => {
                        return this.getAmount(index,row.botnameid.split(' ')[1])
                    }
                },
            ]
        }
    },
    mounted(){
        this.terobotQuery();
    },
    
}
</script>
<style lang="less" scoped>
@import "~@/assets/style/var.less";
 div.table-type-4{
    .ant-table-thead > tr > th {
        background: #F4F5F7;
    }
    padding: 20px;
    background-color: #fff;
    border-radius: 2px;
    min-height: 100%;
    .subTitle {
        height: 18px;
        font-size: 12px;
        font-family: 'PingFangSC-Regular,PingFang SC';
        font-weight: 400;
        color: rgba(153,153,153,1);
        line-height: 12px;
    }
    .titleName{
        font-size: @jt-font-size-lg;
        font-weight:600;
        color:@jt-color-text-strong;
        height: 24px;
        line-height: 24px;
    }
    .mr8{
        margin-right:8px
    }
    .mt16{
        margin-top:16px;
    }
    .mt8 {
        margin-top:8px;
    }
    .addBtn{
        padding:6px 8px;
    }
    .dividerLine{
        height: 16px;
        width: 1px;
        background:#E9EBEF;
        margin-right: 16px;
        display: inline-block;
        vertical-align: text-top;
    }
    
    .pageOptionWrap{
        font-size: @jt-font-size-sm!important;
        color:@jt-color-text-strong;
        font-weight: 400;
        .pageOption{
            display: inline-block;
            margin-left:15px;
        }
        .pageOptionSel{
            margin:0 5px;
            line-height: 28px;
            .ant-select-selection__rendered{
                margin-left: 10px;
                line-height: 28px;
            }
            .ant-select-selection-selected-value{
                font-size: @jt-font-size-sm;
            }
            /deep/.ant-select-selection--single .ant-select-selection__rendered {
                margin-right: 0px;
            }
        }
    }
    .ant-pagination-options-quick-jumper{
        height: 28px;
        line-height: 28px;
        font-size: @jt-font-size-sm!important;
        color:@jt-color-text-strong;
        input{
            height: 28px;
        }
    }
    .jtTabel{
        thead>tr>th{
            font-size: @jt-font-size-sm!important;
            color:@jt-color-text-strong!important;
        }
        /deep/.ant-table-tbody > tr:hover:not(.ant-table-expanded-row):not(.ant-table-row-selected) > td {
            background: #f5f8ff
        }
    }
    .ant-pagination{
        font-size: @jt-font-size-sm!important;
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
    .status-suspend::before{
        background-color: #75849B;
    }
    .status-fail::before{
        background-color: #F04134;
    }
    .status-queue::before{
        background-color: #FF931D;
    }
    .status-running::before{
        background-color: #337DFF;
    }
    .total-attr {
        height: 40px;
        background-color: #FFFFFF;
        box-shadow:0px -4px 4px 0px rgba(0,0,0,0.05);
        font-size: @jt-font-size-sm;
        line-height: 40px;
        padding-left: 16px;
    }
    .total-bottom {
        height: 1px;
        background:rgb(233,235,239, 1);
        box-shadow: 0px -4px 4px 0px rgba(0,0,0,0.05);
    }
    .small-line {
        position: relative;
        top: 3px;
        width:1px;
        height:16px;
        background:rgba(233,235,239,1);
        margin-right: 15px;
        display: inline-block
    }

    .date-class {
        margin-left: 0px; 
        width:230px;
        height:32px;
        font-size:12px;
        display: inline-block
    }
}
</style>


