<template>
    <div class="box">
        <div style="margin-top: 64px;" v-show="type == 'questionAnswer'">
            <span class="title" v-show="env === 'test'">编辑答案</span>
            <span class="title" v-show="env !== 'test'">答案详情</span>
        </div>
        <div style="display: flex; flex-flow: row; margin-top: 32px;">
            <div :class="type == 'questionAnswer'?'inputLabel':'inputLabel2'" style="margin-top: 40px;">
                <span style="color: #F04134; margin-right: 4px;">*</span><span>答案</span>
            </div>
            <div style="display: flex; flex-flow: column;">
                <div>
                    <span @click="answerClick(true,'text')" class='text'>
                        <span class="iconfont iconwenben" style="font-size: 16px; margin-right: 3px;cursor: pointer;" />
                        <span style="font-size: 12px; position: relative; bottom: 2px;cursor: pointer;">文本</span>
                        <jt-divider type="vertical" class="answerDivider" />
                    </span>
                    <span @click="answerClick(true,'pic')" class="pic">
                        <span class="iconfont icontupian answerTabIcon" />
                        <span class="answerTabText">图片</span>
                        <jt-divider type="vertical" class="answerDivider" />
                    </span>
                    <span @click="answerClick(true,'vio')" class="vio">
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
                <div class="answerInput">
                    <jt-input
                        id="inputAnswer"
                        type="textarea"
                        v-model="answer"
                        class="inputArea"
                        placeholder="请输入2000字以内的答案"
                        :disabled="inputDisabled"
                        @blur="validateAnswer()"
                        @change="validateAnswer()"
                        v-if="tabType == 'text' && type == 'questionAnswer'"
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
                        @change="handleChange"
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
                        accept=".mp4"
                        :file-list="fileListTwo"
                        name="uploadfile"
                        :beforeUpload="beforeUploadVio"
                        :disabled="inputDisabled"
                        @change="handleChange"
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
                        <div class="txtVipBto">{{fileSizeVio+'MB'}}</div>
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
                        <!-- <jt-icon type="redo" class="redo" /> -->
                    </div>
                </div>
                <span v-show="env === 'test' && !validate.answer" class="errorTip">{{inputError.answer}}</span>
            </div>
        </div>
        <!-- 切换弹窗 -->
        <jt-modal
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
        </jt-modal>
        <!-- 视频重新上传确认框 -->
        <jt-modal
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
        </jt-modal>
        <jt-modal 
            v-model="previewVisible" 
            :bodyStyle="{padding: '0px'}"
            centered
            :footer="null" 
            @cancel="handleCancel"
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
        <!-- 查看视频弹窗 -->
        <jt-modal
            :closable="true"
            :footer="null"
            centered
            v-model="vioDialog"
            :afterClose="afterClose"
            :bodyStyle="{padding: '0px'}"
            width="1000px"
            class="vioModal"
            v-dialogDrag
        >
            <div class="titleMoal">点此拖拽</div>
            <video id="multimedia" controls :src="editUrlVio" style="width:100%;height:500px"></video>
        </jt-modal>
    </div>
</template>

