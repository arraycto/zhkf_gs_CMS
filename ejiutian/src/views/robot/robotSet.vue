<template>
    <div class="content1" style="height: 100%;padding-bottom: 60px;">
        
        <Breadcrumb class="main-header">
            <breadcrumb-item>
                <router-link to="/home/testEnv" >测试环境</router-link>
            </breadcrumb-item>
            <breadcrumb-item>
                <span>机器人设置</span>
            </breadcrumb-item>
        </Breadcrumb>
        <div style="margin-bottom: 2px;"></div>
        <article>
            <jt-loading v-if='loading'></jt-loading>
            <router-view></router-view>
        </article>
        <div class="content" style="overflow-y: auto;height: 100%;">
            
            <div class="contentBody">
                <div style="font-size: 16px;font-family:PingFangSC-Medium,PingFang SC;font-weight:500;">基本信息</div>
                <div style="margin: 32px 0px -8px 115px;">ID：{{this.$route.query.robotID}}</div>
                <div style="margin: 32px 0px -8px 115px;" v-if="this.input.vtelno && this.input.vtelno.length>0">TelNo：{{this.input.vtelno}}</div>
                <div style="display: flex; flex-flow: row; margin-top: 24px;">
                    <div class="inputLabel">
                        <span style="color: #F04134; margin-right: 4px;">*</span><span>机器人名称</span>
                    </div>
                    <div style="display: flex; flex-flow: column;">
                        <jt-input
                            id="inputStandardQuestion"
                            v-model="input.robotName"
                            style="width: 431px; height: 32px;"
                            placeholder="仅支持中文、英文、数字与下划线，12字以内"
                            @blur="validateStandardQuestion()"
                        />
                        <span v-show="!validate.robotName" class="errorTip">{{inputError.robotName}}</span>
                    </div>
                </div>

                <div style="display: flex; flex-flow: row; margin-top: 24px;">
                    <div class="inputLabel">
                        <span>机器人描述</span>
                    </div>
                    <div style="display: flex; flex-flow: column;">
                        <div class="answerInput">
                            <jt-input
                                id="inputAnswer"
                                type="textarea"
                                v-model="input.describeVal"
                                class="inputArea"
                                placeholder="请输入200字以内的描述"
                                @blur="validateAnswer()"
                            />
                        </div>
                        <span v-show="!validate.describeVal" class="errorTip">{{inputError.describeVal}}</span>
                    </div>
                </div>

                <div style="margin-top: 64px;">
                    <div style="font-size: 16px;font-family:PingFangSC-Medium,PingFang SC;font-weight:500;">其他设置</div>
                </div>
                
                <div style="display: flex; flex-flow: row; margin-top: 32px;" v-if="this.$store.state.robotSet.initdata.mtelno && this.$store.state.robotSet.initdata.mtelno.length>0">
                    <div class="inputLabel" style="height: 25px;">
                        <span style="color: #F04134; margin-top: 7px;margin-left: 45px;">*</span>
                        <span>转人工设置</span>
                    </div>
                    <div>
                        <jt-switch 
                            :checked="true"
                            :disabled="true"
                            style="margin-top:5px"
                        />
                        <jt-input
                            id="mtelno"
                            v-model="input.mtelno"
                            style="width: 431px; height: 32px;display:block;margin-top:10px"
                            placeholder="请输入转人工号码"
                            @blur="validateArtificial()"
                        />
                        <span v-show="!validate.mtelno" class="errorTip">{{inputError.mtelno}}</span>
                    </div>
                </div>

                <div style="display: flex; flex-flow: row; margin-top: 32px;">
                    <div class="inputLabel" style="height: 25px;">
                        <span>欢迎语</span>
                    </div>
                    <div style="display: flex; flex-flow: column;">
                        <jt-input
                            id="inputWelcomecontent"
                            v-model="input.welcomecontent"
                            style="width: 431px; height: 32px;"
                            placeholder="请输入50字以内的欢迎语"
                            @blur="validateWelcomecontent()"
                        />
                        <span v-show="!validate.welcomecontent" class="errorTip">{{inputError.welcomecontent}}</span>
                    </div>
                </div>

                <div style="display: flex; flex-flow: row; margin-top: 24px;">
                    <div class="inputLabel" style="height: 25px;">
                        <span>兜底话术</span>
                    </div>
                    <div style="display: flex; flex-flow: column;">
                        <jt-input
                            id="inputTalk"
                            v-model="input.talk"
                            style="width: 431px; height: 32px;"
                            placeholder="请输入50字以内的兜底话术"
                            @blur="validateTalk()"
                        />
                        <span v-show="!validate.talk" class="errorTip">{{inputError.talk}}</span>
                    </div>
                </div>

                <div style="display: flex; flex-flow: row; margin-top: 24px;">
                    <div class="inputLabel">
                        <span style="margin-right: 5px;">热点问题</span>
                        <jt-tooltip :title="tips.hotQuestion">
                            <jt-icon type="question-circle" class="title-icon" />
                        </jt-tooltip>
                    </div>
                    <div style="display: flex; flex-flow: column;">
                        <div style="display: flex; flex-flow: row; margin-bottom: 8px;">
                            <jt-button 
                                type="icon" 
                                style="height: 32px;width: 34px;" 
                                @click="showRecommendModal"
                                :disabled="input.hotQuestion.length >= 5"
                            >
                                <span class="iconfont icontianjia"></span>
                            </jt-button>
                            <span class="hotQuestionBtnTip">最多可添加5条</span>
                            <jt-modal
                                :footer="null"
                                @cancel="recommendModalCancle"
                                centered
                                v-model="recommendModalVisible"
                                title="添加热点问题"
                                width="600px"
                                font-size="16px"
                                :bodyStyle="{padding: '0px'}"
                            >
                                <div style="height: 300px; padding:15px 32px; display: flex; flex-flow: row;">
                                    <div class="recommendationModalList">
                                        <div style="width: 100%; height: 34px; padding: 8px; border-bottom: 1px solid #D9D9D9;">
                                            <jt-checkbox
                                                :disabled="recommendListLeft.length < 1"
                                                :indeterminate="leftIndeterminate"
                                                :checked="checkLeftAll"
                                                @change="selectLeftAll"
                                            >
                                                <span style="font-size: 12px; font-weight: 400; color: #333333; line-height: 18px;">标准问题</span>
                                                <span style="font-size: 12px; font-weight: 400; color: #BBBBBB; line-height: 18px;">（</span>
                                                <span style="font-size: 12px; font-weight: 400; color: #BBBBBB; line-height: 18px;">{{recommendListLeft.length}}</span>
                                                <span style="font-size: 12px; font-weight: 400; color: #BBBBBB; line-height: 18px;">项）</span>
                                            </jt-checkbox>
                                        </div>
                                        <div style="width: 100%; padding: 8px;">
                                            <jt-input placeholder="请输入关键词搜索" style="width: 224px; color: #FFFFFF;" v-model="recommendationSearchKeyword" v-on:keyup.enter="searchRecommendationSubmit">
                                                <a slot="suffix" class="icon iconfont iconsousuo" style="font-size: 16px; color: #999999;" @click="searchRecommendationSubmit"></a>
                                            </jt-input>
                                        </div>
                                        <div
                                            v-show="recommendListLeft.length > 0"
                                            style="width: 100%; padding: 8px; overflow: auto;"
                                        >
                                            <jt-checkbox-group
                                                v-model="recommendListLeftSelected"
                                                :options="recommendListLeft"
                                            />
                                        </div>
                                        <div
                                            v-show="recommendListLeft.length < 1"
                                            style="width: 100%; display: flex; justify-content: center;"
                                        >
                                            <span
                                                style="font-size: 12px; font-weight: 400; color: #999999; line-height: 18px; margin-top: 70px;"
                                            >没有搜索到标准问题
                                            </span>
                                        </div>
                                    </div>
                                    <div>
                                        <jt-button
                                            :disabled="recommendListLeftSelected.length < 1 || (recommendListLeftSelected.length + recommendListRight.length) > 5"
                                            type="primary"
                                            @click="recommendItemSelect"
                                            class="recommendSelectBtn"
                                        >
                                            <span :class="['iconfont', 'iconjiantouyou']" style="width: 7px; height: 12px; margin-left: -5px;"/>
                                        </jt-button>
                                    </div>
                                    <div class="recommendationModalList">
                                        <div style="width: 100%; height: 34px; padding: 8px; border-bottom: 1px solid #D9D9D9;">
                                            <jt-checkbox
                                                :disabled="recommendListRight.length < 1"
                                                :indeterminate="rightIndeterminate"
                                                :checked="checkRightAll"
                                                @change="selectRightAll"
                                            >
                                                <span style="font-size: 12px; font-weight: 400; color: #333333; line-height: 18px;">添加问题</span>
                                                <span style="font-size: 12px; font-weight: 400; color: #BBBBBB; line-height: 18px;">（最多可加5条）</span>
                                            </jt-checkbox>
                                            <a v-show="recommendListRightSelected.length > 0" class="icon iconfont iconshanchu1" style="font-size: 16px; color: #999999; float: right; margin-top: -3px;" @click="deleteRightSelected"></a>
                                            <a v-show="recommendListRightSelected.length < 1" class="icon iconfont iconshanchu1" style="font-size: 16px; color: #D9D9D9; float: right; margin-top: -3px;" @click="deleteRightSelected"></a>
                                        </div>
                                        <div
                                            v-show="recommendListRight.length > 0"
                                            style="width: 100%; padding: 8px; overflow: auto; margin-top: 8px;"
                                        >
                                            <jt-checkbox-group
                                                v-model="recommendListRightSelected"
                                                :options="recommendListRight"
                                            />
                                        </div>
                                        <div
                                            v-show="recommendListRight.length < 1"
                                            style="width: 100%; display: flex; justify-content: center;"
                                        >
                                            <span
                                                style="font-size: 12px; font-weight: 400; color: #999999; line-height: 18px; margin-top: 100px;"
                                            >您还未添加热点问题
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div style="padding-top: 15px; padding-right: 19px; height: 63px; text-align: right; border-top: 1px solid #E9EBEF;">
                                    <jt-button style="margin-right: 8px;width: 64px;" @click="recommendModalCancle">取消</jt-button>
                                    <jt-button :disabled="recommendListRight.length < 1" type="primary"  style="width: 64px;" @click="recommendModalSubmit">确定</jt-button>
                                </div>
                            </jt-modal>
                        </div>
                        
                        <jt-input
                            v-for="(item, index) in input.hotQuestion"
                            :key="index"
                            class="hotQuestionInput"
                            readonly="readonly"
                        >
                            <span slot="prefix" style="font-size: 12px;color: #BBBBBB; width: 350px;" class="cacheCss">{{input.hotQuestion[index].label}}</span>
                            <div
                                slot="suffix"
                                class="hotQuestionCtl"
                            >
                                <span
                                    v-show="index !== 0"
                                    class="iconfont iconshangyi icon up"
                                    @click="resortRecommendationQuestion(item, index, 1)"
                                ></span>
                                <span
                                    v-show="index != (input.hotQuestion.length - 1)"
                                    class="iconfont iconxiayi icon down"
                                    @click="resortRecommendationQuestion(item, index, 0)"
                                ></span>
                            </div>
                            <span
                                slot="suffix"
                                class="iconfont iconshanchu1"
                                @click="deleteHotquestion(index)"
                            ></span>
                        </jt-input>
                    </div>
                </div>
                <span v-show="input.hotQuestion.length > 5" class="errorTip" style="margin-left: 188px">最多可添加5条</span>


                <div style="display: flex; flex-flow: row; margin-top: 16px;">
                    <div class="inputLabel">
                        <span style="margin-right: 5px;">前置关键词</span>
                        <jt-tooltip :title="tips.keywords">
                            <jt-icon type="question-circle" class="title-icon" />
                        </jt-tooltip>
                    </div>
                    <div style="display: flex; flex-flow: column;">
                        <div style="display: flex; flex-flow: row; margin-bottom: 8px;">
                            <jt-button type="icon" style="height: 32px;width: 34px;" @click="showModalKeyWords">
                                <span class="iconfont icontianjia"></span>
                            </jt-button>
                            <jt-modal
                                :visible="visibleKeyWords"
                                centered
                                :title='TitleKeyword'
                                @cancel="handleCancelKeyWords"
                                @ok="handleSubmitKeyWords(KeyWords,contentKeywords)"
                                width="600px"
                                border-radius="4px"
                            >    
                                <template slot="footer">
                                    <jt-button key="back" style="width: 64px;margin-top: 6px;margin-bottom: 6px;" @click="handleCancelKeyWords">
                                        取消
                                    </jt-button>
                                    <jt-button :disabled="(keywordiswrong || checkInKeywords)" type="primary" style="width: 64px; margin-right: 4px;" @click="handleSubmitKeyWords(KeyWords,contentKeywords)">
                                        确定 
                                    </jt-button>
                                </template>


                                <jt-form layout='vertical' :form="form">
                                    <div style="display: flex; flex-flow: row; height: 56px;;">
                                        <span style="color: #F04134; margin-top: 7px;margin-left: 45px;">*</span>
                                        <span style="margin-left: 4px; margin-top: 7px;font-size: 12px;">关键词</span>
                                        <!-- <div style="margin-left: 10px;">   
                                            <jt-input 
                                                placeholder="12字以内，不可重复" 
                                                style="font-size: 12px; width:360px; height:32px; border-radius:2px;"
                                                v-model="KeyWords"
                                                id="inputkeywordLength"
                                            />
                                            <br>
                                            <span v-show="checkKeyWords(this.KeyWords)" style="font-size: 12px; color: #F04134;">不可超过12字</span>
                                        </div>     -->     
                                        <jt-form-item style="margin-left: 10px;">   
                                            <jt-input 
                                                placeholder="12字以内，不可重复" 
                                                style="font-size: 12px; width:360px; height:32px; border-radius:2px;"
                                                v-model = "KeyWords"
                                                v-decorator="[
                                                    'key',
                                                    {
                                                        rules: [
                                                            {
                                                                validator: checkkeywordLength,    
                                                            },
                                                        ],
                                                        initialValue: KeyWords
                                                    },
                                                ]"
                                            />
                                        </jt-form-item>        
                                    </div> 
                                </jt-form>
                                
                                <div style="display: flex; flex-flow: row;">
                                    <span style="color: #F04134; margin-top: 9px; margin-left: 33px;">*</span>
                                    <span style="margin-left: 4px; margin-top: 9px; font-size: 12px;">标准问题</span>
                                    <div style="margin-left: 10px;font-size: 12px;">
                                        <div style="height: 32px;">
                                            <jt-input 
                                                placeholder="请输入问题关键词搜索" 
                                                style="font-size: 12px; width:360px; height: 32px; "
                                                v-model = "contentKeywords.question"
                                                v-on:keyup.enter="searchES(contentKeywords.question)"
                                            >
                                                <jt-tooltip slot="suffix">
                                                    <a class="icon iconfont iconsousuo" style="font-size: 16px; color: #555555;" @click = "searchES(contentKeywords.question)"></a>
                                                </jt-tooltip>   
                                            </jt-input> 
                                        </div>
                                        <div v-show="showsearchdata" style="overflow-y: auto;width:360px;height:143px;background-color: #fff;
                                        border-left:1px solid rgba(217,217,217,1);border-bottom:1px solid rgba(217,217,217,1);border-right:1px solid rgba(217,217,217,1); padding-top: 7px;" >
                                            
                                            <!-- <div v-for = "(data,indexL) in searchData" :key="indexL">
                                                <jt-radio-group v-model = "value">         
                                                    <jt-radio 
                                                        :style="radioStyle" 
                                                        :value="data.question" 
                                                        style="font-size:12px; margin-left: 11px;" 
                                                        @focus="radioSelectedKeyword(data)">
                                                        {{data.question}}
                                                    </jt-radio>        
                                                </jt-radio-group>   
                                            </div> -->

                                            <jt-radio-group v-model="value">
                                                <div  class = "selsctstyle" v-for ="(data,indexL) in searchData" :key="indexL" style="width: 358px;" > 
                                                    <jt-radio  
                                                        class="selection" 
                                                        :style="radioStyle" 
                                                        :value="data.question" 
                                                        style="font-size:12px; margin-left: 11px;" 
                                                        @focus="radioSelectedKeyword(data)"
                                                    >
                                                        {{data.question}}
                                                    </jt-radio>
                                                </div>
                                            </jt-radio-group>
                                        
                                        </div>
                                    </div>
                                </div>                                         
                            </jt-modal>
                        </div>
                    </div>
                </div>
                <div v-for = "(item,index) in showpreKeyWords" style="margin-bottom: 8px;display: flex; flex-flow: row;" :key="index">
                    <jt-input-group style="margin-left: 92px;width: 690px;">
                        <jt-input 
                            class="input-prefix" 
                            style="width:214px; height: 32px;font-size: 12px;margin-left: 94px;"
                            :id="'inputKeyword_' + index"
                            readonly="readonly"
                        >
                            <span slot="prefix" style="font-size: 12px;color: #BBBBBB;">关键词：{{showpreKeyWords[index].keywords}}</span>
                        </jt-input>
                        <jt-input 
                            class="input-prefix" 
                            style="width:359px; height: 32px;font-size: 12px;margin-left: 8px;"
                            readonly="readonly"
                        >
                            <span slot="prefix" style="font-size: 12px;color: #BBBBBB; width:344px;" class = "cacheCss">标准问题：{{showpreKeyWords[index].question}}</span>
                        </jt-input>
                    </jt-input-group>

                    <jt-button type="link" @click="resetKeyword(index)" style="padding-left:0px;" class="edit"><jt-icon type="edit"/></jt-button>
                    
                    <jt-button type="link" @click = "deletePageKeywords(index)" style="padding-left:0px;" class="edit"> 
                        <span class="iconfont btn-icon">&#xe62f;</span>
                    </jt-button>
                </div>
                <span v-show="!validate.keyword" class="errorTip" style="margin-left: 188px">{{inputError.keyword}}</span>

                <div style="display: flex; flex-flow: row; margin-top: 16px;">
                    <div class="inputLabel">
                        <span style="margin-right: 5px;">缓存</span>
                        <jt-tooltip :title="tips.cache">
                            <jt-icon type="question-circle" class="title-icon" />
                        </jt-tooltip>
                    </div>
                    <div style="display: flex; flex-flow: column;">
                        <div style="display: flex; flex-flow: row; margin-bottom: 8px;">
                            <jt-button type="icon" style="height: 32px;width: 34px;" @click="showModalCache">
                                <span class="iconfont icontianjia"></span>
                            </jt-button>
                            <jt-modal
                                :visible="visibleCache"
                                centered
                                :title="TitleCache"
                                @cancel="handleCancelCache"
                                @ok="handleSubmitCache(Cache,contentCache)"
                                width="600px"
                                border-radius="4px"
                            >    
                                <template slot="footer">
                                    <jt-button key="back" style="width: 64px;margin-top: 6px;margin-bottom: 6px;" @click="handleCancelCache">
                                        取消
                                    </jt-button>
                                    <jt-button :disabled="cacheiswrong || checkInCache" type="primary" style="width: 64px; margin-right: 4px;" @click="handleSubmitCache(Cache,contentCache)">
                                        确定
                                    </jt-button>
                                </template>
                                <jt-form layout='vertical' :form="form">
                                    <div style="display: flex; flex-flow: row; height: 56px;;">
                                        <span style="color: #F04134; margin-top: 7px;margin-left: 57px;">*</span>
                                        <span style="margin-left: 4px; margin-top: 7px;font-size: 12px;">缓存</span>
                                        <!-- <div style="margin-left: 10px;">   
                                            <jt-input 
                                                placeholder="125字以内，不可重复" 
                                                style="font-size: 12px; width:360px; height:32px; border-radius:2px; "
                                                v-model="Cache"
                                            />
                                            <br>
                                            <span v-show="checkCache(Cache)" style="font-size: 12px; color: #F04134;">不可超过125字</span>
                                        </div>   -->   
                                        <jt-form-item style="margin-left: 10px;">   
                                            <jt-input 
                                                placeholder="125字以内，不可重复" 
                                                style="font-size: 12px; width:360px; height:32px; border-radius:2px;"
                                                v-model = "Cache"
                                                v-decorator="[
                                                    'confirm',
                                                    {
                                                        rules: [
                                                            {
                                                                validator: checkcacheLength,
                                                            },
                                                        ],
                                                        initialValue: Cache
                                                    },
                                                ]"
                                            />
                                        </jt-form-item>                 
                                    </div> 
                                </jt-form>
                                
                                <div style="display: flex; flex-flow: row;">
                                    <span style="color: #F04134; margin-top: 9px; margin-left: 33px;">*</span>
                                    <span style="margin-left: 4px; margin-top: 9px; font-size: 12px;">标准问题</span>
                                    <div style="margin-left: 10px;font-size: 12px;">
                                        <div style="height: 32px;">
                                            <jt-input 
                                                placeholder="请输入问题关键词搜索" 
                                                style="font-size: 12px; width:360px; height: 32px; "
                                                v-model = "contentCache.question"
                                                v-on:keyup.enter="searchES(contentCache.question)"
                                            >
                                                <jt-tooltip slot="suffix">
                                                    <a class="icon iconfont iconsousuo" style="font-size: 16px; color: #555555;" @click = "searchES(contentCache.question)"></a>
                                                </jt-tooltip>   
                                            </jt-input> 
                                        </div>
                                        <!-- <div v-show="showsearchdata" style="overflow-y: auto;width:360px;height:143px;background-color: #fff;
                                        border-left:1px solid rgba(217,217,217,1);border-bottom:1px solid rgba(217,217,217,1);border-right:1px solid rgba(217,217,217,1);  padding-top: 7px;" >    
                                            <div class = "selsctstyle" v-for = "(data,indexL) in searchData" :key="indexL">
                                                <jt-radio-group v-model = "value">         
                                                    <jt-radio 
                                                        :style="radioStyle" 
                                                        :value="data.question" 
                                                        style="font-size:12px; margin-left: 11px;" 
                                                        class="selection"
                                                        @focus="radioSelectedCache(data)">
                                                        {{data.question}}
                                                    </jt-radio>        
                                                </jt-radio-group>   
                                            </div>
                                        </div> -->
                                        <div v-show = "showsearchdata" style="overflow-y: auto;width: 360px;height: 143px;background-color: #FFFFFF;border-left: 1px solid rgba(217,217,217,1);border-bottom: 1px solid rgba(217,217,217,1);border-right: 1px solid rgba(217,217,217,1);
                                        padding-top: 7px;">
                                            <jt-radio-group v-model="value">
                                                <div  class = "selsctstyle" v-for ="(data,indexL) in searchData" :key="indexL" style="width: 358px;"> 
                                                    <jt-radio  
                                                        class="selection" 
                                                        :style="radioStyle" 
                                                        :value="data.question" 
                                                        style="font-size:12px; margin-left: 11px;" 
                                                        @focus="radioSelectedCache(data)"
                                                    >
                                                        {{data.question}}
                                                    </jt-radio>
                                                </div>
                                            </jt-radio-group>
                                        </div>
                                    </div>
                                </div>                                         
                            </jt-modal>
                        </div>
                    </div>
                </div>
                <div v-for = "(item,index) in showCache" style="margin-bottom: 8px;display: flex; flex-flow: row;" :key="'info2-'+index">
                    <jt-input-group style="margin-left: 92px;width: 690px;" >
                        <jt-input 
                            type="text"
                            class="input-prefix" 
                            style="width:214px; height: 32px;font-size: 12px;margin-left: 94px;"
                            :id="'inputCache_' + index"
                        >
                            <span slot="prefix" style="font-size: 12px;color: #BBBBBB;width:200px;" class = "cacheCss">缓存：{{showCache[index].Cache}}</span>
                        </jt-input>
                        <jt-input 
                            type="text"
                            class="input-prefix" 
                            style="width:359px; height: 32px;font-size: 12px;margin-left: 8px;"
                        >
                            <span slot="prefix" style="font-size: 12px;color: #BBBBBB; width:344px;" class = "cacheCss">标准问题：{{showCache[index].question}}</span>
                        </jt-input>   
                    </jt-input-group>

                    <jt-button type="link" @click="resetCache(index)" style="padding-left:0px;" class="edit"><jt-icon type="edit"/></jt-button>

                    <jt-button type="link" @click = "deletePageCache(index)" style="padding-left:0px;" class="edit"> 
                        <span class="iconfont btn-icon">&#xe62f;</span>
                    </jt-button>
                    
                </div>
                <span v-show="!validate.cache" class="errorTip" style="margin-left: 188px">{{inputError.cache}}</span>

                <div style="display: flex; flex-flow: row; margin-top: 32px; margin-left: 186px;">
                    <jt-button :disabled="allowtocommit" type="primary" @click="commitAll()" style="width: 80px;height: 32px;">
                        保存
                    </jt-button>
                    <jt-button style="margin-left: 8px ; width: 80px;height: 32px;" @click="deleteAll()" >
                        取消
                    </jt-button>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="less" scoped>
