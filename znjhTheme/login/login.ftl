<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <title>智能交互中心</title>
        <link rel="icon" href="${url.resourcesPath}/img/favicon.ico" />
        <link href="${url.resourcesPath}/css/login.css" rel="stylesheet" />
        <script src="${url.resourcesPath}/js/vue.min.js"></script>
    </head>
    <body>
        <div id="mainDiv">
            <div class="leftDiv">
                <div class="logoDiv">
                    <img src="${url.resourcesPath}/img/jiutian_logo.png" style="width: 100%; height: 100%" alt />
                </div>
            </div>
            <div class="rightDiv">
                <div class="titleDiv">
                    <span>欢迎来到</span>
                    <span>智能交互平台</span>
                </div>
                <form id="kc-form-login" onsubmit="login.disabled = true; return true;" action="${url.loginAction}" method="post">
                    <div class="errorMsgDiv">
                        <#if message?has_content && message.type == 'error'>
                            <span>用户名或密码有误，请重新输入</span>
                        </#if>
                    </div>
                    <div class="userDiv">
                        <div style="width: 368px; position: relative;">
                            <img src="${url.resourcesPath}/img/user.png" class="inputUserImg" alt="" />
                            <input
                                placeholder="用户名"
                                id="username"
                                class="userInput"
                                name="username"
                                v-model="kUser"
                                type="text"
                                autofocus
                                autocomplete="off"
                            />
                        </div>
                    </div>
                    <div class="pwdDiv">
                        <div style="display: flex; flex-flow: row nowrap;">
                            <div style="width: 368px; position: relative;">
                                <img src="${url.resourcesPath}/img/lock.png" class="inputLockImg" alt="" />
                                <input
                                    placeholder="密码"
                                    id="password"
                                    class="passwordInput"
                                    name="password"
                                    v-model="kPassword"
                                    :type="showPassword?'text':'password'"
                                    autocomplete="off"
                                />
                                <img
                                    v-if="!showPassword"
                                    src="${url.resourcesPath}/img/eye_open.png"
                                    class="inputEyeImg"
                                    @click="showPassword = !showPassword"
                                    alt=""
                                />
                                <img
                                    v-if="showPassword"
                                    src="${url.resourcesPath}/img/eye_close.png"
                                    class="inputEyeImg"
                                    @click="showPassword = !showPassword"
                                    alt=""
                                />
                            </div>
                        </div>
                    </div>
                    <div class="rpDiv">
                        <input type="checkbox" v-model="rememberChecked">
                        <span class="rememberText">记住密码</span>
                    </div>
                    <div class="btDiv">
                        <input
                            type="submit"
                            class="loginBtn"
                            name="login"
                            id="kc-login"
                            value="登 录"
                            @click="rememberUser()"
                        />
                    </div>
                </form>
                <div class="crDiv">
                    <span>copyright</span>
                    <span style="margin-left: 4px; margin-right: 4px">©</span>
                    <span>中国移动九天·智能化编排平台</span>
                </div>
            </div>
        </div>
    </body>
    <script src="${url.resourcesPath}/js/login.js"></script>
</html>
