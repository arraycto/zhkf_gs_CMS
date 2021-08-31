<template>
    <div class="contentBody">
        <div class="tableOne">
            <h3 class="title">当前算法</h3>
            <jt-card>
                <jt-table
                    :columns="topTableDataColumns" 
                    :data-source="[topForm]"
                    :showHeader="false"
                    :pagination="false"
                    v-if="nowDerill"
                    class="topBorder"
                >
                    <span slot="model" slot-scope="model">
                        <span class="iconBox" v-show="model == 3 || model == 4">
                            <span class="iconfont iconshenduxuexi"></span>
                        </span>
                        <span class="iconBox2" v-show="model == 1 || model == 2">
                            <span class="iconfont iconlianjie1"></span>
                        </span>
                        <span style="margin-left:14px">{{model == 3?"深度学习算法":model == 4?"深度学习算法":model == 1?"机器学习算法":"机器学习算法"}}</span>
                        <span style="margin-left:20px">
                            <jt-tag :color="model==3?'green':model==4?'orange':model==1?'#2db7f5':'purple'">
                                {{model == 3?"算法一":model == 4?"算法二":model == 1?"算法一":"算法二"}}
                            </jt-tag>
                        </span>
                    </span>
                    <span slot="description" slot-scope="description">
                        <jt-tooltip placement="topLeft">
                            <span slot="title">
                                <span>{{description}}</span>
                            </span>
                            <span>任务描述: {{description}}</span>
                        </jt-tooltip>
                    </span>
                    <div style="text-align:right" slot="version" slot-scope="version">
                        版本: {{version}}
                    </div>
                    <div style="text-align:right" slot="operate">
                        <jt-button @click="setArithmetic" style="margin-left:10px;width:99px" v-if="envType == 0">
                            <span class="iconfont iconbiangeng" style="vertical-align: middle;margin-right:5px"></span>
                            <span>变更算法</span>
                        </jt-button>
                    </div>
                </jt-table>
                <jt-row :gutter="16" v-if="!nowDerill" class="defaultDrill">
                    <jt-col :span="19" style="color:#666">
                        <h3>系统默认算法</h3>
                        <span class="txt">(您可以根据实际应用场景, 选择针对性更强的算法, 提升机器人回答准确率)</span>
                        <span class="version">版本: {{version}}</span>
                    </jt-col>
                    <jt-col :span="3" :offset="2">
                        <jt-button @click="addArithmetic" style="width:99px" v-if="envType == 0">
                            <span class="iconfont iconbiangeng" style="vertical-align: middle;margin-right:5px"></span>
                            变更算法
                        </jt-button>
                    </jt-col>
                </jt-row>
            </jt-card>
        </div>
        <div class="tableTwo">
            <h3 class="title">算法变更历史</h3>
            <jt-table 
                :columns="tableDataColumns" 
                :data-source="tableData"
                :pagination="false"
                v-if="!tableEmpty"
            >
                <span slot="model" slot-scope="model,record">
                    <span style="width:88px;display:inline-block">
                        {{model == 0?"系统默认算法":model == 3?"深度学习算法":model == 4?"深度学习算法":model == 1?"机器学习算法":"机器学习算法"}}
                    </span>
                    <jt-tag 
                        :color="record.model==3?'green':record.model==4?'orange':record.model==1?'#2db7f5':'purple'" 
                        style="margin-left:5px"
                        v-if="model != 0"
                    >
                        {{record.model==3?'算法一':record.model==4?'算法二':record.model==1?'算法一':'算法二'}}
                    </jt-tag>
                </span>
                <span slot="description" slot-scope="description">
                    <jt-tooltip placement="topLeft">
                        <span slot="title">
                            <span>{{description}}</span>
                        </span>
                        <span>{{description}}</span>
                    </jt-tooltip>
                </span>
            </jt-table>
            <!-- 分页 -->
            <jt-row style="margin-top: 20px;">
                <jt-col :span="8">
                    <!--  <jt-button size="large" type="default" class="delBtn" @click="del" v-if="environment == 'test'">
                        删除
                    </jt-button>     -->
                    <span style="margin:0 16px;">共 {{count}} 条记录</span>
                    <span v-if="isSlip">每页显示</span>
                    <jt-select :defaultValue="10" style="min-width: 50px; margin: 0 5px;" @change="onShowSizeChange" v-if="isSlip">
                        <jt-icon slot="suffixIcon" type="caret-down" :style="{ color: '#606266',marginRight:'-7px' }"/>
                        <jt-select-option v-for='(item,index) in pageList' :key="index">{{item}}</jt-select-option>
                    </jt-select>
                    <span v-if="isSlip">条</span>
                </jt-col>
                <jt-col :span="16">
                    <jt-pagination
                        size="large" :total="count" :current="currentPageIndex" :pageSize="pageSize" showQuickJumper @change="onPageChange" hideOnSinglePage style="float:right"
                    />
                </jt-col>
            </jt-row>
            <jt-empty
                :image-style="{
                    height: '80px',
                }"
                v-if="tableEmpty"
                style="margin-top:80px"
            >
                <span slot="description"> 尚未有历史算法版本 </span>
                <span slot="image">
                    <img src="@/assets/image/empty_datil.png">
                </span>
                
            </jt-empty>
        </div>
        <jt-modal
            v-model="arithmeticModal"
            title="变更算法"
            width="650px"
            class="drillModal"
            @ok="selectDrill"
            :ok-button-props="{props:{disabled:!isPass}}"
        >
            <div class="top">
                <span class="txt">算法选择</span>
            </div>
            <div class="container">
                <jt-card :id="item.id==0?'defaultCard':'card'" :class="activeId == item.id?'active':''" v-for="item in cardList" :key="item.id" @click="cardClick(item)">
                    <span v-if="item.id ==0">
                        <h3>{{item.drillType}}</h3>
                        <span class="txt">({{item.describe}})</span>
                    </span>
                    <span v-if="item.id != 0">
                        <span :class="item.id == 1?'iconBox':item.id == 2?'iconBox':'iconBox2'">
                            <span :class="item.icon"></span>
                        </span>
                        <span class="txt1">{{item.drillType}}</span>
                        <jt-tag :color="item.tagColor" class="tag">{{item.tagTxt}}</jt-tag>
                        <br />
                        <span class="txt2">{{item.describe}}</span>
                    </span>
                </jt-card>
            </div>
            <div class="textarea">
                <p class="txt">任务描述</p>
                <jt-form-model
                    ref="ruleForm"
                    :model="ruleForm"
                    :rules="rules"
                >
                    <jt-form-model-item prop="taskDescription">
                        <jt-textarea id="txt" v-model="ruleForm.taskDescription" autocomplete="off" class="txt2"></jt-textarea>
                        <span class="limit">已输入{{ruleForm.taskDescription.length}}/{{limit}}字</span>
                    </jt-form-model-item>
                </jt-form-model>
                
            </div>
        </jt-modal>
    </div>
