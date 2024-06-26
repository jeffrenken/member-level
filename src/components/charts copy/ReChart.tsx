import { useTheme } from '@/hooks';
import { Bar, ComposedChart, Legend, Line, Rectangle, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
//import { Config, ScreensConfig } from "tailwindcss/types/config";

//import resolveConfig from "tailwindcss/resolveConfig";

// const fullConfig = resolveConfig(tailwindConfig);

// const fontColor = fullConfig?.theme?.colors || '#3ed3ed';
const orange = '#ef7b41';
const purple = '#a05095';

const months = [
  {
    name: 'Jan',
    index: 1,
    value: 23
  },
  {
    name: 'Feb',
    index: 2,
    value: 33
  },
  {
    name: 'Mar',
    index: 3,
    value: 43
  },
  {
    name: 'Apr',
    index: 4,
    value: 23
  },
  {
    name: 'May',
    index: 5,
    value: 33
  },
  {
    name: 'Jun',
    index: 6,
    value: 21
  },
  {
    name: 'Jul',
    index: 7,
    value: 45
  },
  {
    name: 'Aug',
    index: 8,
    value: 23
  },
  {
    name: 'Sep',
    index: 9,
    value: 43
  },
  {
    name: 'Oct',
    index: 10,
    value: 66
  },
  {
    name: 'Nov',
    index: 11,
    value: 55
  },
  {
    name: 'Dec',
    index: 12,
    value: 22
  }
];

export default function RechartTest({ data }) {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';
  const isBelowSm = false;

  return (
    <ResponsiveContainer width="100%" height="100%" id="tacos">
      <ComposedChart
        id="trash"
        width={500}
        height={400}
        data={months}
        margin={{
          top: 20,
          right: 20,
          bottom: 20,
          left: 20
        }}
      >
        {/*         <CartesianGrid stroke="#f5f5f5" />
         */}{' '}
        <XAxis
          dataKey=""
          tick={{
            fontSize: isBelowSm ? '0.6rem' : '0.8rem',
            fill: darkMode ? '#ccc' : '#333'
          }}
          tickLine={{ stroke: darkMode ? '#ccc' : '#333' }}
          axisLine={{ stroke: darkMode ? '#ccc' : '#333' }}
        />
        <YAxis
          width={26}
          tick={{
            fontSize: isBelowSm ? '0.6rem' : '0.8rem',
            fill: darkMode ? '#ccc' : '#333'
          }}
          tickLine={{ stroke: darkMode ? '#ccc' : '#333' }}
          axisLine={{ stroke: darkMode ? '#ccc' : '#333' }}
        />
        <Tooltip contentStyle={{ backgroundColor: darkMode ? '#333333' : '#fcfcfc' }} />{' '}
        <Legend layout="horizontal" verticalAlign="top" align="center" />
        <Bar dataKey="value" fill={darkMode ? '#EB8654' : orange} activeBar={<Rectangle fill="#87B3BF" stroke="aaaaaa" />} />
        <Line type="monotone" dot={false} dataKey="value" stroke={darkMode ? '#CF83C5' : purple} strokeWidth={3} />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
