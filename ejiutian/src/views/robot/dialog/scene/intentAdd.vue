<template>
    <div  class="contentBody" >
        <div class="contentTop">

            <jt-row class="sector">
                <div style="margin-top:20px;margin-left:20px;"> 
                    <span class="title">意图入口</span> 
                </div>
                <div class="form-content">
                    <jt-row class="form-row input-row" :gutter="16" style="margin-left:0px;margin-right:0px;">
                        <jt-col class="row-title" :span="4">  
                            <span style="color: #F04134; margin-right: 4px;">*</span>意图
                        </jt-col>
                        <jt-col class="row-content" :span="10">
                            <jt-input placeholder="请输入125字以内意图，不可重复" id="inputTopics"
                                      style="width: 436px; height: 32px; margin-right: 8px; margin-bottom: 4px;" 
                                      v-model="form.topics"  :disabled="inputDisabled"  @blur="validateTopics()" @change="validateTopics()" />
                            <span v-show="env === 'test' && !validate.topics" class="errorTip">{{inputError.topics}}</span>
                        </jt-col>
                    </jt-row>

                    <jt-row class="form-row input-row" :gutter="16" style="margin-left:0px;margin-right:0px;">
                        <jt-col class="row-title" :span="4"> 
                            <span style="color: #F04134; margin-right: 4px;">*</span>
                            关键词
                        </jt-col>
                        <jt-col class="row-content" :span="12" style="width:75%">
                            <div style="display: flex; flex-flow: row; flex-wrap: wrap;">
                                <jt-input
                                    id="inputKeyWordHead"
                                    style="width: 180px; height: 32px; margin-right: 8px; margin-bottom: 4px;"
                                    placeholder="请输入12字以内的关键词"
                                    v-model="form.model.firstKeyWordValue"
                                    :disabled="inputDisabled"
                                    @keyup.enter="addFirst('keyword')"
                                    v-show="env === 'test' "
                                    @blur="validateKeyWord()"
                                    @change="validateKeyWord()"
                                ></jt-input>
                                <jt-input
                                    style="width: 180px; height: 32px; margin-right: 8px; margin-bottom: 4px;"
                                    placeholder="请输入12字以内的关键词"
                                    v-for="(item, index) in form.firstQuestion.wordKeyLists"
                                    :id="'inputKeyWord_' + index"
                                    :value="item"
                                    :key="index"
                                    v-model="form.firstQuestion.wordKeyLists[index]"
                                    :disabled="inputDisabled"
                                    @blur="validateKeyWord()"
                                    @change="validateKeyWord()"
                                >
                                    <span
                                        v-show="env === 'test' "
                                        slot="suffix"
                                        class="iconfont iconshanchu1"
                                        @click="removeFirst('keyword', index)"
                                    ></span>
                                </jt-input>
                            </div>
                            <div style="margin-bottom: -4px;">
                                <span v-show="env === 'test' && validate.keyWord" class="normalTip">{{tips.keyWord}}</span>
                                <span v-show="env === 'test' && !validate.keyWord" class="errorTip">{{inputError.keyWord}}</span>
                            </div>
                        </jt-col>
                    </jt-row>

                </div>

                <div style="margin-top:64px;margin-left:20px;"> 
                    <span class="title">机器人说</span> 
                </div>
                <div class="form-content">
                    <jt-row class="form-row input-row" :gutter="16" style="margin-left:0px;margin-right:0px;">
                        <jt-col class="row-title" :span="4">  
                            <span style="color: #F04134; margin-right: 4px;">*</span>命中回复 
                        </jt-col>
                        <jt-col class="row-content" :span="12" >
                            <div style="display: flex; flex-flow: row; flex-wrap: wrap; ">
                                <jt-input
                                    id="inputhitListsHead"
                                    class = 'input-item' 
                                    placeholder="请输入125字以内的命中回复"
                                    :disabled="inputDisabled"
                                    v-model='form.model.firstHitValue'
                                    @keyup.enter="addFirst('hit')"
                                    v-show="env === 'test' "
                                    @blur="validateFirstHits"
                                    @change="validateFirstHits"
                                ></jt-input>
                                <div class='input-list'>
                                    <jt-input
                                        class="input-item"
                                        placeholder="请输入125字以内的命中回复"
                                        v-for="(item, index) in form.firstQuestion.hitLists"
                                        :id="'inputhitLists_' + index"
                                        :value="item"
                                        :key="index"
                                        v-model="form.firstQuestion.hitLists[index]"
                                        :disabled="inputDisabled"
                                        @blur="validateFirstHits"
                                        @change="validateFirstHits"
                                    >
                                        <span
                                            v-show="env === 'test'"
                                            slot="suffix"
                                            class="iconfont iconshanchu1"
                                            @click="removeFirst('hit', index)"
                                        ></span>
                                    </jt-input>

                                </div>
                                
                            </div>
                            <div style="margin-bottom: -4px;margin-top:4px;">
                                <span v-show="env === 'test' && validate.hitMsg" class="normalTip">{{tips.hit}}</span>
                                <span v-show="env === 'test' && !validate.hitMsg" class="errorTip">{{inputError.hitMsg}}</span>
                            </div>
                        </jt-col>
                    </jt-row>

                </div>
                
            </jt-row>


            <!-- 用户说 -->
            <jt-row class="sector" :key="i" v-for="(item, i) in form.nextQuestions">
                <div style="text-align:right;height:32px;">

                    <jt-button type="link" class="link-btn" @click="removeElement(i)" v-show="$store.state.envInfo.env === 'test'">
                        <jt-icon type="delete" />
                        <span class="link-btn-font">删除</span></jt-button>
                    
                    <jt-button type="link" class="link-btn"  @click="show()" v-show="flag===false">
                        <jt-icon type="down" />展开</jt-button>
                    <jt-button type="link" class="link-btn"  @click="show()" v-show="flag===true">
                        <jt-icon type="up" />关闭</jt-button>
                </div>
                
                <div>
                    <div style="margin-top:-12px;margin-left:20px;"> 
                        <span class="title">用户说</span> 
                    </div>
                    <div class="form-content">
                        <jt-row class="form-row input-row" :gutter="16" style="margin-left:0px;margin-right:0px;">

                            <jt-col class="row-title" :span="4"> 关键词 </jt-col>

                            <jt-col class="row-content" :span="12" style="width:75%">
                                <div style="display: flex; flex-flow: row; flex-wrap: wrap;">
                                    <jt-input
                                        :id="'KeyWordHead_' + i"
                                        style="width: 180px; height: 32px; margin-right: 8px; margin-bottom: 4px;"
                                        placeholder="请输入12字以内的关键词"
                                        v-model="form.model.nextKeyWordValue[i]"
                                        :disabled="inputDisabled"
                                        @keyup.enter="addNext('keyword', i)"
                                        v-show="env === 'test' "
                                        @blur="validateNextKeyWord(i)"
                                        @change="validateNextKeyWord(i)"
                                    >
                                    </jt-input>
                                    <jt-input
                                        style="width: 180px; height: 32px; margin-right: 8px; margin-bottom: 4px;"
                                        placeholder="请输入12字以内的关键词"
                                        v-for="(list, index) in item.wordKeyLists"
                                        :id="'KeyWord_' + i + index"
                                        :value="item"
                                        :key="'keyword'+i+index" 
                                        v-model="item.wordKeyLists[index]"
                                        :disabled="inputDisabled"
                                        @blur="validateNextKeyWord(i)"
                                        @change="validateNextKeyWord(i)"
                                    >
                                        <span
                                            v-show="env === 'test'"
                                            slot="suffix"
                                            class="iconfont iconshanchu1"
                                            @click="removeNext('keyword', i, index)"
                                        ></span>
                                    </jt-input>
                                </div>
                                <div style="margin-bottom: -4px;">
                                    <span v-show="env === 'test' && validate.next[i].keyWord" class="normalTip">{{tips.keyWord}}</span>
                                    <span v-show="env === 'test' && !validate.next[i].keyWord" :id="'tip_KeyWord_' + i" class="errorTip">
                                    </span>
                                </div>

                            </jt-col>
                        </jt-row> 

                    </div>

                    <div v-show="flag">
                        <div style="margin-top:64px;margin-left:20px;" > 
                            <span class="title">机器人说</span> </div>
                        <div class="form-content">
                            <jt-row class="form-row input-row " :gutter="16" style="margin-left:0px;margin-right:0px;">
                                <jt-col class="row-title" :span="4"> 
                                    <span style="color: #F04134; margin-right: 4px;">*</span>命中回复  </jt-col>
                                <jt-col class="row-content" :span="12" >
                                    <div style="display: flex; flex-flow: row; flex-wrap: wrap;" >
                                        <jt-input
                                            :id="'hitListsHead_' + i"
                                            class = 'input-item' 
                                            placeholder="请输入125字以内的命中回复"
                                            :disabled="inputDisabled"
                                            v-model='form.model.nextHitValue[i]'
                                            @keyup.enter="addNext('hit', i)"
                                            v-show="env === 'test' "
                                            @blur="validateNextHits(i)"
                                            @change="validateNextHits(i)"

                                        ></jt-input>
                                        <div class="input-list">
                                            <jt-input
                                                class = 'input-item' 
                                                placeholder="请输入125字以内的命中回复"
                                                v-for="(list, index) in item.hitLists"
                                                :id="'hitLists_' +i+ index"
                                                :value="list"
                                                :key="'hits'+i+index"
                                                v-model="item.hitLists[index]"
                                                :disabled="inputDisabled"
                                                @blur="validateNextHits(i)"
                                                @change="validateNextHits(i)"
                                            >
                                                <span
                                                    v-show="env === 'test'"
                                                    slot="suffix"
                                                    class="iconfont iconshanchu1"
                                                    @click="removeNext('hit', i, index)"
                                                ></span>
                                            </jt-input>

                                        </div>
                                        
                                    </div>
                                    <div style="margin-bottom: -4px; margin-top:4px;">
                                        <span v-show="env === 'test' && validate.next[i].hitMsg" class="normalTip">{{tips.hit}}</span>
                                        <span v-show="env === 'test' && !validate.next[i].hitMsg" class="errorTip" :id="'tip_hitLists_'+i">
                                        
                                        </span>
                                    </div>

                                </jt-col>

                            </jt-row>
                            <jt-row class="form-row input-row " :gutter="16"  style="margin-left:0px;margin-right:0px;">
                                <jt-col class="row-title" :span="4"> 未命中回复 </jt-col>
                                <jt-col class="row-content" :span="12">
                                    <div style="display: flex; flex-flow: row; flex-wrap: wrap;" >
                                        <jt-input
                                            :id="'not_hitsHead' + i"
                                            class = 'input-item' 
                                            placeholder="请输入125字以内的未命中回复"
                                            :disabled="inputDisabled"
                                            v-model='form.model.nextNotHitValue[i]'
                                            @keyup.enter="addNext('not_hit', i)"
                                            v-show="env === 'test' "
                                            @blur="validateNextNotHits(i)"
                                            @change="validateNextNotHits(i)"
                                        ></jt-input>
                                        <div class="input-list">
                                            <jt-input
                                                class = 'input-item' 
                                                placeholder="请输入125字以内的未命中回复"
                                                v-for="(list, index) in item.notHitLists"
                                                :id="'not_hits' +i+ index"
                                                :value="list"
                                                :key="'not_hits'+i+index" 
                                                v-model="item.notHitLists[index]"
                                                :disabled="inputDisabled"
                                                @blur="validateNextNotHits(i)"
                                                @change="validateNextNotHits(i)"
                                            >
                                                <span
                                                    v-show="env === 'test'"
                                                    slot="suffix"
                                                    class="iconfont iconshanchu1"
                                                    @click="removeNext('not_hit', i, index)"
                                                ></span>
                                            </jt-input>
                                        </div>
                                        
                                    </div>
                                    <div style="margin-bottom: -4px;margin-top:4px;">
                                        <span v-show="env === 'test' && validate.next[i].notHitMsg" class="normalTip">{{tips.notHit}}</span>
                                        <span v-show="env === 'test' && !validate.next[i].notHitMsg" class="errorTip" :id="'tip_not_hits_'+i"></span>
                                    </div>

                                </jt-col>

                            </jt-row>
                        </div>
                    </div>


                </div> 
                
            </jt-row>
            

            <!-- 添加下一轮 -->
            <jt-row class="sector" style="height:32px;line-height: 32px;" type="flex" justify="center" v-show="env === 'test'">
                <span style="padding: 0px;">
                    <jt-button size="large" style="padding: 0px; width:auto" type="link" @click="next">
                        <jt-icon type="plus" style="width:16px; height:16px;" />添加下一轮对话
                    </jt-button>
                </span>
            </jt-row>

            <jt-row v-show="env === 'test'">
                <div class="button-group">
                    <jt-button class="button" @click="cancel">取消</jt-button>
                    <jt-button class="button" :disabled="disableSubmit" type="primary" @click="save('1')">保存</jt-button>
                    <jt-button class="button" :disabled="disableSubmit" style="width:auto;" type="primary" @click="save('2')" v-show="showNextBtn">保存并新建下一条</jt-button>  
                </div>
            </jt-row>

        </div>
        <!-- <div class="contentBottom" v-show="env === 'test'"> 
            <jt-row v-show="env === 'test'">
                <div class="button-group">
                    <jt-button class="button" @click="cancel">取消</jt-button>
                    <jt-button class="button" :disabled="disableSubmit" type="primary" @click="save('1')">保存</jt-button>
                    <jt-button class="button" :disabled="disableSubmit" style="width:auto;" type="primary" @click="save('2')" v-show="showNextBtn">保存并新建下一条</jt-button>  
                </div>
            </jt-row>
        </div> -->


        

    </div>
    
