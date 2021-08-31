import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Home from "../views/Home.vue";
// import Login from '../views/login/index.vue'
// import Forget from '../views/login/component/forget.vue'
// import Register from '../views/login/component/register.vue'
// import ChangePassword from '../views/login/component/changePassword.vue'
// import RetrievePassword from '../views/login/component/retrievePassword.vue'
import RobotHome from "../views/robot/questionAnswer/RobotHome.vue";
import Cookies from "js-cookie";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
    // {path: '/login', name:'Login', component: Login},
    // {path: '/forget', name:'Forget', component: Forget},
    // {path: '/register', name:'Register', component: Register},
    // {path: '/retrievePassword', name:'RetrievePassword', component: RetrievePassword},
    // {path: '/changePassword', name:'RetrievePassword', component: ChangePassword},
    {
        path: "/",
        redirect: "home"
    },
    {
        path: "/home",
        name: "Home",
        component: Home,
        children: [
            {
                path: "/",
                redirect: "controlPlatform"
            },
            {
                path: "controlPlatform",
                name: "ControlPlatform",
                component: () =>
                    import(
                        /* webpackChunkName: "test" */ "../views/platform/controlPlatform.vue"
                    ),
                children: [
                    {
                        path: "/",
                        redirect: "platform-index"
                    },
                    {
                        path: "platform-index",
                        name: "platform-index",
                        component: () =>
                            import("../views/platform/platform-index.vue")
                    },
                    {
                        path: "test-env-detail",
                        name: "test-env-detail",
                        component: () =>
                            import("../views/platform/test-env-detail.vue")
                    },
                    {
                        path: "production-env-detail",
                        name: "production-env-detail",
                        component: () =>
                            import(
                                "../views/platform/production-env-detail.vue"
                            )
                    },
                    {
                        path: "userConfig",
                        name: "userConfig",
                        component: () => import("../views/user/Account.vue")
                    }
                ]
            },
            {
                path: "testEnv",
                name: "TestEnv",
                component: () =>
                    import(
                        /* webpackChunkName: "test" */ "../views/robot/testEnv.vue"
                    )
            },
            {
                path: "productionEnv",
                name: "ProductionEnv",
                component: () =>
                    import(
                        /* webpackChunkName: "test" */ "../views/robot/productionEnv.vue"
                    )
            },
            // {
            //     path: 'custom-order',
            //     name: 'custom-order',
            //     component: () => import(/* webpackChunkName: "test" */ '../views/platform/custom-order.vue')
            // },
            {
                path: "robotHome",
                component: RobotHome,
                children: [
                    {
                        path: "/",
                        redirect: "libraryList"
                    },
                    {
                        path: "libraryList",
                        name: "libraryList",
                        component: () =>
                            import(
                                /* webpackChunkName: "test" */ "../views/robot/questionAnswer/LibraryList.vue"
                            )
                    },
                    {
                        path: "importDetail",
                        name: "importDetail",
                        component: () =>
                            import(
                                /* webpackChunkName: "test" */ "../views/robot/questionAnswer/ImportDetail.vue"
                            )
                    },
                    {
                        path: "questionAnswer",
                        name: "questionAnswer",
                        component: () =>
                            import(
                                /* webpackChunkName: "test" */ "../views/robot/questionAnswer/QuestionAnswer.vue"
                            )
                    },
                    {
                        path: "guideDialog",
                        name: "guideDialog",
                        component: () =>
                            import(
                                /* webpackChunkName: "test" */ "../views/robot/dialog/guide/List.vue"
                            )
                    },
                    {
                        path: "Information",
                        name: "Information",
                        component: () =>
                            import(
                                /* webpackChunkName: "test" */ "../views/robot/dialog/guide/Information.vue"
                            )
                    },
                    {
                        path: "Create",
                        name: "Create",
                        component: () =>
                            import(
                                /* webpackChunkName: "test" */ "../views/robot/dialog/guide/Create.vue"
                            )
                    },
                    {
                        path: "sceneDialog",
                        name: "sceneDialog",
                        component: () =>
                            import(
                                /* webpackChunkName: "test" */ "../views/robot/dialog/scene/skillList.vue"
                            )
                    },
                    {
                        path: "sceneIntent",
                        name: "sceneIntent",
                        component: () =>
                            import(
                                /* webpackChunkName: "test" */ "../views/robot/dialog/scene/intentList.vue"
                            )
                    },
                    {
                        path: "AddsceneIntent",
                        name: "addsceneIntent",
                        component: () =>
                            import(
                                /* webpackChunkName: "test" */ "../views/robot/dialog/scene/intentAdd.vue"
                            )
                    },
                    {
                        path: "presetSkills",
                        name: "presetSkills",
                        component: () =>
                            import(
                                /* webpackChunkName: "test" */ "../views/robot/presetSkill/presetSkills.vue"
                            )
                    },
                    {
                        path: "robotDrill",
                        name: "robotDrill",
                        component: () =>
                            import(
                                /* webpackChunkName: "test" */ "../views/robot/robotDrill/index.vue"
                            )
                    },
                    {
                        path: "extRecommendation",
                        name: "extRecommendation",
                        component: () =>
                            import(
                                /* webpackChunkName: "test" */ "../views/robot/operationMgt/expansionQuestion/Qarectable.vue"
                            )
                    },
                    {
                        path: "userLogs",
                        name: "userLogs",
                        component: () =>
                            import(
                                /* webpackChunkName: "test" */ "../views/robot/operationMgt/userLog/Testuserlog.vue"
                            )
                    },
                    {
                        path: "dataStatistics",
                        name: "dataStatistics",
                        component: () =>
                            import(
                                /* webpackChunkName: "test" */ "../views/robot/operationMgt/dataStatistics/Echarts.vue"
                            )
                    },
                    {
                        path: "dataAnnotation",
                        name: "dataAnnotation",
                        component: () =>
                            import(
                                /* webpackChunkName: "test" */ "../views/robot/dataAnnotation/dataAnnotation.vue"
                            )
                    }
                ]
            },
            {
                path: "robotSet",
                name: "robotSet",
                component: () => import("../views/robot/robotSet.vue")
            }
        ]
    }
    // {
    //     path: '/custom-order',
    //     name: 'custom-order',
    //     component: () => import(/* webpackChunkName: "test" */ '../views/platform/custom-order.vue')
    // },
    // {
    //     path: '/custom-renewal',
    //     name: 'custom-renewal',
    //     component: () => import(/* webpackChunkName: "test" */ '../views/platform/custom-renewal.vue')
    // },
    // {
    //     path: '/custom-change',
    //     name: 'custom-change',
    //     component: () => import(/* webpackChunkName: "test" */ '../views/platform/custom-change.vue')
    // },
    // {
    //     path: '/custom-market',
    //     name: 'custom-market',
    //     component: () => import(/* webpackChunkName: "test" */ '../views/platform/custom-market.vue')
    // },
    // {
    //     path: '/order-result',
    //     name: 'order-result',
    //     component: () => import(/* webpackChunkName: "test" */ '../views/platform/order-result.vue')
    // },
    // {
    //     path: '/market-result',
    //     name: 'market-result',
    //     component: () => import(/* webpackChunkName: "test" */ '../views/platform/market-result.vue')
    // }
];

