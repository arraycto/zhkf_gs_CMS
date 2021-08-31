<template>
    <div>
        <custom-component :opType = '2'></custom-component>
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