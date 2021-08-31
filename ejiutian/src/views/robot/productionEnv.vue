<template>
    <div class="content1" style="height: 100%;padding-bottom: 60px;">
        <header class="main-header" style="vertical-align:middle;">生产环境</header>
        <div style="margin-bottom: 2px;"></div>
        <div class="content" style="overflow-y: auto;height: 100%;">    
            <div class="robot_none">
                <jt-row  type="flex" justify="space-between">
                    <jt-col>
                        <h4 class="titleName">机器人列表</h4>    
                    </jt-col>
                    <jt-col>
                        <a  @click="show" v-show="!showInput" class="icon iconfont iconsousuo searchIcon"></a>
                        <jt-input placeholder="请输入机器人名称" v-show="showInput" style="width: 200px;margin-right: 16px;color: #555555;" v-model = "searchname" v-on:keyup.enter="search" class="search_">
                            
                            <a slot="suffix" class="icon iconfont iconsousuo searchWord" style="font-size: 16px; color: #999999;" @click = "search"></a>
                            <span slot="suffix" class="dividerLineIn"></span>
                            <jt-icon slot="suffix" type="close" style="font-size: 14px;color: #999999;" @click="offshow" class="guanbi"></jt-icon>
                            
                        </jt-input>    
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
                            <p class="emptyDescript">您还没有发布任何机器人</p>
                            <!-- <p>您可以点击 <a href="javascript:;" @click="showModal">新建机器人</a>创建属于自己的机器人</p> -->
                            <p>您可以前往<a href="#/home/testEnv">测试环境</a>，发布已配置的机器人</p>
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
                            class="mt16 jtTable" 
                            :pagination="false" 
                            :customRow="clickRow"
                            rowKey="botnameid"
                            :rowClassName="setRowClassName"
                        >
                            <span slot="botnameid"  slot-scope="text,record">
                                <div style="display: flex; flex-flow: row;width:144px">
                                    <div style="width: 48px; height: 48px;margin: 3px 0px 3px 0px;">
                                        <img src="../../assets/image/RobotAvatar.png" width="48px" height="48px" />
                                    </div>
                                    <div style="margin-left: 8px;margin-top: 8px;">
                                        <div class="robotName" style="display: flex; flex-flow: row; width: 144px;">
                                            <jt-tooltip :title = "(text || '').split(' ')[0]">
                                                <div style="max-width: 82px;text-overflow: ellipsis; overflow: hidden ;cursor: pointer;">
                                                    {{(text || '').split(" ")[0]}}    
                                                </div>
                                            </jt-tooltip>
                                        </div>
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

                            <!-- text可以拿到当前列的值，record可以拿到当前行的数据 -->
                            <span slot="options-slot" slot-scope="text,record">
                                <!-- display: flex; flex-flow: row    同一个div处于同一水平线 -->
                                <div style="display: flex; flex-flow: row;">

                                    <jt-switch checkedChildren="开" unCheckedChildren="关" style="font-size: 12px;" :defaultChecked="(record.switch==1)" @change="onChange(record)"/>

                                    <span class="btn-common" v-show = "(record.switch==0)" @click="deleteRobot(record.botnameid)">
                                        <span class="iconfont btn-icon" style="vertical-align: middle; margin-right: 4px; color: #999999; margin-left: 42px;">&#xe62f;</span>
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
                            <span> 共 {{typeDCount}} 条记录</span>
                            <span class="pageOption" v-show="showpagemes">每页显示</span>
                            <jt-select :defaultValue="PageSize"  style="width: 52px" @change="pageChange" class="pageOptionSel" v-show="showpagemes">
                                <jt-icon slot="suffixIcon" type="caret-down" :style="{ color: '#606266',marginRight:'-7px' }"/>
                                <jt-select-option value="10">10</jt-select-option>
                                <jt-select-option value="20">20</jt-select-option>
                                <jt-select-option value="30">30</jt-select-option>
                            </jt-select>
                            <span v-show="showpagemes">条</span>
                        </jt-col>
                        <jt-col :span="18" v-show="showpagemes">
                            <jt-pagination  :total="typeDCount" :pageSize="PageSize" showQuickJumper :current="currentPage" style="text-align: right; font-size: 12px"   @change="onTypical4PageChange">
                            </jt-pagination>
                        </jt-col>
                    </jt-row>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import Vue from 'vue'
import { mapState } from "vuex";
import Api from '../../utils/http.js';
import {mapActions, mapGetters, mapMutations} from 'vuex';

import {ConfigProvider,Modal,Pagination,Select,Table, Empty,Form,Input} from "ant-design-vue";
import { environment } from '@/utils/cloud.http.js';
import Clipboard from 'clipboard';

