import { TipTapProvider } from '@/root/src/components/tiptap/TipTapProvider';
import { Card, StyledCard, Typography, Box, Stack, IconButton } from '@/components/ui';
import { IconPencil, IconTrash } from '@tabler/icons-react';
import { useState } from 'react';
import { TipTapEditor } from '@/root/src/components/tiptap/TipTapEditor';
import { useTheme } from '@/root/src/hooks';
import { commentTestState } from '@/state/commentTestState';
import { useRecoilState } from 'recoil';

export function Comment({ comment }) {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const [comments, setComments] = useRecoilState(commentTestState);
  const [displayControls, setDisplayControls] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const user = comment.userId;
  let userName;

  if (user === 1) {
    userName = 'Cyndi Lauper';
  } else if (user === 2) {
    userName = 'Johnny Cash';
  }

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleCommentDelete = () => {
    console.log('handleCommentDelete');
    let commentIndex = comments.findIndex((c) => c.id === comment.id);
    let commentsCopy = [...comments];

    commentsCopy.splice(commentIndex, 1);
    setComments([...commentsCopy]);
  };

  const isAuthUser = user === 1;

  const margin = isAuthUser ? '0px 0px 0px 24px' : '0px 24px 0px 0px';
  console.log('margin', margin);

  let background = isDarkMode ? '#333' : '#ddd';
  if (isAuthUser) {
    background = theme.palette.background.paper;
  }

  return (
    <Box sx={{ padding: margin }} onMouseEnter={() => setDisplayControls(true)} onMouseLeave={() => setDisplayControls(false)}>
      <StyledCard
        style={{
          padding: '0px 12px 6px 12px',
          height: 'fit-content',
          backgroundColor: background
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Box mb={1}>
            <Typography display="inline">{userName}</Typography>{' '}
            <Typography display="inline" variant="caption">
              {' '}
              at {comment.createdAt}
            </Typography>
          </Box>
          {displayControls && (
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <IconButton sx={{ padding: '0px', marginRight: '8px' }} onClick={handleEditClick}>
                <IconPencil size={16} color={theme.palette.primary.main} />
              </IconButton>
              <IconButton sx={{ padding: '0px' }} onClick={handleCommentDelete}>
                <IconTrash size={16} color="#c80000" />
              </IconButton>
            </Stack>
          )}
        </Stack>
        {isEditing ? (
          <TipTapEditor memberId={comment.memberId} content={comment.content} commentId={comment.id} handleCancel={handleCancelEdit} />
        ) : (
          <TipTapProvider content={comment.content} />
        )}
      </StyledCard>
    </Box>
  );
}
