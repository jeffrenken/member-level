import Underline from '@tiptap/extension-underline';
import { EditorProvider } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import './tiptap-styles.css';

const extensions = [StarterKit, Underline];

export function TipTapProvider({ content }) {
  return <EditorProvider extensions={extensions} content={content}></EditorProvider>;
}
