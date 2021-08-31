<template>
    <div class="content1" style="height: 100%;padding-bottom: 60px;">
        <header class="main-header" style="vertical-align:middle;">测试环境</header>
        <div style="margin-bottom: 2px;"></div>
        <div class="content" style="overflow-y: auto;height: 100%;"> 
            <div class="robot_none">
                <jt-row  type="flex" justify="space-between">
                    <jt-col>
                        <h4 class="titleName">机器人列表</h4>    
                    </jt-col>
                    <jt-col style="display: flex; flex-flow: row; ">
                        
                        <a  @click="show" v-show="!showInput" class="icon iconfont iconsousuo searchIcon"></a>
                        <jt-input placeholder="请输入机器人名称" v-show="showInput" style="width: 200px;margin-right: 16px;color: #555555;" v-model = "searchname" v-on:keyup.enter="search" class="search_">
                            
                            <a slot="suffix" class="icon iconfont iconsousuo searchWord" style="font-size: 16px; color: #999999;" @click = "search"></a>
                            <span slot="suffix" class="dividerLineIn"></span>
                            <jt-icon slot="suffix" type="close" style="font-size: 14px;color: #999999;" @click="offshow" class="guanbi"></jt-icon>
                            
                        </jt-input>
                    
                        <span class="dividerLine" style="margin-top: 8px;"></span>
                        <jt-select class = "select_status" v-model = "selectStatus" @change="handleChange()">
                            <jt-select-option v-for = "select_status in status" :key = "select_status">{{select_status}}</jt-select-option>
                        </jt-select>  
                        <jt-select class = "select_status" v-model = "selectType" @change="handleChangeType">
                            <jt-select-option v-for = "select_status in statusType" :key = "select_status">{{select_status}}</jt-select-option>
                        </jt-select>  
                        <jt-button size="large"  type="primary" style="padding:6px 8px;width: 98px; height: 32px;"  @click="showModal">
                            <div style="display: flex; flex-flow: row; ">
                                <span class="iconfont btn-icon" style="vertical-align: middle; width: 16px;height: 16px; color: #FFFFFF;">&#xe628;</span>
                                <span style="color: #FFFFFF;margin-left: 4px;">新建机器人 </span>
                            </div>
                            
                        </jt-button>
                    
                        <jt-modal
                            :visible="visible"
                            centered
                            title='新建机器人'
                            width="600px"
                            height="335px"
                            font-size="16px"
                            border-radius="4px"
                            @cancel="handleCancel"
                            @ok="handleSubmit(once)"
                        >
                            <template slot="footer">
                                <jt-button key="back" style="width: 64px;margin-top: 6px;margin-bottom: 6px;" @click="handleCancel">
                                    取消
                                </jt-button>
                                <jt-button :disabled="addRobotSubmit" type="primary" style="width: 64px; margin-right: 4px;" @click="handleSubmit(once)">
                                    确定
                                </jt-button>
                            </template>
                            <jt-form layout='vertical' :form="form" :wrapper-col="{ span: 25 }" style="margin-left: 16px; ">
                                <div style="display: flex; flex-flow: row; ">
                                    <span style="color: #F04134;margin-top: 7px;">*</span>
                                    <span style="margin-left: 4px;margin-top: 7px;">机器人名称</span>
                                    <jt-form-item style="margin-left: 10px;">   
                                        <jt-input 
                                            placeholder="仅支持中文、英文、数字与下划线，12字以内" 
                                            style="font-size: 12px; width:320px; height:32px; border-radius:2px;"
                                            v-model = "nameVal"
                                            v-decorator="[
                                                'confirm',
                                                {
                                                    rules: [
                                                        {
                                                            validator: checkname,
                                                        },
                                                    ],
                                                },
                                            ]"
                                        />
                                    </jt-form-item>
                                </div>
                                <div style="display: flex; flex-flow: row; ">
                                    <span style="color: #F04134;margin-top: 7px;">*</span>
                                    <span style="margin-left: 4px;margin-top: 7px;">机器人类型</span>
                                    <jt-form-item style="margin-left: 10px;width:320px">
                                        <jt-button-group>
                                            <jt-radio-group 
                                                @change="checkChange"
                                                :default-value="0"
                                                :value="activeRobot"
                                                name="type"
                                            >
                                                <jt-radio-button :value="0" class="robotTxt">
                                                    文本机器人
                                                </jt-radio-button>
                                                <jt-radio-button :value="1" class="robotIn">
                                                    呼入机器人
                                                </jt-radio-button>
                                            </jt-radio-group>
                                        </jt-button-group>
                                    </jt-form-item>
                                </div>
                                <div style="display: flex; flex-flow: row;" v-show="activeRobot === 1">
                                    <span style="color: #F04134;margin-top: 7px;">*</span>
                                    <span style="margin-left: 4px;margin-top: 7px;">转人工设置</span>
                                    <jt-form-item style="margin-left: 10px;;margin-top: 4px;width:320px">
                                        <jt-switch 
                                            @change="artificialSwitchChange" 
                                            :checked="artificialSwitch"
                                        />
                                        <jt-input 
                                            v-show="artificialSwitch" 
                                            placeholder="请输入转人工号码" 
                                            style="margin-top:5px"
                                            v-model="artificialPhone"
                                            v-decorator="[
                                                'change',
                                                {
                                                    rules: [
                                                        {
                                                            validator: checkArtificial,
                                                        },
                                                    ],
                                                },
                                            ]"
                                        ></jt-input>
                                    </jt-form-item>
                                </div>
                                <div style="display: flex; flex-flow: row; margin-left: 9px;margin-bottom: 0px;height: 130px;">
                                    <span style="height:120px ;margin-top: 4px;">机器人描述</span>
                                    <jt-form-item style="margin-left: 10px;">    
                                        <jt-input-textarea  
                                            placeholder="机器人的功能和使用场景说明，200字以内" 
                                            style="font-size: 12px; width:400px;height:120px; resize: none;" 
                                            v-model = "describeVal"
                                            v-decorator="[
                                                'note',
                                                {
                                                    rules: [
                                                        {
                                                            validator: checkdescribe,
                                                        },
                                                    ],
                                                },
                                            ]"
                                        />
                                        <!-- <span class="tips" style="position: absolute;bottom: 8px;right: 12px; font-size: 12px;">
                                            已输入
                                            <b>{{this.describeVal.length}}</b>/200字
                                        </span>    -->     
                                        <!-- <div>  
                                            <span class="tips" style="text-align: right; font-size: 12px;">
                                                已输入
                                                <b>{{this.describeVal.length}}</b>/200字
                                            </span> 
                                        </div>    -->                 
                                    </jt-form-item>   
                                    
                                </div>              
                            </jt-form>
                        </jt-modal>

                    </jt-col>
                </jt-row>
                <article>
                    <jt-loading v-if='loading'></jt-loading>
                    <router-view></router-view>
                </article>
                <div v-if = "isNone" style="margin-top: 55px;">
                    <!--空态时显示-->   
                    <jt-empty :image="emptyImage" :imageStyle="{ margin: 'auto',width:'400px',height:'400px'}">
                        <div class="emptyDescriptS" slot="description" style="margin-top:-145px">
                            <p class="emptyDescript">您还没有添加任何机器人</p>
                            <p>您可以点击 <a href="javascript:;" @click="showModal">新建机器人</a>创建属于自己的机器人</p>
                        </div>
                    </jt-empty>
                </div>
                <div v-if = "searchNone && (!isNone)" style="margin-top: 55px;">
                    <jt-empty :image="searchnoneImage" :imageStyle="{ margin: 'auto',width:'400px',height:'400px'}">
                        <div class="emptyDescriptS" slot="description" style="margin-top:-145px">
                            <p class="emptyDescript">抱歉，没有匹配到任何搜索结果</p>
                            <p>您可以换一个关键词试试哦～</p>
                        </div>
                    </jt-empty>
                </div>
                <div v-if = "(!searchNone) && (!isNone)">
                    <jt-configProvider>
                        <jt-table 
                            :columns="robotColumns" 
                            :dataSource="exampleData" 
                            class="mt16 jtTableTest" 
                            :pagination="false" 
                            :customRow="clickRow"
                            rowKey="botnameid"
                        >
                            <span slot="botnameid"  slot-scope="text, record">
                                <div style="display: flex; flex-flow: row;">
                                    <div style="width: 48px; height: 48px;margin: 3px 0px 3px 0px;">
                                        <img src="../../assets/image/RobotAvatar.png" width="48px" height="48px" />
                                    </div>
                                    
                                    <div style="margin-left: 8px;margin-top: 8px;">
                                        <div class="robotName" style="display: flex; flex-flow: row; width: 144px;">
                                            <!-- <span  style="width: 142px;"> -->
                                            <jt-tooltip :title = "(text || '').split(' ')[0]">
                                                <div style="max-width: 82px;text-overflow: ellipsis; overflow: hidden ;cursor: pointer;">
                                                    {{(text || '').split(" ")[0]}}    
                                                </div>
                                            </jt-tooltip>
                                            <tag v-show="(record.status==1)" style="color:#87DF9B;border:1px solid rgba(135,223,155,1);background-color:rgba(231,248,235,1);margin-left: 8px; padding:0px 8px 0px 8px; height: 20px;font-size: 12px; border-radius: 2px;">已上线</tag>
                                            <!-- </span> -->
                                        </div>
                                        <!-- <span class="robotId" style="margin-top: 4px">ID：{{(text || '').split(" ")[1]}}</span> -->
                                        <jt-tooltip :title = "(text || '').split(' ')[1]">
                                            <span class="robotId" style="vertical-align: middle;margin-top: 4px ;cursor: pointer; ">ID：{{(text || '').split(" ")[1]}}</span>
                                        </jt-tooltip>
                                        <jt-tooltip title = "复制">
                                            <span class="btn-common" @click="copy()">
                                                <span class="iconfont btn-icon copy-code-button" :data-clipboard-text = "(text || '').split(' ')[1]" style="vertical-align: middle; margin-right: 4px; color: #999999;">&#xe61c;</span>
                                            </span>
                                        </jt-tooltip>
                                        <div v-show="record.vtelno !== undefined && record.vtelno !== ''">Tel.No.：{{record.vtelno}}</div>
                                    </div>
                                </div>    
                            </span>
                            <span slot="botdescription" slot-scope="text">
                                <div style="display: flex; flex-flow: row;">
                                    <jt-tooltip :title = "text">
                                        <div style="text-overflow: ellipsis; overflow: hidden ;cursor: pointer;">
                                            {{text}}    
                                        </div>
                                    </jt-tooltip>
                                </div>
                            </span>
                            <span slot="updateuserid" slot-scope="text">
                                <div style="display: flex; flex-flow: row;">
                                    <jt-tooltip :title = "text">
                                        <div style="text-overflow: ellipsis; overflow: hidden ;cursor: pointer;">
                                            {{text}}    
                                        </div>
                                    </jt-tooltip>
                                </div>
                            </span>
                            <span slot="options-slot" slot-scope="text, record">
                                <!-- display: flex; flex-flow: row    同一个div处于同一水平线 -->
                                <div style="display: flex; flex-flow: row;">


                                    <!-- <a :disabled="record.publish == 0" :class="(record.publish == 1) ? 'btn-common' : 'btn-common-gray'" @click="allowPublishRobot(record.botnameid,record.publish)"> -->
                                    <a class="btn-common" @click="allowPublishRobot(record.botnameid,record.publish,record)">
                                        <span class="iconfont btn-icon" style="vertical-align: middle; margin-right: 4px; color: #999999;">&#xe619;</span>
                                        <span style="vertical-align: middle;">发布</span>
                                    </a>

                                    <span class="btn-common" @click="setRobot(record.botnameid,record.botdescription,record.status,record.bottype)">
                                        <span class="iconfont btn-icon" style="vertical-align: middle; margin-right: 4px; color: #999999;">&#xe63b;</span>
                                        <span style="vertical-align: middle;">设置</span>
                                    </span>                       
                                            
                                    <span class="btn-common" v-show = "(record.status==0)" @click="deleteRobot(record.botnameid)">
                                        <span class="iconfont btn-icon" style="vertical-align: middle; margin-right: 4px; color: #999999;">&#xe62f;</span>
                                        <span style="vertical-align: middle;">删除</span>
                                    </span>
                                </div>
                            </span>    
                            <span slot="bottype" slot-scope="text">
                                <div v-if="text === 0">文本机器人</div>
                                <div v-if="text === 1">呼入机器人</div>
                            </span>
                        </jt-table>
                    
                        <!-- <template  v-slot:renderEmpty>
                            <jt-empty :image="searchnoneImage" :imageStyle="{ margin: 'auto',width:'400px',height:'400px'}">
                                <div class="emptyDescriptS" slot="description" style="margin-top:-145px">
                                    <p class="emptyDescript">抱歉，没有匹配到任何搜索结果</p>
                                    <p>您可以换一个关键词试试哦～</p>
                                </div>
                            </jt-empty>
                        </template>  -->
                    </jt-configProvider>
                    <jt-row class="mt16" v-show="!searchNone">
                        <jt-col :span="6" class="pageOptionWrap">
                            <!-- <span> 共 {{typeDCount}} 条记录</span>
                            <span class="pageOption" v-show="showpagemes">每页显示</span>
                            <jt-select :defaultValue="PageSize"  style="width: 52px" @change="pageChange" class="pageOptionSel" v-show="showpagemes">
                                <jt-icon slot="suffixIcon" type="caret-down" :style="{ color: '#606266',marginRight:'-7px' }"/>
                                <jt-select-option value="10">10</jt-select-option>
                                <jt-select-option value="20">20</jt-select-option>
                                <jt-select-option value="30">30</jt-select-option>
                            </jt-select>
                            <span v-show="showpagemes">条</span> -->
                            <span style="margin-left: 16px;">共 {{typeDCount}} 条记录</span>
                            <span class="pageOption" v-show="showpagemes" style="margin-left: 15px;">每页显示</span>
                            <jt-select
                                :defaultValue="10"
                                style="min-width: 50px; margin: 0 5px;"
                                @change="pageChange"
                                v-show="showpagemes"
                            >
                                <jt-icon slot="suffixIcon" type="caret-down" :style="{ color: '#606266',marginRight:'-7px' }"/>
                                <jt-select-option value="10">10</jt-select-option>
                                <jt-select-option value="20">20</jt-select-option>
                                <jt-select-option value="30">30</jt-select-option>
                            </jt-select>
                            <span v-show="showpagemes">条</span>
                        </jt-col>
                        <!-- <jt-col :span="18">
                            <jt-pagination  :total="typeDCount" :pageSize="PageSize" show-quick-jumper style="text-align: right; font-size: 12px"   @change="onTypical4PageChange" v-show="showpagemes">
                            </jt-pagination>
                        </jt-col> -->
                        <div style="text-align: right;" v-show="showpagemes">
                            <jt-pagination
                                showQuickJumper
                                :current="currentPage"
                                :pageSize="PageSize"
                                :total="typeDCount"
                                @change="onTypical4PageChange"
                                style="text-align: right;"
                            />
                        </div>
                    </jt-row>
                </div>
            </div>           
        </div>       
    </div>
