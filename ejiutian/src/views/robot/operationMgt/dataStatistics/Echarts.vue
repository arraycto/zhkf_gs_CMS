/* eslint-disable */

<template>
    <div class="a">
        <a-tabs defaultActiveKey="1" >
            <a-tab-pane tab="知识数据" key="1">
                <article><Knowledge /></article>
                <!-- <article><Knowledgenodata /></article> -->
            </a-tab-pane>
            <a-tab-pane tab="用户数据" key="2">
                <article><User /></article> 
                <!-- <article><Usernodata /></article> -->
            </a-tab-pane>
        </a-tabs>
    </div>
</template>
<script>
import Vue from 'vue'; 
import {Tabs} from 'ant-design-vue';
import Knowledge from './Knowledge.vue'
// import Knowledgenodata from './Knowledgenodata.vue'
import User from './User.vue'
// import Usernodata from './Usernodata.vue'
Vue.use(Tabs) 
export default {
    name: 'Echarts',
    components: {
        "a-tabs": Tabs,
        Knowledge,
        // Knowledgenodata,
        User, 
        // Usernodata
    },
}
</script>
<style>
.a {
    width:100%;
    height: 52px;
    /* background: #ffffff; */
    /* padding: 0px 0px 0px 0px;
    margin-left: 0px;
    margin-right: 0px;
    margin-top: 0px;
    margin-bottom: 0px; 
    width:1136px; */
}
.a .ant-tabs-bar {
    margin: 0 0 16px 0;
    border-bottom: 0px solid #e8e8e8;
    outline: none;
    transition: padding 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
}
</style>