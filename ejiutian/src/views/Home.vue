<template>
    <div>
        <div id="home" v-if='possibleOrder'>
            <nav id="nav-1st" :class="collapsed ? 'nav-collapsed' : 'nav-expanded'">
                <!-- <header id="nav-header">
                    <div id="logo" @click="goIndex"></div>
                </header> -->
                <div class="jt-logo">
                    <img :src="logo" alt />
                </div>
                <div id="module-name">
                    <p>九天·智能交互平台</p>
                </div>
                <ul id="nav-menu">
                    <li
                        v-for="(menuitem, menuIndex) in menus"
                        :key="menuitem.name"
                        class="menu-item"
                        :class="{'menu-in':collapsed}"
                    >
                        <router-link
                            :to="{ path: menuitem.link }"
                            class="menu-title"
                            @click.native="clickMenu(menuitem, menuIndex)"
                        >
                            <span :class="'menu-icon iconfont ' + menuitem.icon"></span>
                            <span class="menu-text" v-if="!collapsed">{{ menuitem.name}}</span>
                            <span
                                v-if="menuitem.subs && !collapsed"
                                class="arrow-icon iconfont"
                                :class="{'iconshouqi':openMenuList.includes(menuIndex),'iconzhankai':!openMenuList.includes(menuIndex)}"
                            ></span>
                        </router-link>
                        <transition-collapse>
                            <ul
                                class="sub-menu sub-menu-show"
                                v-if="openMenuList.includes(menuIndex)"
                            >
                                <li class="sub-menu-header" v-show="collapsed">
                                    <router-link
                                        :to="{ path: menuitem.link }"
                                        @click.native="clickMenu(menuitem, menuIndex)"
                                    >
                                        <div class="sub-menu-header-title">{{ menuitem.name}}</div>
                                    </router-link>
                                </li>
                                <li
                                    class="sub-menu-item"
                                    v-for="subitem in menuitem.subs"
                                    :key="subitem.name"
                                >
                                    <router-link
                                        class="sub-menu-title"
                                        :to="{ path: subitem.link }"
                                        @click.native="clickSubMenu()"
                                    >
                                        <span>{{subitem.name}}</span>
                                    </router-link>
                                </li>
                            </ul>
                        </transition-collapse>
                    </li>
                </ul>
            </nav>
            <main id="wrapper" :class="{'nav-collapsed-left': collapsed}">
                <section id="container" ref="container">
                    <router-view />
                </section>
                <header id="header">
                    <div class="menu-left">
                        <span
                            class="nav-trigger iconfont"
                            :class="collapsed ? 'icondaohangzhankai' : 'icondaohangshouqi'"
                            @click="changeMenu"
                        ></span>
                        <!-- <jt-dropdown :visible="false" :trigger="['click']">
                            <div class="server-select">
                                <p>华东节点4</p>
                                <jt-icon type="caret-down" />
                            </div>
                            <jt-menu slot="overlay" class="dropdown-list">
                                <jt-menu-item>
                                    <a href="javascript:;">1st menu item</a>
                                </jt-menu-item>
                                <jt-menu-item>
                                    <a href="javascript:;">2nd menu item</a>
                                </jt-menu-item>
                                <jt-menu-item>
                                    <a href="javascript:;">3rd menu item</a>
                                </jt-menu-item>
                            </jt-menu>
                        </jt-dropdown> -->
                    </div>
                    <div class="menu-right">
                        <!-- <span class="menu-help">
                            <a :href="`${ECLOUD_PREFIX}op-help-center/`">支持与帮助</a>
                        </span> -->
                        <div>
                            <div class="user-box">
                                <div class="user-avatar">
                                    <img :src="avatarImg" alt />
                                </div>
                                <jt-dropdown>
                                    <a class="user-name" @click="(e) => e.preventDefault()">
                                        {{ userinfo.username }}
                                        <jt-icon type="down" />
                                    </a>
                                    <jt-menu slot="overlay" @click="userConfigClick">
                                        <jt-menu-item key="account">个人中心</jt-menu-item>
                                        <jt-menu-item key="logout">退出登录</jt-menu-item>
                                    </jt-menu>
                                </jt-dropdown>
                            </div>
                        </div>
                    </div>
                </header>
            </main>
        </div>
        <div v-if='!possibleOrder'>
            <empty-page :possibleOrder='possibleOrder' :questionSearchNoneImage='questionSearchNoneImage'
                        :emptyBtnName='emptyBtnName' :emptySubTitle='emptySubTitle' :emptyTitle='emptyTitle'>
            </empty-page>
        </div>
        <div class='check-modal check-modal-min' v-if='isCheck && !isMax'>
            <div class='check-modal-header'>
                <div style="float:left"><span class='check-modal-title'>正在校验{{count}}项</span></div>
                <div style="float:right">
                    <jt-icon type="up" style="color: #fff;cursor: pointer;" @click="changeModal"/>
                    <jt-button  :disabled="!nochecked" class="close-check" @click="closeModal"><jt-icon type="close" style="margin-left: 30px;color: #fff;cursor: pointer;"/></jt-button>
                </div>
            </div>
        </div>
        <div class='check-modal' v-if='isCheck && isMax'>
            <div class='check-modal-header'>
                <div style="float:left"><span class='check-modal-title'>正在校验{{count}}项</span></div>
                <div style="float:right">
                    <jt-icon type="down" style="color: #fff;cursor: pointer;" @click="changeModal"/>
                    <jt-button  :disabled="!nochecked" class="close-check" @click="closeModal"><jt-icon type="close" style="margin-left: 30px;color: #fff;cursor: pointer;"/></jt-button>
                </div>
            </div>
            <div>
                <ul>
                    <li v-for="(item,index) in checkData" :key="index" class='checkLi'>
                        <div class = 'filename'>
                            <span class=''>
                                <jt-icon type="file-excel" class='icon' theme="filled" :style="{ fontSize: '22px',color:'#51AD6C',verticalAlign: 'middle',marginRight: '8px'}" />
                                <span :title="item.filename">{{item.filename}}</span>
                            </span>
                        </div>
                        <span class="iconfont btn-icon" v-if='item.result == 2' style="color:#337DFF;margin-left:27px;margin-right:7px">&#xe62b;</span>
                        <span class="iconfont iconchenggong-tianchong" v-if='item.result == 0' style="color:#10C038;margin-left:27px;margin-right:7px"></span>
                        <span class="iconfont iconshibai-tianchong" v-if='item.result == 1' style="color:#F04134;margin-left:27px;margin-right:7px"></span>
                        <span>{{item.resultname}}</span>
                        <span v-if='item.result == 1' class='detail' @click="$router.push('/home/robotHome/ImportDetail')">详情</span>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>