</template>
<script>
// import md5 from 'js-md5';
import Vue from 'vue'
import { mapState } from "vuex";
import * as Api from '@/utils/http.js';
import {mapActions} from 'vuex';
import {ConfigProvider,Modal,Pagination,Select,Table,Tag, Empty,Form,Input} from "ant-design-vue";
import { judgeSensitiveWord } from "@/utils/common.ts";
import {environment} from "@/utils/cloud.http";
import Clipboard from 'clipboard';

Vue.prototype.$api = Api;
export default {
    name: "RobotNone",
    components: {
        "jt-modal": Modal,
        "jt-select": Select,
        "jt-select-option": Select.Option,
        'jt-table':Table,
        'jt-empty':Empty,
        "jt-pagination":Pagination,
        "jt-form":Form,
        "jt-form-item":Form.Item,
        "jt-input":Input,   
        "jt-configProvider": ConfigProvider,
        [Tag.name]: Tag,
    },
    data(){
        return {
            errorMesAll:"系统繁忙，请稍后再试",
            once : 1,
            currentPage : 1,
            searchNone:false,
            searchname:"",
            showInput:false,
            isDisabled : false,//false时可点击
            addRobotSubmit : true,
            describeVal: "",
            nameVal:"",
            typeVal: "",
            robotData:[],
            exampleData : [],
            PageSize : 10,
            typeDCount : 0,
            isNone : false,
            selectStatus : "全部状态",
            status : ["全部状态","已上线","未上线"],
            selectType: "全部类型",
            statusType: ["全部类型","文本机器人","呼入机器人"],
            visible: false,
            confirmLoading: false,
            robotColumns : [
                {title: '机器人名称',dataIndex: 'botnameid',key: 'botnameid', scopedSlots: { customRender: "botnameid"},width:200},
                {title: '机器人类型',dataIndex: 'bottype',key: 'bottype', scopedSlots: { customRender: "bottype"},width:110},
                {title: '机器人描述', dataIndex: 'botdescription',key: 'botdescription',width:150,ellipsis: true,scopedSlots: { customRender: "botdescription" }},
                {title: '最后修改人',dataIndex: 'updateuserid',key: 'updateuserid',width:131,scopedSlots: { customRender: "updateuserid" }},
                {title: '修改时间',dataIndex: 'updatetime', key: 'updatetime',width:150},
                {title: "操作",dataIndex: "options",key: "options",scopedSlots: { customRender: "options-slot" },width:200}
            ],
            publishstatus :1,
            searchData : [],
            emptyImage: require("@/assets/image/noneProject.png"),
            searchnoneImage: require("@/assets/image/noneData.png"),
            formLayout: 'horizontal',
            form: this.$form.createForm(this, { name: 'coordinated' }),
            deleteSuccess:1,
            deleteSuccessCache : 1,
            deleteSuccessKeywords : 1,
            ispublish : false,
            isdelete : false,
            isset : false,
            showpagemes:true,
            checkActive: null,
            activeRobot: 0,
            artificial: false,
            artificialSwitch: false,
            artificialPhone: "",
            selectnumSearch: ""
        }
    },
    beforeCreate() {
        this.form = this.$form.createForm(this, { name: 'register' });
    },
    async mounted(){
        /* 页数统计、页面跳转 */
        if(environment) {
            await this.$store.commit('showLoading', {}, { root: true });
            await this.$store.dispatch("fetchUsers").then(() => {
                if (this.userinfo.id) {
                    this.queryRobotList([0,this.userId,"",""]).then(res => {
                        if(res.errno == 0){
                            this.initPage()
                            this.typeDCount = this.robotData.length;
                            this.exampleData = this.calctypeDDataShow(1);   
                        }else if(res.errno != '-101'){
                            if(res.errno == 999){
                                this.error("查询机器人失败",this.errorMesAll,0)
                            }else{
                                this.error("查询机器人失败",this.errorMesAll,4.5)
                            }
                            
                        }         
                    })
                }
            });
            await this.$store.commit('hideLoading', {}, { root: true }); 
        }else{
            this.queryRobotList([0,this.userId,"",""]).then(res => {
                if(res.errno == 0){
                    this.initPage()
                    this.typeDCount = this.robotData.length;
                    this.exampleData = this.calctypeDDataShow(1);   
                }else if(res.errno != '-101'){
                    if(res.errno == 999){
                        this.error("查询机器人失败",this.errorMesAll,0)
                    }else{
                        this.error("查询机器人失败",this.errorMesAll,4.5)
                    }
                }              
            })
        }   
        
    },
    
    computed: {
        ...mapState(["loading","userinfo","userId","userType"]),
    },
    watch: {
        typeDCount: {
            handler() {
                if(this.typeDCount < 11){
                    this.showpagemes = false;
                }else{
                    this.showpagemes = true;
                }
            },
            immediate: true
        },
        activeRobot: {
            handler(newV) {
                const reg=/[a-zA-Z0-9_\u4e00-\u9fa5\uff41-\uff5a\uff21-\uff3a]/;
                if(
                    newV === 0
                    && this.describeVal.length <= 200 
                    && (judgeSensitiveWord(this.describeVal).detectedResult) 
                    && this.nameVal.length > 0 
                    && this.nameVal.length <= 12 
                    && reg.test(this.nameVal) 
                    && (judgeSensitiveWord(this.nameVal).detectedResult)
                ) {
                    console.log(this.nameVal)
                    this.addRobotSubmit = false;
                }else if(newV === 0) {
                    this.addRobotSubmit = true;
                }else if(
                    newV === 1
                    && this.describeVal.length <= 200 
                    && (judgeSensitiveWord(this.describeVal).detectedResult) 
                    && this.nameVal.length > 0 
                    && this.nameVal.length <= 12 
                    && reg.test(this.nameVal) 
                    && (judgeSensitiveWord(this.nameVal).detectedResult)
                    && this.artificialPhone.length > 0
                    && this.artificialPhone.length < 12
                ) {
                    this.addRobotSubmit = false;
                }else if(newV === 1) {
                    this.addRobotSubmit = true;
                }
            }
        }
        
    },
    methods: {
        //点击table行进行页面跳转
        ...mapActions({
            queryRobotList: "testEnv/queryRobotList",
            queryPublishstatus:"testEnv/queryPublishstatus",
            deleteRobotInter:"testEnv/deleteRobotInter",
            queryRobotStatusList:"testEnv/queryRobotStatusList",
            createRobot:"testEnv/createRobot",
            setBotinfoDeleteRedis:"productionEnv/setBotinfoDeleteRedis",
        }),
        show(){
            this.showInput = !this.showInput;
        },
        offshow(){
            this.searchname = "";
            this.showInput = !this.showInput;
            let selectnum = "";
            if(this.selectStatus == "未上线"){
                selectnum ="0";
            }else if(this.selectStatus == "已上线"){
                selectnum ="1";
            }
            this.queryRobotList([0,this.userId,selectnum,this.searchname]).then(res => {
                if(res.errno == 0){
                    this.initPage();
                    this.typeDCount = this.robotData.length;
                    this.exampleData = this.calctypeDDataShow(1);   
                }else if(res.errno != '-101'){
                    if(res.errno == 999){
                        this.error("查询机器人失败",this.errorMesAll,0)
                    }else{
                        this.error("查询机器人失败",this.errorMesAll,4.5)
                    }
                }
            })
        },
        handleChange(){
            let selectType;
            this.selectnumSearch = "";
            if(this.selectStatus == "未上线"){
                this.selectnumSearch ="0";
            }else if(this.selectStatus == "已上线"){
                this.selectnumSearch ="1";
            }
            if(this.selectType === "全部类型") {
                selectType = null;
            }else if(this.selectType === "文本机器人") {
                selectType = 0
            }else if(this.selectType === "呼入机器人") {
                selectType = 1
            }
            console.log('??',selectType)
            this.queryRobotList([0,this.userId,this.selectnumSearch,this.searchname,selectType]).then(res => {
                if(res.errno == 0){
                    this.initPage();
                    this.typeDCount = this.robotData.length;
                    this.onTypical4PageChange(1);
                }else if(res.errno != '-101'){
                    if(res.errno == 999){
                        this.error("查询机器人失败",this.errorMesAll,0)
                    }else{
                        this.error("查询机器人失败",this.errorMesAll,4.5)
                    }
                }
            })
        },
        handleChangeType() {
            let selectType;
            if(this.selectType === "全部类型") {
                selectType = null;
            }else if(this.selectType === "文本机器人") {
                selectType = 0
            }else if(this.selectType === "呼入机器人") {
                selectType = 1
            }
            this.queryRobotList([0,this.userId,this.selectnumSearch,this.searchname,selectType]).then(res => {
                if(res.errno == 0){
                    this.initPage();
                    this.typeDCount = this.robotData.length;
                    this.onTypical4PageChange(1);
                }else if(res.errno != '-101'){
                    if(res.errno == 999){
                        this.error("查询机器人失败",this.errorMesAll,0)
                    }else{
                        this.error("查询机器人失败",this.errorMesAll,4.5)
                    }
                }
            })
        },
        clickRow(record){
            // this.changeBcg()
            return {
                on: {
                    click: () => {
                        if((!this.isdelete) && (!this.ispublish) && (!this.isset)){
                            const RobotName = record.botnameid.split(" ")[0];
                            const RobotID = record.botnameid.split(" ")[1];
                            this.$router.push({path: '/home/robotHome'});
                            // set robotInfo and envInfo to vuex
                            this.$store.commit(
                                'setEnvInfo',
                                'test'
                            );
                            this.$store.commit(
                                'setRobotInfo',
                                {
                                    robotId: RobotID,
                                    robotName: RobotName
                                }
                            );
                        }
                    }
                }
            }
        },
        initPage(){   
            //debugger
            this.robotData = [];
            this.robotData = this.$store.state.testEnv.robotList;
            if(this.searchname == ""){
                this.searchNone = false;
                if(this.robotData.length == 0){
                    this.isNone = true;
                }else{
                    this.isNone = false;
                }
            }else{
                this.isNone = false;
                if(this.robotData.length == 0){
                    this.searchNone = true;
                }else{
                    this.searchNone = false;
                }
            }
        },
        todo(){
            console.log("todo");
        },
        setRobot(name,describe,status,bottype){
            const setRobotName = name.split(" ")[0];
            const setRobotID = name.split(" ")[1];
            this.isset = true;
            this.$router.push({path:'/home/robotSet',query:{robotName:setRobotName,robotID:setRobotID,describe:describe,status:status,bottype:bottype}});
        },
        search(){  
            let selectnum = "";
            if(this.selectStatus == "未上线"){
                selectnum ="0";
            }else if(this.selectStatus == "已上线"){
                selectnum ="1";
            }
            this.queryRobotList([0,this.userId,selectnum,this.searchname]).then(res => {
                if(res.errno == 0){
                    this.initPage();
                    this.typeDCount = this.robotData.length;
                    this.onTypical4PageChange(1);
                }else if(res.errno != '-101'){
                    if(res.errno == 999){
                        this.error("查询机器人失败",this.errorMesAll,0)
                    }else{
                        this.error("查询机器人失败",this.errorMesAll,4.5)
                    }
                }
            })   
        },
        showModal() {
            this.describeVal= "";
            this.nameVal = "";
            this.activeRobot = 0;
            this.artificialSwitch = false;
            /* 清空表单 */
            this.form.resetFields();
            this.visible = true;
        },
        handleCancel() {
            this.visible = false;  
            this.addRobotSubmit =  true;  
            this.once = 1;
        },
        checkChange(val) {
            // this.checkActive = val.target.value;
            this.activeRobot = val.target.value;
            if(this.activeRobot === 1) {
                this.artificial = true;
            }
        },
        artificialSwitchChange(val) {
            this.artificialSwitch = val;
        },
        handleSubmit(once) {
            if(once == 1){
                /* const date = (new Date()).valueOf();//1589798793181          
                const num = Math.ceil(Math.random()*10000);//1~10000随机数          
                const selfrobotid = md5(date+this.nameVal+num); */
                // console.log(selfrobotid);
                // console.log(md5(selfrobotid));
                this.createRobot([0,this.userId,this.userType,this.nameVal,this.describeVal,this.activeRobot,this.artificialPhone]).then(() => {
                    let selectnum = "";
                    if(this.selectStatus == "未上线"){
                        selectnum ="0";
                    }else if(this.selectStatus == "已上线"){
                        selectnum ="1";
                    }
                    if(this.$store.state.testEnv.createRobotSuccess==0){
                        this.queryRobotStatusList([0,this.userId,selectnum,this.searchname]).then(res => {
                            if(res.errno==0){
                                this.$message.success("创建成功");
                                this.initPage();
                                this.typeDCount = this.robotData.length;
                                this.exampleData = this.calctypeDDataShow(this.currentPage);
                            }else if(res.errno != '-101'){
                                if(res.errno == 999){
                                    this.error("查询机器人失败",this.errorMesAll,0)
                                }else{
                                    this.error("查询机器人失败",this.errorMesAll,4.5)
                                }
                            }
                            this.visible = false;      
                            this.addRobotSubmit =  true;
                            this.once = 1;
                        });
                    }else{
                        this.visible = false;      
                        this.addRobotSubmit =  true;
                        this.once = 1;
                        if(this.$store.state.testEnv.createRobotSuccess != '-101'){
                            if(this.$store.state.testEnv.createRobotSuccess == 999){
                                this.error("创建机器人失败",this.errorMesAll,0)
                            }else{
                                this.error("创建机器人失败",this.errorMesAll,4.5)
                            }
                        }
                        
                    }
                    
                })
            }
            this.once = 2;    
        },
        checkname(rule, value, callback) {
            // const form = this.form;
            const reg =/^[a-zA-Z0-9_\u4e00-\u9fa5\uff41-\uff5a\uff21-\uff3a\uFF10-\uFF19]+$/;
            const response = judgeSensitiveWord(value);
            if (value && !reg.test(value)) {
                this.addRobotSubmit = true;
                callback('仅支持中文、英文、数字与下划线 ！');
            }else if(value.length > 12){
                this.addRobotSubmit = true;
                callback('不可超过12字');
            }else if(value.length == 0){
                this.addRobotSubmit = true;
                callback('请输入机器人名称');
            }else if(!response.detectedResult){
                this.addRobotSubmit = true;
                callback(response.errorMsg);
            }else if(
                this.describeVal.length <= 200 
                && (judgeSensitiveWord(this.describeVal).detectedResult) 
                && this.activeRobot === 1
                && this.artificialPhone.length > 0
                && this.artificialPhone.length < 12
            ){
                this.addRobotSubmit = false;
                callback();
            }else if(
                this.describeVal.length <= 200 
                && (judgeSensitiveWord(this.describeVal).detectedResult) 
                && this.activeRobot === 0
            ) {
                this.addRobotSubmit = false;
                callback();
            }
        },
        checkdescribe(rule, value, callback) {
            // const form = this.form;
            const reg=/[a-zA-Z0-9_\u4e00-\u9fa5\uff41-\uff5a\uff21-\uff3a]/;
            const responseSen = judgeSensitiveWord(value);
            if (value.length > 200) {
                this.addRobotSubmit = true;
                callback('不可超过200字');
            }else if(!responseSen.detectedResult){
                this.addRobotSubmit = true;
                callback(responseSen.errorMsg);
            }else if(this.nameVal.length > 0 && this.nameVal.length <= 12 && reg.test(this.nameVal) && (judgeSensitiveWord(this.nameVal).detectedResult)){
                this.addRobotSubmit = false;
                callback();
            }
        },
        checkArtificial(rule,value,callback) {
            const reg=/[a-zA-Z0-9_\u4e00-\u9fa5\uff41-\uff5a\uff21-\uff3a]/;
            if(this.artificialSwitch) {
                if (value.length > 11) {
                    this.addRobotSubmit = true;
                    callback('号码不可超过11位');
                }else if(value.length === 0) {
                    this.addRobotSubmit = true;
                    callback('请输入转人工号码');
                }else if(
                    this.describeVal.length <= 200 
                    && (judgeSensitiveWord(this.describeVal).detectedResult) 
                    && this.nameVal.length > 0 
                    && this.nameVal.length <= 12 
                    && reg.test(this.nameVal) 
                    && (judgeSensitiveWord(this.nameVal).detectedResult)
                ){
                    this.addRobotSubmit = false;
                    callback();
                }
            }else if(
                this.describeVal.length <= 200 
                && (judgeSensitiveWord(this.describeVal).detectedResult) 
                && this.nameVal.length > 0 
                && this.nameVal.length <= 12 
                && reg.test(this.nameVal) 
                && (judgeSensitiveWord(this.nameVal).detectedResult)
            ){
                callback();
            }
            
        },
        copy () {
            // console.log('copy: ')
            this.isdelete = true;
            const clipboard = new Clipboard('.copy-code-button') // 这里可以理解为选择器，选择上面的复制按钮
            clipboard.on('success', e => {
                this.$message.success("复制成功");
                // 释放内存
                clipboard.destroy()
                this.isdelete = false;
            })
            clipboard.on('error', e => {
                // 不支持复制
                this.$notification.open({
                    message: "当前网络不可用，请检查你的网络设置",
                    // description:'系统繁忙,请稍后再试',
                    // icon: (
                    //     <jt-icon
                    //         type="exclamation-circle"
                    //         theme="filled"
                    //         style="color:#F04134"
                    //     />
                    // )
                });
                // 释放内存
                clipboard.destroy()
            })
        },
        allowPublishRobot(name,publish,row){
            this.ispublish = true;
            /* if(this.allowPublish){
                this.PublishRobot(name);
            }else{
                this.noPublishRobot();
            } */
            this.PublishRobot(name,publish,row.bottype,row.vtelno);
        },
        PublishRobot(name,publish,bottype,vtelno){
            Modal.confirm({
                title :  <div style="font-size:14px;"> 确定发布该机器人吗？</div>,
                content: <div style="font-size:12px; width:204px">发布可能要一定的时间，请耐心等候， 发布成功后可在生产环境查看</div>,
                centered : true,
                okText : '确定',
                cancelText: '取消',
                width:360,
                height:176,
                onOk :() =>{ 
                    this.checkPublish(name,publish,bottype,vtelno);
                },
                onCancel:() =>{ 
                    this.ispublish = false;
                },
                okButtonProps:{ style:{width:'64px'}},
                cancelButtonProps:{ style:{width:'64px'}},
                icon:()=><jt-icon type="exclamation-circle" theme="filled" style="color:#337DFF"/>
            });
            
        },
        noPublishRobot(){
            this.$store.commit('hideLoading', {}, { root: true });
            Modal.warning({
                title: <div style="font-size:14px; width:196px;">您尚未对机器人进行任何配置，请点击机器人卡片，添加数据后再进行发布</div>,
                centered : true,
                width:320,
                height:160,
                icon:()=><jt-icon type="exclamation-circle" theme="filled" style="color:#F04134"/>
            });
            this.ispublish = false;
        },
        checkPublish(name,publish,bottype,vtelno){
            // let publish = 0;
            /* this.publishShan(name.split(" ")[1]).then(res => {
                console.log(this.$store.state.testEnv.hhh+".....");
            }) */
            this.$store.commit('showLoading', {}, { root: true });
            this.queryPublishstatus([this.userId,name.split(" ")[1]]).then(() => {
                this.publishstatus = this.$store.state.testEnv.publishstatus;
                setTimeout(() => {
                    // publish = 1;
                    if(this.publishstatus == 1){
                        this.noPublishRobot();
                    }else if(this.publishstatus == 0){
                        let selectnum = "";
                        if(this.selectStatus == "未上线"){
                            selectnum ="0";
                        }else if(this.selectStatus == "已上线"){
                            selectnum ="1";
                        }
                        this.queryRobotList([0,this.userId,selectnum,this.searchname]).then(res => {
                            if(res.errno == 0){
                                if(bottype === 1) {
                                    this.$message.success(`机器人发布成功生产环境Tel.No:${vtelno}`);
                                }else {
                                    this.$message.success("发布成功");
                                }
                                this.initPage();
                                this.typeDCount = this.robotData.length;
                                this.onTypical4PageChange(this.currentPage);  
                            }else if(res.errno != '-101'){
                                if(res.errno == 999){
                                    this.error("查询机器人失败",this.errorMesAll,0)
                                }else{
                                    this.error("查询机器人失败",this.errorMesAll,4.5)
                                }
                            }
                        })
                        this.ispublish = false;
                        this.$store.commit('hideLoading', {}, { root: true });
                    }else{
                        this.$store.commit('hideLoading', {}, { root: true });
                        if(this.publishstatus != '-101'){
                            if(this.publishstatus == 999){
                                this.openNotification('topRight',name,0);
                            }else{
                                this.openNotification('topRight',name,4.5);
                            }
                        }
                    }
                }, 1000); 
            })  
           
        },
        openNotification(placement,name,time) {    
            const publishRobotName = name.split(" ")[0];
            const publishRobotID = name.split(" ")[1];
            
            this.$notification['error']({
                message: <div style="font-size:14px;font-family:PingFangSC-Semibold,PingFang SC;font-weight:600;color:rgba(38,38,38,1);">发布机器人失败</div>,
                description:
                    <div style="font-size:12px; padding:8px 0px 8px 0px;">
                        
                        <div style="font-size:12px; margin-bottom:8px">机器人名称：{publishRobotName}</div>    
                        <div style="font-size:12px; margin-bottom:8px">机器人ID：{publishRobotID}</div>
                        <div style="font-size:12px;margin-bottom:8px">{this.errorMesAll}</div>
                        
                    </div>,
                icon:()=><jt-icon type="close-circle" theme="filled" style="color:#F04134"/>,
                duration: time,
            });
            this.ispublish = false;
        },
        deleteRobot(name){
            this.isdelete = true;
            Modal.confirm({
                title :  <div style="font-size:14px;"><a-icon type="home" />确定删除该机器人吗？</div>,
                content: 
                    <div style="font-size:12px">
                        删除后，将不可恢复
                    </div>,
                centered : true,
                okText : '删除',
                cancelText: '取消',
                okType: 'danger',
                width:336,
                height:160,
                okButtonProps:{ style:{width:'64px'}},
                cancelButtonProps:{ style:{width:'64px'}},
                onOk :() =>{ 
                    this.checkDeleteSuccess(name);
                },
                onCancel:() =>{ 
                    this.isdelete = false;
                    console.log("取消删除机器人")
                },
                icon:()=><jt-icon type="exclamation-circle" theme="filled" style="color:#F04134"/>
            });
        },
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
        checkDeleteSuccess(name){
            const deleteMes = [(name || '').split(" ")[1],0,1,this.userId];
            this.setBotinfoDeleteRedis(deleteMes).then(() => {
                if(this.$store.state.productionEnv.BotinfoDeleteRedisSuccess == 200){
                    this.deleteRobotInter([0,this.userId,(name || '').split(" ")[1]]).then(() => {
                        this.deleteSuccess = this.$store.state.testEnv.deleterobot;
                        console.log("删除机器人："+this.$store.state.testEnv.deleterobot);
                        if(!this.deleteSuccess){
                            let selectnum = "";
                            if(this.selectStatus == "未上线"){
                                selectnum ="0";
                            }else if(this.selectStatus == "已上线"){
                                selectnum ="1";
                            }
                            this.queryRobotList([0,this.userId,selectnum,this.searchname]).then(res => {
                                if(res.errno == 0){
                                    this.$message.success("删除成功");
                                    this.initPage();
                                    this.typeDCount = this.robotData.length;
                                    if((this.currentPage > 1) && (this.typeDCount % this.PageSize == 0)){
                                        this.currentPage --;
                                    }
                                    this.exampleData = this.calctypeDDataShow(this.currentPage);
                                }else if(res.errno != '-101'){
                                    if(res.errno == 999){
                                        this.error("查询机器人失败",this.errorMesAll,0)
                                    }else{
                                        this.error("查询机器人失败",this.errorMesAll,4.5)
                                    }   
                                }
                                this.isdelete = false;
                            });
                        }else{
                            this.isdelete = false;
                            if(this.deleteSuccess != '-101'){
                                if(this.deleteSuccess == 999){
                                    this.error("删除机器人失败",this.errorMesAll,0);
                                }else{
                                    this.error("删除机器人失败",this.errorMesAll,4.5);
                                }
                            }
                            
                        }
                    })
                }else{
                    this.isdelete = false;
                    if(this.$store.state.productionEnv.BotinfoDeleteRedisSuccess != '-101'){
                        if(this.$store.state.productionEnv.BotinfoDeleteRedisSuccess == 999){
                            this.error("删除机器人失败",this.errorMesAll,0);
                        }else{
                            this.error("删除机器人失败",this.errorMesAll,4.5);
                        }
                    }
                }
                
            })
        },
        /* 控制页面跳转部分 */
        calctypeDDataShow(pageIndex){
            return this.robotData.slice((pageIndex - 1 ) * this.PageSize, pageIndex * this.PageSize);
        },
        pageChange(pages){
            this.PageSize=pages;
            this.onTypical4PageChange(1)
        },
        onTypical4PageChange(pageIndex){
            this.currentPage = pageIndex;
            this.exampleData = this.calctypeDDataShow(pageIndex);
        }    
    }
};
</script>
<style lang="less" >
    @import "~@/assets/style/var.less";
    .main-header{
        height: 58px;
        background-color: #fff;
        padding-left: 20px;
        line-height: 58px;
        font-weight: 500;
        font-size: @jt-font-size-lg;
        color: @jt-color-text-strong;
    }
    .content{
        .robot_none{
            background-color: #fff;
            margin: 20px 20px 40px 20px;
            padding: 20px 20px 20px 20px;
            color: #333333;
            font-size: 16px;
            border-radius:2px;
            /* height:502px;
            overflow-y: auto; */
            min-height: 100%;
            .titleName{
                font-size: @jt-font-size-lg;
                font-weight:500;
                color:@jt-color-text-strong;
            }
            .select_status{
                width:160px;
                height:32px;
                border-radius:2px;
                margin-right: 8px;
                color:#BBBBBB;
                font-size: 12px
            }
            .searchIcon {
                font-size: 18px;
                margin-top: 2px;
                margin-right: 16px;
                color: #555555;
                &:hover {
                    color: #337DFF!important;
                }
            }
            .searchWord{
                font-size: 16px; 
                color: #999999;
                &:hover {
                    color: #337DFF!important;
                }
            } 
            .search_{
                width:210px;
                animation: mymove 0.3s ease-in-out 0s 1 alternate forwards;    
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
            .guanbi{
                &:hover {
                    color: #337DFF!important;
                }
                animation: guanbi 0.3s ease-in-out;    
            }
            @keyframes guanbi
            {
                0%{
                    width:0px;
                }
                
                100%{
                    width:16px;
                }
            }
            .mt16{
                margin-top:16px;
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
                        .ant-select-selection-selected-value{
                            font-size: @jt-font-size-sm;
                        }
                    }
                }
            }
            .dividerLine{
                height: 16px;
                width: 1px;
                background:#E9EBEF;
                margin-right: 16px;
                display: inline-block;
                vertical-align: text-top;
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
            .ant-empty-image img{
                width: 100%!important;
            }
            .ant-table-empty .ant-table-placeholder{
                border-bottom:0!important;
            }
            .ant-modal-title {
                font-size: 16px;
                font-weight: 400;
                color: #333333;
            }
            .emptyDescript{
                font-size:18px;
                font-family:'PingFangSC-Semibold,PingFang SC';
                font-weight:600;
                color:#333333;
                text-align: center;
                margin-bottom:16px;
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
            .jtTableTest{
                thead>tr>th{
                    padding:11px 0px 11px 16px;
                    font-size: @jt-font-size-sm;
                    color:@jt-color-text-strong;
                }
                table tbody tr:hover>td{
                    background: #F5F8FF;
                    cursor: pointer;
                    .action-slot, .btn-icon, .btn-common {
                        color: #337DFF!important;
                    }
                }
                tbody>tr>td{
                    padding:11px 40px 11px 16px;
                    font-size: @jt-font-size-sm;
                    color:@jt-color-text;
                    text-overflow: ellipsis;
                    overflow: hidden; 
                    white-space: nowrap;
                }
            }
            .robotName {
                width: 84px;
                font-size: 14px;
                font-family: PingFangSC-Regular,PingFang SC;
                font-weight: 400;
                color: #555555;
                line-height: 20px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                display: block;
            }
            .robotId {
                width: 84px;
                margin-top: 2px;
                font-size: 12px;
                font-family: PingFangSC-Regular,PingFang SC;
                font-weight: 400;
                color: #999999;
                line-height: 18px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                display: inline-block;
            }
            .robotTxt {
                width: 150px;
                text-align: center;
            }
            .robotIn {
                width: 150px;
                margin-left: 20px;
                text-align: center;
            }
        }
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
    /* .ant-btn{
        padding: 4px 17px;
    } */
    
    .btn-common {
        cursor: pointer;
        color: #555555;
        margin-right: 33px;
    }
    .btn-common-gray {
        cursor: pointer;
        color: #BBBBBB;
        margin-right: 33px;
    }
    /* .style1{
        padding:0px 33px 0px 2px; 
        border: 0px; 
        color:#555555;
        font-size: 12px;
    }
    .style2{
        padding:0px 33px 0px 2px; 
        border: 0px; 
        color:#BBBBBB;
        font-size: 12px;
    } */
    .ant-message{
        font-size: 12px;
    }
    
</style>