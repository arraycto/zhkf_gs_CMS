import { axiosPost } from "../../utils/http.js";
// import API from '../../constant/api';
// import { ECLOUD_PREFIX } from "../../utils/cloud.http";
// import { getRandomNum } from "../../utils/common";

const state = {
    
}

const mutations = {
    // setTeResult(state: any, payload: string) {
    //     state.testEnvDetail = payload;
    // }
}

const getters = {}

const actions = {
    //获取资源池
    uploadImg(context: any,file: any) {
        const url = 'http://172.31.232.106:9334/znjh/file/upload';
        const headers = {
            
        };
        const params = {}
        const data = file
        // {
        // 'request_id': context.rootState.requestid,
        // 'user_id': context.rootState.userinfo.id,
        // 'productType': 'intelligentInteraction',
        // }
        return new Promise((resolve,reject) => {
            axiosPost(url, params, data, headers).then((res: any) => {
                resolve(res);
            }).catch((error: any) => {
                reject(error);
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