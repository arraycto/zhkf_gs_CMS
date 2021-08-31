const port5001 = "/port5001";
const port5801 = "/port5801";
const port5811 = "/port5811";
const port5814 = "/port5814";
const port6657 = "/port6657";
const port6757 = "/port6757";
const port6857 = "/port6857";
const port7057 = "/port7057";
const port7058 = "/port7058";
const port8000 = "/port8000";
const port8085 = "/port8085";
const port8880 = "/port8880";
const port9080 = "/port9080";
const port9091 = "/port9091";
const port9092 = "/port9092";
const port9093 = "/port9093";
const port9094 = "/port9094";
const port9099 = "/port9099";
const port9110 = "/port9110";
const port9120 = "/port9120";
const port9121 = "/port9121";
const port9130 = "/port9130";
const port9140 = "/port9140";
const port40001 = "/port40001";
const port50001 = "/port50001";
const port50007 = "/port50007";
const port4333 = "/port4333";
const port9334 = "/port9334";
const port9979 = "/port9979";
const port9998 = "/port9998";
const wuxi = "/wuxi";
const port9401 = "/port9401";
const port9402 = "/port9402";

export default {
    port5001: {
        host: port5001 + "",
        leadmodule: port5001 + "/api/intent/count"
    },
    port5801: {
        addRecommendation: port5801 + "/recommend_create"
    },
    port5811: {
        addQuestionAnswer: port5811 + "/squestion_create",
        updateQuestionAnswer: port5811 + "/squestion_update",
        deleteQuestionAnswer: port5811 + "/squestion_delete"
    },
    port5814: {
        questionAnswer: port5814 + "/squestion_update"
    },
    port6657: {
        CacheRedis: port6657 + "/cache_create"
    },
    port6757: {
        KeyWordsRedis: port6757 + "/keyword_create"
    },
    port6857: {
        robot: port6857 + "/morenkoujing_create"
    },
    port7057: {
        // teQueryUrl: port7057 + '/te_quota_query',
        quotaQuery: port7057 + "/quota_query"
    },
    // port7058: {
    //     peQueryUrl: port7058 + '/pe_quota_query',
    // },
    port8000: {
        questionAnswer: port8000 + "/znjh/faq/user/",
        qa: port8000 + "/znjh/faq/user/count",
        questionAnswerList: port8000 + "/znjh/faq/user/list",
        userInfo: port8000 + "/znjh/user/info",
        bulk: port8000 + "/znjh/faq/user/bulk",
        downloaddemo: port8000 + "/znjh/faq/user/downloaddemo",
        getbulkdetail: port8000 + "/znjh/faq/user/getbulkdetail"
    },
    port8085: {
        dialogUrl: port8085 + "/chatxx.php",
        dialogUrlPro: port8085 + "/chatxxpro.php"
    },
    port8880: {
        simQuesList: port8880 + "/log_extend_pro/search_info",
        addQues: port8880 + "/extend_pro/sign/user/verify_add",
        delQues: port8880 + "/extend_pro/sign/user/verify_del"
    },
    port9080: {
        Presetskillurl: port9080 + "/defaultskill"
    },
    port9091: {
        Cache: port9091 + "/sign"
    },
    port9092: {
        questionAnswer: port9092 + "/derec"
    },
    port9401: {
        questionAnswer: port9401 + "/preposedmongo/add",
        leadTheProblem: port9401 + "/preposedmongo/info"
    },
    port9402: {
        questionAnswer: port9402 + "/preposedredis/add"
    },
    port9093: {
        KeyWords: port9093 + "/fkey"
    },
    port9094: {
        Publish: port9094 + "/publish"
    },
    port9099: {
        robotsearchList: port9099 + "/myrobot/search",
        robotdelete: port9099 + "/myrobot/delete",
        robotcreate: port9099 + "/myrobot/create",
        robotlaunch: port9099 + "/myrobot/launch",
        robotset: port9099 + "/myrobot/setting",
        viewpage: port9099 + "/myrobot/viewpage",
        robotNumQueryUrl: port9099 + "/myrobot/search",
        deleteQuestion: port9099 + "/faq/delete"
    },
    port4333: {
        BotinfoFlag: port4333 + "/botinfo_flag"
    },
    port9334: {
        GetPicOrVio: port9334 + "/znjh/file/download",
        delVio: port9334 + "/znjh/file/delete",
        UploadImg: port9334 + "/znjh/file/upload",
        uploadVio: port9334 + "/znjh/file/upload"
    },
    port9979: {
        changeModel: port9979 + "/modelinfo/changemodel",
        modelhistory: port9979 + "/modelinfo/modelhistory"
    },
    port9110: {
        dataAnnotationmongodburl: port9110 + "/signTable/delete",
        dataAnnotationmodifymongodburl: port9110 + "/signTable/revise"
    },
    port9120: {
        // logList: port9130 + "/statistics/logview",
    },
    // port9120: {
    //     logList: port9120 + "/logTableTest/searchInfo",
    // },
    // port9121: {
    //     logListProduce: port9121 + "/logTableProduce/searchInfo",
    // },
    port9130: {
        top10: port9130 + "/statistics/calTOP10",
        distri: port9130 + "/statistics/calDistribution",
        fangwen: port9130 + "/statistics/calNoPV",
        fangke: port9130 + "/statistics/calNoUV",
        logList: port9130 + "/statistics/logview"
    },
    port9140: {
        questionAnswer: port9140 + "/simQ/"
    },
    port40001: {
        questionAnswer: port40001 + "/index_log_uq",
        CacheEs: port40001 + "/index_log_uq",
        esAddorDel: port40001 + "/index_log_uq",
        searchdataAnnotationlabelurl: port40001 + "/index_log_uq"
    },
    port50001: {
        questionAnswer: port50001 + "/std_index",
        robotEs: port50001 + "/std_index",
        searchSQ: port50001 + "/std_index",
        searchdataAnnotatiostdnurl: port50001 + "/std_index"
    },
    port50007: {
        Publish: port50007 + "/publish"
    },
    port9998: {
        logout: port9998 + "/auth/logout"
    },
    wuxi: {
        orderCancel: "/bcop_web/order/cancel",
        resourceCreate: "/bcop_web/resource/create",
        resourceModify: "/bcop_web/resource/modify",
        productProcedure: "/bcop_web/product/procedure",
        orderQuery: "/bcop_web/product_order/query",
        userinfo: "/bcop_web/user/query",
        pool: "/bcop_web/product/pool",
        measure: "/bcop_web/product/measure",
        products: "/bcop_web/product/products",
        getResourceV2OperAuthority: "/bcop_web/user/getResourceV2OperAuthority",
        validate: "/bcop_web/user/validate",
        threshold: "/bcop_web/user/threshold"
    }
};
