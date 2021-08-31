import Vue from 'vue'
import Vuex from 'vuex'
import PersistedState from "vuex-persistedstate"

import shujutongji from './modules/shujutongji';
import questionAnswer from './modules/questionAnswer';
import guideDialog from './modules/guideDialog';
import testEnv from './modules/testEnv';
import platform from './modules/platform';
import exQues from './modules/exQues';
import productionEnv from './modules/productionEnv';
import robotSet from './modules/robotSet';
import presetSkill from './modules/presetSkill';
import dataAnnotation from './modules/dataAnnotation';
import uploadFile from './modules/uploadFile';
import robotDrill from './modules/robotDrill';

import actions from './actions';
import mutations from './mutations';
import { getTokenSub } from "@/utils/http.js";

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        userId: '',
        userType: 0, //0政企1互联网
        envInfo: {
            env: '',
            envName: ''
        },
        robotInfo: {
            robotId: '',
            robotName: ''
        },
        fromPath: '',
        loading: true,
        userinfo: {
            authoritys: [],
            customerId: '',
            customerType: '',
            id: '',
            isCustomer: undefined,
            username: 'user001',
        },
        breadcrumb: [],
        requestid: '',
        globalFreeze: false,
        //右下角校验弹窗
        isCheck: false,
        checkData :[
            // {filename: 'test0',result: '0',resultname: '校验通过'},
            // {filename: 'test1',result: '1',resultname: '校验未通过'},
            // {filename: 'test2',result: '2',resultname: '校验中'}
        ]
    },
    mutations: {
        setUserId(state, userId) {
            state.userId = userId
        },
        setUserName(state, userName) {
            state.userinfo.username = userName
        },
        setEnvInfo(state, env) {
            if (env !== '' && typeof env !== 'undefined') {
                state.envInfo = {
                    env: env,
                    envName: env === 'test' ? '测试环境' : '生产环境'
                }
                state.fromPath = (env === 'test' ? '/home/testEnv' : '/home/productionEnv')
            }
        },
        setRobotInfo(state, robotInfo) {
            if (robotInfo.robotId !== '' && typeof robotInfo.robotId !== 'undefined') {
                state.robotInfo = {
                    robotId: robotInfo.robotId,
                    robotName: robotInfo.robotName
                }
            }
        },
        setBreadcrumb(state, breadcrumb) {
            state.breadcrumb = breadcrumb
        },
        showLoading(state) {
            state.loading = true
        },
        hideLoading(state) {
            state.loading = false
        },
        setGlobalFreeze(state) {
            state.globalFreeze = true
        },
        setIsCheck(state, isCheck) {
            state.isCheck = isCheck
        },
        setCheckData(state, checkData) {
            state.checkData = checkData
        },
        ...mutations
    },
    getters: {
    },
    actions,
    modules: {
        shujutongji,
        questionAnswer,
        guideDialog,
        testEnv,
        platform,
        exQues,
        productionEnv,
        robotSet,
        presetSkill,
        dataAnnotation,
        uploadFile,
        robotDrill
    },
    plugins: [
        PersistedState({
            storage: window.sessionStorage,
            reducer(val) {
                return {
                    envInfo: val.envInfo,
                    robotInfo: val.robotInfo,
                    fromPath: val.fromPath,
                    userId: val.userId,
                    breadcrumb: val.breadcrumb
                }
            }
        })
    ]
});

export default store;
