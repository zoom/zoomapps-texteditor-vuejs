<template>
    <div v-if="isInClient">
        <h1>Start a meeting to use this app</h1>
    </div>
    <editor
        v-else
        :content="content"
        :screenName="store.state.user.screenName"
        :meeting="store.state.meetingUUID"
    />
</template>

<script setup lang="ts">
import Editor from '@/components/Editor';
import { useStore } from 'vuex';
import { computed, inject, watch } from 'vue';
import { ZoomSDK } from './types';

const zoomSdk = inject('zoomSdk') as ZoomSDK;
const store = useStore();

const content = computed(() => store.state.content);
const conf = await zoomSdk.config({
    capabilities: [
        'connect',
        'getMeetingUUID',
        'getRunningContext',
        'getUserContext',
        'onConnect',
        'onMeeting',
        'onMessage',
        'onParticipantChange',
        'postMessage',
    ],
});
console.debug('Configuration', conf);

store.commit('setContext', conf.runningContext);

const isInClient = conf.runningContext === 'inMainClient';

if (isInClient) {
    await zoomSdk.connect();
    const user = await zoomSdk.getUserContext();
    store.commit('setUser', user);

    const { meetingUUID } = await zoomSdk.getMeetingUUID();
    store.commit('setMeetingUUID', meetingUUID);
}


</script>
