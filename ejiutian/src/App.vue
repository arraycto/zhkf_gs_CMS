<template>
    <ConfigProvider :locale="zh_CN">
        <div id="app">
            <router-view />
        </div>
    </ConfigProvider>
</template>

<script>
import { ConfigProvider } from "ant-design-vue";
import zh_CN from "ant-design-vue/lib/locale-provider/zh_CN";
import moment from "moment";
import "moment/locale/zh-cn";

moment.locale("zh-cn");
export default {
    components: {
        ConfigProvider,
    },
    data() {
        return {
            zh_CN,
        };
    },
};
</script>

<style lang="less">
@import "./assets/font/iconfont.css";
@import "~ant-design-vue/dist/antd.less"; // 引入官方提供的 less 样式入口文件
@import "./assets/style/theme.less"; // 用于覆盖上面定义的变量
@import "./assets/style/global.less";
</style>
<style lang="less" scoped>
@import "~@/assets/style/var.less";
#app {
    color: @jt-color-text;
}
</style>
