import { useTheme } from '@/hooks';
import { Bar, ComposedChart, Legend, Line, Rectangle, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
//import { Config, ScreensConfig } from "tailwindcss/types/config";

//import resolveConfig from "tailwindcss/resolveConfig";

// const fullConfig = resolveConfig(tailwindConfig);

// const fontColor = fullConfig?.theme?.colors || '#3ed3ed';
const orange = '#ef7b41';
const purple = '#a05095';

const data = [
  {
    name: 'Page A',
    uv: 590,
    pv: 800,
    amt: 1400,
    cnt: 490
  },
  {
    name: 'Page B',
    uv: 868,
    pv: 967,
    amt: 1506,
    cnt: 590
  },
  {
    name: 'Page C',
    uv: 1397,
    pv: 1098,
    amt: 989,
    cnt: 350
  },
  {
    name: 'Page D',
    uv: 1480,
    pv: 1200,
    amt: 1228,
    cnt: 480
  },
  {
    name: 'Page E',
    uv: 1520,
    pv: 1108,
    amt: 1100,
    cnt: 460
  },
  {
    name: 'Page F',
    uv: 1400,
    pv: 680,
    amt: 1700,
    cnt: 380
  }
];

export default function RechartTest() {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';
  const { isBelowSm } = false;

  return (
    <ResponsiveContainer width="100%" height="100%" id="tacos">
      <ComposedChart
        id="trash"
        width={500}
        height={400}
        data={data}
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
          dataKey="name"
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
        {/*         <Area type="monotone" dataKey="amt" fill="#8884d8" stroke="#8884d8" />
         */}{' '}
        <Bar dataKey="pv" fill={darkMode ? '#EB8654' : orange} activeBar={<Rectangle fill="#87B3BF" stroke="aaaaaa" />} />
        <Line type="monotone" dataKey="uv" stroke={darkMode ? '#CF83C5' : purple} strokeWidth={3} />
        {/*         <Scatter dataKey="cnt" fill="red" />
         */}{' '}
      </ComposedChart>
    </ResponsiveContainer>
  );
}
