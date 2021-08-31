new Vue({
    el: "#mainDiv",
    data: {
        kUser: "",
        kPassword: "",
        showPassword: false,
        rememberChecked: false,
    },
    created() {},
    mounted() {
        this.initPage();
    },
    methods: {
        initPage() {
            if (localStorage.getItem("rememberChecked") == "1") {
                this.kUser = localStorage.getItem("kUser");
                this.kPassword = localStorage.getItem("kPassword");
                this.rememberChecked = true;
            } else {
                this.kUser = "";
                this.kPassword = "";
                this.rememberChecked = false;
            }
        },
        rememberUser() {
            if (this.rememberChecked) {
                localStorage.setItem("kUser", this.kUser);
                localStorage.setItem("kPassword", this.kPassword);
                localStorage.setItem("rememberChecked", "1");
            } else {
                localStorage.setItem("kUser", "");
                localStorage.setItem("kPassword", "");
                localStorage.setItem("rememberChecked", "0");
            }
        },
    },
});
