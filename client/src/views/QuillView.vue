<template>
  <main v-if="meetingId">
    <ul class="users-list">
      <li v-for="(user) in users"
        :key="user.id"
        :title="user.name"
        :style="{ 'background-color': user.color, color: '#fff'
        }"
      >
        <span class="user-initials">{{ user.initials }}</span>
      </li>
    </ul>

    <quill-editor
      v-model:value="state.content"
      :options="state.editorOption"
      :disabled="state.disabled"
      @blur="onEditorBlur($event)"
      @focus="onEditorFocus($event)"
      @ready="onEditorReady($event)"
      @change="onEditorChange($event)"
    />

    <details>
      <summary>Debug</summary>

      <div>users {{ users }}</div>
      <div>meetingId: {{meetingId}}</div>
    </details>
  </main>

  <div v-else>
    Click "Start Meeting" to get startd!
  </div>
</template>


<style>
  .ql-cursors {
    position: absolute;
    top: 0;
    left: 0;
  }

  /*.ql-editor strong {
    font-weight: 700
  }
  */
  .ql-container {
    font-size: 1em;
  }

  .users-list {
    list-style: none;
    margin: 1em 0;
    padding: 0;
    display: flex;
    justify-content: end;

    --icon-scale: 1.8em;
  }

  .users-list li {
    border-radius: 100%;
    border: 3px solid white;
    display: inline-block;
    font-size: var(--icon-scale);
    height: var(--icon-scale);
    line-height: var(--icon-scale);
    margin-left: calc(var(--icon-scale) * -0.33);
    position: relative;
    text-align: center;
    width: var(--icon-scale);
  }

  .users-list .user-initials {
    left: 50%;
    position: absolute;
    top: 50%;
    transform: translate(-50%, -50%);
  }
</style>


<script setup>

// TODO:
// [ ] Update README.md
// [ ] EditorView.vue onUnmount destroy/disconnect current editor session
// [ ] add "missing" users placeholder
// [ ] update homepage page with README overview (import README.md?)
// [ ] add editor for canvas syncing
// import 'quill/dist/quill.core.css'
// import 'quill/dist/quill.snow.css'
// import 'quill/dist/quill.bubble.css'
// import { QuillEditor, Quill } from 'vue3-quill-editor-vite'
// import 'vue3-quill-editor-vite/dist/style.css'

import * as Y from 'yjs'
import QuillCursors from 'quill-cursors'
import QuillEditor, { Quill } from 'vue3-quill-editor-vite'
import zoomSdk from '@zoom/appssdk';
import { QuillBinding } from 'y-quill'
import { onMounted, onUnmounted, ref, computed, reactive } from 'vue'
import { WebrtcProvider } from 'y-webrtc'
import { WebsocketProvider } from 'y-websocket'
import { useRoute } from 'vue-router'
import 'vue3-quill-editor-vite/dist/style.css'

import { useMeetingStore } from '@/stores/meeting.js'


Quill.register('modules/cursors', QuillCursors)

const colors = [
  '#09f',
  '#0f9',
  '#90f',
  '#9f0',
  '#f09',
  '#f90',
]

const route = useRoute()
const store = useMeetingStore()

const state = reactive({
  content: '<p>2333</p>',
  _content: '',
  editorOption: {
    placeholder: 'core',
    modules: {
      cursors: true,
      // toolbars: [
        // custom toolbars options
        // will override the default configuration
      // ],
      // other moudle options here
      // otherMoudle: {}
      history: {
        userOnly: true,
      },
    },
    // more options
  },
  disabled: false
})


const users = ref([])

const user = reactive({})

const meetingId = ref('')

let SocketProvider = null


function initials(str) {
  return str.split(' ').slice(0,2).map(el => el.substr(0,1).toUpperCase()).join('')
}

function getUsername() {
    // Random username 10 chars
    // return DOUsername.generate(10);
    return Math.floor(Math.random() * 1000000)
}

function getCursorColor() {
    // random color for cursors
    const red = Math.floor(Math.random() * 255) + 1;
    const green = Math.floor(Math.random() * 255) + 1;
    const blue = Math.floor(Math.random() * 255) + 1;
    const alpha = Math.floor(Math.random() * 5) / 10 + 0.5;
    return "rgba(" + red + "," + green + "," + blue + "," + alpha + ")";
    const usercolor = Math.floor(Math.random() * colors.length)
    return colors[usercolor]
}


const onEditorReady = (quill) => {
  const ydoc = new Y.Doc()

  const ytext = ydoc.getText('quill')

  const roomName = meetingId.value

  SocketProvider = new WebrtcProvider(roomName, ydoc, {
    signaling: [
      'wss://signaling.yjs.dev',
      'wss://y-webrtc-signaling-eu.herokuapp.com',
      'wss://y-webrtc-signaling-us.herokuapp.com',
    ],

    // // Maximal number of WebRTC connections.
    // maxConns: 20 + Math.floor(Math.random() * 15),

    // // Disable WebRTC connections to other tabs in the same browser.
    // filterBcConns: true,

    // // docs: https://github.com/feross/simple-peer#peer--new-peeropts
    // peerOpts: {}
  })

  console.log({SocketProvider})

  SocketProvider.awareness.setLocalStateField('user', {
    name: user.name.toString(),
    color: getCursorColor(), // should be a hex color
  })

  // listen for changes to user states to update the users list
  SocketProvider.awareness.on('change', () => {
    users.value = []
    SocketProvider.awareness.getStates().forEach((state, index) => {
      if (state.user) {
        state.user.initials = initials(state.user.name)
        state.user.id = index
        users.value.push(state.user)
      }
    })
  })

  console.log('wfaefsesjl')

  const binding = new QuillBinding(ytext, quill, SocketProvider.awareness)
}


const onEditorBlur = (quill) => {
  console.log('editor blur!', quill)
}

const onEditorFocus = (quill) => {
  console.log('editor focus!', quill)
}

const onEditorChange = ({ quill, html, text }) => {
  console.log('editor change!', quill, html, text)
  state._content = html
}


onMounted(async () => {

  if (route.params.meetingId) {
    meetingId.value = route.params.meetingId

    user.name = Math.floor(Math.random() * 100000)
    user.id = Math.floor(Math.random() * 100000)

    return
  } else {

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
            'onCollaborateChange',
            'postMessage',
        ],
    });


    await zoomSdk.connect();

    let res = null

    res = await zoomSdk.getUserContext();
    // store.commit('setUser', user);
    user.name = res.screenName
    user.id = res.participantId

    res = await zoomSdk.getMeetingUUID();

    console.log({res, user})

    meetingId.value = (res.meetingUUID || 'waffles').replace(/[^\d\w]/gi, '')

  }

})


onUnmounted(() => {

  // ensure we destroy the socketProvider instance
  if (SocketProvider) {
    SocketProvider.destroy()
  }
})

// setTimeout(() => {
//   state.disabled = true
// }, 2000)

</script>
