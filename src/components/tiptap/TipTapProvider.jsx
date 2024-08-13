import Underline from '@tiptap/extension-underline';
import { EditorProvider } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Mention from '@tiptap/extension-mention';

import './tiptap-styles.css';

const extensions = [StarterKit, Underline, Mention.configure({ HTMLAttributes: { class: 'mention' } })];

export function TipTapProvider({ content }) {
  return <EditorProvider extensions={extensions} content={content}></EditorProvider>;
}
