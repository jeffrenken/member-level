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

const Slice2 = styled(`div`)`
  width: 300px;
  height: 300px;
  background-image: ${(props) => `conic-gradient(#f04c63 ${props.slice1}deg, #51c5dd 0 ${props.slice2}deg)`};
  margin: -50px 0px 0px -50px;
          f

`;

const PieChart = ({ measure }) => {
  const theme = useTheme();
  const total = measure.numerator + measure.denominator;
  const value1InDegrees = (measure.numerator / total) * 360;
  const value2InDegrees = (measure.denominator / total) * 360;
  console.log(value1InDegrees, value2InDegrees);

  const background = theme.palette.background.paper;

  return (
    <Box height={170} width={170} sx={{ overflow: 'hidden', position: 'relative', borderRadius: '10px' }}>
      <Slice2 slice1={value1InDegrees} slice2={value2InDegrees} />
      <Box
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
          <Typography align="center" sx={{ fontSize: '1.3rem' }} mt={1.5}>
            <span style={{ color: '#51c5dd' }}>{measure.numerator}</span>/<span style={{ color: '#f04c63' }}>{measure.denominator}</span>
          </Typography>
          <Typography align="center" sx={{ fontSize: '0.9rem' }} mt={0}>
            Forecast: {measure.forecast}
          </Typography>
        </Stack>
      </Box>
    </Box>
  );
};

export default PieChart;