@import "~@/assets/style/var.less";
    .main-header{
        height: 56px;
        background-color: #fff;
        padding-left: 20px;
        line-height: 58px;
        font-weight: 500;
        font-size: 14px;
        color: @jt-color-text-strong;
        
    }
    div.contentBody {
        
        min-height: 100%;
        background: #ffffff;
        border-radius: 2px;
        padding: 20px 100px 40px 20px;
        font-size: 12px;
        font-family: "PingFangSC-Regular,PingFang SC";

        margin: 20px 20px 40px 20px;
        .title {
            font-size: 16px;
            font-family: "PingFangSC-Medium,PingFang SC";
            font-weight: 500;
            color: #333333;
            line-height: 22px;
        }
        .title-icon {
            color: @jt-color-text-secondary;
        }
        .inputLabel {
            min-width: 170px;
            text-align: right;
            color: #333333;
            margin-top: 7px;
            margin-right: 16px;
        }
    }
    .plusIcon {
        color: #555555;
        font-size: 16px;
    }
    .plusIconDisabled {
        color: #BBBBBB;
        font-size: 16px;
    }
    
    .input-prefix.ant-input-affix-wrapper{
        /deep/ input.ant-input{
            padding-left:202px;
            font-size:12px;
        } 
    }
    .hotQuestionBtn {
        padding: 0px;
        text-align: center;
        width: 32px;
        height: 32px;
        border-radius: 2px;
        border: 1px solid #d9d9d9;
    }
    .hotQuestionBtnTip {
        margin-left: 8px;
        margin-top: 9px;
        width: 80px;
        height: 16px;
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #999999;
        line-height: 16px;
    }
    .hotQuestionInput {
        width: 431px;
        height: 32px;
        &:not(:last-of-type) /deep/ .ant-input {
            border-bottom: none;
        }
        .icon,
        .iconfont {
            color: @jt-color-text-secondary;
            cursor: pointer;
            &:hover {
                color: @jt-color-primary;
            }
        }
    }
    /deep/ .ant-input-affix-wrapper .ant-input:not(:first-child) {
        padding-left: 400px;
    }
    /deep/ .ant-modal-title {
        font-size: 16px;
        font-weight: 400;
        color: #333333;
    }
    .hotQuestionCtl {
        margin-right: 10px;
        width: 30px;
        position: relative;
        .icon {
            top: -6px;
            margin: auto;
            position: absolute;
            &.down {
                left: 0;
            }
            &.up {
                right: 0;
            }
        }
    }
    .recommendationModalList {
        width: 240px;
        height: 270px;
        border: 1px solid #D9D9D9;
        display: flex;
        flex-flow: column;
    }
    .recommendSelectBtn {
        padding: 0;
        margin: 125px 16px;
        width: 24px;
        height: 24px;
        border-radius: 2px;
    }
    .answerInput {
        width: 565px;
        position: relative;
        textarea {
            width: 100%;
            height: 144px;
            resize: none;
            padding: 8px;
            display: block;
        }
        p {
            position: absolute;
            right: 8px;
            bottom: -8px;
            color: @jt-color-text-secondary;
            user-select: none;
            &.error {
                span {
                    color: @jt-color-error;
                }
            }
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
    .cacheCss{
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        display: block;
    }
    .edit{
        width: 29px;
        color:#555;
    }
    .selsctstyle:hover{
        background-color: rgba(245,248,255,1);
    }
    .selection:hover {
        color: #337DFF;
    }
    .edit:hover{
        color:#337DFF;
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
    /deep/ .ant-checkbox-group {
        display: flex;
        flex-flow: column;
        ::-webkit-scrollbar {
            width: 6px;
        }
        ::-webkit-scrollbar-thumb {
            border-radius: 3px;
            background: #D9D9D9;
            opacity: 0.2;
        }
        ::-webkit-scrollbar-track {
            background: transparent;
        }
    }
    /deep/ .ant-checkbox-group-item {
        margin-bottom: 12px;
        width: 200px;
        color: #555555;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        display: block;
    }
    
</style>

<script>
import {Radio,} from "ant-design-vue";
import {Breadcrumb} from "ant-design-vue";
import md5 from 'js-md5';
import { mapState } from "vuex";
import Vue from 'vue'
import Api from '../../utils/http.js';
import {mapActions, mapGetters, mapMutations} from 'vuex';
import { judgeSensitiveWord, getRandomNum} from "@/utils/common.ts";

Vue.prototype.$api = Api;

export default {
    data() {
        return {
            errorMesAll:"系统繁忙，请稍后再试",
            indexCache : 0,
            indexKeyword : 0,
            setCache : false,
            setKeyword : false,
            TitleCache:"",
            TitleKeyword:"",
            checkInKeywords:true,
            checkInCache:true,
            
            allowtocommit:false,
            KeyWords : "",
            Cache:"",
            contentCache :{
                question:'',
                faqid:''
            },
            contentKeywords:{
                question:'',
                faqid:''
            },
            content : "",
            value: "",
            visibleKeyWords: false,
            visibleCache: false,
            recommendModalVisible: false,
            showsearchdata:false,
            radioStyle: {
                display: 'block',
                height: '30px',
                lineHeight: '30px',
            },
            searchData:[],
            showCache:[],
            showpreKeyWords: [],
            /* recommendModalData: [
                {key: "1", title: "title1", description: ""},
                {key: "2", title: "title2", description: ""},
                {key: "3", title: "title3", description: ""},
                {key: "4", title: "title4", description: ""},
                {key: "5", title: "title5", description: ""}
            ], */
            recommendationSearchKeyword: "",
            recommendListLeft: [],
            recommendListLeftSelected: [],
            recommendListRight: [],
            recommendListRightSelected: [],
            keywordiswrong: true,
            cacheiswrong:true,
            recommendModalData:[],
            recommendModalTargetKeys: [],
            input: {
                robotName: this.$route.query.robotName,
                hotQuestion: [],
                describeVal: this.$route.query.describe,
                welcomecontent:"",
                talk:"",
                mtelno: "",
                vtelno:""
            },
            validate: {
                robotName: true,
                describeVal: true,
                welcomecontent:true,
                talk:true,
                cache:true,
                keyword:true,
                mtelno: true
            },
            inputError: {
                robotName: "",
                describeVal: "",
                welcomecontent:"",
                talk:"",
                cache:"",
                keyword:"",
                mtelno: ""
                
            },
            tips: {
                hotQuestion: "开始对话前推荐给用户的问题，最多可设置5个。",
                keywords:"设置前置关键词后，若用户问题中包含该词 ，则匹配到对应的标准问题。",
                cache:"设置缓存后，若用户问题与该缓存一致，则匹配到对应的标准问题。"
            },
            form: this.$form.createForm(this, { name: 'coordinated' }),
            
        };
    },
    mounted() {
        this.querypreKeyWords([this.$route.query.robotID,"0",this.userId]).then(resKeyword => {
            if(resKeyword.errno == 0){
                this.queryCache([this.$route.query.robotID,"0",this.userId]).then((resCache) => {
                    if(resCache.errno == 0){
                        this.queryRobot([0,this.userId,this.$route.query.robotID]).then((res) => {
                            if(res.errno == 0){
                                this.initPage();
                            }else if(res.errno != '-101'){
                                if(res.errno == 999){
                                    this.error("查询机器人信息失败",this.errorMesAll,0);
                                }else{
                                    this.error("查询机器人信息失败",this.errorMesAll,4.5);
                                }
                            }
                        });
                    }else if(resCache.errno != '-101'){
                        if(resCache.errno == 999){
                            this.error("查询机器人信息失败",this.errorMesAll,0);
                        }else{
                            this.error("查询机器人信息失败",this.errorMesAll,4.5);
                        } 
                    }
                });
            }else if(resKeyword.errno != '-101'){
                if(resKeyword.errno == 999){
                    this.error("查询机器人信息失败",this.errorMesAll,0);
                }else{
                    this.error("查询机器人信息失败",this.errorMesAll,4.5);
                }
            }
        });
        
    },
    beforeCreate() {
        this.form = this.$form.createForm(this, { name: 'register' });
    },
    components: {
        "jt-radio": Radio,
        "jt-radio-group": Radio.Group,
        Breadcrumb,
        "breadcrumb-item": Breadcrumb.Item,
    },
    watch: {
        '$store.state.questionAnswer.questionDetail': function() {
            this.input = this.$store.state.questionAnswer.questionDetail;
        },
        'validate.robotName':function(newval){
            if(this.validate.robotName == false){
                this.allowtocommit = true;
            }else{
                this.allowtocommit = false;
            }
        },
        'input.hotQuestion':function(newval){
            if(this.input.hotQuestion.length > 5){
                this.allowtocommit = true;
            }else{
                this.allowtocommit = false;
            }
        },
        'validate.describeVal':function(newval){
            if(this.validate.describeVal == false){
                this.allowtocommit = true;
            }else{
                this.allowtocommit = false;
            }
        },
        'validate.welcomecontent':function(newval){
            if(this.validate.welcomecontent == false){
                this.allowtocommit = true;
            }else{
                this.allowtocommit = false;
            }
        },
        'validate.talk':function(newval){
            if(this.validate.talk == false){
                this.allowtocommit = true;
            }else{
                this.allowtocommit = false;
            }
        },
        'validate.cache':function(newval){
            if(this.validate.cache == false){
                this.allowtocommit = true;
            }else{
                this.allowtocommit = false;
            }
        },
        'validate.keyword':function(newval){
            if(this.validate.keyword == false){
                this.allowtocommit = true;
            }else{
                this.allowtocommit = false;
            }
        },
        'validate.mtelno':function() {
            if(this.validate.mtelno == false){
                this.allowtocommit = true;
            }else{
                this.allowtocommit = false;
            }
        },
        'contentCache.question':function(newval){
            this.checkInCache = true;
            for(let i = 0 ; i < this.searchData.length ; i ++){
                //console.log("缓存："+this.contentCache.question)
                if(this.contentCache.question == this.searchData[i].question){
                    this.checkInCache = false;
                }        
            }    
        },
        'contentKeywords.question':function(newval){
            this.checkInKeywords = true;
            for(let i = 0 ; i < this.searchData.length ; i ++){
                if(this.contentKeywords.question == this.searchData[i].question)
                    this.checkInKeywords = false;
            }
            
        }
    },
    computed: {
        ...mapState(["loading","userinfo","userId","userType"]),
        leftIndeterminate() {
            if (
                this.recommendListLeftSelected.length > 0 &&
                this.recommendListLeftSelected.length < this.recommendListLeft.length
            ) {
                return true;
            } else {
                return false;
            }
        },
        checkLeftAll() {
            if (
                this.recommendListLeftSelected.length != 0 &&
                this.recommendListLeftSelected.length == this.recommendListLeft.length
            ) {
                return true;
            } else {
                return false;
            }
        },
        rightIndeterminate() {
            if (
                this.recommendListRightSelected.length > 0 &&
                this.recommendListRightSelected.length < this.recommendListRight.length
            ) {
                return true;
            } else {
                return false;
            }
        },
        checkRightAll() {
            if (
                this.recommendListRightSelected.length != 0 &&
                this.recommendListRightSelected.length == this.recommendListRight.length
            ) {
                return true;
            } else {
                return false;
            }
        },
    },
    methods: { 
        ...mapActions({
            querypreKeyWords: "robotSet/querypreKeyWords",
            addpreKeyWords: "robotSet/addpreKeyWords",
            queryCache: "robotSet/queryCache",
            addCache: "robotSet/addCache",
            addCacheEs: "robotSet/addCacheEs",
            addCacheRedis: "robotSet/addCacheRedis",
            addKeywordsRedis:"robotSet/addKeywordsRedis",
            robotset:"robotSet/robotset",
            queryRobot:"robotSet/queryRobot",
            addRobotRedis:"robotSet/addRobotRedis",
            queryEs:"robotSet/queryEs",
            queryEsHotquestion:"robotSet/queryEsHotquestion",
        }),
        initPage() {
            this.showpreKeyWords = this.$store.state.robotSet.showpreKeyWords;
            this.showCache = this.$store.state.robotSet.showCache;  
            this.input.welcomecontent = this.$store.state.robotSet.initdata.welcomereply;
            this.input.talk = this.$store.state.robotSet.initdata.defaultreply;
            this.input.mtelno = this.$store.state.robotSet.initdata.mtelno;
            this.input.vtelno = this.$store.state.robotSet.initdata.vtelno;
            this.input.hotQuestion = this.$store.state.robotSet.robothotquestion;
            this.recommendListRight = this.input.hotQuestion.slice(0);
        },
        
        validateStandardQuestion() {
            this.validate.robotName = true;
            const reg =/^[a-zA-Z0-9_\u4e00-\u9fa5\uff41-\uff5a\uff21-\uff3a\uFF10-\uFF19]+$/;
            const response = judgeSensitiveWord(this.input.robotName);
            if (this.input.robotName.length == 0) {
                this.inputError.robotName = "请输入机器人名称";
                this.validate.robotName = false;
            } else if (this.input.robotName.length > 12) {
                this.inputError.robotName = "请输入12字以内的机器人名称";
                this.validate.robotName = false;
            }else if(this.input.robotName && !reg.test(this.input.robotName)){
                this.inputError.robotName = "仅支持中文、英文、数字与下划线 ！";
                this.validate.robotName = false;
            }else if(!response.detectedResult){
                this.inputError.robotName = response.errorMsg;
                this.validate.robotName = false;
            }
            if (this.validate.robotName === false) {
                document.getElementById("inputStandardQuestion").style.borderColor = "#F04134";
            }else {
                document.getElementById("inputStandardQuestion").style.borderColor = "#D9D9D9";
            }
        },
        validateAnswer() {
            this.validate.describeVal = true;
            const responseSen = judgeSensitiveWord(this.input.describeVal);
            if (this.input.describeVal.length > 200) {
                this.inputError.describeVal = "不可超过200字";
                this.validate.describeVal = false;
            }else if(!responseSen.detectedResult){
                this.inputError.describeVal = responseSen.errorMsg;
                this.validate.describeVal = false;
            }
            if (this.validate.describeVal === false) {
                document.getElementById("inputAnswer").style.borderColor = "#F04134";
            } else {
                document.getElementById("inputAnswer").style.borderColor = "#D9D9D9";
            }
        },
        validateWelcomecontent(){
            this.validate.welcomecontent = true;
            const responseSen = judgeSensitiveWord(this.input.welcomecontent);
            if (this.input.welcomecontent.length > 50) {
                this.inputError.welcomecontent = "不可超过50字";
                this.validate.welcomecontent = false;
            }else if(!responseSen.detectedResult){
                this.inputError.welcomecontent = responseSen.errorMsg;
                this.validate.welcomecontent = false;
            }
            if (this.validate.welcomecontent === false) {
                document.getElementById("inputWelcomecontent").style.borderColor = "#F04134";
            } else {
                document.getElementById("inputWelcomecontent").style.borderColor = "#D9D9D9";
            }
        },
        validateArtificial() {
            this.validate.mtelno = true;
            if (this.input.mtelno.length !== 11) {
                this.inputError.mtelno = "请输入正确的手机号";
                this.validate.mtelno = false;
            }
            if (this.validate.mtelno === false) {
                document.getElementById("mtelno").style.borderColor = "#F04134";
            } else {
                document.getElementById("mtelno").style.borderColor = "#D9D9D9";
            }
        },
        validateTalk(){
            this.validate.talk = true;
            const responseSen = judgeSensitiveWord(this.input.talk);
            if (this.input.talk.length > 50) {
                this.inputError.talk = "不可超过50字";
                this.validate.talk = false;
            }else if(!responseSen.detectedResult){
                this.inputError.talk = responseSen.errorMsg;
                this.validate.talk = false;
            }
            if (this.validate.talk === false) {
                document.getElementById("inputTalk").style.borderColor = "#F04134";
            } else {
                document.getElementById("inputTalk").style.borderColor = "#D9D9D9";
            }
        },
        
        validateCacheRepeat() {
            this.validate.cache = true;
            if(this.showCache.length == 1){
                document.getElementById("inputCache_" + 0).style.borderColor = "#D9D9D9";
            }
            for(let i = 0; i < this.showCache.length-1 ; i ++){
                for(let j = i +1 ; j < this.showCache.length ; j ++){
                    if(this.showCache[i].Cache == this.showCache[j].Cache){
                        this.inputError.cache = "缓存重复";
                        this.validate.cache = false;
                        document.getElementById("inputCache_" + i).style.borderColor = "#F04134";
                        break;
                    }else{
                        document.getElementById("inputCache_" + i).style.borderColor = "#D9D9D9";
                    }
                }
            }
        },
        validateKeywordRepeat() {
            this.validate.keyword = true;
            if(this.showpreKeyWords.length == 1){
                document.getElementById("inputKeyword_" + 0).style.borderColor = "#D9D9D9";
            }
            for(let i = 0; i < this.showpreKeyWords.length-1 ; i ++){
                for(let j = i +1 ; j < this.showpreKeyWords.length ; j ++){
                    if(this.showpreKeyWords[i].keywords == this.showpreKeyWords[j].keywords){
                        this.inputError.keyword = "前置关键词重复";
                        this.validate.keyword = false;
                        document.getElementById("inputKeyword_" + i).style.borderColor = "#F04134";
                        break;
                    }else{
                        document.getElementById("inputKeyword_" + i).style.borderColor = "#D9D9D9";
                    }
                }
            }
        },
        resortRecommendationQuestion(item, index, type) {
            if (type === 0) {
                this.input.hotQuestion.splice(index, 1);
                this.input.hotQuestion.splice(index + 1, 0, item);
            } else {
                this.input.hotQuestion.splice(index, 1);
                this.input.hotQuestion.splice(index - 1, 0, item);
            }
        },
        searchES(word){
            this.value = "";
            this.showsearchdata=true;
            const botid = this.$route.query.robotID;
            const rearchEsdata = [botid,word,this.userId];
            this.queryEs(rearchEsdata).then(res => {
                if(res.errno == 0){
                    this.searchData = this.$store.state.robotSet.Esquery;
                }else if(res.errno != '-101'){
                    if(res.errno == 999){
                        this.error("查询信息失败",this.errorMesAll,0);
                    }else{
                        this.error("查询信息失败",this.errorMesAll,4.5);
                    }
                }
            })
        },
        checkkeywordLength(rule, value, callback) {
            const responseSen = judgeSensitiveWord(value);
            if (value.length == 0) {
                this.keywordiswrong=true;
                callback('请输入关键词');
            }else if (value.length > 12) {
                this.keywordiswrong=true;
                callback('不可超过12字');
            }else if(!responseSen.detectedResult){
                this.keywordiswrong=true;
                callback(responseSen.errorMsg);
            }else {
                this.keywordiswrong=false;
                callback();
            }
        },
        checkcacheLength(rule, value, callback) {
            const responseSen = judgeSensitiveWord(value);
            if (value.length == 0) {
                this.cacheiswrong=true;
                callback('请输入缓存');
            }else if (value.length > 125) {
                this.cacheiswrong=true;
                callback('不可超过125字');
            }else if(!responseSen.detectedResult){
                this.cacheiswrong=true;
                callback(responseSen.errorMsg);
            }else {
                this.cacheiswrong=false;
                callback();
            }
        },
        checkKeyWords(KeyWords){
            if(KeyWords.length > 12){
                return true;
            }
            else{
                return false;
            }
        },
        checkCache(Cache){
            if(Cache.length > 125){
                return true;
            }
            else{
                return false;
            }
        },
        showModalKeyWords() {
            this.visibleKeyWords = true;   
            this.setKeyword = false;
            this.TitleKeyword = "添加前置关键词";
            this.form.resetFields();
        },
        handleCancelKeyWords() {
            this.KeyWords = "";
            this.contentKeywords = {
                question:'',
                faqid:''
            };
            this.searchData = [];
            this.showsearchdata = false;
            this.visibleKeyWords = false;    
            this.value="";
        },
        handleSubmitKeyWords(KeyWords,content) {
            if(this.setKeyword == false){
                this.showpreKeyWords.unshift({ keywords:KeyWords, question: content.question,faqid:content.faqid });
            }else{
                this.showpreKeyWords[this.indexKeyword].keywords = KeyWords;
                this.showpreKeyWords[this.indexKeyword].question = content.question;
                this.showpreKeyWords[this.indexKeyword].faqid = content.faqid;
            }
            
            this.KeyWords = "";
            this.contentKeywords = {
                question:'',
                faqid:''
            };
            this.searchData = [];
            this.showsearchdata = false;
            this.visibleKeyWords = false;
            this.$nextTick(()=>{
                this.validateKeywordRepeat();
            })
            this.value="";
        },
        showModalCache() {
            this.setCache = false;
            this.visibleCache = true;   
            this.TitleCache = "添加缓存";
            this.form.resetFields();
        },
        handleCancelCache() {
            this.Cache = "";
            this.contentCache={
                question:'',
                faqid:''
            };
            this.searchData = [];
            this.showsearchdata = false;
            this.visibleCache = false;
            this.value="";
        },
        
        handleSubmitCache(Cache,content) {
            if(this.setCache == false){
                this.showCache.unshift({ Cache:Cache, question: content.question,faqid:content.faqid });
            }
            else{
                this.showCache[this.indexCache].Cache = Cache;
                this.showCache[this.indexCache].question = content.question;
                this.showCache[this.indexCache].faqid = content.faqid;
            }
            this.Cache = "";
            this.contentCache={
                question:'',
                faqid:''
            };
            this.searchData = [];
            this.showsearchdata = false;
            this.visibleCache = false;
            this.$nextTick(()=>{
                this.validateCacheRepeat();
            })
            this.value="";
        },
        radioSelectedCache(data) {    
            this.contentCache.question = data.question;
            this.contentCache.faqid = data.faqid;
            this.checkInCache = false;
        },
        radioSelectedKeyword(data) {
            this.contentKeywords.question = data.question;
            this.contentKeywords.faqid = data.faqid;
            this.checkInKeywords = false;
        },
        showRecommendModal() {
            for (let i = 0; i < this.recommendListRight.length; i++) {
                for (let j = 0; j < this.recommendListLeft.length; j++) {
                    if (this.recommendListRight[i].label == this.recommendListLeft[j].label) {
                        this.recommendListLeft.splice(j, 1);
                        break;
                    }
                }
            }
            this.recommendModalVisible = true;
        },
        selectLeftAll(e) {
            const selectedList = [];
            if (e.target.checked) {
                for (const item of this.recommendListLeft) {
                    selectedList.push(item.value);
                }
            }
            Object.assign(this, {recommendListLeftSelected: selectedList});
        },
        selectRightAll(e) {
            const selectedList = [];
            if (e.target.checked) {
                for (const item of this.recommendListRight) {
                    selectedList.push(item.value);
                }
            }
            Object.assign(this, {recommendListRightSelected: selectedList});
        },
        
        deleteRightSelected() {
            for (const item of this.recommendListRightSelected) {
                for (let i = 0; i < this.recommendListRight.length; i++) {
                    if (item == this.recommendListRight[i].value) {
                        this.recommendListLeft.push({
                            "label": this.recommendListRight[i].label,
                            "value": this.recommendListRight[i].value
                        });
                        this.recommendListRight.splice(i, 1);
                        break;
                    }
                }
            }
            this.recommendListRightSelected = [];
        },
        searchRecommendationSubmit() {
            //console.log("查询：" + this.recommendationSearchKeyword)
            const botid = this.$route.query.robotID;
            const rearchEsdata = [botid,this.recommendationSearchKeyword,this.userId]; 
            this.queryEsHotquestion(rearchEsdata).then(res => {
                if(res.errno == 0){
                    this.recommendListLeft = this.$store.state.robotSet.Esquery;
                    this.recommendListLeftSelected = [];
                    for (let i = 0; i < this.recommendListRight.length; i++) {
                        for (let j = 0; j < this.recommendListLeft.length; j++) {
                            if (this.recommendListRight[i].value == this.recommendListLeft[j].value) {
                                this.recommendListLeft.splice(j, 1);
                                break;
                            }
                        }
                    }
                }else if(res.errno != '-101'){
                    if(res.errno == 999){
                        this.error("查询信息失败",this.errorMesAll,0);
                    }else{
                        this.error("查询信息失败",this.errorMesAll,4.5);
                    }  
                }
            });
        },
        recommendItemSelect() {
            for (const item of this.recommendListLeftSelected) {
                for (let i = 0; i < this.recommendListLeft.length; i++) {
                    if (item == this.recommendListLeft[i].value) {
                        this.recommendListRight.push({
                            "label": this.recommendListLeft[i].label,
                            "value": this.recommendListLeft[i].value
                        });
                        this.recommendListLeft.splice(i, 1);
                        break;
                    }
                }
            }
            this.recommendListLeftSelected = [];
        },
        recommendModalCancle(){
            this.recommendModalVisible = false ; 
            this.recommendationSearchKeyword = '' ; 
            this.recommendListLeft = [] ; 
            this.recommendListRight = this.input.hotQuestion.slice(0);
        },
        recommendModalSubmit() { 
            this.input.hotQuestion = this.recommendListRight.slice(0);
            this.recommendationSearchKeyword = "";
            this.recommendModalVisible = false;
            this.recommendListLeft = [];
        },
        deleteHotquestion(index) {
            this.input.hotQuestion.splice(index, 1);
            this.recommendListRight.splice(index, 1);
        },
        resetCache(index){
            this.form = this.$form.createForm(this);
            this.visibleCache = true;   
            this.setCache = true;
            this.TitleCache = "设置缓存";
            this.indexCache = index;
            this.cacheiswrong = false;
            this.Cache = this.showCache[index].Cache;
            this.contentCache.question = this.showCache[index].question;
            this.contentCache.faqid = this.showCache[index].faqid;
            this.searchES(this.contentCache.question);
        },
        deletePageCache(index){
            this.showCache.splice(index, 1);
            this.validateCacheRepeat();
        },
        resetKeyword(index){
            this.form = this.$form.createForm(this);
            this.visibleKeyWords = true;   
            this.setKeyword = true;
            this.TitleKeyword = "设置关键词";
            this.indexKeyword = index;
            this.keywordiswrong = false;
            this.checkInKeywords = false;
            this.KeyWords = this.showpreKeyWords[index].keywords;
            this.contentKeywords.question = this.showpreKeyWords[index].question;
            this.contentKeywords.faqid = this.showpreKeyWords[index].faqid;
            this.searchES(this.contentKeywords.question);
        },
        deletePageKeywords(index){
            this.showpreKeyWords.splice(index, 1);
            this.validateKeywordRepeat();
        },
        getTime(date){
            const seperator = "-";
            const seperator2 = ":";
            let month = date.getMonth() + 1;
            let strDate = date.getDate();
            if (month >= 1 && month <= 9) {
                month = "0" + month;
            }
            if (strDate >= 0 && strDate <= 9) {
                strDate = "0" + strDate;
            }
            let hours = date.getHours();
            let min = date.getMinutes()
            let sec = date.getSeconds();
            if (hours >= 0 && hours <= 9) {
                hours = "0" + hours;
            }
            if (min >= 0 && min <= 9) {
                min = "0" + min;
            }
            if (sec >= 0 && sec <= 9) {
                sec = "0" + sec;
            }
            const currentdate = date.getFullYear() + seperator + month + seperator + strDate
                    + " " + hours + seperator2 + min
                    + seperator2 + sec;
            return currentdate;
        },
        deleteAll(){
            this.$router.push({path: '/home/testEnv'});
        },
        error(Mestype,mes,time){
            this.$notification['error']({
                message: <div style="font-size:14px;font-family:PingFangSC-Semibold,PingFang SC;font-weight:600;color:rgba(38,38,38,1);">{Mestype}</div>,
                description:
                    <div style="font-size:12px; padding:8px 0px 8px 0px;">
                        {mes}
                    </div>,
                icon:()=><jt-icon type="close-circle" theme="filled" style="color:#F04134"/>,
                duration: time,
            });
        },
        async commitAll(){
            const date = new Date();
            const time = this.getTime(date);

            const botid = this.$route.query.robotID;
            const data = [];
            for(const item of this.showpreKeyWords){
                data.push({
                    squestion: item.question,
                    sqid:md5(item.question),
                    faqid:getRandomNum(item.faqid),
                    forekeyword: item.keywords,
                    userid : getRandomNum(this.userId),
                    creator: this.userId,
                    env:0,
                })
            }
            const robotmes = [botid,data,0]; 
            /* for(let i = 0 ; i < data.length ; i ++){
                console.log("王珊关键词")
                console.log(data[i].squestion);
                console.log(data[i].faqid);
            }  */
            
            const datacache = [];
            for(const item of this.showCache){
                datacache.push({
                    id: md5(botid + item.Cache + date.valueOf() + Math.ceil(Math.random()*10000)),
                    uquestion: item.Cache,
                    faqid: getRandomNum(item.faqid),
                    sqid : md5(item.question),
                    squestion:item.question,
                    userid : getRandomNum(this.userId),
                    signer : this.userId,
                    signtime : time,
                    answer : "testanswer",
                    env : 0,
                })
            }
            const addcacherobot = [botid,datacache,0];

            /* for(const item of datacache){
                console.log("王珊")
                console.log("-faqid:"+item.faqid);
                console.log("-uquestion:"+item.uquestion);
                console.log("-id:"+item.id);
            } */
        
            const datacacheES = [];
            let datacacheIndex = 0;
            for(const item of this.showCache){
                datacacheES.push({
                    botid : getRandomNum(botid),
                    id : getRandomNum(datacache[datacacheIndex].id),
                    uquestion : item.Cache,
                    faqid: getRandomNum(item.faqid),
                    sqid : md5(item.question),
                    squestion : item.question,
                    userid : getRandomNum(this.userId),
                    signer : getRandomNum(this.userId),
                    signtime : time,
                    answer : "testanswer",
                    evaluate : "true",
                    status : 2,
                    env:0,
                    delFlag:"0"
                })
                datacacheIndex ++;
            }
            /* for(const item of datacacheES){
                console.log("高经纬缓存")
                console.log("-faqid:"+item.faqid);
                console.log("-uquestion:"+item.uquestion);
                //console.log("-id:"+item.id);
            } */
            const addcacheESrobot = ["add",botid,2,datacacheES];

            const hotquestionfaqid = [];
            for(let i = 0 ; i < this.input.hotQuestion.length ; i ++){
                hotquestionfaqid[i] = getRandomNum(this.input.hotQuestion[i].value);
            }

            /* for(let i = 0 ; i < this.input.hotQuestion.length ; i ++){
                console.log("赵薇热点问题")
                console.log(this.input.hotQuestion[i].question);
                console.log(this.input.hotQuestion[i].faqid);
            } */
            
            const robotsetdata=[0,this.userId,botid,this.input.robotName,this.input.describeVal,this.input.welcomecontent,this.input.talk,hotquestionfaqid,this.input.mtelno];

            
            const sqIds = [];
            const keywords = [];
            const faqidKeywordRedis = [];
            for(let i = 0 ; i < this.showpreKeyWords.length ; i ++){
                sqIds[i] = md5(this.showpreKeyWords[i].question);
                keywords[i]= this.showpreKeyWords[i].keywords;
                faqidKeywordRedis[i] = getRandomNum(this.showpreKeyWords[i].faqid);
            }
            /* for(let i = 0 ; i < this.showpreKeyWords.length ; i ++){
                console.log("乔杨关键词")
                console.log(keywords[i]);
                console.log(faqidKeywordRedis[i]);
            } */
            const dataRedisKeywords = [sqIds,botid,keywords,faqidKeywordRedis,this.userId];

            const sqIdsCacheRedis = [];
            const uqs = [];
            const faqidCacheRedis = [];
            for(let i = 0 ; i < this.showCache.length ; i ++){
                sqIdsCacheRedis[i] = md5(this.showCache[i].question);
                uqs[i]= this.showCache[i].Cache;
                faqidCacheRedis[i] = getRandomNum(this.showCache[i].faqid);
            }
            /* for(let i = 0 ; i < this.showCache.length ; i ++){
                console.log("乔杨缓存")
                console.log(uqs[i]);
                console.log(faqidCacheRedis[i]);
            } */
            const dataRedisCache = [sqIdsCacheRedis,botid,uqs,faqidCacheRedis,this.userId];

            const hotquestionRedis = [];
            for(let i = 0 ; i < this.input.hotQuestion.length ; i++){
                hotquestionRedis[i]= this.input.hotQuestion[i].label;
            }
            const addrobotRedisMes = [this.userId,botid,this.userType,(new Date()).valueOf(),this.input.describeVal,1,this.$route.query.status,this.input.talk,this.input.welcomecontent,hotquestionRedis,hotquestionfaqid,this.input.mtelno];

            await this.addRobotRedis(addrobotRedisMes);
            await this.robotset(robotsetdata);
            await this.addpreKeyWords(robotmes);
            await this.addCache(addcacherobot);
            await this.addCacheEs(addcacheESrobot);
            await this.addCacheRedis(dataRedisCache);
            await this.addKeywordsRedis(dataRedisKeywords);
            console.log("addRobotRedis: " + this.$store.state.robotSet.addrobotsuccess);
            console.log("robotset: " + this.$store.state.robotSet.robotsetsuccess);
            console.log("addkeywordsuccess: " + this.$store.state.robotSet.addkeywordsuccess);
            console.log("addCachesuccess: " + this.$store.state.robotSet.addCachesuccess);
            console.log("addCacheEssuccess: " + this.$store.state.robotSet.addCacheEssuccess);
            console.log("addCacheRedissuccess: " + this.$store.state.robotSet.addCacheRedissuccess);
            console.log("addKeywordsRedissuccess: " + this.$store.state.robotSet.addKeywordsRedissuccess);
            if((this.$store.state.robotSet.addrobotsuccess==200) && !this.$store.state.robotSet.robotsetsuccess && !this.$store.state.robotSet.addkeywordsuccess  && (!this.$store.state.robotSet.addCachesuccess) && (!this.$store.state.robotSet.addCacheEssuccess)&& (this.$store.state.robotSet.addCacheRedissuccess == 200) && (this.$store.state.robotSet.addKeywordsRedissuccess == 200) ){
                this.$message.success("设置成功");
                this.$router.push({path: '/home/testEnv'});
            }else if((this.$store.state.robotSet.addrobotsuccess!=('-101')) && (this.$store.state.robotSet.robotsetsuccess != ('-101')) && (this.$store.state.robotSet.addkeywordsuccess != ('-101'))  && (this.$store.state.robotSet.addCachesuccess != ('-101')) && (this.$store.state.robotSet.addCacheEssuccess != ('-101'))&& (this.$store.state.robotSet.addCacheRedissuccess != ('-101')) && (this.$store.state.robotSet.addKeywordsRedissuccess != ('-101'))){
                if((this.$store.state.robotSet.addrobotsuccess == 999) || (this.$store.state.robotSet.robotsetsuccess == 999) || (this.$store.state.robotSet.addkeywordsuccess == 999) || (this.$store.state.robotSet.addCachesuccess == 999) || (this.$store.state.robotSet.addCacheEssuccess == 999) || (this.$store.state.robotSet.addCacheRedissuccess == 999) || (this.$store.state.robotSet.addKeywordsRedissuccess == 999)){
                    this.error("设置机器人失败",this.errorMesAll,0); 
                }else{
                    this.error("设置机器人失败",this.errorMesAll,4.5);
                }    
            }
        }
    }
};
</script>
