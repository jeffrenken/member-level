import './tiptap-styles.css';

import Underline from '@tiptap/extension-underline';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

import { Box, Button, IconButton, Stack } from '@/components/ui';
import { useTheme } from '@/hooks';
import { commentTestState } from '@/state/commentTestState';
import { IconBold, IconItalic, IconUnderline } from '@tabler/icons-react';
import dayjs from 'dayjs';
import { useRecoilState } from 'recoil';

const MenuBar = ({ editor }) => {
  const theme = useTheme();
  if (!editor) {
    return null;
  }

  return (
    <div>
      <Box
        sx={{
          marginBottom: '4px',
          backgroundColor: theme.palette.background.default,
          width: 'fit-content',
          borderRadius: '12px',
          padding: '4px 8px',
          border: theme.palette.border
        }}
      >
        <IconButton onClick={() => editor.chain().focus().toggleBold().run()} sx={{ padding: '0px', marginRight: '10px' }}>
          <IconBold color={editor.isActive('bold') ? theme.palette.primary.main : theme.palette.text.secondary} size={16} />
        </IconButton>
        <IconButton onClick={() => editor.chain().focus().toggleItalic().run()} sx={{ padding: '0px', marginRight: '10px' }}>
          <IconItalic color={editor.isActive('italic') ? theme.palette.primary.main : theme.palette.text.secondary} size={16} />
        </IconButton>
        <IconButton onClick={() => editor.chain().focus().toggleUnderline().run()} sx={{ padding: '0px' }}>
          <IconUnderline color={editor.isActive('underline') ? theme.palette.primary.main : theme.palette.text.secondary} size={16} />
        </IconButton>
      </Box>
    </div>
  );
};

export function TipTapEditor({ memberId, content = '', handleCancel, commentId }) {
  const theme = useTheme();
  const [comments, setComments] = useRecoilState(commentTestState);
  const editor = useEditor({
    extensions: [StarterKit, Underline],
    content: content,
    autofocus: true
  });

  const handleSave = () => {
    const body = {
      id: comments.length + 1,
      userId: 1,
      content: editor.getJSON(),
      createdAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      memberId: memberId
    };

    if (commentId) {
      const commentIndex = comments.findIndex((comment) => comment.id === commentId);
      let commentsCopy = [...comments];
      let commentCopy = { ...commentsCopy[commentIndex] };
      commentCopy.content = editor.getJSON();
      commentsCopy[commentIndex] = commentCopy;
      setComments([...commentsCopy]);
    } else {
      setComments([...comments, body]);
    }
    handleCancelClick();
  };

  const handleCancelClick = () => {
    if (handleCancel) {
      handleCancel();
    }
  };

  return (
    <>
      <Box sx={{ borderRadius: '12px', padding: '0px 12px', height: 'fit-content' }}>
        <Box pt={'8px'} />

        <MenuBar editor={editor} />
        <Box pt={'8px'} />
        <EditorContent editor={editor} />
      </Box>
      <Stack direction="row" alignItems="center" justifyContent="flex-end" spacing={0} sx={{ marginTop: '8px' }}>
        <Button color="neutral" size="small" onClick={handleCancelClick}>
          Cancel
        </Button>
        <Button size="small" onClick={handleSave}>
          Save
        </Button>
      </Stack>
    </>
  );
}
