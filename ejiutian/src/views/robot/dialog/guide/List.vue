<template>
    <div class="contentBody" ref="create">
        <!-- <jt-empty image='../../../assets/image/noneData.png' v-if="isShowEm" class="emStatus">
            <span slot="description">
                <div class="master_tip">您还没有添加任何引导式对话技能</div> 
                <div class="sub_tip">
                    您可以<a @click="showModal">新建技能</a> ，为机器人添加引导式对话技能
                </div>
            </span>
        </jt-empty> -->
        <div class="table-title">
            <h3 class="p2">技能列表</h3>
            <div style="display:flex;align-items:center">
                <jt-input type="text" v-model="keyWord" style="width:210px;margin-right:16px;" v-show="isShowSearch" class="search_" @keyup.enter="searchAction" placeholder="请输入搜索关键词">
                    <a
                        slot="suffix"
                        class="iconfont suffixSearch"
                        @click="searchAction"
                    >
                        &#xe622;
                    </a>
                    <span
                        slot="suffix"
                        class="iconfont"
                        style="margin:0 5px;color:#BBB"
                    >
                        <jt-divider type="vertical" style="margin:0px; height: 12px; color: #E9EBEF;" />
                    </span>
                    <jt-icon  slot="suffix" type="close" @click="destruction" style="color:#999"/>
                </jt-input>
                <a class="iconfont searchIcon" @click="search" style="margin-right: 16px; font-size: 18px; color: #555555;cursor: pointer;" v-show="!isShowSearch">&#xe622;</a>
                <!-- <a class="iconfont reloadIcon" style="margin-right: 10px; font-size: 18px; color: #555555;cursor: pointer;">&#xe623;</a> -->
                <jt-divider type="vertical" style="margin-right: 16px;margin-left:0px; height: 16px; color: #E9EBEF;" />
                <jt-range-picker @change="changeDate" valueFormat="YYYY-MM-DD" v-model="dates" separator="-" :defaultPickerValue="calendarRange" style="width: 216px; margin-right: 8px;text-align:left;">
                    <jt-icon slot="suffixIcon" type="calendar" style="margin-left:8px;"/>
                </jt-range-picker>
                <jt-button size="large" type="primary" @click="showModal" class="newaddbutton" v-if="environment == 'test'">
                    <jt-icon type="plus" style="margin-right:9px;width:16px;height:16px;line-height:16px;"/><span style="margin-left:0">新建技能</span>
                </jt-button>
            </div>
            
        </div>
        <div v-if="showEmpty == 1" class="emptyData">
            <div class="emptyMsgTitle">您还没有添加任何引导式对话技能</div>
            <div class="emptyMsgDetail" v-if="environment == 'test'">
                <span>您可以 </span>
                <a @click="showModal">新建技能</a>
                <span>，为机器人添加引导式对话技能</span>
            </div>
        </div>
        <div v-if="showEmpty == 2" class="emptyData">
            <jt-empty :image="questionSearchNoneImage" :imageStyle="{margin: 'auto',width: '400px',height: '400px'}">
                <div class="emptyContent" slot="description">
                    <p class="emptyTitle">抱歉，没有匹配到任何搜索结果</p>
                    <p>您可以换一个关键词试试哦～</p>
                </div>
            </jt-empty>
        </div>
        <div v-if="showEmpty == 0">
            <jt-row>
                <jt-col :span="24">
                    <jt-table class="jtTabel" :rowSelection="environment === 'test' ? { selectedRowKeys: selectedRowKeys, onChange: onSelectChange ,columnWidth: 40 } : null" :columns="columns" :dataSource="dataShow" :pagination="false" rowKey="id" :customRow="customRow" @change="onChange">
                        <span slot="name" slot-scope="text">
                            <jt-tooltip placement="topLeft">
                                <template slot="title">
                                    <span>{{text}}</span>
                                </template>
                                <a style="max-width: 230px;color: #555555;">{{text}}</a>
                            </jt-tooltip>
                        </span>
                        <span slot="describe" slot-scope="text">
                            <jt-tooltip placement="topLeft">
                                <template slot="title">
                                    <span>{{text}}</span>
                                </template>
                                <a style="max-width: 230px;color: #555555;">{{text}}</a>
                            </jt-tooltip>
                        </span>
                        <span slot="count" slot-scope="text">
                            <jt-tooltip placement="topLeft">
                                <template slot="title">
                                    <span>{{text}}</span>
                                </template>
                                <a style="max-width: 230px;color: #555555;">{{text}}</a>
                            </jt-tooltip>
                        </span>
                        <span slot="author" slot-scope="text">
                            <jt-tooltip placement="topLeft">
                                <template slot="title">
                                    <span>{{text}}</span>
                                </template>
                                <a style="max-width: 230px;color: #555555;">{{text}}</a>
                            </jt-tooltip>
                        </span>
                        <span slot="updateTime" slot-scope="text">
                            <jt-tooltip placement="topLeft">
                                <template slot="title">
                                    <span>{{text}}</span>
                                </template>
                                <a style="max-width: 230px;color: #555555;">{{text}}</a>
                            </jt-tooltip>
                        </span>
                        <span slot="action-slot" slot-scope="text, record">
                            <jt-button size="large" type="link" @click.stop="todo(record)" style="padding-left:5px;" class="edit"><jt-icon type="edit"/>编辑</jt-button>
                        </span>
                    </jt-table> 
                </jt-col>
            </jt-row>
            <jt-row style="margin-top: 20px;">
                <jt-col :span="9">
                    <jt-button size="large" type="default" class="delBtn" @click="del" v-if="environment == 'test'">
                        删除
                    </jt-button>    
                    <span style="margin:0 16px;">共 {{count}} 条记录</span>
                    <span v-if="isSlip">每页显示</span>
                    <jt-select :defaultValue="10" style="min-width: 50px; margin: 0 5px;" @change="onShowSizeChange" v-if="isSlip">
                        <jt-icon slot="suffixIcon" type="caret-down" :style="{ color: '#606266',marginRight:'-7px' }"/>
                        <jt-select-option v-for='(item,index) in pageList' :key="index">{{item}}</jt-select-option>
                    </jt-select>
                    <span v-if="isSlip">条</span>
                </jt-col>
                <jt-col :span="15">
                    <jt-pagination
                        size="large" :total="count" :current="currentPageIndex" :pageSize="pageSize" showQuickJumper @change="onPageChange" hideOnSinglePage style="float:right"
                    />
                </jt-col>
            </jt-row>
        </div>
        <jt-modal :title="Title" mask centered :visible="visible" 
                  :confirmLoading="confirmLoading"
                  :width="600" @cancel="handleCancel"  @ok="handleOk"
        > 
            <template slot="footer">
                <jt-button key="back" style="width: 64px;margin-top: 6px;margin-bottom: 6px;" @click="handleCancel">
                    取消
                </jt-button>
                <jt-button :disabled="addRobotSubmit" type="primary" style="width: 64px; margin-right: 4px;" @click="handleOk">
                    确定
                </jt-button>
            </template>
            <jt-form-model :model="ruleForm" :rules="rules" :label-col="labelCol" ref="ruleForm" >
                <jt-form-model-item label="技能名称" prop="name" ref="name"  :wrapper-col="wrapperCol">
                    <jt-input placeholder="仅支持中文、英文、数字与下划线，12字以内"  
                              v-model="ruleForm.name" style="width:320px;"/>
                </jt-form-model-item>
                <jt-form-model-item label="技能描述" :wrapper-col="wrapperColTextArea" style="margin-bottom:0;" prop="text" class="formitem">
                    <jt-input type="textarea" placeholder="机器人的功能和使用场景说明" class="text_area" :rows="6" v-model="ruleForm.text" @keyup="totalword" style="width:400px;height:120px;resize: none"/>
                    <!-- <jt-row style="position: absolute;top:-6px;right:7px;line-height:20px">
                        <jt-col class="totalAreaWord">已输入 <span>{{totalAreaWord}}</span>/200字</jt-col>
                    </jt-row> -->
                </jt-form-model-item>
                
            </jt-form-model>
        </jt-modal>
    </div>
