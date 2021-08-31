<template>
    <div class="contentBody">
        <div>
            <span class="title" v-show="env === 'test'">编辑问题</span>
            <span class="title" v-show="env !== 'test'">问题详情</span>
        </div>
        <div style="display: flex; flex-flow: row; margin-top: 32px;">
            <div class="inputLabel">
                <span style="color: #F04134; margin-right: 4px;">*</span><span>标准问题</span>
            </div>
            <div style="display: flex; flex-flow: column;">
                <jt-input
                    id="inputStandardQuestion"
                    v-model="input.standardQuestion"
                    style="width: 431px; height: 32px;"
                    placeholder="请输入125字以内的标准问题，不可重复"
                    :disabled="inputDisabled"
                    @blur="validateStandardQuestion()"
                />
                <span v-show="env === 'test' && !validate.standardQuestion" class="errorTip">{{inputError.standardQuestion}}</span>
            </div>
        </div>
        <div v-show="similarQuestionShowFlag" style="display: flex; flex-flow: row; margin-top: 24px;">
            <div class="inputLabel">
                <span>相似问题</span>
            </div>
            <div style="display: flex; flex-flow: column;">
                <jt-input
                    id="inputSimilarQuestionHead"
                    v-show="env === 'test'"
                    v-model="input.similarQuestionHead"
                    style="width: 431px; height: 32px;"
                    placeholder="请输入125字以内的相似问题"
                    @keyup.enter="similarQuestionEnter()"
                    @blur="validateSimilarQuestion()"
                    ref="refSimilarQuestionHead"
                />
                <p v-show="env === 'test' && input.similarQuestionTail.length > 0" />
                <div class="similarQuestionTailDiv">
                    <jt-input
                        v-for="(item, index) in input.similarQuestionTail"
                        :id="'inputSimilarQuestionTail_' + index"
                        v-model="input.similarQuestionTail[index]"
                        style="width: 431px; height: 32px"
                        class="inputIcon"
                        placeholder="请输入125字以内的相似问题"
                        :disabled="inputDisabled"
                        :key="index"
                        @blur="validateSimilarQuestion()"
                    >
                        <span
                            v-show="env === 'test'"
                            slot="suffix"
                            class="iconfont iconshanchu1"
                            @click="deleteSimilarQuestion(index)"
                        ></span>
                    </jt-input>
                </div>
                <span v-show="env === 'test' && validate.similarQuestion" class="normalTip">{{tips.similarQuestion}}</span>
                <span v-show="env === 'test' && !validate.similarQuestion" class="errorTip">{{inputError.similarQuestion}}</span>
            </div>
        </div>
        <div v-show="keyWordShowFlag" style="display: flex; flex-flow: row; margin-top: 24px;">
            <div class="inputLabel">
                <span>关键词</span>
            </div>
            <div>
                <div>
                    <jt-input
                        id="inputKeyWordHead"
                        v-show="env === 'test'"
                        v-model="input.keyWordHead"
                        style="width: 180px; height: 32px; margin-right: 8px; margin-bottom: 4px;"
                        placeholder="请输入12字以内的关键词"
                        @keyup.enter="keyWordEnter()"
                        @blur="validateKeyWord()"
                        ref="refKeyWordHead"
                    />
                    <jt-input
                        v-for="(item, index) in input.keyWordTail"
                        :id="'inputKeyWordTail_' + index"
                        v-model="input.keyWordTail[index]"
                        style="width: 180px; height: 32px; margin-right: 8px; margin-bottom: 4px;"
                        class="inputIcon"
                        placeholder="请输入12字以内的关键词"
                        :disabled="inputDisabled"
                        :key="index"
                        @blur="validateKeyWord()"
                    >
                        <span
                            v-show="env === 'test'"
                            slot="suffix"
                            class="iconfont iconshanchu1"
                            @click="deleteKeyWord(index)"
                        ></span>
                    </jt-input>
                </div>
                <div style="margin-bottom: -4px;">
                    <span v-show="env === 'test' && validate.keyWord" class="normalTip">{{tips.keyWord}}</span>
                    <span v-show="env === 'test' && !validate.keyWord" class="errorTip">{{inputError.keyWord}}</span>
                </div>
            </div>
        </div>
        <div style="display: flex; flex-flow: row; margin-top: 24px;">
            <div class="inputLabel">
                <span style="margin-right: 5px;">匹配度</span>
                <jt-tooltip :title="tips.threshold">
                    <jt-icon type="question-circle" class="title-icon" />
                </jt-tooltip>
            </div>
            <div style="display: flex; flex-flow: row;">
                <jt-slider
                    v-model="input.threshold"
                    style="width: 339px; margin-top: 10px;"
                    :min="0"
                    :max="1"
                    :step="0.1"
                    :marks="thresholdMark"
                    :disabled="inputDisabled"
                />
                <jt-input-number
                    v-model="input.threshold"
                    :min="0"
                    :max="1"
                    :step="0.1"
                    style="marginLeft: 16px; width: 64px;"
                    :disabled="inputDisabled"
                    :precision="1"
                />
            </div>
        </div>
        <div v-show="recommendationQuestionShowFlag" style="display: flex; flex-flow: row; margin-top: 24px;">
            <div class="inputLabel">
                <span style="margin-right: 5px;">推荐标准问题</span>
                <jt-tooltip :title="tips.recommendationQuestion">
                    <jt-icon type="question-circle" class="title-icon" />
                </jt-tooltip>
            </div>
            <div style="display: flex; flex-flow: column;">
                <div v-show="env === 'test'" style="display: flex; flex-flow: row; margin-bottom: 8px;">
                    <jt-button
                        v-show="inputDisabled == true"
                        disabled
                        class="recommendationQuestionBtn"
                    >
                        <span class="iconfont icontianjia" style="font-size: 16px;" />
                    </jt-button>
                    <jt-button
                        v-show="inputDisabled != true"
                        @click="showRecommendModal"
                        class="recommendationQuestionBtn"
                    >
                        <span class="iconfont icontianjia" style="font-size: 16px;" />
                    </jt-button>
                    <span class="recommendationQuestionBtnTip">最多可添加5条</span>
                    <jt-modal
                        :footer="null"
                        centered
                        v-model="recommendModalVisible"
                        title="添加推荐标准问题"
                        width="600px"
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
                                        <span style="font-size: 12px; font-weight: 400; color: #333333; line-height: 18px;">推荐问题</span>
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
                                    style="width: 100%; padding: 8px; overflow: auto;height:187px"
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
                                    >没有搜索到标准问题可以推荐
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
                                    style="width: 100%; padding: 8px; overflow: auto;height:236px"
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
                                    >您还未添加推荐标准问题
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div style="padding-top: 15px; padding-right: 19px; height: 63px; text-align: right; border-top: 1px solid #E9EBEF;">
                            <jt-button style="margin-right: 8px" @click="function() {recommendModalVisible = false}">取消</jt-button>
                            <jt-button :disabled="recommendListRight.length < 1" type="primary" @click="recommendModalSubmit">确定</jt-button>
                        </div>
                    </jt-modal>
                </div>
                <jt-input
                    placeholder="推荐标准问题"
                    v-for="(item, index) in input.recommendationQuestion"
                    :key="item.value"
                    v-model="item.label"
                    style="width: 431px; height: 32px;"
                    class="inputIcon"
                    disabled
                >
                    <div
                        v-show="!inputDisabled && env === 'test'"
                        slot="suffix"
                        class="recommendationQuestionCtl"
                    >
                        <span
                            v-show="index !== 0"
                            class="iconfont iconshangyi icon up"
                            @click="resortRecommendationQuestion(item, index, 1)"
                        ></span>
                        <span
                            v-show="index != (input.recommendationQuestion.length - 1)"
                            class="iconfont iconxiayi icon down"
                            @click="resortRecommendationQuestion(item, index, 0)"
                        ></span>
                    </div>
                    <span
                        v-show="!inputDisabled && env === 'test'"
                        slot="suffix"
                        class="iconfont iconshanchu1"
                        @click="function() {input.recommendationQuestion.splice(index, 1)}"
                    ></span>
                </jt-input>
            </div>
        </div>
        <!-- 新增start -->
        <div v-show="leadTheProblemShowFlag" style="display: flex; flex-flow: row; margin-top: 24px;">
            <div class="inputLabel">
                <span style="margin-right: 5px;">前置问题添加</span>
                <jt-tooltip :title="tips.leadTheProblem">
                    <jt-icon type="question-circle" class="title-icon" />
                </jt-tooltip>
            </div>
            <div style="display: flex; flex-flow: column;">
                <div v-show="env === 'test'" style="display: flex; flex-flow: row; margin-bottom: 8px;">
                    <jt-button
                        v-show="inputDisabled == true"
                        disabled
                        class="recommendationQuestionBtn"
                    >
                        <span class="iconfont icontianjia" style="font-size: 16px;" />
                    </jt-button>
                    <jt-button
                        v-show="inputDisabled != true"
                        @click="showPrepositionModal"
                        class="recommendationQuestionBtn"
                    >
                        <span class="iconfont icontianjia" style="font-size: 16px;" />
                    </jt-button>
                    <span class="recommendationQuestionBtnTip">最多可添加5条</span>
                    <jt-modal
                        :footer="null"
                        centered
                        v-model="prepositionModalVisible"
                        title="添加推荐标准问题"
                        width="600px"
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
                                        <span style="font-size: 12px; font-weight: 400; color: #333333; line-height: 18px;">推荐问题</span>
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
                                    style="width: 100%; padding: 8px; overflow: auto;height:187px"
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
                                    >没有搜索到标准问题可以推荐
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
                                    style="width: 100%; padding: 8px; overflow: auto;height:236px"
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
                                    >您还未添加推荐标准问题
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div style="padding-top: 15px; padding-right: 19px; height: 63px; text-align: right; border-top: 1px solid #E9EBEF;">
                            <jt-button style="margin-right: 8px" @click="function() {prepositionModalVisible = false}">取消</jt-button>
                            <jt-button :disabled="recommendListRight.length < 1" type="primary" @click="prepositionModalSubmit">确定</jt-button>
                        </div>
                    </jt-modal>
                </div>
                <jt-input
                    placeholder="前置问题添加"
                    v-for="(item, index) in input.leadTheProblem"
                    :key="item.value"
                    v-model="item.label"
                    style="width: 431px; height: 32px;"
                    class="inputIcon"
                    disabled
                >
                    <div
                        v-show="!inputDisabled && env === 'test'"
                        slot="suffix"
                        class="recommendationQuestionCtl"
                    >
                        <span
                            v-show="index !== 0"
                            class="iconfont iconshangyi icon up"
                            @click="resortLeadTheProblem(item, index, 1)"
                        ></span>
                        <span
                            v-show="index != (input.leadTheProblem.length - 1)"
                            class="iconfont iconxiayi icon down"
                            @click="resortLeadTheProblem(item, index, 0)"
                        ></span>
                    </div>
                    <span
                        v-show="!inputDisabled && env === 'test'"
                        slot="suffix"
                        class="iconfont iconshanchu1"
                        @click="function() {input.leadTheProblem.splice(index, 1)}"
                    ></span>
                </jt-input>
            </div>
        </div>
        <!-- 新增end -->
        <edit-answer 
            :inputDisabled="inputDisabled" 
            :input="input.answer" 
            :value="input" 
            :type='"questionAnswer"' 
            :answerId="answerId" 
            @uploadAnswer="uploadAnswer" 
            @handleChangeInputAnswer="handleChangeInputAnswer" 
            @setValidate="setValidate" 
            ref="editAnswer"
        ></edit-answer>
        <div v-show="env === 'test'" style="display: flex; flex-flow: row; margin-top: 32px; margin-left: 186px;">
            <jt-button :disabled="disableSubmit" type="primary" @click="saveSubmit('save')">保存</jt-button>
            <jt-button
                :disabled="disableSubmit"
                v-show="mode === 'create'"
                type="primary"
                style="margin-left: 8px; width: 128px;"
                @click="saveSubmit('next')"
            >保存并新建下一条</jt-button>
            <jt-button style="margin-left: 8px" @click="goLibraryList">取消</jt-button>
        </div>
        <!-- 切换弹窗 -->
        <jt-modal
            :closable="false"
            :footer="null"
            centered
            v-model="saveConfirm"
            :bodyStyle="{padding: '0px', height: '176px'}"
            width="340px"
        >
            <div style="padding-top: 32px;">
                <div style="margin-left: 32px;">
                    <jt-icon type="exclamation-circle" theme="filled" style="color: #ff931b; font-size: 18px;" />
                    <span style="margin-left: 8px; font-size: 14px; font-weight: 500; color: #333333; line-height: 20px;">
                        是否确认保存当前类型答案？
                    </span>
                </div>
                <div style="margin-top: 8px; margin-left: 58px;">
                    <span style="font-size: 12px; font-weight: 400; color: #555555; line-height: 18px;">
                        每条答案只支持一种类型，其他类型<br />答案将被删除
                    </span>
                </div>
                <div style="margin-top: 30px; margin-left: 180px;">
                    <jt-button style="width: 64px; height: 32px; background: #FFFFFF; border-radius:2px; padding: 7px 18px;  font-size: 12px;margin-bottom:10px" size ="large" @click="saveCancel">取消</jt-button>
                    <jt-button style="margin-left: 8px;margin-bottom:10px; width: 64px; height: 32px; border-radius:2px;padding: 7px 18px; font-size: 12px;" @click="saveOk" type="primary">确定</jt-button>
                </div>
            </div>
        </jt-modal>
    </div>
