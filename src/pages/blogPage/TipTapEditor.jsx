import React, { useEffect } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import "./TiptapEditor.css"

function TiptapEditor({ value, onChange }) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            Placeholder.configure({
                placeholder: 'Main description',
            }),
        ],
        content: value,
        autofocus: false, // ✅ prevents default focus
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
    });

    useEffect(() => {
        if (editor && value !== editor.getHTML()) {
            editor.commands.setContent(value);
        }
    }, [value]);

    if (!editor) return null;

    return (
        <div className="border border-[#E8E8E8] rounded-lg bg-white p-4 min-h-[150px]">
            <EditorContent editor={editor} />
        </div>
    );
}

export default TiptapEditor;
