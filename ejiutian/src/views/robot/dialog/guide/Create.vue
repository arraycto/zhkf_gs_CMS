<template>
    <div class="contentBody">
        <div>
            <span class="title">用户说</span>
        </div>
        <div style="display: flex; flex-flow: row; margin-top: 32px;">
            <div class="inputLabel">
                <span style="color: #F04134; margin-right: 4px;">*</span><span>意图</span>
            </div>
            <div style="display: flex; flex-flow: column;">
                <jt-input
                    id="inputStandardQuestion"
                    v-model="input.standardQuestion"
                    style="width: 431px; height: 32px;"
                    placeholder="请输入125字以内的意图，不可重复"
                    :disabled="inputDisabled"
                    @blur="validateStandardQuestion()"
                />
                <span v-show="env === 'test' && !validate.standardQuestion" class="errorTip">{{inputError.standardQuestion}}</span>
            </div>
        </div>
        <div style="display: flex; flex-flow: row; margin-top: 24px;" v-if="env === 'test' || input.similarQuestion.length>0">
            <div class="inputLabel">
                <span>相似意图</span>
            </div>
            <div style="display: flex; flex-flow: column;">
                <jt-input
                    class='input-enter'
                    placeholder="请输入125字以内的相似意图"
                    :disabled="inputDisabled"
                    v-model='similarQuestionValue'
                    id= 'similarQuestionValue'
                    @keyup.enter="addSimilarQuestion"
                    @change="validateSimilarQuestion()"
                    v-show="env === 'test'"
                >
                </jt-input>
                <div class='input-list' v-if='input.similarQuestion.length>0'>
                    <jt-input
                        class = 'input-item'
                        placeholder="请输入125字以内的相似意图"
                        v-for="(item, index) in input.similarQuestion"
                        :id="'inputSimilarQuestion_' + index"
                        v-model="input.similarQuestion[index]"
                        :disabled="inputDisabled"
                        :value="item"
                        :key="index"
                        @blur="validateSimilarQuestion()"
                        @change="validateSimilarQuestion()"
                    >
                        <span
                            slot="suffix"
                            class="iconfont iconshanchu1"
                            @click="delSimilarQuestion(index)"
                            v-show="isDel"
                        ></span>
                    </jt-input>
                </div>
                <span v-show="env === 'test' && validate.similarQuestion" class="normalTip" >{{tips.similarQuestion}}</span>
                <span v-show="env === 'test' && !validate.similarQuestion" class="errorTip">{{inputError.similarQuestion}}</span>
            </div>
        </div>
        <div style="display: flex; flex-flow: row; margin-top: 24px;"  v-if="env === 'test' || input.keyWord.length>0">
            <div class="inputLabel">
                <span>关键词</span>
            </div>
            <div>
                <div>
                    <jt-input
                        style="width: 180px; height: 32px; margin-right: 8px; margin-bottom: 4px;"
                        placeholder="请输入12字以内的关键词"
                        v-model="keyWordValue"
                        id= 'keyWordValue'
                        @keyup.enter="addKeyWord"
                        @change="validateKeyWord"
                        :disabled="inputDisabled"
                        v-show="env === 'test'"
                    >
                    </jt-input>
                    <jt-input
                        class='input-keyword'
                        style="width: 180px; height: 32px; margin-right: 8px; margin-bottom: 4px;"
                        placeholder="请输入12字以内的关键词"
                        v-for="(item, index) in input.keyWord"
                        :id="'inputKeyWord_' + index"
                        :value="item"
                        :key="index"
                        v-model="input.keyWord[index]"
                        :disabled="inputDisabled"
                        @blur="validateKeyWord()"
                        @change="validateKeyWord()"
                    >
                        <span
                            slot="suffix"
                            class="iconfont iconshanchu1"
                            @click="delKeyWord(index)"
                            v-show="isDel"
                        ></span>
                    </jt-input>
                </div>
                <div style="margin-bottom: -4px;">
                    <span v-show="env === 'test' && validate.keyWord" class="normalTip">{{tips.keyWord}}</span>
                    <span v-show="env === 'test' && !validate.keyWord" class="errorTip">{{inputError.keyWord}}</span>
                </div>
            </div>
        </div>
        <div style="margin-top: 64px;">
            <span class="title">引导对话</span>
        </div>
        <div style="display: flex; flex-flow: row; margin-top: 32px;" v-if="env === 'test' || input.answer">
            <div class="inputLabel">
                <span>引导话术</span>
            </div>
            <div style="display: flex; flex-flow: column;">
                <div>
                    <jt-input
                        type="input"
                        v-model="input.answer"
                        style="width: 431px; height: 32px;"
                        placeholder="请输入125字以内的引导话术"
                        :disabled="inputDisabled"
                        id="inputAnswer"
                        @blur="validateAnswer()"
                        @change="validateAnswer()"
                    />
                </div>
            </div>
        </div>
        <div>
            <span v-show="env === 'test' && !validate.answer" class="errorTip" 
                  style='margin-left:186px;'>{{inputError.answer}}</span>
        </div>
        <div style="display: flex; flex-flow: row; margin-top: 32px;" ref="parentNode">
            <div class="inputLabel">
                <span style="color: #F04134; margin-right: 4px;">*</span><span>引导问题及答案</span>
            </div>
            <jt-tree
                :tree-data="treeData"
                :show-line="showLine"
                :expandedKeys.sync = 'expandedKeys'
            >
                <template slot="treeItem" slot-scope="item">
                    <jt-input style="width:426px;height:32px;" :id="'input_'+item.key" v-model="item.dataRef.value" 
                              @focus="showLayer(item.dataRef)" @blur="hideLayer(item.dataRef)" 
                              @change="validateGuideAndAnswer(item.dataRef)" :disabled="inputDisabled">
                        <span
                            slot="prefix"
                            style="color:#BFBFBF"
                        >
                            问：
                        </span>
                        <span
                            slot="suffix"
                            class="iconfont iconshanchu1"
                            @click="removeLevel(item.dataRef)"
                            :disabled="inputDisabled"
                            v-if="item.key != 0 && item.children.length<=0 && isDel"
                        >
                        </span>
                    </jt-input>
                    <div style="display:inline-block" v-if="item.isShow">
                        <span :class="{'add_layer_operation':item.isLight,'add_layer_operation_h':!item.isLight}" @click="addlevel(item.dataRef)"><a class="iconfont searchIcon">&#xe636;</a>平级</span>
                        <span :class="{'add_layer_operation':item.isSLight,'add_layer_operation_h':!item.isSLight}" @click="addSubLevel(item.dataRef)"><a class="iconfont searchIcon">&#xe636;</a>子级</span>
                        <span :class="{'add_layer_operation':item.isShowAS,'add_layer_operation_h':!item.isShowAS}" @click="addAnswer(item.dataRef)"><a class="iconfont searchIcon">&#xe636;</a>答案</span>
                    </div>
                    <span style="display:block;"  class="errorTip" v-if='item.error'>
                        {{item.errorMsg}}
                    </span>
                    <p class="guide_anwser_tips" v-if="item.key == 0">
                        最多可添加4级引导问题
                    </p>
                    <div v-if="item.text.visible" style="display:block;">
                        <edit-answer 
                            :ref="'editAnswer'+item.dataRef.key" 
                            :inputDisabled="inputDisabled" 
                            :isDel="isDel" 
                            :mode="mode" 
                            v-model="item.dataRef" 
                            @validateGuideAndAnswer="sonSerParent" 
                            @uploadAnswer="uploadAnswer"
                            @setAnswerValidate="setAnswerValidate"
                            @setModal="setModal"
                            @setVioDialog="setVioDialog"
                            @setPreviewImage="setPreviewImage"
                            @setEditUrlImg="setEditUrlImg"
                            @setEditUrlVio="setEditUrlVio"
                        ></edit-answer> 
                        <span class="errorTip" v-show='item.text.isValidate'>
                            {{item.text.isValidateMsg}}
                        </span>
                    </div>
                    
                </template>
            </jt-tree>
        </div>
        <div v-show="env === 'test'" style="display: flex; flex-flow: row; margin-top: 48px; margin-left: 186px;">
            <jt-button :disabled="disableSubmit" type="primary" @click="saveSubmit('save')" style="width:80px;height:32px">保存</jt-button>
            <jt-button
                :disabled="disableSubmit"
                type="primary"
                style="margin-left: 8px"
                @click="saveSubmit('next')"
                v-show="this.mode === 'create'"
            >保存并新建下一条</jt-button>
            <jt-button style="margin-left:8px;width:80px;height:32px" @click="cancel">取消</jt-button>
        </div>
        <!-- <img src="data:image/png;base64,aHR0cDovLzEwLjIuNDAuMjA1OjkyMjIvMiwyMmFkYTgxNjZjMDI=" alt="">
        <video controls src="http://10.2.40.204:9223/5,21be2dfac21a" style="width:100%;height:79.8vh"></video> -->
        <!-- 切换弹窗 -->
        <jt-modal
            :closable="false"
            :footer="null"
            centered
            v-model="saveConfirm"
            :bodyStyle="{padding: '0px', height: '176px'}"
            width="340px"
        >
            <div style="padding-top: 32px;">
                <div style="margin-left: 32px;">
                    <jt-icon type="exclamation-circle" theme="filled" style="color: #ff931b; font-size: 18px;" />
                    <span style="margin-left: 8px; font-size: 14px; font-weight: 500; color: #333333; line-height: 20px;">
                        是否确认保存当前类型答案？
                    </span>
                </div>
                <div style="margin-top: 8px; margin-left: 58px;">
                    <span style="font-size: 12px; font-weight: 400; color: #555555; line-height: 18px;">
                        每条答案只支持一种类型，其他类型<br />答案将被删除
                    </span>
                </div>
                <div style="margin-top: 30px; margin-left: 180px;">
                    <jt-button style="width: 64px; height: 32px; background: #FFFFFF; border-radius:2px; padding: 7px 18px;  font-size: 12px;margin-bottom:10px" size ="large" @click="saveCancel">取消</jt-button>
                    <jt-button style="margin-left: 8px;margin-bottom:10px; width: 64px; height: 32px; border-radius:2px;padding: 7px 18px; font-size: 12px;" @click="saveOk" type="primary">确定</jt-button>
                </div>
            </div>
        </jt-modal>
        <!-- 上传图片中的查看图片弹窗,因为ie浏览器遮罩层问题所以将DOM元素放在了最外层 -->
        <jt-modal
            v-model="previewVisible" 
            :bodyStyle="{padding: '0px'}"
            :footer="null"
            centered
            @cancel="previewVisible=false"
            class="examine"
            v-dialogDrag
        >
            <div class="titleMoal">点此拖拽</div>
            <img 
                alt="example" 
                style="width: 100%;min-height:56px" 
                :src="previewImage != ''?previewImage:editUrlImg"
                oncontextmenu='return false' 
                ondragstart='return false' 
                onselectstart ='return false' 
                onbeforecopy='return false' 
            />
        </jt-modal>
        <!-- 上传视频中的查看视频弹窗,因为ie浏览器遮罩层问题所以将DOM元素放在了最外层 -->
        <jt-modal
            :closable="true"
            :footer="null"
            centered
            v-model="vioDialog"
            :afterClose="afterClose"
            :bodyStyle="{padding: '0px'}"
            width='1000px'
            class="vioModal"
            v-dialogDrag
        >
            <div class="titleMoal">点此拖拽</div>
            <video id="multimedia" controls :src="editUrlVio" style="width:100%;height:500px"></video>
        </jt-modal>
    </div>
