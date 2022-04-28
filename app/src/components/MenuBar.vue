<template>
    <div class='buttons'>
        <menu-item v-for='(item, i) in items' v-bind='item' :key='i' />
    </div>
</template>

<script setup lang='ts'>
import { Editor } from '@tiptap/vue-3';
import MenuItem from './MenuItem.vue';

interface Props {
    editor: Editor;
}

const props = defineProps<Props>();

const items = [
    {
        icon: 'bold',
        action: () => props.editor.chain().focus().toggleBold().run(),
        isActive: () => true,
    },
    {
        icon: 'italic',
        action: () => props.editor.chain().focus().toggleItalic().run(),
        isActive: () => props.editor.isActive('italic'),
    },
    {
        icon: 'underline',
        action: () => props.editor.chain().focus().toggle.run(),
        isActive: () => props.editor.isActive('underline'),
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
        icon: 'align-left',
        action: () => props.editor.chain().focus().setTextAlign('left').run(),
        isActive: () => props.editor.isActive({ textAlign: 'left' }),
    },
    {
        icon: 'align-center',
        action: () => props.editor.chain().focus().setTextAlign('center').run(),
        isActive: () => props.editor.isActive({ textAlign: 'center' }),
    },
    {
        icon: 'align-right',
        action: () => props.editor.chain().focus().setTextAlign('right').run(),
        isActive: () => props.editor.isActive({ textAlign: 'right' }),
    },
];
</script>
