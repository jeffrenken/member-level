import React from 'react';
import styled from 'styled-components';
import { Box, Container, Grid, Stack, Typography, useTheme } from '@mui/material';
import CardGlow from '../cards/card-glow/CardGlow';

const measure = {
  id: 1,
  abbreviation: 'EM',
  label: 'Example Measure',
  numerator: 'Numerator',
  denominator: 'Denominator',
  forecast: 'something'
};
const green = 'rgb(34, 193, 168)';
const blue = 'rgb(35, 93, 241)';

const Slice2 = styled(`div`)`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-image: ${(props) => `conic-gradient(${green} ${props.slice1}deg, ${blue} 0 ${props.slice2}deg)`};
  margin: 0 auto;
`;

const CenterCircle = styled('div')(
  ({ theme }) => (
    console.log(theme),
    {
      position: 'absolute',
      width: '80px',
      height: '80px',
      borderRadius: '50%',
      backgroundColor: theme.palette.background.paper,
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)'
    }
  )
);

const PieChart2 = ({ measure }) => {
  const theme = useTheme();
  const total = measure.numerator + measure.denominator;
  const value1InDegrees = (measure.numerator / total) * 360;
  const value2InDegrees = (measure.denominator / total) * 360;
  const numeratorPercent = (measure.numerator / total) * 100;
  const denominatorPercent = (measure.denominator / total) * 100;
  console.log(numeratorPercent, denominatorPercent);

  const background = theme.palette.background.paper;
  console.log(theme);

  return (
    <Box height={170} width={170} sx={{ borderRadius: '10px', border: '1px solid #3ed3ed', p: 1 }}>
      <Typography align="center" sx={{ fontSize: '0.7rem' }}>
        {measure.label}
      </Typography>

      <Box sx={{ position: 'relative' }}>
        <Slice2 slice1={value1InDegrees} slice2={value2InDegrees} />
        <Box
          sx={(theme) => ({
            position: 'absolute',
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            backgroundColor: theme.palette.background.paper,
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)'
          })}
        >
          <Typography align="center" sx={{ fontSize: '2rem', fontWeight: 600, lineHeight: 0.9, letterSpacing: '0px', mt: '24px' }}>
            {measure.abbreviation}
          </Typography>
        </Box>
      </Box>
      <Stack direction="row" alignItems="space-between" justifyContent="space-between" spacing={1} px={1} mt={'-3px'}>
        <Box
          sx={{
            width: '100%',
            height: '100%',
            pl: '4px',
            py: '2px',
            fontSize: '0.7rem',
            textAlign: 'left'
          }}
        >
          Num
        </Box>
        <Box
          sx={{
            width: '100%',
            height: '100%',
            pl: '4px',
            py: '2px',
            fontSize: '0.7rem',
            textAlign: 'right'
          }}
        >
          Denom
        </Box>
      </Stack>
      <Stack
        direction="row"
        alignItems="space-between"
        justifyContent="space-between"
        spacing={1}
        px={1}
        mx={1}
        mb="6px"
        mt={'-3px'}
        sx={{
          //background: `linear-gradient(90deg, rgba(34, 193, 168, 1) ${numeratorPercent}%, rgba(35, 93, 241, 1) ${denominatorPercent}%)`
          background: `linear-gradient(90deg, rgba(34, 193, 168, 1) ${numeratorPercent}%, rgba(35, 93, 241, 1) 100%)`
        }}
      >
        <Box
          sx={{
            width: '100%',
            height: '100%',
            color: 'white',
            fontSize: '1.1rem',
            pl: '4px',
            py: '2px',
            borderRadius: '4px',
            textAlign: 'left'
          }}
        >
          {measure.numerator}
        </Box>
        <Box
          sx={{
            width: '100%',
            height: '100%',
            color: 'white',
            fontSize: '1.1rem',
            pl: '4px',
            py: '2px',
            borderRadius: '4px',
            textAlign: 'right'
          }}
        >
          {measure.denominator}
        </Box>
      </Stack>
      <Stack direction="row" alignItems="space-between" justifyContent="space-between" spacing={1} px={1} mt={'-3px'}>
        <Box
          sx={{
            bgcolor: green,
            width: '100%',
            height: '100%',
            color: 'white',
            fontSize: '1.1rem',
            pl: '4px',
            py: '2px',
            borderRadius: '4px'
          }}
        >
          {measure.numerator}
        </Box>
        <Box
          sx={{
            bgcolor: blue,
            width: '100%',
            height: '100%',
            color: 'white',
            fontSize: '1.1rem',
            pl: '4px',
            py: '2px',
            borderRadius: '4px'
          }}
        >
          {measure.denominator}
        </Box>
      </Stack>
      {/* <Typography align="center" sx={{ fontSize: '1.1rem' }} mt="4px">
        <span style={{ color: green }}>{measure.numerator}</span>/<span style={{ color: blue }}>{measure.denominator}</span>
      </Typography> */}
      {/* <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: background,
          padding: '0px',
          height: '156px',
          width: '156px',
          borderRadius: '10px'
        }}
      >
        <Stack direction="column" height="100%" py={1} px={0}>
          <Typography align="center" sx={{ fontSize: '2.6rem', fontWeight: 600, lineHeight: 0.9, letterSpacing: '2px' }} mt={2}>
            {measure.abbreviation}
          </Typography>
          <Typography align="center" sx={{ fontSize: '0.7rem' }}>
            {measure.label}
          </Typography>
          <Typography align="center" sx={{ fontSize: '0.9rem' }} mt={1.5}>
            <span style={{ color: '#51c5dd' }}>{measure.numerator}</span>/<span style={{ color: '#f04c63' }}>{measure.denominator}</span>
          </Typography>
          <Typography align="center" sx={{ fontSize: '0.9rem' }} mt={0}>
            Forecast: {measure.forecast}
          </Typography>
        </Stack>
      </Box> */}
    </Box>
  );
};

export default PieChart2;
