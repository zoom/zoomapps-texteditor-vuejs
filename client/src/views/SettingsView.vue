<template>
    <nav class='level is-mobile'>
        <div class='level-left'>
            <p class='level-item has-text-centered'>
                <button @click='goHome' class='button is-outlined'>
                    <span class='icon is-small'>
                        <i class='fas fa-arrow-left'></i>
                    </span>
                    <span>Back</span>
                </button>
            </p>
        </div>
        <div class='level-item'>
            <h1 class='heading is-size-4'>Settings</h1>
        </div>
    </nav>

    <div class='section mt-6'>
        <div class='container mt-6'>
            <div class='columns is-centered'>
                <div class='column is-half'>
                    <button
                        @click='startClicked'
                        class='button is-fullwidth'
                        :class='startColor'
                    >
                        <span>{{ startTxt }}</span>
                    </button>
                </div>
                <div class='column is-half'>
                    <button
                        @click='joinClicked'
                        class='button is-fullwidth'
                        :class='joinColor'
                    >
                        <span>{{ joinTxt }}</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang='ts'>
import zoomSdk from '@zoom/appssdk';
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

const store = useStore();
const router = useRouter();

const isHost = computed(() => store.state.user.role === 'host');

const startTxt = computed(() => `${store.state.isCollaborating ? 'End' : 'Start'} Collaboration`);
const joinTxt = computed(() =>  `${store.state.isCollaborating ? 'Leave' : 'Join'} Collaboration`);

const startColor = computed(() => store.state.isCollaborating ? 'is-danger' : 'is-success' );
const joinColor = computed(() => store.state.isCollaborating ? 'is-warning' : 'is-info' );

const startClicked = () => store.state.isCollaborating ? end() : start();
const joinClicked = () => store.state.isCollaborating ? leave() : join();

const setCollab = (isCollab: boolean) => store.commit('setCollaborating', isCollab);

const goHome = () => router.push({ name: 'home' });

const start = async () => {
    await zoomSdk.startCollaborate({});
    setCollab(true)
};

const end = async () => {
    await zoomSdk.endCollaborate();
    setCollab(false)
};

const join = async () => {
    await zoomSdk.joinCollaborate();
    setCollab(true)
};

const leave = async () => {
    await zoomSdk.leaveCollaborate();
    setCollab(false)
};
</script>