<script>
import { mixin } from '@/views/mixins/uploadFile.js';
// import { judgeSensitiveWord } from "@/utils/common.ts";
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
        type:{
            request:true,
            type:String
        },
        answerId: {
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
        input:{
            immediate:true,
            handler: function(newV) {
                if (newV && this.tabType == 'text' && this.value.flag == 0) {
                    this.answer = newV
                }
            }
        },
        answer: {
            handler: function(newV) {
                this.$emit('handleChangeInputAnswer', newV)
            }
        },
        'validate.answer': function (newV) {
            this.$emit("setValidate",newV)
        }
    },
    data() {
        return {
            env:"",
            answer:"",
            answerObj:"",
            validate:{
                answer:false
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
            delList:[],
            vioUploadStatus: ''
        }
    },
    created() {
        this.init();
    },
    mounted() {
        // this.uploadImg().then(res=>{
        //     console.log('调用')
        // }).catch(error =>{
        //     console.log('错误')
        // })
    },
    methods:{
        ...mapActions({
            // uploadImg: "uploadFile/uploadImg",
            getPicOrVio: "questionAnswer/getPicOrVio",
            delVio: "questionAnswer/delVio"
        }),
        // 引导式对话页面双向绑定
        handleChangeInput(event) {
            this.$emit('change', event)
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
        getPicOrVio1(type, uploadId = "") {
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
            this.getPicOrVio(obj).then(res => {
                if (res.errno == 0) {
                    if (type == 'pic') {
                        this.editUrlImg = 'data:' + res.result[0].file_message + ';base64,' + res.result[0].body;
                        const obj = {
                            uid: '-1',
                            name: 'image.png',
                            status: 'done',
                            url:this.editUrlImg
                        }
                        this.fileList.push(obj);
                        this.picAnswer = this.answerId;
                        this.answerClick(false,'pic')
                        this.tabType = 'pic'
                    }else if (type == 'vio') {
                        this.editUrlVio ='data:' + res.result[0].file_message + ';base64,' + res.result[0].body;
                        this.isSuccess = true;
                        // 这里的answerId是回显时列表传过来的,将其赋值给vioAnswer字段,但是上传时就不需要了
                        if (uploadId == "") {
                            this.vioAnswer = this.answerId;
                        }
                        this.fileSizeVio = res.result[0].file_size;
                        this.answerClick(false,'vio')
                        this.tabType = 'vio'
                    }
                    this.tabCutOk()
                }else {
                    this.showErrorNotification("查询失败！", res.errno, res.errorMsg);
                }
            })
        },
        answerClick(isClick,val) {
            if(this.vioUploadStatus != "uploading") {
                if(!isClick) {
                    this.setAnswerClick(val);
                }else {
                    if(!this.inputDisabled) {
                        this.setAnswerClick(val);
                    }
                }
            }else {
                this.$message.warning('文件正在上传请不要切换!!!');
            }
        },
        setAnswerClick(val) {
            if (val == 'pic') {
                if (this.tabType != 'pic') {
                    this.answerType = '图片';
                    // if(this.tabType == 'text' && this.answer != '') {
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
                    this.answerType = '视频';
                    // if(this.tabType == 'text' && this.answer != '') {
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
                    this.answerType = '文本';
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
        deleteCancel() {
            this.deleteConfirmShow = false
        },
        tabCutOk() {
            this.deleteConfirmShow = false
            let tab
            if (this.answerType == '图片') {
                if (this.picAnswer != "") {
                    this.validate.answer = true;
                }else {
                    this.validate.answer = false;
                }
                tab = document.querySelector('.pic')
                this.tabType = 'pic'
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
            }else if (this.answerType == '视频') {
                if (this.vioAnswer != "") {
                    this.validate.answer = true;
                }else {
                    this.validate.answer = false;
                }
                tab = document.querySelector('.vio');
                this.tabType = 'vio';
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
            }else {
                this.validateAnswer();
                tab = document.querySelector('.text')
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
        validateAnswer() {
            this.$nextTick(() => {
                if (this.tabType == 'text') {
                    this.validate.answer = true;
                    if (this.answer.length  === 0) {
                        this.inputError.answer = "请输入答案";
                        this.validate.answer = false;
                    } else if (this.answer.trim() == "") {
                        this.inputError.answer = "答案内容不能为空格";
                        this.validate.answer = false;
                    } else if (this.answer.length > 2000) {
                        // this.inputError.answer = "不可超过2000字";
                        // this.validate.answer = false;
                    }
                    // if (this.validate.answer === true) {
                    //     const response = judgeSensitiveWord(this.answer);
                    //     if (!response.detectedResult) {
                    //         this.validate.answer = false;
                    //         this.inputError.answer = response.errorMsg;
                    //     }
                    // }
                    if (this.validate.answer === false) {
                        if (document.getElementById("inputAnswer")) {
                            document.getElementById("inputAnswer").style.borderColor = "#F04134";
                        }
                            
                    } else {
                        if (document.getElementById("inputAnswer")) {
                            document.getElementById("inputAnswer").style.borderColor = "";
                        }
                    }
                }
            })
        },
        afterClose() {
            const vio = document.querySelector('#multimedia');
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
.text {
    color:rgb(51, 125, 255)
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
.answerTabTextPort {
    font-size: 12px;
    position: relative;
    bottom: 2px;
    color: #BBBBBB;
    cursor: pointer;
}
.answerTabIconPort {
    font-size: 16px;
    margin-right: 3px;
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
        margin-top: 70px;
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