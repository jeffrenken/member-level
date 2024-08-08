import { Button, Box } from '@/components/ui';
import { TipTapEditor } from '@/root/src/components/tiptap/TipTapEditor';
import { useState } from 'react';
import { useTheme } from '@/root/src/hooks';

export function NewComment({ memberId, isNewComment, setIsNewComment }) {
  const theme = useTheme();

  const handleNewCommentClick = () => {
    setIsNewComment(true);
  };

  const handleCancelClick = () => {
    setIsNewComment(false);
  };
  return (
    <>
      {!isNewComment && (
        <Button variant="contained" size="small" onClick={handleNewCommentClick} color="primary">
          New Note
        </Button>
      )}
      {isNewComment && (
        <Box
          sx={{
            border: theme.palette.border,
            padding: '0px 10px 10px 10px',
            borderRadius: '12px',
            backgroundColor: theme.palette.background.paper,
            boxShadow: theme.palette.shadowBlue
          }}
        >
          <TipTapEditor memberId={memberId} handleCancel={handleCancelClick} />
        </Box>
      )}
    </>
  );
}
