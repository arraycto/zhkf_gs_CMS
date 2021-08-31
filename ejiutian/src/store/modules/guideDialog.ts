import { axiosGet, axiosPost, axiosPut, axiosDelete } from "@/utils/http.js";
import API from '@/constant/api';
import { getRandomNum } from "@/utils/common";

const state = {
    guideList: [],
    intentionsList:[],
    intentionsDetail: {
        standardQuestion: "",
        similarQuestion: [""],
        keyWord: [""],
        answer: "",
    },
    questionandanswer:[],
    detailMode: '',
    tablelead: false,
    delList:[],
    delListTS:[]
}

const mutations = {
    setGuideList(state: any, payload: object[]) {
        state.guideList = payload;
    },
    setIntentionsList(state: any, payload: object[]) {
        state.intentionsList = payload;
    },
    setIntentionDetail(state: any, payload: any) {
        state.intentionsDetail.standardQuestion = payload.topics; //意图
        state.intentionsDetail.similarQuestion = payload.similarTopics; //相似意图
        state.intentionsDetail.keyWord = payload.words; //关键词
        state.intentionsDetail.answer = payload.text; //引导话术
        state.questionandanswer = payload.content;
    },
    setDetailMode(state: any, mode: string) {
        state.detailMode = mode;
    },
    setTablelead(state: any, newName: string){
        state.tablelead = newName;
    },
    setDelList(state: any, del: string) {
        state.delList.push(del);
    },
    clearDelList(state: any) {
        state.delList = [];
    },
    setDelListTS(state: any, del: string) {
        state.delListTS.push(del)
    },
    clearDelListTS(state: any) {
        state.delListTS = [];
    }
}

const getters = {}

