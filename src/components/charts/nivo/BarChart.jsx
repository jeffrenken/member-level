// install (please try to align the version of installed @nivo packages)
// yarn add @nivo/bar
import { ResponsiveBar } from '@nivo/bar';

// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.

const data = [
  {
    country: 'AD',
    'hot dog': 183,
    'hot dogColor': 'hsl(107, 70%, 50%)',
    burger: 182,
    burgerColor: 'hsl(339, 70%, 50%)',
    sandwich: 9,
    sandwichColor: 'hsl(270, 70%, 50%)',
    kebab: 126,
    kebabColor: 'hsl(116, 70%, 50%)',
    fries: 133,
    friesColor: 'hsl(307, 70%, 50%)',
    donut: 54,
    donutColor: 'hsl(193, 70%, 50%)'
  },
  {
    country: 'AE',
    'hot dog': 191,
    'hot dogColor': 'hsl(99, 70%, 50%)',
    burger: 170,
    burgerColor: 'hsl(0, 70%, 50%)',
    sandwich: 192,
    sandwichColor: 'hsl(286, 70%, 50%)',
    kebab: 65,
    kebabColor: 'hsl(27, 70%, 50%)',
    fries: 182,
    friesColor: 'hsl(80, 70%, 50%)',
    donut: 13,
    donutColor: 'hsl(222, 70%, 50%)'
  },
  {
    country: 'AF',
    'hot dog': 67,
    'hot dogColor': 'hsl(95, 70%, 50%)',
    burger: 49,
    burgerColor: 'hsl(3, 70%, 50%)',
    sandwich: 25,
    sandwichColor: 'hsl(283, 70%, 50%)',
    kebab: 33,
    kebabColor: 'hsl(134, 70%, 50%)',
    fries: 62,
    friesColor: 'hsl(325, 70%, 50%)',
    donut: 77,
    donutColor: 'hsl(269, 70%, 50%)'
  },
  {
    country: 'AG',
    'hot dog': 36,
    'hot dogColor': 'hsl(110, 70%, 50%)',
    burger: 159,
    burgerColor: 'hsl(43, 70%, 50%)',
    sandwich: 150,
    sandwichColor: 'hsl(8, 70%, 50%)',
    kebab: 75,
    kebabColor: 'hsl(220, 70%, 50%)',
    fries: 96,
    friesColor: 'hsl(200, 70%, 50%)',
    donut: 114,
    donutColor: 'hsl(194, 70%, 50%)'
  },
  {
    country: 'AI',
    'hot dog': 27,
    'hot dogColor': 'hsl(353, 70%, 50%)',
    burger: 160,
    burgerColor: 'hsl(109, 70%, 50%)',
    sandwich: 145,
    sandwichColor: 'hsl(108, 70%, 50%)',
    kebab: 184,
    kebabColor: 'hsl(161, 70%, 50%)',
    fries: 193,
    friesColor: 'hsl(37, 70%, 50%)',
    donut: 59,
    donutColor: 'hsl(132, 70%, 50%)'
  },
  {
    country: 'AL',
    'hot dog': 168,
    'hot dogColor': 'hsl(324, 70%, 50%)',
    burger: 6,
    burgerColor: 'hsl(105, 70%, 50%)',
    sandwich: 147,
    sandwichColor: 'hsl(259, 70%, 50%)',
    kebab: 79,
    kebabColor: 'hsl(179, 70%, 50%)',
    fries: 24,
    friesColor: 'hsl(341, 70%, 50%)',
    donut: 190,
    donutColor: 'hsl(22, 70%, 50%)'
  },
  {
    country: 'AM',
    'hot dog': 118,
    'hot dogColor': 'hsl(336, 70%, 50%)',
    burger: 95,
    burgerColor: 'hsl(149, 70%, 50%)',
    sandwich: 18,
    sandwichColor: 'hsl(30, 70%, 50%)',
    kebab: 134,
    kebabColor: 'hsl(160, 70%, 50%)',
    fries: 43,
    friesColor: 'hsl(305, 70%, 50%)',
    donut: 47,
    donutColor: 'hsl(252, 70%, 50%)'
  }
];

export const BarChart = ({ measures }) => (
  console.log(measures),
  (
    <ResponsiveBar
      data={measures}
      layout="horizontal"
      enableGridY={false}
      keys={['numerator', 'denominator']}
      indexBy="label"
      margin={{ top: 50, right: 130, bottom: 50, left: 300 }}
      padding={0.3}
      valueScale={{ type: 'linear' }}
      indexScale={{ type: 'band', round: true }}
      colors={{ scheme: 'nivo' }}
      defs={[
        {
          id: 'dots',
          type: 'patternDots',
          background: 'inherit',
          color: '#38bcb2',
          size: 4,
          padding: 1,
          stagger: true
        },
        {
          id: 'lines',
          type: 'patternLines',
          background: 'inherit',
          color: '#eed312',
          rotation: -45,
          lineWidth: 6,
          spacing: 10
        }
      ]}
      fill={[
        {
          match: {
            id: 'fries'
          },
          id: 'dots'
        },
        {
          match: {
            id: 'sandwich'
          },
          id: 'lines'
        }
      ]}
      borderColor={{
        from: 'color',
        modifiers: [['darker', 1.6]]
      }}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: '',
        legendPosition: 'middle',
        legendOffset: 32,
        truncateTickAt: 0
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: '',
        legendPosition: 'middle',
        legendOffset: -40,
        truncateTickAt: 0
      }}
      labelSkipWidth={12}
      labelSkipHeight={12}
      labelTextColor={{
        from: 'color',
        modifiers: [['darker', 1.6]]
      }}
      role="application"
      ariaLabel="Nivo bar chart demo"
      barAriaLabel={(e) => e.id + ': ' + e.formattedValue + ' in country: ' + e.indexValue}
    />
  )
);