</template>

<style lang="less" scoped>
@import "~@/assets/style/var.less";

div.contentBody {
    flex: auto;
    width: 100%;
    background: #ffffff;
    border-radius: 2px;
    padding: 20px 100px 40px 20px;
    font-size: 12px;
    font-family: "PingFangSC-Regular,PingFang SC";
    overflow-y: auto;
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
.recommendationQuestionBtn {
    padding: 0px;
    text-align: center;
    width: 32px;
    height: 32px;
    border-radius: 2px;
}
.recommendationQuestionBtnTip {
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
.inputIcon {
    // &:not(:last-of-type) /deep/ .ant-input {
    //     border-bottom: none;
    // }
    .icon,
    .iconfont {
        color: @jt-color-text-secondary;
        cursor: pointer;
        &:hover {
            color: @jt-color-primary;
        }
    }
}
.recommendationQuestionCtl {
    margin-right: 10px;
    width: 30px;
    position: relative;
    .icon {
        top: -10px;
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
    // display: flex;
    // flex-flow: column;
}
.recommendSelectBtn {
    padding: 0;
    margin: 125px 16px;
    width: 24px;
    height: 24px;
    border-radius: 2px;
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
.answerInput {
    width: 565px;
    position: relative;
    margin-top: 8px;
    // textarea {
    //     width: 100%;
    //     height: 144px;
    //     resize: none;
    //     padding: 8px;
    //     display: block;
    // }
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
.errorTip {
    margin-top: 4px;
    height: 17px;
    font-size: 12px;
    font-family: PingFangSC-Regular,PingFang SC;
    font-weight: 400;
    color: #F04134;
    line-height: 17px;
}
.text {
    color:rgb(51, 125, 255)
}
.answerDivider {
    margin-left: 16px;
    margin-right: 16px;
    margin-top: -4px;
    height: 12px;
}
.answerTabIcon {
    font-size: 16px;
    margin-right: 3px;
    // color: #BBBBBB;
    cursor: pointer;
}
.answerTabText {
    font-size: 12px;
    position: relative;
    bottom: 2px;
    // color: #BBBBBB;
    cursor: pointer;
}
.similarQuestionTailDiv {
    // display: flex;
    // flex-flow: column;
    width: 436px;
    max-height: 320px;
    overflow-y: auto;
}
// 上传
/* you can make up upload button and sample style by using stylesheets */
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
</style>

<script>
import { mapActions, mapMutations } from "vuex";
// import { judgeSensitiveWord } from "@/utils/common.ts";
import { Icon } from "ant-design-vue"
import editAnswer from "@/views/robot/questionAnswer/EditAnswer.vue"

export default {
    components:{
        editAnswer,
        // 'jt-upload':Upload,
        'jt-icon':Icon
    },
    inject: ['reload'],
    data() {
        return {
            env: "",
            mode: "",
            inputDisabled: true,
            recommendModalVisible: false,
            recommendationSearchKeyword: "",
            recommendListLeft: [],
            recommendListLeftSelected: [],
            recommendListRight: [],
            recommendListRightSelected: [],
            // 新增start
            prepositionModalVisible: false,
            // 新增end
            input: {
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
                // 新增start
                leadTheProblem: [],
                // 新增end
                answer: "",
                Flag:0
            },
            validate: {
                standardQuestion: true,
                similarQuestion: true,
                keyWord: true,
                answer: false,
            },
            inputError: {
                standardQuestion: "",
                similarQuestion: "",
                keyWord: "",
                answer: "",
            },
            tips: {
                similarQuestion: "可按enter添加多条相似问题，最多可添加100条",
                keyWord: "可按enter添加多个关键词，最多可添加100个",
                threshold: "用来衡量用户问法和标准问题的相似程度。数值越高代表命中问答所需配置的标准问题需要越精准，反之代表标准问题的泛化能力越强。",
                recommendationQuestion: "若命中该标准问题，默认推荐给用户的其他问题。"
            },
            thresholdMark: {
                0: {
                    style: {
                        marginTop: '8px',
                        left: '2%',
                        fontSize: '12px',
                        color: '#555555',
                    },
                    label: "0(低)"
                },
                1: {
                    style: {
                        marginTop: '8px',
                        left: '98%',
                        fontSize: '12px',
                        color: '#555555',
                    },
                    label: "1(高)"
                }
            },
            tabType:'text',
            fileList:[],
            previewVisible: false,
            previewImage: '',
            answerId:'', // 回显时答案内容, 如果是图片和视频的话需要利用此id发送请求获取文件
            isSave: false,
            VioOrPicValidate:true,
            AnswerIsChange:false,
            saveConfirm: false,
            action:"",
            Deltype: false // 保存false/跳转页面true
        };
    },
    beforeMount() {
        this.initPage();
    },
    watch: {
        '$store.state.questionAnswer.questionDetail': function() {
            this.input = this.$store.state.questionAnswer.questionDetail;
            // 新增end
            this.$refs.editAnswer.validateAnswer();
        }
    },
    computed: {
        disableSubmit() {
            // console.log('++'+this.input.standardQuestion,this.input.answer,!this.validate.standardQuestion,!this.validate.similarQuestion,!this.validate.keyWord,!this.validate.answer)
            if (
                this.input.standardQuestion === "" ||
                !this.validate.standardQuestion ||
                !this.validate.similarQuestion ||
                !this.validate.keyWord 
                // || !this.validate.answer
            ) {
                return true;
            } else {
                return false;
            }
        },
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
        similarQuestionShowFlag() {
            if (this.env == "test" || this.input.similarQuestionTail.length > 0) {
                return true;
            } else {
                return false;
            }
        },
        keyWordShowFlag() {
            if (this.env == "test" || this.input.keyWordTail.length > 0) {
                return true;
            } else {
                return false;
            }
        },
        recommendationQuestionShowFlag() {
            if (
                this.env == "test" ||
                (this.env != "test" && this.input.recommendationQuestion.length > 0)
            ) {
                return true;
            } else {
                return false;
            }
        },
        leadTheProblemShowFlag() {
            if (
                this.env == "test" ||
                (this.env != "test" && this.input.leadTheProblem.length > 0)
            ) {
                return true;
            } else {
                return false;
            }
        },
    },
    beforeDestroy() {
        if (!this.isSave) {
            this.routerdelImgOrVio();
        }
    },
    methods: {
        ...mapActions({
            addQuestionDetail: "questionAnswer/addQuestionDetail",
            changeQuestionDetail: "questionAnswer/changeQuestionDetail",
            queryQuestionDetail: "questionAnswer/queryQuestionDetail",
            queryRecommendationQuestion: "questionAnswer/queryRecommendationQuestion",
            delVio: "questionAnswer/delVio",
            queryLeadTheProblem: "questionAnswer/queryLeadTheProblem"
        }),
        ...mapMutations({
            setQuestionDetail: "questionAnswer/setQuestionDetail",
            setDetailMode: "questionAnswer/setDetailMode",
        }),
        initPage() {
            // setting gage inputs
            this.env = this.$store.state.envInfo.env;
            if (this.env === "test") {
                this.inputDisabled = false;
            }
            // query selected record detail
            this.mode = this.$route.query.mode;
            this.setDetailMode(this.mode);
            if (this.mode == "query") {
                if (JSON.parse(this.$route.query.rowData).answer) {
                    this.answerId = JSON.parse(this.$route.query.rowData).answer;
                }
                this.queryQuestionDetail(this.$route.query.recordId).then(res => {
                    this.initQz();
                    if (res.errno === 0) {
                        this.setQuestionDetail(res.detail);
                        // 回显答案
                        if (res.detail.flag == '0') {
                            this.$refs.editAnswer.answerClick(false,'text')
                            this.$refs.editAnswer.tabCutOk()
                            this.$refs.editAnswer.tabType = 'text'
                        }else if (res.detail.flag == '1') {
                            if (this.answerId != '') {
                                this.$refs.editAnswer.getPicOrVio1('pic')
                            }
                        }else if (res.detail.flag == '2') {
                            this.$refs.editAnswer.fileNameVio = res.detail.answer.split('%')[1]
                            if (this.answerId != '') {
                                this.$refs.editAnswer.getPicOrVio1('vio')
                            }
                        }
                    } else {
                        this.showErrorNotification("查询失败！", res.errno, res.errorMsg);
                        this.$router.push({path: "/home/robotHome/libraryList"});
                    }
                });
            }
            // setting breadcrumb of robot home
            let pageName = "新建问答";
            if (this.env != "test") {
                pageName = "问答详情";
            } else if (this.mode == "query") {
                pageName = "编辑问答";
            }
            this.$store.commit(
                'setBreadcrumb',
                [
                    {breadcrumbName: this.$store.state.envInfo.envName, breadcrumbPath: this.$store.state.fromPath},
                    {breadcrumbName: "问答库", breadcrumbPath: "/home/robotHome"},
                    {breadcrumbName: pageName}
                ]
            );
            this.$store.commit('hideLoading', {}, { root: true });
        },
        initQz() {
            this.queryLeadTheProblem(this.$route.query.recordId).then(res => {
                this.input.leadTheProblem = [];
                res.detail.forEach(item => {
                    const preposedqidList = item.preposedqid.split("^");
                    const preposedquestionList = item.preposedquestion.split("^");
                    preposedqidList.forEach((items,indexs) => {
                        const obj = {
                            label: preposedquestionList[indexs],
                            value: items
                        }
                        this.input.leadTheProblem.push(obj);
                    })
                    
                })
            })
        },
        validateStandardQuestion() {
            this.validate.standardQuestion = true;
            if (this.input.standardQuestion.length === 0) {
                this.inputError.standardQuestion = "请输入标准问题";
                this.validate.standardQuestion = false;
            } else if (this.input.standardQuestion.trim() == "") {
                this.inputError.standardQuestion = "标准问题内容不能为空格";
                this.validate.standardQuestion = false;
            } else if (this.input.standardQuestion.length > 125) {
                this.inputError.standardQuestion = "请输入125字以内的标准问题";
                this.validate.standardQuestion = false;
            }
            // if (this.validate.standardQuestion === true) {
            //     const response = judgeSensitiveWord(this.input.standardQuestion);
            //     if (!response.detectedResult) {
            //         this.validate.standardQuestion = false;
            //         this.inputError.standardQuestion = response.errorMsg;
            //     }
            // }
            if (this.validate.standardQuestion === false) {
                document.getElementById("inputStandardQuestion").style.borderColor = "#F04134";
            } else {
                document.getElementById("inputStandardQuestion").style.borderColor = "";
            }
        },
        validateSimilarQuestion() {
            this.validate.similarQuestion = true;
            // check similar question amount
            let sq = this.input.similarQuestionTail.concat(this.input.similarQuestionHead);
            sq = sq.filter(function (str) {
                return str && str.trim();
            });
            if (sq.length > 100) {
                this.inputError.similarQuestion = "最多可添加100条相似问题";
                this.validate.similarQuestion = false;
            }
            // check similar question length and blank
            if (this.input.similarQuestionHead.length > 125) {
                this.inputError.similarQuestion = "请输入125字以内的相似问题";
                this.validate.similarQuestion = false;
                document.getElementById("inputSimilarQuestionHead").style.borderColor = "#F04134";
            } else if (this.input.similarQuestionHead.length > 0 && this.input.similarQuestionHead.trim() == "") {
                this.inputError.similarQuestion = "相似问题内容不能为空格";
                this.validate.similarQuestion = false;
                document.getElementById("inputSimilarQuestionHead").style.borderColor = "#F04134";
            } else {
                document.getElementById("inputSimilarQuestionHead").style.borderColor = "";
            }
            for (let i = 0; i < this.input.similarQuestionTail.length; i++) {
                if (this.input.similarQuestionTail[i].length > 125) {
                    this.inputError.similarQuestion = "请输入125字以内的相似问题";
                    this.validate.similarQuestion = false;
                    document.getElementById("inputSimilarQuestionTail_" + i).style.borderColor = "#F04134";
                } else if (this.input.similarQuestionTail[i].length > 0 && this.input.similarQuestionTail[i].trim() == "") {
                    this.inputError.similarQuestion = "相似问题内容不能为空格";
                    this.validate.similarQuestion = false;
                    document.getElementById("inputSimilarQuestionTail_" + i).style.borderColor = "#F04134";
                } else {
                    document.getElementById("inputSimilarQuestionTail_" + i).style.borderColor = "";
                }
            }
            // check similar question repeat
            if (this.validate.similarQuestion == true) {
                document.getElementById("inputSimilarQuestionHead").style.borderColor = "";
                for (let i = 0; i < this.input.similarQuestionTail.length; i++) {
                    document.getElementById("inputSimilarQuestionTail_" + i).style.borderColor = "";
                    if (
                        this.input.similarQuestionHead.length > 0 &&
                        this.input.similarQuestionHead == this.input.similarQuestionTail[i]
                    ) {
                        this.inputError.similarQuestion = "相似问题重复输入";
                        this.validate.similarQuestion = false;
                        document.getElementById("inputSimilarQuestionHead").style.borderColor = "#F04134";
                        document.getElementById("inputSimilarQuestionTail_" + i).style.borderColor = "#F04134";
                    }
                    for (let j = 0; j < this.input.similarQuestionTail.length; j++) {
                        if (
                            this.input.similarQuestionTail[i].length > 0 &&
                            this.input.similarQuestionTail[i] == this.input.similarQuestionTail[j] &&
                            i != j
                        ) {
                            this.inputError.similarQuestion = "相似问题重复输入";
                            this.validate.similarQuestion = false;
                            document.getElementById("inputSimilarQuestionTail_" + i).style.borderColor = "#F04134";
                        }
                    }
                }
            }
            // check similar question contain sensitive words
            // if (this.validate.similarQuestion == true) {
            //     const headCheckRes = judgeSensitiveWord(this.input.similarQuestionHead);
            //     if (!headCheckRes.detectedResult) {
            //         this.validate.similarQuestion = false;
            //         this.inputError.similarQuestion = headCheckRes.errorMsg;
            //         document.getElementById("inputSimilarQuestionHead").style.borderColor = "#F04134";
            //     } else {
            //         document.getElementById("inputSimilarQuestionHead").style.borderColor = "";
            //     }
            //     for (let i = 0; i < this.input.similarQuestionTail.length; i++) {
            //         const tailCheckRes = judgeSensitiveWord(this.input.similarQuestionTail[i]);
            //         if (!tailCheckRes.detectedResult) {
            //             this.validate.similarQuestion = false;
            //             this.inputError.similarQuestion = tailCheckRes.errorMsg;
            //             document.getElementById("inputSimilarQuestionTail_" + i).style.borderColor = "#F04134";
            //         } else {
            //             document.getElementById("inputSimilarQuestionTail_" + i).style.borderColor = "";
            //         }
            //     }
            // }
        },
        validateKeyWord() {
            this.validate.keyWord = true;
            // check keyword amount
            let kw = this.input.keyWordTail.concat(this.input.keyWordHead);
            kw = kw.filter(function (str) {
                return str && str.trim();
            });
            if (kw.length > 100) {
                this.inputError.keyWord = "最多可添加100个关键词";
                this.validate.keyWord = false;
            }
            // check keyWord length and blank
            if (this.input.keyWordHead.length > 12) {
                this.inputError.keyWord = "请输入12字以内的关键词";
                this.validate.keyWord = false;
                document.getElementById("inputKeyWordHead").style.borderColor = "#F04134";
            } else if (this.input.keyWordHead.length > 0 && this.input.keyWordHead.trim() == "") {
                this.inputError.keyWord = "关键词内容不能为空格";
                this.validate.keyWord = false;
                document.getElementById("inputKeyWordHead").style.borderColor = "#F04134";
            } else {
                document.getElementById("inputKeyWordHead").style.borderColor = "";
            }
            for (let i = 0; i < this.input.keyWordTail.length; i++) {
                if (this.input.keyWordTail[i].length > 12) {
                    this.inputError.keyWord = "请输入12字以内的关键词";
                    this.validate.keyWord = false;
                    document.getElementById("inputKeyWordTail_" + i).style.borderColor = "#F04134";
                } else if (this.input.keyWordTail[i].length > 0 && this.input.keyWordTail[i].trim() == "") {
                    this.inputError.keyWord = "关键词内容不能为空格";
                    this.validate.keyWord = false;
                    document.getElementById("inputKeyWordTail_" + i).style.borderColor = "#F04134";
                } else {
                    document.getElementById("inputKeyWordTail_" + i).style.borderColor = "";
                }
            }
            // check keyWord repeat
            if (this.validate.keyWord == true) {
                document.getElementById("inputKeyWordHead").style.borderColor = "";
                for (let i = 0; i < this.input.keyWordTail.length; i++) {
                    document.getElementById("inputKeyWordTail_" + i).style.borderColor = "";
                    if (
                        this.input.keyWordHead.length > 0 &&
                        this.input.keyWordHead == this.input.keyWordTail[i]
                    ) {
                        this.inputError.keyWord = "关键词重复输入";
                        this.validate.keyWord = false;
                        document.getElementById("inputKeyWordHead").style.borderColor = "#F04134";
                        document.getElementById("inputKeyWordTail_" + i).style.borderColor = "#F04134";
                    }
                    for (let j = 0; j < this.input.keyWordTail.length; j++) {
                        if (
                            this.input.keyWordTail[i].length > 0 &&
                            this.input.keyWordTail[i] == this.input.keyWordTail[j] &&
                            i != j
                        ) {
                            this.inputError.keyWord = "关键词重复输入";
                            this.validate.keyWord = false;
                            document.getElementById("inputKeyWordTail_" + i).style.borderColor = "#F04134";
                        }
                    }
                }
            }
            // check keyWord contain sensitive words
            // if (this.validate.keyWord == true) {
            //     const headCheckRes = judgeSensitiveWord(this.input.keyWordHead);
            //     if (!headCheckRes.detectedResult) {
            //         this.validate.keyWord = false;
            //         this.inputError.keyWord = headCheckRes.errorMsg;
            //         document.getElementById("inputKeyWordHead").style.borderColor = "#F04134";
            //     } else {
            //         document.getElementById("inputKeyWordHead").style.borderColor = "";
            //     }
            //     for (let i = 0; i < this.input.keyWordTail.length; i++) {
            //         const tailCheckRes = judgeSensitiveWord(this.input.keyWordTail[i]);
            //         if (!tailCheckRes.detectedResult) {
            //             this.validate.keyWord = false;
            //             this.inputError.keyWord = tailCheckRes.errorMsg;
            //             document.getElementById("inputKeyWordTail_" + i).style.borderColor = "#F04134";
            //         } else {
            //             document.getElementById("inputKeyWordTail_" + i).style.borderColor = "";
            //         }
            //     }
            // }
        },
        setValidate(val) {
            this.validate.answer = val
        },
        // 上传子传父,修改answer,图片和视频
        uploadAnswer(val) {
            // this.input.answer = val
            // 保存时进行了赋值这里暂时没用
            console.log(val)
        },
        // 上传子传父,修改answer,文本
        handleChangeInputAnswer(val) {
            this.input.answer = val
        },
        deleteSimilarQuestion(index) {
            this.input.similarQuestionTail.splice(index, 1);
            this.validateSimilarQuestion();
        },
        deleteKeyWord(index) {
            this.input.keyWordTail.splice(index, 1);
            this.validateKeyWord();
        },
        showErrorNotification(title, errorCode, errorMsg) {
            if (errorCode != "-101") {
                this.$notification.open({
                    duration: (errorCode == 999) ? 0 : 4.5,
                    message: title,
                    description: "失败原因：" + errorMsg,
                    icon: (<jt-icon type="exclamation-circle" theme="filled" style="color:#F04134"/>)
                });
            } 
        },
        async similarQuestionEnter() {
            await this.addSimilarQuestion();
            this.validateSimilarQuestion();
        },
        addSimilarQuestion() {
            if (this.input.similarQuestionHead != "") {
                this.input.similarQuestionTail.unshift(this.input.similarQuestionHead);
                this.input.similarQuestionHead = "";
            }
            this.$nextTick(()=>{
                this.$refs.refSimilarQuestionHead.focus()
            });
        },
        async keyWordEnter() {
            await this.addKeyWord();
            this.validateKeyWord();
        },
        addKeyWord() {
            if (this.input.keyWordHead != "") {
                this.input.keyWordTail.unshift(this.input.keyWordHead);
                this.input.keyWordHead = "";
            }
            this.$nextTick(()=>{
                this.$refs.refKeyWordHead.focus()
            });
        },
        resortRecommendationQuestion(item, index, type) {
            if (type === 0) {
                this.input.recommendationQuestion.splice(index, 1);
                this.input.recommendationQuestion.splice(index + 1, 0, item);
            } else {
                this.input.recommendationQuestion.splice(index, 1);
                this.input.recommendationQuestion.splice(index - 1, 0, item);
            }
        },
        saveSubmit(action) {
            this.action = action;
            this.Deltype = false;
            this.hasChange(this.Deltype);
            if (this.$refs.editAnswer.fileList.length > 0 || this.$refs.editAnswer.fileListTwo.length > 0) {
                this.saveAnswer(this.action);
            }else if (this.input.answer != "") {
                this.saveAnswer(this.action);
            }
        },
        // 调用保存接口
        saveAnswer(action) {
            if(this.AnswerIsChange) {
                this.saveConfirm = true;
            }else {
                this.lastDel();
                this.changeQuestionDetail(this.input).then(res => {
                    if (res.errno === 0) {
                        this.isSave = true;
                        if (action === "next") {
                            this.reload();
                        } else {
                            this.$router.push({path: "/home/robotHome"});
                        }
                        this.$message.success("保存成功");
                    } else {
                        this.showErrorNotification("保存失败！", res.errno, res.errorMsg);
                    }
                })
            }
        },
        saveOk() {
            this.delFileDispose(this.Deltype);
            this.saveConfirm = false;
            this.AnswerIsChange = false;
            this.saveAnswer(this.action);
        },
        saveCancel() {
            this.saveConfirm = false;
        },
        hasChange(type) {
            const Flag = this.$refs.editAnswer.tabType;
            this.AnswerIsChange = false;
            if (Flag == 'text') {
                this.input.Flag = 0;
                this.input.answer = this.$refs.editAnswer.answer;
                if (this.$refs.editAnswer.vioAnswer != "") {
                    this.AnswerIsChange = true;
                }
                if (this.$refs.editAnswer.picAnswer != "") {
                    this.AnswerIsChange = true;
                }
            }else if(Flag == 'pic') {
                this.input.Flag = 1;
                if (this.$refs.editAnswer.fileList.length >0 && type == false) {
                    this.input.answer = this.$refs.editAnswer.picAnswer;
                }else {
                    this.input.answer = "";
                }
                if (this.$refs.editAnswer.vioAnswer != "" && type == false) {
                    this.AnswerIsChange = true;
                }
                if (this.$refs.editAnswer.vioAnswer != "" && type == true) {
                    this.AnswerIsChange = true;
                }
                if(this.$refs.editAnswer.answer) {
                    this.AnswerIsChange = true;
                }
            }else if(Flag == 'vio') {
                this.input.Flag = 2;
                if (this.$refs.editAnswer.vioAnswer != "" && type == false) {
                    this.input.answer = this.$refs.editAnswer.vioAnswer;
                }else {
                    this.input.answer = "";
                }
                if (this.$refs.editAnswer.picAnswer != "" && type == false) {
                    this.AnswerIsChange = true;
                }
                if (this.$refs.editAnswer.picAnswer != "" && type == true) {
                    this.AnswerIsChange = true;
                }
                if(this.$refs.editAnswer.answer) {
                    this.AnswerIsChange = true;
                }
            }
        },
        // 保存时处理要删除的垃圾文件
        // 删除视频和图片的项是在点击重新上传以及删除按钮时获取的,在保存时根据tab状态进行删除
        delFileDispose(type) {
            const Flag = this.$refs.editAnswer.tabType;
            if (Flag == 'text') {
                if (this.$refs.editAnswer.vioAnswer != "") {
                    const vioAnswerCut = this.$refs.editAnswer.vioAnswer.split("%")[0];
                    this.$refs.editAnswer.delList.push(vioAnswerCut);
                }
                if (this.$refs.editAnswer.picAnswer != "") {
                    const picAnswerCut = this.$refs.editAnswer.picAnswer.split("%")[0];
                    this.$refs.editAnswer.delList.push(picAnswerCut);
                }
            }else if(Flag == 'pic') {
                if (this.$refs.editAnswer.vioAnswer != "" && type == false) {
                    this.$refs.editAnswer.delList.push(this.$refs.editAnswer.vioAnswer.split("%")[0]);
                }
                if (this.$refs.editAnswer.vioAnswer != "" && type == true) {
                    this.$refs.editAnswer.delList.push(this.$refs.editAnswer.vioAnswer.split("%")[0]);
                }
            }else if(Flag == 'vio') {
                if (this.$refs.editAnswer.picAnswer != "" && type == false) {
                    this.$refs.editAnswer.delList.push(this.$refs.editAnswer.picAnswer.split("%")[0]);
                }
                if (this.$refs.editAnswer.picAnswer != "" && type == true) {
                    this.$refs.editAnswer.delList.push(this.$refs.editAnswer.picAnswer.split("%")[0]);
                }
            }
        },
        lastDel() {
            const Flag = this.$refs.editAnswer.tabType;
            if (Flag == 'text') {
                if(this.$refs.editAnswer.delList.length>0) {
                    this.delPicOrVio();
                }
            }else if(Flag == 'pic') {
                if(this.$refs.editAnswer.delList.length>0) {
                    this.delPicOrVio();
                }
            }else if(Flag == 'vio') {
                if(this.$refs.editAnswer.delList.length>0) {
                    this.delPicOrVio();
                }
            }
        },
        // 点击其他页面时删除未保存的上传文件
        routerdelImgOrVio() {
            this.Deltype = true;
            this.delFileDispose(this.Deltype);
            this.hasChange(this.Deltype);
            let delPicAnswer;
            let delVioAnswer;
            if (this.$refs.editAnswer.picAnswer != "") {
                if (this.$refs.editAnswer.delList.length != 0 && this.$refs.editAnswer.lastPicAnswer != '') {
                    delPicAnswer = this.$refs.editAnswer.lastPicAnswer.split("%")[0];
                }else {
                    delPicAnswer = "";
                }
                // const delPicAnswer = this.$refs.editAnswer.picAnswer.split("%")[0];
                this.delPicOrVioRouter(delPicAnswer);
            }
            if (this.$refs.editAnswer.vioAnswer != "") {
                // const delVioAnswer = this.$refs.editAnswer.vioAnswer.split("%")[0];
                if (this.$refs.editAnswer.delList.length != 0 && this.$refs.editAnswer.lastVioAnswer != '') {
                    delVioAnswer = this.$refs.editAnswer.lastVioAnswer.split("%")[0];
                }else {
                    delVioAnswer = "";
                }
                this.delPicOrVioRouter(delVioAnswer);
            }
        },
        // 保存时调用的删除接口
        delPicOrVio () {
            const delList = this.$refs.editAnswer.delList.join("");
            const answer = {
                answer: delList,
                userId: this.$store.state.userId,
                botId: this.$store.state.robotInfo.robotId
            }
            if (answer.answer != "") {
                this.delVio(answer).then(res => {
                    if (res.errno == 0) {
                        // this.picAnswer = "";
                    }else {
                        this.showErrorNotification('删除失败!',res.errno, res.errorMsg)
                    }
                })
            }
        },
        // 切换路由时调用的删除接口
        delPicOrVioRouter (del) {
            const newDel = [];
            newDel.push(del);
            const cutDel = [];
            if (this.$refs.editAnswer.delList.length > 1) {
                this.$refs.editAnswer.delList.forEach((item) => {
                    newDel.push(item)
                })
            }
            newDel.forEach(item2 => {
                if (item2 != this.answerId.split("%")[0]) {
                    cutDel.push(item2)
                }
            })
            const newDelStr = cutDel.join("");
            if (newDelStr.length) {
                const answer = {
                    answer: newDelStr,
                    userId: this.$store.state.userId,
                    botId: this.$store.state.robotInfo.robotId
                }
                if (answer.answer != "") {
                    this.delVio(answer).then(res => {
                        if (res.errno == 0) {
                            // this.picAnswer = "";
                        }else {
                            this.showErrorNotification('删除失败!',res.errno, res.errorMsg)
                        }
                    })
                }
            }
            
        },
        goLibraryList() {
            this.$router.push({path: '/home/robotHome'});
        },
        async showRecommendModal() {
            // console.log(this.$store.state.questionAnswer.questionList);
            // const list = this.$store.state.questionAnswer.questionList;
            // for(const item of list) {
            //     const obj = {
            //         "label": item.squestion,
            //         "value": item.id
            //     };
            //     this.recommendListLeft.push(obj);
            // }
            // init recommendModal data
            this.recommendationSearchKeyword = "";
            const res = await this.queryRecommendationQuestion(this.recommendationSearchKeyword);
            if (res.errno === 0) {
                this.recommendListLeft = res.result;
                this.recommendListLeftSelected = [];
                this.recommendListRight = this.input.recommendationQuestion.slice(0);
                this.recommendListRightSelected = [];
                // filter out existing questions in the search results
                for (let i = 0; i < this.recommendListRight.length; i++) {
                    for (let j = 0; j < this.recommendListLeft.length; j++) {
                        if (this.recommendListRight[i].value == this.recommendListLeft[j].value) {
                            this.recommendListLeft.splice(j, 1);
                            break;
                        }
                    }
                }
                // filter out own question in the search results (for update operation)
                for (let i = 0; i < this.recommendListLeft.length; i++) {
                    if (this.input.sqId == this.recommendListLeft[i].value) {
                        this.recommendListLeft.splice(i, 1);
                        break;
                    }
                }
            } else {
                this.showErrorNotification("查询失败！", res.errno, res.errorMsg);
            }
            this.recommendModalVisible = true;
        },
        // 新增start
        async showPrepositionModal() {
            // init recommendModal data
            this.recommendationSearchKeyword = "";
            const res = await this.queryRecommendationQuestion(this.recommendationSearchKeyword);
            if (res.errno === 0) {
                this.recommendListLeft = res.result;
                this.recommendListLeftSelected = [];
                this.recommendListRight = this.input.leadTheProblem.slice(0);
                this.recommendListRightSelected = [];
                // filter out existing questions in the search results
                for (let i = 0; i < this.recommendListRight.length; i++) {
                    for (let j = 0; j < this.recommendListLeft.length; j++) {
                        if (this.recommendListRight[i].value == this.recommendListLeft[j].value) {
                            this.recommendListLeft.splice(j, 1);
                            break;
                        }
                    }
                }
                // filter out own question in the search results (for update operation)
                for (let i = 0; i < this.recommendListLeft.length; i++) {
                    if (this.input.sqId == this.recommendListLeft[i].value) {
                        this.recommendListLeft.splice(i, 1);
                        break;
                    }
                }
            } else {
                this.showErrorNotification("查询失败！", res.errno, res.errorMsg);
            }
            this.prepositionModalVisible = true;
        },
        prepositionModalSubmit() {
            this.input.leadTheProblem = this.recommendListRight.slice(0);
            this.prepositionModalVisible = false;
        },
        resortLeadTheProblem(item, index, type) {
            if (type === 0) {
                this.input.leadTheProblem.splice(index, 1);
                this.input.leadTheProblem.splice(index + 1, 0, item);
            } else {
                this.input.leadTheProblem.splice(index, 1);
                this.input.leadTheProblem.splice(index - 1, 0, item);
            }
        },
        // 新增end
        searchRecommendationSubmit() {
            this.queryRecommendationQuestion(this.recommendationSearchKeyword).then(res => {
                if (res.errno === 0) {
                    this.recommendListLeft = res.result;
                    this.recommendListLeftSelected = [];
                    for (let i = 0; i < this.recommendListRight.length; i++) {
                        for (let j = 0; j < this.recommendListLeft.length; j++) {
                            if (this.recommendListRight[i].value == this.recommendListLeft[j].value) {
                                this.recommendListLeft.splice(j, 1);
                                break;
                            }
                        }
                    }
                } else {
                    this.showErrorNotification("查询失败！", res.errno, res.errorMsg);
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
        recommendModalSubmit() {
            this.input.recommendationQuestion = this.recommendListRight.slice(0);
            this.recommendModalVisible = false;
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
    }
};
</script>
