import { axiosPost, axiosGet } from "../../utils/http.js";
import API from '../../constant/api';
import COMMON from '../../constant/common';
import { Md5 } from "ts-md5/dist/md5";

const state = {
    questionList: [],
    questionDetail: {
        sqId: "",
        standardQuestion: "",
        similarQuestion: [],
        similarQuestionHead: "",
        similarQuestionTail: [],
        keyWord: [],
        keyWordHead: "",
        keyWordTail: [],
        threshold: 0,
        recommendationQuestion: [],
        answer: "",
    },
    detailMode: "",
    currentTime: "",
    randomNum: "",
}

const mutations = {
    setQuestionList(state: any, payload: object[]) {
        state.questionList = payload;
    },
    setQuestionDetail(state: any, payload: any) {
        state.questionDetail = payload;
    },
    setDetailMode(state: any, mode: string) {
        state.detailMode = mode;
    },
    setCurrentTime(state: any, currentTime: string) {
        state.currentTime = currentTime;
    },
    setRandomNum(state: any, randomNum: string) {
        state.randomNum = randomNum;
    },
}

const getters = {}

// sort question list by edit time desc
const sortQuestionList = function (questionList: any[]) {
    questionList.sort(function(a,b){
        return a.editTime < b.editTime ? 1 : -1
    });
    return questionList;
}

// main function of standard question (create, update)
const changeStandardQuestion = function (rootState: any, questionDetail: any) {
    return new Promise((resolve, reject) => {
        let url = API.port8000.questionAnswer;
        if (state.detailMode == "create") {
            url = url + "add";
        } else {
            url = url + "update";
        }
        const headers = {};
        const params = {};
        const data = {
            userId: rootState.userId,
            botId: rootState.robotInfo.robotId,
            envType: rootState.envInfo.env === 'test' ? 0 : 1,
            faqId: questionDetail.sqId,
            faqSign: questionDetail.standardQuestionMd5,
            faqQuestion: questionDetail.standardQuestion,
            faqAnswer: questionDetail.answer,
            faqCreator: rootState.userId,
            keywords: questionDetail.keyWord,
            thresdhold: questionDetail.threshold.toString(),
            flag: questionDetail.Flag.toString()
        };
        axiosPost(url, params, data, headers).then(function (response) {
            if (response.errno != 0) {
                reject({ "errno": response.errno, "errorMsg": response.errorMsg });
            } else {
                resolve({ "errno": 0, "errorMsg": "process has finished normally." });
            }
        }, function () {
            reject({ "errno": COMMON.commonErrorCode, "errorMsg": COMMON.commonErrorMsg });
        })
    })
}

// standard question for mongodb (create, update)
const changeStandardQuestionMongodb = function (rootState: any, questionDetail: any) {
    return new Promise((resolve, reject) => {
        let keyword = "";
        for (const item of questionDetail.keyWord) {
            keyword = keyword + "^A" + item;
        }
        const url = API.port50001.questionAnswer;
        const headers = {};
        const params = {};
        const data = {
            action: "add",
            data: [{
                id: questionDetail.sqId,
                sqid: questionDetail.standardQuestionMd5,
                squestion: questionDetail.standardQuestion,
                answer: questionDetail.answer,
                userid: rootState.userId,
                botid: rootState.robotInfo.robotId,
                keyword: keyword.substring(2),
                thresdhold: questionDetail.threshold.toString(),
                creator: rootState.userId,
                flag: questionDetail.Flag.toString(),
                delflag: "0"
            }]
        };
        axiosPost(url, params, data, headers).then(function (response) {
            if (response.err_code != 0) {
                reject({ "errno": response.err_code, "errorMsg": response.err_msg });
            } else {
                resolve({ "errno": 0, "errorMsg": "process has finished normally." });
            }
        }, function () {
            reject({ "errno": COMMON.commonErrorCode, "errorMsg": COMMON.commonErrorMsg });
        })
    })
}

// similar question for elasticsearch (create, update)
const changeSimilarQuestionEs = function (state: any, getters: any, rootState: any, questionDetail: any) {
    return new Promise((resolve, reject) => {
        const dataList: any = [];
        for (const item of questionDetail.similarQuestion) {
            dataList.push({
                faqid: questionDetail.sqId,
                id: Md5.hashStr(rootState.robotInfo.robotId + item + state.currentTime + state.randomNum),
                uquestion: item,
                sqid: questionDetail.standardQuestionMd5,
                squestion: questionDetail.standardQuestion,
                userid: rootState.userId,
                botid: rootState.robotInfo.robotId,
                signer: rootState.userId,
                answer: questionDetail.answer,
                status: 3,
                evaluate: "true",
                env: rootState.envInfo.env === 'test' ? 0 : 1,
                delflag: "0"
            });
        }
        const url = API.port40001.questionAnswer;
        const headers = {};
        const params = {};
        const data = {
            action: "add",
            status: 3,
            faqid: questionDetail.sqId,
            data: dataList
        };
        axiosPost(url, params, data, headers).then(function (response) {
            if (response.err_code != 0) {
                reject({ "errno": response.err_code, "errorMsg": response.err_msg });
            } else {
                resolve({ "errno": 0, "errorMsg": "process has finished normally." });
            }
        }, function () {
            reject({ "errno": COMMON.commonErrorCode, "errorMsg": COMMON.commonErrorMsg });
        })
    })
}

