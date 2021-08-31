import { axiosGet, axiosPost } from "../../utils/http.js";
import API from "../../constant/api";
import { ECLOUD_PREFIX } from "../../utils/cloud.http";
import { getRandomNum } from "../../utils/common";

const state = {
    testEnvDetail: {
        used_quota: 0,
        residual_quota: 0,
        QPS_limit: 0
    },
    proEnvDetail: {
        used_quota: 0,
        residual_quota: 0,
        QPS_limit: 0
    },
    teRobotNum: 0,
    peRobotNum: 0,
    teRobotDetailList: [],
    peRobotDetailList: []
};

const mutations = {
    setTeResult(state: any, payload: string) {
        state.testEnvDetail = payload;
    },
    setPeResult(state: any, payload: string) {
        state.proEnvDetail = payload;
    }
};

const getters = {};

const actions = {
    //获取用户余额
    getThreshold(context: any, param: any) {
        const url = API.wuxi.threshold;
        const headers = {};
        const params = {
            serviceIds: param
        };
        return axiosGet(url, params, null, headers);
    },

    //获取资源池
    getPool(context: any) {
        // const url = ECLOUD_PREFIX + 'api/web/query/product/pool';
        const url = API.wuxi.pool;
        const headers = {};
        const params = {
            request_id: context.rootState.requestid,
            user_id: context.rootState.userinfo.id,
            productType: "intelligentInteraction"
        };
        return axiosGet(url, params, null, headers);
    },
    //获取计费模式
    getMeasure(context: any, param: any) {
        // const url = ECLOUD_PREFIX + 'api/web/query/product/measure';
        const url = API.wuxi.measure;
        const headers = {};
        const params = {
            request_id: context.rootState.requestid,
            user_id: context.rootState.userinfo.id,
            productType: "intelligentInteraction",
            poolId: param,
            customerType: context.rootState.userinfo.customerType
        };
        return axiosGet(url, params, null, headers);
    },
    //获取产品信息
    getProducts(context: any, productReq: any) {
        // const url = ECLOUD_PREFIX + 'api/web/query/product/products';
        const url = API.wuxi.products;
        const headers = {};
        productReq.productType = "intelligentInteraction";
        productReq.customerType = context.rootState.userinfo.customerType;
        productReq.requestId = context.rootState.requestid;
        const params = {};
        return axiosGet(url, productReq, null, headers);
    },
    //获取是否实名认证
    getCertificate(context: any) {
        // const url = ECLOUD_PREFIX + 'api/web/user/outer/customer/certificate/validate';
        const url = API.wuxi.validate;
        const headers = {};
        const params = {
            customerId: context.rootState.userinfo.customerId
        };
        return axiosGet(url, params, null, headers);
    },
    //操作权限
    getAuthority(context: any, param: any) {
        // const url = ECLOUD_PREFIX + 'api/web/ordercenter/getResourceV2OperAuthority'
        const url = API.wuxi.getResourceV2OperAuthority;
        const headers = {
            request_id: context.rootState.requestid,
            user_id: context.rootState.userinfo.id
        };
        const params = {
            instanceId: param.instanceId,
            userId: context.rootState.userinfo.id,
            actionType: param.actionType
        };
        return axiosGet(url, params, null, headers);
    },
    //获取是否首次订购和订单状态
    queryUser(context: any) {
        const url = API.wuxi.orderQuery;
        const headers = {
            Credentials: true
        };
        const params = {
            productType: "intelligentInteraction",
            requestId: context.rootState.requestid,
            userId: context.rootState.userinfo.id
        };
        return axiosGet(url, params, null, headers);
    },
    //获取控制台状态及订购产品id
    getUserInfo(context: any) {
        const url = API.port8000.userInfo;
        const headers = {};
        const params = {};
        const data = {
            userId: getRandomNum(context.rootState.userinfo.id)
        };
        return axiosPost(url, params, data, headers);
    },
    userLogout(context: any) {
        const url = API.port9998.logout;
        const headers = {};
        const params = {};
        const data = {};
        return axiosPost(url, params, data, headers);
    },
    teQuery(context: any, params: any) {
        const url = API.port7057.quotaQuery;
        const headers = {};
        return new Promise(resolve => {
            axiosGet(url, params, null, headers)
                .then((res: any) => {
                    if (res.errno == "-101") {
                        context.commit("setGlobalFreeze", {}, { root: true });
                    } else {
                        if (Object.keys(res.result).length > 0) {
                            context.commit("setTeResult", res.result);
                        }
                    }
                    resolve({ errno: res.errno });
                })
                .catch(error => {
                    resolve({ errno: 999 });
                });
        });
    },
    peQuery(context: any, params: any) {
        const url = API.port7057.quotaQuery;
        const headers = {};
        return new Promise(resolve => {
            axiosGet(url, params, null, headers)
                .then((res: any) => {
                    if (res.errno == "-101") {
                        context.commit("setGlobalFreeze", {}, { root: true });
                    } else {
                        if (Object.keys(res.result).length > 0) {
                            context.commit("setPeResult", res.result);
                        }
                    }
                    resolve({ errno: res.errno });
                })
                .catch(error => {
                    resolve({ errno: 999 });
                });
        });
    },
    terobotQuery(context: any, param: any) {
        const url = API.port9099.robotsearchList;
        const headers = {};
        const params = {};
        const data = {
            envType: 0,
            userid: getRandomNum(param)
        };
        return axiosPost(url, params, data, headers);
    },
    perobotQuery(context: any, param: any) {
        const url = API.port9099.robotsearchList;
        const headers = {};
        const params = {};
        const data = {
            envType: 1,
            userid: getRandomNum(param)
        };
        return axiosPost(url, params, data, headers);
    }
};

export default {
    state,
    mutations,
    actions,
    getters,
    namespaced: true
};
