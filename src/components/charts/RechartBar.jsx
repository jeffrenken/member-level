import { useTheme } from '@/hooks';
import { Bar, ComposedChart, Legend, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

//random values between 0 - 100
const months = [
  {
    name: 'Jan',
    value: Math.floor(Math.random() * 100),
    value2: Math.floor(Math.random() * 100),
    value3: Math.floor(Math.random() * 100)
  },
  {
    name: 'Feb',
    value: Math.floor(Math.random() * 100),
    value2: Math.floor(Math.random() * 100),
    value3: Math.floor(Math.random() * 100)
  },
  {
    name: 'Mar',
    value: Math.floor(Math.random() * 100),
    value2: Math.floor(Math.random() * 100),
    value3: Math.floor(Math.random() * 100)
  },
  {
    name: 'Apr',
    value: Math.floor(Math.random() * 100),
    value2: Math.floor(Math.random() * 100),
    value3: Math.floor(Math.random() * 100)
  },
  {
    name: 'May',
    value: Math.floor(Math.random() * 100),
    value2: Math.floor(Math.random() * 100),
    value3: Math.floor(Math.random() * 100)
  },
  {
    name: 'Jun',
    value: Math.floor(Math.random() * 100),
    value2: Math.floor(Math.random() * 100),
    value3: Math.floor(Math.random() * 100)
  },
  {
    name: 'Jul',
    value: Math.floor(Math.random() * 100),
    value2: Math.floor(Math.random() * 100),
    value3: Math.floor(Math.random() * 100)
  },
  {
    name: 'Aug',
    value: Math.floor(Math.random() * 100),
    value2: Math.floor(Math.random() * 100),
    value3: Math.floor(Math.random() * 100)
  },
  {
    name: 'Sep',
    value: Math.floor(Math.random() * 100),
    value2: Math.floor(Math.random() * 100),
    value3: Math.floor(Math.random() * 100)
  },
  {
    name: 'Oct',
    value: Math.floor(Math.random() * 100),
    value2: Math.floor(Math.random() * 100),
    value3: Math.floor(Math.random() * 100)
  },
  {
    name: 'Nov',
    value: Math.floor(Math.random() * 100),
    value2: Math.floor(Math.random() * 100),
    value3: Math.floor(Math.random() * 100)
  },
  {
    name: 'Dec',
    value: Math.floor(Math.random() * 100),
    value2: Math.floor(Math.random() * 100),
    value3: Math.floor(Math.random() * 100)
  }
];

//create typescript for data

const orange = '#ef7b41';
const purple = '#a05095';
const pink = '#d45187';
const blue = '#091f5c';

export default function RechartBar() {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';

  const { isBelowSm } = false;

  const getLineValue = (d) => {
    //can just use value3 or whatever
    //don't need name prop it using value
    return (d.value + d.value2) / 2;
  };
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart
        //width={500}
        //height={300}
        data={months}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5
        }}
      >
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
          width={20}
          tick={{
            fontSize: isBelowSm ? '0.6rem' : '0.8rem',
            fill: darkMode ? '#ccc' : '#333'
          }}
          tickLine={{ stroke: darkMode ? '#ccc' : '#333' }}
          axisLine={{ stroke: darkMode ? '#ccc' : '#333' }}
        />
        <Tooltip contentStyle={{ backgroundColor: darkMode ? '#333333' : '#fcfcfc' }} />
        <Bar
          dataKey="value"
          fill={darkMode ? '#EB8654' : orange}
          //change label tp "score"
          name="Score"

          //activeBar={<Rectangle fill="#75c0b2" stroke="aaaaaa" />}
        />
        {/* <Bar
          dataKey="value2"
          fill={darkMode ? purple : purple}
          //activeBar={<Rectangle fill="#75c0b2" stroke="aaaaaa" />}
        /> */}
        <Line
          //type="monotone"
          type="monotone"
          name="Average of population"
          dataKey="average"
          //dataKey={(d) => getLineValue(d)}
          stroke={darkMode ? '#ccc' : blue}
          strokeWidth={3}
          legendType="rect"
        />
        <Legend layout="horizontal" verticalAlign="top" align="center" />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