// standard question for redis (create, update)
const changeStandardQuestionRedis = function (rootState: any, questionDetail: any) {
    return new Promise((resolve, reject) => {
        const url = API.port5811.addQuestionAnswer;
        const headers = {};
        const params = {};
        const data = {
            envType: rootState.envInfo.env === 'test' ? 0 : 1,
            faqid: questionDetail.sqId,
            squestion: questionDetail.standardQuestion,
            answer: questionDetail.answer,
            botid: rootState.robotInfo.robotId,
            creator: rootState.userId,
            flag: questionDetail.Flag.toString(),
            status: "status"
        };
        axiosPost(url, params, data, headers).then(function (response) {
            if (response.errno != 0) {
                reject({ "errno": response.errno, "errorMsg": response.errorMsg });
            } else {
                resolve({ "errno": 0, "errorMsg": "process has finished normally." });
            }
        }, function () {
            reject({ "errno": COMMON.commonErrorCode, "errorMsg": COMMON.commonErrorMsg });
        })
    })
}

// similar question for mongodb (create, update)
const changeSimilarQuestionMongodb = function (state: any, getters: any, rootState: any, questionDetail: any) {
    return new Promise((resolve, reject) => {
        const similarQuestionMd5List = [];
        if (questionDetail.similarQuestion.length == 0) {
            questionDetail.similarQuestion.push("");
            similarQuestionMd5List.push("");
        } else {
            for (const item of questionDetail.similarQuestion) {
                similarQuestionMd5List.push(Md5.hashStr(rootState.robotInfo.robotId + item + state.currentTime + state.randomNum));
            }
        }
        const url = API.port9140.questionAnswer + "revise";
        const headers = {};
        const params = {};
        const data = {
            uquestion: questionDetail.similarQuestion,
            squestion: questionDetail.standardQuestion,
            faqid: questionDetail.sqId,
            answer: questionDetail.answer,
            userid: rootState.userId,
            botid: rootState.robotInfo.robotId,
            province: "",
            idList: similarQuestionMd5List,
            envType: rootState.envInfo.env === 'test' ? 0 : 1
        };
        axiosPost(url, params, data, headers).then(function (response) {
            if (response.errno != 0) {
                reject({ "errno": response.errno, "errorMsg": response.errorMsg });
            } else {
                resolve({ "errno": 0, "errorMsg": "process has finished normally." });
            }
        }, function () {
            reject({ "errno": COMMON.commonErrorCode, "errorMsg": COMMON.commonErrorMsg });
        })
    })
}

// recommendation question (create, update)
const changeRecommendationQuestion = function (rootState: any, questionDetail: any) {
    return new Promise((resolve, reject) => {
        let recommendation = "";
        for (const item of questionDetail.recommendationQuestion) {
            recommendation = recommendation + "^A" + item.value;
        }
        if (recommendation.length > 2) {
            recommendation = recommendation.substring(2);
        }
        const url = API.port9092.questionAnswer;
        const headers = {};
        const params = {
            op: "add"
        };
        const data = {
            botid: rootState.robotInfo.robotId,
            data: [{
                userid: rootState.userId,
                squestion: questionDetail.standardQuestion,
                sqid: questionDetail.standardQuestionMd5,
                faqid: questionDetail.sqId,
                recsq: recommendation,
                pos: "",
                creator: rootState.userId,
                env: rootState.envInfo.env === 'test' ? 0 : 1,
            }]
        };
        axiosPost(url, params, data, headers).then(function (response) {
            if (response.errno != 0) {
                reject({ "errno": response.errno, "errorMsg": response.errMsg });
            } else {
                resolve({ "errno": 0, "errorMsg": "process has finished normally." });
            }
        }, function () {
            reject({ "errno": COMMON.commonErrorCode, "errorMsg": COMMON.commonErrorMsg });
        })
    })
}

