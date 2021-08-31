<template>
    <div class="content">
        <nav class="nav-2nd">
            <header class="nav-2nd-tip">
                <router-link :to="{ path: $store.state.fromPath }">
                    <span class="menu-icon iconfont iconfanhui"></span>
                    <span class="menu-text">{{$store.state.envInfo.envName}}</span>
                </router-link>
                <!-- <router-link :to="{ path: fromPath }">
                    <span style="width: 11px; height: 11px; color: #999999;">
                        <jt-icon type="left" />
                    </span>
                    <span class="headerText">{{envName}}</span>
                </router-link>-->
            </header>
            <div style="margin-bottom: 16px;">
                <div style="display: flex; flex-flow: row;">
                    <div style="width: 40px; height: 40px; margin-top: 16px; margin-left: 16px;">
                        <img src="~@/assets/image/RobotAvatar.png" width="40px" height="40px" />
                    </div>
                    <div style="margin-top: 17px; margin-left: 8px;">
                        <span
                            class="robotName"
                            :title="$store.state.robotInfo.robotName"
                        >{{$store.state.robotInfo.robotName}}</span>
                        <span
                            class="robotId"
                            :title="'ID:' + $store.state.robotInfo.robotId"
                        >ID:{{$store.state.robotInfo.robotId}}</span>
                        <!-- <span
                            class="robotName"
                            :title="$store.state.robotInfo.robotName"
                        >{{$route.query.robotName}}</span>
                        <span
                            class="robotId"
                            :title="'ID:' + $store.state.robotInfo.robotId"
                        >ID:{{$route.query.robotId}}</span> -->
                    </div>
                </div>
                <RobotTestBtn />
            </div>
            <ul class="nav-2nd-menu">
                <li
                    v-for="item in navs"
                    :key="item.name"
                    v-show="item.disappearEnv != $store.state.envInfo.env"
                >
                    <router-link
                        v-bind:to="{ path: item.link }"
                        @click.native="clickMenu(item, item.name)"
                        :class="{'menu-actived': openMenuName === item.name && !item.hasOwnProperty('subs')}"
                    >
                        <span :class="'menu-icon iconfont ' + item.icon"></span>
                        <span class="menu-text">{{item.name}}</span>
                        <span
                            v-if="item.subs"
                            :class="['arrow-icon', 'iconfont', item.openFlag ? 'iconshouqi' : 'iconzhankai']"
                        ></span>
                    </router-link>
                    <transition-collapse>
                        <ul class="sub-menu" v-show="item.subs && item.openFlag">
                            <li
                                class="sub-menu-item"
                                v-for="subitem in item.subs"
                                v-show="subitem.disappearEnv != $store.state.envInfo.env"
                                :key="subitem.name"
                            >
                                <router-link
                                    class="sub-menu-title"
                                    :to="{ path: subitem.link }"
                                    @click.native="clickMenu(subitem, subitem.name)"
                                >
                                    <span>{{subitem.name}}</span>
                                </router-link>
                            </li>
                        </ul>
                    </transition-collapse>
                </li>
            </ul>
        </nav>
        <section class="section">
            <div class="contentBreadcrumb">
                <Breadcrumb>
                    <breadcrumb-item v-for="bc in breadcrumbList" :key="bc.breadcrumbName">
                        <span
                            v-if="breadcrumbList.indexOf(bc) === breadcrumbList.length - 1"
                        >{{ bc.breadcrumbName }}</span>
                        <router-link v-else :to="bc.breadcrumbPath">{{ bc.breadcrumbName }}</router-link>
                    </breadcrumb-item>
                </Breadcrumb>
            </div>
            <div class="contentMain">
                <jt-loading v-if="loading" style="z-index:1000"></jt-loading>
                <router-view v-if="isRouterAlive" />
            </div>
        </section>
    </div>
</template>

<style lang="less" scoped>
@import "~@/assets/style/var.less";