<style lang="less" scoped>
@import "~@/assets/style/var.less";
#nav-header {
    width: 200px;
    height: 50px;
    line-height: 50px;
    background: #16233a;
    text-align: center;
}
#logo {
    background: url("~@/assets/logo.png") no-repeat 41px ~"/" 100px 28px;
    height: 50px;
}
#home {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    min-width: 1366px;
    min-height: 625px;
}
#module-name {
    font-size: 14px;
    text-align: center;
    line-height: 18px;
    color: @jt-color-white;
    position: relative;
    margin-bottom: 12px;
    p {
        width: 116px;
        margin: auto;
        position: relative;
        &:before,
        &:after {
            content: "";
            width: 25px;
            height: 1px;
            background-color: rgba(216, 216, 216, 0.15);
            position: absolute;
            top: 0;
            bottom: 0;
            margin: auto;
        }
        &:before {
            right: ~"calc(100% + 10px)";
        }
        &:after {
            left: ~"calc(100% + 10px)";
        }
    }
}

#nav-1st {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    z-index: 10;
    width: 200px;
    background: #304364;
    color: @jt-color-nav-text;
    a {
        color: @jt-color-nav-text;
    }
    &.nav-collapsed {
        width: 50px;
        #nav-header {
            width: 50px;
            overflow: hidden;
            #logo {
                width: 45px;
                background-position: 6px;
            }
        }
        #module-name {
            display: none;
        }
        #nav-menu .menu-item {
            .menu-title {
                padding: 0 17px;
            }
            .sub-menu {
                position: absolute;
                left: 50px;
                top: 0;
                width: 180px;
                display: none;
                .sub-menu-header {
                    height: 40px;
                    line-height: 40px;
                    background-color: rgba(38, 56, 87, 0.9);
                    cursor: initial;
                    .sub-menu-header-title {
                        height: 40px;
                        line-height: 40px;
                        margin: 0 18px;
                        border-bottom: 1px solid rgba(80, 100, 136, 0.9);
                    }
                }
                .sub-menu-item {
                    height: 40px;
                    line-height: 40px;
                    background-color: rgba(38, 56, 87, 0.9);
                    .sub-menu-title {
                        padding-left: 40px;
                    }
                }
            }

            &:hover {
                .sub-menu {
                    display: block;
                }
            }
        }
    }
    &.nav-expanded {
        overflow-y: auto;
        overflow-x: hidden;
        .sub-menu {
            display: none;
            &.sub-menu-show {
                display: block;
            }
        }
    }
    #nav-menu {
        user-select: none;
        .menu-item {
            cursor: pointer;
            position: relative;
            .sub-menu-item {
                &:hover {
                    background-color: #263857;
                }
            }
            &.menu-in {
                &:hover {
                    background-color: #263857;
                }
            }
            .menu-title {
                padding: 0 26px;
                height: 40px;
                line-height: 40px;
                position: relative;
                display: block;
                // border-left: 0px solid @jt-color-primary;
                // transition: border-width ease 300ms;
                &:hover {
                    color: @jt-color-white;
                    background-color: #263857;
                }
                &.menu-actived {
                    // border-left-width: 3px;
                    background-color: #263857;
                    color: @jt-color-white;
                }
                .menu-icon {
                    margin-right: 10px;
                    font-size: @jt-font-size-lger;
                }
                .menu-text {
                    position: relative;
                    bottom: 1px;
                }
                .arrow-icon {
                    position: absolute;
                    top: 50%;
                    right: 20px;
                    transform: translateY(-50%);
                }
            }
            .sub-menu {
                .sub-menu-header {
                    &:hover {
                        background-color: #263857;
                    }
                }
                .sub-menu-item {
                    height: 40px;
                    line-height: 40px;
                    font-size: @jt-font-size-sm;
                    .sub-menu-title {
                        display: block;
                        padding-left: 55px;
                        &:hover {
                            color: @jt-color-white;
                            background-color: #263857;
                        }
                        &.router-link-active {
                            color: @jt-color-white;
                            background-color: @jt-color-primary;
                        }
                    }
                }
            }
        }
    }
}
#wrapper {
    position: absolute;
    top: 0;
    left: 200px;
    right: 0;
    bottom: 0;
    z-index: 0;
    &.nav-collapsed-left {
        left: 50px;
    }
}
#header {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 50px;
    box-shadow: 0px -1px 8px 1px rgba(0, 0, 0, 0.2);
    z-index: 1;
    display: flex;
    justify-content: space-between;
    .nav-trigger {
        font-size: 18px;
        line-height: 50px;
        padding-left: 8px;
        cursor: pointer;
    }
    .top-menu {
        padding-right: 16px;
        .top-menu-item {
            display: inline-block;
            width: 76px;
            line-height: 50px;
            text-align: center;
            border-left: 1px solid #f5f5f5;
        }
        .user-msg {
            width: 91px;
            border-right: 1px solid #f5f5f5;
        }
    }
}
#container {
    position: absolute;
    left: 0;
    right: 0;
    top: 50px;
    bottom: 0;
    background: #eff1f4;
    //z-index: 0;
    overflow-y: auto;
}
.jt-logo {
    img {
        display: block;
        width: 45px;
        margin: 12px auto;
    }
}
.nav-collapsed {
    .jt-logo {
        img {
            width: 35px;
        }
    }
}
.menu-left {
    display: flex;
    align-items: center;
}
.server-select {
    display: flex;
    align-items: center;
    padding: 0 16px;
    background-color: #f2f2f2;
    border-radius: 14px;
    color: #555555;
    line-height: 28px;
    font-size: 12px;
    margin-left: 16px;
    cursor: pointer;
    user-select: none;
    p {
        margin-bottom: 0;
        margin-right: 8px;
    }
    i {
        color: #999999;
        font-size: 8px;
    }
}
.menu-right {
    display: flex;
    align-items: center;
    font-size: 12px;
    color: @jt-color-text;
    letter-spacing: 0;
}
.menu-help {
    margin-right: 40px;
    a {
        color: @jt-color-text;
    }
}
.user-box {
    display: flex;
    align-items: center;
    margin-right: 21px;
    user-select: none;
    .user-avatar {
        margin-right: 8px;
        img {
            width: 28px;
            display: block;
        }
    }
    .user-name {
        max-width: 120px;
        margin-right: 8px;
        text-overflow: ellipsis;
        overflow: hidden;
    }
    i {
        color: #999999;
        font-size: 8px;
    }
}
.dropdown-list {
    margin-top: 10px;
}
/* 校验弹窗 */

