import Vue from 'vue';
// import Api from '../../utils/http.js';

import { axiosGet, axiosPost, axiosPut, axiosDelete } from "../../utils/http.js";
import API from '../../constant/api';
import {getRandomNum} from '../../utils/common';
Vue.prototype.$api = API;
const state = {
    name: 'David---',
    table1: [],
    tabledistri: [
        {value: 3, name: '引导式对话'},
        {value: 1, name: '场景式对话'},
        {value: 8, name: '问答'}
    ],
    tablefangwen:[],
    tablefangwenheng:[],
    tablefangke:[],
    tablefangkeheng:[],
    tablenum:'',
    tableqa:0,
    tablelead:0,
    tablemodule:0
}

const mutations = {
    // setName(state: any, newName: string) {
    //     state.name = newName;
    // }
    setTabledata(state: any, newName: []){
        state.table1 = newName;
    },
    setTabledistri(state: any, newName: []){
        state.tabledistri = newName;
    },
    setTablenum(state: any, newName: []){
        state.tablenum = newName;
    },
    setTablefangwen(state: any, newName: []){    
        state.tablefangwen = newName;
    },
    setTablefangwenheng(state: any, newName: []){    
        state.tablefangwenheng = newName;
    },
    setTablefangke(state: any, newName: []){
        state.tablefangke = newName;
    },
    setTablefangkeheng(state: any, newName: []){
        state.tablefangkeheng = newName;
    },
    setTableqa(state: any, newName: string){
        state.tableqa = newName;
    },
    setTablelead(state: any, newName: string){
        state.tablelead = newName;
    },
    setTablemodule(state: any, newName: string){
        state.tablemodule = newName;
    }

}

const getters = {
    getName(state: any, getters: any) {
        return "name=" + state.name;
    }
}

