// install (please try to align the version of installed @nivo packages)
// yarn add @nivo/pie
import { ResponsivePie } from '@nivo/pie';
import { Box, useTheme } from '@mui/material';

const data = [
  {
    id: 'lisp',
    label: 'lisp',
    value: 15,
    color: 'hsla(142, 61%, 26%, 1)'
  },
  {
    id: 'python',
    label: 'python',
    value: 35,
    color: 'hsl(228, 70%, 50%)'
  }
];

// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.
export default function Donut({ numerator, denominator }) {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const data = [
    { label: 'Numerator', value: numerator, color: 'hsl(142, 61%, 26%)', id: 'Numerator' },
    { label: 'Denominator', value: denominator, color: 'hsl(228, 70%, 50%)', id: 'Denominator' }
  ];

  const colors = isDarkMode
    ? ['hsla(142, 61%, 26%, 0.7)', 'hsla(360, 61%, 34%, 0.7)']
    : ['hsla(142, 61%, 26%, 0.4)', 'hsla(228, 70%, 50%, 0.4)'];
  return (
    <ResponsivePie
      data={data}
      colors={colors}
      margin={{ top: 4, right: 4, bottom: 4, left: 4 }}
      innerRadius={0.5}
      padAngle={0.7}
      cornerRadius={3}
      activeOuterRadiusOffset={2}
      borderWidth={1}
      borderColor={{
        from: 'color',
        modifiers: [['darker', 0.2]]
      }}
      enableArcLinkLabels={false}
      arcLinkLabelsSkipAngle={10}
      arcLinkLabelsTextColor="#fff"
      arcLinkLabelsThickness={2}
      arcLinkLabelsColor={{ from: 'color' }}
      arcLabelsSkipAngle={10}
      arcLabelsTextColor={{
        from: 'color',
        modifiers: [['brighter', 6]]
      }}
    />
  );
}
