<template>
    <div class="box">
        <div style="display: flex; flex-flow: row; margin-top: 20px;">
            <div style="display: flex; flex-flow: column;position:relative">
                <div>
                    <span @click="answerClick(true,'text')" :class="'text'+value.key" style="color:rgb(51, 125, 255)">
                        <span class="iconfont iconwenben" style="font-size: 16px; margin-right: 3px;cursor: pointer;" />
                        <span style="font-size: 12px; position: relative; bottom: 2px;cursor: pointer;">文本</span>
                        <jt-divider type="vertical" class="answerDivider" />
                    </span>
                    <span @click="answerClick(true,'pic')" :class="'pic'+value.key">
                        <span class="iconfont icontupian answerTabIcon" />
                        <span class="answerTabText">图片</span>
                        <jt-divider type="vertical" class="answerDivider" />
                    </span>
                    <span @click="answerClick(true,'vio')" :class="'vio'+value.key">
                        <span class="iconfont iconshipin answerTabIcon" />
                        <span class="answerTabText">视频</span>
                        <jt-divider type="vertical" class="answerDivider" />
                    </span>
                    <jt-tooltip placement="top">
                        <template slot="title">
                            <span>接口答案功能暂未上线，敬请期待</span>
                        </template>
                        <span class="iconfont iconapi answerTabIconPort" />
                        <span class="answerTabTextPort">接口</span>
                    </jt-tooltip>
                </div>
                <p :class="{error: value.text.value.length > 2000}">
                    <span
                        title="删除答案"
                        slot="suffix"
                        class="iconfont iconshanchu1 dele"
                        @click="removeLevelAnswer(value)"
                        @change="removeLevelAnswer(value)"
                        style="margin-left:8px;margin-right:8px;"
                        :disabled="inputDisabled"
                        v-if="isDel"
                    >
                    </span>
                </p>
                <div class="answerInput" :id="'textarea' + value.key">
                    <span style="position:absolute;z-index:1;color:#BFBFBF;top:6px;left:12px;" v-if="tabType == 'text'">答：</span>
                    <jt-input
                        type="textarea"
                        v-model="value.text.value"
                        style="text-indent:24px"
                        placeholder="请输入2000字以内的答案"
                        :disabled="inputDisabled"
                        @blur="validateText()"
                        @change="validateText()"
                        v-if="tabType == 'text'"
                    />
                    <jt-upload
                        :action="uploadImgUrl"
                        name="uploadfile"
                        accept=".jpg,.png"
                        list-type="picture-card"
                        :file-list="fileList"
                        :beforeUpload="beforeUploadImg"
                        :disabled="inputDisabled"
                        @preview="handlePreview"
                        @change="({file,fileList}) => {(handleChange({file,fileList,value}))}"
                        :remove="removePic"
                        @reject="imgReject"
                        class="upLoadingPic"
                        v-if="tabType == 'pic'"
                    >
                        <div v-if="fileList.length < 1 && !isErrorImg" class="uploadBox">
                            <jt-icon type="cloud-upload" class="icon"/>
                            <div class="ant-upload-text-top">
                                点击或将图片拖拽到这里上传
                            </div>
                            <div class="ant-upload-text-center">
                                只支持JPG、PNG
                            </div>
                            <div class="ant-upload-text-bot">
                                大小不超过5M
                            </div>
                        </div>
                    </jt-upload>
                    <div v-if="isErrorImg && tabType == 'pic'" class="errorpic">
                        <jt-icon type="file-exclamation" class="file"/>
                        <div class="txt">上传失败</div>
                        <jt-icon type="close-circle" class="close" @click="closeError"/>
                        <!-- <jt-icon type="redo" class="redo"/> -->
                    </div>
                    <jt-upload
                        list-type="picture-card"
                        :action="uploadVioUrl"
                        :file-list="fileListTwo"
                        accept=".mp4"
                        name="uploadfile"
                        :beforeUpload="beforeUploadVio"
                        :disabled="inputDisabled"
                        @change="({file,fileList}) => {(handleChange({file,fileList,value}))}"
                        @reject="vioReject"
                        class="upLoadingVio"
                        v-if="tabType == 'vio'"
                    >
                        <div v-if="fileListTwo.length < 1 && !isErrorVio && !isSuccess" class="uploadBoxVio">
                            <jt-icon type="cloud-upload" class="icon"/>
                            <div class="ant-upload-text-top">
                                点击或将视频拖拽到这里上传
                            </div>
                            <div class="ant-upload-text-center">
                                只支持MP4,
                            </div>
                            <div class="ant-upload-text-bot">
                                大小不超过10M
                            </div>
                        </div>
                    </jt-upload>
                    <!-- 上传成功 -->
                    <div v-if="isSuccess && tabType == 'vio'" class="errorVio" style="cursor:pointer" title="点击查看" @click="checkVio">
                        <div class="iconfont iconfile-video-fill file" style="color:#accaff;font-size:40px;margin-top:40px"></div>
                        <div class="txtVioTop">{{fileNameVio}}</div>
                        <div class="txtVipBto" v-if="fileSizeVio">{{fileSizeVio+'MB'}}</div>
                        <div class="aginUpload" style="background:#ccc">
                            <jt-button  ghost class="aginBtn" @click.stop="aginUploadClick" v-show="!inputDisabled">重新上传</jt-button>
                        </div>
                    </div>
                    <!-- 上传失败 -->
                    <div v-if="isErrorVio && tabType == 'vio'" class="errorVio">
                        <div class="iconfont iconfile-video-fill file" style="color:#accaff;font-size:40px;margin-top:40px"></div>
                        <div class="txtVioTop">{{fileNameVio}}</div>
                        <div class="txtVipBto">{{fileSizeVio+'MB'}}</div>
                        <span style="color:red">上传失败</span>
                        <jt-icon type="close-circle" class="close" @click="closeError"/>
                        <!-- <jt-icon type="redo" class="redo"/> -->
                    </div>
                </div>
                <span v-show="env === 'test' && !validate.answer" class="errorTip">{{inputError.answer}}</span>
            </div>
        </div>
        <!-- 切换弹窗 -->
        <!-- <jt-modal
            :closable="false"
            :footer="null"
            centered
            v-model="deleteConfirmShow"
            :bodyStyle="{padding: '0px', height: '176px'}"
            width="340px"
        >
            <div style="padding-top: 32px;">
                <div style="margin-left: 32px;">
                    <jt-icon type="exclamation-circle" theme="filled" style="color: #ff931b; font-size: 18px;" />
                    <span style="margin-left: 8px; font-size: 14px; font-weight: 500; color: #333333; line-height: 20px;">是否确认更改为{{answerType}}答案

                    </span>
                </div>
                <div style="margin-top: 8px; margin-left: 58px;">
                    <span style="font-size: 12px; font-weight: 400; color: #555555; line-height: 18px;">只支持同一格式的答案,如切换至{{answerType}},<br />{{tabType == 'text'?'文本':tabType== 'pic'?'图片':'视频'}}类答案将不再保留</span>
                </div>
                <div style="margin-top: 30px; margin-left: 180px;">
                    <jt-button style="width: 64px; height: 32px; background: #FFFFFF; border-radius:2px; padding: 7px 18px;  font-size: 12px;margin-bottom:10px" size ="large" @click="deleteCancel">取消</jt-button>
                    <jt-button style="margin-left: 8px;margin-bottom:10px; width: 64px; height: 32px; border-radius:2px;padding: 7px 18px; font-size: 12px;" @click="tabCutOk" type="primary">确定</jt-button>
                </div>
            </div>
        </jt-modal> -->
        <!-- 视频重新上传确认框 -->
        <!-- <jt-modal
            :closable="false"
            centered
            v-model="delUploadVio"
            :bodyStyle="{padding: '0px', height: '106px'}"
            width="416px"
            @ok="handleDelOk"
            @cancel="handleDelCancel"
            class="delUploadVio"
            cancelText= "取消"
            okText= "确定"
        >
            <div style="padding-top: 32px;">
                <div style="margin-left:20px">
                    <jt-icon type="exclamation-circle" theme="filled" style="color: red; font-size: 18px;" />
                    <span style="font-size:14px;font-weight: 500;color: #333333;margin-left:5px">确定删除之前上传的视频吗?</span>
                    <div style="margin:10px 0px 0px 22px">删除后将无法恢复</div>
                </div>
            </div>
        </jt-modal> -->
        <!-- 查看视频弹窗 -->
        <!-- <jt-modal
            :closable="true"
            :footer="null"
            centered
            v-model="vioDialog"
            :afterClose="afterClose"
            :bodyStyle="{padding: '0px'}"
            width='1000px'
            v-dialogDrag
            :maskStyle='{width:100+"vw"}'
        >
            <video :id="'multimedia'+value.key" controls :src="editUrlVio" style="width:100%;height:500px"></video>
        </jt-modal> -->
    </div>
