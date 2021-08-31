import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import echarts from "echarts";
import "./utils/directives.js";
import { refreshToken, getTokenSub } from "./utils/http.js";
import Keycloak from "keycloak-js";

Vue.config.productionTip = false;

router.beforeEach((to, from, next) => {
    if (to?.meta?.title) {
        document.title = to.meta.title;
    } else {
        document.title = "智能交互平台";
    }
    next();
});

import {
    Button,
    Input,
    Radio,
    notification,
    message,
    Row,
    Col,
    Tooltip,
    Dropdown,
    Menu,
    Table,
    Drawer,
    Form,
    FormModel,
    Switch,
    Icon,
    Pagination,
    Divider,
    Select,
    DatePicker,
    Modal,
    Slider,
    InputNumber,
    Transfer,
    Progress,
    Checkbox,
    Tree,
    Empty
} from "ant-design-vue";
import { FormModelItem } from "ant-design-vue/types/form-model/form-item";
import Loading from "@/components/Loading.vue";

Vue.component("jt-button", Button);
Vue.component("jt-input", Input);
Vue.component("jt-radio", Radio);
Vue.component("jt-radio-group", Radio.Group);
Vue.component("jt-radio-button", Radio.Button);
Vue.component("jt-input-search", Input.Search);
Vue.component("jt-input-group", Input.Group);
Vue.component("jt-input-textarea", Input.TextArea);
Vue.component("jt-row", Row);
Vue.component("jt-col", Col);
Vue.component("jt-tooltip", Tooltip);
Vue.component("jt-drawer", Drawer);
Vue.component("jt-switch", Switch);
Vue.component("jt-dropdown", Dropdown);
Vue.component("jt-menu", Menu);
Vue.component("jt-sub-menu", Menu.SubMenu);
Vue.component("jt-menu-item", Menu.Item);
Vue.component("jt-table", Table);
Vue.component("jt-form", Form);
Vue.component("jt-form-item", Form.Item);
Vue.component("jt-form-model", FormModel);
Vue.component("jt-form-model-item", FormModel.Item);
Vue.component("jt-icon", Icon);
Vue.component("jt-pagination", Pagination);
Vue.component("jt-divider", Divider);
Vue.component("jt-select", Select);
Vue.component("jt-select-option", Select.Option);
Vue.component("jt-range-picker", DatePicker.RangePicker);
Vue.component("jt-modal", Modal);
Vue.component("jt-slider", Slider);
Vue.component("jt-input-number", InputNumber);
Vue.component("jt-transfer", Transfer);
Vue.component("jt-progress", Progress);
Vue.component("jt-button-group", Button.Group);
Vue.component("jt-loading", Loading);
Vue.component("jt-checkbox", Checkbox);
Vue.component("jt-checkbox-group", Checkbox.Group);
Vue.component("jt-tree", Tree);
Vue.component("jt-empty", Empty);

Vue.prototype.$notification = notification;
Vue.prototype.$message = message;
Vue.prototype.$echarts = echarts;
Vue.prototype.$notification.config({
    top: "80px"
});
Vue.prototype.$message.config({
    top: "80px",
    duration: 3
});

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')