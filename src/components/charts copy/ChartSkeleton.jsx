import { Skeleton, Box, Stack } from '@/components';
import { useRef, useEffect } from 'react';

const numBars = 20;

const randomBarHeight = (maxHeight) => {
  if (!maxHeight) return 0;
  return Math.floor(Math.random() * maxHeight);
};

export default function ChartSkeleton({ height, showLegend }) {
  const inputRef = useRef(null);

  useEffect(() => {
    const height = inputRef.current.offsetHeight;
  }, [inputRef]);

  return (
    <Box sx={{ paddingTop: showLegend ? 5 : 0, height: '100%' }}>
      <Stack
        ref={inputRef}
        direction="row"
        justifyContent="space-between"
        alignItems="flex-end"
        sx={{
          //borderLeft: '1px solid #eee',
          //borderBottom: '1px solid #eee',
          height: '100%'
        }}
      >
        {[...Array(numBars).keys()].map((i) => (
          <Skeleton variant="rectangular" width={20} height={randomBarHeight(inputRef?.current?.offsetHeight || null)} key={i} />
        ))}
      </Stack>
    </Box>
  );
}
