import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// import './assets/base.css'
// import './assets/main.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)


// import QuillEditor from 'vue3-quill-editor-vite'
// import 'vue3-quill-editor-vite/dist/style.css'

// // console.log({VueQuill})

// app.use(QuillEditor)

app.mount('#app')
