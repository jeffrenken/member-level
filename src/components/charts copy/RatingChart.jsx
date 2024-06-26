import { useTheme } from '@/hooks';
import { motion } from 'framer-motion';
import { Stack, Typography } from '@/components';

const blueRgb = 'rgba(153, 206, 252, 1)';
const purpleRgb = 'rgba(204, 181, 250, 1)';

export default function RatingChart(props) {
  const theme = useTheme();
  const myValue = 72;
  const otherValue = 66;
  const maxValue = 100;
  const width = 300;

  const myLocation = width * (myValue / maxValue);
  const otherLocation = width * (otherValue / maxValue) - myLocation;
  return (
    <>
      <Stack
        direction='row'
        alignItems='center'
        justifyContent='space-between'
        sx={{
          width: width,
          fontSize: '0.9rem',
          color: theme.palette.gray.main,
          textAlign: 'right',
          lineHeight: '0.8rem',
          mb: 1,
        }}
      >
        <Typography align='right' sx={{ lineHeight: '0.8rem', fontSize: '0.9rem' }}>
          Lower CP <br />
          67
        </Typography>
        <Typography align='left' sx={{ lineHeight: '0.8rem', fontSize: '0.9rem', pr: 4, color: '#000' }}>
          S24 CP
          <br />
          {myValue}
        </Typography>
        <Typography align='left' sx={{ lineHeight: '0.8rem', fontSize: '0.9rem' }}>
          Upper CP
          <br />
          88
        </Typography>
      </Stack>
      {/*  <div style={{ height: 15, width: width, display: 'flex' }}>
        <div
          style={
            {
              //marginLeft: myLocation - 60,
            }
          }
        >
          <Typography align='right' sx={{ fontSize: '0.9rem', color: theme.palette.gray.main }}>
            Lower CP
          </Typography>
        </div>
        <div
          style={{
            marginLeft: width - 88,
          }}
        >
          <Typography align='left' sx={{ fontSize: '0.9rem', color: theme.palette.gray.main }}>
            S24 CP
          </Typography>
        </div>
      </div>
      <div style={{ height: 20, width: width, display: 'flex' }}>
        <div
          style={{
            marginLeft: myLocation - 26,
            color: theme.palette.gray.main,
          }}
        >
          66
          <IconCaretDownFilled size={18} style={{ color: theme.palette.gray.main, verticalAlign: 'bottom' }} />
        </div>
        <div
          style={{
            //marginLeft: otherLocation - 20,
            color: theme.palette.gray.main,
          }}
        >
          <IconCaretDownFilled size={18} style={{ color: theme.palette.gray.main, verticalAlign: 'bottom' }} />
          87
        </div>
      </div> */}

      <div
        style={{
          height: 36.5,
          width: width - 100,
          backgroundColor: '#fff',
          display: 'flex',
          border: `1px solid ${theme.palette.gray.main}`,
          marginLeft: 50,
          marginRight: 50,
        }}
      >
        <Stack direction='row' alignItems='center'>
          <motion.div
            initial={{
              marginLeft: 0,
            }}
            animate={{
              marginLeft: myValue,
            }}
            transition={{
              duration: 1,
            }}
            style={{
              height: '100%',
              width: '5px',
              backgroundColor: `${blueRgb}`,
            }}
          ></motion.div>
          {/* <Typography
            align='left'
            sx={{ lineHeight: '0.8rem', fontSize: '0.9rem', pl: 2, color: theme.palette.gray.main }}
          >
            S24 CP
            <br />
            {myValue}
          </Typography> */}
        </Stack>
        {/* <motion.div
          initial={{
            width: 0,
          }}
          animate={{
            width: myLocation,
          }}
          transition={{
            duration: 1,
          }}
          style={{
            height: '100%',
            background: `linear-gradient(90deg, rgba(255,255,255,1) 00%, ${blueRgb} 85%)`,
          }}
        />
        <div
          initial={{
            width: 0,
          }}
          animate={{
            width: otherLocation,
          }}
          transition={{
            duration: 1,
          }}
          style={{
            height: '100%',
            width: otherLocation,
            background: `linear-gradient(90deg, rgba(255,255,255,1) 00%, ${purpleRgb} 85%)`,
          }}
        /> */}
      </div>
    </>
  );
}
