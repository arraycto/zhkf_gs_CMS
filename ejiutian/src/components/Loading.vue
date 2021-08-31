<template>
    <div class="loading">
        <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            width="48px"
            height="60px"
            viewBox="0 0 24 30"
            style="enable-background:new 0 0 50 50"
            xml:space="preserve"
        >
            <rect x="0" y="7.6416" width="4" height="14.7168" fill="#337DFF" opacity="0.2">
                <animate
                    attributeName="opacity"
                    attributeType="XML"
                    values="0.2; 1; .2"
                    begin="0s"
                    dur="0.6s"
                    repeatCount="indefinite"
                />
                <animate
                    attributeName="height"
                    attributeType="XML"
                    values="10; 20; 10"
                    begin="0s"
                    dur="0.6s"
                    repeatCount="indefinite"
                />
                <animate
                    attributeName="y"
                    attributeType="XML"
                    values="10; 5; 10"
                    begin="0s"
                    dur="0.6s"
                    repeatCount="indefinite"
                />
            </rect>
            <rect x="8" y="5.1416" width="4" height="19.7168" fill="#337DFF" opacity="0.2">
                <animate
                    attributeName="opacity"
                    attributeType="XML"
                    values="0.2; 1; .2"
                    begin="0.15s"
                    dur="0.6s"
                    repeatCount="indefinite"
                />
                <animate
                    attributeName="height"
                    attributeType="XML"
                    values="10; 20; 10"
                    begin="0.15s"
                    dur="0.6s"
                    repeatCount="indefinite"
                />
                <animate
                    attributeName="y"
                    attributeType="XML"
                    values="10; 5; 10"
                    begin="0.15s"
                    dur="0.6s"
                    repeatCount="indefinite"
                />
            </rect>
            <rect x="16" y="7.3584" width="4" height="15.2832" fill="#337DFF" opacity="0.2">
                <animate
                    attributeName="opacity"
                    attributeType="XML"
                    values="0.2; 1; .2"
                    begin="0.3s"
                    dur="0.6s"
                    repeatCount="indefinite"
                />
                <animate
                    attributeName="height"
                    attributeType="XML"
                    values="10; 20; 10"
                    begin="0.3s"
                    dur="0.6s"
                    repeatCount="indefinite"
                />
                <animate
                    attributeName="y"
                    attributeType="XML"
                    values="10; 5; 10"
                    begin="0.3s"
                    dur="0.6s"
                    repeatCount="indefinite"
                />
            </rect>
        </svg>
    </div>
</template>

<script>
export default {
    name: "loading",
    data() {
        return {};
    },
    methods:{
    }
};
</script>

<style>
.loading {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 99;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>