const actions = {
    modifyName(context: any, newName: string) {
        context.commit('setName', newName);
    },
    top10Get(context: any,param: any) {
        const url = API.port9130.top10;
        const headers = {};
        // const params = {
        //     "startDate":"2019-12-24",
        //     "endDate":"2020-01-23"
        // };
        const params = {
            "startDate":param[0],
            "endDate":param[1],
            "envType": context.rootState.envInfo.env === 'test' ? 0 : 1,
            // "botid":context.rootState.robotInfo.robotId,
            "botid":getRandomNum(context.rootState.robotInfo.robotId),
            "userid":getRandomNum(context.rootState.userId)
        }
        return new Promise((resolve) => {
            context.commit('showLoading', {}, { root: true });
            axiosGet(url, params, null, headers).then((res: any) => {
                // debugger
                // console.log("sjgda ")
                if (res.errno==0) {
                    const table1=[];
                    for (let i=0;i<res.result.length;i++)
                    {
                        table1.push({"knowledgename":res.result[i].knowledgename, "percent":res.result[i].percent,"numright":res.result[i].numright,"rank":res.result[i].rank});
                    }
                    context.commit('setTabledata', table1);
                }
                context.commit('hideLoading', {}, { root: true });
                if (res.errno=='-101'){
                    context.commit('setGlobalFreeze',{},{root:true});
                }
                resolve({"errno":res.errno});
            }).catch(function(error) {
                context.commit('hideLoading', {}, { root: true }); 
                resolve({"errno":999});
            })
        });
    },
    distributionGet(context: any,param: any) {
        const url = API.port9130.distri;
        const headers = {};
        // const params = {
        //     "startDate":"2019-12-26",
        //     "endDate":"2019-12-30"
        // };
        const params = {
            "startDate":param[0],
            "endDate":param[1],
            "envType": context.rootState.envInfo.env === 'test' ? 0 : 1,
            // "botid":context.rootState.robotInfo.robotId,
            "botid":getRandomNum(context.rootState.robotInfo.robotId),
            "userid":getRandomNum(context.rootState.userId)
        }
        return new Promise((resolve) => {
            axiosGet(url, params, null, headers).then((res: any) => {
                if (res.errno==0) {
                    const tabledistri=[];
                    // console.log(res.result.data.length)
                    for (let i=0;i<res.result.data.length;i++)
                    {
                        // console.log(res.result.data[i].value)
                        tabledistri.push({value:res.result.data[i].value, name:res.result.data[i].name});
                    }
                    const tablenum = res.result.num;
                    context.commit('setTablenum', tablenum);
                    context.commit('setTabledistri', tabledistri);
                }
                if (res.errno=='-101'){
                    context.commit('setGlobalFreeze',{},{root:true});
                }
                resolve({"errno":res.errno});
            }).catch(function(error) {
                resolve({"errno":999});
            })
        });

    },
    fangwenGet(context: any,param: any) {
        const url = API.port9130.fangwen;
        const headers = {};
        // const params = {
        //     "startDate":"2020-05-25",
        //     "endDate":"2020-05-25"
        // };
        const params = {
            "startDate":param[0],
            "endDate":param[1],
            "envType": context.rootState.envInfo.env === 'test' ? 0 : 1,
            // "botid":context.rootState.robotInfo.robotId,
            "botid":getRandomNum(context.rootState.robotInfo.robotId),
            "userid":getRandomNum(context.rootState.userId)
        }
        return new Promise((resolve) => {
            context.commit('showLoading', {}, { root: true });
            axiosGet(url, params, null, headers).then((res: any) => {
                // debugger
                // console.log("长度"+res.NoPVList.length)
                // console.log(res)
                if (res.errno==0) {
                    const tablefangwen=[];
                    const tablefangwenheng=[];
                    for (let i=0;i<res.NoPVList.length;i++)
                    {
                        console.log(res.NoPVList[i])
                        tablefangwenheng.push(res.timeList[i]);
                        tablefangwen.push(res.NoPVList[i]);
                    }
                
                    // console.log(tablefangwen)
                    // console.log("nnnn")
                    context.commit('setTablefangwenheng', tablefangwenheng);
                    context.commit('setTablefangwen', tablefangwen);
                    // console.log("tttttt"+tablefangwenheng)
                }
                context.commit('hideLoading', {}, { root: true });
                if (res.errno=='-101'){
                    context.commit('setGlobalFreeze',{},{root:true});
                }
                resolve({"errno":res.errno});
            }).catch(function(error) {
                context.commit('hideLoading', {}, { root: true }); 
                resolve({"errno":999});
            })
        });

    },
    fangkeGet(context: any,param: any) {
        const url = API.port9130.fangke;
        const headers = {};
        // const params = {
        //     "startDate":"2019-12-24",
        //     "endDate":"2019-12-30"
        // };
        const params =
        {
            "startDate":param[0],
            "endDate":param[1],
            "envType": context.rootState.envInfo.env === 'test' ? 0 : 1,
            // "botid":context.rootState.robotInfo.robotId,
            "botid":getRandomNum(context.rootState.robotInfo.robotId),
            "userid":getRandomNum(context.rootState.userId)
        }

        return new Promise((resolve) => {
            axiosGet(url, params, null, headers).then((res: any) => {
                if (res.errno==0) {
                    const tablefangke=[];
                    const tablefangkeheng=[];
                    for (let i=0;i<res.NoUVList.length;i++)
                    {
                        tablefangkeheng.push(res.timeList[i]);
                        tablefangke.push(res.NoUVList[i]);
                    }
                    // console.log(tablefangwen)
                    context.commit('setTablefangkeheng', tablefangkeheng);
                    context.commit('setTablefangke', tablefangke);
                }
                if (res.errno=='-101'){
                    context.commit('setGlobalFreeze',{},{root:true});
                }
                resolve({"errno":res.errno});
            }).catch(function(error) {
                resolve({"errno":999});
            })
        });

    },
    qaGet(context: any) {
        const url = API.port8000.qa;
        const headers = {};
        const params = { };
        const data = {
            "botId":getRandomNum(context.rootState.robotInfo.robotId),
            "userId":getRandomNum(context.rootState.userId),
            // "userId": "user001",
            // "userId": context.rootState.userId,
            
            // "botId": "bot001",
            // "botId":context.rootState.robotInfo.robotId,
            "envType": context.rootState.envInfo.env === 'test' ? 0 : 1
        };
        return new Promise((resolve) => {
            axiosPost(url, params, data, headers).then((res: any) => {
                if (res.errno==0) {
                    console.log("cccaoc"+data['botId'])
                    if( res.result){
                        const tableqa  = res.result.qaacount
                        context.commit('setTableqa', tableqa)
                        console.log(state.tableqa)
                        resolve()
                    }
                }
                if (res.errno=='-101'){
                    context.commit('setGlobalFreeze',{},{root:true});
                }
                resolve({"errno":res.errno});
            }).catch(function(error) {
                resolve({"errno":999});
            })
        });

    },
    leadmoduleGet(context: any) {
        const url = API.port5001.leadmodule;
        const headers = {};
        const params = {
            // "botid": "R007",
            "botid":getRandomNum(context.rootState.robotInfo.robotId),
            "userid":getRandomNum(context.rootState.userId),
            // "botid":context.rootState.robotInfo.robotId,
            "envType": context.rootState.envInfo.env === 'test' ? 0 : 1
        };
        return new Promise((resolve) => {
            axiosGet(url, params, null, headers).then((res: any) => {                
                // console.log("cccccdddd"+params['botid'])
                // console.log(res)
                if (res.code==0) {
                    const tablelead  = res.data.leaderaccount
                    const tablemodule= res.data.moduleaccount
                    context.commit('setTablelead', tablelead)
                    context.commit('setTablemodule', tablemodule)
                }
                if (res.code=='-101'){
                    context.commit('setGlobalFreeze',{},{root:true});
                }
                resolve({"errno":res.code});
            }).catch(function(error) {
                resolve({"errno":999});
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