</template>

<script>
import { mixin } from '@/views/mixins/uploadFileTree.js';
import { judgeSensitiveWord } from "@/utils/common.ts";
import { Upload,Icon } from "ant-design-vue";
import { mapActions } from "vuex";
export default {
    components:{
        'jt-upload':Upload,
        'jt-icon':Icon
    },
    props:{
        inputDisabled:{
            request:true,
            default:false,
            type:Boolean
        },
        input:{
            request:true,
            default:''
        },
        value:{
            request:true
        },
        answerId: {
            request: true,
            type: String
        },
        isDel: {
            request: true,
            type: Boolean
        },
        mode: {
            request: true,
            type: String
        }
    },
    model: {
        prop: 'value',
        event: 'change'
    },
    mixins:[mixin],
    watch:{
        // input:{
        //     immediate:true,
        //     handler: function(newV) {
        //         if (newV && this.tabType == 'text') {
        //             this.answer = newV
        //         }
        //     }
        // },
        // answer: {
        //     handler: function(newV) {
        //         this.$emit('handleChangeInputAnswer', newV)
        //     }
        // },
        // ,
        // value: {
        //     immediate:true,
        //     hander: function(newV) {
        //         console.log('传值',newV)
        //     }
        // }
    },
    data() {
        return {
            env:"",
            answer:"",
            answerObj:"",
            validate:{
                answer:true
            },
            inputError:{
                answer:''
            },
            tabType:'text',
            answerType:'',
            fileList:[],
            fileListTwo:[],
            fileNameVio:'',
            fileSizeVio:'',
            previewVisible: false,
            previewImage: '',
            deleteConfirmShow:false,
            isErrorImg:false,
            isErrorVio:false,
            isSuccess:false,
            vioDialog:false,
            picAnswer:'',
            vioAnswer: '',
            lastPicAnswer: '',
            lastVioAnswer: '',
            editUrlImg:'',
            editUrlVio:'',
            uploadVioSrc:'',
            delUploadVio:false,
            fidVio:'',
            fidPic:'',
            vioUploadStatus: ''
        }
    },
    created() {
        this.init();
    },
    mounted() {
        this.initPicOrVio();
    },
    methods:{
        ...mapActions({
            getPicOrVio: "questionAnswer/getPicOrVio",
            delVio: "questionAnswer/delVio"
        }),
        //删除答案
        removeLevelAnswer(data){
            // 如果是图片或视频的话点击删除答案需要将上传的
            // 文件删除掉
            if (data.text.flag == 1 && data.text.valuePic != "") {
                this.$store.commit('guideDialog/setDelList',data.text.valuePic.split("%")[0]);
            }else if(data.text.flag == 2 && data.text.valueVio != "") {
                this.$store.commit('guideDialog/setDelList',data.text.valueVio.split("%")[0]);
            }
            // 删除以后需要清空上传列表
            if (this.value.text.flag == 1) {
                this.fileList = [];
                this.fidPic = "";
            }else if (this.value.text.flag == 2) {
                this.isSuccess = false;
                this.fidVio = "";
                this.fileListTwo = [];
            }
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
            this.validateText(true,true);
            data.text.valueVio = "";
            data.text.valuePic = "";
            this.$emit('validateGuideAndAnswer', data);
        },
        initPicOrVio() {
            if (this.value) {
                if (this.value.text.flag == 0) {
                    this.answerClick(false,'text');
                    this.tabCutOk(true);
                }
                if (this.value.text.flag && this.value.text.flag == 1) {
                    this.answerClick(false,'pic');
                    this.editUrlImg = 'data:image/' + this.value.text.valuePic.split('.')[1] + ';base64,' + this.value.text.fileStream;
                    this.$emit('setEditUrlImg',this.editUrlImg)
                    this.fidPic = this.value.text.valuePic;
                    this.picAnswer = this.value.text.valuePic;
                    const obj = {
                        uid: '-1',
                        name: 'image.png',
                        status: 'done',
                        url:this.editUrlImg,
                        fid:this.fidPic
                    }
                    this.fileList.push(obj)
                    this.tabCutOk(true)
                }else if(this.value.text.flag && this.value.text.flag == 2) {
                    this.answerClick(false,'vio');
                    this.fidVio = this.value.text.valueVio;
                    this.fileNameVio = this.value.text.valueVio.split("%")[1];
                    this.fileSizeVio = this.value.text.file_size;
                    this.vioAnswer = this.value.text.valueVio;
                    this.isSuccess = true;
                    this.tabCutOk(true)
                }
            }
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
        init() {
            this.env = this.$store.state.envInfo.env;
        },
        // 编辑回显时和上传时需要download接口获取视频地址
        async getPicOrVio1(type, uploadId = "") {
            let answerIdCut
            let obj
            if (uploadId == "") {
                answerIdCut = this.answerId.split("%")[0];
                obj = {
                    answer:answerIdCut
                }   
            }else {
                answerIdCut = uploadId.split("%")[0];
                obj = {
                    answer:answerIdCut
                }
            }
            await this.getPicOrVio(obj).then(res => {
                if (res.errno == 0) {
                    if (type == 'pic') {
                        this.editUrlImg = 'data:image/' + res.result[0].file_message + ';base64,' + res.result[0].body;
                        this.$emit('setEditUrlImg',this.editUrlImg)
                        const obj = {
                            uid: '-1',
                            name: 'image.png',
                            status: 'done',
                            url:this.editUrlImg
                        }
                        this.fileList.push(obj);
                        this.picAnswer = this.answerId;
                    }else if (type == 'vio') {
                        this.$emit("setEditUrlVio","");
                        this.editUrlVio = 'data:' + res.result[0].file_message + ';base64,' + res.result[0].body;
                        this.isSuccess = true;
                        // 这里的answerId是回显时列表传过来的,将其赋值给vioAnswer字段,但是上传时就不需要了
                        if (uploadId == "") {
                            this.vioAnswer = this.answerId;
                        }
                        this.fileSizeVio = res.result[0].file_size;
                    }
                }else {
                    this.showErrorNotification("查询失败！", res.errno, res.errorMsg);
                }
            })
        },
        answerClick(isClick,val) {
            if(this.vioUploadStatus != 'uploading') {
                if(!isClick) {
                    this.setAnswerClick(val);
                }else {
                    if(!this.inputDisabled) {
                        this.setAnswerClick(val);
                    }
                }
            }else {
                this.$message.warning("文件正在上传请不要切换!!!")
            }
        },
        setAnswerClick(val) {
            if (val == 'pic') {
                if (this.tabType != 'pic') {
                    this.answerType = '图片'
                    // if(this.tabType == 'text' && this.value.text.value != '') {
                    //     this.deleteConfirmShow = true;
                    // }else if(this.tabType == 'vio' && this.vioAnswer != '') {
                    //     this.deleteConfirmShow = true;
                    // }else {
                    //     this.tabCutOk();
                    // }
                    this.tabCutOk();
                }
            }else if (val == 'vio') {
                if (this.tabType != 'vio') {
                    this.answerType = '视频'
                    // if(this.tabType == 'text' && this.value.text.value != '') {
                    //     this.deleteConfirmShow = true;
                    // }else if(this.tabType == 'pic' && this.picAnswer != '') {
                    //     this.deleteConfirmShow = true;
                    // }else {
                    //     this.tabCutOk();
                    // }
                    this.tabCutOk();
                }
            }else {
                if (this.tabType != 'text') {
                    this.answerType = '文本'
                    // if(this.tabType == 'vio' && this.vioAnswer != '') {
                    //     this.deleteConfirmShow = true;
                    // }else if(this.tabType == 'pic' && this.picAnswer != '') {
                    //     this.deleteConfirmShow = true;
                    // }else {
                    //     this.tabCutOk();
                    // }
                    this.tabCutOk();
                }
            }
        },
        // deleteCancel() {
        //     this.deleteConfirmShow = false
        // },
        tabCutOk(isCreate = false) {
            this.deleteConfirmShow = false
            let tab
            if (this.answerType == '图片') {
                this.tabType = 'pic'
                if (this.picAnswer != "") {
                    this.validateText(true,false);
                    this.$set(this.value.text,'flag',1)
                }else {
                    this.validateText(false,false);
                }
                tab = document.querySelector('.pic' + this.value.key);
                const siCard = document.querySelector('.ant-upload-list-picture-card-container');
                if (this.isErrorImg && siCard) {
                    this.$nextTick(()=>{
                        siCard.style.display = 'none'
                    })
                }
                tab.style.color = 'rgb(51, 125, 255)'
                const a = [];
                const siblings = function (me) {
                    const p = me.parentNode.children;
                    for (let i = 0;i<p.length;i++) {
                        if (p[i] !== me) {
                            a.push(p[i])
                        }
                    }
                }
                siblings(tab)
                a.forEach(item=>{
                    item.style.color = '#333333'
                })
                // this.fileListTwo = [];
            }else if (this.answerType == '视频') {
                this.tabType = 'vio'
                if (this.vioAnswer != "") {
                    this.validateText(true,false);
                    this.$set(this.value.text,'flag',2)
                }else {
                    this.validateText(false,false);
                }
                tab = document.querySelector('.vio' + this.value.key);
                const isCard = document.querySelector('.ant-upload-list-picture-card-container');
                if (this.isErrorVio && isCard) {
                    this.$nextTick(()=>{
                        isCard.style.display = 'none'
                    })
                }
                tab.style.color = 'rgb(51, 125, 255)'
                const a = [];
                const siblings = function (me) {
                    const p = me.parentNode.children;
                    for (let i = 0;i<p.length;i++) {
                        if (p[i] !== me) {
                            a.push(p[i])
                        }
                    }
                }
                siblings(tab)
                a.forEach(item=>{
                    item.style.color = '#333333'
                })
                // this.fileList = [];
            }else {
                // this.validateAnswer();
                if (this.value.text.value != "" && !isCreate) {
                    this.validateText(true,false);
                }else if(!isCreate) {
                    this.validateText(false,false);
                }
                this.$set(this.value.text,'flag',0);

                tab = document.querySelector('.text' + this.value.key)
                this.tabType = 'text'
                tab.style.color = 'rgb(51, 125, 255)'
                const a = [];
                const siblings = function (me) {
                    const p = me.parentNode.children;
                    for (let i = 0;i<p.length;i++) {
                        if (p[i] !== me) {
                            a.push(p[i])
                        }
                    }
                }
                siblings(tab)
                a.forEach(item=>{
                    item.style.color = '#333333'
                })
            }
            
        },
        setConfirm() {
            this.deleteConfirmShow = false;
            const Flag = this.tabType;
            if (Flag == 'text') {
                if (this.fidVio != "") {
                    this.deleteConfirmShow = true;
                }
                if (this.fidPic != "") {
                    this.deleteConfirmShow = true;
                }
            }else if(Flag == 'pic') {
                if (this.fidVio != "") {
                    this.deleteConfirmShow = true;
                }
                if(this.value.text.value) {
                    this.deleteConfirmShow = true;
                }
            }else if(Flag == 'vio') {
                if (this.fidPic != "") {
                    this.deleteConfirmShow = true;
                }else if (this.fileList.length > 0) {
                    this.deleteConfirmShow = true;
                }
                if(this.value.text.value) {
                    this.deleteConfirmShow = true;
                }
            }
        },
        // 保存时处理要删除的垃圾文件
        // 删除视频和图片的项是在点击重新上传以及删除按钮时获取的,在保存时根据tab状态进行删除
        delFileDispose() {
            const Flag = this.tabType;
            if (Flag == 'text') {
                if (this.fidVio != "") {
                    const vioAnswerCut = this.fidVio.split("%")[0];
                    this.$store.commit('guideDialog/setDelList',vioAnswerCut);
                }
                if (this.fidPic != "") {
                    const picAnswerCut = this.fidPic.split("%")[0];
                    this.$store.commit('guideDialog/setDelList',picAnswerCut);
                }
            }else if(Flag == 'pic') {
                if (this.fidVio != "") {
                    this.$store.commit('guideDialog/setDelList',this.fidVio.split("%")[0]);
                }
            }else if(Flag == 'vio') {
                if (this.fidPic != "") {
                    this.$store.commit('guideDialog/setDelList',this.fidPic.split("%")[0]);
                }else if (this.fileList.length > 0) {
                    this.$store.commit('guideDialog/setDelList',this.fileList[0].response.result.result_success.success_list[0].split("%")[0]);
                }
            }
        },
        // 删除垃圾视频和图片
        // delPicOrVio() {
        //     const delList = this.$store.state.guideDialog.delList.join("");
        //     const answer = {
        //         answer: delList
        //     }
        //     if (answer.answer != "") {
        //         this.delVio(answer).then(res => {
        //             if (res.errno == 200) {
        //                 // this.picAnswer = "";
        //             }else {
        //                 this.$notification.open({
        //                     message: "删除失败!",
        //                     description: res.errorMsg,
        //                     icon: 
        //                           <jt-icon
        //                               type= "exclamation-circle"
        //                               theme= "filled"
        //                               style= "color:#F04134"
        //                           />
        //                 })
        //             }
        //         })
        //     }
        // },
        //验证答案
        validateText(vioOrPicStatus = false,isDel = false) {
            if (this.tabType == 'text') {
                let response1 = ''
                if(this.value.text.value){
                    response1 = judgeSensitiveWord(this.value.text.value);
                }
                if(this.value.text.flag == 0 && this.value.text.value.match(/^[ ]*$/)){
                    this.value.text.isValidate = true;
                    this.value.text.isValidateMsg = '答案不能为空';
                }
                else if(this.value.text.value.length>2000){
                    this.value.text.isValidate = true;
                    this.value.text.isValidateMsg = '超出字数限制,最多2000字'
                }else if (this.value.text.flag == 0 && !response1.detectedResult) {
                    this.value.text.isValidate = true;
                    this.value.text.isValidateMsg = response1.errorMsg
                }else{
                    this.value.text.isValidate = false;
                    this.value.text.isValidateMsg = '';
                    // const input = 'input_' + this.value.key;
                    this.$emit('setAnswerValidate',true,this.value);
                    this.$emit('validateGuideAndAnswer', this.value);
                }
                const textarea = 'textarea' + this.value.key
                if (this.value.text.isValidate) {
                    document.getElementById(textarea).style.borderColor = "#F04134";
                } else {
                    document.getElementById(textarea).style.borderColor = "";
                }
                if(this.value.text.isValidate) {
                    if(isDel) {
                        this.$emit('setAnswerValidate',true,this.value);
                    }else {
                        this.$emit('setAnswerValidate',false,this.value);
                    }
                }
                // this.canClick(this.treeData);
            }else {
                if (vioOrPicStatus == false) {
                    this.value.text.isValidate = true;
                    this.value.text.isValidateMsg = '答案不能为空';
                    this.$emit('setAnswerValidate',false,this.value);
                }else {
                    this.value.text.isValidate = false;
                    this.value.text.isValidateMsg = '';
                    this.$emit('setAnswerValidate',true,this.value);
                }
            }
        },
        // validateAnswer() {
        //     this.$nextTick(() => {
        //         if (this.tabType == 'text') {
        //             this.validate.answer = true;
        //             if (this.answer.length  === 0) {
        //                 this.inputError.answer = "请输入答案";
        //                 this.validate.answer = false;
        //             } else if (this.answer.trim() == "") {
        //                 this.inputError.answer = "答案内容不能为空格";
        //                 this.validate.answer = false;
        //             } else if (this.answer.length > 2000) {
        //                 this.inputError.answer = "不可超过2000字";
        //                 this.validate.answer = false;
        //             }
        //             if (this.validate.answer === true) {
        //                 const response = judgeSensitiveWord(this.answer);
        //                 if (!response.detectedResult) {
        //                     this.validate.answer = false;
        //                     this.inputError.answer = response.errorMsg;
        //                 }
        //             }
        //             if (this.validate.answer === true) {
        //                 const response = judgeSpecialCharacters(this.answer);
        //                 if (!response.detectedResult) {
        //                     this.validate.answer = false;
        //                     this.inputError.answer = response.errorMsg;
        //                 }
        //             }
        //             if (this.validate.answer === false) {
        //                 if (document.getElementById("inputAnswer")) {
        //                     document.getElementById("inputAnswer").style.borderColor = "#F04134";
        //                 }
                            
        //             } else {
        //                 if (document.getElementById("inputAnswer")) {
        //                     document.getElementById("inputAnswer").style.borderColor = "";
        //                 }
        //             }
        //         }
        //     })
            
        // },
        afterClose() {
            const vio = document.querySelector('#multimedia'+this.value.key);
            vio.pause();
        }
    }
}
</script>

<style lang='less' scoped>
@import "~@/assets/style/var.less";
.title {
  font-size: 16px;
  font-family: "PingFangSC-Medium,PingFang SC";
  font-weight: 500;
  color: #333333;
  line-height: 22px;
}
.title-icon {
  color: @jt-color-text-secondary;
}
.inputLabel {
  min-width: 170px;
  text-align: right;
  color: #333333;
  margin-top: 7px;
  margin-right: 16px;
}
.inputLabel2 {
  text-align: right;
  color: #333333;
  margin-top: 7px;
  margin-right: 16px;
}
.answerInput {
    width: 440px;
    height: 218px;
    position: relative;
    margin-top: 8px;
    overflow: hidden;
    textarea {
        width: 100%;
        height: 216px;
        resize: none;
        padding: 8px;
        display: block;
        white-space: pre-wrap;
    }
    p:hover {
        color: #5c9dff;
    }
}
.dele {
    cursor: pointer;
    position: absolute;
    right: 8px;
    top: 0px;
    color: @jt-color-text-secondary;
    user-select: none;
    &.error {
        span {
            color: @jt-color-error;
        }
    }
}
.answerDivider {
    margin-left: 16px;
    margin-right: 16px;
    margin-top: -4px;
    height: 12px;
}
.answerTabText {
    font-size: 12px;
    position: relative;
    bottom: 2px;
    cursor: pointer;
}
.answerTabIcon {
    font-size: 16px;
    margin-right: 3px;
    cursor: pointer;
}
.answerTabIconPort {
    font-size: 16px;
    margin-right: 3px;
    cursor: pointer;
    color: #BBBBBB;
}
.answerTabTextPort {
    font-size: 12px;
    position: relative;
    bottom: 2px;
    color: #BBBBBB;
    cursor: pointer;
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
// 上传
/* you can make up upload button and sample style by using stylesheets */
.uploadBox {
    width: 200px;
    height: 200px;
    .icon {
        color: #555;
        margin-top: 40px;
        font-size: 40px;
        transition: 0.3s;
    }
    .ant-upload-select-picture-card i {
        font-size: 32px;
        color: #999;
    }

    .ant-upload-select-picture-card .ant-upload-text {
        margin-top: 8px;
        color: #666;
    }
    .ant-upload-text-top {
        font-size: 14px;
        font-weight: 700;
        margin-top: 20px;
    }
    .ant-upload-text-center {
        margin-top: 10px;
    }
    .ant-upload-text-bot {

    }   
}
.uploadBox:hover .icon {
    color:rgb(51, 125, 255);
    transition: 0.3s;
}
.uploadBoxVio {
    width: 411px;
    height: 200px;
    .icon {
        color: #555;
        margin-top: 40px;
        font-size: 40px;
        transition: 0.3s;
    }
    .ant-upload-text-top {
        font-size: 14px;
        font-weight: 700;
        margin-top: 16px;
    }
    .ant-upload-text-center {
        margin-top: 6px;
    }
    .ant-upload-text-bot {

    }
    
}
.uploadBoxVio:hover .icon{
    color: rgb(51, 125, 255);
    transition: 0.3s;
}
.errorpic {
    width: 200px;
    height: 200px;
    background-color: #eee;
    z-index: 500;
    text-align: center;
    .file {
        font-size: 40px;
        margin-top: 50px;
        color: #666;
    }
    .txt {
        margin-top:10px;
    }
    .close {
        margin-top: 30px;
        // margin-right: 16px;
        color: #666;
        cursor: pointer;
    }
    .redo {
      cursor: pointer;  
    }
    .close:hover {
        color: #000;
    }
    .redo:hover {
        color: #000;
    }
}
.errorVio:hover {
    border-color:  rgb(51, 125, 255);
    transition: 0.3s;
}
.errorVio {
  position: absolute;
  top: 0px;
  left: 0px;
  width: 430px;
  height: 218px;
  background-color: #fafafa;
  z-index: 10;
  text-align: center;
  overflow: hidden;
  border: 1px dashed #d9d9d9;
  transition: 0.3s;
  .file {
    font-size: 40px;
    margin-top: 60px;
    color: #666;
  }
  .txtVioTop {
    margin-top:10px;
  }
  .txtVipBto {
    margin-top:2px;
  }
  .close {
    margin: 10px 0px 0px 8px;
    color: #666;
    cursor: pointer;
  }
  .redo {
    cursor: pointer;  
  }
  .close:hover {
    color: #000;
  }
  .redo:hover {
    color: #000;
  }
  .aginUpload {
      position: absolute;
      bottom: 0px;
      left: 0px;
      width: 100%;
      .aginBtn {
          width:100%;
          border-color:#ccc;
          z-index: 500;
      }
      .aginBtn:hover {
          border-color:#3395eb;
      }
  }
}
.upLoadingPic {
  /deep/.ant-upload-list-picture-card-container {
    width: 200px;
    height: 200px;
  }
  /deep/.ant-upload-list-item {
    width: 200px;
    height: 200px;
  }
}
.upLoadingVio {
  // 改变上传视频组件默认样式
  /deep/.ant-upload-list-picture-card-container {
    width: 430px;
    height: 216px;
  }
  // 改变上传视频组件默认样式
  /deep/.ant-upload-list-item {
    width: 430px;
    height: 216px;
  }
  // 隐藏上传视频组件默认样式
  /deep/.ant-upload-list-picture-card .ant-upload-list-item-uploading-text {
      display: none;
  }
  // 改变上传视频组件默认样式
  /deep/.ant-upload-list-picture-card .ant-upload-list-item-progress {
      bottom: 9px;
  }
}
.delUploadVio /deep/.ant-modal-footer {
    border-top: none;
}
</style>