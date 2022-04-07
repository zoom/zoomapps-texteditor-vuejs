<template>
    <div class="hello">
        <h1>{{ msg }}</h1>
        <p>Start a meeting and open this app to use it</p>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'HelloZoom',
    props: {
        msg: String,
    },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
h3 {
    margin: 40px 0 0;
}

ul {
    list-style-type: none;
    padding: 0;
}

li {
    display: inline-block;
    margin: 0 10px;
}

a {
    color: $color-primary;
}
</style>