.check-modal {
    width: 400px;
    height: 280px;
    background: #FFFFFF;
    box-shadow: 0px -2px 20px 0px rgba(0, 0, 0, 0.15);
    border-radius: 2px 2px 0px 0px;
    position: fixed;
    right: 0;
    bottom: 0;
    border: 1px solid #ccc;
    z-index: 90;
    .check-modal-header {
        height: 40px;
        line-height: 40px;
        background: #5E6471;
        border-radius: 2px 2px 0px 0px;
        padding: 0 16px;
        .check-modal-title{

            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #FFFFFF;
            line-height: 21px;
        }
    }
    .checkLi {
        height: 40px;
        line-height: 40px;
        padding:0 20px;
        font-size: 12px;
        .filename {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            display: block;
            width:206px;
            float:left;
            text-align:left;
        }
        .detail {
            margin-left: 20px;
            cursor: pointer;
            color: #337DFF;

        }
    }
    .checkLi.check {
        background: #E6F4FF;
    }
    .checkLi.fail {
        background: #FFF2F0;
    }
}
.check-modal-min {
    height: auto;
}
.close-check,.close-check:hover{
    margin: 0;
    padding: 0;
    background: none;
    border: none;
}
</style>
<script>
// import { Dropdown } from "ant-design-vue";
import TransitionCollapse from "@/lib/transition-collapse.js";
import { mapState, mapActions } from "vuex";
import API from '@/constant/api';
import { axiosPost } from "@/utils/http.js";
import { ECLOUD_PREFIX } from "@/utils/cloud.http";
import { Modal } from "ant-design-vue";
import emptyPage from './platform/empty-page'