// recommendation question for redis (create, update)
const changeRecommendationQuestionRedis = function (rootState: any, questionDetail: any) {
    return new Promise((resolve, reject) => {
        let recommendation = "";
        for (const item of questionDetail.recommendationQuestion) {
            recommendation = recommendation + "^" + item.value;
        }
        const url = API.port5801.addRecommendation;
        const headers = {};
        const data = {};
        const params = {
            envType: rootState.envInfo.env === 'test' ? 0 : 1,
            faqid: questionDetail.sqId,
            botid: rootState.robotInfo.robotId,
            ads: recommendation.substring(1)
        };
        axiosGet(url, params, data, headers).then(function (response) {
            if (response.errno != 0) {
                reject({ "errno": response.errno, "errorMsg": response.errorMsg });
            } else {
                resolve({ "errno": 0, "errorMsg": "process has finished normally." });
            }
        }, function () {
            reject({ "errno": COMMON.commonErrorCode, "errorMsg": COMMON.commonErrorMsg });
        })
    })
}

// delete standard question list
const deleteQuestionList = function (rootState: any, idList: []) {
    return new Promise((resolve, reject) => {
        const url = API.port9099.deleteQuestion;
        const headers = {};
        const params = {};
        const data = {
            userId: rootState.userId,
            botId: rootState.robotInfo.robotId,
            envType: rootState.envInfo.env === 'test' ? 0 : 1,
            faqIds: idList
        };
        axiosPost(url, params, data, headers).then(function (response) {
            if (response.errno != 0) {
                reject({ "errno": response.errno, "errorMsg": response.errMsg });
            } else {
                resolve({ "errno": 0, "errorMsg": "process has finished normally." });
            }
        }, function () {
            reject({ "errno": COMMON.commonErrorCode, "errorMsg": COMMON.commonErrorMsg });
        })
    })
}

// 新增start
// recommendation question (create, update)
const changeLeadTheProblem = function (rootState: any, questionDetail: any) {
    return new Promise((resolve, reject) => {
        let recommendation = "";
        for (const item of questionDetail.leadTheProblem) {
            recommendation = recommendation + "^" + item.value;
        }
        if (recommendation.length > 2) {
            recommendation = recommendation.substring(1);
        }
        const url = API.port9401.questionAnswer;
        const headers = {};
        const params = {
            op: "add"
        };
        const data = {
            botid: rootState.robotInfo.robotId,
            userid: rootState.userId,
            faqid: questionDetail.sqId,
            env: rootState.envInfo.env === 'test' ? 0 : 1,
            preposedqid: recommendation
            // data: [{
            //     userid: rootState.userId,
            //     squestion: questionDetail.standardQuestion,
            //     sqid: questionDetail.standardQuestionMd5,
            //     faqid: questionDetail.sqId,
            //     recsq: recommendation,
            //     pos: "",
            //     creator: rootState.userId,
            //     env: rootState.envInfo.env === 'test' ? 0 : 1,
            // }]
        };
        axiosPost(url, params, data, headers).then(function (response) {
            if (response.errno != 0) {
                reject({ "errno": response.errno, "errorMsg": response.errMsg });
            } else {
                resolve({ "errno": 0, "errorMsg": "process has finished normally." });
            }
        }, function () {
            reject({ "errno": COMMON.commonErrorCode, "errorMsg": COMMON.commonErrorMsg });
        })
    })
}
// recommendation question for redis (create, update)
const changeLeadTheProblemRedis = function (rootState: any, questionDetail: any) {
    return new Promise((resolve, reject) => {
        let recommendation = "";
        for (const item of questionDetail.leadTheProblem) {
            recommendation = recommendation + "^" + item.value;
        }
        const url = API.port9402.questionAnswer;
        const headers = {};
        const data = {
            env: rootState.envInfo.env === 'test' ? 0 : 1,
            faqid: questionDetail.sqId,
            botid: rootState.robotInfo.robotId,
            userid: rootState.userId,
            preposedqid: recommendation.substring(1)
        };
        const params = {};
        axiosPost(url, params, data, headers).then(function (response) {
            if (response.errno != 0) {
                reject({ "errno": response.errno, "errorMsg": response.errorMsg });
            } else {
                resolve({ "errno": 0, "errorMsg": "process has finished normally." });
            }
        }, function () {
            reject({ "errno": COMMON.commonErrorCode, "errorMsg": COMMON.commonErrorMsg });
        })
    })
}
// 新增end

// main function of standard question (delete)
// const deleteStandardQuestion = function (rootState: any, idList: []) {
//     return new Promise((resolve, reject) => {
//         const url = API.port8000.questionAnswer + "delete";
//         const headers = {};
//         const params = {};
//         const data = {
//             userId: rootState.userId,
//             botId: rootState.robotInfo.robotId,
//             envType: rootState.envInfo.env === 'test' ? 0 : 1,
//             faqIds: idList
//         };
//         axiosPost(url, params, data, headers).then(function (response) {
//             if (response.errno != 0) {
//                 reject({ "errno": response.errno, "errorMsg": response.errorMsg });
//             } else {
//                 resolve({ "errno": 0, "errorMsg": "process has finished normally." });
//             }
//         }, function () {
//             reject({ "errno": COMMON.commonErrorCode, "errorMsg": COMMON.commonErrorMsg });
//         })
//     })
// }

