import { Box, IconButton, Stack, StyledCard, Typography } from '@/components/ui';
import { Fade, FadeToggle } from '@/root/src/components/Fade';
import { TipTapEditor } from '@/root/src/components/tiptap/TipTapEditor';
import { TipTapProvider } from '@/root/src/components/tiptap/TipTapProvider';
import Mention from '@tiptap/extension-mention';

import { useTheme } from '@/root/src/hooks';
import { commentTestState } from '@/state/commentTestState';
import { IconPencil, IconTrash } from '@tabler/icons-react';
import { useState } from 'react';
import { useRecoilState } from 'recoil';

export function Comment({ comment, isAddingComment }) {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const [comments, setComments] = useRecoilState(commentTestState);
  const [displayControls, setDisplayControls] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const user = comment.userId;
  let userName;

  if (user === 1) {
    userName = 'You';
  } else if (user === 2) {
    userName = 'Johnny Cash';
  }

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setDisplayControls(false);
  };

  const handleCommentDelete = () => {
    let commentIndex = comments.findIndex((c) => c.id === comment.id);
    let commentsCopy = [...comments];

    commentsCopy.splice(commentIndex, 1);
    setComments([...commentsCopy]);
  };

  const isAuthUser = user === 1;

  const margin = isAuthUser ? '0px 0px 0px 24px' : '0px 24px 0px 0px';

  let background = isDarkMode ? '#474747' : '#ddd';
  if (isAuthUser) {
    background = theme.palette.paper2;
  }

  const handleMouseEnter = () => {
    if (isAuthUser) {
      setDisplayControls(true);
    }
  };

  return (
    <Box sx={{ padding: margin }} onMouseEnter={handleMouseEnter} onMouseLeave={() => setDisplayControls(false)}>
      <StyledCard
        style={{
          padding: '2px 12px 6px 12px',
          height: 'fit-content',
          backgroundColor: background,
          boxShadow: displayControls && theme.palette.shadowBlue
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography display="inline" sx={{ fontWeight: 600 }}>
              {userName}
            </Typography>{' '}
            <Typography display="inline" variant="caption">
              {' '}
              at {comment.createdAt}
            </Typography>
          </Box>
          <Fade isVisible={displayControls && !isEditing}>
            <Stack direction="row" alignItems="center" justifyContent="flex-end" spacing={1}>
              <IconButton sx={{ padding: '0px' }} onClick={handleEditClick}>
                <IconPencil size={16} color={theme.palette.primary.main} />
              </IconButton>
              <IconButton sx={{ padding: '0px' }} onClick={handleCommentDelete}>
                <IconTrash size={16} color="#c80000" />
              </IconButton>
            </Stack>
          </Fade>
        </Stack>
        <Box pt={'8px'} />
        <FadeToggle
          duration={0.3}
          showFirst={!isEditing}
          firstContent={<TipTapProvider content={comment.content} />}
          secondContent={
            <TipTapEditor memberId={comment.memberId} content={comment.content} commentId={comment.id} handleCancel={handleCancelEdit} />
          }
        />
      </StyledCard>
    </Box>
  );
}