const router = new VueRouter({
    routes
});

// 注册一个全局的前置导航守卫
import store from "@/store/index.ts";
import { axiosPost } from "@/utils/http.js";
// import { getTokenSub } from "@/utils/http.js";

router.beforeEach((to, from, next) => {
    // const user = window.sessionStorage.getItem('token')
    // const userId =
    // if (to.path !== '/login' && !user) return next('/login')
    // next()
    console.log("看cookie里有什么:::", Cookies.get());
    console.log("url传参:::", to.query);
    // 本地测试cookies
    // Cookies.set("authkey","414a81a801f29153dee3e3dea1f415a2512cfbd0ba33ea8bbf6fe34673648c50e72e5a22e144b589df59b619fc46d5ea63fd5be7d398b8ae03260ba7c81c0518853f360d941d117456c6940ba3cf755284a6685c0a6e0899214599621a0f90bb7b7d261149af100daf5ae445531ace3125bfaff1b37c5674fee55456b3b5d75646ad7cb7a52399589891a4f27ae09781a51304ac4e2d9cdf11225554f4de845d0fb59cadc6eb2d0e26dded3e37040996");
    // Cookies.set("corpid","wwff36a2a89e798d55")
    // Cookies.set("userid","CIDC-U-5193e4d65fbd11eb9591005056a96364")
    // Cookies.set("exprietime","10000")
    // Cookies.set("username","中复-李士雄")
    if (to.query.authkey) {
        if (Cookies.get("authkey")) {
            Cookies.remove("authkey");
        }
        Cookies.set("authkey", to.query.authkey);
        const url = "/port9080/lua_trigger";
        const params = {};
        const data = {
            authkey: Cookies.get("authkey")
        };
        const headers = {};
        axiosPost(url, params, data, headers).then(res => {
            // store.commit("setUserId", "CIDC-U-" + getTokenSub());
            if(store.state.userId) {
                store.commit("setUserId", "");
            }
            if(Cookies.get("userid")) {
                store.commit("setUserId",Cookies.get("userid"));
            }
            if (store.state.userinfo.username) {
                store.commit("setUserName", "");
            }
            if (Cookies.get("username")) {
                store.commit("setUserName", Cookies.get("username"));
            }
            store.state.userId && store.state.userinfo.username && next();
            console.log("取到url传参:::", Cookies.get());
        })
    } else if (Cookies.get("authkey")) {
        // store.commit("setUserId", "CIDC-U-" + getTokenSub());
        if(store.state.userId) {
            store.commit("setUserId", "");
        }
        if(Cookies.get("userid")) {
            store.commit("setUserId",Cookies.get("userid"));
        }
        if (store.state.userinfo.username) {
            store.commit("setUserName", "");
        }
        if (Cookies.get("username")) {
            store.commit("setUserName", Cookies.get("username"));
        }
        store.state.userId && store.state.userinfo.username && next();
    }
});

export default router;
