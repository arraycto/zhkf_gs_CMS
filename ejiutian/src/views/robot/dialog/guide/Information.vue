<template>
    <div class="contentBody">
        <div class="table-title" style="margin-bottom: 8px;">
            <h3 class="p2">{{this.$route.query.name}}技能</h3>
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
                <jt-range-picker separator="-" @change="changeDate"  valueFormat="YYYY-MM-DD" v-model="dates" :defaultPickerValue="calendarRange" style="width: 216px; margin-right: 8px;text-align:left;">
                    <jt-icon slot="suffixIcon" type="calendar" style="margin-left:8px;"/>
                </jt-range-picker>
                <jt-button size="large" type="primary" @click="redirect" class="newaddbutton" v-if="this.environment == 'test'">
                    <jt-icon type="plus" style="margin-right:9px;width:16px;height:16px;line-height:16px;" /><span style="margin-left:0">新建意图</span>
                </jt-button>
            </div>
        </div>
        <div v-if="showEmpty == 1" class="emptyData">
            <div class="emptyMsgTitle">您还没有添加任何引导式对话意图</div>
            <div class="emptyMsgDetail" v-if="environment == 'test'">
                <span>您可以 </span>
                <span style="color: #337DFF;cursor: pointer;" @click="redirect" >新建意图</span>
                <span>，为机器人添加引导式对话意图</span>
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
            <jt-table class='jtTabel' :rowSelection="environment === 'test' ? { selectedRowKeys: selectedRowKeys, onChange: onSelectChange ,columnWidth: 40 } : null" :columns="columns" :dataSource="dataShow" :pagination="false" rowKey="id" :customRow="customRow" @change="onChange">
                <span slot="name" slot-scope="text">
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
    </div>
