import { axiosGet, axiosPost, axiosPut, axiosDelete } from "../../utils/http.js";
import API from '../../constant/api';
import {getRandomNum} from "../../utils/common";

const state = {
    showpreKeyWords: [],
    addkeywordsuccess:1,
    showCache:[
        /* {
            cache:"话费查询",
            question:"话费怎么这么多？"
        },
        {
            cache:"话费查询",
            question:"话费余额还剩多少？"
        }, */
    ],
    addCachesuccess:1,
    addCacheEssuccess:1,
    addCacheRedissuccess:106,
    addKeywordsRedissuccess:106,
    robotsetsuccess:1,
    addrobotsuccess:106,
    initdata:{},
    robothotquestion : [],
    Esquery:[],
}

const mutations = {
    setpreKeyWords(state: any, payload: object[]) {
        state.showpreKeyWords = payload;
    },
    setaddkeywordsuccess(state: any, success: any) {
        state.addkeywordsuccess = success;
    },
    setCache(state: any, payload: object[]) {
        state.showCache = payload;
    },
    setaddCachesuccess(state: any, success: any) {
        state.addCachesuccess = success;
    },
    setaddCacheEssuccess(state: any, success: any) {
        state.addCacheEssuccess = success;
    },
    setaddCacheRedissuccess(state: any, success: any) {
        state.addCacheRedissuccess = success;
    },
    setaddKeywordsRedissuccess(state: any, success: any) {
        state.addKeywordsRedissuccess = success;
    },
    setrobotsetsuccess(state: any, success: any) {
        state.robotsetsuccess = success;
    },
    setrobot(state: any, success: any) {
        state.initdata = success[0];
        state.robothotquestion = success[1];
    },
    setaddRobotRedissuccess(state: any, success: any) {
        state.addrobotsuccess = success;
    },
    setEsquery(state: any, success: any) {
        state.Esquery = success;
    },
    
}

const getters = {}