</template>

<style lang="less" scoped>
@import "~@/assets/style/var.less";

div.contentBody {
    width: 100%;
    background: #ffffff;
    border-radius: 2px;
    padding: 20px 100px 40px 20px;
    font-size: 12px;
    font-family: "PingFangSC-Regular,PingFang SC";
    overflow-y: auto;
    /deep/.ant-btn {
        width: auto;
    }
    //树状图样式start
    /deep/.ant-tree li .ant-tree-node-content-wrapper.ant-tree-node-selected {
        background: none;
    }
    /deep/.ant-tree li .ant-tree-node-content-wrapper:hover {
        background: none;
    }
    /deep/.ant-tree.ant-tree-show-line li {
        margin-top: 24px;
    }
    /deep/.ant-tree.ant-tree-show-line li::before {
        height: 100%;
    }
    /deep/.ant-tree li .answerInput-margin {
        margin-top: 24px;
    }
    //树状图样式end
    .title {
        font-size: 16px;
        font-family: "PingFangSC-Medium,PingFang SC";
        font-weight: 600;
        color: #333333;
        line-height: 22px;
    }
    .inputLabel {
        min-width: 170px;
        text-align: right;
        color: #333333;
        margin-top: 7px;
        margin-right: 16px;
    }
    .input-list {
        max-height: 320px;
        overflow-y: auto;
        margin-top: 20px;
        width: 436px;
    }
    .input-item,.input-enter {
        width: 431px;
        height: 32px;
    }
    /deep/.input-item:not(:last-child) .ant-input {
        border-bottom: none;
    }
    /deep/.input-item .ant-input:hover {
        border-bottom: 1px solid #5c9dff;
    }
    /deep/.input-item .ant-input:focus {
        border-bottom: 1px solid #5c9dff;
    }
}
.iconshanchu1{
    cursor: pointer;
    color: #999;
}
.iconshanchu1:hover{
    color:#337DFF;
}
.plusIcon {
    color: #555555;
    font-size: 16px;
}
.plusIconDisabled {
    color: #BBBBBB;
    font-size: 16px;
}
.normalTip {
    margin-top: 4px;
    height: 17px;
    font-size: 12px;
    font-family: PingFangSC-Regular,PingFang SC;
    font-weight: 400;
    color: #999999;
    line-height: 17px;
    display: block;
    height: 20px;
}
.errorTip {
    margin-top: 4px;
    height: 17px;
    font-size: 12px;
    font-family: PingFangSC-Regular,PingFang SC;
    font-weight: 400;
    color: #F04134;
    line-height: 17px;
}
.plus_symbol{
   margin-right:8px; 
   height:14px;
   width:14px;
   font-size:12px; 
   color: #D9D9D9;
   border:1px solid #D9D9D9;
}
.guide_anwser_tips{
    color:#999;
    font-weight: 400;
    font-size: 12px;
    padding: 0;
    line-height: 27px;
    margin: 0
}
.add_layer_operation{
    margin-left: 17px;
    color: #337DFF;
    a{
        color: #337DFF;
        margin-right: 5px;
    }
}
.add_layer_operation:hover{
    cursor:pointer;
}
.add_layer_operation_h{
    color: #999;
    margin-left: 17px;
}
.add_layer_operation_h:hover{
    cursor:pointer;
}
.add_layer_operation_h a{
    margin-right: 5px;
    color: #999;
}
.answerDivider {
    margin-left: 16px;
    margin-right: 16px;
    margin-top: -4px;
    height: 12px;
}
.answerTabIcon {
    font-size: 16px;
    margin-right: 3px;
    color: #BBBBBB;
}
.answerTabText {
    font-size: 12px;
    position: relative;
    bottom: 2px;
    color: #BBBBBB;
}
.answerInput {
    width: 410px;
    position: relative;
    // bottom: 24px;
    textarea {
        width: 100%;
        height: 144px;
        resize: none;
        padding: 8px;
        display: block;
    }
    p {
        position: absolute;
        right: 8px;
        bottom: -8px;
        color: @jt-color-text-secondary;
        user-select: none;
        &.error {
            span {
                color: @jt-color-error;
            }
        }
        
    }
}
.level_1:last-child {
    display:none;
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
.vioModal {
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
        height: 520px;
        video {
            width:100%;
            max-height:500px;
        }
    }
    
}
</style>