</template>

<script>
import {FormModel  as JtFormModel} from "ant-design-vue";
import {  axiosPost, axiosGet }  from "../../../../utils/http.js";
import API from '../../../../constant/api';
import { judgeSensitiveWord, getRandomNum } from "@/utils/common.ts";


const host = API.port5001.host;
// const host = "http://127.0.0.1:5001";

// import Vue from 'vue';

export default{
    components:{
        // eslint-disable-next-line vue/no-unused-components
        JtFormModel,
    },
    data(){
        return{
            env: "",
            botid: "",
            userid: "gby",

            form: {
                topics: "",
                firstQuestion: {
                    wordKeyLists:[], 
                    hitLists: [], 
                },
                nextQuestions: [],

                model:{
                    firstKeyWordValue: "",
                    firstHitValue: "",
                    nextKeyWordValue: [],
                    nextHitValue: [],
                    nextNotHitValue: [],
                }
            },
            allWordKeyList: [],

            flag: true,

            skillid: "",
            skillname: this.$route.query.skillname,
            intentid: "",

            showNextBtn: true,
            inputDisabled: false,

            validate: {
                topics: true,
                keyWord: true,
                hitMsg: true,

                next:[],
                requiredNextHit: []
            },
            inputError: {
                topics: "",
                keyWord: "",
                hitMsg: "",
            },
            tips: {
                keyWord: "可按enter添加多个关键词，最多可添加100个",
                hit: "可按enter添加多个命中回复，最多可添加100个",
                notHit:"可按enter添加多个未命中回复，最多可添加100个",

                overLength: "字数超过限制",
                overLengthTopics: "请输入125字以内的意图信息",
                overLengthKeyWord: "请输入12字以内的关键词",
                overLengthHitMsg: "请输入125字以内的命中回复",
                overLengthNotHitMsg: "请输入125字以内的未命中回复",

                overSizeKeyWord: "最多可添加100个关键词",
                overSizeHitMsg: "最多可添加100条命中回复",
                overSizeNotHitMsg: "最多可添加100条未命中回复",
            },
            len:{
                maxSize: 100,
                maxKeyWordLength: 12,
                maxContentLength: 125,
            },

            // folds:[],
            focus: {
                topics: 0,
                keyWord: 0,
                hitMsg: 0,

                next:[],
            }

        }
    },
    mounted(){
        this.env = this.$store.state.envInfo.env;
        this.botid = getRandomNum(this.$store.state.robotInfo.robotId);
        this.userid = getRandomNum(this.$store.state.userId);

        // this.botid = "a070214865c817c21c219888b59e5";
        // this.env = 'test'

        // this.botid = "5dac8bf474051a2e15e14cd723138db2";
        // this.userid = "CIDC-U-fd0c6a552e3a47bc87dec9f3671bd57d";

        if (this.env === 'production'){
            this.inputDisabled = true;
        }

        //pre page
        this.skillid = this.$route.query.skillid;
        // this.skillname = this.$route.query.skillname;

        // edit
        const type = this.$route.query.type;
        if(type == "edit"){
            this.showNextBtn = false;
            // query info by intent id
            this.intentid = this.$route.query.intentid;
            this.queryIntentById(this.intentid)
        }

        let pageName = "新建意图";
        if (this.env != "test") {
            pageName = "查看意图";
        } else if (type == "edit") {
            pageName = "编辑意图";
        }
        this.$store.commit(
            'setBreadcrumb',
            [
                {breadcrumbName: this.$store.state.envInfo.envName, breadcrumbPath: this.$store.state.fromPath},
                {breadcrumbName: "场景式对话", breadcrumbPath: "/home/robotHome/sceneDialog"},
                {breadcrumbName: "场景式意图列表", breadcrumbPath: `/home/robotHome/sceneIntent?skillid=${this.skillid}&skillname=${this.skillname}`},
                {breadcrumbName: pageName},
            ]
        );
        this.$store.commit('hideLoading', {}, { root: true });
    },
    methods:{
        queryIntentById(id){
            const url = host + '/api/dialog/query/' + id;
            const headers = {};
            const params = {
                'envType': this.env === 'test' ? 0 : 1,

                'userid': this.userid,
                'botid': this.botid,
            };
            axiosGet(url, params, null, headers).then((response) => {
                const code = response.code;
                if(code === 1){
                    // this.$message.error("查询失败！失败原因：" + response.msg + "。 请稍后重试");
                    this.$notification.open({
                        message: "查询失败",
                        description: "失败原因：" + response.msg,
                        icon: ( <jt-icon type="exclamation-circle" theme="filled" style="color:#F04134" /> )
                    });
                }else if(code == -101){
                    this.$store.commit('setGlobalFreeze', {}, { root: true });
                }
                else {
                    const recordIntent = response.data;

                    this.form.topics = recordIntent.topics;

                    const keyWords = recordIntent.topicsKeyWords.split(',');
                    this.form.firstQuestion = {
                        wordKeyLists:keyWords, 
                        hitLists: [],
                    }

                    const questions = recordIntent.questions;
                    questions.map((item, index)=>{
                        const kw = questions[index].answer_key_word;
                        let words = [];
                        if(kw.length > 0){
                            words = questions[index].answer_key_word.split(',');
                        } 
                        
                        if(index == 0){
                            this.form.firstQuestion['hitLists'] = item.hit;
                            
                            if (questions.length > 1){
                                this.form.nextQuestions.push({wordKeyLists:words, hitLists:questions[index+1].hit, notHitLists: questions[index].not_hit});

                                this.addNextModelValue();
                            }

                            
                        }else if (index < questions.length - 1){
                            this.form.nextQuestions.push({wordKeyLists:words, hitLists: questions[index+1].hit, notHitLists: item.not_hit});

                            this.addNextModelValue();
                        }
                        
                        // set default value
                        this.addNextDefaultValue();
                    });
                }
            }).catch( (error) => {
                console.log({ "errno": 999, "errorMsg": "系统繁忙，请稍后重试。" + error });
                this.$notification.open({
                    message: "查询失败",
                    description: "失败原因：系统繁忙, 请稍后重试。",
                    duration: 0,
                    icon: ( <jt-icon type="exclamation-circle" theme="filled" style="color:#F04134" /> )
                });
            });
        },

        show(){
            this.flag = !this.flag;
        },

        addNextDefaultValue(){
            // 添加验证
            this.validate.next.push(
                { keyWord: true, hitMsg: true , notHitMsg: true, }
            );

            // console.log('--------------addNextDefaultValue----------------', this.form.model.nextKeyWordValue)
        },

        addNextModelValue(){
            // next input
            this.form.model.nextKeyWordValue.push("");
            this.form.model.nextHitValue.push("");
            this.form.model.nextNotHitValue.push("");
        },

        // 添加下一轮
        next(){
            this.form.nextQuestions.push(
                {
                    wordKeyLists:[], 
                    hitLists: [], 
                    notHitLists: [],
                }
            );

            this.addNextDefaultValue();
            this.addNextModelValue();
        },
        // 移除下一轮
        removeElement(index){
            this.form.nextQuestions.splice(index, 1);

            const listLength = this.form.model.nextKeyWordValue.length;
            if (listLength === 1){
                this.validate.requiredNextHit = true;
                
                this.form.model.nextKeyWordValue = [];
                this.form.model.nextHitValue = [];
                this.form.model.nextNotHitValue = [];

            }else if(listLength > 1){
                this.form.model.nextKeyWordValue.splice(index, 1);
                this.form.model.nextHitValue.splice(index, 1);
                this.form.model.nextNotHitValue.splice(index, 1);
            }
            
            this.validate.next.splice(index, 1);

            
        },

        addFirst(type, index){
            if(type === "keyword"){
                if (this.form.model.firstKeyWordValue.trim().length > 0){

                    // add list
                    this.form.firstQuestion.wordKeyLists.unshift(this.form.model.firstKeyWordValue);
                    // clear input
                    this.form.model.firstKeyWordValue = "";
                    // 重复验证
                    this.allWordKeyList.push(this.form.firstQuestion.wordKeyLists[index]);
                    
                }
                this.$nextTick(() => {
                    this.validateKeyWord();
                });

            }else if(type === "hit"){
                if (this.form.model.firstHitValue.trim().length > 0){
                    // add list
                    // this.form.firstQuestion.hitLists.push(this.form.model.firstHitValue);
                    this.form.firstQuestion.hitLists.unshift(this.form.model.firstHitValue);
                    // clear input
                    this.form.model.firstHitValue = "";
                }
                // const input = "inputhitLists_" + (parseInt(index)+1);
                this.$nextTick(() => {
                    // document.getElementById(input).focus();
                    this.validateFirstHits();
                });
            }
        },
        removeFirst(type, index){
            if(type == "keyword"){
                this.form.firstQuestion.wordKeyLists.splice(index, 1);
                this.validateKeyWord(); 

            }else if(type == "hit"){
                this.form.firstQuestion.hitLists.splice(index, 1);
                this.validateFirstHits();
            }
        },

        addNext(type, i, index){
            const item = this.form.nextQuestions[i];
            if(type == 'keyword'){
                // const le = this.form.model.nextKeyWordValue[i].trim().length;
                if (this.form.model.nextKeyWordValue[i].trim().length > 0){
                    // add list
                    item.wordKeyLists.unshift(this.form.model.nextKeyWordValue[i]);
                    // clear input
                    this.form.model.nextKeyWordValue[i] = "";
                }
                this.$nextTick(() => {
                    this.validateNextKeyWord(i);
                });
            }else if(type == 'hit'){
                if (this.form.model.nextHitValue[i].trim().length > 0){
                    // add list to first
                    item.hitLists.unshift(this.form.model.nextHitValue[i]);
                    // clear input
                    this.form.model.nextHitValue[i] = "";
                }
                // validate
                this.$nextTick(() => {
                    this.validateNextHits(i);
                });
            }else if(type == 'not_hit'){
                if (this.form.model.nextNotHitValue[i].trim().length > 0){
                    // add list to first
                    item.notHitLists.unshift(this.form.model.nextNotHitValue[i]);
                    // clear input
                    this.form.model.nextNotHitValue[i] = "";
                }
                // validate
                this.$nextTick(() => {
                    this.validateNextNotHits(i);
                });
            }
            
        },
        removeNext(type, i, index){
            const item = this.form.nextQuestions[i];
            if(type == 'keyword'){
                item.wordKeyLists.splice(index, 1);
                this.validateNextKeyWord(i);

            }else if(type == 'hit'){
                item.hitLists.splice(index, 1);
                this.validateNextHits(i);

            }else if(type == 'not_hit'){
                item.notHitLists.splice(index, 1);
                this.validateNextNotHits(i);

            }
        },


        save(type){
            this.$store.commit('showLoading', {}, { root: true });

            
            if (this.form.model.firstKeyWordValue ){
                this.form.firstQuestion.wordKeyLists.unshift(this.form.model.firstKeyWordValue);
                // 重复验证
                this.allWordKeyList.push(this.form.model.firstKeyWordValue);
                // clear
                this.form.model.firstKeyWordValue = "";
            }

            
            if (this.form.model.firstHitValue){
                this.form.firstQuestion.hitLists.unshift(this.form.model.firstHitValue);
                // clear
                this.form.model.firstHitValue = "";
            }

            if(this.form.model.nextKeyWordValue){
                const elist = this.form.model.nextKeyWordValue;
                for(let i=0; i < elist.length; i++){
                    if (parseInt(elist[i].trim().length) > 0){
                        this.form.nextQuestions[i].wordKeyLists.unshift(elist[i]);
                        // clear
                        elist[i] = "";
                    }
                }
            }

            if(this.form.model.nextHitValue){
                const elist = this.form.model.nextHitValue;
                for(let i=0; i < elist.length; i++){
                    if (parseInt(elist[i].trim().length) > 0){
                        this.form.nextQuestions[i].hitLists.unshift(elist[i]);
                        // clear
                        elist[i] = "";
                    }
                }
            }

            if(this.form.model.nextNotHitValue){
                const elist = this.form.model.nextNotHitValue;
                for(let i=0; i < elist.length; i++){
                    if (parseInt(elist[i].trim().length) > 0){
                        this.form.nextQuestions[i].notHitLists.unshift(elist[i]);
                        // clear
                        elist[i] = "";
                    }
                }
            }

            const url = host + '/api/dialog/update';
            const questions = [];
            const first = {
                "answerKeyWord": this.form.firstQuestion.wordKeyLists.join(","),
                "hit": this.form.firstQuestion.hitLists,
            }

            questions.push({
                "answerKeyWord": "",
                "notHit": [],
                "hit":this.form.firstQuestion.hitLists
            });

            this.form.nextQuestions.map((item, index)=>{
                questions[index].answerKeyWord = item.wordKeyLists.join(",")
                questions[index].notHit = item.notHitLists

                // console.log(index);
                questions.push(
                    {
                        answerKeyWord: "", 
                        hit: item.hitLists, 
                        notHit: []
                    }
                )
            });
            const data = {
                "topics": this.form.topics,
                "topicsKeyWords": first.answerKeyWord,
                "hit": first.hit,

                "questions": questions,
                "userid": this.userid,
                "botid": this.botid,
                "skillid": this.skillid,
                "id": this.intentid,
            };

            axiosPost(url, {}, data, {}).then((response) => {
                const code = response.code;
                if(code === 1){
                    // this.$message.error("保存失败！失败原因：" + response.msg + "。 请稍后重试");
                    this.$notification.open({
                        message: "保存失败",
                        description: "失败原因："+ response.msg,
                        icon: ( <jt-icon type="exclamation-circle" theme="filled" style="color:#F04134" />)
                    });
                }else if(code == -101){
                    this.$store.commit('setGlobalFreeze', {}, { root: true });
                }
                else{
                    if (type == '1'){
                        this.$message.success("保存成功！");
                        this.intentid = response.data.id;
                        // 返回列表
                        this.cancel();
                        

                    }else if(type == '2'){
                        
                        this.$message.success("保存成功！创建下一条");
                        // this.$router.push({ name: 'addsceneIntent', params: {skillid: this.skillid}});
                        this.form.topics = "";
                        this.form.firstQuestion = {wordKeyLists:[], hitLists: [], notHitLists: []};
                        this.form.nextQuestions = [];
                        // 
                        this.form.model.firstKeyWordValue = "";
                        this.form.model.firstHitValue = "";
                        this.form.model.nextKeyWordValue = [];
                        this.form.model.nextHitValue = [];
                        this.form.model.nextNotHitValue = [];
                    }
                    
                }

                this.$store.commit('hideLoading', {}, { root: true });
            }).catch( (error) => {
                console.log({ "errno": 999, "errorMsg": "系统繁忙，请稍后重试。" + error });
                this.$notification.open({
                    message: "保存失败",
                    description: "失败原因：系统繁忙, 请稍后重试。",
                    duration: 0,
                    icon: ( <jt-icon type="exclamation-circle" theme="filled" style="color:#F04134" /> )
                });
                this.$store.commit('hideLoading', {}, { root: true });
            });


        },

        cancel(){
            // Back to previous page
            // console.log('skillname=' + this.skillname)
            this.$router.push({ name: 'sceneIntent', query: {skillid: this.skillid, skillname: this.skillname}});
        },

        getAllKeyWords(){
            const keyWordArray = [];
            for (let i=0; i < this.form.firstQuestion.wordKeyLists.length; i++){
                keyWordArray.push(this.form.firstQuestion.wordKeyLists[i]);
            }
            for(let i=0; i< this.form.nextQuestions.length; i++){
                for (let j=0; j<this.form.nextQuestions[i].wordKeyLists.length; j++){
                    keyWordArray.push(this.form.nextQuestions[i].wordKeyLists[j]);
                }
            }
            return keyWordArray;
        },

        checkKeyWord(){
            let res = '';
            const keyWordArray = this.getAllKeyWords();

            // check repeat 
            for (let i = 0; i < keyWordArray.length - 1; i++){
                for(let j = i + 1; j < keyWordArray.length; j++){
                    if(keyWordArray[i].length > 0 && keyWordArray[i] == keyWordArray[j]){
                        res = keyWordArray[i] ;
                        return res;
                    }
                }
            }
            return res;
        },

        checkKeyWord2(){
            let res = "";
            const keyWordArray = this.getAllKeyWords();

            let allKwList = [];
            allKwList = allKwList.concat(keyWordArray);

            const kw = this.form.model.firstKeyWordValue;
            if(kw.trim().length > 0){
                allKwList = allKwList.concat(kw);
            }

            const kwList = this.form.model.nextKeyWordValue;
            for(let i=0; i< kwList.length; i++){
                if(kwList[i].length > 0){
                    allKwList = allKwList.concat(kwList[i]);
                }
            }
            // console.log('allKwList---',allKwList);
            // console.log('keyWordArray---', keyWordArray);
            // console.log('kwList---', kwList);

            // check repeat 
            for (let i = 0; i < allKwList.length - 1; i++){
                for(let j = i + 1; j < allKwList.length; j++){
                    if(allKwList[i].length > 0 && allKwList[i] == allKwList[j]){
                        res = allKwList[i] ;
                        return res;
                    }
                }
            }
            return res;
        },



        getAllNotHit(){
            let res = '';
            const notHitArray = [];
            for(let i=0; i< this.form.nextQuestions.length; i++){
                for (let j=0; j<this.form.nextQuestions[i].notHitLists.length; j++){
                    notHitArray.push(this.form.nextQuestions[i].notHitLists[j]);
                }
            }

            // check repeat 
            for (let i = 0; i < notHitArray.length - 1; i++){
                for(let j = i + 1; j < notHitArray.length; j++){
                    if(notHitArray[i].length>0 && notHitArray[i] == notHitArray[j]){
                        res = notHitArray[i] ;
                        return res;
                    }
                }
            }
            return res;
        },

        validateTopics() {
            this.validate.topics = true;
            if (this.form.topics.trim().length === 0) {
                this.inputError.topics = "请输入意图信息";
                this.validate.topics = false;
            } else if (this.form.topics.trim().length > this.len.maxContentLength) {
                this.inputError.topics = this.tips.overLengthTopics;
                this.validate.topics = false;
            }

            if (this.validate.topics === true) {
                const response = judgeSensitiveWord(this.form.topics);
                if (!response.detectedResult) {
                    this.validate.topics = false;
                    this.inputError.topics = response.errorMsg;
                }
            }
            if (this.validate.topics === false) {
                document.getElementById("inputTopics").style.borderColor = "#F04134";
            } else {
                document.getElementById("inputTopics").style.borderColor = "#D9D9D9";
            }
        },

        //关键词验证
        validateKeyWord() {
            this.validate.keyWord = true;
            let num = parseInt(this.form.firstQuestion.wordKeyLists.length)
            if (this.form.model.firstKeyWordValue.trim().length > 0) {
                num++
            }
            if( num > 100) {
                this.inputError.keyWord = '最多可添加100个关键词';
                this.validate.keyWord = false;
            }
            const e = this.form.model.firstKeyWordValue;
            if( e.length > this.len.maxKeyWordLength ){
                this.inputError.keyWord = this.tips.overLengthKeyWord;
                this.validate.keyWord = false;
                document.getElementById("inputKeyWordHead").style.borderColor = "#F04134";
            } else{
                document.getElementById("inputKeyWordHead").style.borderColor = "#D9D9D9";
            }

            const repeatKW = this.checkKeyWord2();
            if (e.length > 0 && e === repeatKW){
                this.inputError.keyWord = "关键词不能重复";
                this.validate.keyWord = false;
                document.getElementById("inputKeyWordHead").style.borderColor = "#F04134";
            }else{
                document.getElementById("inputKeyWordHead").style.borderColor = "#D9D9D9";
            }
            

            for (let i = 0; i < this.form.firstQuestion.wordKeyLists.length; i++) {
                const word = this.form.firstQuestion.wordKeyLists[i].trim();
                const checkRepeat = this.checkKeyWord();
                if (word.length === 0){
                    this.inputError.keyWord = "关键词不能为空";
                    this.validate.keyWord = false;
                    document.getElementById("inputKeyWord_" + i).style.borderColor = "#F04134";

                } 
                else if( word.length > 0 && checkRepeat === word){
                    this.inputError.keyWord = "关键词不能重复";
                    this.validate.keyWord = false;
                    document.getElementById("inputKeyWord_" + i).style.borderColor = "#F04134";
                }
                else if (word.length > this.len.maxKeyWordLength) {
                    this.inputError.keyWord = this.tips.overLengthKeyWord;
                    this.validate.keyWord = false;
                    document.getElementById("inputKeyWord_" + i).style.borderColor = "#F04134";

                } else {
                    // this.validate.keyWord = true;
                    document.getElementById("inputKeyWord_" + i).style.borderColor = "#D9D9D9";
                }    

            }

            // mgc
            if(this.validate.keyWord === true){
                const response = judgeSensitiveWord(e);
                if (!response.detectedResult) {
                    this.inputError.keyWord =  response.errorMsg;
                    this.validate.keyWord = false;
                    document.getElementById("inputKeyWordHead").style.borderColor = "#F04134";
                }else{
                    document.getElementById("inputKeyWordHead").style.borderColor = "#D9D9D9";
                }

                for (let i = 0; i < this.form.firstQuestion.wordKeyLists.length; i++) {
                    const word = this.form.firstQuestion.wordKeyLists[i].trim();
                    const response = judgeSensitiveWord(word);
                    if (!response.detectedResult) {
                        this.inputError.keyWord =  response.errorMsg;
                        this.validate.keyWord = false;
                        document.getElementById("inputKeyWord_" + i).style.borderColor = "#F04134";
                    }else{
                        document.getElementById("inputKeyWord_" + i).style.borderColor = "#D9D9D9";
                    }
                }
            }
        },

        validateFirstHits() {
            this.validate.hitMsg = true;
            let num = parseInt(this.form.firstQuestion.hitLists.length)
            if (this.form.model.firstHitValue.trim().length > 0){
                num++
            }
            if( num > 100) {
                this.inputError.hitMsg = '最多添加100个命中回复';
                this.validate.hitMsg = false;
            }
            const e = this.form.model.firstHitValue;
            if (e.length > this.len.maxContentLength) {
                this.inputError.hitMsg = this.tips.overLengthHitMsg;
                this.validate.hitMsg = false;
                document.getElementById("inputhitListsHead").style.borderColor = "#F04134";
            } else {
                document.getElementById("inputhitListsHead").style.borderColor = "#D9D9D9";
            }


            for (let i = 0; i < this.form.firstQuestion.hitLists.length; i++) {
                const hit = this.form.firstQuestion.hitLists[i].trim();
                if (hit.length === 0){
                    this.inputError.hitMsg = "命中回复不能为空";
                    this.validate.hitMsg = false;
                    document.getElementById("inputhitLists_" + i).style.borderColor = "#F04134";
                } else if (hit.length > this.len.maxContentLength) {
                    this.inputError.hitMsg = this.tips.overLengthHitMsg;
                    this.validate.hitMsg = false;
                    document.getElementById("inputhitLists_" + i).style.borderColor = "#F04134";
                } else {
                    // this.validate.hitMsg = true;
                    document.getElementById("inputhitLists_" + i).style.borderColor = "#D9D9D9";
                }
            }

            if(this.validate.hitMsg === true){
                const response = judgeSensitiveWord(e);
                if (!response.detectedResult) {
                    this.inputError.hitMsg =  response.errorMsg;
                    this.validate.hitMsg = false;
                    document.getElementById("inputhitListsHead").style.borderColor = "#F04134";
                }else{
                    document.getElementById("inputhitListsHead").style.borderColor = "#D9D9D9";
                }

                for (let i = 0; i < this.form.firstQuestion.hitLists.length; i++) {
                    const word = this.form.firstQuestion.hitLists[i].trim();
                    const response = judgeSensitiveWord(word);
                    if (!response.detectedResult) {
                        this.inputError.hitMsg =  response.errorMsg;
                        this.validate.hitMsg = false;
                        document.getElementById("inputhitLists_" + i).style.borderColor = "#F04134";
                    }else{
                        // this.validate.hitMsg = true;
                        document.getElementById("inputhitLists_" + i).style.borderColor = "#D9D9D9";
                    }
                }

            }

        },


        //关键词验证
        validateNextKeyWord(i, index) {
            this.validate.next[i].keyWord = true;
            let num = parseInt(this.form.nextQuestions[i].wordKeyLists.length)
            if (this.form.model.nextKeyWordValue[i].trim().length > 0){
                num++
            }
            if ( num > 100) {
                document.getElementById("tip_KeyWord_" + i).innerHTML = '最多可添加100个关键词';
                this.validate.next[i].keyWord = false;
                document.getElementById("KeyWordHead_" + i).style.borderColor = "#F04134";
            }
            const e = this.form.model.nextKeyWordValue[i];
            if (e.length > this.len.maxKeyWordLength) {
                document.getElementById("tip_KeyWord_" + i).innerHTML = this.tips.overLengthKeyWord;
                this.validate.next[i].keyWord = false;
                document.getElementById("KeyWordHead_" + i).style.borderColor = "#F04134";
            } 
            else {
                document.getElementById("KeyWordHead_" + i).style.borderColor = "#D9D9D9";
            }

            // repeat
            if(this.validate.next[i].keyWord === true){
                const checkRepeat = this.checkKeyWord2();
                for (let j = 0; j < this.form.model.nextKeyWordValue.length; j++) {
                    const word = this.form.model.nextKeyWordValue[j].trim();
                    if( word.length > 0 && checkRepeat === word){
                        document.getElementById("tip_KeyWord_" + i).innerHTML = "关键词不能重复";
                        this.validate.next[i].keyWord = false;
                        // document.getElementById("KeyWord_" + i + j).style.borderColor = "#F04134";
                        document.getElementById("KeyWordHead_" + i).style.borderColor = "#F04134";
                    }
                    else{
                        // document.getElementById("KeyWord_" + i + j).style.borderColor = "#D9D9D9";
                        document.getElementById("KeyWordHead_" + i).style.borderColor = "#D9D9D9";
                    }
                }
            }

            for (let j = 0; j < this.form.nextQuestions[i].wordKeyLists.length; j++) {
                const word = this.form.nextQuestions[i].wordKeyLists[j].trim();
                if (word.length > this.len.maxKeyWordLength) {
                    document.getElementById("tip_KeyWord_" + i).innerHTML = this.tips.overLengthKeyWord;
                    this.validate.next[i].keyWord = false;
                    document.getElementById("KeyWord_" + i + j).style.borderColor = "#F04134";
                } 
                else {
                    document.getElementById("KeyWord_" + i + j).style.borderColor = "#D9D9D9";
                }

            }

            // repeat
            if(this.validate.next[i].keyWord === true){
                for (let j = 0; j < this.form.nextQuestions[i].wordKeyLists.length; j++) {
                    const word = this.form.nextQuestions[i].wordKeyLists[j].trim();
                    const checkRepeat = this.checkKeyWord();
                    if( word.length > 0 && checkRepeat === word){
                        document.getElementById("tip_KeyWord_" + i).innerHTML = "关键词不能重复";
                        this.validate.next[i].keyWord = false;
                        document.getElementById("KeyWord_" + i + j).style.borderColor = "#F04134";
                    }
                    else{
                        document.getElementById("KeyWord_" + i + j).style.borderColor = "#D9D9D9";
                    }
                }
            }

            // mgc
            if(this.validate.next[i].keyWord === true){
                const response = judgeSensitiveWord(e);
                if (!response.detectedResult) {
                    document.getElementById("tip_KeyWord_" + i).innerHTML = response.errorMsg;
                    this.validate.next[i].keyWord = false;
                    document.getElementById("KeyWordHead_" + i).style.borderColor = "#F04134";
                }
                else{
                    document.getElementById("KeyWordHead_" + i).style.borderColor = "#D9D9D9";
                }

                for (let j = 0; j < this.form.nextQuestions[i].wordKeyLists.length; j++) {
                    const word = this.form.nextQuestions[i].wordKeyLists[j].trim();
                    const response = judgeSensitiveWord(word);
                    if (!response.detectedResult) {
                        document.getElementById("tip_KeyWord_" + i).innerHTML = response.errorMsg;
                        this.validate.next[i].keyWord = false;
                        document.getElementById("KeyWord_" + i + j).style.borderColor = "#F04134";
                    }
                    else{
                        document.getElementById("KeyWord_" + i + j).style.borderColor = "#D9D9D9";
                    }
                }
            }
        },

        //next 命中问题
        validateNextHits(i) {
            this.validate.next[i].hitMsg = true;
            let num = parseInt(this.form.nextQuestions[i].hitLists.length)
            if (this.form.model.nextHitValue[i].trim().length > 0){
                num++
            }
            if(num > 100) {
                document.getElementById("tip_hitLists_" + i).innerHTML = '最多添加100个命中回复';
                this.validate.next[i].hitMsg = false;
                document.getElementById("hitListsHead_" + i).style.borderColor = "#F04134";
            }
            const e = this.form.model.nextHitValue[i];
            if (e.length > this.len.maxContentLength) {
                document.getElementById("tip_hitLists_" + i).innerHTML = this.tips.overLengthHitMsg;
                this.validate.next[i].hitMsg = false;
                document.getElementById("hitListsHead_" + i).style.borderColor = "#F04134";
            } else {
                document.getElementById("hitListsHead_" + i).style.borderColor = "#D9D9D9";
            }

            for (let j = 0; j < this.form.nextQuestions[i].hitLists.length; j++) {
                const word = this.form.nextQuestions[i].hitLists[j].trim();
                if (word.length === 0){
                    document.getElementById("tip_hitLists_" + i).innerHTML = "命中回复不能为空";
                    this.validate.next[i].hitMsg = false;
                    document.getElementById("hitLists_" + i+j).style.borderColor = "#F04134";
                } else if (word.length > this.len.maxContentLength) {
                    // this.inputError.keyWord = "请输入"+num+"字以内的命中回复";
                    document.getElementById("tip_hitLists_" + i).innerHTML = this.tips.overLengthHitMsg;
                    this.validate.next[i].hitMsg = false;
                    document.getElementById("hitLists_" + i+j).style.borderColor = "#F04134";
                } else {
                    document.getElementById("hitLists_" + i+j).style.borderColor = "#D9D9D9";
                }
            }

            // mgc
            if(this.validate.next[i].hitMsg === true){
                const response = judgeSensitiveWord(e);
                if (!response.detectedResult) {
                    document.getElementById("tip_hitLists_" + i).innerHTML = response.errorMsg;
                    this.validate.next[i].hitMsg = false;
                    document.getElementById("hitListsHead_" + i).style.borderColor = "#F04134";
                }
                else{
                    document.getElementById("hitListsHead_" + i).style.borderColor = "#D9D9D9";
                }

                for (let j = 0; j < this.form.nextQuestions[i].hitLists.length; j++) {
                    const word = this.form.nextQuestions[i].hitLists[j].trim();
                    const response = judgeSensitiveWord(word);
                    if (!response.detectedResult) {
                        document.getElementById("tip_hitLists_" + i).innerHTML = response.errorMsg;
                        this.validate.next[i].hitMsg = false;
                        document.getElementById("hitLists_" + i + j).style.borderColor = "#F04134";
                    }
                    else{
                        document.getElementById("hitLists_" + i + j).style.borderColor = "#D9D9D9";
                    }
                }
            }
        },

        validateNextNotHits(i) {
            this.validate.next[i].notHitMsg = true;
            let num = parseInt(this.form.nextQuestions[i].notHitLists.length)
            if (this.form.model.nextNotHitValue[i].trim().length > 0){ 
                num++
            }
            if(num > 100) {
                document.getElementById("tip_not_hits_" + i).innerHTML = '最多添加100个未命中回复';
                this.validate.next[i].notHitMsg = false;
                document.getElementById("not_hitsHead" + i).style.borderColor = "#F04134";
            }
            const e = this.form.model.nextNotHitValue[i];
            if (e.length > this.len.maxContentLength) {
                document.getElementById("tip_not_hits_" + i).innerHTML = this.tips.overLengthNotHitMsg;
                this.validate.next[i].notHitMsg = false;
                document.getElementById("not_hitsHead" + i).style.borderColor = "#F04134";
            } 
            else {
                document.getElementById("not_hitsHead" + i).style.borderColor = "#D9D9D9";
            }


            for (let j = 0; j < this.form.nextQuestions[i].notHitLists.length; j++) {
                const word = this.form.nextQuestions[i].notHitLists[j].trim();
                if (word.length > this.len.maxContentLength) {
                    // "请输入"+num+"字以内的未命中回复";
                    document.getElementById("tip_not_hits_" + i).innerHTML = this.tips.overLengthNotHitMsg;
                    this.validate.next[i].notHitMsg = false;
                    document.getElementById("not_hits" + i+j).style.borderColor = "#F04134";
                } 
                else {
                    document.getElementById("not_hits" + i+j).style.borderColor = "#D9D9D9";
                }
            }

            // mgc
            if(this.validate.next[i].notHitMsg === true){
                const response = judgeSensitiveWord(e);
                if (!response.detectedResult) {
                    document.getElementById("tip_not_hits_" + i).innerHTML = response.errorMsg;
                    this.validate.next[i].notHitMsg = false;
                    document.getElementById("not_hitsHead" + i).style.borderColor = "#F04134";
                }
                else{
                    document.getElementById("not_hitsHead" + i).style.borderColor = "#D9D9D9";
                }

                for (let j = 0; j < this.form.nextQuestions[i].notHitLists.length; j++) {
                    const word = this.form.nextQuestions[i].notHitLists[j].trim();
                    const response = judgeSensitiveWord(word);
                    if (!response.detectedResult) {
                        document.getElementById("tip_not_hits_" + i).innerHTML = response.errorMsg;
                        this.validate.next[i].notHitMsg = false;
                        document.getElementById("not_hits" + i + j).style.borderColor = "#F04134";
                    }
                    else{
                        document.getElementById("not_hits" + i + j).style.borderColor = "#D9D9D9";
                    }
                }
            }
        },




    },
    computed: {

        disableSubmit() {

            let errorCount = 0;

            let checkNextHit = 0;
            for(let i = 0; i < this.form.nextQuestions.length; i ++){
                if(this.form.nextQuestions[i].hitLists.length === 0 && this.form.model.nextHitValue[i].trim().length === 0){
                    checkNextHit = checkNextHit + 1;
                    errorCount = errorCount + 1;
                    break;
                }
            }

            let errorCountKeyWord = 0;
            let errorCountHiMsg = 0;
            let errorCountNotHitMsg = 0;
            //
            let errorCountRequiedNextHit = 0;

            for(let i = 0; i < this.validate.next.length; i++){
                // errorCountKeyWord = this.validate.next[i].keyWord ? errorCountKeyWord: errorCountKeyWord++;
                if(!this.validate.next[i].keyWord){
                    errorCountKeyWord = errorCountKeyWord + 1;
                    errorCount = errorCount + 1;
                    break;
                }

                // errorCountHiMsg = this.validate.next[i].hitMsg ? errorCountHiMsg: errorCountHiMsg++;
                if (this.validate.next[i].hitMsg === false){
                    errorCountHiMsg = errorCountHiMsg + 1;
                    errorCount = errorCount + 1;
                    break;
                }

                // errorCountNotHitMsg = this.validate.next[i].notHitMsg ? errorCountNotHitMsg: errorCountNotHitMsg++;
                if(!this.validate.next[i].notHitMsg){
                    errorCountNotHitMsg = errorCountNotHitMsg + 1;
                    errorCount = errorCount + 1;
                    break;
                }

                if(!this.validate.requiredNextHit){
                    errorCountRequiedNextHit = errorCountRequiedNextHit + 1;
                    errorCount = errorCount + 1;
                    break;
                }
            }


            if (
                this.form.topics === "" ||
                (this.form.firstQuestion.wordKeyLists.length === 0 && this.form.model.firstKeyWordValue.trim().length === 0 ) ||
                (this.form.firstQuestion.hitLists.length === 0 && this.form.model.firstHitValue.trim().length === 0 ) ||
                !this.validate.topics ||
                !this.validate.keyWord ||
                !this.validate.hitMsg
                // || errorCountKeyWord > 0
                // || errorCountHiMsg > 0
                // || errorCountNotHitMsg > 0
                // || errorCountRequiedNextHit > 0 
                // || checkNextHit > 0
                || errorCount > 0
            ) {
                return true;
            } else {
                return false;
            }
        },

        validate1(){
            return true;
        },

    },
    watch: {
        'form.model.nextHitValue':function(){
            for(let i = 0; i < this.form.nextQuestions.length; i ++){
                if(this.form.nextQuestions[i].hitLists.length === 0 && this.form.model.nextHitValue[i].trim().length === 0){
                    // this.validate.next[i].hitMsg = false;
                    this.validate.requiredNextHit = false;

                    // console.log(this.form.nextQuestions[i].hitLists.length, '------1479----------', this.form.model.nextHitValue[i].trim().length);
                }
                else{
                    this.validate.requiredNextHit = true;
                    // console.log(this.form.nextQuestions[i].hitLists.length, '------1483----------', this.form.model.nextHitValue[i].trim().length);

                }
            }
        }

    },
}

