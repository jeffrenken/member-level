//import './card2.css';
import { Stack, Box, Typography } from '@mui/material';

import React from 'react';
import styled, { keyframes } from 'styled-components';
import { Link } from 'react-router-dom';

const spin = keyframes`
  0% {
    --rotate: 0deg;
  }
  100% {
    --rotate: 360deg;
  }
`;

const glow = keyframes`
  0% {
    box-shadow: 0 0 10px rgba(77, 22, 22, 0.6), 0 0 20px rgba(77, 22, 22, 0.8), 0 0 20px rgba(77, 22, 22, 0.4), 0 0 20px rgba(77, 22, 22, 0.2);
  }
  50% {
    box-shadow: 0 0 10px rgba(22, 77, 99, 0.6), 0 0 30px rgba(22, 77, 99, 0.6), 0 0 40px rgba(22, 77, 99, 0.4), 0 0 40px rgba(22, 77, 99, 0.4);
  }
  100% {
    box-shadow: 0 0 10px rgba(77, 22, 22, 0.6), 0 0 20px rgba(77, 22, 22, 0.6), 0 0 30px rgba(77, 22, 22, 0.4), 0 0 40px rgba(77, 22, 22, 0.2);
  }
`;

export const CardContainer = styled.div`
  --card-height: 180px;
  --card-width: calc(var(--card-height) / 1);
  --bg: 25, 28, 41;
  --color: 88, 199, 250;
  --color1: ${(props) => props.color1};
  --color2: ${(props) => props.color2};
  --color3: ${(props) => props.color3};
  --rotate: 132deg; /* Define initial value here */

  .card {
    background: rgba(var(--bg));
    width: var(--card-width);
    height: var(--card-height);
    position: relative;
    border-radius: 8px;
    color: rgba(var(--color), 0.6);
  }

  .card img {
    width: 120px;
    border-radius: 50%;
  }

  .image-container {
    background-color: rgba(var(--color), 0.3);
    padding: 10px;
    margin: -20px;
    margin-bottom: 20px;
    border-radius: 7px;
  }

  .icons ion-icon {
    font-size: 2.5rem;
    margin: 5px;
    margin-top: 20px;
  }

  @keyframes spin {
    0% {
      --rotate: 0deg;
    }
    100% {
      --rotate: 360deg;
    }
  }

  .card::before {
    content: '';
    width: 102%;
    height: 102%;
    border-radius: 8px;
    background-image: linear-gradient(var(--rotate), var(--color1), var(--color2) 43%, var(--color3));
    position: absolute;
    z-index: -1;
    top: -1%;
    left: -1%;
    animation: ${glow} 5s linear infinite;
  }

  .card::after {
    position: absolute;
    content: '';
    top: calc(var(--card-height) / 6);
    left: 0;
    right: 0;
    z-index: -1;
    height: 100%;
    width: 100%;
    margin: 0 auto;
    transform: scale(0.8);
    filter: blur(calc(var(--card-height) / 6));
    background-image: linear-gradient(var(--rotate), var(--color3), var(--color2) 43%, var(--color1));
    opacity: 1;
    transition: opacity 0.5s;
    animation: ${glow} 5s linear infinite;
  }

  @property --rotate {
    syntax: '<angle>';
    initial-value: 132deg;
    inherits: false;
  }

  ${
    '' /* .card:hover:before,
  .card:hover:after {
    animation: none;
    opacity: 0;
  } */
  }
`;

const StyledComponent = ({ measure, colors }) => {
  return (
    <Box component={Link} to={`/measures/${measure.id}`} sx={{ textDecoration: 'none', textAlign: 'center' }}>
      <CardContainer color1={colors[0]} color2={colors[1]} color3={colors[2]}>
        <div className="card">
          <Stack direction="column" justifyContent="center" alignItems="center" height="100%" p={2}>
            <Typography color={'#aaa'}>{measure.label}</Typography>
          </Stack>
        </div>
      </CardContainer>
    </Box>
  );
};

export default StyledComponent;