.content {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
}
.nav-2nd {
    background: #fff;
    width: 180px;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    user-select: none;
    overflow-y: auto;
    .nav-2nd-tip {
        padding: 0 4px;
        .menu-icon {
            margin-right: 3px;
        }
        .menu-text {
            position: relative;
            bottom: 1px;
        }
        &:hover {
            color: @jt-color-primary;
        }
    }
    .nav-2nd-menu {
        li {
            cursor: pointer;
            position: relative;
            a {
                height: 40px;
                line-height: 40px;
                position: relative;
                display: block;
                &:hover {
                    background-color: #f5f8ff;
                }
                .menu-icon {
                    margin-right: 8px;
                    font-size: @jt-font-size-lger;
                }
                .menu-text {
                    position: relative;
                    bottom: 2px;
                }
                &.menu-actived {
                    border-width: 3px;
                    background-color: #eaf2ff;
                    color: #337dff;
                }
                .arrow-icon {
                    float: right;
                    width: 11px;
                    height: 11px;
                    margin-right: 18px;
                    color: #cccccc;
                }
                border-right: 0px solid #337dff;
                padding-left: 25px;
                color: @jt-color-text;
            }
            .sub-menu {
                .sub-menu-item {
                    height: 40px;
                    line-height: 40px;
                    .sub-menu-title {
                        display: block;
                        padding-left: 50px;
                        &.router-link-active {
                            border-width: 3px;
                            background-color: #eaf2ff;
                            color: #337dff;
                        }
                        &:hover {
                            background-color: #f5f8ff;
                        }
                    }
                }
            }
        }
    }
}
.nav-2nd-tip {
    display: block;
    height: 59px;
    line-height: 59px;
    margin: 0 16px;
    border-bottom: 1px solid #e9ebef;
    font-size: 12px;
    color: @jt-color-text-strong;
}
.section {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 180px;
    right: 0;
    overflow-y: auto;
}
.robotName {
    width: 84px;
    font-size: 14px;
    font-family: "PingFangSC-Regular, PingFang SC";
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
    font-family: "PingFangSC-Regular, PingFang SC";
    font-weight: 400;
    color: #999999;
    line-height: 18px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: block;
}
.headerText {
    width: 120px;
    height: 18px;
    font-size: 12px;
    font-family: "PingFangSC-Regular, PingFang SC";
    font-weight: 400;
    color: #555555;
    line-height: 20px;
    margin-left: 5px;
}
.headerText:hover {
    color: #5c9dff;
}
.contentBreadcrumb {
    background: #ffffff;
    height: 58px;
    padding: 19px;
    border-left: 1px solid #e9ebef;
    border-bottom: 1px solid #e9ebef;
}
.contentMain {
    width: 100%;
    position: absolute;
    top: 58px;
    bottom: 0px;
    padding: 20px 20px 40px 20px;
    display: flex;
}
</style>

<script>
import TransitionCollapse from "@/lib/transition-collapse.js";
import { Breadcrumb } from "ant-design-vue";
import RobotTestBtn from "./RobotTestBtn.vue";
import { mapState } from "vuex";

export default {
    name: "RobotHome",
    components: {
        "transition-collapse": TransitionCollapse,
        Breadcrumb,
        "breadcrumb-item": Breadcrumb.Item,
        RobotTestBtn
    },
    provide() {
        return {
            reload: this.reload
        };
    },
    data() {
        return {
            navs: [
                {
                    icon: "iconwendaku",
                    link: "libraryList",
                    name: "问答库",
                    disappearEnv: "none"
                },
                {
                    icon: "iconduihuajineng",
                    name: "对话技能",
                    disappearEnv: "none",
                    openFlag: true,
                    subs: [
                        {
                            link: "guideDialog",
                            name: "引导式对话",
                            disappearEnv: "none"
                        },
                        {
                            link: "sceneDialog",
                            name: "场景式对话",
                            disappearEnv: "none"
                        }
                    ]
                },
                {
                    icon: "iconyuzhijineng",
                    link: "presetSkills",
                    name: "预置技能",
                    disappearEnv: "none"
                },
                {
                    icon: "iconxunlian",
                    link: "robotDrill",
                    name: "机器人训练",
                    disappearEnv: "none"
                },
                {
                    icon: "iconyunyingguanli",
                    name: "运营管理",
                    disappearEnv: "none",
                    openFlag: true,
                    subs: [
                        {
                            link: "extRecommendation",
                            name: "扩展问推荐",
                            disappearEnv: "production"
                        },
                        {
                            link: "userLogs",
                            name: "用户日志",
                            disappearEnv: "none"
                        },
                        {
                            link: "dataStatistics",
                            name: "数据统计",
                            disappearEnv: "none"
                        }
                    ]
                },
                {
                    icon: "iconshujubiaozhu",
                    link: "dataAnnotation",
                    name: "数据标注",
                    disappearEnv: "production"
                }
            ],
            openMenuName: "",
            isRouterAlive: true,
            breadcrumbList: []
        };
    },
    mounted() {
        this.setOpenMenu();
    },
    computed: {
        ...mapState(["loading"])
    },
    watch: {
        $route() {
            this.setOpenMenu();
        },
        "$store.state.breadcrumb": function() {
            this.breadcrumbList = this.$store.state.breadcrumb;
        }
    },
    methods: {
        reload() {
            this.isRouterAlive = false;
            this.$nextTick(function() {
                this.isRouterAlive = true;
            });
        },
        setOpenMenu() {
            this.navs.forEach(menuItem => {
                if (menuItem.subs) {
                    menuItem.subs.forEach(subItem => {
                        if (this.$route.path.includes(subItem.link)) {
                            this.openMenuName = subItem.name;
                        }
                    });
                } else if (this.$route.path.includes(menuItem.link)) {
                    this.openMenuName = menuItem.name;
                }
            });
        },
        clickMenu(menuitem, menuName) {
            if (!menuitem.subs) {
                this.openMenuName = menuName;
            } else {
                menuitem.openFlag = !menuitem.openFlag;
            }
        }
    }
};
</script>
