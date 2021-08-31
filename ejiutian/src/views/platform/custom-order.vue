<template>
    <div>
        <custom-component :opType = '0'></custom-component>
    </div>
</template>
<script>
import CustomComponent from './custom-component.vue'
export default {
    components:{
        'custom-component': CustomComponent
    },
}
</script>