import React from 'react';
import styled from 'styled-components';
import { Box, Container, Grid, Stack, Tooltip, Typography, useTheme } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { measureFilterState } from '@/state/measureFilterState.js';

const measure = {
  id: 1,
  abbreviation: 'EM',
  label: 'Example Measure',
  numerator: 'Numerator',
  denominator: 'Denominator',
  forecast: 'something'
};
const blue = 'rgba(146, 208,242, 1)';
const green = '#30cba8';
const red = '#fe412d';
const numColor = green;
const denomColor = red;

const Slice2 = styled(`div`)`
  width: 85px;
  height: 85px;
  border-radius: 50%;
  background-image: ${(props) => `conic-gradient(${denomColor} ${props.slice1}deg, ${numColor} 0 ${props.slice2}deg)`};
  margin: 0 auto;
  box-shadow: 0px 4px 8px rgb(0 0 0 / 0.4);
`;

function truncate(str, n) {
  return str.length > n ? str.substr(0, n - 1) + '...' : str;
}

const PieChart2 = ({ measure, disabled }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [measureState, setMeasureState] = useRecoilState(measureFilterState);
  const total = measure.numerator + measure.denominator;
  const value1InDegrees = (measure.numerator / total) * 360;
  const value2InDegrees = (measure.denominator / total) * 360;
  const numeratorPercent = (measure.numerator / total) * 100;
  const denominatorPercent = (measure.denominator / total) * 100;
  const quotient = (measure.numerator / measure.denominator).toFixed(2);

  const background = theme.palette.background.semiTransparent;

  const handleClick = () => {
    if (!disabled) {
      navigate(`/measures?measureFilterState=${measure.id}`);
      setMeasureState(measure.id);
    }
  };

  return (
    <Box
      height={188}
      width={188}
      sx={{
        borderRadius: '10px',
        border: `2px solid #aaa`,
        p: 0.5,
        bgcolor: background,
        boxShadow: '0px 4px 8px rgb(0 0 0 / 0.2)',
        cursor: !disabled ? 'pointer' : 'default'
      }}
      onClick={handleClick}
    >
      <Stack direction="column" justifyContent="space-between" sx={{ height: '100%' }} spacing={0}>
        <Typography align="center" sx={{ fontSize: '1.4rem', lineHeight: 1, fontWeight: 600, textShadow: '0px 2px 2px rgb(0 0 0 / 0.3)' }}>
          {measure.abbreviation}
        </Typography>
        <Typography align="center" sx={{ fontSize: '0.7rem', lineHeight: 1, mb: '4px' }}>
          {truncate(measure.label, 50)}
        </Typography>

        <Box sx={{ position: 'relative' }}>
          <Slice2 slice1={value2InDegrees} slice2={value1InDegrees} />
          <Box
            sx={(theme) => ({
              position: 'absolute',
              width: '70px',
              height: '70px',
              borderRadius: '50%',
              backgroundColor: theme.palette.background.paper,
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              boxShadow: 'inset 0px 4px 8px rgb(0 0 0 / 0.3)'
            })}
          >
            <Typography
              align="center"
              sx={{
                fontSize: '1.8rem',
                fontWeight: 600,
                lineHeight: 0.9,
                letterSpacing: '-1px',
                mt: '23px',
                textShadow: '0px 2px 2px rgb(0 0 0 / 0.3)'
              }}
            >
              {isNaN(quotient) ? '' : quotient}
            </Typography>
          </Box>
        </Box>
        <Stack direction="row" alignItems="space-between" justifyContent="space-between" spacing={1} px={2} mt={'-8px'}>
          <Box
            sx={{
              width: '100%',
              height: '100%',
              pl: '4px',
              py: '2px',
              fontSize: '0.7rem',
              textAlign: 'left',
              textShadow: '0px 2px 2px rgb(0 0 0 / 0.3)'
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
              textAlign: 'right',
              textShadow: '0px 2px 2px rgb(0 0 0 / 0.3)'
            }}
          >
            Den
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
            boxShadow: '0px 4px 8px rgb(0 0 0 / 0.2)',
            borderRadius: '4px',
            //background: `linear-gradient(90deg, rgba(34, 193, 168, 1) ${numeratorPercent}%, rgba(35, 93, 241, 1) ${denominatorPercent}%)`
            //background: `linear-gradient(90deg, rgba(34, 193, 168, 1) ${numeratorPercent}%, rgba(35, 93, 241, 1) 100%)`
            background: `linear-gradient(135deg, ${numColor} ${numeratorPercent - 25}%, ${denomColor} ${100 - denominatorPercent + 25}%)`
          }}
        >
          <Typography
            sx={{
              width: '100%',
              height: '100%',
              color: '#000',
              fontSize: '1.1rem',
              pl: '4px',
              py: '2px',
              borderRadius: '4px',
              textAlign: 'left'
            }}
          >
            {measure.numerator}
          </Typography>
          <Typography
            sx={{
              width: '100%',
              height: '100%',
              color: '#000',
              fontSize: '1.1rem',
              pl: '4px',
              py: '2px',
              borderRadius: '4px',
              textAlign: 'right'
            }}
          >
            {measure.denominator}
          </Typography>
        </Stack>
      </Stack>
      {/* <Stack direction="row" alignItems="space-between" justifyContent="space-between" spacing={1} px={1} mt={'-3px'}>
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
            bgcolor: numColor,
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
      </Stack> */}
      {/* <Typography align="center" sx={{ fontSize: '1.1rem' }} mt="4px">
        <span style={{ color: green }}>{measure.numerator}</span>/<span style={{ color: numColor }}>{measure.denominator}</span>
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
