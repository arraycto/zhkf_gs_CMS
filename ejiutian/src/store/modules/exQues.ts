import { axiosGet, axiosPost, axiosPut, axiosDelete } from "../../utils/http.js";
import API from '../../constant/api';
import COMMON from '../../constant/common';
import { getRandomNum } from "../../utils/common";

const state = {

    testUserlogData: [],
    proUserlogData: [],

    sQuesData: [],
    sQuesgetSim: {},
    simGetSques: {},
    simQuesData: [],
    addMessage: '',
    delMessage: '',
    addMessageEs: '',
    delMessageEs: '',

}

const mutations = {
    setTestUserlogData(state: any, payload: []) {
        state.testUserlogData = payload;
    },
    setProUserlogData(state: any, payload: []) {
        state.proUserlogData = payload;
    },

    setsQuesgetSim(state: any, payload: []) {
        state.sQuesgetSim = payload;
    },
    setsimGetSques(state: any, payload: []) {
        state.simGetSques = payload;
    },
    setsQuesData(state: any, payload: []) {
        state.sQuesData = payload;
    },
    setsimQuesData(state: any, payload: {}) {
        state.simQuesData = payload;
    },
    setaddMessage(state: any, payload: string) {
        state.addMessage = payload;
    },
    setaddMessageEs(state: any, payload: string) {
        state.addMessageEs = payload;
    },
    setdelMessage(state: any, payload: any) {
        state.delMessage = payload;
    },
    setdelMessageEs(state: any, payload: any) {
        state.delMessageEs = payload;
    },
}

const getters = {}