<script>
//树状图初始数据
import { mapActions, mapMutations } from "vuex";
import { judgeSensitiveWord } from "@/utils/common.ts";
import { getRandomNum } from "@/utils/common";
import editAnswer from "./CreateAnswer.vue"
export default {
    components:{
        editAnswer
    },
    data() {
        return {
            //树状图start
            treeData: [],
            treeDataCopy:[], // 用来存储最开始后台返回的树 , 路由跳转调用删除接口时需要和修改后的树做对比
            newDelNum: [],
            num:0,
            showLine: true,
            key: 0,
            expandedKeys:[0],
            //树状图end

            env: "",
            mode: "",
            inputDisabled: true,
            isDel: true,
            //层级验证初始化
            level: true,
            content:[],
            similarQuestionValue: '',
            keyWordValue: '',
            input: {
                standardQuestion: "",
                similarQuestion: [],
                keyWord: [],
                answer: "",
            },
            validate: {
                standardQuestion: true,
                similarQuestion: true,
                keyWord: true,
                answer: true,
            },
            inputError: {
                standardQuestion: "",
                similarQuestion: "",
                keyWord: "",
                answer: "",
            },
            tips: {
                similarQuestion: "点击Enter添加相似问题，最多可添加100条",
                keyWord: "点击Enter添加关键词，最多可添加100个",
            },
            pageName: '',
            name: '',
            delList: [],
            isSave: false,
            delId:0,
            refKey:[],
            VioOrPicValidate:true,
            saveConfirm:false,
            AnswerIsChange: false,
            operation:"",
            //start 
            // 为了兼容ie将createAnswer组件中的查看视频和图片弹窗挪出来
            previewVisible:false,
            previewImage: '',
            editUrlImg: '',
            editUrlVio: '',
            vioDialog: false,
            parentNode: ''
            // end
        };
    },
    created() {
        // 进入页面清空delList
        this.$store.commit('guideDialog/clearDelList');
        this.$store.commit('guideDialog/clearDelListTS');
    },
    mounted() {
        this.initPage();
        // const base64image = this.getBase64Image('http://10.2.40.205:9222/2,22ada8166c02');
        // console.log('地址',base64image)
    },
    watch: {
        treeData: {
            deep:true,
            handler(newV) {
                this.refKey = [];
                this.setRefKey(newV);
            }
        }
    },
    beforeDestroy() {
        if (!this.isSave) {
            this.routerdelImgOrVio();
        }
    },
    computed: {
        disableSubmit() {
            // console.log('计算',this.input.standardQuestion,!this.validate.standardQuestion,!this.validate.similarQuestion,!this.validate.keyWord,!this.validate.answer,this.level,!this.VioOrPicValidate)
            if (
                this.input.standardQuestion === "" ||
                !this.validate.standardQuestion ||
                !this.validate.similarQuestion ||
                !this.validate.keyWord ||
                !this.validate.answer ||
                this.level || 
                !this.VioOrPicValidate
            ) {
                return true;
            } else {
                return false;
            }
        },
        leaderaccount() {
            return this.$store.state.guideDialog.tablelead;
        }
    },
    methods: {
        // getBase64Image(imgUrl) {
        //     const img = new Image();
        //     img.src = imgUrl;
        //     img.setAttribute('crossOrigin', 'anonymous');
        //     const canvas = document.createElement("canvas");
        //     canvas.width = img.width;
        //     canvas.height = img.height;
        //     const ctx = canvas.getContext("2d");
        //     ctx.drawImage(img, 0, 0);
        //     const dataURL = canvas.toDataURL("image/png");
        //     return dataURL.replace(/^data:image\/(png|jpg);base64,/, "")
        // },
        ...mapActions({
            addIntentionsDetail: "guideDialog/addIntentionsDetail",
            queryIntentionDetail: "guideDialog/queryIntentionDetail",
            leadmoduleGet:"guideDialog/addIntent",
            delVio: "questionAnswer/delVio"
        }),
        ...mapMutations({
            setDetailMode: "guideDialog/setDetailMode",
        }),
        initPage() {
            this.env = this.$store.state.envInfo.env;
            this.mode = this.$route.query.mode;
            this.name = this.$route.query.name;
            this.setDetailMode(this.mode);
            if (this.env === "test") {
                this.inputDisabled = false;
            }
            if (this.mode === 'detai' && this.env !== "test"){
                this.inputDisabled = true;
                this.isDel = false;
            }
            if(this.mode === "update" || this.env !== "test" || this.mode === 'detai'){
                this.$store.commit('showLoading',{},{ root: true });
                this.pageName = '编辑引导式意图'
                const args = {
                    skillid:this.$route.query.id,
                    envType: this.env === 'test' ? 0 : 1,
                }
                this.queryIntentionDetail(args).then(res =>{
                    if(res.errno === 0){
                        this.input = this.$store.state.guideDialog.intentionsDetail;
                        this.pushData(this.$store.state.guideDialog.questionandanswer,this.treeData,1);
                        this.treeDataCopy = JSON.parse(JSON.stringify(this.treeData));
                        this.$nextTick(() => {
                            this.$store.commit('hideLoading',{},{ root: true });
                        })
                    }else{
                        this.$notification.open({
                            message: "查询失败！",
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
                })
            }else{
                this.pageName = '新建引导式意图'
                this.treeData = [
                    {
                        value:'',
                        isShow: false,
                        isLight: true,
                        isSLight: true,
                        isShowAS: true,
                        isValidate : false,
                        style:{'margin-top':'0px'},
                        error: false,
                        errorMsg: '',
                        text: {
                            value: '',
                            visible: false,
                            isValidate :false,
                            isValidateMsg:'',
                            flag:0
                        },
                        key: 0,
                        level:1,
                        scopedSlots: { title: 'treeItem' },
                        children: []
                    }
                ]
                this.$store.commit('hideLoading', {}, { root: true });
            }
            this.$store.commit(
                'setBreadcrumb',
                [
                    {breadcrumbName: this.$store.state.envInfo.envName, breadcrumbPath: this.$store.state.fromPath},
                    {breadcrumbName: "引导式对话", breadcrumbPath: '/home/robotHome/guideDialog'},
                    {breadcrumbName: "引导式意图列表", breadcrumbPath: `/home/robotHome/Information?skillid=${this.$route.query.skillid}&name=${this.name}`},
                    {breadcrumbName: this.pageName}
                ]
            );
        },
        //意图验证
        validateStandardQuestion() {
            this.validate.standardQuestion = true;
            if (this.input.standardQuestion.match(/^[ ]*$/)) {
                this.inputError.standardQuestion = "请输入意图";
                this.validate.standardQuestion = false;
            } else if (this.input.standardQuestion.length > 125) {
                this.inputError.standardQuestion = "请输入125字以内的意图";
                this.validate.standardQuestion = false;
            }
            if (this.validate.standardQuestion === true) {
                const response = judgeSensitiveWord(this.input.standardQuestion);
                if (!response.detectedResult) {
                    this.validate.standardQuestion = false;
                    this.inputError.standardQuestion = response.errorMsg;
                }
            }
            if (this.validate.standardQuestion === false) {
                document.getElementById("inputStandardQuestion").style.borderColor = "#F04134";
            } else {
                document.getElementById("inputStandardQuestion").style.borderColor = "";
            }
        },
        //相似意图验证
        validateSimilarQuestion() {
            this.validate.similarQuestion = true;
            const similarQuestionNum = this.calSimilarQuestion()
            if (similarQuestionNum > 100) {
                this.inputError.similarQuestion = "最多可添加100条相似问题";
                this.validate.similarQuestion = false;
            }
            if(!this.similarQuestionValue.match(/^[ ]*$/) && this.similarQuestionValue.length> 125) {
                this.inputError.similarQuestion = "请输入125字以内的相似问题";
                this.validate.similarQuestion = false;
                document.getElementById("similarQuestionValue").style.borderBottom = "1px solid";
                document.getElementById("similarQuestionValue").style.borderColor = "#F04134";
            }else {
                document.getElementById("similarQuestionValue").style.borderBottom = "";
                document.getElementById("similarQuestionValue").style.borderColor = "";
            }
            for (let i = 0; i < this.input.similarQuestion.length; i++) {
                if (this.input.similarQuestion[i].length > 125 && !this.input.similarQuestion[i].match(/^[ ]*$/)) {
                    this.inputError.similarQuestion = "请输入125字以内的相似问题";
                    this.validate.similarQuestion = false;
                    document.getElementById("inputSimilarQuestion_" + i).style.borderBottom = "1px solid";
                    document.getElementById("inputSimilarQuestion_" + i).style.borderColor = "#F04134";
                }else {
                    document.getElementById("inputSimilarQuestion_" + i).style.borderBottom = "";
                    document.getElementById("inputSimilarQuestion_" + i).style.borderColor = "";
                }
            }
            if (this.validate.similarQuestion == true) {
                for (let i = 0; i < this.input.similarQuestion.length; i++) {
                    if (this.input.similarQuestion[i].length > 0 && this.input.similarQuestion[i] == this.similarQuestionValue) {
                        this.inputError.similarQuestion = "相似问题重复输入";
                        this.validate.similarQuestion = false;
                        document.getElementById("similarQuestionValue").style.borderBottom = "1px solid";
                        document.getElementById("similarQuestionValue").style.borderColor = "#F04134";
                    }
                }
            }
            if (this.validate.similarQuestion == true) {
                for (let i = 0; i < this.input.similarQuestion.length; i++) {
                    document.getElementById("inputSimilarQuestion_" + i).style.borderBottom = "";
                    document.getElementById("inputSimilarQuestion_" + i).style.borderColor = "";
                    for (let j = 0; j < this.input.similarQuestion.length; j++) {
                        if (this.input.similarQuestion[i].length > 0 && this.input.similarQuestion[i] == this.input.similarQuestion[j] && i != j) {
                            this.inputError.similarQuestion = "相似问题重复输入";
                            this.validate.similarQuestion = false;
                            document.getElementById("inputSimilarQuestion_" + i).style.borderBottom = "1px solid";
                            document.getElementById("inputSimilarQuestion_" + i).style.borderColor = "#F04134";
                        }
                    }
                }
            }
            if (this.validate.similarQuestion == true) {
                const response = judgeSensitiveWord(this.similarQuestionValue);
                if (!response.detectedResult) {
                    this.validate.similarQuestion = false;
                    this.inputError.similarQuestion = response.errorMsg;
                    document.getElementById("similarQuestionValue").style.borderBottom = "1px solid";
                    document.getElementById("similarQuestionValue").style.borderColor = "#F04134";
                } else {
                    document.getElementById("similarQuestionValue").style.borderBottom = "";
                    document.getElementById("similarQuestionValue").style.borderColor = "";
                }
            }
            if (this.validate.similarQuestion == true) {
                for (let i = 0; i < this.input.similarQuestion.length; i++) {
                    const response = judgeSensitiveWord(this.input.similarQuestion[i]);
                    if (!response.detectedResult) {
                        this.validate.similarQuestion = false;
                        this.inputError.similarQuestion = response.errorMsg;
                        document.getElementById("inputSimilarQuestion_" + i).style.borderBottom = "1px solid";
                        document.getElementById("inputSimilarQuestion_" + i).style.borderColor = "#F04134";
                    } else {
                        document.getElementById("inputSimilarQuestion_" + i).style.borderBottom = "";
                        document.getElementById("inputSimilarQuestion_" + i).style.borderColor = "";
                    }
                }
            }
        },
        //关键词验证
        validateKeyWord() {
            this.validate.keyWord = true;
            const keyWordNum = this.calKeywordNum()
            if (keyWordNum > 100) {
                this.inputError.keyWord = "最多可添加100个关键词";
                this.validate.keyWord = false;
            }
            if (this.keyWordValue.length > 12 && !this.keyWordValue.match(/^[ ]*$/)) {
                this.inputError.keyWord = "请输入12字以内的关键词";
                this.validate.keyWord = false;
                document.getElementById("keyWordValue").style.borderBottom = "1px solid";
                document.getElementById("keyWordValue").style.borderColor = "#F04134";
            }else {
                document.getElementById("keyWordValue").style.borderBottom = "";
                document.getElementById("keyWordValue").style.borderColor = "";
            }
            for (let i = 0; i < this.input.keyWord.length; i++) {
                if (this.input.keyWord[i].length > 12 && !this.input.keyWord[i].match(/^[ ]*$/)) {
                    this.inputError.keyWord = "请输入12字以内的关键词";
                    this.validate.keyWord = false;
                    document.getElementById("inputKeyWord_" + i).style.borderBottom = "1px solid";
                    document.getElementById("inputKeyWord_" + i).style.borderColor = "#F04134";
                }else {
                    document.getElementById("inputKeyWord_" + i).style.borderBottom = "";
                    document.getElementById("inputKeyWord_" + i).style.borderColor = "";
                }
            }
            if (this.validate.keyWord == true) {
                for (let i = 0; i < this.input.keyWord.length; i++) {
                    if (this.keyWordValue.length > 0 && this.input.keyWord[i] == this.keyWordValue) {
                        this.inputError.keyWord = "关键词重复输入";
                        this.validate.keyWord = false;
                        document.getElementById("keyWordValue").style.borderBottom = "1px solid";
                        document.getElementById("keyWordValue").style.borderColor = "#F04134";
                    }
                }
            }
            if (this.validate.keyWord == true) {
                for (let i = 0; i < this.input.keyWord.length; i++) {
                    document.getElementById("inputKeyWord_" + i).style.borderBottom = "";
                    document.getElementById("inputKeyWord_" + i).style.borderColor = "";
                    for (let j = 0; j < this.input.keyWord.length; j++) {
                        if (this.input.keyWord[i].length > 0 && this.input.keyWord[i] == this.input.keyWord[j] && i != j) {
                            this.inputError.keyWord = "关键词重复输入";
                            this.validate.keyWord = false;
                            document.getElementById("inputKeyWord_" + i).style.borderBottom = "1px solid";
                            document.getElementById("inputKeyWord_" + i).style.borderColor = "#F04134";}
                    }
                }
            }
            if (this.validate.keyWord == true) {
                const response = judgeSensitiveWord(this.keyWordValue);
                if (!response.detectedResult) {
                    this.validate.keyWord = false;
                    this.inputError.keyWord = response.errorMsg;
                    document.getElementById("keyWordValue").style.borderBottom = "1px solid";
                    document.getElementById("keyWordValue").style.borderColor = "#F04134";
                } else {
                    document.getElementById("keyWordValue").style.borderBottom = "";
                    document.getElementById("keyWordValue").style.borderColor = "";
                }
            }
            if (this.validate.keyWord == true) {
                for (let i = 0; i < this.input.keyWord.length; i++) {
                    const response = judgeSensitiveWord(this.input.keyWord[i]);
                    if (!response.detectedResult) {
                        this.validate.keyWord = false;
                        this.inputError.keyWord = response.errorMsg;
                        document.getElementById("inputKeyWord_" + i).style.borderBottom = "1px solid";
                        document.getElementById("inputKeyWord_" + i).style.borderColor = "#F04134";
                    } else {
                        document.getElementById("inputKeyWord_" + i).style.borderBottom = "";
                        document.getElementById("inputKeyWord_" + i).style.borderColor = "";
                    }
                }
            }
        },
        //引导话术验证
        validateAnswer() {
            this.validate.answer = true;
            if (this.input.answer.length > 125) {
                this.inputError.answer = "请输入125字以内的引导话术";
                this.validate.answer = false;
            }
            if (this.validate.answer === true) {
                const response = judgeSensitiveWord(this.input.answer);
                if (!response.detectedResult) {
                    this.validate.answer = false;
                    this.inputError.answer = response.errorMsg;
                }
            }
            if(this.validate.answer == false){
                document.getElementById("inputAnswer").style.borderColor = "#F04134";
            }else{
                document.getElementById("inputAnswer").style.borderColor = "";
            }
        },
        hideLayer(data) {
            // this.$set(data, 'isShow', false)
            this.validateGuideAndAnswer(data)
        },
        //判断保存按钮是否可以点击
        canClick(data) {
            data.map(item => {
                if(item.error || (item.text.visible && item.text.isValidate)){
                    this.level = true
                }else if(item.children.length>0){
                    this.canClick(item.children)
                } 
            });
        },
        // 子组件调用引导问题验证
        sonSerParent(data) {
            this.validateGuideAndAnswer(data);
        },
        //验证引导问题
        validateGuideAndAnswer(data) {
            let response1 = ''
            if(data.value){
                response1 = judgeSensitiveWord(data.value);
            }
            if(data.value && data.value.match(/^[ ]*$/)){
                data.error = true;
                data.errorMsg = '请输入引导问题及答案'
            }else if(data.value && data.value.length>125){
                data.error = true;
                data.errorMsg = '字数超过限制，125字以内'
            }else if (!response1.detectedResult) {
                data.error = true;
                data.errorMsg = response1.errorMsg
            }else{
                this.$nextTick(() => {
                    if(data.children.length<=0 && data.text.flag == 0 && data.text.value == ''){
                        this.$set(data,'error',true);
                        this.$set(data,'errorMsg','请对末子节点添加答案');
                    }else if(data.children.length<=0 && data.text.flag == 1 && data.text.valuePic == ''){
                        this.$set(data,'error',true);
                        this.$set(data,'errorMsg','请对末子节点添加答案');
                    }else if (data.children.length<=0 && data.text.flag == 2 && data.text.valueVio == '') {
                        this.$set(data,'error',true);
                        this.$set(data,'errorMsg','请对末子节点添加答案');
                    }else{
                        this.$set(data,'error',false);
                        this.$set(data,'errorMsg','');
                    }
                })
            }
            this.treeData[0].style = {'margin-top':'0px'}
            if(this.treeData[0].children.length>0){
                if(this.treeData[0].error){
                    this.treeData[0].children[0].style = {'margin-top':'48px'}
                }else{
                    this.treeData[0].children[0].style = {'margin-top':'24px'}
                }
                if(this.treeData[0].children[0].text.visible){
                    this.treeData[0].children[0].style.height = 332 + 'px'
                }
            }else{
                this.treeData[0].style = {'margin-top':'0px'}
            }
            if(this.treeData[0].text.visible){
                if(this.treeData[0].error){
                    this.treeData[0].style = {'margin-top':'0px','height':'368px'}
                }else{
                    this.treeData[0].style = {'margin-top':'0px','height':'344px'}
                }
            }
            if (data.key != 0 && data.error && data.visible) {
                data.style = { 'height': '330px' }
            }else if (data.key != 0 && !data.error && data.visible) {
                data.style = { 'height': '312px' }
            }
            const input = 'input_' + data.key
            this.$nextTick(() => {
                if (data.error && document.getElementById(input)) {
                    document.getElementById(input).style.borderColor = "#F04134";
                } else if (document.getElementById(input)){
                    this.$nextTick(() => {
                        document.getElementById(input).style.borderColor = "";
                    })
                }
            })
            this.$nextTick(() => {
                this.level = false;
                this.canClick(this.treeData);
            })
        },
        calSimilarQuestion() {
            const arr= this.input.similarQuestion.filter(item => !item.match(/^[ ]*$/))
            let length = arr.length
            if(!this.similarQuestionValue.match(/^[ ]*$/)){
                length+=1
            }
            return length
        },
        addSimilarQuestion(e) {
            const item = e.target.value
            if(!item.match(/^[ ]*$/)) {
                this.input.similarQuestion.unshift(item);
                this.similarQuestionValue = ''
            }
            this.$nextTick(()=>{
                this.validateSimilarQuestion()
            })
        },
        //删除相似问题
        delSimilarQuestion(index) {
            this.input.similarQuestion.splice(index, 1)
            this.calSimilarQuestion()
            this.validateSimilarQuestion();
        },
        calKeywordNum() {
            const arr= this.input.keyWord.filter(item => !item.match(/^[ ]*$/))
            let length = arr.length
            if(!this.keyWordValue.match(/^[ ]*$/)){
                length+=1
            }
            return length
        },
        addKeyWord(e) {
            const item = e.target.value
            if(!item.match(/^[ ]*$/)) {
                this.input.keyWord.unshift(item);
                this.keyWordValue = ''
            }
            this.$nextTick(()=>{
                this.validateKeyWord();
            })
        },
        //删除关键词
        delKeyWord(index) {
            this.input.keyWord.splice(index, 1)
            this.calKeywordNum()
            this.validateKeyWord()
        },
        // 上传子传父,修改answer,图片和视频
        uploadAnswer(val,data) {
            this.validateGuideAndAnswer(data)
        },
        // 上传子传父,设置图片视频重新上传后保存按钮是否禁用,
        setAnswerValidate(val,item) {
            this.VioOrPicValidate = val;
            this.validateGuideAndAnswer(item);
        },
        // 拿出树中所有的key
        setRefKey(val) {
            val.forEach(item => {
                if (item.children.length>0) {
                    this.setRefKey(item.children);
                }
                this.refKey.unshift(item.key);
            })
        },
        //新建意图
        saveSubmit(operation) {
            this.operation = operation;
            this.saveConfirm = false;
            this.refKey.forEach(item => {
                this.$refs['editAnswer'+item] && this.$refs['editAnswer'+item].setConfirm();
                if(this.$refs['editAnswer'+item] && this.$refs['editAnswer'+item].deleteConfirmShow == true) {
                    this.AnswerIsChange = true;
                }
            })
            this.saveAnswer();
        },
        saveAnswer() {
            if(this.AnswerIsChange) {
                this.saveConfirm = true;
            }else {
                // 保存前先处理要删除的没用的图片和视频
                this.refKey.forEach(item => {
                    this.$refs['editAnswer'+item] && this.$refs['editAnswer'+item].delFileDispose();
                })
                if(!this.leaderaccount && this.mode == 'create') {
                    this.$message.warn('您当前的对话意图数量已超出限制')
                    return
                }
                const similarQuestionArr = this.input.similarQuestion.filter(item => !item.match(/^[ ]*$/))
                if(this.similarQuestionValue){
                    similarQuestionArr.unshift(this.similarQuestionValue)
                }
                const keyWordArr = this.input.keyWord.filter(item => !item.match(/^[ ]*$/))
                if(this.keyWordValue) {
                    keyWordArr.unshift(this.keyWordValue)
                }
                // todo
                const data = {
                    'userid': getRandomNum(this.$store.state.userId),
                    'botid': getRandomNum(this.$store.state.robotInfo.robotId),
                    'skillid': this.$route.query.skillid, //技能id
                    'topics': this.input.standardQuestion, //意图
                    'similarTopics': similarQuestionArr, //相似意图
                    'words': keyWordArr, //关键词
                    'text': this.input.answer,  //引导话术
                    'id': this.$route.query.id, //意图id
                    'content': this.getPassData(this.treeData,this.content) //层级数据
                };
                this.addIntentionsDetail(data).then(res =>{
                    if (res.errno === 0) {
                        this.isSave = true;
                        this.delPicOrVio();
                        this.$message.success("保存成功");
                        const skillid = this.$route.query.skillid; //技能id
                        // const id = this.$route.query.id;
                        if(this.operation === 'save'){
                            this.$router.push({ name: 'Information', query: { skillid: skillid, name:this.name }});
                        }
                        if(this.operation === 'next'){
                            // this.$router.go(0)
                            this.input = {
                                standardQuestion: "",
                                similarQuestion: [],
                                keyWord: [],
                                answer: "",
                            };
                            this.similarQuestionValue = ''
                            this.keyWordValue = ''
                            this.treeData = [
                                {
                                    value:'',
                                    isShow: false,
                                    isLight: true,
                                    isSLight: true,
                                    isShowAS: true,
                                    isValidate : false,
                                    style:{'margin-top':'0px'},
                                    error: false,
                                    errorMsg: '',
                                    text: {
                                        value: '',
                                        visible: false,
                                        isValidate :false,
                                        isValidateMsg:'',
                                        flag:0
                                    },
                                    key: 0,
                                    level:1,
                                    scopedSlots: { title: 'treeItem' },
                                    children: []
                                }
                            ]
                            this.refKey.forEach(item => {
                                // 快速清空子组件中所有data
                                if(this.$refs['editAnswer'+item] !== undefined) { // 这层判断(如果不添加答案的话editAnswer组件为空,就像当于没引入子组件)
                                    Object.assign(this.$refs['editAnswer'+item].$data,this.$refs['editAnswer'+item].$options.data())
                                    this.$refs['editAnswer'+item].answerClick(false,'text');
                                    this.$refs['editAnswer'+item].tabCutOk(true);
                                }
                            })
                            this.level = false;
                            this.leadmoduleGet();
                        }
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
                    this.content = []
                }).catch(() => {
                    this.$notification.open({
                        message: "保存失败！",
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
            }
        },
        // 删除垃圾视频和图片
        delPicOrVio() {
            let delList;
            if (this.isSave) {
                delList = this.$store.state.guideDialog.delList.join("");
            }else {
                const listAll = this.$store.state.guideDialog.delListTS;
                delList = listAll.join("");
            }
            const answer = {
                answer: delList,
                userId: this.$store.state.userId,
                botId: this.$store.state.robotInfo.robotId
            }
            if (answer.answer != "") {
                this.delVio(answer).then(res => {
                    if (res.errno == 0) {
                        // this.picAnswer = "";
                    }else {
                        this.$notification.open({
                            message: "删除失败!",
                            description: res.errorMsg,
                            icon: 
                                  <jt-icon
                                      type= "exclamation-circle"
                                      theme= "filled"
                                      style= "color:#F04134"
                                  />
                        })
                    }
                })
            }
        },
        // 递归处理要删除的数据
        // setDelList2(treeDataCopy,listAll) {
        //     treeDataCopy.forEach(item => {
        //         if (item.text.flag == 1 && item.text.valuePic != "") {
        //             // if(!listAll.findindex(item.text.valuePic.split("%")[0])) {
        //             //     this.delList.push()
        //             // }
        //             console.log(listAll,item.text.valuePic.split("%")[0])
        //             const a = listAll.findIndex((item2) => {
        //                 return item2 == item.text.valuePic.split("%")[0]
        //             })
        //             console.log('索引',a)
        //             if(a) {
        //                 listAll.splice(a,1)
        //             }
        //         }
        //         if(item.children.length > 0) {
        //             this.setDelList2(item.children,listAll)
        //         }
        //     })
        // },
        saveOk() {
            this.saveConfirm = false;
            this.AnswerIsChange = false;
            this.saveAnswer();
        },
        saveCancel() {
            this.saveConfirm = false;
            this.AnswerIsChange = false;
        },
        // 离开页面处理要删除的垃圾图片和视频
        // 之前想的切换路由删除是根据老树和新树去对比着删除(就是下面注释的两个方法), 但是缺陷是无法对比出切换tab动作
        // 现在的逻辑是将所有的上传文件保存在vuex中切换路由时直接将所有新上传的文件删除就可以了
        routerdelImgOrVio() {
            // this.setDelList(this.treeData); // 删除已有节点中新上传的文件
            // this.setAddDelId(this.treeData); // 删除新增节点中新上传的文件
            this.delPicOrVio();
        },
        // 递归处理要删除的数据
        setDelList(val) {
            val.forEach(item => {
                if ((item.text.flag == 1 && item.text.valuePic != "" ) || (item.text.flag == 2 && item.text.valueVio !== "")) {
                    this.setDelListTwo(this.treeDataCopy,item)
                }
                if(item.children.length > 0) {
                    this.setDelList(item.children)
                }
            })
        },
        // 递归套递归处理删除数据
        setDelListTwo(val,item) {
            val.forEach(item2 => {
                if(item.delId == item2.delId) {
                    if(item.text.flag == 1) {
                        if(item2.text.flag != 1) {
                            this.delList.push(item.text.valuePic.split("%")[0])
                        }else if(item2.text.flag == 1 && item2.text.valuePic != item.text.valuePic) {
                            this.delList.push(item.text.valuePic.split("%")[0])
                        }
                    }else if(item.text.flag == 2) {
                        if(item2.text.flag != 2) {
                            this.delList.push(item.text.valueVio.split("%")[0])
                        }else if(item2.text.flag == 2 && item2.text.valueVio != item.text.valueVio) {
                            this.delList.push(item.text.valueVio.split("%")[0])
                        }
                    }
                }
                if(item2.children.length > 0) {
                    this.setDelListTwo(item2.children,item)
                }
            })
        },
        setAddDelId(val) {
            val.forEach(item => {
                if ((item.text.flag == 1 && item.text.valuePic != "" ) || (item.text.flag == 2 && item.text.valueVio !== "")) {
                    this.num = 0;
                    this.setAddDelIdTwo(this.treeDataCopy,item);
                    if(this.num == 0 && item.text.flag && item.text.flag != 0) {
                        if(item.text.flag == 1) {
                            this.delList.push(item.text.valuePic.split("%")[0]);
                        }else if(item.text.flag == 2) {
                            this.delList.push(item.text.valueVio.split("%")[0]);
                        }
                    }
                }
                if(item.children.length > 0) {
                    this.setAddDelId(item.children);
                }
            })
        },
        setAddDelIdTwo(val,item) {
            val.forEach(item2 => {
                if(item2.delId == item.delId) {
                    this.num=1;
                }
                if(item2.children.length > 0) {
                    this.setAddDelIdTwo(item2.children,item);
                }
            })
        },
        // 取消按钮
        cancel(){
            const skillid = this.$route.query.skillid; //技能id
            const name = this.$route.query.name;
            this.$router.push({ name: 'Information', query: { skillid: skillid , name:name }});
        },
        //获得焦点显示添加层级按钮
        showLayer(data){
            this.$set(data, 'isShow', true)
            this.validateGuideAndAnswer(data)
        },
        //递归树形图数据
        mapTreeData(data,newLevel,treeData,type,parentNode) {
            treeData.some((item,index,arr) => {
                //添加平级
                if(data.key == item.key && type=='add') {
                    arr.push(newLevel)
                    return true;
                //删除层级
                }else if(data.key == item.key && type=='del'){
                    arr.splice(arr.indexOf(data),1)
                    this.validateGuideAndAnswer(parentNode)
                    if(arr.length<=0){
                        parentNode.isShowAS = true
                    }
                    if(parentNode.key == 0 && parentNode.error){
                        parentNode.style = {'margin-top':'0px'}
                    }
                    return true;
                }else{
                    this.mapTreeData(data,newLevel,item.children,type,item)
                }
            })
        },
        //添加平级
        addlevel(data){
            // this.level = false;
            this.$set(data, 'isShow', false)
            const newLevel = {
                value: '',
                isShow:false, //平级、子级、答案是否显示
                isLight: true,//平级操作按钮是否置灰
                isSLight: true,//子级操作按钮是否置灰
                isShowAS: true,//答案是置灰
                isValidate : false,
                text: {
                    value: '',
                    visible: false,       // 有无答案
                    isValidate :false,
                    isValidateMsg:'',
                    flag:0
                },
                error: false,
                errorMsg: '',
                key: ++this.key,
                level: data.level, // 控制子级操作按钮层级
                scopedSlots: { title: 'treeItem' },
                children: []
            }
            if(newLevel.level >= 4){
                newLevel.isSLight = false
            }
            this.expandedKeys.push(this.key)
            this.mapTreeData(data,newLevel,this.treeData,'add',null)
            const input = 'input_' + newLevel.key
            this.$nextTick(() => {
                document.getElementById(input).focus()
            })
        },
        //添加子级
        addSubLevel(data){
            if(data.level < 4 && data.isSLight){
                this.$set(data, 'isShow', false)
                this.$set(data, 'isShowAS', false)
                let level = data.level
                const  newChild = {
                    value: '',
                    isShow:false, //平级、子级、答案是否显示
                    isLight: true,
                    isSLight: true,
                    isShowAS: true,
                    isValidate : false,
                    text: {
                        value: '',
                        visible: false,
                        isValidate :false,
                        isValidateMsg:'',
                        flag:0
                    },
                    error: false,
                    errorMsg: '',
                    key: ++this.key,
                    level: ++level,
                    scopedSlots: { title: 'treeItem' },
                    children: []
                }
                if(data.key == 0 && data.error){
                    newChild.style = {'margin-top':'48px'}
                    data.style = {'margin-top':'0px'}
                }
                if(newChild.level >= 4){
                    newChild.isSLight = false
                }
                if (!data.children) {
                    this.$set(data, 'children', [])
                }
                data.children.push(newChild)
                this.expandedKeys.push(this.key)
                const input = 'input_' + newChild.key
                this.$nextTick(() => {
                    document.getElementById(input).focus()
                })
                this.validateGuideAndAnswer(data)
            } 
        },
        //删除层级
        removeLevel(data){
            // 删除对应上传图片/视频
            this.refKey.forEach(item => {
                if (item == data.key) {
                    this.$refs['editAnswer'+item] && this.$refs['editAnswer'+item].removeLevelAnswer(data);
                }
            })
            this.mapTreeData(data,null,this.treeData,'del',this.treeData)   
        },
        //添加答案
        addAnswer(data){
            if(data.isShowAS){
                this.$set(data, 'isShow', false)
                this.$set(data.text, 'visible', true)
                this.$set(data, 'isShowAS', false)
                this.$set(data, 'isSLight', false)
                this.$set(data, 'style', {height:'334px'})
            }
            if(data.key == 0){
                this.$set(data, 'style', {height:'364px','margin-top':'0px'})
            }
            if(this.treeData[0].children.indexOf(data) == 0 && this.treeData[0].error){
                this.$set(data, 'style', {height:'338px','margin-top':'48px'})
            }
            const textarea = 'textarea' + data.key
            this.$nextTick(() => {
                document.getElementById(textarea).focus()
            })
        },
        //删除答案
        removeLevelAnswer(data){
            this.$set(data.text, 'visible', false)
            this.$set(data.text, 'isValidate', false)
            this.$set(data.text, 'value', '')
            this.$set(data.text, 'isValidateMsg', '')
            this.$set(data, 'isShowAS', true)
            this.$set(data, 'isSLight', true)
            this.$set(data, 'style', {})
            if(data.key == 0){
                this.$set(data, 'style', {'margin-top':'0px'})
            }
            this.validateGuideAndAnswer(data)
        },
        //保存时遍历树结构并重新赋值
        getPassData(data,content){
            const treeData = data;
            treeData.forEach(item => {
                const childData = {}
                childData.nodeName = item.value;
                childData.child = [];
                if(item.children.length>0) {
                    this.getPassData(item.children,childData.child)
                }else{
                    if (item.text.flag !=0 && !item.text.clearContent) {
                        if(item.text.flag && item.text.flag == 1) {
                            childData.content = item.text.valuePic;
                        }else if(item.text.flag && item.text.flag == 2) {
                            childData.content = item.text.valueVio;
                        }
                    }else if(item.text.flag == 0) {
                        childData.content = item.text.value;
                    }
                    if (item.text.flag !== '' && item.text.flag !== undefined) {
                        childData.flag = item.text.flag.toString();
                    }
                }
                content.push(childData)
            });
            return this.content;
        },
        //获取详情遍历返回数据并初始化树形结构
        pushData(data,treeData,level){
            const content = data
            content.forEach((item) => {
                this.delId+=1;
                const childData = {
                    value:'',
                    isShow: false,
                    isLight: true,//平级按钮是否置灰
                    isSLight: true,//子级按钮是否置灰
                    isShowAS: false,//答案按钮是否置灰
                    isValidate : false,
                    style:{},
                    text: {
                        value: '',
                        visible: false,
                        isValidate :false,
                        isValidateMsg:'',
                        flag:0
                    },
                    key: this.key,
                    level: level,
                    scopedSlots: { title: 'treeItem' },
                    children: [],
                    delId:this.delId
                }
                this.expandedKeys.push(this.key)
                childData.value = item.nodeName;
                this.key++
                if(item.child && item.child.length>0) {
                    if(childData.key == 0){
                        childData.style = {'margin-top':'0px'}
                    }
                    const level = childData.level + 1
                    this.pushData(item.child,childData.children,level)
                }else{
                    if (item.flag && item.flag == 1) {
                        childData.text.valuePic = item.content;
                    }else if(item.flag && item.flag == 2) {
                        childData.text.valueVio = item.content;
                    }else {
                        childData.text.value = item.content;
                    }
                    childData.text.visible = true;
                    childData.isSLight = false
                    if(childData.key == 0){
                        childData.style = {'margin-top':'0px',height:'344px'}
                    }else{
                        childData.style =  {height:'330px'}
                    }
                    if (item.flag == 1) {
                        this.$set(childData.text,'flag',item.flag)
                        this.$set(childData.text,'fileStream',item.fileStream)
                        this.$set(childData.text,'file_name',item.file_name)
                        this.$set(childData.text,'file_size',item.file_size)
                    }else if(item.flag == 2) {
                        this.$set(childData.text,'flag',item.flag)
                        this.$set(childData.text,'file_name',item.file_name)
                        this.$set(childData.text,'file_size',item.file_size)
                    }
                }
                treeData.push(childData)
            });
            this.level = false
            return this.treeData
        },
        // 为了兼容ie将createAnswer组件中的查看视频和图片弹窗挪出来
        //start 
        setModal(val) {
            this.previewVisible = val
        },
        setPreviewImage(val) {
            this.previewImage = val
        },
        setEditUrlImg(val) {
            this.editUrlImg = val
        },
        afterClose() {
            const vio = document.querySelector('#multimedia');
            vio.pause();
        },
        setEditUrlVio(val) {
            this.editUrlVio = val
        },
        setVioDialog(val) {
            this.vioDialog = val
        },
        // end
    }
};
</script>
