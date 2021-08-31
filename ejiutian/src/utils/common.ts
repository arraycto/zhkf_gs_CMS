import moment from 'moment';
import sensitiveFile1 from '../constant/sensitiveWords1';
import sensitiveFile2 from '../constant/sensitiveWords2';
import sensitiveExceptWords from '../constant/sensitiveExceptWords';

export function judgeSensitiveWord(input: string) {
    const sensitiveWords = sensitiveFile1.words.concat(sensitiveFile2.words);
    const exceptWords = sensitiveExceptWords.words;
    let detectedResult = true;
    const detectedWords = [];
    let errorMsg = "";
    for (const i in exceptWords) {
        input = input.replace(new RegExp(exceptWords[i], "gi"), "");
    }
    for (const i in sensitiveWords) {
        if (input.indexOf(sensitiveWords[i]) != -1) {
            detectedWords.push(sensitiveWords[i]);
            detectedResult = false;
        }
    }
    if (!detectedResult) {
        errorMsg = "包含敏感词";
    }
    return {
        "detectedResult": detectedResult,
        "detectedWords": detectedWords,
        "errorMsg": errorMsg
    };
}

export function judgeSpecialCharacters(input: string) {
    const specialCharacters = ['\'', '"', '<', '>'];
    let detectedResult = true;
    const detectedWords = [];
    let errorMsg = "";

    for (const i in specialCharacters) {
        if (input.indexOf(specialCharacters[i]) != -1) {
            detectedWords.push(specialCharacters[i]);
            detectedResult = false;
        }
    }
    if (!detectedResult) {
        errorMsg = "包含特殊字符";
    }
    return {
        "detectedResult": detectedResult,
        "detectedWords": detectedWords,
        "errorMsg": errorMsg
    };
}
export function getRandomNum(param: string) {
    let num = '';
    for(let i=0;i<3;i++){
        num+=Math.floor(Math.random()*10);
    }
    return num + param
}

export function time2Timestamp(time: string) {
    return moment(time, 'YYYY-MM-DD HH:mm:ss').valueOf();
}
