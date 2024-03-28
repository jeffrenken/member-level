import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const data = [
  {
    name: '2020',
    value: 68.3,
    fill: '#9cafb7'
  },
  {
    name: '2021',
    value: 70.1,
    fill: '#fe938c'
  },
  {
    name: '2022',
    value: 72.5,
    fill: '#e6b89c'
  },
  {
    name: '2023',
    value: 74.8,
    fill: '#ead2ac'
  }
];

const CustomLabelInBar = ({ x, y, width, value }) => {
  return (
    <text x={x + width * 0.85} y={y} fill="#fff" textAnchor="middle" dy={18}>
      {value}
    </text>
  );
};

export default function BarChartHorizontal() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        width={500}
        height={300}
        data={data}
        layout="vertical"
        margin={{
          top: 10,
          right: 20,
          left: 0,
          bottom: 5
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" />
        <YAxis dataKey="name" type="category" />
        <Tooltip />
        {/*         <Legend />
         */}{' '}
        <Bar dataKey="value" label={<CustomLabelInBar />} />
      </BarChart>
    </ResponsiveContainer>
  );
}
