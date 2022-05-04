<template>
    <button class="button is-white"  :class="{'is-active': props.isActive()}" @click="props.action">
        <span class="icon is-small">
            <i
                class="fas"
                :class="[iconClass]"
            ></i>
        </span>
        <span v-if="props.title">{{ props.title }}</span>
    </button>
</template>

<script setup lang="ts">
interface Props {
    title?: string;
    icon: string;
    action: () => void;
    isLast?: boolean;
    isActive: () => boolean;
}

const props = defineProps<Props>();

const iconClass = `fa-${props.icon.toLowerCase()}`;
</script>

<style scoped></style>
