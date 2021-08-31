import { axiosGet } from './http'
import API from '@/constant/api'
import configJson from '@/config/config.json'
/**
 * 需要先登录
 * host: 221.176.54.67 ecloud.10086.cn
 * https://ecloud.10086.cn:31015/api/web/users/gateway/userInfo4Web
 * 用户：baomihua03
 * 密码：111111Aa
 */
const ECLOUD_PREFIX = configJson.ECLOUD_PREFIX

const ZNJHCONSOLE = configJson.ZNJHCONSOLE

const POOLLINK = configJson.POOLLINK

const MARKET_CODE = configJson.MARKET_CODE

const environment = configJson.environment


const getUserInfo = () => axiosGet(
    API.wuxi.userinfo,
    // `${ECLOUD_PREFIX}api/web/users/gateway/userInfo4Web`,

    {}
);

export {
    ECLOUD_PREFIX,
    ZNJHCONSOLE,
    POOLLINK,
    getUserInfo,
    MARKET_CODE,
    environment
}