// standard question for mongodb (delete)
// const deleteStandardQuestionMongodb = function (rootState: any, idList: []) {
//     return new Promise((resolve, reject) => {
//         const url = API.port50001.questionAnswer;
//         const headers = {};
//         const params = {};
//         const data = {
//             action: "delete",
//             data: idList
//         };
//         axiosPost(url, params, data, headers).then(function (response) {
//             if (response.err_code != 0) {
//                 reject({ "errno": response.err_code, "errorMsg": response.err_msg });
//             } else {
//                 resolve({ "errno": 0, "errorMsg": "process has finished normally." });
//             }
//         }, function () {
//             reject({ "errno": COMMON.commonErrorCode, "errorMsg": COMMON.commonErrorMsg });
//         })
//     })
// }

// similar question for elasticsearch (delete)
const deleteSimilarQuestionEs = function (rootState: any, id: string) {
    return new Promise((resolve, reject) => {
        const url = API.port40001.questionAnswer;
        const headers = {};
        const params = {};
        const data = {
            action: "add",
            status: 3,
            faqid: id,
            data: []
        };
        axiosPost(url, params, data, headers).then(function (response) {
            if (response.err_code != 0) {
                reject({ "errno": response.err_code, "errorMsg": response.err_msg });
            } else {
                resolve({ "errno": 0, "errorMsg": "process has finished normally." });
            }
        }, function () {
            reject({ "errno": COMMON.commonErrorCode, "errorMsg": COMMON.commonErrorMsg });
        })
    })
}

// standard question for redis (delete)
// const deleteStandardQuestionRedis = function (rootState: any, idList: []) {
//     return new Promise((resolve, reject) => {
//         const url = API.port5811.deleteQuestionAnswer;
//         const headers = {};
//         const data = {};
//         for (const item of idList) {
//             const params = {
//                 envType: rootState.envInfo.env === 'test' ? 0 : 1,
//                 faqid: item,
//                 botid: rootState.robotInfo.robotId
//             };
//             axiosGet(url, params, data, headers).then(function (response) {
//                 if (response.errno != 0) {
//                     reject({ "errno": response.errno, "errorMsg": response.errorMsg });
//                 }
//             }, function () {
//                 reject({ "errno": COMMON.commonErrorCode, "errorMsg": COMMON.commonErrorMsg });
//             })
//         }
//         resolve({ "errno": 0, "errorMsg": "process has finished normally." });
//     })
// }

// similar question for mongodb (delete)
// const deleteSimilarQuestionMongodb = function (rootState: any, idList: []) {
//     return new Promise((resolve, reject) => {
//         for (const item of idList) {
//             const url = API.port9140.questionAnswer + "revise";
//             const headers = {};
//             const params = {};
//             const data = {
//                 uquestion: [""],
//                 faqid: item,
//                 userid: rootState.userId,
//                 botid: rootState.robotInfo.robotId,
//                 province: "",
//                 idList: [""],
//                 envType: rootState.envInfo.env === 'test' ? 0 : 1
//             };
//             axiosPost(url, params, data, headers).then(function (response) {
//                 if (response.errno != 0) {
//                     reject({ "errno": response.errno, "errorMsg": response.errorMsg });
//                 }
//             }, function () {
//                 reject({ "errno": COMMON.commonErrorCode, "errorMsg": COMMON.commonErrorMsg });
//             })
//         }
//         resolve({ "errno": 0, "errorMsg": "process has finished normally." });
//     })
// }

// recommendation question (delete)
// const deleteRecommendationQuestion = function (rootState: any, idList: any[]) {
//     return new Promise((resolve, reject) => {
//         for (const item of idList) {
//             const url = API.port9092.questionAnswer;
//             const headers = {};
//             const params = {
//                 op: "del"
//             };
//             const data = {
//                 botid: rootState.robotInfo.robotId,
//                 faqid: item,
//                 env: rootState.envInfo.env === 'test' ? 0 : 1,
//             };
//             axiosPost(url, params, data, headers).then(function (response) {
//                 if (response.errno != 0) {
//                     reject({ "errno": response.errno, "errorMsg": response.errMsg });
//                 }
//             }, function () {
//                 reject({ "errno": COMMON.commonErrorCode, "errorMsg": COMMON.commonErrorMsg });
//             })
//         }
//         resolve({ "errno": 0, "errorMsg": "process has finished normally." });
//     })
// }

