import types from './types';

const mutations = {
    [types.LOADING](state: any, bool: boolean) {
        state.loading = bool;
    },
    [types.UPDATE_USERINFO](state: any, payload: object) {
        state.userinfo = payload;
    },
    [types.REQUEST_ID](state: any, payload: any) {
        state.requestid = payload;
    },
    [types.USER_ID](state: any, payload: any) {
        state.userId = payload
    },
    [types.USER_TYPE](state: any, payload: any) {
        state.userType = payload
    },
}
export default mutations;