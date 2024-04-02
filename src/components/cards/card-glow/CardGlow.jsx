/* import { GUI } from 'https://cdn.skypack.dev/dat.gui';
import Color from 'https://cdn.skypack.dev/color';
import gsap from 'https://cdn.skypack.dev/gsap'; */
import React from 'react';
import './card-glow.css';
import { CardContainer } from '../Card2.jsx';

import styled, { keyframes } from 'styled-components';
import { Box, Stack, Typography, useTheme } from '@mui/material';
import { Link } from 'react-router-dom';

function hexToHue(hex) {
  // Remove the # if present
  hex = hex.replace('#', '');

  // Parse the hexadecimal color components
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  // Find the maximum and minimum values of RGB
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);

  let hue;

  // Calculate the hue
  if (max === min) {
    hue = 0; // Achromatic (gray)
  } else {
    const delta = max - min;
    switch (max) {
      case r:
        hue = ((g - b) / delta + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        hue = ((b - r) / delta + 2) / 6;
        break;
      case b:
        hue = ((r - g) / delta + 4) / 6;
        break;
    }
  }

  return Math.round(hue * 360); // Convert hue to degrees (0-360)
}

const animateGlow = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const backlight = (x, y, spread, size, duration) => styled.div`
  position: relative;

  ${
    ''
    /*   animation: textColor 10s ease infinite;
     */
  }
  &::after {
    position: absolute;
    content: '';
    top: ${y};
    left: ${x};
    right: 0;
    z-index: -1;
    height: 100%;
    width: 100%;
    margin: 0 auto;
    transform: scale(${size});
    -webkit-filter: blur(${spread});
    -moz-filter: blur(${spread});
    -ms-filter: blur(${spread});
    filter: blur(${spread});
    background: linear-gradient(270deg, ${(props) => props.colors[0]}, ${(props) => props.colors[1]});
    background-size: 200% 200%;
    animation: ${animateGlow} ${duration} ease infinite;
  }

  ${
    '' /* @keyframes textColor {
    0% {
      color: #7e0fff;
    }
    50% {
      color: #0fffc1;
    }
    100% {
      color: #7e0fff;
    }
  } */
  }
`;

export const StyledDiv = backlight('0', '1.5vw', '1.5vw', '0.75', '10s');

/* export const Root = styled.div`
  --backdrop: hsl(0 0% 60% / 0.12);
  --radius: 14;
  --border: 3;
  --backup-border: var(--backdrop);
  --size: 150;

  body {
    display: grid;
    place-items: center;
    min-height: 100vh;
    overflow: hidden;
    background: hsl(0 0% 4%);
  }
`; */

export const Wrapper = styled.div`
  position: relative;
`;

export const Article = styled.article`
  --border-size: calc(var(--border, 2) * 1px);
  --spotlight-size: calc(var(--size, 150) * 1px);
  --hue: calc(var(--base) + (var(--xp, 0) * var(--spread, 0)));

  aspect-ratio: 4 / 4;
  border-radius: calc(var(--radius) * 1px);
  width: 180px;
  position: relative;
  grid-template-rows: 1fr auto;
  box-shadow: 0 1rem 2rem -1rem black;
  padding: 0rem;
  display: grid;
  gap: 0rem;
  backdrop-filter: blur(calc(var(--cardblur, 5) * 1px));
`;

export const Main = styled.main`
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  width: 120ch;
  max-width: calc(100vw - 2rem);
  position: relative;
`;