// recommendation question for redis (delete)
const deleteRecommendationQuestionRedis = function (rootState: any, id: string) {
    return new Promise((resolve, reject) => {
        const url = API.port5801.addRecommendation;
        const headers = {};
        const data = {};
        const params = {
            envType: rootState.envInfo.env === 'test' ? 0 : 1,
            faqid: id,
            botid: rootState.robotInfo.robotId,
            ads: ""
        };
        axiosGet(url, params, data, headers).then(function (response) {
            if (response.errno != 0) {
                reject({ "errno": response.errno, "errorMsg": response.errorMsg });
            } else {
                resolve({ "errno": 0, "errorMsg": "process has finished normally." });
            }
        }, function () {
            reject({ "errno": COMMON.commonErrorCode, "errorMsg": COMMON.commonErrorMsg });
        })
    })
}

// main function of standard question (query detail)
const detailStandardQuestion = function (rootState: any, id: string) {
    return new Promise((resolve, reject) => {
        const url = API.port8000.questionAnswer + "info";
        const headers = {};
        const params = {};
        const data = {
            userId: rootState.userId,
            botId: rootState.robotInfo.robotId,
            envType: rootState.envInfo.env === 'test' ? 0 : 1,
            faqId: id
        };
        axiosPost(url, params, data, headers).then(function (response) {
            if (response.errno != 0) {
                reject({ "errno": response.errno, "errorMsg": response.errorMsg });
            } else {
                resolve({
                    standardQuestion: response.result.faqQuestion,
                    answer: response.result.faqAnswer,
                    keyWord: response.result.keywords,
                    threshold: Number(response.result.thresdhold),
                    flag: response.result.flag
                });
            }
        }, function () {
            reject({ "errno": COMMON.commonErrorCode, "errorMsg": COMMON.commonErrorMsg });
        })
    })
}

// similar question for elasticsearch (query detail)
const detailSimilarQuestion = function (rootState: any, id: string) {
    return new Promise((resolve, reject) => {
        const url = API.port9140.questionAnswer + "search";
        const headers = {};
        const params = {
            userid: rootState.userId,
            faqid: id,
            botid: rootState.robotInfo.robotId,
            envType: rootState.envInfo.env === 'test' ? 0 : 1
        };
        const data = {};
        axiosPost(url, params, data, headers).then(function (response) {
            if (response.errno != 0) {
                reject({ "errno": response.errno, "errorMsg": response.errorMsg });
            } else {
                resolve({ similarQuestion: response.uquestionList });
            }
        }, function () {
            reject({ "errno": COMMON.commonErrorCode, "errorMsg": COMMON.commonErrorMsg });
        })
    })
}

// recommendation question (query detail)
const detailRecommendationQuestion = function (rootState: any, id: string) {
    return new Promise((resolve, reject) => {
        const url = API.port9092.questionAnswer;
        const headers = {};
        const params = {
            op: "search"
        };
        const data = {
            faqid: id,
            botid: rootState.robotInfo.robotId,
            env: rootState.envInfo.env === 'test' ? 0 : 1,
            userid: rootState.userId
        };
        axiosPost(url, params, data, headers).then(function (response) {
            if (response.errno != 0) {
                reject({ "errno": response.errno, "errorMsg": response.errMsg });
            } else {
                if (response.result.length > 0) {
                    const recValueList = response.result[0].recsq.split("^A").filter(function (str: string) {
                        return str && str.trim();
                    });
                    const recLabelList = response.result[0].recsquestion.split("^A").filter(function (str: string) {
                        return str && str.trim();
                    });
                    const result: any[] = [];
                    for (let i = 0; i < recValueList.length; i++) {
                        result.push({
                            "label": recLabelList[i],
                            "value": recValueList[i]
                        });
                    }
                    resolve({ recommendationQuestion: result });
                } else {
                    resolve({ recommendationQuestion: [] });
                }
            }
        }, function () {
            reject({ "errno": COMMON.commonErrorCode, "errorMsg": COMMON.commonErrorMsg });
        })
    })
}

// search standard question by keyword and calendar
const searchStandardQuestion = async function (rootState: any, robotId: string, keyword: string, startDate: string, endDate: string, type: string) {
    let queryContinue = true;
    let queryFrom = 0;
    let result: any[] = [];
    const url = API.port50001.questionAnswer;
    const headers = {};
    const params = {};

    while (queryContinue) {
        const data = {
            action: "get",
            data: {
                botid: robotId,
                keyword: keyword,
                env: rootState.envInfo.env === 'test' ? 0 : 1,
                size: 500,
                from: queryFrom * 500,
                datestart: startDate,
                dateend: endDate
            },
        };
        const response = await axiosPost(url, params, data, headers);
        if(type === "all") {
            if (response.err_code != 0) {
                return { "errno": response.err_code, "errorMsg": response.err_msg, "result": result };
            } else if (response.result.length > 0) {
                result = result.concat(response.result);
                queryFrom++;
            }else {
                queryContinue = false;
            }
        }else if(type === "only") {
            result = result.concat(response.result);
            queryContinue = false;
        }
    }
    return { "errno": 0, "errorMsg": "process has finished normally.", "result": result };
}

