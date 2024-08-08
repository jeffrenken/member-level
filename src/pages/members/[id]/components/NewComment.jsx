import { Button, Box } from '@/components/ui';
import { TipTapEditor } from '@/root/src/components/tiptap/TipTapEditor';
import { useState } from 'react';
import { useTheme } from '@/root/src/hooks';
import { border } from '@mui/system';

export function NewComment({ memberId }) {
  const theme = useTheme();
  const [isNewComment, setIsNewComment] = useState(false);

  const handleNewCommentClick = () => {
    setIsNewComment(true);
  };

  const handleCancelClick = () => {
    setIsNewComment(false);
  };
  return (
    <>
      {!isNewComment && (
        <Button variant="contained" size="small" onClick={handleNewCommentClick} sx={{ float: 'right' }}>
          Add Comment
        </Button>
      )}
      {isNewComment && (
        <Box
          sx={{
            border: theme.palette.border,
            padding: '0px 10px 10px 10px',
            borderRadius: '12px',
            backgroundColor: theme.palette.background.paper
          }}
        >
          <TipTapEditor memberId={memberId} handleCancel={handleCancelClick} />
        </Box>
      )}
    </>
  );
}