Vue.prototype.$api = Api;
export default {
    name: "RobotNone",
    components: {
        /* "jt-modal": Modal, */
        "jt-select": Select,
        "jt-select-option": Select.Option,
        'jt-table':Table,
        'jt-empty':Empty,
        "jt-pagination":Pagination,
        "jt-configProvider": ConfigProvider
    },
    data(){
        return {
            errorMesAll:"系统繁忙，请稍后再试",
            searchname:"",
            searchNone:false,
            showInput:false,
            exampleData : [],
            PageSize : 10,
            typeDCount : 0,
            isNone : false,
            visible: false,
            confirmLoading: false,
            robotColumns : [
                /* {title: '机器人名称',dataIndex: 'botnameid',key: 'botnameid', scopedSlots: { customRender: "botnameid"},width:259},
                {title: '机器人描述', dataIndex: 'botdescription',key: 'botdescription',width:277,ellipsis: true,scopedSlots: { customRender: "botdescription" }},
                {title: '最后修改人',dataIndex: 'updateuserid',key: 'updateuserid',width:136},
                {title: '修改时间',dataIndex: 'updatetime', key: 'updatetime',width:184},
                {title: "操作",dataIndex: "options",key: "options",scopedSlots: { customRender: "options-slot" },width:230} */
                {title: '机器人名称',dataIndex: 'botnameid',key: 'botnameid', scopedSlots: { customRender: "botnameid"},width:254},
                {title: '机器人类型',dataIndex: 'bottype',key: 'bottype', scopedSlots: { customRender: "bottype"},width:110},
                {title: '机器人描述', dataIndex: 'botdescription',key: 'botdescription',width:272,ellipsis: true,scopedSlots: { customRender: "botdescription" }},
                {title: '最后修改人',dataIndex: 'updateuserid',key: 'updateuserid',width:131,scopedSlots: { customRender: "updateuserid" }},
                {title: '修改时间',dataIndex: 'updatetime', key: 'updatetime',width:175},
                {title: "操作",dataIndex: "options",key: "options",scopedSlots: { customRender: "options-slot" },width:225}
            ],
            robotData : [],
            searchData : [],
            emptyImage: require("@/assets/image/noneProject.png"),
            searchnoneImage: require("@/assets/image/noneData.png"),
            formLayout: 'horizontal',
            form: this.$form.createForm(this, { name: 'coordinated' }), 
            deleteSuccess:1,
            deleteSuccessCache : 1,
            deleteSuccessKeywords : 1,      
            isdelete : false,
            isswitch : false,   
            showpagemes:true, 
            currentPage:1,
        }
    },
    beforeCreate() {
        this.form = this.$form.createForm(this, { name: 'register' });
    },
    async mounted(){
        if(environment){
        /* 页数统计、页面跳转 */
            await this.$store.commit('showLoading', {}, { root: true });
            await this.$store.dispatch("fetchUsers").then(() => {
                if (this.userinfo.id) {
                    this.queryRobotList([1,this.userId,""]).then(res => {
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
            this.queryRobotList([1,this.userId,""]).then(res => {
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
    watch: {
        typeDCount: {
            handler(newVal) {
                if(this.typeDCount < 11){
                    this.showpagemes = false;
                }else{
                    this.showpagemes = true;
                }
            },
            immediate: true
        }
    },
    computed: {
        ...mapState(["loading","userinfo","userId"]),
    },
    methods: {
        ...mapActions({
            queryRobotList: "productionEnv/queryRobotList",
            setLaunchstatus: "productionEnv/setLaunchstatus",
            setBotinfoFlag:"productionEnv/setBotinfoFlag",
            setBotinfoDeleteRedis:"productionEnv/setBotinfoDeleteRedis",
            deleteRobotInter:"testEnv/deleteRobotInter",
        }),
        initPage(){   
            //debugger
            this.robotData = [];
            this.robotData = this.$store.state.productionEnv.robotList;
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
        setRowClassName(record){
            console.log(record)
            return record.switch =='1'?'classCusor':'defaultCusor'
        },
        //点击table行进行页面跳转
        clickRow(record){
            return {
                on: {
                    click: () => {
                        if((!this.isdelete) && (!this.isswitch) && (record.switch == 1)){
                            const RobotName = record.botnameid.split(" ")[0];
                            const RobotID = record.botnameid.split(" ")[1];
                            this.$router.push({path: '/home/robotHome'});
                            // set robotInfo and envInfo to vuex
                            this.$store.commit(
                                'setEnvInfo',
                                'production'
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
        todo(){
            console.log("todo");
        },
        show(){
            this.showInput = !this.showInput;
        },
        offshow(){
            this.searchname = "";
            this.showInput = !this.showInput;
            this.queryRobotList([1,this.userId,""]).then(res => {
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
            });  
        },
        search(){
            this.queryRobotList([1,this.userId,this.searchname]).then(res => {
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
            });        
        },
        showModal() {
            this.visible = true;
            this.describeVal= "";
            /* 清空表单 */
            this.form.resetFields();
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
        onChange(record) {  
            this.isswitch = true;
            const status = (record.switch == 0) ? 1 : 0;
            //status= 0 ,状态为关
            const botid = record.botnameid.split(" ")[1];
            
            const data = [1,this.userId,botid,status];
            this.setLaunchstatus(data).then(resStatus => {
                if(resStatus.errno == 0){
                    const setflagdata = [botid,status,this.userId];
                    this.setBotinfoFlag(setflagdata).then(() => {
                        if(this.$store.state.productionEnv.BotinfoFlagSuccess==200){
                            this.queryRobotList([1,this.userId,this.searchname]).then(res => {
                                if(res.errno == 0){
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
                            });  
                        }else if(this.$store.state.productionEnv.BotinfoFlagSuccess != '-101'){
                            if(this.$store.state.productionEnv.BotinfoFlagSuccess == 999){
                                this.error("更改机器人状态失败",this.errorMesAll,0)
                            }else{
                                this.error("更改机器人状态失败",this.errorMesAll,4.5)
                            }
                                
                        }      
                    });  
                }else if(resStatus.errno != '-101'){
                    if(resStatus.errno == 999){
                        this.error("更改机器人状态失败",this.errorMesAll,0)
                    }else{
                        this.error("更改机器人状态失败",this.errorMesAll,4.5)
                    }
                }      
            });       
            setTimeout(() => {
                this.isswitch = false;    
            }, 100);    
        },
        deleteRobot(name){
            this.isdelete = true;
            Modal.confirm({
                title :  <div style="font-size:14px;"><a-icon type="home" />确定删除该机器人吗？</div>,
                content: 
                    <div style="font-size:12px">
                        删除后该机器人将不再提供会话服务
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
        
        checkDeleteSuccess(name){    
            const deleteMes = [(name || '').split(" ")[1],1,0,this.userId];
            this.setBotinfoDeleteRedis(deleteMes).then(()=>{
                if(this.$store.state.productionEnv.BotinfoDeleteRedisSuccess == 200){
                    this.deleteRobotInter([1,this.userId,(name || '').split(" ")[1]]).then(() => {
                        this.deleteSuccess = this.$store.state.testEnv.deleterobot;
                        if((!this.deleteSuccess)){
                            this.queryRobotList([1,this.userId,this.searchname]).then(res => {
                                if(res.errno == 0){
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
                                this.$message.success("删除成功");
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
                    });
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
            });
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
<style lang="less">
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
    
    .ant-message{
        font-size: 12px;
    }
    .robot_none{
        background-color: #fff;
        margin: 20px 20px 40px 20px;
        padding: 20px 20px 20px 20px;
        color: #333333;
        font-size: 16px;
        border-radius:2px;
        min-height: 100%;
        .titleName{
            font-size: @jt-font-size-lg;
            font-weight:500;
            color:@jt-color-text-strong;
        }
        /* .select_status{
            width:160px;
            height:32px;
            border-radius:2px;
            margin-right: 8px;
            color:#BBBBBB;
            font-size: 12px
        } */
        .dividerLineIn{
            height: 16px;
            width: 1px;
            background:#E9EBEF;
            margin-right: 6px;
            margin-left: 6px;
            display: inline-block;
            vertical-align: text-top;
        }
        .style1{
            padding:0px 33px 0px 40px; 
            border: 0px; 
            color:#555555;
            font-size: 12px;
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
        /* .dividerLine{
            height: 16px;
            width: 1px;
            background:#E9EBEF;
            margin-right: 16px;
            display: inline-block;
            vertical-align: text-top;
        } */
        .ant-empty-image img{
            width: 100%!important;
        }
        .ant-table-empty .ant-table-placeholder{
            border-bottom:0!important;
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
        .btn-common {
            cursor: pointer;
            color: #555555;
            margin-right: 33px;
        }
        .classCusor {
            cursor: pointer;
        }
        .defaultCusor {
            cursor: default;
        }
        .jtTable{
            thead>tr>th{
                padding:11px 0px 11px 16px;
                font-size: @jt-font-size-sm;
                color:@jt-color-text-strong;
            }
            table tbody tr:hover>td{
                background: #F5F8FF;
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
    }
    .searchIcon {
        font-size: 18px;
        margin-right: 8px;
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
</style>
