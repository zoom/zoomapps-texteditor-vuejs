<template>
    <div class="editor" v-if="editor">
        <div class="editor__header pb-4 pt-0">
            <menu-bar :editor="editor" />
        </div>
        <div class="editor__content content pb-2 pt-4">
            <editor-content :editor="editor" />
        </div>
    </div>
</template>

<script setup lang="ts">
import * as Y from 'yjs';
import { WebrtcProvider } from 'y-webrtc';

import { onBeforeUnmount, watch } from 'vue';
import { EditorContent, useEditor } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import Collaboration from '@tiptap/extension-collaboration';
import CollaborationCursor from '@tiptap/extension-collaboration-cursor';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Highlight from '@tiptap/extension-highlight';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';

import MenuBar from './MenuBar';

interface Props {
    content: string;
    meeting: string;
    screenName: string;
}

const props = defineProps<Props>();
const emit = defineEmits(['updated']);

const colors = [
    '#958DF1',
    '#FD8181',
    '#FBBC88',
    '#FAF594',
    '#70CFF8',
    '#B9F18D',
    '#FFA24F',
    '#F788B0',
];

// A new Y document
const ydoc = new Y.Doc();

// Registered with a WebRTC provider
const provider = new WebrtcProvider(props.meeting, ydoc, {
    signaling: [`wss://${window.location.host}`],
});

const editor = useEditor({
    content: props.content,
    extensions: [
        StarterKit.configure({
            history: false,
        }),
        Highlight,
        TaskList,
        TaskItem,
        Underline,
        Collaboration.configure({
            document: ydoc,
        }),
        CollaborationCursor.configure({
            provider,
            user: {
                name: props.screenName,
                color: colors[Math.floor(Math.random() * colors.length)],
            },
        }),
        TextAlign.configure({
            types: ['heading', 'paragraph'],
        }),
    ],
    onUpdate: () => emit('updated', editor.value?.getHTML()),
});

editor.value?.chain().focus().setTextAlign('left').run();

onBeforeUnmount(() => {
    editor.value?.destroy();
    provider.destroy();
});

watch(
    () => props.content,
    (v) => {
        // HTML
        const isSame = editor.value?.getHTML() === v;

        if (isSame) return;

        editor.value?.commands.setContent(v, false);
    }
);
</script>

<style lang="scss">
$min-height: 50vh;
$max-height: 85vh;

.editor {
    min-height: $min-height;
    max-height: $max-height;
    background-color: #fff;
    //border: 2px solid #b5b5b5;

    &__header {
        border-bottom: 1px solid #e5e5e5;
    }

    &__content {
        overflow-x: hidden;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
    }
}

/* Give a remote user a caret */
.collaboration-cursor__caret {
    position: relative;
    margin-left: -1px;
    margin-right: -1px;
    border-left: 1px solid #0d0d0d;
    border-right: 1px solid #0d0d0d;
    word-break: normal;
    pointer-events: none;
}

/* Render the username above the caret */
.collaboration-cursor__label {
    position: absolute;
    top: -1.4em;
    left: -1px;
    font-size: 12px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
    user-select: none;
    color: black;
    padding: 0.1rem 0.3rem;
    border-radius: 3px 3px 3px 0;
    white-space: nowrap;
}

/* Basic Editor styles */
.ProseMirror {
    min-height: $min-height;
    max-height: $max-height;
    text-align: left;

    &-focused {
        outline: none;
    }

    > * + * {
        margin-top: 0.75em;
    }

    ul,
    ol {
        padding: 0 1rem;
    }

    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
        line-height: 1.1;
    }

    code {
        background-color: rgba(#616161, 0.1);
        color: #616161;
    }

    pre {
        background: #0d0d0d;
        color: #fff;
        font-family: 'JetBrainsMono', monospace;
        padding: 0.75rem 1rem;
        border-radius: 0.5rem;

        code {
            color: inherit;
            padding: 0;
            background: none;
            font-size: 0.8rem;
        }
    }

    mark {
        background-color: #faf594;
    }

    img {
        max-width: 100%;
        height: auto;
    }

    hr {
        margin: 1rem 0;
    }

    blockquote {
        padding-left: 1rem;
        border-left: 2px solid rgba(#0d0d0d, 0.1);
    }

    hr {
        border: none;
        border-top: 2px solid rgba(#0d0d0d, 0.1);
        margin: 2rem 0;
    }

    ul[data-type='taskList'] {
        list-style: none;
        padding: 0;

        li {
            display: flex;
            align-items: center;

            > label {
                flex: 0 0 auto;
                margin-right: 0.5rem;
                user-select: none;
            }

            > div {
                flex: 1 1 auto;
            }
        }
    }
}
</style>
