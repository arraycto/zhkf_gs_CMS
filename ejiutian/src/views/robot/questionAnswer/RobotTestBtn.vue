<template>
    <div id="componentBody">
        <jt-button @click="showDrawer" style="width: 72px; height: 24px; padding: 0px 15px;">测试</jt-button>
        <jt-drawer
            title="机器人测试"
            :width="560"
            :drawerStyle="{
                background: '#EFF1F4'
            }"
            :headerStyle="{
                paddingTop: '14px',
                background: '#EFF1F4',
                height: '50px',
                fontSize: '16px',
                fontFamily: 'PingFangSC-Medium,PingFang SC',
                fontWeight: '500',
                color: '#333333',
                lineHeight: '22px',
                textAlign: 'center'
            }"
            @close="onClose"
            :visible="visible"
            :bodyStyle="{
                background: '#EFF1F4',
                padding: '0',
                borderTop: '1px solid #D9D9D9',
                height: 'calc(100% - 50px)'
            }"
        >
            <div class="drawerBody">
                <div class="bodyDialog divScroll">
                    <div v-for="(msg,index) in msgList" :key="index">
                        <div class="robotMsg" v-if="msg.type === 'robot' && msg.flag == 0" :class="{'isClick':msg.isClick}"
                             v-html='msg.msg' @click="hotClick"></div>
                        <div style="clear:both"></div>
                        <div class="robotMsgPic" v-if="msg.type === 'robot' && msg.flag == 1" v-html="msg.pic" @click="picClick($event,msg,index)"></div>
                        <div style="clear:both"></div>
                        <div class="robotMsgMdVio" v-if="msg.type === 'robot' && msg.flag == 2" v-html="msg.pic" @click="vioClick($event,msg,index)"></div>
                        <div style="clear:both"></div>
                        <div class="userMsg" v-if="msg.type === 'user' ">{{ msg.msg }}</div>
                        <div style="clear:both"></div>
                    </div>
                </div>
                <div class="bodyInput">
                    <jt-button style="width: 88px; height: 32px; padding-left: 10px;"  @click="reset">
                        <span class="icon iconfont iconshuaxin"></span>
                        <span style="margin-left: 5px;">重置对话</span>
                    </jt-button>
                    <jt-input-textarea class="inputArea" placeholder="在此体验技能，按enter键可直接发送" v-model="inputContent" @keydown.enter="pressEnter($event)" />
                </div>
            </div>
        </jt-drawer>
        <!-- 查看图片弹窗 -->
        <jt-modal
            :closable="true"
            :footer="null"
            centered
            v-model="dialogPic"
            :bodyStyle="{padding: '0px'}"
            class="examine"
            height='fit-content'
        >
            <div class="titleMoal">点此拖拽</div>
            <img :src="picSrc" style="width:100%;min-height:56px" />
        </jt-modal>
    </div>
