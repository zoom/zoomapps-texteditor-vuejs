import { createStore } from 'vuex';

export default createStore({
    state: {
        content: '',
        user: {
            id: 0,
            screenName: '',
            role: '',
        },
        context: '',
        meetingUUID: '',
    },
    getters: {},
    mutations: {
        setContext(state, context) {
            state.context = context;
        },
        setContent(state, content) {
            state.content = content;
        },
        setUser(state, user) {
            state.user = user;
        },
        setMeetingUUID(state, uuid) {
            state.meetingUUID = uuid;
        },
    },
    actions: {},
    modules: {},
});