export const Glow = styled.div`
  --lightness: 50;
  --saturation: 300;
  --border-size: calc(var(--border, 2) * 1px);
  --spotlight-size: calc(var(--size, 150) * 1px);
  ${
    ''
    /*   --hue: calc(var(--base) + (var(--xp, 0) * var(--spread, 0)));
     */
  }
  --hue: ${({ hue }) => hue};

  background-image: radial-gradient(
    var(--spotlight-size) var(--spotlight-size) at calc(var(--x, 0) * 1px) calc(var(--y, 0) * 1px),
    hsl(var(--hue, 210) calc(var(--saturation, 100) * 1%) calc(var(--lightness, 70) * 1%) / var(--bg-spot-opacity, 0.1)),
    transparent
  );
  background-color: var(--backdrop, transparent);
  background-size: calc(100% + (2 * var(--border-size))) calc(100% + (2 * var(--border-size)));
  background-position: 50% 50%;
  background-attachment: fixed;
  border: var(--border-size) solid var(--backup-border);
  position: relative;
  touch-action: none;
  border-radius: calc(var(--radius) * 1px);

  &::before,
  &::after {
    pointer-events: none;
    content: '';
    position: absolute;
    inset: calc(var(--border-size) * -1);
    border: var(--border-size) solid transparent;
    border-radius: calc(var(--radius) * 1px);
    background-attachment: fixed;
    background-size: calc(100% + (2 * var(--border-size))) calc(100% + (2 * var(--border-size)));
    background-repeat: no-repeat;
    background-position: 50% 50%;
    mask: radial-gradient(circle, transparent 60%, white 80%);
  }

  &::before {
    background-image: radial-gradient(
      calc(var(--spotlight-size) * 0.75) calc(var(--spotlight-size) * 0.75) at calc(var(--x, 0) * 1px) calc(var(--y, 0) * 1px),
      hsl(var(--hue, 210) calc(var(--saturation, 100) * 1%) calc(var(--lightness, 50) * 1%) / var(--border-spot-opacity, 1)),
      transparent 100%
    );
    filter: brightness(2);
  }

  &::after {
    background-image: radial-gradient(
      calc(var(--spotlight-size) * 0.5) calc(var(--spotlight-size) * 0.5) at calc(var(--x, 0) * 1px) calc(var(--y, 0) * 1px),
      hsl(0 100% 100% / var(--border-light-opacity, 1)),
      transparent 100%
    );
  }
`;

const OuterFade = styled.div`
  position: relative;
  width: 200px;
  height: 200px;
  background-color: #f0f0f0; /* Solid background color */

  &::before,
  &::after {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    width: 20px; /* Width of the fading area */
    background: linear-gradient(to right, rgba(255, 255, 255, 0), #f0f0f0); /* Adjust the direction and color stops as needed */
  }

  &::before {
    left: 0;
  }

  &::after {
    right: 0;
  }
`;

const useGlowPointer = () => {
  const UPDATE = React.useCallback(({ x, y }) => {
    document.documentElement.style.setProperty('--x', x.toFixed(2));
    document.documentElement.style.setProperty('--xp', (x / window.innerWidth).toFixed(2));
    document.documentElement.style.setProperty('--y', y.toFixed(2));
    document.documentElement.style.setProperty('--yp', (y / window.innerHeight).toFixed(2));
  }, []);
  React.useEffect(() => {
    document.body.addEventListener('pointermove', UPDATE);
    return () => {
      document.body.removeEventListener('pointermove', UPDATE);
    };
  }, []);
  return null;
};

const CardGlow = ({ measure, shadow, colors }) => {
  const setGlow = useGlowPointer();
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  return (
    <>
      <StyledDiv colors={colors} shadow={shadow}>
        <Wrapper>
          <Article data-glow>
            <Box
              component={Link}
              to={`/measures/${measure.id}`}
              sx={(theme) => ({
                bgcolor: isDarkMode ? '#111' : '#fff',
                color: theme.palette.text.primary,
                textDecoration: 'none',
                p: 0,
                borderRadius: '10px',
                zIndex: 1,
                overflow: 'hidden'

                //boxShadow: 'inset 5px 5px 9px rgba(94,104,121,0.3), -5px -5px 9px rgba(88,88,88,0.45)'
                //background: 'linear-gradient(to right, rgba(255, 255, 255, 0), rgba(255, 255, 255, 1))'
              })}
            >
              {/* <CardContainer color1={colors[0]} color2={colors[1]} color3={colors[2]}>
              <div className="card"> */}
              <Stack direction="column" height="100%" py={2} px={1}>
                <Typography align="center" sx={{ fontSize: '3rem', fontWeight: 600, lineHeight: 0.9, letterSpacing: '2px' }} mt={2}>
                  {measure.abbreviation}
                </Typography>
                <Typography align="center" sx={{ fontSize: '0.7rem' }}>
                  {measure.label}
                </Typography>
                <Typography align="center" sx={{ fontSize: '0.9rem' }} mt={1.5}>
                  {measure.numerator}/{measure.denominator}
                </Typography>
                <Typography align="center" sx={{ fontSize: '0.9rem' }} mt={0}>
                  Forecast: {measure.forecast}
                </Typography>
              </Stack>{' '}
              {/*  </div>
            </CardContainer> */}
            </Box>
            <Glow data-glow hue={hexToHue(colors[0])}></Glow>
          </Article>
        </Wrapper>
      </StyledDiv>
    </>
  );
};

export default CardGlow;
