<template>
    <div class="contentBody">
        <div style="width: auto;height: 32px;">
            <h1 class="h1">预置技能</h1>
            <!-- <jt-button  class="exportBtn">切换状态</jt-button> -->
            <jt-button class="top-button" size="large"  type="primary"  @click="showDrawer" v-show = "this.$store.state.envInfo.env == 'test'">
                <jt-icon type="plus" :style="{ marginRight:'2px',width:'16px',height:'16px' }"/> 添加预置技能
            </jt-button>
        </div>

        
        <div class="table-type-3" v-if="showcard.joke==0&&showcard.idioms==0&&showcard.geo==0&&showcard.weather==0">
            <jt-empty :image="emptyImage" :imageStyle="{ margin:'56px auto auto auto',width:'400px',height:'400px'}">
                <div class="emptyDescriptS" slot="description" style="margin-top:-129px">
                    <p class="emptyDescript">您还没有添加任何预置技能</p>
                    <p v-show = "this.$store.state.envInfo.env == 'test'">您可以点击 <a href="javascript:;" @click="showDrawer">添加预置技能 </a>为机器人添加预置技能</p>
                </div>
            </jt-empty>
        </div>

        <jt-modal
            :closable="false"
            :footer="null"
            centered
            v-model="deleteConfirmShow"
            :bodyStyle="{padding: '0px', height: '160px'}"
            width="360px"
        >
            <div style="padding-top: 32px;">
                <div style="margin-left: 32px;">
                    <jt-icon type="exclamation-circle" theme="filled" style="color: #F04134; font-size: 18px;" />
                    <span style="margin-left: 8px; font-size: 14px; font-weight: 500; color: #333333; line-height: 20px;">确定删除此项预置技能吗？</span>
                </div>
                <div style="margin-top: 8px; margin-left: 58px;">
                    <span style="font-size: 12px; font-weight: 400; color: #555555; line-height: 18px;">删除后可通过添加预置技能重新添加</span>
                </div>
                <div style="margin-top: 30px; margin-left: 180px;">
                    <jt-button style="width: 64px; height: 32px; background: #FFFFFF; border-radius:2px; padding: 7px 18px; font-size: 12px;" size = "large" @click="deleteCancel">取消</jt-button>
                    <jt-button style="margin-left: 8px; width: 64px; height: 32px;border-radius:2px;  padding: 7px 18px;  font-size: 12px;" size="large" type="danger" @click="deleteOk">删除</jt-button>
                    <!-- <jt-button class ="deletebutton" style="margin-left: 8px; width: 64px; height: 32px; background: #FFFFFF; border-radius:2px;  padding: 7px 18px;  font-size: 12px;" @click="deleteOk">删除</jt-button> -->
                </div>
            </div>
        </jt-modal>

        <div>
            <!-- <div class="mid-card-1" @mouseenter="onMouseOver('card_1')" @mouseleave="onMouseout('card_1')" v-show="showcard[0]">
                <div style="margin: 16px 16px 0 17px;">
                    <span><jt-icon type="message" /></span>
                    <span style="
                        margin-left: 10px;
                        font-size: 14px;
                        font-family: PingFangSC-Regular,PingFang SC;
                        font-weight: 400;
                        color: #333333;
                        line-height: 20px;"
                    >闲聊</span>
                    <span class="btn-stop" v-show="false" @click="deleteConfirm" ref="card_1">
                        <span class="iconfont iconfont" style="vertical-align: middle;width: 12px; height: 12.5px;">&#xe62f;</span>
                    </span>
                </div>
                <div style="
                    font-size: 12px;
                    font-family: PingFangSC-Regular,PingFang SC;
                    font-weight: 400;
                    color: #999999;
                    line-height: 18px;
                    width: 220px;
                    height: 36px;
                    margin:8px 31px 16px 17px;"
                >简介：此预置问答将提供闲聊的功能<br>问题示例：跟我聊聊吧</div>
            </div> -->
            <div class="mid-card-2" @mouseenter="onMouseOver('card_2')" @mouseleave="onMouseout('card_2')" v-show="showcard.joke==1">
                <div style="margin: 16px 16px 0 17px;">
                    <!-- <span><jt-icon type="message" /></span> -->
                    <span class="icon iconfont iconxiaohua" style="width: 18px;height: 18px;"></span>
                    <span style="
                        margin-left: 10px;
                        font-size: 14px;
                        font-family: PingFangSC-Regular,PingFang SC;
                        font-weight: 400;
                        color: #333333;
                        line-height: 20px;"
                    >笑话</span>
                    <!-- <span>{{searchPresetskillresult[0].botid}}</span> -->
                    <span class="btn-stop" v-show="false" @click="deleteConfirm('joke')" ref="card_2">
                        <span v-show = "this.$store.state.envInfo.env == 'test'" class="iconfont iconfont" style="vertical-align: middle;width: 12px; height: 12.5px;">&#xe62f;</span>
                    </span>
                </div>
                <div style="
                    font-size: 12px;
                    font-family: PingFangSC-Regular,PingFang SC;
                    font-weight: 400;
                    color: #999999;
                    line-height: 18px;
                    width: 220px;
                    height: 36px;
                    margin:8px 31px 16px 17px;"
                >简介：针对笑话诉求随机返回笑话文本。<br>问题示例：讲一个笑话</div>
                <!-- {{searchPresetskillresult[0].botid}}{{searchPresetskillresult[0].joke}} -->
            </div>
            <div class="mid-card-3" @mouseenter="onMouseOver('card_3')" @mouseleave="onMouseout('card_3')" v-show="showcard.idioms==1">
                <div style="margin: 16px 16px 0 17px;">
                    <span class="icon iconfont iconchengyujielong" style="width: 18px;height: 18px;"></span>
                    <span style="
                        margin-left: 10px;
                        font-size: 14px;
                        font-family: PingFangSC-Regular,PingFang SC;
                        font-weight: 400;
                        color: #333333;
                        line-height: 20px;"
                    >成语问答</span>
                    <span class="btn-stop" v-show="false" @click="deleteConfirm('idioms')" ref="card_3">
                        <span v-show = "this.$store.state.envInfo.env == 'test'" class="iconfont iconfont" style="vertical-align: middle;width: 12px; height: 12.5px;">&#xe62f;</span>
                    </span>
                </div>
                <div style="
                    font-size: 12px;
                    font-family: PingFangSC-Regular,PingFang SC;
                    font-weight: 400;
                    color: #999999;
                    line-height: 18px;
                    width: 220px;
                    height: 36px;
                    margin:8px 31px 16px 17px;"
                >简介：对用户输入的成语进行解释。<br>问题示例：心旷神怡</div>
            </div>
            <div class="mid-card-4" @mouseenter="onMouseOver('card_4')" @mouseleave="onMouseout('card_4')" v-show="showcard.geo==1">
                <div style="margin: 16px 16px 0 17px;">
                    <span class="icon iconfont icondilixinxi" style="width: 18px;height: 18px;"></span>
                    <span style="
                        margin-left: 10px;
                        font-size: 14px;
                        font-family: PingFangSC-Regular,PingFang SC;
                        font-weight: 400;
                        color:rgba(51,51,51,1);;
                        line-height: 20px;"
                    >地理知识</span>
                    <span class="btn-stop" v-show="false" @click="deleteConfirm('geo')" ref="card_4">
                        <span v-show = "this.$store.state.envInfo.env == 'test'" class="iconfont iconfont" style="vertical-align: middle;width: 12px; height: 12.5px;">&#xe62f;</span>
                        <!-- <jt-icon  type="delete" style="width: 12px; height: 12.5px;"/> -->
                    </span>
                </div>
                <div style="
                    font-size: 12px;
                    font-family: PingFangSC-Regular,PingFang SC;
                    font-weight: 400;
                    color: #999999;
                    line-height: 18px;
                    width: 220px;
                    height: 36px;
                    margin:8px 31px 16px 17px;"
                >简介：对用户输入的地区进行介绍。<br>问题示例：北京</div>
            </div>

            <!-- <div class="mid-card-5" @mouseenter="onMouseOver('card_5')" @mouseleave="onMouseout('card_5')" v-show="showcard[4]">
                <div style="margin: 16px 16px 0 17px;">
                    <span><jt-icon type="message" /></span>
                    <span style="
                        margin-left: 10px;
                        font-size: 14px;
                        font-family: PingFangSC-Regular,PingFang SC;
                        font-weight: 400;
                        color: #333333;
                        line-height: 20px;"
                    >闹钟</span>
                    <span class="btn-stop" v-show="false" @click="deleteConfirm" ref="card_5">
                        <span class="iconfont iconfont" style="vertical-align: middle;width: 12px; height: 12.5px;">&#xe62f;</span> -->
            <!-- <jt-icon  type="delete" style="width: 12px; height: 12.5px;"/> -->
            <!-- </span>
                </div>
                <div style="
                    font-size: 12px;
                    font-family: PingFangSC-Regular,PingFang SC;
                    font-weight: 400;
                    color: #999999;
                    line-height: 18px;
                    width: 220px;
                    height: 36px;
                    margin:8px 31px 16px 17px;"
                >简介：此预置问答将提供闲聊的功能<br>问题示例：跟我聊聊吧</div>
            </div> -->
        </div>

        <jt-drawer
            title="请选择要添加的预置技能"
            :width="721"
            :drawerStyle="{
                background: '#EFF1F4'
            }"
            :headerStyle="{
                paddingTop: '14px',
                paddingLeft: '20px',
                background: '#EFF1F4',
                height: '52px',
                fontSize: '16px',
                fontFamily:'PingFangSC-Medium,PingFang SC',
                fontWeight:'500',
                color:'#333333',
                lineHeight:'22px',
                textAlign: 'center',

            }"
            @close="onClose"
            :visible="visible"
            :bodyStyle="{
                background: '#EFF1F4',
                padding: '0',
                borderTop: '1px solid #D9D9D9',
                height: 'calc(100% - 52px)'
            }"
        >
            <div class="drawerBody">
                <div class="bodyLeft divScroll">
                    <!-- <div class="options">
                        <div style="margin: 16px 16px 0 17px;">
                            <span><jt-icon type="message" /></span>
                            <span style="
                                margin-left: 10px;
                                font-size: 14px;
                                font-family: PingFangSC-Regular,PingFang SC;
                                font-weight: 400;
                                color: #333333;
                                line-height: 20px;"
                            >闲聊</span>
                            <span style="float: right;">
                                <jt-switch @change='onChange(showcard,0)' defaultChecked checkedChildren="开" unCheckedChildren="关" />
                            </span>
                        </div>
                        <div style="margin: 8px 31px 16px 17px;">
                            <span style="
                                font-size: 12px;
                                font-family: PingFangSC-Regular,PingFang SC;
                                font-weight: 400;
                                color: #999999;
                                line-height: 18px;"
                            >简介：此预置问答将提供闲聊的功能<br>问题示例：跟我聊聊吧</span>
                        </div>
                    </div> -->
                    <div class="options">
                        <div style="margin: 16px 16px 0 17px;">
                            <span class="icon iconfont iconxiaohua" style="width: 18px;height: 18px;"></span>
                            <span style="
                                margin-left: 10px;
                                font-size: 14px;
                                font-family: PingFangSC-Regular,PingFang SC;
                                font-weight: 400;
                                color: #333333;
                                line-height: 20px;"
                            >笑话</span>
                            <span style="float: right;">
                                <jt-switch @change="onChange('joke')" :checked = 'showcard.joke==1' checkedChildren="开" unCheckedChildren="关" />
                            </span>
                        </div>
                        <div style="margin: 8px 31px 16px 17px;">
                            <span style="
                                font-size: 12px;
                                font-family: PingFangSC-Regular,PingFang SC;
                                font-weight: 400;
                                color: #999999;
                                line-height: 18px;"
                            >简介：对笑话诉求随机返回笑话文本<br>问题示例：讲一个笑话</span>
                        </div>
                    </div>
                    <div class="options">
                        <div style="margin: 16px 16px 0 17px;">
                            <span class="icon iconfont iconchengyujielong" style="width: 18px;height: 18px;"></span>
                            <span style="
                                margin-left: 10px;
                                font-size: 14px;
                                font-family: PingFangSC-Regular,PingFang SC;
                                font-weight: 400;
                                color: #333333;
                                line-height: 20px;"
                            >成语问答</span>
                            <span style="float: right;">
                                <jt-switch @change="onChange('idioms')" :checked = 'showcard.idioms==1' checkedChildren="开" unCheckedChildren="关" />
                            </span>
                        </div>
                        <div style="margin: 8px 31px 16px 17px;">
                            <span style="
                                font-size: 12px;
                                font-family: PingFangSC-Regular,PingFang SC;
                                font-weight: 400;
                                color: #999999;
                                line-height: 18px;"
                            >简介：对用户输入的成语进行解释。<br>问题示例：心旷神怡</span>
                        </div>
                    </div>
                    <div class="options">
                        <div style="margin: 16px 16px 0 17px;">
                            <span class="icon iconfont icondilixinxi" style="width: 18px;height: 18px;"></span>
                            <span style="
                                margin-left: 10px;
                                font-size: 14px;
                                font-family: PingFangSC-Regular,PingFang SC;
                                font-weight: 400;
                                color: #333333;
                                line-height: 20px;"
                            >地理知识</span>
                            <span style="float: right;">
                                <jt-switch @change="onChange('geo')" :checked = 'showcard.geo==1' checkedChildren="开" unCheckedChildren="关"/>
                            </span>
                        </div>
                        <div style="margin: 8px 31px 16px 17px;">
                            <span style="
                                font-size: 12px;
                                font-family: PingFangSC-Regular,PingFang SC;
                                font-weight: 400;
                                color: #999999;
                                line-height: 18px;"
                            >简介：对用户输入的地区进行介绍。<br>问题示例：北京</span>
                        </div>
                    </div>
                    <!-- <div class="options">
                        <div style="margin: 16px 16px 0 17px;">
                            <span><jt-icon type="message" /></span>
                            <span style="
                                margin-left: 10px;
                                font-size: 14px;
                                font-family: PingFangSC-Regular,PingFang SC;
                                font-weight: 400;
                                color: #333333;
                                line-height: 20px;"
                            >闹钟</span>
                            <span style="float: right;">
                                <jt-switch @change='onChange(showcard,4)' defaultChecked checkedChildren="开" unCheckedChildren="关" />
                            </span>
                        </div>
                        <div style="margin: 8px 31px 16px 17px;">
                            <span style="
                                font-size: 12px;
                                font-family: PingFangSC-Regular,PingFang SC;
                                font-weight: 400;
                                color: #999999;
                                line-height: 18px;"
                            >简介：此预置问答将提供闲聊的功能<br>问题示例：跟我聊聊吧</span>
                        </div>
                    </div> -->
                    <!-- 音乐 -->
                    <!-- <div class="options">
                        <div style="margin: 16px 16px 0 17px;">
                            <span><jt-icon type="message" /></span>
                            <span style="
                                margin-left: 10px;
                                font-size: 14px;
                                font-family: PingFangSC-Regular,PingFang SC;
                                font-weight: 400;
                                color: #333333;
                                line-height: 20px;"
                            >音乐</span>
                            <span style="float: right;">
                                <jt-switch @change='onChange(showcard,3)' defaultChecked checkedChildren="开" unCheckedChildren="关" />
                            </span>
                        </div>
                        <div style="margin: 8px 31px 16px 17px;">
                            <span style="
                                font-size: 12px;
                                font-family: PingFangSC-Regular,PingFang SC;
                                font-weight: 400;
                                color: #999999;
                                line-height: 18px;"
                            >简介：此预置问答将提供闲聊的功能<br>问题示例：跟我聊聊吧</span>
                        </div>
                    </div>

                    其他
                    <div class="options">
                        <div style="margin: 16px 16px 0 17px;">
                            <span><jt-icon type="message" /></span>
                            <span style="
                                margin-left: 10px;
                                font-size: 14px;
                                font-family: PingFangSC-Regular,PingFang SC;
                                font-weight: 400;
                                color: #333333;
                                line-height: 20px;"
                            >其他</span>
                            <span style="float: right;">
                                <jt-switch @change='onChange(showcard,6)' defaultChecked checkedChildren="开" unCheckedChildren="关" />
                            </span>
                        </div>
                        <div style="margin: 8px 31px 16px 17px;">
                            <span style="
                                font-size: 12px;
                                font-family: PingFangSC-Regular,PingFang SC;
                                font-weight: 400;
                                color: #999999;
                                line-height: 18px;"
                            >简介：此预置问答将提供闲聊的功能<br>问题示例：跟我聊聊吧</span>
                        </div> -->
                    <!-- </div> -->
                </div>
                <div class="bodyRight">
                    <div class="bodyDialog divScroll chatWindow">
                        <div v-for="(msg,index) in msgList" :key="index">
                            <div class="robotMsg" v-if="msg.type === 'robot'" :class="{'isClick':msg.isClick}"
                                 v-html='msg.msg' @click="hotClick"></div>
                            <div style="clear:both"></div>
                            <div class="userMsg" v-if="msg.type === 'user' ">{{ msg.msg }}</div>
                            <div style="clear:both"></div>
                        </div>
                    </div>
                    <div class="bodyInput">
                        <jt-button class="enterButton" @click = "reset">
                            <!-- <span class="icon iconfont iconshuaxin"></span> -->
                            <span class="icon iconfont iconshuaxin iconfont11"></span>
                            <span style="margin-left: 5px;">重置对话</span>
                        </jt-button>
                        <jt-input-textarea class="inputArea" placeholder="在此体验技能，按enter键可直接发送" v-model="inputContent" @keydown.enter="pressEnter" />
                    </div>
                </div>
            </div>
            <!-- <div class="drawerFooter"> -->
            <!-- <jt-button :style="{ marginRight: '8px', width: '80px', height: '32px' }" @click="onClose">取消</jt-button>
                <jt-button :style="{ width: '80px', height: '32px' }" type="primary" @click="onClose">确定</jt-button> -->
            <!-- </div> -->
        </jt-drawer>
    </div>
