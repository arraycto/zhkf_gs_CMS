import { Commit } from 'vuex';
import types from './types';
import { getUserInfo } from '@/utils/cloud.http';

const actions = {
    async fetchUsers(context: { commit: Commit }) {
        try {
            // const res = await getUserInfo();
            // // context.commit(types.LOADING, false);
            // context.commit(types.UPDATE_USERINFO, res.body);
            // context.commit(types.REQUEST_ID, res.requestId);
            // context.commit(types.USER_ID, res.body.id);
            // const customerType = res.body.customerType
            // const userType = customerType == '互联网客户'?1:0
            // context.commit(types.USER_TYPE, userType);
        } catch (e) {
            // context.commit(types.LOADING, false);
        }
    },
}
export default actions;