import { Box, Stack, Tooltip, Typography } from '@/components/ui';
import { useTheme } from '@/hooks';
import styled, { keyframes } from 'styled-components';
import { measureFilterState } from '@/state/measureFilterState.js';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import ProgressChart from './ProgressChart';
import { MEASURE_SELECTORS } from '@/root/e2e/constants/selectors';

const measure = {
  id: 1,
  abbreviation: 'EM',
  label: 'Example Measure',
  numerator: 'Numerator',
  denominator: 'Denominator',
  forecast: 'something'
};
const blue = 'rgba(146, 208,242, 1)';
const green = '#50CEB2';
const red = '#F36959';
const numColor = green;
const denomColor = red;

const rotateAnimation = keyframes`
  from {
    background-size: 200% 200%;
  }
  to {
    background-size: 100% 100%;
  }
`;

const Slice2 = styled(({ slice1, slice2, color, ...rest }) => <div {...rest} />)`
  width: 85px;
  height: 85px;
  border-radius: 50%;
  margin: 0 auto;
  box-shadow: 0px 4px 8px rgb(0 0 0 / 0.4);
  background: ${(props) => `conic-gradient(${denomColor} ${props.slice1}deg, ${numColor} 0 ${props.slice2}deg)`};
  background-size: 100% 100%; /* adjust this value based on the number of color stops */
  animation: ${rotateAnimation} 1.5s linear 1 forwards; /* adjust animation duration as needed */
`;

function truncate(str, n) {
  if (!str || str.length <= n) {
    return str;
  }
  return str.length > n ? str.substr(0, n - 1) + '...' : str;
}

const PieChart2 = ({ measure, disabled, chart }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [measureState, setMeasureState] = useRecoilState(measureFilterState);
  const total = measure.gaps_open_count + measure.gaps_closed_count;
  const value1InDegrees = (measure.gaps_closed_count / total) * 360;
  const value2InDegrees = (measure.gaps_open_count / total) * 360;
  const closedPercent = (measure.gaps_closed_count / total) * 100;
  const openPercent = (measure.gaps_open_count / total) * 100;
  const quotient = ((measure.gaps_closed_count / total) * 100).toFixed(0);

  const background = theme.palette.background.semiTransparent;

  const handleClick = () => {
    if (!disabled) {
      navigate(`/measures?measureFilterState=${measure.id}`);
      setMeasureState(measure.id);
    }
  };

  const borderColor = '#aaa';

  const gradientChart = (
    <>
      <AnimatePresence>
        <Stack
          direction="row"
          alignItems="space-between"
          justifyContent="space-between"
          spacing={1}
          px={2}
          mt={'-8px'}
          key={measure?.id + 'stack'}
        >
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
            //background: `linear-gradient(90deg, rgba(34, 193, 168, 1) ${closedPercent}%, rgba(35, 93, 241, 1) ${openPercent}%)`
            //background: `linear-gradient(90deg, rgba(34, 193, 168, 1) ${closedPercent}%, rgba(35, 93, 241, 1) 100%)`
            background: `linear-gradient(135deg, ${numColor} ${closedPercent - 25}%, ${denomColor} ${100 - openPercent + 25}%)`
          }}
        >
          <motion.div key={measure?.id + 'closed'} initial={{ x: 50 }} animate={{ x: 0 }} transition={{ duration: 1 }}>
            <Typography
              sx={{
                width: '100%',
                height: '100%',
                color: '#fff',
                fontSize: '1.1rem',
                pl: '4px',
                py: '2px',
                borderRadius: '4px',
                textAlign: 'left'
              }}
              data-testid={MEASURE_SELECTORS.measureChartCardNum}
            >
              {measure.gaps_closed_count}
            </Typography>
          </motion.div>
          <motion.div key={measure?.id + 'total'} initial={{ x: -50 }} animate={{ x: 0 }} transition={{ duration: 1 }}>
            <Typography
              sx={{
                width: '100%',
                height: '100%',
                color: '#fff',
                fontSize: '1.1rem',
                pl: '4px',
                py: '2px',
                borderRadius: '4px',
                textAlign: 'right'
              }}
              data-testid={MEASURE_SELECTORS.measureChartCardDen}
            >
              {total}
            </Typography>
          </motion.div>
        </Stack>
      </AnimatePresence>
    </>
  );

  return (
    <Box
      height={188}
      width={188}
      sx={{
        borderRadius: '10px',
        border: `2px solid ${borderColor}`,
        p: 0.5,
        bgcolor: background,
        boxShadow: '0px 4px 8px rgb(0 0 0 / 0.2)',
        cursor: !disabled ? 'pointer' : 'default'
      }}
      onClick={handleClick}
      data-testid={MEASURE_SELECTORS.measureChartCard}
    >
      <Stack direction="column" justifyContent="space-between" sx={{ height: '100%' }} spacing={0}>
        <Typography align="center" sx={{ fontSize: '1.4rem', lineHeight: 1, fontWeight: 600, textShadow: '0px 2px 2px rgb(0 0 0 / 0.3)' }}>
          {measure.abbreviation}
        </Typography>
        <Typography align="center" sx={{ fontSize: '0.7rem', lineHeight: 1, mb: '4px' }}>
          {truncate(measure.name, 50)}
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
            <motion.div
              key={measure?.id + 'quotient'}
              initial={{ opacity: 0, scale: 1 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.5 }}
            >
              <Typography
                align="center"
                sx={{
                  fontSize: '2.1rem',
                  fontWeight: 600,
                  lineHeight: 0.9,
                  letterSpacing: '-1px',
                  mt: '21px',
                  textShadow: '0px 2px 2px rgb(0 0 0 / 0.3)'
                }}
                data-testid={MEASURE_SELECTORS.measureChartCardQuotient}
              >
                {isNaN(quotient) ? '' : quotient}
              </Typography>
            </motion.div>
          </Box>
        </Box>
        {chart === 'gradient' && gradientChart}
        {chart === 'progress' && (
          <Box sx={{ height: '130px', width: '100%', mt: '0px' }}>
            <ProgressChart measure={measure} quotient={quotient} />
          </Box>
        )}
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
          {measure.open}
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
