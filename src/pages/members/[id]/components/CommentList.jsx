import { Stack } from '@/components/ui';
import { AnimatePresence, motion } from 'framer-motion';
import { Comment } from './Comment';

export function CommentList({ comments }) {
  if (!comments) {
    return null;
  }
  return (
    <Stack spacing={1} mt={2}>
      <AnimatePresence>
        {comments &&
          comments.map((comment) => (
            <motion.div
              key={comment.id}
              initial={{ opacity: 0, x: 0 }} // Start with invisible and slightly off-screen
              animate={{ opacity: 1, x: 0 }} // Fade in and move to the correct position
              exit={{ opacity: 0, x: 200 }} // Fade out and move slightly off-screen
              transition={{ duration: 0.4 }}
            >
              <Comment key={comment?.createdAt} comment={comment} />
            </motion.div>
          ))}
      </AnimatePresence>
    </Stack>
  );
}