export default {
    name: "Home",
    components:{
        "transition-collapse": TransitionCollapse,
        'empty-page': emptyPage,
        // "jt-dropdown": Dropdown
    },
    data: () => ({
        //校验弹窗
        isMax: true,

        possibleOrder: true,
        questionSearchNoneImage: '',
        emptyBtnName: '',
        emptyTitle: '',
        emptySubTitle: '',
        ECLOUD_PREFIX,
        visible:true,
        menus: [
            // {
            //     icon: "iconkongzhitai",
            //     name: "订购",
            //     link: "/custom-order"
            // },
            {
                icon: "iconkongzhitai",
                name: "控制台",
                link: "/home/controlPlatform"
            },
            {
                icon: "iconjiqiren",
                name: "我的机器人",
                subs: [
                    {
                        link: "/home/testEnv",
                        name: "测试环境"
                    },
                    {
                        link: "/home/productionEnv",
                        name: "生产环境"
                    }
                ]
            }
        ],
        collapsed: false,
        openMenuIndex: -1,
        logo: require("@/assets/image/jt-logo.png"),
        avatarImg: require("@/assets/image/avatar.png"),
        dropdownShow: false,
        openMenuList: [], // 展开的列表
        government: true, //是否是政府用户
        instanceId: '',
        productId: '',
        consoleState: ''
    }),
    watch: {
        $route() {
            this.openMenu();
        },
        globalFreeze(newCount, oldCount) {
            if(newCount){
                this.globalPopup()
            }
        }
    },
    methods: {
        ...mapActions({
            getUserInfo: 'platform/getUserInfo',
            queryUser: 'platform/queryUser',
            getAuthority: 'platform/getAuthority',
            userLogout: "platform/userLogout",
        }),
        //校验弹窗
        changeModal() {
            this.isMax = !this.isMax
        },
        closeModal() {
            this.$store.commit('setIsCheck',false)
            this.$store.commit('setCheckData',[])
            Modal.info({
                title :  '',
                content:
                    <div style="font-size:12px">
                        您可通过导入详情查看校验结果
                    </div>,
                centered : true,
                okText : '知道了',
                width:324,
                maskClosable: true
            });
        },
        userConfigClick(e) {
            if (e.key == "account") {
                this.$router.push({
                    path: "/home/controlPlatform/userConfig",
                });
            } else {
                this.userLogout()
                    .then((res) => {})
                    .catch((error) => {
                        console.log({
                            errno: error.errno,
                            errorMsg: error.errorMsg,
                        });
                    });
                this.$keycloak.logout();
            }
        },
        handleOk() {
            console.log('ok')
        },
        //获取用户数据，包括instanceId
        getUserInfoVuex() {
            this.getUserInfo().then((res)=>{
                if(res.errno == '-101') {
                    this.$store.commit('setGlobalFreeze', {}, { root: true });
                }else {
                    this.productId = res.result.productId
                    this.consoleState = res.result.consoleState
                    this.changeConsoleState(this.consoleState)
                }
            }).catch((error) => {
                console.log({"errno": error.errno, "errorMsg": error.errorMsg});
            });
        },
        //控制台状态
        changeConsoleState(consoleState) {
            if(!this.government) {
                if(consoleState == 'MANUAL') {
                    this.isManual()
                }else if(consoleState == 'ZEROPKG') {
                    this.internetZeroManual()
                }else if(consoleState == 'EXPIRED') {
                    this.internetNoZeroManual()
                }
            }else{
                // ACTIVE 套餐用尽//正常 MANUAL//冻结 ZEROPKG//0元套餐到期
                if(consoleState == 'MANUAL') {
                    this.isManual()
                }else if(consoleState == 'ZEROPKG') {
                    this.zeroManual()
                }
            }
        },
        //政企用户人为冻结
        isManual() {
            Modal.info({
                title :  <div style="font-size:14px;">您的账户已被冻结</div>,
                content:
                    <div style="font-size:12px">
                        您可联系移动云平台客户经理进行恢复
                    </div>,
                centered : true,
                width:336,
                okButtonProps : { style: {display: 'none'} } ,
                icon:()=><jt-icon type="exclamation-circle" theme="filled" style="color:#F04134"/>
            });
        },
        //政企用户0元冻结
        zeroManual() {
            Modal.info({
                title :  <div style="font-size:14px;">您账户的免费套餐已到期</div>,
                content:
                    <div style="font-size:12px">
                        您可以退订后重新订购其他版本，重新订购成功后将恢复使用。
                    </div>,
                centered : true,
                okText: '退订',
                onOk:() => {
                    this.unsubscribeModal()
                },
                width:395,
                okButtonProps:{ style:{width:'64px',background:'#fff',color:'#555',border:'1px solid #d9d9d9','box-shadow':'none','text-shadow':'none'}},
                icon:()=><jt-icon type="exclamation-circle" theme="filled" style="color:#F04134"/>
            });

        },
        //互联网用户非0元套餐冻结
        internetNoZeroManual() {
            Modal.info({
                title :  <div style="font-size:14px;">您的账户服务已到期，请续费</div>,
                content:
                    <div style="font-size:12px">
                        <div>你可以点击立即续费为账户续费，续费后将恢复使用。</div>
                        <div>温馨提示：到期超过15天仍未续费，您的服务将会自动退订。</div>
                    </div>,
                centered : true,
                okText : '立即续费',
                okType: 'primary',
                width:395,
                onOk:() => {
                    this.renewal()
                },
                icon:()=><jt-icon type="exclamation-circle" theme="filled" style="color:#F04134"/>
            });
        },
        //互联网用户0元套餐冻结
        internetZeroManual() {
            Modal.info({
                title :  <div style="font-size:14px;">您账户的免费套餐已到期，请变更后继续使用</div>,
                content:
                    <div style="font-size:12px">
                        <div>您可以点击立即变更前往变更，变更后将恢复使用</div>
                        <div>温馨提示：到期超过15天仍未变更，您的服务将会自动退订。</div>
                    </div>,
                centered : true,
                okText : '变更',
                okType: 'primary',
                width:395,
                onOk:() => {
                    this.change()
                },
                icon:()=><jt-icon type="exclamation-circle" theme="filled" style="color:#F04134"/>
            });
        },
        //退订弹窗
        unsubscribeModal() {
            const param = {
                'instanceId': this.instanceId,
                'actionType': 2
            }
            this.getAuthority(param).then((res) => {
                res.body.operate4Action = 'ALLOW'
                if(res.state!='ERROR'){
                    if(res.body.operate4Action == 'ALLOW') {
                        Modal.confirm({
                            title :  <div style="font-size:14px;">确定退订已订购的服务吗？</div>,
                            content:
                                <div style="font-size:12px">
                                    退订后，机器人数据将被删除退订立即生效。
                                </div>,
                            centered : true,
                            okText : '退订',
                            cancelText: '取消',
                            okType: 'danger',
                            onOk:() => this.unsubscribe(),
                            onCancel: () => this.changeConsoleState(this.consoleState),
                            width:336,
                            okButtonProps:{ style:{width:'64px'}},
                            cancelButtonProps:{ style:{width:'64px'}},
                            icon:()=><jt-icon type="exclamation-circle" theme="filled" style="color:#F04134"/>
                        });
                    }else {
                        this.showErrorNotification('无法退订',res.body.message)
                        this.changeConsoleState(this.consoleState)
                    }
                }else{
                    this.showErrorNotification('无法退订',res.errorMessage)
                    this.changeConsoleState(this.consoleState)
                }
            })
        },
        unsubscribeLoading(modal) {
            //退订中
            modal.update({
                title :  <div style="font-size:14px;">您的账户正在退订中…</div>,
                class: 'unsubscribeSuccess',
                centered : true,
                okText : '',
                width:240,
                okButtonProps: { style: { display: 'none' } },
                icon:()=><jt-icon type="exclamation-circle" theme="filled" style="color:#337DFF"/>
            });
        },
        //退订
        unsubscribe() {
            const url = API.wuxi.orderCancel;
            const data = {
                'userId': this.userinfo.id,
                'actionType': 2,
                'instanceId': this.instanceId,
            };
            const params = {}
            const headers = {};
            const modal = Modal.warning();
            this.unsubscribeLoading(modal)
            axiosPost(url, params, data, headers).then((res)=>{
                modal.destroy();
                if('OK' == res.state) {
                    //退订成功
                    Modal.success({
                        title :  <div style="font-size:14px;">退订成功！</div>,
                        class: 'unsubscribeSuccess',
                        centered : true,
                        okText : '',
                        width:180,
                        maskClosable: true,
                        okButtonProps: { style: { display: 'none' } }
                    });
                    this.queryUserVuex()
                }else {
                    this.showErrorNotification('退订失败！',res.errorMessage)
                    this.changeConsoleState(this.consoleState)
                }
            })
        },
        //变更
        change() {
            const param = {
                'instanceId': this.instanceId,
                'actionType': 5
            }
            this.getAuthority(param).then((res) => {
                if(res.state!='ERROR'){
                    if(res.body.operate4Action == 'ALLOW') {
                        this.$router.push({
                            path: '/custom-order',
                            query: {
                                opType: 1,
                                instanceId: this.instanceId,
                                productId: this.productId
                            }
                        })
                    }else {
                        this.showErrorNotification('无法变更',res.body.message)
                        this.changeConsoleState(this.consoleState)
                    }
                }else{
                    this.showErrorNotification('无法变更',res.errorMessage)
                    this.changeConsoleState(this.consoleState)
                }
            })
        },
        //续订
        renewal() {
            const param = {
                'instanceId': this.instanceId,
                'actionType': 6
            }
            this.getAuthority(param).then((res) => {
                if(res.state!='ERROR'){
                    if(res.body.operate4Action == 'ALLOW') {
                        this.$router.push({
                            path: '/custom-order',
                            query: {
                                opType: 2,
                                instanceId: this.instanceId,
                                productId: this.productId
                            }
                        })
                    }else {
                        this.showErrorNotification('无法续订',res.body.message)
                        this.changeConsoleState(this.consoleState)
                    }
                }else {
                    this.showErrorNotification('无法续订',res.errorMessage)
                    this.changeConsoleState(this.consoleState)
                }
            })
        },
        showErrorNotification(title, content) {
            this.$notification.open({
                message: title,
                description: "失败原因：" + content,
                icon: (<jt-icon type="exclamation-circle" theme="filled" style="color:#F04134"/>)
            });
        },
        //获取是否首次订购和订单状态
        queryUserVuex() {
            this.queryUser().then((res)=>{
                this.instanceId = res.body.instanceId
                if(!this.instanceId) {
                    window.location.href = ECLOUD_PREFIX + 'api/page/op-order-static/product/jiutianbot'
                }else{
                    const statusList = [4,5]
                    const status = res.body.status
                    if(statusList.includes(status)) {
                        const modal = Modal.warning();
                        this.unsubscribeLoading(modal)
                    }
                }
            })
        },
        goIndex() {
            window.open(ECLOUD_PREFIX,'_blank');
        },
        openMenu() {
            this.menus.forEach((menuItem, index) => {
                if (menuItem.subs) {
                    menuItem.subs.forEach(subItem => {
                        if (this.$route.path.includes(subItem.link)) {
                            this.openMenuIndex = index;
                        }
                    });
                } else if (this.$route.path.includes(menuItem.link)) {
                    this.openMenuIndex = index;
                }
            });
        },
        clickMenu(menuitem, menuIndex) {
            const list = new Set(this.openMenuList);
            if (menuitem.subs) {
                if (list.has(menuIndex)) {
                    list.delete(menuIndex);
                } else {
                    list.add(menuIndex);
                }
                this.openMenuList = [...list];
            } else {
                this.openMenuIndex = menuIndex;
                // this.collapsed = true;
            }
        },
        clickSubMenu() {
            // this.collapsed = true;
        },
        globalPopup() {
            Modal.info({
                title :  <div style="font-size:14px;">加载数据失败</div>,
                content:
                    <div style="font-size:12px">
                        系统繁忙,请稍后再试
                    </div>,
                centered : true,
                width:336,
                okButtonProps : { style: {display: 'none'} } ,
                icon:()=><jt-icon type="exclamation-circle" theme="filled" style="color:#F04134"/>
            });
        },
        changeMenu() {
            this.collapsed = !this.collapsed;
        },
        visibleChange(visible) {
            this.dropdownShow = visible;
        },
    },
    computed: {
        ...mapState(["loading", "userinfo","globalFreeze","checkData","isCheck"]),
        nochecked(){
            const arr = this.checkData.filter((item) => item.result == 2)
            return arr.length > 0 ?false : true
        },
        count() {
            const arr = this.checkData.filter((item) => item.result == 2)
            return arr.length
        }
    },
    created() {
        // this.$store.dispatch("fetchUsers").then(() => {
        //     if (!this.userinfo.id) {
        //         this.$message.error("获取用户信息异常");
        //     }else{
        //         //是否是政府用户
        //         this.government = this.userinfo.customerType == '互联网客户'?false:true
        //         this.queryUserVuex()
        //         // this.getUserInfoVuex()
        //         //判断是否是根账号
        //         if(this.userinfo.isCustomer != 1 ) {
        //             this.possibleOrder =  false
        //             this.questionSearchNoneImage = require("@/assets/image/shelves.png")
        //             this.emptyBtnName = '返回首页'
        //             this.emptyTitle = '无法访问'
        //             this.emptySubTitle = '非常抱歉，您暂无访问控制台及使用权限'
        //         }
        //     }
        // });
    },
    mounted() {
        this.openMenu();
        this.openMenuList = this.menus.map((x, index) => index);
    }
};
</script>
