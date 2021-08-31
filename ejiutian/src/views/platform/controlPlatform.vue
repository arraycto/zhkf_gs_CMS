<template>
    <section class="content1">
        <div class="breadcrumb" v-show="getPath() == 0">
            <Breadcrumb>
                <breadcrumb-item>
                    <span class="username">您好，{{ userinfo.username }}</span>
                </breadcrumb-item>
            </Breadcrumb>
        </div>
        <div class="breadcrumb" v-show="getPath() == 1">
            <Breadcrumb>
                <breadcrumb-item>
                    <router-link to="/home/controlPlatform">控制台</router-link>
                </breadcrumb-item>
                <breadcrumb-item>
                    <span>{{ itemName }}</span>
                </breadcrumb-item>
            </Breadcrumb>
        </div>
        <article>
            <jt-loading v-if="loading"></jt-loading>
            <router-view></router-view>
        </article>
    </section>
</template>
<script>
import { Breadcrumb } from "ant-design-vue";
import { mapState } from "vuex";
export default {
    name: "plat-form",
    components: {
        Breadcrumb,
        "breadcrumb-item": Breadcrumb.Item
    },
    data: () => ({
        pageIdx: 1,
        itemName: "测试环境使用详情"
    }),
    computed: {
        ...mapState(["loading", "userinfo"])
    },
    methods: {
        getPath() {
            const path = this.$route.path;
            const urlList = path.split("/");
            const suffix = urlList[urlList.length - 1];

            if ("platform-index" == suffix) {
                this.pageIdx = 0;
            } else if ("test-env-detail" == suffix) {
                this.pageIdx = 1;
                this.itemName = "测试环境使用详情";
            } else if ("production-env-detail" == suffix) {
                this.pageIdx = 1;
                this.itemName = "生产环境使用详情";
            } else {
                this.pageIdx = 0;
            }

            return this.pageIdx;
        }
    },
    created() {
        this.$store.dispatch("fetchUsers");
    }
};
</script>
<style lang="less" scoped>
@import "~@/assets/style/var.less";
.content1 {
    //padding-bottom: 20px;
    position: absolute;
    left: 0px;
    top: 0px;
    bottom: 0px;
    right: 0px;
    .username {
        font-size: 18px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: rgba(3, 17, 41, 1);
    }
    article {
        background-color: rgba(239, 241, 244, 1);
        border: 1px solid #eff1f4;
        padding: 20px 20px 40px 20px;
        border-radius: 2px;

        position: absolute;
        left: 0px;
        top: 58px;
        bottom: 0px;
        right: 0px;
        overflow-y: auto;
    }
    .mt20 {
        margin-top: 20px;
    }
    .breadcrumb {
        height: 58px;
        line-height: 58px;
        background: @jt-color-white;
        padding: 19px;
        border-left: 1px solid #e9ebef;
        border-bottom: 1px solid #e9ebef;

        position: absolute;
        left: 0px;
        top: 0px;
        bottom: 0px;
        right: 0px;
    }
}
</style>