const delVioOrImg = function(answer: any) {
    return new Promise((resolve, reject) => {
        const data = answer;
        const params = {};
        const url = API.port9334.delVio;
        const headers = {};
        axiosPost(url, params, data, headers).then(res => {
            resolve(res)
        }).catch(error => {
            if (error.errno == '-101') {
                reject({"errno": error.errno, "errorMsg": error.errMsg })
            }
            reject({ "errno": COMMON.commonErrorCode, "errorMsg": COMMON.commonErrorMsg, "result": [] });
        })
    })
}

const actions = {
    // query question list
    queryQuestionList(context: any,parameter: any) {
        return new Promise((resolve) => {
            context.commit('showLoading', {}, { root: true });
            const url = API.port8000.questionAnswer + "list";
            const headers = {};
            const params = {};
            const data = {
                userId: context.rootState.userId,
                botId: context.rootState.robotInfo.robotId,
                // botId: parameter.route.robotId,
                envType: context.rootState.envInfo.env === 'test' ? 0 : 1,
                // envType: parameter.route.env === 'test' ? 0 : 1
                pagesize: parameter.pageSize,
                page: parameter.currentPage
            };
            axiosPost(url, params, data, headers).then(function (response) {
                if (response.errno == 0 || response.errno == -100) {
                    const questionList: any = []
                    for (const item of response.result.faqList) {
                        questionList.push({
                            id: item.faqId,
                            question: item.faqQuestion,
                            answer: item.faqAnswer,
                            editor: item.faqCreator,
                            editTime: item.editTime,
                            flag: item.flag,
                            faqNum: response.result.faqNum
                        })
                    }
                    context.commit('setQuestionList', questionList);
                }
                context.commit('hideLoading', {}, { root: true });
                if (response.errno == '-101') {
                    context.commit('setGlobalFreeze', {}, { root: true });
                }
                resolve({ "errno": response.errno, "errorMsg": response.errorMsg });
            }).catch(function () {
                context.commit('hideLoading', {}, { root: true });
                resolve({ "errno": COMMON.commonErrorCode, "errorMsg": COMMON.commonErrorMsg });
            })
        })
    },
    // create and update question details
    changeQuestionDetail(context: any, questionDetail: any) {
        return new Promise((resolve) => {
            context.commit('showLoading', {}, { root: true });
            // remove blank similarQuestion
            questionDetail.similarQuestion = questionDetail.similarQuestion.concat(questionDetail.similarQuestionHead).concat(questionDetail.similarQuestionTail);
            questionDetail.similarQuestion = questionDetail.similarQuestion.filter(function (str: string) {
                return str && str.trim();
            });
            // remove blank keyWord
            questionDetail.keyWord = questionDetail.keyWord.concat(questionDetail.keyWordHead).concat(questionDetail.keyWordTail);
            questionDetail.keyWord = questionDetail.keyWord.filter(function (str: string) {
                return str && str.trim();
            });
            // set questionId for create operation
            const currentTime = (new Date()).valueOf();
            const randomNum = Math.ceil(Math.random() * 10000);
            context.commit('setCurrentTime', currentTime);
            context.commit('setRandomNum', randomNum);
            if (state.detailMode == "create") {
                questionDetail.sqId = Md5.hashStr(context.rootState.robotInfo.robotId + currentTime + randomNum);
            }
            questionDetail.standardQuestionMd5 = Md5.hashStr(questionDetail.standardQuestion);
            // execute create operation
            changeStandardQuestion(context.rootState, questionDetail).then(function () {
                return changeStandardQuestionMongodb(context.rootState, questionDetail)
            }).then(function () {
                if (questionDetail.similarQuestion.length > 0) {
                    return changeSimilarQuestionEs(context.state, context.getters, context.rootState, questionDetail)
                } else {
                    return deleteSimilarQuestionEs(context.rootState, questionDetail.sqId);
                }
            }).then(function () {
                return changeStandardQuestionRedis(context.rootState, questionDetail)
            }).then(function () {
                return changeSimilarQuestionMongodb(context.state, context.getters, context.rootState, questionDetail)
            }).then(function () {
                return changeRecommendationQuestion(context.rootState, questionDetail);
            }).then(function () {
                if (questionDetail.recommendationQuestion.length > 0) {
                    return changeRecommendationQuestionRedis(context.rootState, questionDetail);
                } else {
                    return deleteRecommendationQuestionRedis(context.rootState, questionDetail.sqId);
                }
            }).then(function () {
                return changeLeadTheProblem(context.rootState, questionDetail);
            }).then(function() {
                // 新增start
                // if (questionDetail.recommendationQuestion.length > 0) {
                //     return changeRecommendationQuestionRedis(context.rootState, questionDetail);
                // } else {
                //     return deleteRecommendationQuestionRedis(context.rootState, questionDetail.sqId);
                // }
                return changeLeadTheProblemRedis(context.rootState, questionDetail);
                // 新增end
            }).then(function () {
                context.commit('hideLoading', {}, { root: true });
                resolve({ "errno": 0, "errorMsg": "process has finished normally." });
            }).catch(function (error) {
                context.commit('hideLoading', {}, { root: true });
                if (error.errno == '-101') {
                    context.commit('setGlobalFreeze', {}, { root: true });
                }
                resolve(error);
            })
        })
    },
    // delete question list
    deleteQuestion(context: any, selectedRows: any) {
        return new Promise((resolve) => {
            context.commit('showLoading', {}, { root: true });
            // deleteStandardQuestion(context.rootState, selectedRows.key).then(function (response) {
            //     return deleteStandardQuestionMongodb(context.rootState, selectedRows.key);
            // }).then(function (response) {
            //     return deleteSimilarQuestionEs(context.rootState, selectedRows.key);
            // }).then(function (response) {
            //     return deleteStandardQuestionRedis(context.rootState, selectedRows.key);
            // }).then(function (response) {
            //     return deleteSimilarQuestionMongodb(context.rootState, selectedRows.key);
            // }).then(function (response) {
            //     return deleteRecommendationQuestion(context.rootState, selectedRows.key);
            // }).then(function (response) {
            //     context.commit('hideLoading', {}, { root: true });
            //     resolve({ "errno": 0, "errorMsg": "process has finished normally." });
            // }).catch(function (error) {
            //     context.commit('hideLoading', {}, { root: true });
            //     resolve(error);
            // })
            deleteQuestionList(context.rootState, selectedRows.key).then(function () {
                context.commit('hideLoading', {}, { root: true });
                resolve({ "errno": 0, "errorMsg": "process has finished normally." });
                // 如果是图片和视频需要再次调用删除图片视频的接口
                let answer = "";
                const selectedRowsCyclic = selectedRows.selectedRows
                for (let i=0; i<selectedRowsCyclic.length; i++) {
                    if (selectedRowsCyclic[i]["flag"] != 0) {
                        answer = answer.concat(selectedRowsCyclic[i]["answer"])
                    }
                }
                if (answer != "") {
                    const obj = {
                        answer: answer,
                        userId: selectedRows.userId,
                        botId: selectedRows.robotId
                    }
                    delVioOrImg(obj).then(res => {
                        console.log('删除图片和视频成功',res)
                    }).catch(error => {
                        context.commit('hideLoading', {}, { root: true });
                        if (error.errno == '-101') {
                            context.commit('setGlobalFreeze', {}, { root: true });
                        }
                    })
                }
            }).catch(function (error) {
                context.commit('hideLoading', {}, { root: true });
                if (error.errno == '-101') {
                    context.commit('setGlobalFreeze', {}, { root: true });
                }
                resolve(error);
            })
        })
    },
    // 新增start
    queryLeadTheProblem(context: any, id: string) {
        const url = API.port9401.leadTheProblem;
        const params = {};
        const data = {
            faqid: id,
            botid: context.rootState.robotInfo.robotId,
            userid: context.rootState.userId,
            env: context.rootState.envInfo.env === 'test' ? 0 : 1
        };
        const headers = {};
        return new Promise((resolve,reject) => {
            context.commit('showLoading', {}, { root: true });
            axiosPost(url,params,data,headers).then(function (response: any) {
                // return detailRecommendationQuestion(context.rootState, id);
                context.commit('hideLoading', {}, { root: true });
                resolve({ "errno": 0, "errorMsg": response.errorMsg, "detail": response.result });
            }).catch(function (error) {
                context.commit('hideLoading', {}, { root: true });
                // if (error.errno == '-101') {
                // }
                reject(error);
            })
            // .then(function (response: any) {
            //     leadTheProblem.recommendationQuestion = response.recommendationQuestion;
            //     context.commit('hideLoading', {}, { root: true });
            //     resolve({ "errno": 0, "errorMsg": "process has finished normally.", "detail": questionDetail });
            // }).catch(function (error) {
            //     context.commit('hideLoading', {}, { root: true });
            //     if (error.errno == '-101') {
            //         context.commit('setGlobalFreeze', {}, { root: true });
            //     }
            //     resolve(error);
            // })
        })
    },
    // 新增end
    // query question details
    queryQuestionDetail(context: any, id: string) {
        const questionDetail = {
            sqId: "",
            standardQuestion: "",
            similarQuestion: [],
            similarQuestionHead: "",
            similarQuestionTail: [],
            keyWord: [],
            keyWordHead: "",
            keyWordTail: [],
            threshold: 0,
            recommendationQuestion: [],
            answer: "",
            flag: "",
            leadTheProblem: []
        };
        return new Promise((resolve) => {
            context.commit('showLoading', {}, { root: true });
            detailStandardQuestion(context.rootState, id).then(function (response: any) {
                questionDetail.sqId = id;
                questionDetail.standardQuestion = response.standardQuestion;
                questionDetail.keyWordTail = response.keyWord;
                questionDetail.threshold = response.threshold;
                questionDetail.answer = response.answer;
                questionDetail.flag = response.flag;
                return detailSimilarQuestion(context.rootState, id);
            }).then(function (response: any) {
                questionDetail.similarQuestionTail = response.similarQuestion;
                return detailRecommendationQuestion(context.rootState, id);
            }).then(function (response: any) {
                questionDetail.recommendationQuestion = response.recommendationQuestion;
                context.commit('hideLoading', {}, { root: true });
                resolve({ "errno": 0, "errorMsg": "process has finished normally.", "detail": questionDetail });
            }).catch(function (error) {
                context.commit('hideLoading', {}, { root: true });
                if (error.errno == '-101') {
                    context.commit('setGlobalFreeze', {}, { root: true });
                }
                resolve(error);
            })
        })
    },
    // query recommendation question list
    queryRecommendationQuestion(context: any, keyword: string) {
        return new Promise((resolve) => {
            context.commit('showLoading', {}, { root: true });
            const result: any[] = [];
            searchStandardQuestion(context.rootState, context.rootState.robotInfo.robotId, keyword, "", "","only").then(function (response: any) {
                for (const item of response.result) {
                    result.push({
                        "label": item.squestion,
                        "value": item.id
                    });
                }
                context.commit('hideLoading', {}, { root: true });
                if (response.errno == '-101') {
                    context.commit('setGlobalFreeze', {}, { root: true });
                }
                resolve({ "errno": response.errno, "errorMsg": response.errorMsg, "result": result });
            }).catch(function (error) {
                context.commit('hideLoading', {}, { root: true });
                resolve({ "errno": COMMON.commonErrorCode, "errorMsg": COMMON.commonErrorMsg, "result": [] });
            })
        })
    },
    // query question list by keyword and calendar
    queryStandardQuestionByParams(context: any, params: any) {
        return new Promise((resolve) => {
            context.commit('showLoading', {}, { root: true });
            const questionList: any = []
            searchStandardQuestion(context.rootState, context.rootState.robotInfo.robotId, params.keyword, params.startDate, params.endDate,"all").then(function (response: any) {
                for (const item of response.result) {
                    questionList.push({
                        id: item.id,
                        question: item.squestion,
                        answer: item.answer,
                        editor: item.creator,
                        editTime: item.edittime,
                        flag: item.flag
                    })
                }
                context.commit('hideLoading', {}, { root: true });
                if (response.errno == '-101') {
                    context.commit('setGlobalFreeze', {}, { root: true });
                }
                resolve({ "errno": response.errno, "errorMsg": response.errorMsg, "result": sortQuestionList(questionList) });
            }).catch(function (error) {
                context.commit('hideLoading', {}, { root: true });
                if (error.errno == '-101') {
                    context.commit('setGlobalFreeze', {}, { root: true });
                }
                resolve({ "errno": COMMON.commonErrorCode, "errorMsg": COMMON.commonErrorMsg, "result": [] });
            })
        })
    },
    getPicOrVio(context: any, answerId: any) {
        return new Promise((resolve,reject) => {
            context.commit('showLoading', {}, { root: true });
            const data = answerId;
            const params = {};
            const url = API.port9334.GetPicOrVio;
            const headers = {};
            axiosPost(url, params, data, headers).then(res => {
                context.commit('hideLoading', {}, { root: true });
                resolve(res)
            }).catch(error => {
                context.commit('hideLoading', {}, { root: true });
                if (error.errno == '-101') {
                    context.commit('setGlobalFreeze', {}, { root: true });
                }
                resolve({ "errno": COMMON.commonErrorCode, "errorMsg": COMMON.commonErrorMsg, "result": [] });
            })
        })
    },
    delVio(context: any, answer: any) {
        return new Promise((resolve, reject) => {
            delVioOrImg(answer).then(res => {
                resolve(res);
            }).catch(error => {
                if (error.errno == '-101') {
                    context.commit('setGlobalFreeze', {}, { root: true });
                }
                resolve(error);
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