</template>
<script>
import { Modal } from 'ant-design-vue';
import { mapActions } from "vuex";
import { judgeSensitiveWord, getRandomNum } from "@/utils/common.ts";
import moment from 'moment'
function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
}
export default{
    data(){
        return {
            environment: this.$store.state.envInfo.env,
            botid: this.$store.state.robotInfo.robotId,
            columns: [
                {title: '技能名称', dataIndex: 'name', key: 'name',width:130,ellipsis: true,scopedSlots: {customRender: "name"}},
                {title: '技能描述', dataIndex: 'describe', key: 'describe',width:260,ellipsis:true,scopedSlots: {customRender: "describe"}},
                {title: '意图数量', dataIndex: 'count',  key: 'count',width:100,ellipsis: true,scopedSlots: {customRender: "count"}},
                {title: '编辑人', dataIndex: 'author',  key: 'author',width:130,ellipsis: true,scopedSlots: {customRender: "author"}},
                {title: '编辑时间', dataIndex: 'updateTime',  key: 'updateTime',width:180,ellipsis: true,scopedSlots: {customRender: "updateTime"}},
            ],
            calendarRange: [moment().subtract(1, "months").format("YYYY-MM-DD")],
            isSlip: false,//是否显示每页多少条
            isShowSearch: false, //搜索框是否显示
            data: [], //表格数据初始化为空数组
            showEmpty: 0,
            dataShow: [],
            totalPage: 1,
            pageSize: 10,//每页显示多少条
            count: 0,
            currentPageIndex: 1,//当前页码
            pageList: [10,20,30],
            Title: "新建引导对话技能",
            visible:  false,//modal是否可见
            confirmLoading: false,
            labelCol: { span: 4 },//表单文字布局
            wrapperCol: { span: 16 },//表单控件布局
            wrapperColTextArea: { span: 19},
            selectedRowKeys: [],//表格多选将id放入此数组
            selectedRows: [],
            totalAreaWord: 0,//Textarea统计字数初始化为0
            dates: [],//日期
            rangDate: [],//开始和结束日期
            keyWord: '',//关键词
            //表单初始赋值
            ruleForm: {
                name:'',
                text:'',
            },
            //表单验证规则
            rules: {
                name: [
                    {required:true,validator: this.validatorName, trigger: ['change','blur']},
                ],
                text: [
                    {validator: this.validatorText, trigger: ['change','blur']}
                ]
            },
            nameValid: false,
            textValid: false,
            questionSearchNoneImage: require("@/assets/image/noneData.png"),
        }
    },
    computed: {
        addRobotSubmit() {
            return !(this.nameValid && this.textValid)
        }
    },
    mounted(){
        this.getInitData();
        if(this.environment == 'test'){
            this.columns.push({title: '操作', dataIndex: 'options', key: 'options',width:100,ellipsis: true, scopedSlots: { customRender: 'action-slot' }});
        }
        //日历开日期和结束日期中间的符号修改
        const b = document.querySelector(".ant-calendar-range-picker-separator");
        if(b){
            b.innerHTML = '<i class="anticon anticon-swap-right" aria-label="图标: swap-right"><svg viewBox="0 0 1024 1024" data-icon="swap-right" width="1em" height="1em" fill="currentColor" aria-hidden="true" focusable="false" class=""><path d="M873.1 596.2l-164-208A32 32 0 0 0 684 376h-64.8c-6.7 0-10.4 7.7-6.3 13l144.3 183H152c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h695.9c26.8 0 41.7-30.8 25.2-51.8z"></path></svg></i>';
        }
        //初始化表格数据
        
    },
    methods: {
        ...mapActions({
            queryGuideList: "guideDialog/queryGuideList",
            addGuideDetail: "guideDialog/addGuideDetail",
            deleteGuide: "guideDialog/deleteGuide"
        }),
        getInitData() {
            this.env = this.$store.state.envInfo.env;
            const args = {
                envType: this.env === 'test' ? 0 : 1,
                robotId: this.botid,
                startDate: this.rangDate[0],
                endDate: this.rangDate[1],
                keyWord: this.keyWord
            };
            this.queryGuideList(args).then(res => {
                if (res.errno === 0) {
                    this.data = this.$store.state.guideDialog.guideList;
                    this.count = this.data.length;
                    this.calculate();
                    this.dataShow = this.calcDataShow(this.currentPageIndex);
                    if (this.data.length === 0) {
                        if(this.dates.length ==0 && this.keyWord == '') {
                            this.showEmpty = 1
                        }else{
                            this.showEmpty = 2
                        }
                    }else{
                        this.showEmpty = 0
                    }
                    if(this.data.length > 10){
                        this.isSlip = true;
                    }
                } else {
                    this.showErrorNotification(res.errorMsg);
                }
            }).catch((error) => {
                this.showCatchNotification("查询失败！",'系统繁忙,请稍后再试')
            });
            this.$store.commit(
                'setBreadcrumb',
                [
                    {breadcrumbName: this.$store.state.envInfo.envName, breadcrumbPath: this.$store.state.fromPath},
                    {breadcrumbName: "引导式对话"}
                ]
            );
        },
        showErrorNotification(content) {
            this.$notification.open({
                message: "查询失败！",
                description:
                    "失败原因：" + content,
                icon: (
                    <jt-icon
                        type="exclamation-circle"
                        theme="filled"
                        style="color:#F04134"
                    />
                )
            });
        },
        //计算总页数
        calculate(){
            const totalPate = Math.ceil(this.count / this.pageSize);
            this.totalPage = totalPate;

        },
        del(){
            if(this.selectedRows.length > 0){
                Modal.confirm({
                    title: '确定删除'+ this.selectedRows.length +'条技能吗？',
                    content: ()=>this.$createElement(
                        'span',
                        {
                            style:{
                                'position':'relative',
                                'left':'-10px'
                            }
                        },
                        '删除后将无法恢复'
                    ),
                    okText: '删除',
                    okType: 'danger',
                    cancelText: '取消',
                    // icon: "plus",
                    // <i data-v-3398c724="" aria-label="图标: plus" class="anticon anticon-plus" style="margin-right: 9px;">
                    // <svg viewBox="64 64 896 896" data-icon="plus" width="1em" height="1em" fill="currentColor" aria-hidden="true" focusable="false" class=""><path d="M482 152h60q8 0 8 8v704q0 8-8 8h-60q-8 0-8-8V160q0-8 8-8z"></path><path d="M176 474h672q8 0 8 8v60q0 8-8 8H176q-8 0-8-8v-60q0-8 8-8z"></path></svg></i>

                    icon:  ()=>this.$createElement(
                        'i',
                        {
                            attrs: {'aria-label': '图标: exclamation-circle',class:'anticon anticon-exclamation-circle'},
                            style: {'color':'#F04134','marginRight':'9px'} 
                        },
                        [
                            this.$createElement(
                                'svg',
                                {attrs:
                                    {
                                        'viewBox':'64 64 896 896',
                                        'data-icon': 'exclamation-circle',
                                        'width': "17.5px",
                                        'height': "17.5px",
                                        'fill': "currentColor",
                                        'aria-hidden':"true",
                                        'focusable':"false",
                                        'class':''

                                    }
                                },
                                [
                                    this.$createElement('path',{attrs:{'d':'M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm-32 232c0-4.4 3.6-8 8-8h48c4.4 0 8 3.6 8 8v272c0 4.4-3.6 8-8 8h-48c-4.4 0-8-3.6-8-8V296zm32 440a48.01 48.01 0 0 1 0-96 48.01 48.01 0 0 1 0 96z'}}),
                                    
                                ]
                            )
                        ]
                    ),
                    width: '320px',
                    centered: true,
                    class: 'confirm',
                    onOk: ()=> {                
                        const ids = this.selectedRowKeys.join(',');
                        this.deleteGuide(ids).then(res =>{
                            if (res.errno === 0) {
                                this.$message.success('删除成功');
                                this.getInitData();
                                this.selectedRows = []
                            }else{
                                this.$notification.open({
                                    message: "删除失败",
                                    description:res.errorMsg,
                                    icon: (
                                        <jt-icon
                                            type="exclamation-circle"
                                            theme="filled"
                                            style="color:#F04134"
                                        />
                                    )
                                });
                            }
                        }).catch((error) => {
                            this.showCatchNotification("删除失败！",'系统繁忙,请稍后再试')
                        })
                    },
                    onCancel: ()=> {
                        return;
                    },
                });
            }else{
                this.$message.warning('您未选择任何技能');
            }
        },
        //技能名称验证
        validatorName(rule ,value ,callback ){
            // const pattern = /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/img;//不支持全角
            const pattern = /^[a-zA-Z0-9_\u4e00-\u9fa5\uff41-\uff5a\uff21-\uff3a\uFF10-\uFF19]+$/;//支持全角
            const response1 = judgeSensitiveWord(value);
            if (value === '') {
                this.nameValid = false;
                callback(new Error('技能名称为必填项'));
            }else if(value.length>12){
                this.nameValid = false;
                callback(new Error('超出字数限制，最多12字'));
            }else if(!pattern.test(value)){
                this.nameValid = false;
                callback(new Error('只能为英文、数字、下划线和中文'));
            }else if (!response1.detectedResult) {
                this.nameValid = false;
                callback(new Error(response1.errorMsg));
            }else{
                this.nameValid = true;
                if(this.ruleForm.text.match(/^[ ]*$/)){
                    this.textValid = true
                }
                callback();
            }

        },
        //技能描述验证
        validatorText(rule ,value ,callback ){
            if(value) {
                const response1 = judgeSensitiveWord(value);
                if (value.length>200) {
                    this.textValid = false;
                    callback(new Error('超出字数限制,最多200字'));
                }else if (!response1.detectedResult) {
                    this.textValid = false;
                    callback(new Error(response1.errorMsg));
                }else{
                    this.textValid = true;
                    callback();
                }
            }else{
                this.textValid = true;
                callback();
            }
            
        },
        //tr点击跳转
        customRow(record){
            return{
                on:{
                    click: (event) => {
                        this.$router.push({ name: 'Information', query: { skillid: record.id,name: record.name }});
                    }, 
                }
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
        //表格选择时触发，将选中项加入到数组中
        onSelectChange(selectedRowKeys,selectedRows) {
            this.selectedRowKeys = selectedRowKeys;
            this.selectedRows = selectedRows
        },
        //编辑
        todo(record){
            this.visible = true;
            this.Title = "编辑引导式对话技能";
            this.isvisible = true;
            this.ruleForm.name = record.name;//技能名称赋值
            this.ruleForm.text = record.describe;
            this.ruleForm.id = record.id;
            this.totalAreaWord = this.ruleForm.text.length;
            this.nameValid = true
            this.textValid = true
        },
        calcDataShow(pageIndex){
            pageIndex = pageIndex > this.totalPage && this.totalPage > 0 ? this.totalPage : pageIndex;
            return this.data.slice((pageIndex - 1 ) * this.pageSize, pageIndex * this.pageSize);
        },
        onShowSizeChange(showSizeSelected){
            this.pageSize=this.pageList[showSizeSelected];
            this.currentPageIndex = 1;
            this.dataShow = this.calcDataShow(1);
        },
        onPageChange(pageIndex){
            this.currentPageIndex = pageIndex;
            this.dataShow = this.calcDataShow(pageIndex);
        },
        rowSelection(){
            return 1;
        },
        //点击新建技能弹出模态框
        showModal(){
            this.visible = true;
            this.Title = "新建引导式对话技能";
            this.isvisible = true;
            this.ruleForm.name = '';//技能名称赋值
            this.ruleForm.text = '';
            this.ruleForm.id = '';
            this.totalAreaWord = 0;
            this.nameValid = false
            this.textValid = false
        },
        //modal框各个执行函数
        handleCancel(){
            this.$refs.ruleForm .resetFields();//表单重置
            this.visible = false;
            this.nameValid = false
            this.textValid = false
        },
        //model框点击确定是触发表单验证
        handleOk(){
            this.$refs.ruleForm.validate((valid) =>{
                //验证通过后续操作
                if(valid){
                    const data = {
                        "describe": this.ruleForm.text,
                        "name": this.ruleForm.name,
                        "type": "0",
                        "userid": getRandomNum(this.$store.state.userId),
                        "botid": getRandomNum(this.botid),
                        "id": this.ruleForm.id,
                    };
                    this.addGuideDetail(data).then(res =>{
                        if (res.errno === 0) {
                            this.$message.success("保存成功");
                            this.$refs.ruleForm .resetFields();//表单重置
                            this.visible = false;
                            this.getInitData();
                            this.nameValid = false
                            this.textValid = false
                        }else{
                            this.$notification.open({
                                message: "保存失败！",
                                description:res.errorMsg,
                                icon: (
                                    <jt-icon
                                        type="exclamation-circle"
                                        theme="filled"
                                        style="color:#F04134"
                                    />
                                )
                            });
                        }
                    }).catch((error) => {
                        this.showCatchNotification("保存失败！",'系统繁忙,请稍后再试')
                    })
                }
            });
        },
        showCatchNotification(title, content) {
            this.$notification.open({
                message: title,
                description: "失败原因：" + content,
                icon: (<jt-icon type="exclamation-circle" theme="filled" style="color:#F04134"/>),
                duration: 0
            });
        },
        //表格重载
        onChange(){
            return 1;
        },
        search(){
            this.isShowSearch = true;
        },
        searchAction(){
            this.getInitData();
        },
        destruction(){
            this.isShowSearch = false;
            this.keyWord = ''
            this.getInitData()
        },
        //按选择日期区间重载表格
        changeDate(dates, dateStrings){
            if(dateStrings[0]  && dateStrings[1]){
                this.rangDate[0] = dateStrings[0] + ' 00:00:00';
                this.rangDate[1] = dateStrings[1] + ' 23:59:59';
            }else{
                this.rangDate[0] = dateStrings[0];
                this.rangDate[1] = dateStrings[1];
            }
            this.getInitData();
        }
    }
}
</script>
<style lang="less" scoped>
@import "~@/assets/style/var.less";
.contentBody{
    overflow-y: auto;
.table-title {
    margin-bottom: 16px;
    display: flex;
    justify-content: space-between;
}
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
            background: #f5f8ff;
            cursor: pointer;
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
    // width: 1096px;
    width: 100%;
    min-height: 100%;
    background: #FFFFFF;
    border-radius: 2px;
    padding: 20px 20px 48px 20px;
    margin-bottom: 40px;
    .picker{
        width:216px;
        height:32px;
    }
    .newaddbutton{
        width:88px;
        height:32px;
        padding: 0;
    }
    .totalAreaWord{
        color: #BFBFBF;
        text-align:right;
        span{
            color:rgba(0, 0, 0, 0.85);
        }
    }
    .delBtn:hover{
        color: #F04134;
        border-color:#F04134;
    }
    .edit{
        color:#555;
    }
    .edit:hover{
        color:#337DFF;
    }
    .p2{
        font-weight:500;
        font-size: 16px;
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
        font-size: 16px;
    }
    .suffixSearch:hover{
        color: #999;
    }
    .anticon-close {
        font-size: 14px;
    }
    /deep/.ant-table-thead th{
        background:#F4F5F7;
        height: 40px;
    }
    /deep/.ant-table-row td{
        height: 40px;
    }
    /deep/.ant-table-row td:not(:first-child){
        padding:0px 16px;
    }
    /deep/.ant-table-thead th:not(:first-child){
        padding:0px 16px;
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
    .emptyData {
        display: flex;
        flex-direction: column;
        margin: 0 auto;
        width: 400px;
        height: 400px;
        background: url('~@/assets/image/noneProject.png') no-repeat center;
        background-size: 100% 100%;
        .emptyMsgTitle {
            text-align: center;
            margin-top: 267px;
            font-size: 18px;
            font-family: 'PingFangSC-Semibold,PingFang SC';
            font-weight: 600;
            color: #333333;
            text-align: center;
            margin-bottom: 16px;
        }
        .emptyMsgDetail {
            text-align: center;
            font-size: 14px;
            font-family: 'PingFangSC-Regular,PingFang SC';
            font-weight: 400;
            color: #555555;
            text-align: center;
            margin-bottom: 35px;
            a {
                color: #337DFF;
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
}

</style>