</template>

<style>

.ant-drawer-title{
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

div.contentBody {
    flex: auto;
    background: #FFFFFF;
    border-radius: 2px;
    padding: 20px 20px 40px 20px;
    overflow-y: auto;
}
.iconfont{
    font-size: 18px;
}
.iconfont11{
    font-size: 14px;
}
.h1{
    width:88px;
    height:24px;
    font-size:16px;
    font-family:PingFangSC-Medium,PingFang SC;
    font-weight:600;
    color:rgba(51,51,51,1);
    line-height:24px;
    float: left;
}
.exportBtn {
        width: 68px;
        height: 32px;
        padding: 6px 0;
        font-size: 12px;
        font-family: 'PingFangSC-Regular,PingFang SC';
        font-weight: 400;
        color: #333333;
        line-height: 17px;
    }
.top-button{
    margin-left: 8px;
    width: 112px;
    height: 32px;
    padding: 6px;
    font-size: 12px;
    font-family: "PingFangSC-Regular,PingFang SC";
    font-weight: 400;
    color: #FFFFFF;
    line-height: 20px;
    float: right;
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


.drawerBody {
    overflow: hidden;
    width: 721px;
    /* height: calc(100% - 64px); */
    height: 100%;
    display: flex;
    flex-flow: row;
}
.bodyLeft {
    width: 280px;
    height: 100%;
    border-right: 1px solid #D9D9D9;
    padding: 20px 20px 0 20px;
    overflow: auto;
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
.options {
    background: #FFFFFF;
    border-radius: 2px;
    width: 240px;
    height: 96px;
    margin-bottom: 16px;
}
.bodyRight {
    overflow: hidden;
    width: 440px;
    height: 100%;
    display: flex;
    flex-flow: column;
}
.bodyDialog {
    width: 440px;
    height: calc(100% - 152px);
    border-bottom: 1px solid #D9D9D9;
    padding: 20px 20px 20px 20px;
    // display: flex;
    // flex-flow: column;
    overflow: scroll;
}
.bodyInput {
    width: 440px;
    height: 200px;
    /* height: 152px; */
    /* padding-left: 21px;
    padding-right: 21px;
    padding-top: 8px; */
    /* height: 200px; */
    padding-left: 21px;
    padding-right: 21px;
    padding-top: 8px;
}
.drawerFooter {
    background: #FFFFFF;
    width: 721px;
    height: 64px;
    border-top: 1px solid #E9EBEF;
    padding: 16px 20px 16px;
    text-align: right;
}
.enterButton {
    width: 88px;
    height: 32px;
    background: #FFFFFF;
    border-radius: 2px;
    border: 1px solid #D9D9D9;
    font-size: 12px;
    font-weight: 400;
    color: #555555;
    line-height: 18px;
    padding-left: 10px;
    &:hover{
            color: #337DFF;
            border-color:#337DFF;
        }
}
.inputArea {
    resize: none;
    margin-top: 9px;
    max-height: 95px;
    min-height: 95px;
    overflow: auto;
    background: transparent;
    border-style: none;
    font-size: 12px;
    font-weight: 400;
    color: #555555;
    line-height: 18px;
    padding: 0;
    border: none;
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
/* .mid-card-1{
    width:252px;
    height:96px;
    background:rgba(255,255,255,1);
    border-radius:2px;
    border:1px solid rgba(217,217,217,1);
    float: left;
    margin-right: 16px;
    margin-top: 16px;
} */
.mid-card-2{
    width:252px;
    height:96px;
    background:rgba(255,255,255,1);
    border-radius:2px;
    border:1px solid rgba(217,217,217,1);
    float: left;
    margin-right: 16px;
    margin-top: 16px;
}
.mid-card-3{
    width:252px;
    height:96px;
    background:rgba(255,255,255,1);
    border-radius:2px;
    border:1px solid rgba(217,217,217,1);
    float: left;
    margin-right: 16px;
    margin-top: 16px;
}
.mid-card-4{
    width:252px;
    height:96px;
    background:rgba(255,255,255,1);
    border-radius:2px;
    border:1px solid rgba(217,217,217,1);
    /* margin-top: 20px; */
    /* margin-right: 16px; */
    float: left;
    margin-top: 16px;
}

.isClick {
    white-space: pre;
}

/* .mid-card-5{
    width:252px;
    height:96px;
    background:rgba(255,255,255,1);
    border-radius:2px;
    border:1px solid rgba(217,217,217,1);
    float: left;
    margin-right: 16px;
    margin-top: 16px;
} */
.btn-stop{
    float: right;
    margin-top:-6px;
    margin-right: -6px;
    cursor: pointer;
    &:hover{
            color: #337DFF;
        }
    }
</style>

<script>
import {
    Icon,
    Empty,
    Modal,
} from "ant-design-vue";
import { mapActions } from "vuex";
import { axiosGet, axiosPost, axiosPut, axiosDelete } from "../../../utils/http.js";
import API from '../../../constant/api';
import { getRandomNum } from "@/utils/common";
const showEmpty = true;

export default {
    name: "Form",
    components: {
        "jt-icon":Icon, 
        'jt-empty':Empty,
        "jt-modal": Modal,
    },
    data() {
        return {
            errorMesAll:"系统繁忙，请稍后再试",
            envtype:"",
            robotId: "",
            deldata:"",
            savePresetskillresult:[],
            savePresetskillresultredis:[],
            searchPresetskillresult:[],
            ModalText: "删除后可通过添加预置技能重新添加",
            pageIndex: 0,
            show:false,
            emptyImage: require("@/assets/image/noneProject.png"),
            inputContent: '',
            deleteConfirmShow: false,
            // showcard:[true,true,true],
            // showcard:{},
            getparam:{},
            showcard:{
                joke:0,
                idioms:0,
                geo:0,
                weather:0,
            },
            // msgList: [
            //     {
            //         type: 'robot',
            //         msg: '您好，我是机器人无敌聪明的小智，您可以随时对我进行测试，您可以这样问我：帮我看下今天的天气'
            //     }
            // ],
            msgList: [
            ],
            form: this.$form.createForm(this),
            visible: false
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
        onMouseOver:function(val){
            this.$refs[val].style.display = "inline";
        },
        onMouseout:function(val){
            this.$refs[val].style.display = "none";
        },
        change:function(callback){
            console.log(callback);
        },
        showDrawer() {
            this.msgList = []
            // this.visible = true;
            const roborMsg = {
                type: 'robot',
                msg: 'session_start'
            };
            this.getAnswer(roborMsg)
            this.visible = true;
        },
        onClose() {
            this.visible = false;
        },
        pressEnter(e) {
            if(!this.inputContent.match(/^[ ]*$/)){
                const userMsg = {
                    type: 'user',
                    msg: this.inputContent
                };
                this.getAnswer(userMsg)
            }
            e.preventDefault()
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
        getAnswer(question) {
            let url = ''
            this.env = this.$store.state.envInfo.env;
            const userId = getRandomNum(this.userId);
            const params = {
                "botid": getRandomNum(this.robotId),
                'uid': userId,
                'vid': this.userId,
                "q": question.msg
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
                if(res && res.a.length > 0 && res.a[0].a){
                    robotMsg.type = 'robot'
                    robotMsg.msg = res.a[0].a
                }
                this.$nextTick(() => {
                    if(question.msg == 'session_start'){
                        if(robotMsg.msg){
                            const robotMsgList = robotMsg.msg.split('^A');
                            if(robotMsgList[0]){
                                const welcome = {
                                    type: 'robot',
                                    msg: robotMsgList[0]
                                }
                                this.msgList.push(welcome);
                            }
                            if(robotMsgList[1]){
                                const hotIssue = {
                                    type: 'robot',
                                    msg: '您是否遇到以下问题了呢?',
                                    isClick: 'true'
                                }
                                robotMsgList.map((item,index,arr)=>{
                                    if(item && index!=0){
                                        hotIssue.msg = hotIssue.msg + '\r\n' + `<a class='hot-issue' style='color: #337DFF'>${item}</ a>`
                                    }
                                })
                                this.msgList.push(hotIssue);
                            }
                        }
                    }else{
                        this.msgList.push(robotMsg);
                        const robotMsgList = res.suggest
                        if(robotMsgList.length > 0) {
                            const hotIssue = {
                                type: 'robot',
                                msg: '您可能还想知道:',
                                isClick: 'true'
                            }
                            robotMsgList.map((item,index,arr)=>{
                                if(index<5){
                                    hotIssue.msg = hotIssue.msg + '\r\n' + `<a class='hot-issue' style='color: #337DFF'>${item}</ a>`
                                }
                            })
                            this.msgList.push(hotIssue);
                        }
                    }
                    setTimeout(function(){ 
                        const div = document.getElementsByClassName('divScroll chatWindow');
                        div[0].scrollTop = div[0].scrollHeight;
                    }, 0);
                })
            }).catch((error) => {
                console.log(error);
            }).catch((error) => {
                this.showErrorNotification('查询失败','系统繁忙,请稍后再试')
            });
        },
        showErrorNotification(title, content) {
            this.$notification.open({
                message: title,
                description: "失败原因：" + content,
                icon: (<jt-icon type="exclamation-circle" theme="filled" style="color:#F04134"/>),
                duration: 0
            });
        },
        // hotClick(e) {
        //     if(e.target.nodeName == 'A'){
        //         const userMsg = {
        //             type: 'user',
        //             msg: e.target.innerText
        //         };
        //         this.getAnswer(userMsg)
        //     }
        // },
        // pressEnter(e) {
        //     if (e.preventDefault) e.preventDefault();
        //     else window.event.value = false;
        //     const userMsg = {
        //         type: 'user',
        //         msg: this.inputContent
        //     };
        //     const url = API.port8085.dialogUrl;
        //     const headers = {};
        //     const params = {
        //         "q": this.inputContent,
        //         "botid": this.robotId ,
        //         'uid': this.userId
        //     };
        //     const robotMsg = {};
        //     axiosGet(url, params, headers).then((res)=>{
        //         robotMsg.type = 'robot'
        //         robotMsg.msg = res.a[0].a
        //         this.$nextTick(() => {
        //             this.msgList.push(userMsg, robotMsg);
        //             this.inputContent = '';
        //             setTimeout(function(){ 
        //                 const div = document.getElementsByClassName('chatWindow');
        //                 div[0].scrollTop = div[0].scrollHeight;
        //             }, 0);    
        //         })
        //     }).catch((error) => {
        //         console.log(error);
        //     });
        // },
        changeResult() {
            this.showEmpty = !this.showEmpty;
        },
        deleteFaile(faileparam) {
            this.$notification.open({
                message: '删除失败！',
                description: '失败原因：数据库操作失败，请稍后再试',
                icon: <jt-icon type="exclamation-circle" theme="filled" style="color:#F04134"/>,
            });
        },
        deleteSucceed() {
            this.$message.success("删除成功");
        },
        deleteOk() {
            // this.showcard[this.deldata] = 0;
            this.$set(this.showcard,this.deldata,0)
            this.presetskillVuexDelfunction(this.showcard);
            this.presetskillVuexSaveredisfunction(this.showcard);
            
        },
        deleteCancel() {
            this.deleteConfirmShow = false;
        },
        deleteConfirm(num) {
            this.deldata = num;
            this.deleteConfirmShow = true;
        },
        onChange(num) {
            
            console.log(this.showcard[num])  
            if(this.showcard[num] == 1){
                this.showcard[num] = 0
                this.presetskillVuexSavefunction(this.showcard);
                this.presetskillVuexSaveredisfunction(this.showcard);
                console.log(this.savePresetskillresult.error)
                console.log(this.savePresetskillresultredis.error)
                if(this.savePresetskillresult.error == "-101" || this.savePresetskillresultredis.error == "-101"){
                    this.showcard[num] = 1
                }  
            }else{
                this.showcard[num] = 1
                this.presetskillVuexSavefunction(this.showcard);
                this.presetskillVuexSaveredisfunction(this.showcard);
                console.log(this.savePresetskillresult.error)
                console.log(this.savePresetskillresultredis.error)
                if(this.savePresetskillresult.error == "-101" || this.savePresetskillresultredis.error == "-101"){
                    this.showcard[num] = 0
                }  
            }
            // console.log(this.showcard[num])
            // this.presetskillVuexSavefunction(this.showcard);
            // this.presetskillVuexSaveredisfunction(this.showcard);     
        },
        ...mapActions({
            presetskillVuexGet: "presetSkill/getPresetskill",
            presetSkillVueSave: "presetSkill/savePresetskill",
            presetSkillVueSaveredis: "presetSkill/savePresetskillredis",
        }),
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
        // this.robotId
        presetskillVuexGetfunction(getparam){
            // console.log(this.$store.state.presetSkill.result);
            // console.log(this.robotId)
            getparam.robotId = this.robotId
            getparam.envtype = this.envtype
            console.log(getparam.envtype)
            this.presetskillVuexGet(getparam).then(res => {
                console.log(getparam)
                this.searchPresetskillresult = res;
                if(this.searchPresetskillresult.errno == 999){
                    this.error("查询预置技能失败",this.errorMesAll,0)
                }
                else{
                    if(this.searchPresetskillresult.length>0){
                        this.showcard = this.searchPresetskillresult[0]
                    }
                }
                // console.log(this.searchPresetskillresult)

                // for(let i = 0;i<this.searchPresetskillresult.length;i++){
                
            })
        },
        presetskillVuexSavefunction(param){
            // console.log(this.$store.state.presetSkill.result);
            param.robotId = this.robotId
            param.envtype = this.envtype
            console.log(param)
            this.presetSkillVueSave(param).then(res => {
                this.savePresetskillresult = res;
                // console.log(this.robotId)
            })
        },
        presetskillVuexSaveredisfunction(param){
            // console.log(this.$store.state.presetSkill.result);
            param.robotId = this.robotId
            param.robotId = this.robotId
            param.envtype = this.envtype
            this.presetSkillVueSaveredis(param).then(res => {
                this.savePresetskillresultredis = res;
                if(this.savePresetskillresultredis.errno == 999){
                    this.error("预置技能开启失败",this.errorMesAll,0)
                }
                // console.log(this.savePresetskillresultredis)
            })
        },
        presetskillVuexDelfunction(param){
            // console.log(this.$store.state.presetSkill.result);
            param.robotId = this.robotId
            param.robotId = this.robotId
            param.envtype = this.envtype
            this.presetSkillVueSave(param).then(res => {
                this.savePresetskillresult = res;
                this.presetSkillVueSaveredis(param).then(res2 => {
                    this.savePresetskillresultredis = res2;
                    this.deleteConfirmShow = false;
                    console.log(this.savePresetskillresult.error)
                    console.log(this.savePresetskillresultredis.error)
                    if(this.savePresetskillresult.errno == 999 || this.savePresetskillresultredis.errno == 999){
                        this.error("预置技能删除失败",this.errorMesAll,0)
                    }
                    else if(this.savePresetskillresult.error == 0 && this.savePresetskillresultredis.error == 200 ){
                        this.deleteSucceed();
                    }
                    else{
                        this.deleteFaile();
                        console.log(res)
                    }
                    
                })

                
                // if(res.error == 0 && this.savePresetskillresultredis.error == 200 ){
                //     this.deleteSucceed();
                // }
                // else if(res.error != 0 && this.savePresetskillresultredis.error == 200 ){
                //     this.deleteFaile(res+'，mongo出错');
                //     console.log(res)
                // }
                // else if(res.error == 0 && this.savePresetskillresultredis.error != 200 ){
                //     this.deleteFaile(this.savePresetskillresultredis+'，redis出错');
                //     console.log(this.savePresetskillresultredis)
                // }
                // else{
                //     this.deleteFaile(res + this.savePresetskillresultredis+',都出错');
                //     console.log(res)
                //     console.log(this.savePresetskillresultredis)
                // }
                // console.log(this.robotId)
            })
        },
    },
    mounted(){   
        // console.log(this.result[0].botid); 
        // const separatorSymbol = document.querySelector(".ant-calendar-range-picker-separator");
        // if(separatorSymbol){
        //     separatorSymbol.innerHTML = '<i class="anticon anticon-swap-right" aria-label="图标: swap-right"><svg viewBox="0 0 1024 1024" data-icon="swap-right" width="1em" height="1em" fill="currentColor" aria-hidden="true" focusable="false" class=""><path d="M873.1 596.2l-164-208A32 32 0 0 0 684 376h-64.8c-6.7 0-10.4 7.7-6.3 13l144.3 183H152c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h695.9c26.8 0 41.7-30.8 25.2-51.8z"></path></svg></i>';
        // }   
        this.$store.commit(
            'setBreadcrumb',
            [
                {breadcrumbName: this.$store.state.envInfo.envName, breadcrumbPath: this.$store.state.fromPath},
                {breadcrumbName: "预置技能"}
            ]
        );
        this.robotId = this.$store.state.robotInfo.robotId;
        // this.robotId = "4d8e7016f888888f5ca6eaa4a88aa8bd"
        this.userId = this.$store.state.userId;
        if(this.$store.state.envInfo.env == "test"){
            this.envtype = "0"
        }
        else{
            this.envtype = "1"
        }
        console.log(this.envtype)
        this.presetskillVuexGetfunction(this.getparam);
        
        // console.log(this.robotId);
        // console.log(this.envtype);
        // this.presetskillVuexSavefunction();
        
    },
    // computed: {
    //     savePresetskillresult() {
    //         console.log(this.$store.state.presetSkill.savePresetskillresult);
    //         return this.$store.state.presetSkill.savePresetskillresult
    //     },
    // },
};
</script>
