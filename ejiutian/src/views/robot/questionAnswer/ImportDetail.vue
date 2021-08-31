<template>
    <div class="table-type-4">
        <jt-row type="flex" align="middle">
            <h4 class="titleName">导入详情</h4>
        </jt-row>
        <jt-table :columns="typeAColumns" rowKey = 'importdetail' :dataSource="testEnvDetailList"  
                  class="mt8 jtTabel" :pagination="false"  
                  :expandIconColumnIndex = "5" :expandIconAsCell = 'false'
                  :expandIcon = "expandIcon">
            <span slot="filename" slot-scope="text">
                <jt-icon type="file-excel" class='icon' theme="filled" :style="{ fontSize: '22px',color:'#51AD6C',verticalAlign: 'middle'}" />
                {{text}}
            </span>
            <div slot="recordnum" slot-scope="text">
                <span v-if="text > -1">{{text}}</span>
                <span v-else>未知</span>
            </div>
            <div slot="username" slot-scope="text">
                <span v-if="text!='undefined'">{{text}}</span>
                <span v-else>未知</span>
            </div>
            <div slot="result" slot-scope="text">
                <div v-if="text==1" style="cursor: pointer;float:left">
                    <jt-icon type="exclamation-circle" theme="filled" :style="{ fontSize: '14px',color:'#F04134',verticalAlign: 'middle',marginRight:'7px'}"/>
                    <span>校验未通过</span>
                    
                </div>
                <span v-else-if='text==2'>校验中</span>
                <span v-else>
                    <jt-icon type="check-circle" theme="filled" :style="{ fontSize: '14px',color:'#51AD6C',verticalAlign: 'middle',marginRight:'7px'}"/>
                    校验通过
                </span>
                    
            </div>
            <div slot="expandedRowRender" slot-scope="record">
                <span style="color:red;margin-left: 15px;margin-bottom: 15px;display: block;">失败原因：</span>
                <ul style="list-style:outside;margin-left:30px;color:#ADADAD;">
                    <li v-for="(item,index) in record.reason" :key="index" style="margin-bottom:32px">
                        <p style="color:#333">
                            {{item}}
                        </p>
                    </li>
                </ul>
            </div>
            
        </jt-table>
    </div>    
</template>

<script>
import {Pagination, Select} from "ant-design-vue";
import moment from 'moment'
import 'moment/locale/zh-cn'
moment.locale('zh-cn');
import { mapActions } from "vuex";
import { axiosPost } from "@/utils/http.js";
// import { getRandomNum } from "../../utils/common";
import API from '@/constant/api';

export default {
    name:'test-env-detail',

    data: () => ({

        testEnvDetailList: [],
        typeAColumns: [
            {
                title: '文件名',
                dataIndex: 'filename',
                key: 'filename',
                scopedSlots: { customRender: 'filename' },
                width:238,
                ellipsis: true,
            },
            {
                title: '大小',
                dataIndex: 'filesize',
                key: 'fileszie',
                width:103,
                ellipsis: true,
            },
            {
                title: '标准问条数',
                dataIndex: 'recordnum',
                key: 'recordnum',
                scopedSlots: { customRender: 'recordnum' },
                width:104,
                ellipsis: true,
            },
            {
                title: '上传时间',
                dataIndex: 'bulktime',
                key: 'bulktime',
                width:178,
                ellipsis: true,
            },
            {
                title: '上传人',
                key: 'username',
                dataIndex: 'username',
                scopedSlots: { customRender: 'username' },
                width:134,
                ellipsis: true
            },
            {
                title: '状态',
                key: 'result',
                dataIndex: 'result',
                scopedSlots: { customRender: 'result' },
                width: 209,
                ellipsis: true,
            },
        ],
        UNITS: ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
        STEP: 1024
    }),
    
    methods:{
        expandIcon(props){
            //  console.log(props,"opop")
            if(props.record.reason){
                if (props.expanded) {
                    return <a style="color: 'black',margin-right:0px;float:right" onClick={e => {
                        props.onExpand(props.record, e);
                    }}><span style="margin-right:9px;color:#337DFF;">失败原因</span><jt-icon type="up"/></a>
                    
                } else {
                    return <a style="color: 'black' ,margin-right:0px;float:right" onClick={e => {
                        props.onExpand(props.record, e);
                    }}><span style="margin-right:9px;color:#337DFF;">失败原因</span><jt-icon type="down"/></a>
                }
            }else{
                return ''
            }
        
        },
        getbulkdetail() {
            const url = API.port8000.getbulkdetail;
            const params = {}
            const headers = {
                "userId": this.userId,
            }
            const data = {
                userId:this.userId,
                botId: this.$store.state.robotInfo.robotId
            }
            axiosPost(url, params, data, headers).then((res) => {
                if(res.errorMsg == 'OK') {
                    res.result.forEach((item) => {
                        const filesize = item.filesize
                        const i = Math.floor(Math.log(filesize)/Math.log(this.STEP))
                        item.filesize = Math.ceil(filesize/Math.pow(this.STEP,i).toPrecision(3))+ " "+this.UNITS[i]
                        if(item.reason){
                            const separator = String.fromCharCode(1) + String.fromCharCode(1)
                            const reasonArr = item.reason.split(separator)
                            item.reason = reasonArr.filter((item)=>{return item.length>0})
                        }
                        
                        this.testEnvDetailList.push(item)
                        
                    });
                    
                    this.testEnvDetailList.sort(function(a,b){
                        return a.bulktime < b.bulktime ? 1 : -1
                    });
                }
                this.$store.commit('hideLoading')
                               
            }).catch(function (error) {
                this.showErrorNotification("查询失败！", error.errno, error.errorMsg);
            })
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
    },
    computed: {
        userId() {
            return this.$store.state.userId
        }
    },
    mounted(){
        // this.terobotQuery();
        this.getbulkdetail()
        this.$store.commit(
            'setBreadcrumb',
            [
                {breadcrumbName: this.$store.state.envInfo.envName, breadcrumbPath: this.$store.state.fromPath},
                {breadcrumbName: '问答库', breadcrumbPath: '/home/robotHome/libraryList'},
                {breadcrumbName: "导入详情"}
            ]
        );
    },
    
}
</script>
<style lang="less" scoped>
@import "~@/assets/style/var.less";
 div.table-type-4{
     width: 100%;
     overflow-y: auto;
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
    .anticon-down,.anticon-up {
        font-size: 11px;
        color: #337DFF;
        line-height: 18px;
    }
}
</style>


