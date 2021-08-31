import { axiosPost,axiosGet } from "../../utils/http.js";
import API from '../../constant/api';
import COMMON from '../../constant/common';
import { getRandomNum } from "../../utils/common";

const state = {
    
}

const mutations = {
    // setTeResult(state: any, payload: string) {
    //     state.testEnvDetail = payload;
    // }
}

const getters = {}

const actions = {
    ChangeModel(context: any, change: any) {
        return new Promise((resolve,reject) => {
            const url = API.port9979.changeModel;
            const headers = {};
            const data = {};
            const params = {
                botid: context.rootState.robotInfo.robotId,
                model:change.model,
                envType: change.envType
            }
            axiosGet(url, params, data, headers).then(res => {
                if(res.errno != 0) {
                    reject({"errno": res.errno, "errorMsg": res.errorMsg})
                }else {
                    resolve(res)
                }
            }).catch(error => {
                reject({ "errno": COMMON.commonErrorCode, "errorMsg": COMMON.commonErrorMsg });
                context.commit('hideLoading', {}, { root: true });
            })
        })
    },
    modelhistory(context: any, type: any) {
        return new Promise((resolve,reject) => {
            context.commit('showLoading', {}, { root: true });
            const url = API.port9979.modelhistory;
            const headers = {};
            const data = {};
            let params;
            if(type.op == "search") {
                params = {
                    op:"search",
                    botid: getRandomNum(context.rootState.robotInfo.robotId),
                    userid: getRandomNum(context.rootState.userId),
                    envType: type.envType
                }
            }else if (type.op == "add") {
                params = {
                    op:"add",
                    botid: getRandomNum(context.rootState.robotInfo.robotId),
                    userid: getRandomNum(context.rootState.userId),
                    envType: type.envType,
                    model: type.model,
                    description: type.description
                }
            }
            axiosGet(url, params, data, headers).then(res => {
                if(res.errno != 0) {
                    reject({"errno": res.errno, "errorMsg": res.errorMsg})
                }else {
                    resolve(res)
                }
                context.commit('hideLoading', {}, { root: true });
            }).catch(error => {
                reject({ "errno": COMMON.commonErrorCode, "errorMsg": COMMON.commonErrorMsg });
                context.commit('hideLoading', {}, { root: true });
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