</template>

<script>
const topTableDataColumns = [
    {
        title:'',
        dataIndex: 'model',
        key: 'model',
        slots: { title: 'modelTitle' },
        scopedSlots: { customRender: 'model' },
        width:90
    },
    {
        title:'',
        dataIndex: 'description',
        key: 'description',
        slots: { title: 'descriptionTitle' },
        scopedSlots: { customRender: 'description' },
        width:90,
        ellipsis: true,
    },
    {
        title:'',
        dataIndex: 'version',
        key: 'version',
        slots: { title: 'versionTitle' },
        scopedSlots: { customRender: 'version' },
        width:50
    },
    {
        title:'',
        dataIndex: 'operate',
        key: 'operate',
        slots: { title: 'operate' },
        scopedSlots: { customRender: 'operate' },
        width:100
    },
]
const tableDataColumns = [
    {
        title:'版本',
        dataIndex: 'version',
        key: 'version',
        slots: { title: 'versionTitle' },
        scopedSlots: { customRender: 'version' },
        width:150
    },
    {
        title:'描述',
        dataIndex: 'description',
        key: 'description',
        slots: { title: 'descriptionTitle' },
        scopedSlots: { customRender: 'description' },
        ellipsis: true,
    },
    {
        title:'所选算法',
        dataIndex: 'model',
        key: 'model',
        slots: { title: 'modelTitle' },
        scopedSlots: { customRender: 'model' }
    },
    {
        title: '训练时间',
        dataIndex: 'updatetime',
        key: 'updatetime',
        slots: { title: 'updatetimeTitle' },
        scopedSlots: { customRender: 'updatetime' }
    },
]
const tableData = []
import { Card, Tag, Input } from "ant-design-vue"
import { judgeSensitiveWord  } from "@/utils/common.ts";
import { mapActions } from "vuex";
export default {
    components:{
        "jt-card": Card,
        "jt-tag": Tag,
        "jt-textarea": Input.TextArea
    },
    data() {
        const validatetaskDescription = (rule, value, callback) => {
            const isValidateMgc = judgeSensitiveWord(value);
            if (value.length>200) {
                this.isPass = false;
                callback(new Error('字数超过限制'));
            }else if(!isValidateMgc.detectedResult) {
                this.isPass = false;
                callback(new Error(isValidateMgc.errorMsg));
            }else {
                if (this.ruleForm.taskDescription !== '') {
                    this.$refs.ruleForm.validateField('checkPass');
                }
                if(this.activeId != this.topForm.model) {
                    this.isPass = true;
                }else {
                    this.isPass = false;
                }
                callback();
            }
        };
        return {
            envType:"",
            nowDerill:false,
            version: "v1",
            topForm:{
                key:1,
                model: 0,
                description: "",
                version: ""
            },
            arithmeticModal: false,
            cardList: [
                {id:0,drillType:"系统默认算法",describe:"通用算法, 不具有场景针对性"},
                {id:3, icon: "iconfont iconshenduxuexi", drillType:"深度学习算法", tagTxt:"算法一", tagColor:"green",describe:"介绍: 适合对实时响应速度要求较低，准确率要求较高的情况"},
                {id:4, icon: "iconfont iconshenduxuexi", drillType:"深度学习算法", tagTxt:"算法二", tagColor:"orange",describe:"介绍: 适合对实时响应速度要求不高，准确率要求更高的情况"},
                {id:1, icon: "iconfont iconlianjie1", drillType:"机器学习算法", tagTxt:"算法一", tagColor:"#2db7f5",describe:"介绍: 适合对实时响应速度要求较高，准确率要求一般的情况"},
                {id:2, icon: "iconfont iconlianjie1", drillType:"机器学习算法", tagTxt:"算法二", tagColor:"purple",describe:"介绍: 适合对实时响应速度要求一般，准确率要求较高的情况"}
            ],
            ruleForm:{
                taskDescription:'',
            },
            rules: {
                taskDescription: [
                    { validator: validatetaskDescription, trigger: ['change', 'blur'] }
                ]
            },
            activeId:0,
            limit:200,
            drillSelect: 0,
            topTableDataColumns:topTableDataColumns,
            tableDataColumns:tableDataColumns,
            tableDataAll:[],
            tableData:tableData,
            // 分页 start
            count: 1,
            isSlip: false,
            pageList: [10,20,30],
            currentPageIndex:1,
            pageSize: 10,
            // 分页end
            tableEmpty: false,
            isDisabled: false,
            isPass: true
        }
    },
    watch: {
        tableDataAll: {
            deep: true,
            immediate:true,
            handler: function(newV) {
                if(newV.length<1) {
                    this.tableEmpty = true;
                }else {
                    this.tableEmpty = false;
                }
            }
        },
        activeId: {
            immediate: true,
            handler: function(newV,oldV) {
                if(this.activeId != this.topForm.model && newV != oldV) {
                    this.isPass = true;
                    this.ruleForm.taskDescription = '';
                }else {
                    this.isPass = false;
                    this.ruleForm.taskDescription = this.topForm.description;
                }
            }
        }
    },
    created() {
        if(this.$store.state.envInfo.env) {
            if(this.$store.state.envInfo.env == "test") {
                this.envType = 0;
            }else {
                this.envType = 1;
            }
            
        }
    },
    mounted() {
        this.$store.commit(
            'setBreadcrumb',
            [
                {breadcrumbName: this.$store.state.envInfo.envName, breadcrumbPath: this.$store.state.fromPath},
                {breadcrumbName: "机器人训练"}
            ]
        );
        // const emptyIcon = document.querySelector(".ant-empty-description");
        // if(emptyIcon) {
        //     emptyIcon.innerText = '尚未有历史算法版本'
        // }
        this.getModelHistory({op:"search"});
    },
    methods:{
        ...mapActions({
            ChangeModel: "robotDrill/ChangeModel",
            modelhistory: "robotDrill/modelhistory"
        }),
        getModelHistory(val) {
            let data
            if(val.op == "search") {
                data = {
                    envType: this.envType,
                    op: "search"
                }
            }else if(val.op == "add"){
                data = {
                    envType: val.envType,
                    model: val.model,
                    description: val.description,
                    op: val.op
                }
            }
            this.modelhistory(data).then(res => {
                if(val.op == "add") {
                    this.getModelHistory({op:"search"});
                }else if(val.op == "search") {
                    this.tableDataAll = res.res.slice(1);
                    this.tableDataAll.forEach((item, index) => {
                        item.key = index;
                    })
                    this.setPage();
                    this.count = this.tableDataAll.length;
                    if(this.count>10) {
                        this.isSlip = true;
                    }else {
                        this.isSlip = false;
                    }
                    if(res.res[0].model!=0) {
                        this.nowDerill = true;
                        this.topForm = res.res[0];
                        this.topForm.key = 1;
                    }else {
                        this.nowDerill = false;
                        this.version = res.res[0].version;
                        this.topForm = res.res[0];
                        this.topForm.key = 1;
                    }
                }
            }).catch(error => {
                if(error.errno == "-101") {
                    this.$store.commit('setGlobalFreeze', {}, { root: true });
                }else{
                    this.$notification.open({
                        message: "系统繁忙，请稍后重试。",
                        description: "失败原因：" + error.errorMsg,
                        icon: (<jt-icon type="exclamation-circle" theme="filled" style="color:#F04134"/>),
                        duration: 0
                    });
                }
            })
        },
        setArithmetic() {
            this.activeId = 0;
            this.ruleForm.taskDescription = '';
            this.arithmeticModal = true;
            this.isPass = false;
            // 接收接口传参, 然后给弹窗赋值
            this.$nextTick(() => {
                const obj = {
                    id:this.topForm.model ,
                }
                this.cardClick(obj);
                this.activeId = this.topForm.model;
                this.ruleForm.taskDescription = this.topForm.description;
            })
            
        },
        addArithmetic() {
            this.activeId = 0;
            this.ruleForm.taskDescription = '';
            this.isPass = false;
            this.arithmeticModal = true;
            this.$nextTick(() => {
                const obj = {
                    id:this.topForm.model ,
                }
                this.cardClick(obj);
                this.activeId = this.topForm.model;
                this.ruleForm.taskDescription = this.topForm.description;
            })
        },
        cardClick(val) {
            this.activeId = val.id;
            this.drillSelect = val.id;
            this.$nextTick(() => {
                const text = document.querySelector("#txt");
                text.focus();
                text.blur();
            })
            
            
            // this.$nextTick(() => {
            //     const text = document.querySelector("#txt");
            //     if(this.activeId != this.topForm.model) {
            //         this.isPass = true;
            //         this.ruleForm.taskDescription = '';
            //         console.log('dom',text)
            //         text.focus();
            //         text.blur();
            //         text.focus();
            //     }else {
            //         this.isPass = false;
            //         this.ruleForm.taskDescription = this.topForm.description;
            //     }
            // })
            
            
            // if(this.activeId == 0) {
            //     this.ruleForm.taskDescription = "";
            //     this.taskDisabled = true;
            // }else {
            //     this.taskDisabled = false;
            // }
        },
        selectDrill() {
            const data1 = {
                envType: this.envType,
                model: this.drillSelect
            }
            const data2 = {
                envType: this.envType,
                model: this.drillSelect,
                description: this.ruleForm.taskDescription,
                op: "add"
            }
            this.ChangeModel(data1).then(res => {
                this.getModelHistory(data2)
            }).catch(error => {
                if(error.errno == "-101") {
                    this.$store.commit('setGlobalFreeze', {}, { root: true });
                }else{
                    this.$notification.open({
                        message: "系统繁忙，请稍后重试。",
                        description: "失败原因：" + error.errorMsg,
                        icon: (<jt-icon type="exclamation-circle" theme="filled" style="color:#F04134"/>),
                        duration: 0
                    });
                }
            })
            this.$refs['ruleForm'].validate(valid => {
                if (valid) {
                    this.arithmeticModal = false;
                    this.$message.success(
                        '变更算法成功',
                        3,
                    );
                } else {
                    // 变更失败
                    this.$notification.open({
                        message: '变更算法失败!',
                        description:
                          '失败原因: 由于网络问题，操作失败，请稍后再试',
                        icon: <jt-icon type="close-circle" style="color:red"/>,
                    });
                    return false;
                }
            });
        },
        onShowSizeChange(val) {
            if(val==0) {
                this.pageSize = 10
            }else if(val == 1) {
                this.pageSize = 20
            }else if(val == 2) {
                this.pageSize = 30
            }
            this.setPage();
        },
        onPageChange(pageNum,pageSize) {
            this.currentPageIndex = pageNum;
            this.pageSize = pageSize;
            this.setPage();
        },
        setPage() {
            this.tableData = this.tableDataAll.slice((this.currentPageIndex-1)*this.pageSize,this.currentPageIndex*this.pageSize)
        }
    }
}
</script>