</template>
<style>
.ant-drawer-title {
    text-align: left!important;
}
.ant-drawer-close {
    width: 50px;
    height: 50px;
    line-height: 50px;
}
</style>
<style lang="less" scoped>
@import "~@/assets/style/var.less";
#componentBody {
    margin-top: 8px;
    margin-left: 62px;
}
.drawerBody {
    overflow: hidden;
    width: 560px;
    height: 100%;
    display: flex;
    flex-flow: column;
}
.divScroll::-webkit-scrollbar {
    width: 6px;
}
.divScroll::-webkit-scrollbar-thumb {
    border-radius: 3px;
    background: #D9D9D9;
    opacity: 0.2;
}
.divScroll::-webkit-scrollbar-track {
    background: transparent;
}
.bodyDialog {
    width: 100%;
    height: calc(100% - 200px);
    border-bottom: 1px solid #D9D9D9;
    padding: 20px 20px 20px 20px;
    // display: flex;
    // flex-flow: column;
    overflow: auto;
}
.bodyInput {
    width: 100%;
    height: 200px;
    padding-left: 21px;
    padding-right: 21px;
    padding-top: 8px;
}
.inputArea {
    resize: none;
    margin-top: 9px;
    max-height: 120px;
    min-height: 120px;
    overflow: auto;
    background: transparent;
    border-style: none;
    font-size: 12px;
    font-weight: 400;
    color: #555555;
    line-height: 18px;
    padding: 0;
    border-style: none;
    box-shadow: none;
}
.robotMsg {
    float: left;
    width: fit-content;
    max-width: 344px;
    background: #FFFFFF;
    border-radius: 0px 24px 24px 24px;
    padding: 13px 16px 13px 16px;
    font-size: 12px;
    font-family: PingFangSC-Regular,PingFang SC;
    font-weight: 400;
    color: #333333;
    line-height: 18px;
    margin-bottom: 16px;
}
.robotMsgPic {
    position: relative;
    float: left;
    width: fit-content;
    height: fit-content;
    max-width: 344px;
    line-height: 100px;
    text-align: center;
    background: #FFFFFF;
    border-radius: 24px;
    margin-bottom: 16px;
    // overflow: hidden;
}
.robotMsgMdVio {
    position: relative;
    float: left;
    width: fit-content;
    height: 300px;
    max-width: 344px;
    border-radius: 24px;
    margin-bottom: 16px;
    // overflow: hidden;
    background-color: #000;
}
.isClick {
    white-space: pre;
}
.userMsg {
    float: right;
    width: fit-content;
    max-width: 344px;
    background: #C7DBFF;
    border-radius: 24px 0px 24px 24px;
    padding: 13px 16px 13px 16px;
    font-size: 12px;
    font-family: PingFangSC-Regular,PingFang SC;
    font-weight: 400;
    color: #333333;
    line-height: 18px;
    margin-bottom: 16px;
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
</style>

<script>
import { axiosGet, axiosPost, axiosPut, axiosDelete } from "../../../utils/http.js";
import API from '../../../constant/api';
import { getRandomNum } from "@/utils/common";
export default {
    name: "RobotTestBtn",
    data() {
        return {
            inputContent: "",
            msgList: [
            ],
            form: this.$form.createForm(this),
            visible: false,
            picSrc:'',
            dialogPic:false
        };
    },
    methods: {
        reset() {
            this.msgList = []
            const roborMsg = {
                type: 'robot',
                msg: 'session_start'
            };
            this.getAnswer(roborMsg)
        },
        showDrawer() {
            this.msgList = []
            this.visible = true;
            const roborMsg = {
                type: 'robot',
                msg: 'session_start'
            };
            this.getAnswer(roborMsg)
        },

        onClose() {
            this.visible = false;
            if (document.querySelector('#multimedia')) {
                const Vio = document.querySelector('#multimedia');
                Vio.pause();
            }
        },
        pressEnter(e,again='') {
            if(e!='') {
                if(!this.inputContent.match(/^[ ]*$/)){
                    const userMsg = {
                        type: 'user',
                        msg: this.inputContent
                    };
                    this.getAnswer(userMsg)
                }
                e.preventDefault()
            }else if(e == '' && again != '') {
                const userMsg = {
                    type: 'user',
                    msg: again
                };
                this.getAnswer(userMsg)
            }
            
        },
        hotClick(e) {
            if(e.target.nodeName == 'A'){
                const userMsg = {
                    type: 'user',
                    msg: e.target.innerText
                };
                this.getAnswer(userMsg)
            }
        },
        picClick(e,val,index) {
            if(!val.isError) {
                this.picSrc = val.imgSrc;
                this.dialogPic = true;
            }else {
                if(e.target.id == 'error') {
                    this.msgList.splice(index,1);
                    const txt = this.msgList.splice(index-1,1);
                    this.pressEnter('',txt[0].msg);
                }
            }
        },
        vioClick(e,val,index) {
            if(e.target.id == 'error') {
                this.msgList.splice(index,1);
                const txt = this.msgList.splice(index-1,1);
                this.pressEnter('',txt[0].msg);
            }
        },
        getAnswer(question) {
            this.$store.commit('showLoading', {}, { root: true })
            let url = '';
            const userId = getRandomNum(this.userId);
            this.env = this.$store.state.envInfo.env;
            const params = {
                "botid": getRandomNum(this.robotId) ,
                'uid': userId,
                'vid': this.userId,
                "q": question.msg,
                "_t": new Date().valueOf()
            };
            if (this.env === "test") {
                url = API.port8085.dialogUrl;
            }else {
                url = API.port8085.dialogUrlPro;
            }
            const headers = {
                'userid': userId
            }
            const robotMsg = {};
            if(question.msg != 'session_start'){
                this.msgList.push(question);
                this.inputContent = '';
            }
            axiosGet(url, params, null, headers).then((res)=>{
                setTimeout(() => {
                    this.$store.commit('hideLoading', {}, { root: true })
                },100)
                if (res.a.length>0 && res.a[0].flag !== undefined && res.a[0].flag == "0") {
                    if(res && res.a.length > 0 && res.a[0].a){
                        robotMsg.type = 'robot'
                        robotMsg.msg = res.a[0].a.replace(/\n\r/g,'<br/>').replace(/\n/g,'<br/>'),
                        robotMsg.flag = res.a[0].flag
                    }
                    this.$nextTick(() => {
                        if(question.msg == 'session_start'){
                            if(robotMsg.msg){
                                const robotMsgList = robotMsg.msg.split('^A');
                                if(robotMsgList[0]){
                                    const welcome = {
                                        type: 'robot',
                                        msg: robotMsgList[0],
                                        flag: res.a[0].flag
                                    }
                                    this.msgList.push(welcome);
                                }
                                if(robotMsgList[1]){
                                    const hotIssue = {
                                        type: 'robot',
                                        msg: '您是否遇到以下问题了呢?',
                                        isClick: 'true',
                                        flag: res.a[0].flag
                                    }
                                    robotMsgList.map((item,index,arr)=>{
                                        if(item && index!=0){
                                            hotIssue.msg = hotIssue.msg + '\r\n' + `<a class='hot-issue' style='color: #337DFF'>${item}</a>`
                                        }
                                    })
                                    this.msgList.push(hotIssue);
                                }
                            }
                        }else{
                            this.msgList.push(robotMsg);
                            this.setMayKnow(res);
                        }
                    })
                }else if(res.a.length>0 && res.a[0].flag !== undefined && (res.a[0].flag == "1" || res.a[0].flag == "2")) {
                    if (res.a[0].flag == "1") {
                        const imgSrc ='data:' +  res.a[0].a[0].file_message + ';base64,' + res.a[0].a[0].body;
                        let pic;
                        let isError;
                        if (res.a[0].a[0].body == "") {
                            // <img src='${imgSrc}' style="width:100%;height:200px;border-radius:24px;">
                            pic = `<div class="iconfont icontupian" style="width:200px;height:100px;border-radius:24px;font-size:40px"></div>
                                <span class="iconfont icontishi-tianchong" id="error" style="width:50px;height:50px;color:red;position:absolute;top:0px;right:-36px;font-size:22px"></span>
                            `
                            isError = true;
                        }else {
                            pic = `<img src='${imgSrc}'  style="min-width:100px;max-width:280px;border-radius:24px;cursor:pointer" title="点击查看">`
                            isError = false;
                        }
                        
                        const obj = {
                            pic,
                            isError,
                            imgSrc,
                            type: 'robot' ,
                            flag: res.a[0].flag
                        }
                        this.msgList.push(obj)
                        // this.msgList.push(robotMsg);
                        // 插入您可能还知道对话
                        this.setMayKnow(res);
                    }else if (res.a[0].flag == "2") {
                        const VioSrc ='data:' +  res.a[0].a[0].file_message + ';base64,' + res.a[0].a[0].body;
                        let pic;
                        let isError;
                        if (res.a[0].a[0].body == "") {
                            pic = `<video controls src="${VioSrc}" width="200px" style="max-width: 344px;height: 300px;border-radius: 24px;"></video>
                                   <span class="iconfont icontishi-tianchong" id="error" style="width:50px;height:50px;color:red;position:absolute;top:50%;transform:translateY(-50%);font-size:22px"></span>
                            `
                            isError = true;
                        }else {
                            pic = `<video id="multimedia" controls src="${VioSrc}" width="fit-content" style="max-width: 344px;height: 300px;border-radius: 24px;"></video>`
                            isError = false;
                        }
                        const obj = {
                            pic: pic,
                            isError,
                            type: 'robot' ,
                            flag: res.a[0].flag
                        }
                        this.msgList.push(obj)
                        this.setMayKnow(res);
                    }
                    
                }
                setTimeout(function(){ 
                    const div = document.getElementsByClassName('divScroll');
                    div[0].scrollTop = div[0].scrollHeight;
                }, 0);
            }).catch((error) => {
                this.$store.commit('hideLoading', {}, { root: true })
                this.showErrorNotification('查询失败！','系统繁忙,请稍后再试')
            });
        },
        // 插入您可能还知道对话
        setMayKnow(res) {
            this.inputContent = '';
            const robotMsgList = res.suggest
            if(robotMsgList.length > 0) {
                const hotIssue = {
                    type: 'robot',
                    msg: '您可能还想知道:',
                    isClick: 'true',
                    flag: "0"
                }
                robotMsgList.map((item,index,arr)=>{
                    if(index<5){
                        hotIssue.msg = hotIssue.msg + '\r\n' + `<a class='hot-issue' style='color: #337DFF'>${item}</a>`
                    }
                })
                this.msgList.push(hotIssue);
            }
        },
        showErrorNotification(title, content) {
            this.$notification.open({
                message: title,
                description: "失败原因：" + content,
                icon: (<jt-icon type="exclamation-circle" theme="filled" style="color:#F04134"/>),
                duration: 0
            });
        },
    },
    computed: {
        userId() {
            return this.$store.state.userId
        },
        robotId() {
            return this.$store.state.robotInfo.robotId
        }

    }
};
</script>
