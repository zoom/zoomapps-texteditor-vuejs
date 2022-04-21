<template>
    <nav class="level">
        <div class="level-item ml-3">
            <div class="buttons has-addons">
                <menu-item v-bind="undo" />
                <menu-item v-bind="redo" />
            </div>
        </div>
        <div class="level-item ml-6">
            <div class="buttons">
                <template v-for="(v, i) in items" :key="i">
                    <menu-item v-bind="v" />
                    <div class="is-divider-vertical" v-if="v.isLast" />
                </template>
            </div>
        </div>
    </nav>
</template>

<script setup lang="ts">
import { Editor } from '@tiptap/vue-3';
import MenuItem from './MenuItem.vue';

interface Props {
    editor: Editor;
}

const props = defineProps<Props>();

const undo = {
    icon: 'undo',
    action: () => props.editor.chain().focus().undo().run(),
    isActive: () => false,
};
const redo = {
    icon: 'redo',
    action: () => props.editor.chain().focus().redo().run(),
    isActive: () => false,
};

const items = [
    {
        icon: 'bold',
        action: () => props.editor.chain().focus().toggleBold().run(),
        isActive: () => props.editor.isActive('bold'),
    },
    {
        icon: 'italic',
        action: () => props.editor.chain().focus().toggleItalic().run(),
        isActive: () => props.editor.isActive('italic'),
    },
    {
        icon: 'strikethrough',
        action: () => props.editor.chain().focus().toggleStrike().run(),
        isActive: () => props.editor.isActive('strike'),
    },
    {
        icon: 'terminal',
        action: () => props.editor.chain().focus().toggleCode().run(),
        isActive: () => props.editor.isActive('code'),
    },
    {
        icon: 'highlighter',
        action: () => props.editor.chain().focus().toggleHighlight().run(),
        isActive: () => props.editor.isActive('highlight'),
        isLast: true,
    },
    {
        icon: 'list-ul',
        action: () => props.editor.chain().focus().toggleBulletList().run(),
        isActive: () => props.editor.isActive('bulletList'),
    },
    {
        icon: 'list-ol',
        action: () => props.editor.chain().focus().toggleOrderedList().run(),
        isActive: () => props.editor.isActive('orderedList'),
    },
    {
        icon: 'list-check',
        action: () => props.editor.chain().focus().toggleTaskList().run(),
        isActive: () => props.editor.isActive('taskList'),
    },
    {
        icon: 'code',
        title: 'Code Block',
        action: () => props.editor.chain().focus().toggleCodeBlock().run(),
        isActive: () => props.editor.isActive('codeBlock'),
        isLast: true,
    },
    {
        icon: 'quote-left',
        title: 'Blockquote',
        action: () => props.editor.chain().focus().toggleBlockquote().run(),
        isActive: () => props.editor.isActive('blockquote'),
    },
    {
        icon: 'ruler-horizontal',
        title: 'Horizontal Rule',
        action: () => props.editor.chain().focus().setHorizontalRule().run(),
        isActive: () => false,
        isLast: true,
    },
    {
        icon: 'text-slash',
        title: 'Clear Format',
        action: () =>
            props.editor.chain().focus().clearNodes().unsetAllMarks().run(),
        isActive: () => false,
        isLast: true,
    },
];
</script>
