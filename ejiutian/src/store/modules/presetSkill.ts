import { axiosGet, axiosPost, axiosPut, axiosDelete } from "../../utils/http.js";
import API from '../../constant/api';
import { getRandomNum } from "../../utils/common";

const state = {
    searchPresetskillresult: [],
    savePreserskillresult:[],
    savePreserskillresultredis:[],
}

const mutations = {
    searchPresetskillResult(state: any, payload: string) {
        state.searchPresetskillresult = payload;
        // console.log(state.result)
    },
    savePreserskillresult(state: any, payload: string){
        state.savePreserskillresult = payload;
        console.log(state.savePreserskillresult);
    },
    savePreserskillresultredis(state: any, payload: string){
        state.savePreserskillresultredis = payload;
    }
}

const getters = {}

const actions = {
    getPresetskill(context: any,param: any) {
        context.commit('showLoading', {}, { root: true });
        const url = API.port9080.Presetskillurl;
        const headers = {};
        const params = {
            "op":"search",
            "botid":getRandomNum(param.robotId),
            "envType":param.envtype,
            'userid': getRandomNum(context.rootState.userId)
            // context.rootState.robotInfo.robotId
        };
        return new Promise((resolve) => {
            axiosGet(url, params, null, headers).then((response: any) => {
                context.commit('hideLoading', {}, { root: true });
                if(response.error == '-101'){
                    context.commit('setGlobalFreeze',{},{root: true});
                }
                else{
                    resolve(response.result.search_res);
                }               
            }).catch(function (error) {
                context.commit('hideLoading', {}, { root: true });
                resolve({ "errno": 999 });
            })
        })
    },
    savePresetskill(context: any,param: any) {
        const url = API.port9080.Presetskillurl;
        const headers = {};
        // console.log(robotId)
        const params = {
            "op":"update",
            "envType":param.envtype,
            "botid":getRandomNum(param.robotId),
            "joke":param.joke,
            "weather":param.weather,
            // "weather":"1",
            "geo":param.geo,
            "idioms":param.idioms,
            'userid': getRandomNum(context.rootState.userId)
        };
        return new Promise((resolve) => {
            axiosGet(url, params, null, headers).then((response: any) => {
                if(response.error == '-101'){
                    context.commit('setGlobalFreeze',{},{root: true});
                }
                else{
                    resolve(response);
                }
                
            }).catch(function (error) {
                resolve({ "errno": 999});
            })
        })
    },
    savePresetskillredis(context: any,param: any) {
        const url = API.port6857.robot;
        const headers = {};
        const params = {};
        const data = {
            "userId":getRandomNum(context.rootState.userId),
            "botid":getRandomNum(param.robotId),
            "usertype":"",
            "addtime":"yuzhijineng",
            "botdescription":"",
            "flag":1,
            "status":1,
            "defaultreply":"",
            "endreply":"",
            "welcomereply":"",
            "hotquestion":[],
            "idioms":param.idioms,
            "joke":param.joke,
            "geo":param.geo,
        };
        return new Promise((resolve) => {
            axiosPost(url, params, data, headers).then((response: any) => {
                if(response.error == '-101'){
                    context.commit('setGlobalFreeze',{},{root: true});
                }
                else{
                    resolve(response);
                }
            }).catch(function (error) {
                resolve({ "errno":999});
            })
        })
    },
    // savePresetskillredis(context: any,param: any) {
    //     const url = API.port6857.robot;
    //     const headers = {};
    //     // console.log(robotId)
    //     const params = {
    //         "userId":"yuzhijineng",
    //         "botid":"abc",
    //         "usertype":"",
    //         "addtime":"",
    //         "botdescription":"",
    //         "flag":"1",
    //         "status":"1",
    //         "defaultreply":"",
    //         "endreply":"",
    //         "welcomereply":"",
    //         "hotquestion":[],
    //         "idioms":"1",
    //         "joke":"1",
    //         "geo":"1",
    //     };
    //     const data = {};
    //     return new Promise((resolve) => {
    //         axiosGet(url, params,data, headers).then((response: any) => {
    //             resolve(response);
    //         }).catch(function (error) {
    //             resolve({ "errno": error.error, "errorMsg": error.errorMsg});
    //         })
    //     })
    // },

}

export default {
    state,
    mutations,
    actions,
    getters,
    namespaced: true,
}