const actions = {
    //意图数量
    addIntent(context: any){
        const url = API.port5001.host + '/api/user/intent/count';
        const headers = {};
        const params = {
            'userid': getRandomNum(context.rootState.userId),
            'botid': getRandomNum(context.rootState.robotInfo.robotId)
        };
        return axiosGet(url, params, null, headers).then((res)=>{
            if(res.code == '-101') {
                context.commit('setGlobalFreeze', {}, { root: true });
            }else {
                const tablelead  =  res.data.ok
                context.commit('setTablelead', tablelead)
            }
        });

    },
    queryGuideList(context: any, args: any) {
        const url = API.port5001.host+"/api/skill/query";
        const headers = {};
        const params = {
            'envType':args.envType,
            'userid': getRandomNum(context.rootState.userId),
            'botid': getRandomNum(args.robotId),
            'type': '0',
            'startDate': args.startDate,
            'endDate': args.endDate,
            'keyWord': args.keyWord
        };
        const data = {};
        return new Promise((resolve, reject) => {
            context.commit('showLoading', {}, { root: true });
            axiosGet(url, params, data, headers).then(function (response) {
                if (response.code == 0) {
                    context.commit('setGuideList', response.data);
                    resolve({ "errno": 0, "errorMsg": response.msg });
                }else if(response.code == '-101') {
                    context.commit('setGlobalFreeze', {}, { root: true });
                }else {
                    resolve({ "errno": 1, "errorMsg": response.msg });
                }
                context.commit('hideLoading', {}, { root: true });
            }).catch(function (error) {
                context.commit('hideLoading', {}, { root: true });
                resolve({ "errno": 999, "errorMsg": "系统繁忙，请稍后重试。" });
            })
        })
    },
    queryIntentionsList(context: any, args: any) {
        const url = API.port5001.host+"/api/guide/query";
        const headers = {};
        const params = {
            'envType': args.envType,
            'skillid': args.skillid,
            'startDate': args.startDate,
            'endDate': args.endDate,
            'keyWord': args.keyWord,
            'userid': getRandomNum(context.rootState.userId),
            'botid': getRandomNum(context.rootState.robotInfo.robotId),
        };
        const data = {};
        return new Promise((resolve, reject) => {
            context.commit('showLoading', {}, { root: true });
            axiosGet(url, params, data, headers).then(function (response) {
                if (response.code == 0 ) {
                    context.commit('setIntentionsList', response.data);
                    resolve({ "errno": 0, "errorMsg": response.msg });
                }else if(response.code == '-101') {
                    context.commit('setGlobalFreeze', {}, { root: true });
                }else{
                    resolve({ "errno": 1, "errorMsg": response.msg });
                }
                context.commit('hideLoading', {}, { root: true });
            }).catch(function (error) {
                context.commit('hideLoading', {}, { root: true });
                resolve({ "errno": 999, "errorMsg": "系统繁忙，请稍后重试。" });
            })
        })
    },
    queryIntentionDetail(context: any, args: any) {
        // todo
        const url = API.port5001.host+"/api/guide/query/"+args.skillid;
        const headers = {};
        const params = {
            'envType': args.envType,
            'userid': getRandomNum(context.rootState.userId),
            'botid': getRandomNum(context.rootState.robotInfo.robotId),
        };
        const data = {};
        return new Promise((resolve, reject) => {
            axiosGet(url, params, data, headers).then(function (response) {
                if (response.code == 0) {
                    context.commit('setIntentionDetail', response.data);
                    resolve({ "errno": 0, "errorMsg": response.msg });
                }else if(response.code == '-101') {
                    context.commit('setGlobalFreeze', {}, { root: true });
                }else{
                    resolve({ "errno": 1, "errorMsg": response.msg });
                }
                // context.commit('hideLoading', {}, { root: true });
            }).catch(function (error) {
                resolve({ "errno": 999, "errorMsg": "系统繁忙，请稍后重试。" });
            })
        })
    },
    addGuideDetail(context: any, guideDetail: any) {
        // todo
        const url = API.port5001.host+"/api/skill/update";
        const headers = {};
        const params = {};
        const data = guideDetail;
        return new Promise((resolve) => {
            axiosPost(url, params, data, headers).then(function (response) {
                if (response.code == 0) {
                    resolve({ "errno": 0, "errorMsg": response.msg });
                }else if(response.code == '-101') {
                    context.commit('setGlobalFreeze', {}, { root: true });
                }else {
                    resolve({ "errno": 1, "errorMsg": response.msg });
                }
            }).catch(function (error) {
                resolve({ "errno": 999, "errorMsg": "系统繁忙，请稍后重试。" });
            })
        })
    },
    addIntentionsDetail(context: any, intentionsDetail: any) {
        // todo
        const url = API.port5001.host+"/api/guide/update";
        const headers = {};
        const params = {};
        const data = intentionsDetail;
        return new Promise((resolve) => {
            axiosPost(url, params, data, headers).then(function (response) {
                if (response.code == 0) {
                    resolve({ "errno": 0, "errorMsg": response.msg });
                }else if(response.code == '-101') {
                    context.commit('setGlobalFreeze', {}, { root: true });
                }else {
                    resolve({ "errno": 1, "errorMsg": response.msg });
                }
            }).catch(function (error) {
                resolve({ "errno": 999, "errorMsg": "系统繁忙，请稍后重试。" });
            })
        })
    },
    deleteGuide(context: any,skillid: any){
        const url = API.port5001.host+"/api/skill/remove";
        const headers = {};
        const params = {
            'ids':skillid,
            'type': '0',
            'userid': getRandomNum(context.rootState.userId),
            'botid': getRandomNum(context.rootState.robotInfo.robotId),
        };
        return new Promise((resolve) => {
            axiosDelete(url, params,{}, headers).then(function (response) {
                if (response.code == 0) {
                    resolve({ "errno": 0, "errorMsg": response.msg });
                }else if(response.code == '-101') {
                    context.commit('setGlobalFreeze', {}, { root: true });
                }else {
                    resolve({ "errno": 1, "errorMsg": response.msg });
                }
            }).catch(function (error) {
                resolve({ "errno": 999, "errorMsg": "系统繁忙，请稍后重试。" });
            })
        })
    },
    deleteIntention(context: any,skillid: any){
        const url = API.port5001.host+"/api/guide/remove";
        const headers = {};
        const params = {
            'ids':skillid,
            'userid': getRandomNum(context.rootState.userId),
            'botid': getRandomNum(context.rootState.robotInfo.robotId),
        };
        return new Promise((resolve) => {
            axiosDelete(url, params, headers).then(function (response) {
                if (response.code == 0) {
                    resolve({ "errno": 0, "errorMsg": response.msg });
                }else if(response.code == '-101') {
                    context.commit('setGlobalFreeze', {}, { root: true });
                }else {
                    resolve({ "errno": 1, "errorMsg": response.msg });
                }
            }).catch(function (error) {
                resolve({ "errno": 999, "errorMsg": "系统繁忙，请稍后重试。" });
            })
        })
    }
}

export default {
    state,
    mutations,
    actions,
    getters,
    namespaced: true,
}