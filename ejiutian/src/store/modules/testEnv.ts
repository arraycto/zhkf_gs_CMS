import { axiosGet, axiosPost, axiosPut, axiosDelete } from "../../utils/http.js";
import API from '../../constant/api';
import {getRandomNum} from "../../utils/common";


const state = {
    robotList: [],
    publishstatus : 1,
    deletecachestatus:1,
    deleteKeywordsstatus:1,
    deleterobot:1,
    createRobotSuccess:1,
    addskill:1,
}

const mutations = {
    setrobotList(state: any, payload: object[]) {
        state.robotList = [];
        state.robotList = payload;
    },
    setpublishstatus(state: any, payload: object[]) {
        state.publishstatus = payload;
    },
    setdeleteRobotstatus(state: any, payload: any) {
        state.deleterobot = payload;
    },
    setcreateRobotstatus(state: any, payload: any) {
        state.createRobotSuccess = payload;
    },
    setaddskill(state: any, payload: any) {
        state.addskill = payload;
    },
}

const getters = {}

const actions = {
    queryRobotList(context: any,querylist: any) {
        const url = API.port9099.robotsearchList;
        const headers = {};
        const params = {
            
        };
        const data = {
            "envType":querylist[0],
            "userid":getRandomNum(querylist[1]),
            "status":querylist[2],
            "name":querylist[3],
            "botType":querylist[4]
        };
        return new Promise((resolve) => {
            context.commit('showLoading', {}, { root: true });
            axiosPost(url, params, data, headers).then((res: any) => {
                if (res.errno == 0) {
                    const robotList: any = []
                    for (const item of res.result) {
                        robotList.push({
                            status: item.status,
                            botnameid: item.botnameid,
                            updatetime: item.updatetime,
                            updateuserid: item.updateuserid,
                            botdescription: item.botdescription,  
                            publish:1,  
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
    queryRobotStatusList(context: any , querylist: any) {
        const url = API.port9099.robotsearchList;
        const headers = {};
        const params = {};
        const data = {
            "envType":querylist[0],
            "userid":getRandomNum(querylist[1]),
            "status":querylist[2],
            "name":querylist[3],
        };
        return new Promise((resolve) => {
            axiosPost(url, params, data, headers).then((res: any) => {
                if (res.errno == 0) {
                    //console.log("状态："+params.status + " " + params.userid)
                    const robotList: any = []
                    for (const item of res.result) {
                        robotList.push({
                            status: item.status,
                            botnameid: item.botnameid,
                            updatetime: item.updatetime,
                            updateuserid: item.updateuserid,
                            botdescription: item.botdescription,
                            bottype: item.bottype,
                            vtelno: item.vtelno
                        })
                    }
                    context.commit('setrobotList', robotList);
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
    createRobot(context: any, create: any) {
        const url = API.port9099.robotcreate;
        const headers = {};
        const params = {
            
        };
        const data = {
            "envType":create[0],
            "userid":getRandomNum(create[1]),
            "usertype":create[2],
            //"botid":getRandomNum(create[3]),
            "name":create[3],
            "desc":create[4],
            "botType":create[5],
            "mTelNo": create[6]
        };
        return new Promise((resolve) => {
            
            axiosPost(url, params, data, headers).then((res: any) => {    
                context.commit('setcreateRobotstatus', res.errno);    
                if(res.errno == '-101') {
                    context.commit('setGlobalFreeze', {}, { root: true });
                }
                resolve()   
            }).catch(function (error) {
                context.commit('setcreateRobotstatus', 999);
                resolve()
            })
        })
    },
    queryPublishstatus(context: any,robot: any) {
        const url = API.port50007.Publish;
        const headers = {};
        const params = {
            "userId":getRandomNum(robot[0]),
            "botId":getRandomNum(robot[1])
        };
        const data = {

        };
        return new Promise((resolve) => {
            
            axiosGet(url, params, data, headers).then((res: any) => {     
                context.commit('setpublishstatus', res.err_code);
                if(res.err_code == '-101') {
                    context.commit('setGlobalFreeze', {}, { root: true });
                }
                resolve()
            }).catch(function (error) {
                context.commit('setpublishstatus', 999);
                resolve()
            })
        })
    },
    deleteRobotInter(context: any,deleterobot: any) {
        const url = API.port9099.robotdelete;
        const headers = {};
        const params = {
            /* "envType":0,
            "userid":"N001",
            "botid":"R0012" */
            
        };
        const data = {  
            "envType":deleterobot[0],
            "userid":getRandomNum(deleterobot[1]),
            "botid":getRandomNum(deleterobot[2])
        };
        return new Promise((resolve) => {
            context.commit('showLoading', {}, { root: true });
            axiosPost(url, params, data, headers).then((res: any) => {    
                context.commit('hideLoading', {}, { root: true });
                context.commit('setdeleteRobotstatus', res.errno);
                if(res.errno == '-101') {
                    context.commit('setGlobalFreeze', {}, { root: true });
                }
                resolve()
            }).catch(function (error) {
                context.commit('hideLoading', {}, { root: true });
                context.commit('setdeleteRobotstatus', 999);
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