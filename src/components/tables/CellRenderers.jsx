import useMeasures from '@/api/useMeasures';
import { Box, Rating, useTheme } from '@mui/material';
import { IconCheck, IconCheckbox, IconStar, IconX } from '@tabler/icons-react';
import { Link } from 'react-router-dom';

const randomBoolean = () => Math.random() > 0.5;
const randomIntegerBetween = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
const randomHalfNumberBetween = (min, max) => Math.floor(Math.random() * (max - min + 1) + min) / 2;

export const BooleanRenderer = (params) => {
  if (params.value) {
    return <IconCheckbox color="#4caf50" />;
  } else {
    return <IconX color="#f44336" />;
  }
};

const icon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
    class="icon icon-tabler icons-tabler-filled icon-tabler-star"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M8.243 7.34l-6.38 .925l-.113 .023a1 1 0 0 0 -.44 1.684l4.622 4.499l-1.09 6.355l-.013 .11a1 1 0 0 0 1.464 .944l5.706 -3l5.693 3l.1 .046a1 1 0 0 0 1.352 -1.1l-1.091 -6.355l4.624 -4.5l.078 -.085a1 1 0 0 0 -.633 -1.62l-6.38 -.926l-2.852 -5.78a1 1 0 0 0 -1.794 0l-2.853 5.78z" />
  </svg>
);

export const RatingRenderer = (params) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  return (
    <Box sx={{ textAlign: 'left' }}>
      <Rating
        value={params.value}
        readOnly
        precision={0.5}
        size="small"
        sx={{
          //filter: 'drop-shadow(1px 1px 4px #fff)',
          px: 2,
          '& .MuiRating-iconFilled': {
            color: isDarkMode ? 'rgba(237,226,97,0.9)' : '#f0de1a',
            filter: 'drop-shadow(1px 1px 4px #fff)'
          },
          '& .MuiRating-iconEmpty': {
            color: isDarkMode ? '#444' : '#ccc'
          }
        }}
        //icon={icon}
        //emptyIcon={icon}
      />
    </Box>
  );
};

export const StarRenderer = (params) => {
  const wholeNumber = Math.floor(params.value);
  return (
    <Box
      sx={{
        px: 1,
        //margin: '1px 4px 1px 4px',
        //background: 'linear-gradient(90deg, rgba(237,235,235,0) 35%, rgba(179,15,15,0.25) 85%)',
        color: '#FDDA0D',
        filter: 'drop-shadow(0px 0px 4px #FDDA0D)'
      }}
    >
      {Array.from(Array(wholeNumber)).map(() => (
        <IconStar size={12} />
      ))}
    </Box>
  );
};

export const SrfRenderer = (params) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const redGradient = isDarkMode
    ? 'linear-gradient(90deg, rgba(237,235,235,0) 35%, rgba(203,78,78,0.15) 90%)'
    : 'linear-gradient(90deg, rgba(237,235,235,0) 35%, rgba(179,15,15,0.23) 85%)';
  const greenGradient = isDarkMode
    ? 'linear-gradient(90deg, rgba(237,235,235,0) 35%, rgba(94,175,82,0.15) 85%)'
    : 'linear-gradient(90deg, rgba(237,235,235,0) 35%, rgba(68,145,55,0.20) 85%)';
  if (params.value.toString() === 'false') {
    return (
      <Box
        sx={{
          //margin: '1px 4px 1px 4px',
          background: redGradient,
          color: '#CB4E4E',
          px: 2
        }}
      >
        <IconX size={16} />
      </Box>
    );
  }
  return (
    <Box
      sx={{
        //margin: '1px 4px 1px 4px',
        background: greenGradient,
        color: '#5EAF52',
        px: 2
      }}
    >
      <IconCheck size={16} />
    </Box>
  );
};

export const LinkRenderer = (params) => {
  const url = params.data.url;
  return (
    <Box component={Link} to={url} px={1} sx={(theme) => ({ textDecoration: 'none', fontWeight: 300, color: theme.palette.text.primary })}>
      {params.value}
    </Box>
  );
};

export const TextRenderer = (params) => {
  return (
    <Box px={1} sx={(theme) => ({ fontWeight: 300, color: theme.palette.text.primary })}>
      {params.value}
    </Box>
  );
};

export const GapRenderer = (params) => {
  const { data: measures } = useMeasures();
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  const totalGaps = 50;
  let color = '#5EAF52';
  let colorRgba = isDarkMode ? 'rgba(94,175,82,0.15)' : 'rgba(68,145,55,0.25)';
  if (params.value > 20) {
    color = isDarkMode ? '#FDF26E' : '#E6C60D';
    colorRgba = isDarkMode ? 'rgba(253,242,110,0.15)' : 'rgba(253,218,13,0.40)';
  }
  if (params.value > 30) {
    color = '#CB4E4E';
    colorRgba = isDarkMode ? 'rgba(203,78,78,0.15)' : 'rgba(179,15,15,0.25)';
  }

  let gradient = `linear-gradient(90deg, ${colorRgba} 10%, rgba(237,235,235,0) ${totalGaps + params.value - 10}%)`;

  /* if (params.value > 40) {
    gradient = `linear-gradient(90deg, rgba(28,179,15,1) 6%, rgba(206,201,120,1) 29%, rgba(214,44,44,1) 46%, rgba(237,235,235,0) 78%)`;
  } */

  return (
    <Box
      style={{
        textDecoration: 'none',
        fontWeight: 400,
        //filter: `drop-shadow(0px 0px 4px ${color})`,
        color: color,
        //background: `linear-gradient(90deg, rgba(237,235,235,0) ${totalGaps - params.value + 0}%, ${colorRgba} 85%)`
        background: gradient
      }}
      px={2}
    >
      {params.value}
    </Box>
  );
};