const actions = {
    userlogTestPost(context: any, paramUserlogTest: any) {
        const url = API.port9130.logList;
        const headers = {};
        const params = {
            "userid": getRandomNum(paramUserlogTest[0]),
            "botid": getRandomNum(paramUserlogTest[1]),
            "envType": 0,
            "startDate": paramUserlogTest[2],
            "endDate": paramUserlogTest[3],
        };
        const data = {};
        return new Promise((resolve, reject) => {
            context.commit('showLoading', {}, { root: true });
            axiosGet(url, params, data, headers).then((res: any) => {
                if (res.errno == 0) {
                    const testResult = [];
                    for(let i = 0; i < res.result.length; i ++) {
                        // console.log(res.result.length);
                        testResult.push({
                            id: res.result[i].userid,
                            question: res.result[i].uquestion,
                            content: res.result[i].squestion, 
                            message: res.result[i].answer,
                            type: res.result[i].cate,
                            time: res.result[i].vtime,
                            flag: res.result[i].flag
                        });
                    }
                    context.commit('setTestUserlogData', testResult)
                }
                context.commit('hideLoading', {}, { root: true });
                if (res.errno == '-101') {
                    context.commit('setGlobalFreeze', {}, { root: true });
                }
                resolve();
            }).catch(function (error) {
                context.commit('hideLoading', {}, { root: true });
                reject({ "errno": COMMON.commonErrorCode, "errorMsg": COMMON.commonErrorMsg });
            })
        })
    },
    userlogProducePost(context: any, paramUserlogPro: any) {
        const url = API.port9130.logList;
        const headers = {};
        const params = {
            "userid": getRandomNum(paramUserlogPro[0]),
            "botid": getRandomNum(paramUserlogPro[1]),
            "envType": 1,
            "startDate": paramUserlogPro[2],
            "endDate": paramUserlogPro[3],
        };
        const data = {};
        console.log(params)
        return new Promise((resolve, reject) => {
            context.commit('showLoading', {}, { root: true });
            axiosGet(url, params, data, headers).then((res: any) => {
                console.log(res);
                if (res.errno == 0) {
                    const proResult = [];
                    for(let i = 0; i < res.result.length; i ++) {
                        // console.log(res.result.length);
                        proResult.push({
                            id: res.result[i].userid,
                            question: res.result[i].uquestion,
                            content: res.result[i].squestion, 
                            message: res.result[i].answer,
                            type: res.result[i].cate,
                            time: res.result[i].vtime,
                            flag: res.result[i].flag
                        });
                    }
                    context.commit('setTestUserlogData', proResult)
                }
                context.commit('hideLoading', {}, { root: true });
                if (res.errno == '-101') {
                    context.commit('setGlobalFreeze', {}, { root: true });
                }
                resolve()
            }).catch(function (error) {
                context.commit('hideLoading', {}, { root: true });
                reject({ "errno": COMMON.commonErrorCode, "errorMsg": COMMON.commonErrorMsg });
            })
        })
    },
    getexQuesPost(context: any) {
        const url = API.port8000.questionAnswerList;
        const headers = {};
        const params = {};
        const data = {
            "userId": getRandomNum(context.rootState.userId),
            "botId": getRandomNum(context.rootState.robotInfo.robotId),
            "envType": 0
        };
        return new Promise((resolve, reject) => {
            context.commit('showLoading', {}, { root: true });
            axiosPost(url, params, data, headers).then((res: any) => {
                console.log(res);
                if(res.errno == 0){
                    const squesResult = [];
                    const sQuesgetSim = [];
                    for (let i = 0; i < res.result.faqList.length; i ++) {
                        squesResult.push({key: i, stQues: res.result.faqList[i].faqQuestion});
                        sQuesgetSim[res.result.faqList[i].faqQuestion] = {userId: context.rootState.userId, botId: context.rootState.robotInfo.robotId, sQuesId: res.result.faqList[i].faqId, sqIdmd5: res.result.faqList[i].faqSign, sQuesContent: res.result.faqList[i].faqQuestion};
                    }
                    context.commit('setsQuesData', squesResult);
                    console.log(squesResult)
                    context.commit('setsQuesgetSim', sQuesgetSim);
                    console.log(sQuesgetSim)
                    context.commit('hideLoading', {}, { root: true });
                    resolve({ "errno": 0, "errorMsg": "process has finished normally." })
                }
                if(res.errno == '-101') {
                    context.commit('hideLoading', {}, { root: true });
                    context.commit('setGlobalFreeze', {}, { root: true });
                }
            }).catch(function (error) {
                context.commit('hideLoading', {}, { root: true });
                reject({ "errno": COMMON.commonErrorCode, "errorMsg": COMMON.commonErrorMsg });
            })
        });
    },
    getSimQuesPost(context: any, paramGetSimques: any) {
        const url = API.port8880.simQuesList;
        const headers = {};
        const params = {
            "userid": getRandomNum(paramGetSimques.userId),
            "botid": getRandomNum(paramGetSimques.botId),
            "faqid": getRandomNum(paramGetSimques.sQuesId),
            "squestion":paramGetSimques.sQuesContent
        };
        console.log(params)
        const data = {};
        return new Promise((resolve, reject) => {
            axiosPost(url, params, data, headers).then((res: any) => {
                console.log(res);
                if(res.errno == 0){
                    const squesSim = [];
                    const simGetSquesdict = [];
                    for (let i = 0; i < res.result.length; i ++) {
                        squesSim.push({key: i, simQues: res.result[i].uquestion, status: res.result[i].evaluate});
                        simGetSquesdict[res.result[i].uquestion] = {uquesid:res.result[i].id, userId:paramGetSimques.userId, botId: paramGetSimques.botId, faqId: paramGetSimques.sQuesId, sqId: paramGetSimques.sqIdmd5, squestion:paramGetSimques.sQuesContent};
                    }
                    context.commit('setsimQuesData', squesSim);
                    context.commit('setsimGetSques', simGetSquesdict);
                    // console.log(simGetSquesdict)
                }
                if(res.errno == '-101') {
                    context.commit('setGlobalFreeze', {}, { root: true });
                }
                resolve()
            }).catch(function (error) {
                reject({ "errno": COMMON.commonErrorCode, "errorMsg": COMMON.commonErrorMsg });
            })
        });
    },
    addSimquesPost(context: any, userQuesid: string) {
        const url = API.port8880.addQues;
        const headers = {};
        const params = {
            "userid": getRandomNum(context.rootState.userId),
            "botid": getRandomNum(context.rootState.robotInfo.robotId),
            "id": userQuesid
        };
        console.log(params)
        const data = {};
        return new Promise((resolve, reject) => {
            axiosPost(url, params, data, headers).then((res: any) => {
                console.log(res);
                if(res.errno == 0){
                    context.commit('setaddMessage', res.errno.toString());
                }
                if(res.errno == '-101') {
                    context.commit('setGlobalFreeze', {}, { root: true });
                }
                resolve()
            }).catch(function (error) {
                reject({ "errno": COMMON.commonErrorCode, "errorMsg": COMMON.commonErrorMsg });
            })
        });
    },
    addSimquesPostES(context: any, paramadd: any) {
        const url = API.port40001.esAddorDel;
        const headers = {};
        const params = {};
        const data = {
            "action": "add",
            "status": 4,
            "data":[{
                "id": paramadd.uquesid,
                "faqid": getRandomNum(paramadd.faqId),
                "sqid": paramadd.sqId,
                "squestion": paramadd.squestion,
                "uquestion": paramadd.uquestion,
                "botid": getRandomNum(paramadd.botId),
                "userid": getRandomNum(paramadd.userId),
                "signer": getRandomNum(paramadd.userId),
                "evaluate": true,
                "status": 4,
                "delflag": "0"
            }]
        }
        console.log(data);
        return new Promise((resolve, reject) => {
            axiosPost(url, params, data, headers).then((res: any) => {
                console.log('添加ES中的相似问')
                console.log(res);
                if(res.err_code == 0){
                    context.commit('setaddMessageEs', res.err_code.toString());
                }
                if(res.err_code == '-101') {
                    context.commit('setGlobalFreeze', {}, { root: true });
                }
                resolve()
            }).catch(function (error) {
                reject({ "errno": COMMON.commonErrorCode, "errorMsg": COMMON.commonErrorMsg });
            })
        });
    },
    delSimquesPost(context: any, userQuesid: any) {
        const url = API.port8880.delQues;
        const headers = {};
        const params = {
            "userid": getRandomNum(context.rootState.userId),
            "botid": getRandomNum(context.rootState.robotInfo.robotId),
            "id": userQuesid
        };
        console.log(params)
        const data = {};
        return new Promise((resolve, reject) => {
            axiosPost(url, params, data, headers).then((res: any) => {
                console.log(res);
                if(res.errno == 0){
                    context.commit('setdelMessage', res.errno.toString());
                }
                if(res.errno == '-101') {
                    context.commit('setGlobalFreeze', {}, { root: true });
                }
                resolve()
            }).catch(function (error) {
                reject({ "errno": COMMON.commonErrorCode, "errorMsg": COMMON.commonErrorMsg });
            })
        });
    },
    delSimquesPostES(context: any, userQuesid: string) {
        const url = API.port40001.esAddorDel;
        const headers = {};
        const params = {};
        const data = {
            "userid": getRandomNum(context.rootState.userId),
            "botid": getRandomNum(context.rootState.robotInfo.robotId),
            "action": "delete",
            "status": 4,
            "data": [userQuesid]
        };
        // console.log(data)
        return new Promise((resolve, reject) => {
            axiosPost(url, params, data, headers).then((res: any) => {
                console.log('移除ES中的相似问')
                console.log(res);
                if(res.err_code == 0){
                    context.commit('setdelMessageEs', res.err_code.toString());
                }
                if(res.err_code == '-101') {
                    context.commit('setGlobalFreeze', {}, { root: true });
                }
                resolve()
            }).catch(function (error) {
                reject({ "errno": COMMON.commonErrorCode, "errorMsg": COMMON.commonErrorMsg });
            })
        });
    },
    searchSQuesPost(context: any, param: any) {
        const url = API.port50001.searchSQ;
        const headers = {};
        const params = {};
        const data = {
            "action": "get",
            "data": {
                "userid": getRandomNum(context.rootState.userId),
                "botid": getRandomNum(param[0]),
                "keyword": param[1],
                "size": 500,
                "from": 0
            }
        };
        console.log(data)
        return new Promise((resolve, reject) => {
            context.commit('showLoading', {}, { root: true });
            axiosPost(url, params, data, headers).then(function (res) {
                console.log(res)
                if (res.err_code == 0){
                    const searchQues = [];
                    const sQuesgetSim = [];
                    for (let i = 0; i < res.result.length; i ++){
                        searchQues.push({key: i, stQues: res.result[i].squestion});
                        sQuesgetSim[res.result[i].squestion] = {userId: context.rootState.userId, botId: param[0], sQuesId: res.result[i].id, sQuesContent: res.result[i].squestion};
                    }
                    console.log(searchQues);
                    context.commit('setsQuesData', searchQues);
                    context.commit('setsQuesgetSim', sQuesgetSim);
                    console.log(sQuesgetSim)  
                }
                context.commit('hideLoading', {}, { root: true });
                if(res.err_code == '-101') {
                    context.commit('setGlobalFreeze', {}, { root: true });
                }
                resolve()
            }).catch(function (error) {
                context.commit('hideLoading', {}, { root: true });
                reject({ "errno": COMMON.commonErrorCode, "errorMsg": COMMON.commonErrorMsg });
            })
        });
    },
}

export default {
    state,
    mutations,
    actions,
    getters,
    namespaced: true,
}