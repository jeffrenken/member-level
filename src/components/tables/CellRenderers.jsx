import useMeasures from '@/api/useMeasures';
import { Box, Rating, useTheme } from '@mui/material';
import { fontSize } from '@mui/system';
import { IconCheck, IconCheckbox, IconStar, IconX, IconUserHeart } from '@tabler/icons-react';
import { Link } from 'react-router-dom';

const randomBoolean = () => Math.random() > 0.5;
const randomIntegerBetween = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
const randomHalfNumberBetween = (min, max) => Math.floor(Math.random() * (max - min + 1) + min) / 2;

//function to add or subtract 10% of value
function addOrSubractValue(value) {
  let returnVal = value;
  const randomNumber = Math.random();
  if (randomNumber > 0.9) {
    returnVal = value * 0.9;
  } else if (randomNumber < 0.1) {
    returnVal = value * 1.1;
  } else {
    returnVal = value;
  }

  return Math.ceil(returnVal);
}

export function getSparklineData(finalNumberOfGaps) {
  const monthChartData = [
    { x: 'October', y: addOrSubractValue(finalNumberOfGaps) },
    { x: 'November', y: addOrSubractValue(finalNumberOfGaps) },
    { x: 'December', y: addOrSubractValue(finalNumberOfGaps) },
    { x: 'January', y: addOrSubractValue(finalNumberOfGaps) },
    { x: 'February', y: addOrSubractValue(finalNumberOfGaps) },
    { x: 'March', y: addOrSubractValue(finalNumberOfGaps) },
    { x: 'April', y: finalNumberOfGaps }
  ];
  return monthChartData;
}

export const TooltipRenderer = (params) => {
  const { yValue, xValue } = params;
  return {
    title: '',
    content: xValue + ': ' + yValue + ' Gaps'
  };
};

export const BooleanRenderer = (params) => {
  if (params.value) {
    return <IconCheckbox color="#4caf50" />;
  } else {
    return <IconX color="#f44336" />;
  }
};

export const MeasureRenderer = (params) => {
  if (params.value === '') {
    return undefined;
  }
  if (params.value) {
    return (
      <Box pt={0.5}>
        <IconCheck color="#4caf50" />
      </Box>
    );
  }

  return (
    <Box pt={0.5}>
      <IconX color="#f44336" />
    </Box>
  );
};

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
  if (!params.value) {
    return (
      <Box
        sx={{
          //margin: '1px 4px 1px 4px',
          //background: redGradient,
          color: '#CB4E4E',
          px: 2
        }}
      ></Box>
    );
  }
  return (
    <Box
      sx={{
        //margin: '1px 4px 1px 4px',
        //background: greenGradient,
        color: '#5EAF52',
        mt: 0.5
        //px: 2
      }}
    >
      <IconUserHeart size={20} />
    </Box>
  );
};

export const LinkRenderer = (params) => {
  const url = params.data?.url || '';
  return (
    <Box component={Link} to={url} px={0} sx={(theme) => ({ textDecoration: 'none', color: '#4d9fda' })}>
      {params.value}
    </Box>
  );
};

export const ProviderLinkRenderer = (params) => {
  if (!params.value) {
    return undefined;
  }
  const url = params.data?.providerUrl || '';
  return (
    <Box
      component={Link}
      to={url}
      px={0}
      sx={(theme) => ({
        backgroundColor: '#0C1C2F',
        padding: '6px 10px',
        borderRadius: '16px',
        textDecoration: 'none',
        color: '#ddd'
      })}
    >
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

  const totalGaps = 50; //just for halfway gradient
  let color = '#5EAF52';
  //let color = theme.palette.cardGreen;
  let colorRgba = isDarkMode ? 'rgba(94,175,82,0.25)' : 'rgba(68,145,55,0.35)';
  //let colorRgba = isDarkMode ? 'rgba(80,206,178,0.25)' : 'rgba(80,206,178,0.40)';
  if (params.value > 10) {
    //color = isDarkMode ? '#FDF26E' : '#E6C60D';
    color = theme.palette.cardYellow;
    //colorRgba = isDarkMode ? 'rgba(253,242,110,0.15)' : 'rgba(253,218,13,0.40)';
    colorRgba = isDarkMode ? 'rgba(255,197,66,0.35)' : 'rgba(255,197,66,0.40)';
  }
  if (params.value > 20) {
    //color = '#CB4E4E';
    color = theme.palette.cardRed;
    //colorRgba = isDarkMode ? 'rgba(203,78,78,0.15)' : 'rgba(179,15,15,0.25)';
    colorRgba = isDarkMode ? 'rgba(243,105,89,0.25)' : 'rgba(243,105,89,0.40)';
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
        fontSize: '1rem',
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