<style lang="less" scoped>
    
div.contentBody {
    flex: auto;
    background: #FFFFFF;
    border-radius: 2px;
    padding: 20px 20px 40px 20px;
    overflow-y: auto;
    .topBorder {
        /deep/.ant-table-tbody > tr > td {
            border: none;
        }
    }
    .iconBox {
        display: inline-block;
        width: 28px;
        height: 28px;
        background: #cedfff;
        color: #4c8dff;
        border-radius:14px;
        text-align: center;
        line-height: 28px;
    }
    .iconBox2 {
        display: inline-block;
        width: 28px;
        height: 28px;
        background: #ffeecc;
        color: #ffac06;
        border-radius:14px;
        text-align: center;
        line-height: 28px;
    }
    .tableOne {
        /deep/.ant-col {
            height: 28px;
        }
        >.title {
            font-weight: 700;
        }
        /deep/.ant-card-bordered {
            line-height:28px;
            background:#f5f8ff
        }
        .describe {
            width: 234px;
            overflow: hidden;
            word-break: break-all;
            text-overflow: ellipsis;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
            display: -webkit-box
        }
        .defaultDrill {
            h3 {
                display: inline-block;
                font-weight: 700;
                margin-right: 5px;
            }
            .txt {
                color: #666;
            }
            .version {
                color: #666;
                margin-left: 80px;
            }
        }
    }
    .tableTwo {
        margin-top: 60px;
        >.title {
            font-weight: 700;
        }
    }
    .drillModal {
        .top {
          margin-bottom: 10px;
          >.txt {
              margin-right: 20px;
              vertical-align: middle;
          }
          >.txt2 {
              margin-left: 20px;
              vertical-align: middle
          }
        }
        .container {
            width: 100%;
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            #card {
                cursor: pointer;
                width: 49%;
                margin-top:10px;
                &#card:nth-child(2n) {
                    margin-right:10px
                }
                .txt1 {
                    font-weight: 700;
                    margin-left:20px ;
                }
                .tag {
                    float: right;
                    margin-top: 2px;
                }
                .txt2 {
                    display: inline-block;
                    margin-top: 10px;
                    color: #999;
                }
            }
            #card.active {
                border: 1px solid #4c8dff;
                position: relative;
                transition: all 0.5s ease;
            }
            #card.active::after {
                content: '✔';
                font-family: "Microsoft YaHei";
                display: block;
                height: 0px;
                width: 0px;
                position: absolute;
                bottom: 0;
                right: 0;
                color: #fff;
                font-size: 14px;
                line-height: 18px;
                border: 18px solid;
                border-color: transparent #4c8dff #4c8dff transparent;
            }
            #defaultCard {
                cursor: pointer;
                width: 99.7%;
                margin: 10px 0px 0px 0px;
                h3 {
                    font-weight: 700;
                    display: inline-block;
                }
                .txt {
                    margin-left: 10px;
                    color: #999;
                }
            }
            #defaultCard.active {
                border: 1px solid #4c8dff;
                position: relative;
                transition: all 0.5s ease;
            }
            #defaultCard.active::after {
                content: '✔';
                font-family: "Microsoft YaHei";
                display: block;
                height: 0px;
                width: 0px;
                position: absolute;
                bottom: 0;
                right: 0;
                color: #fff;
                font-size: 14px;
                line-height: 18px;
                border: 18px solid;
                border-color: transparent #4c8dff #4c8dff transparent;
            }
            
        }
        .textarea {
            position: relative;
            margin-top: 10px;
            .txt2 {
                resize: none;
                min-height: 130px;
            }
            .limit {
                position: absolute;
                right: 20px;
                bottom: 0px;
            }
        }
    }
}
</style>