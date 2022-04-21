<template>
    <div class="editor" v-if="editor">
        <div class="editor__header">
            <menu-bar :editor="editor" />
        </div>
        <div class="editor__content">
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

import MenuBar from './MenuBar';

const ydoc = new Y.Doc();

const provider = new WebrtcProvider('example-document', ydoc);

interface Props {
    content: string;
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

const editor = useEditor({
    content: props.content,
    extensions: [
        StarterKit.configure({
            history: false,
        }),
        Highlight,
        TaskList,
        TaskItem,
        Collaboration.configure({
            document: provider.doc,
        }),
        CollaborationCursor.configure({
            provider,
            user: {
                name: 'Test User',
                color: colors[Math.floor(Math.random() * colors.length)],
            },
        }),
        TextAlign.configure({
            types: ['heading', 'paragraph'],
            defaultAlignment: 'left',
        }),
    ],
    onUpdate: () => emit('updated', editor.value?.getHTML()),
});

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
    display: flex;
    flex-direction: column;
    min-height: $min-height;
    max-height: $max-height;
    color: #0d0d0d;
    background-color: #fff;
    border: 3px solid #0d0d0d;
    border-radius: 0.75rem;

    &__header {
        display: flex;
        align-items: center;
        flex: 0 0 auto;
        flex-wrap: wrap;
        padding: 0.25rem;
        border-bottom: 3px solid #0d0d0d;
    }

    &__content {
        padding: 0.75rem 1rem;
        flex: 1 1 auto;
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
    color: #0d0d0d;
    padding: 0.1rem 0.3rem;
    border-radius: 3px 3px 3px 0;
    white-space: nowrap;
}

/* Basic Editor styles */
.ProseMirror {
    min-height: $min-height;
    max-height: $max-height;
    text-align: left;

    > * + * {
        margin-top: 0.75em;
    }

    ul,
    ol {
        padding: 0 1rem;
        > li {
            color: red;
        }
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
