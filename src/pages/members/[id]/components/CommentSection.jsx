import { Box } from '@/components/ui';
import { CommentList } from './CommentList';
import { NewComment } from './NewComment';
import { useState } from 'react';

export function CommentSection({ comments, member }) {
  const [isNewComment, setIsNewComment] = useState(false);
  return (
    <div>
      <CommentList
        comments={comments ? comments.filter((comment) => comment.memberId === member.memberId) : []}
        isAddingComment={isNewComment}
      />

      <Box mt={2}>
        <NewComment memberId={member.memberId} isNewComment={isNewComment} setIsNewComment={setIsNewComment} />
      </Box>
    </div>
  );
}
