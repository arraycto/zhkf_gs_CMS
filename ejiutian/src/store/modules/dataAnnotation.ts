import { axiosPost} from "../../utils/http.js";
import API from '../../constant/api';
import { getRandomNum } from "../../utils/common";


const state = {
    dataAnnotationlabelpageresult:[],
    dataAnnotationstdresult:[],
    dataAnnotationdelresult:[],
    dataAnnotationdelresultmongodb:[],
    dataAnnotationdelmodifyresult:[],
    dataAnnotationdelmodifyresultmongodb:[],
}

const mutations = {
    dataAnnotationlabelpageresult(state: any, payload: string){
        state.dataAnnotationlabelpageresult = payload;
        console.log(state.dataAnnotationlabelpageresult);
    },
    dataAnnotationstdresult(state: any, payload: string){
        state.dataAnnotationstdresult = payload;
        console.log(state.dataAnnotationstdresult);
    },
    dataAnnotationdelresult(state: any, payload: string){
        state.dataAnnotationdelresult = payload;
    },
    dataAnnotationdelresultmongodb(state: any, payload: string){
        state.dataAnnotationdelresultmongodb = payload;
    },
    dataAnnotationdelmodifyresult(state: any, payload: string){
        state.dataAnnotationdelmodifyresult = payload;
    },
    dataAnnotationdelmodifyresultmongodb(state: any, payload: string){
        state.dataAnnotationdelmodifyresultmongodb = payload;
    },
}

const getters = {}

const actions = {
    //查询--加载页面
    dataAnnotationlabelpagePost(context: any,param: any) {
        context.commit('showLoading', {}, { root: true });
        const url = API.port40001.searchdataAnnotationlabelurl;
        const headers = {};
        const params = {};
        const data = {
            "action":"get",
            "data": param,
            // 'userid': getRandomNum(context.rootState.userId),
            // 'botid': getRandomNum(context.rootState.robotInfo.robotId),
            // {
            //     "botid": "bot1",
            //     "env": 0,
            //     "keyword":"sque111",
            //     "size":"10",
            //     "datestart":"2020-05-17",
            //     "dateend":"2020-05-30",
            //     "evaluate":"true"
            // },
        };
        return new Promise((resolve) => {
            axiosPost(url, params, data, headers).then((response: any) => {
                context.commit('hideLoading', {}, { root: true });
                if(response.err_code == "-101"){
                    // context.commit('hideLoading', {}, { root: true });
                    context.commit('setGlobalFreeze',{},{root: true});
                }
                else{
                    resolve(response);
                }
                

            }).catch(function (error) {
                context.commit('hideLoading', {}, { root: true });
                resolve({ "errno": 999});
            })
        })
        // axiosPost(url, params, data, headers).then((res: any) => {
        //     context.commit('searchdataAnnotationresult', res);
        // });
    },
    //编辑按钮--查询标准问题
    dataAnnotationstdPost(context: any,param: any) {
        const url = API.port50001.searchdataAnnotatiostdnurl;
        const headers = {};
        const params = {};
        const data = {
            "action": "get",
            "data": param,
            // 'userid': getRandomNum(context.rootState.userId),
            // 'botid': getRandomNum(context.rootState.robotInfo.robotId),
            // {
            // "botid": "bot1",
            // "env": 0,
            // "keyword":"sque111111",
            // "size":"10",
            // "datestart":"2020-05-17",
            // "dateend":"2020-05-30",
            // "evaluate":"true"
            // }
        };
        return new Promise((resolve) => {
            axiosPost(url, params, data, headers).then((response: any) => {
                if(response.err_code == '-101'){
                    context.commit('setGlobalFreeze',{},{root: true});
                }
                else{
                    resolve(response);
                }                
            }).catch(function (error) {
                resolve({ "errno": 999 });
            })
        })
    },
    //删除--es库
    dataAnnotationdelPost(context: any,param: any) {
        const url = API.port40001.searchdataAnnotationlabelurl;
        const headers = {};
        const params = {};
        const data = {
            "action": "delete",
            "status": 1,
            "data": param,
            // 'userid': getRandomNum(context.rootState.userId),
            // 'botid': getRandomNum(context.rootState.robotInfo.robotId),
        }
        return new Promise((resolve) => {
            axiosPost(url, params, data, headers).then((response: any) => {
                if(response.err_code == '-101'){
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
    //删除--MongoDB库
    dataAnnotationdelPost2(context: any,param: any) {
        const url = API.port9110.dataAnnotationmongodburl;
        const headers = {};
        const params = {};
        const data = {
            "idList":param,
            'userid': getRandomNum(context.rootState.userId),
            'botid': getRandomNum(context.rootState.robotInfo.robotId),
        }
        return new Promise((resolve) => {
            axiosPost(url, params, data, headers).then((response: any) => {
                if(response.errno == '-101'){
                    context.commit('setGlobalFreeze',{},{root: true});
                }
                else{
                    resolve(response);
                }
                
            }).catch(function (error) {
                resolve({ "errno": 999 });
            })
        })
    },
    //修改--es库
    dataAnnotationmodifyPost(context: any,param: any) {
        const url = API.port40001.searchdataAnnotationlabelurl;
        const headers = {};
        const params = {};
        const data = {
            "action": "add",
            "status": 1,
            "data" : param,
            // 'userid': getRandomNum(context.rootState.userId),
            // 'botid': getRandomNum(context.rootState.robotInfo.robotId),
            // "data": [{
            //     "id" : "0009",
            //     "sqid" : "sqid003",
            //     "squestion":"sque333",
            //     "uquestion" : "uque333",
            //     "faqid" : "test",
            //     "botid" : "bot1",
            //     "userid":"user001",
            //     "answer" : "answer1111",
            //     "signtime" : "2020-05-17 09:10:00",
            //     "signer":"user001",
            //     "evaluate" : "true",
            //     "province" : "GD",
            //     "status": 1,
            //     "env":0,
            //     "delflag":"0"
            // }]
        };
        return new Promise((resolve) => {
            axiosPost(url, params, data, headers).then((response: any) => {
                if(response.err_code == '-101'){
                    context.commit('setGlobalFreeze',{},{root: true});
                }
                else{
                    resolve(response);
                }
                
            }).catch(function (error) {
                resolve({ "errno": 999 });
            })
        })
    },
    //修改--MongoDB库
    dataAnnotationmodifyPost2(context: any,param: any) {
        // console.log(param[0]);
        const url = API.port9110.dataAnnotationmodifymongodburl;
        const headers = {};
        const params = {};
        const data = {
            "squestion":param[0].squestion,
            "id":param[0].id,
            "faqid":param[0].faqid,
            'userid': getRandomNum(context.rootState.userId),
            // 'userid': getRandomNum(context.rootState.userId),
            // 'botid': getRandomNum(context.rootState.robotInfo.robotId),
            
        }
        return new Promise((resolve) => {
            axiosPost(url, params, data, headers).then((response: any) => {
                if(response.errno == '-101'){
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
}

export default {
    state,
    mutations,
    actions,
    getters,
    namespaced: true,
}