</script>

<style lang="less" scoped>
@import "~@/assets/style/var.less";



div.contentBody {
    // width: 100%;
    flex: auto;
    overflow-y: auto;   
    border-radius: 2px;
    // padding: 20px 20px 40px 20px;
    // padding: 20px 8px 40px 20px;
    font-size: 12px;
    font-family: "PingFangSC-Regular,PingFang SC";
    .contentTop{
        border-radius: 2px;
    }
    .contentBottom{
        widows: 100%;
        background: #FFFFFF;
        height: 44px;

        padding: 8px 0px 8px 8px;
    }
    .title {
        font-size: 16px;
        font-family: "PingFangSC-Medium,PingFang SC";
        font-weight: 600;
        color: #333333;
        line-height: 22px;
    }
    .title-icon {
        color: @jt-color-text-secondary;
    }
    .sector{
        border-radius: 2px;  // 调节圆周程度
        background: #fff;
        margin-bottom: 20px;
    }
}

.normalTip {
    margin-top: 4px;
    height: 17px;
    font-size: 12px;
    font-family: PingFangSC-Regular,PingFang SC;
    font-weight: 400;
    color: #999999;
    line-height: 17px;
}
.errorTip {
    margin-top: 4px;
    height: 17px;
    font-size: 12px;
    font-family: PingFangSC-Regular,PingFang SC;
    font-weight: 400;
    color: #F04134;
    line-height: 17px;
}


.input-list{
    max-height: 192px;
    overflow: auto;
    margin-top: 20px;
    width: 436px;
}


.icon {
    cursor: pointer;
}
h2 {
    font-size: @jt-font-size-lger;
}
.form-content {
    margin-top: 40px;
}
.form-row {
    margin-bottom: 25px;
    position: relative;
}
.input-row {
    margin-right: 0px;
    .row-title {
        line-height: 32px;
        text-align: right;
    }
    .input-item{
        width: 436px; 
        height: 32px; 
    }
    input {
        // width: 100%;
        .icon {
            color: @jt-color-text-secondary;
            cursor: pointer;
        }
    }
}

.button-group {
    text-align: right;
    
    .button {
        margin-right: 8px;
    }
}

.link-btn{
    padding: 4px 9px;
    color:#555;
    
    .icon{
        color: #999;
    }
}
.link-btn:hover{
    color:#337DFF;
}


.iconshanchu1{
    color: #999;
}
.iconshanchu1:hover{
    color: #337DFF;
}

</style>