import { axiosGet, axiosPost, axiosPut, axiosDelete } from "../../utils/http.js";
import API from '../../constant/api';
import {getRandomNum} from "../../utils/common";

const state = {
    robotList: [],
    BotinfoFlagSuccess : 106,
    BotinfoDeleteRedisSuccess:106,
}

const mutations = {
    setrobotList(state: any, payload: object[]) {
        state.robotList = [];
        state.robotList = payload;
    },
    setBotinfoFlagSuccess(state: any, success: any) {
        state.BotinfoFlagSuccess = success;
    },
    setBotinfoDeleteRedisSuccess(state: any, success: any) {
        state.BotinfoDeleteRedisSuccess = success;
    },
}

const getters = {}

const actions = {
    queryRobotList(context: any,search: any) {
        const url = API.port9099.robotsearchList;
        const headers = {};
        const params = {
            
        };
        const data = {
            "envType":search[0],
            "userid":getRandomNum(search[1]),
            "name": search[2]
        };
        return new Promise((resolve) => {
            context.commit('showLoading', {}, { root: true });
            axiosPost(url, params, data, headers).then((res: any) => {
                if (res.errno == 0) {
                    const robotList: any = []
                    for (const item of res.result) {
                        robotList.push({
                            switch: item.flag,
                            botnameid: item.botnameid,
                            updatetime: item.releasetime,
                            updateuserid: item.releaseuserid,
                            botdescription: item.botdescription,
                            bottype: item.bottype,
                            vtelno: item.vtelno
                        })
                    }
                    context.commit('setrobotList', robotList);
                }
                context.commit('hideLoading', {}, { root: true });
                if(res.errno == '-101') {
                    context.commit('setGlobalFreeze', {}, { root: true });
                }
                resolve({"errno": res.errno});
            }).catch(function (error) {
                context.commit('hideLoading', {}, { root: true });
                resolve({ "errno": 999});
            })
        })
    },
    setLaunchstatus(context: any,payload: any) {
        const url = API.port9099.robotlaunch;
        const headers = {};
        const params = {
            /* "envType":"1",
            "userid":"N001",
            "botid":"R001",
            "launch":status,//开启为1 */
            
        };
        const data = {
            "envType":payload[0],
            "userid":getRandomNum(payload[1]),
            "botid":getRandomNum(payload[2]),
            "launch":payload[3],
        };
        return new Promise((resolve) => {
            axiosPost(url, params, data, headers).then((res: any) => {    
                if (res.errno == 0) {
                    console.log("修改状态成功")   
                }
                if(res.errno == '-101') {
                    context.commit('setGlobalFreeze', {}, { root: true });
                }
                resolve({"errno": res.errno});
            }).catch(function (error) {
                resolve({ "errno": 999});
            })
        })
    },
    setBotinfoFlag(context: any,payload: any) {
        const url = API.port4333.BotinfoFlag;
        const headers = {};
        const params = {
    
        };
        const data = {
            "botid": getRandomNum(payload[0]),
            "flag_pr": payload[1],
            "userid":getRandomNum(payload[2])
        };
        return new Promise((resolve) => {
            axiosPost(url, params, data, headers).then((res: any) => {    
                console.log("修改flag成功与否："+res.error)
                if (res.error == 200) {
                    context.commit('setBotinfoFlagSuccess', res.error);
                    console.log("修改flag成功")   
                }
                if(res.error == '-101') {
                    context.commit('setGlobalFreeze', {}, { root: true });
                }
                resolve()
            }).catch(function (error) {
                context.commit('setBotinfoFlagSuccess', 999);
                resolve()
            })
        })
    },
    setBotinfoDeleteRedis(context: any,payload: any) {
        const url = API.port4333.BotinfoFlag;
        const headers = {};
        const params = {
    
        };
        const data = {
            "botid": getRandomNum(payload[0]),
            "delete_pr":payload[1],
            "delete_te":payload[2],
            "userid":getRandomNum(payload[3])

        };
        return new Promise((resolve) => {
            axiosPost(url, params, data, headers).then((res: any) => {    
                console.log("redis删除："+res.error)
                if (res.error == 200) {
                    context.commit('setBotinfoDeleteRedisSuccess', res.error);
                }
                if(res.error == '-101') {
                    context.commit('setGlobalFreeze', {}, { root: true });
                }
                resolve()
            }).catch(function (error) {
                context.commit('setBotinfoDeleteRedisSuccess', 999);
                resolve()
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