</template>
<script>
import { Modal } from 'ant-design-vue';
import { mapActions } from "vuex";
import moment from 'moment'
export default{
    data(){
        return {
            skillid: this.$route.query.skillid,
            name: this.$route.query.name,
            columns: [
                {title: '意图', dataIndex: 'name',width:350, key: 'name',ellipsis:true,scopedSlots: {customRender: "name"}},
                {title: '编辑人', dataIndex: 'author', width:220, key: 'author',ellipsis: true,scopedSlots: {customRender: "author"}},
                {title: '编辑时间', dataIndex: 'updateTime', width:220, key: 'updateTime',ellipsis: true,scopedSlots: {customRender: "updateTime"}},
            ],
            isSlip: false,//是否显示每页多少条
            isShowSearch: false,
            data: [], //表格数据初始化为空数组
            showEmpty: 0,
            dataShow: [],
            totalPage: 1,
            pageSize: 10,//每页显示多少条
            count: 0,
            currentPageIndex: 1,//当前页码
            pageList: [10,20,30],
            selectedRowKeys: [],//表格多选将id放入此数组
            selectedRows: [],
            dates: [],//日期
            rangDate: [],
            keyWord: '',//关键词
            calendarRange: [moment().subtract(1, "months").format("YYYY-MM-DD")],
            questionSearchNoneImage: require("@/assets/image/noneData.png"),
        }
    },
    computed: {
        environment(){
            return this.$store.state.envInfo.env
        },
        leaderaccount() {
            return this.$store.state.guideDialog.tablelead;
        },
    },
    mounted(){
        this.getInitData();
        if(this.environment == 'test'){
            this.columns.push({title: '操作', dataIndex: 'options', key: 'options', width:100,scopedSlots: { customRender: 'action-slot' }});
        }
        //日历开日期和结束日期中间的符号修改
        const b = document.querySelector(".ant-calendar-range-picker-separator");
        if(b){
            b.innerHTML = '<i class="anticon anticon-swap-right" aria-label="图标: swap-right"><svg viewBox="0 0 1024 1024" data-icon="swap-right" width="1em" height="1em" fill="currentColor" aria-hidden="true" focusable="false" class=""><path d="M873.1 596.2l-164-208A32 32 0 0 0 684 376h-64.8c-6.7 0-10.4 7.7-6.3 13l144.3 183H152c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h695.9c26.8 0 41.7-30.8 25.2-51.8z"></path></svg></i>';
        }
    },
    methods: {
        ...mapActions({
            queryIntentionsList: "guideDialog/queryIntentionsList",
            deleteIntention:"guideDialog/deleteIntention",
            leadmoduleGet:"guideDialog/addIntent"
        }),
        //初始化表格数据
        getInitData() {
            const skillid = this.$route.query.skillid;
            const args = {
                envType: this.environment === 'test' ? 0 : 1,
                skillid: skillid,
                startDate: this.rangDate[0],
                endDate: this.rangDate[1],
                keyWord: this.keyWord

            };
            this.queryIntentionsList(args).then((res) => {
                this.data = this.$store.state.guideDialog.intentionsList;
                if (res.errno === 0) {
                    this.data = this.$store.state.guideDialog.intentionsList;
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
                this.leadmoduleGet();
            }).catch((error) => {
                this.showCatchNotification('查询失败！','系统繁忙,请稍后再试')
            });
            this.$store.commit(
                'setBreadcrumb',
                [
                    {breadcrumbName: this.$store.state.envInfo.envName, breadcrumbPath: this.$store.state.fromPath},
                    {breadcrumbName: "引导式对话", breadcrumbPath: '/home/robotHome/guideDialog'},
                    {breadcrumbName: "引导式意图列表"}
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
        //删除
        del(){
            if(this.selectedRows.length > 0){
                Modal.confirm({
                    title: '确定删除'+ this.selectedRows.length +'条意图吗？',
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
                       
                        this.deleteIntention(ids).then(res =>{
                            if (res.errno === 0) {
                                this.$message.success('删除成功');
                                this.getInitData();
                                this.selectedRows = []
                            }else{
                                this.$notification.open({
                                    message: "删除失败！",
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
                        }).catch((error)=> {
                            this.showCatchNotification('删除失败！','系统繁忙,请稍后再试')
                        })
                    },
                });
            }else{
                this.$message.warning('您未选择任何意图');
            }
        },
        showCatchNotification(title, content) {
            this.$notification.open({
                message: title,
                description: "失败原因：" + content,
                icon: (<jt-icon type="exclamation-circle" theme="filled" style="color:#F04134"/>),
                duration: 0
            });
        },
        //tr点击跳转
        customRow(record){
            return{
                on:{
                    click: (event) => {
                        this.$router.push({ name: 'Create', query: { skillid:this.skillid, id: record.id, mode: 'detai', name:this.name }});
                    }, 
                }
            }
        },
        //表格选择时触发，将选中项加入到数组中
        onSelectChange(selectedRowKeys,selectedRows) {
            this.selectedRowKeys = selectedRowKeys;
            this.selectedRows = selectedRows;
        },
        //编辑
        todo(record){
            const skillid = this.$route.query.skillid;
            this.$router.push({ name: 'Create', query: { id: record.id,skillid:skillid, mode: 'update', name:this.name }});
        },
        calcDataShow(pageIndex){
            pageIndex = pageIndex> this.totalPage && this.totalPage > 0 ? this.totalPage : pageIndex;
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
        //点击新建意图重定向
        redirect(){
            if(this.leaderaccount) {
                this.$router.push({ name: 'Create', query:{skillid:this.skillid, mode: 'create',name: this.name}});
            }else{
                this.$message.warn('您当前的对话意图数量已超出限制')
            }
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
        },
    }
}
</script>
<style lang="less" scoped>
.contentBody{
    overflow-y: auto;
    .table-title {
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
    .text_area{
        resize: none;
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
    .search_{
        width:210px;
        animation: mymove 0.5s ease-in-out 0s 1 alternate forwards;    
    }
    .p2{
        font-weight:500;
        font-size: 16px;
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