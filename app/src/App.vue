<template>
    <section class='section pt-5'>
        <div class='container is-fluid'>
            <Suspense>
                <router-view />
            </Suspense>
        </div>
    </section>
</template>

<style lang='scss'>
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
}
</style>