const actions = {
    querypreKeyWords(context: any, robotmes: any) {
        const url = API.port9093.KeyWords;
        const headers = {};
        const params = {
            "op":"search"
        };
        const data = {
            "botid": getRandomNum(robotmes[0]),
            "env": robotmes[1],
            "userid": getRandomNum(robotmes[2])
        };
        return new Promise((resolve) => {
            context.commit('showLoading', {}, { root: true });
            axiosPost(url, params, data, headers).then((res: any) => {
                if (res.errno == 0) {   
                    const showpreKeyWords: any = []
                    for (const item of res.result) {
                        showpreKeyWords.push({
                            keywords: item.forekeyword,
                            question: item.squestion,
                            faqid: item.faqid,
                        })
                    }
                    context.commit('setpreKeyWords', showpreKeyWords);
                }
                context.commit('hideLoading', {}, { root: true });
                if(res.errno == '-101') {
                    context.commit('setGlobalFreeze', {}, { root: true });
                }
                resolve({"errno": res.errno});
            }).catch(function (error) {
                context.commit('hideLoading', {}, { root: true });
                resolve({"errno": 999});
            })
        })
    },
    addpreKeyWords(context: any,robotmes: any) {
        const url = API.port9093.KeyWords;
        const headers = {};
        const params = {
            "op":"add"
        };
        const data = {
            "botid" : getRandomNum(robotmes[0]),
            "data": robotmes[1],
            "env":robotmes[2]
        }
        return new Promise((resolve) => {
            context.commit('showLoading', {}, { root: true });
            axiosPost(url, params, data, headers).then((res: any) => {  
                context.commit('hideLoading', {}, { root: true });  
                context.commit('setaddkeywordsuccess', res.errno);
                if(res.errno == '-101') {
                    context.commit('setGlobalFreeze', {}, { root: true });
                }
                resolve()
            }).catch(function (error) {
                context.commit('hideLoading', {}, { root: true });
                context.commit('setaddkeywordsuccess', 999);
                resolve();
            })
        })
    },
    queryCache(context: any,robotmes: any) {
        const url = API.port9091.Cache;
        const headers = {};
        const params = {
            "op":"search"
        };
        const data = {    
            "botid": getRandomNum(robotmes[0]),
            "env": robotmes[1],
            "userid":getRandomNum(robotmes[2])
        };
        return new Promise((resolve) => {
            context.commit('showLoading', {}, { root: true });
            axiosPost(url, params, data, headers).then((res: any) => { 
                if (res.errno == 0) {   
                    const showCache: any = []
                    for (const item of res.result) {    
                        showCache.push({
                            Cache: item.uquestion,
                            question: item.squestion,
                            faqid:item.faqid,
                        })
                    }
                    context.commit('setCache', showCache);
                }
                context.commit('hideLoading', {}, { root: true });
                if(res.errno == '-101') {
                    context.commit('setGlobalFreeze', {}, { root: true });
                }
                resolve({"errno": res.errno});
            }).catch(function (error) {
                context.commit('hideLoading', {}, { root: true });
                resolve({"errno": 999});
            })
        })
    },
    addCache(context: any,robotmes: any) {
        const url = API.port9091.Cache;
        const headers = {};
        const params = {
            "op":"add"
        };
        const data = {
            "botid" : getRandomNum(robotmes[0]),
            "data": robotmes[1],
            "env":robotmes[2]
        }
        return new Promise((resolve) => {
            context.commit('showLoading', {}, { root: true });
            axiosPost(url, params, data, headers).then((res: any) => {   
                //console.log("错误信息："+res.errMsg)
                context.commit('hideLoading', {}, { root: true });
                context.commit('setaddCachesuccess', res.errno);
                if(res.errno == '-101') {
                    context.commit('setGlobalFreeze', {}, { root: true });
                }
                resolve()
            }).catch(function (error) {
                context.commit('hideLoading', {}, { root: true });
                context.commit('setaddCachesuccess', 999);
                resolve();
            })
        })
    },
    addCacheEs(context: any,robotmes: any) {
        const url = API.port40001.CacheEs;
        const headers = {};
        const params = {
            
        };
        const data = {
            "action": robotmes[0],
            "botid" : getRandomNum(robotmes[1]),
            "status": robotmes[2],
            "data": robotmes[3],
        }
        return new Promise((resolve) => {
            context.commit('showLoading', {}, { root: true });
            axiosPost(url, params, data, headers).then((res: any) => {
                context.commit('hideLoading', {}, { root: true });    
                context.commit('setaddCacheEssuccess', res.err_code);
                if(res.err_code == '-101') {
                    context.commit('setGlobalFreeze', {}, { root: true });
                }
                resolve()
            }).catch(function (error) {
                context.commit('hideLoading', {}, { root: true });
                context.commit('setaddCacheEssuccess', 999);
                resolve();
            })
        })
    },
    addCacheRedis(context: any,robotmes: any) {
        const url = API.port6657.CacheRedis;
        const headers = {};
        const params = { 
            
        };
        const data = {
            "sqIds":robotmes[0],
            "botid":getRandomNum(robotmes[1]),
            "uqs":robotmes[2],
            "faqid":robotmes[3],//list，vue中添加
            "userid":getRandomNum(robotmes[4])
        }
        return new Promise((resolve) => {
            context.commit('showLoading', {}, { root: true });
            axiosPost(url, params, data, headers).then((res: any) => {     
                context.commit('hideLoading', {}, { root: true });
                context.commit('setaddCacheRedissuccess', res.errno);
                if(res.errno == '-101') {
                    context.commit('setGlobalFreeze', {}, { root: true });
                }
                resolve()
            }).catch(function (error) {
                context.commit('hideLoading', {}, { root: true });
                context.commit('setaddCacheRedissuccess', 999);
                resolve();
            })
        })
    },
    addKeywordsRedis(context: any,robotmes: any) {
        const url = API.port6757.KeyWordsRedis;
        const headers = {};
        const params = {
            
        };
        const data = {
            "sqIds":robotmes[0],
            "botid":getRandomNum(robotmes[1]),
            "keywords":robotmes[2],
            "faqid":robotmes[3],//list，vue文件中添加
            "userid":getRandomNum(robotmes[4])
        }
        return new Promise((resolve) => {
            context.commit('showLoading', {}, { root: true });
            axiosPost(url, params, data, headers).then((res: any) => {   
                context.commit('hideLoading', {}, { root: true });
                context.commit('setaddKeywordsRedissuccess', res.errno);
                if(res.errno == '-101') {
                    context.commit('setGlobalFreeze', {}, { root: true });
                }
                resolve()
            }).catch(function (error) {
                context.commit('hideLoading', {}, { root: true });
                context.commit('setaddKeywordsRedissuccess', 999);
                resolve();
            })
        })
    },
    robotset(context: any,robotmes: any) {
        const url = API.port9099.robotset;
        const headers = {};
        const params = { 
            
        };
        const data = {
            "envType": robotmes[0],
            "userid": getRandomNum(robotmes[1]),
            "botid": getRandomNum(robotmes[2]),
            "name": {
                "modif": 1,
                "content": robotmes[3]
            },
            "mTelno": {
                "modif": 1,
                "content": robotmes[8]
            },
            "desc": {
                "modif": 1,
                "content": robotmes[4]
            },
            "welcomereply": {
                "modif": 1,
                "content":robotmes[5]
            },
            "defaultreply": {
                "modif": 1,
                "content":robotmes[6]
            },
            "hotquestion": {
                "modif": 1,
                "content": robotmes[7]
            }
        }
        return new Promise((resolve) => {
            context.commit('showLoading', {}, { root: true });
            axiosPost(url, params, data, headers).then((res: any) => { 
                //console.log("机器人设置："+res.errMsg)
                context.commit('hideLoading', {}, { root: true });
                context.commit('setrobotsetsuccess', res.errno);
                if(res.errno == '-101') {
                    context.commit('setGlobalFreeze', {}, { root: true });
                }
                resolve()
            }).catch(function (error) {
                context.commit('hideLoading', {}, { root: true });
                context.commit('setrobotsetsuccess', 999);
                resolve();
            })
        })
    },
    queryRobot(context: any,robotmes: any) {
        const url = API.port9099.viewpage;
        const headers = {};
        const params = {
            
        };
        const data = {
            "envType":robotmes[0],
            "userid":getRandomNum(robotmes[1]),
            "botid":getRandomNum(robotmes[2])
        };
        return new Promise((resolve) => {
            context.commit('showLoading', {}, { root: true });
            axiosPost(url, params, data, headers).then((res: any) => {
                if (res.errno == 0) {
                    const robotList: any = {};
                    const robothotquestion: any = [];
                    robotList.defaultreply = res.result.defaultreply;
                    robotList.welcomereply = res.result.welcomereply;
                    robotList.mtelno = res.result.mtelno;
                    robotList.vtelno = res.result.vtelno;
                    //robotList.hotquestion = res.result.hotquestion;
                    
                    for(let i = 0 ; i < res.result.hotquestion.length ; i ++){
                        robothotquestion.push({
                            label: res.result.hotquestion[i],
                            value:res.result.faqids[i],
                        })
                    }
                    context.commit('setrobot', [robotList,robothotquestion]);   
                }
                context.commit('hideLoading', {}, { root: true });
                if(res.errno == '-101') {
                    context.commit('setGlobalFreeze', {}, { root: true });
                }
                resolve({"errno": res.errno});
            }).catch(function (error) {
                context.commit('hideLoading', {}, { root: true });
                resolve({"errno": 999});
            })
        })
    },
    addRobotRedis(context: any,robotmes: any) {
        const url = API.port6857.robot;
        const headers = {};
        const params = {
        
        };
        const data = {
            "userId":getRandomNum(robotmes[0]),
            "botid":getRandomNum(robotmes[1]),
            "usertype":robotmes[2],
            "addtime":robotmes[3],
            "botdescription":robotmes[4],
            "flag":robotmes[5],
            "status":robotmes[6],
            "defaultreply":robotmes[7],
            "endreply":"",
            "welcomereply":robotmes[8],
            "hotquestionText":robotmes[9],
            "hotquestion":robotmes[10],
            "mTelNo": robotmes[11],
            "idioms":"0",
            "joke":"0",
            "geo":"0"            
        }
        return new Promise((resolve) => {
            context.commit('showLoading', {}, { root: true });
            axiosPost(url, params, data, headers).then((res: any) => {  
                context.commit('hideLoading', {}, { root: true });
                context.commit('setaddRobotRedissuccess', res.error);
                if(res.error == '-101') {
                    context.commit('setGlobalFreeze', {}, { root: true });
                }
                resolve()
            }).catch(function (error) {
                context.commit('hideLoading', {}, { root: true });
                context.commit('setaddRobotRedissuccess', 999);
                resolve();
            })
        })
    },
    queryEs(context: any,robotmes: any) {
        const url = API.port50001.robotEs;
        const headers = {};
        const params = {
            
        };
        const data = {
            "action": "get",
            "data": {
                "botid" : getRandomNum(robotmes[0]),
                "keyword" : robotmes[1],
                "size" : 200,
                "userid":getRandomNum(robotmes[2])
            }
        }
        return new Promise((resolve) => {
            axiosPost(url, params, data, headers).then((res: any) => {    
                //console.log("查询问题："+data.data.keyword)
                if (res.err_code == 0) {
                    const robotList: any = []
                    for(const item of res.result){
                        robotList.push({
                            faqid: item.id,
                            question: item.squestion
                        })
                    }
                    context.commit('setEsquery', robotList);   
                }
                if(res.err_code == '-101') {
                    context.commit('setGlobalFreeze', {}, { root: true });
                }
                resolve({"errno": res.err_code});
            }).catch(function (error) {
                resolve({"errno": 999});
            })
        })
    },
    queryEsHotquestion(context: any,robotmes: any) {
        const url = API.port50001.robotEs;
        const headers = {};
        const params = {
            
        };
        const data = {
            "action": "get",
            "data": {
                "botid" : getRandomNum(robotmes[0]),
                "keyword" : robotmes[1],
                "size" : 200,
                "userid":getRandomNum(robotmes[2])
            }
        }
        return new Promise((resolve) => {
            axiosPost(url, params, data, headers).then((res: any) => {    
                if (res.err_code == 0) {
                    const robotList: any = []
                    for(const item of res.result){
                        robotList.push({
                            label: item.squestion,
                            value: item.id,   
                        })
                    }
                    context.commit('setEsquery', robotList);   
                }
                if(res.err_code == '-101') {
                    context.commit('setGlobalFreeze', {}, { root: true });
                }
                resolve({"errno": res.err_code});
            }).catch(function (error) {
                resolve({"errno": 999});
            })
        })
    },
}

export default {
    state,
    mutations,
    actions,
    getters,
    namespaced: true,
}