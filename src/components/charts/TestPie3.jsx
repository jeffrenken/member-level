import { Box, Stack, Typography } from '@/components/ui';
import { useTheme } from '@/hooks';
import styled from 'styled-components';

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
`;

const PieChart3 = ({ measure }) => {
  const theme = useTheme();
  const total = measure.numerator + measure.denominator;
  const value1InDegrees = (measure.numerator / total) * 360;
  const value2InDegrees = (measure.denominator / total) * 360;
  const numeratorPercent = (measure.numerator / total) * 100;
  const denominatorPercent = (measure.denominator / total) * 100;

  const background = theme.palette.background.paper;

  return (
    <Box
      height={170}
      width={170}
      sx={{
        overflow: 'hidden',
        position: 'relative',
        borderRadius: '10px',
        //border: '2px solid rgba(0,0,0,0.2)',
        boxShadow: '0px 4px 10px rgb(0 0 0 / 0.4)',
        background: `linear-gradient(135deg, rgba(81,197,221,0.8) ${numeratorPercent - 25}%, rgba(240,76,99,0.8) ${
          100 - denominatorPercent + 25
        }%)`
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'rgba(255,255,255,1)',
          padding: '0px',
          height: '156px',
          width: '156px',
          borderRadius: '10px'
        }}
      >
        <Stack direction="column" height="100%" py={1} px={0}>
          <Typography
            align="center"
            sx={{
              fontSize: '2.6rem',
              fontWeight: 600,
              lineHeight: 0.9,
              letterSpacing: '2px'
              //filter: 'drop-shadow(0px 4px 4px rgba(255, 255, 255, 1))'
            }}
            mt={2}
          >
            {measure.abbreviation}
          </Typography>
          <Typography align="center" sx={{ fontSize: '0.7rem' }}>
            {measure.label}
          </Typography>
          {/* <Typography align="center" sx={{ fontSize: '1.3rem' }} mt={1.5}>
            <span style={{ color: '#51c5dd' }}>{measure.numerator}</span>/<span style={{ color: '#f04c63' }}>{measure.denominator}</span>
          </Typography> */}
          <Stack direction="row" alignItems="space-around" justifyContent="space-around" spacing={1} px={2} mt={'8px'}>
            <Box
              sx={{
                width: '100%',
                height: '100%',
                pl: '4px',
                py: '2px',
                fontSize: '0.7rem',
                textAlign: 'center'
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
                textAlign: 'center'
              }}
            >
              Den
            </Box>
          </Stack>
          <Stack
            direction="row"
            alignItems="space-around"
            justifyContent="space-around"
            spacing={1}
            px={1}
            mx={1}
            mb="6px"
            mt={'-3px'}
            sx={{
              borderRadius: '4px'
              //background: `linear-gradient(90deg, rgba(34, 193, 168, 1) ${numeratorPercent}%, rgba(35, 93, 241, 1) ${denominatorPercent}%)`
              //background: `linear-gradient(90deg, rgba(34, 193, 168, 1) ${numeratorPercent}%, rgba(35, 93, 241, 1) 100%)`
            }}
          >
            <Box
              sx={{
                width: '100%',
                height: '100%',
                //color: 'white',
                fontSize: '1.1rem',
                pl: '4px',
                py: '2px',
                borderRadius: '4px',
                textAlign: 'center'
              }}
            >
              {measure.numerator}
            </Box>
            <Box
              sx={{
                width: '100%',
                height: '100%',
                //color: 'white',
                fontSize: '1.1rem',
                pl: '4px',
                py: '2px',
                borderRadius: '4px',
                textAlign: 'center'
              }}
            >
              {measure.denominator}
            </Box>
          </Stack>
          <Typography align="center" sx={{ fontSize: '0.9rem' }} mt={0}>
            Forecast: {measure.forecast}
          </Typography>
        </Stack>
      </Box>
    </Box>
  );
};

export default PieChart3;
