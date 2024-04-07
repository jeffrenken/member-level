// install (please try to align the version of installed @nivo packages)
// yarn add @nivo/line
import { ResponsiveLine } from '@nivo/line';
const data = [
  {
    id: 'japan',
    color: 'url(#gradientId)',
    data: [
      {
        x: 'plane',
        y: 172
      },
      {
        x: 'helicopter',
        y: 222
      },
      {
        x: 'boat',
        y: 134
      },
      {
        x: 'train',
        y: 70
      },
      {
        x: 'subway',
        y: 162
      },
      {
        x: 'bus',
        y: 149
      },
      {
        x: 'car',
        y: 252
      },
      {
        x: 'moto',
        y: 278
      },
      {
        x: 'bicycle',
        y: 138
      },
      {
        x: 'horse',
        y: 31
      },
      {
        x: 'skateboard',
        y: 47
      },
      {
        x: 'others',
        y: 91
      }
    ]
  }
];

// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.
export const LineChart = () => (
  <>
    <ResponsiveLine
      enableArea
      data={data}
      margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
      xScale={{ type: 'point' }}
      yScale={{
        type: 'linear',
        min: 'auto',
        max: 'auto',
        stacked: true,
        reverse: false
      }}
      yFormat=" >-.2f"
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: 'transportation',
        legendOffset: 36,
        legendPosition: 'middle',
        truncateTickAt: 0
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: 'count',
        legendOffset: -40,
        legendPosition: 'middle',
        truncateTickAt: 0
      }}
      pointSize={10}
      pointColor={{ theme: 'background' }}
      pointBorderWidth={2}
      pointBorderColor={{ from: 'serieColor' }}
      pointLabelYOffset={-12}
      enableTouchCrosshair={true}
      useMesh={true}
      legends={[
        {
          anchor: 'bottom-right',
          direction: 'column',
          justify: false,
          translateX: 100,
          translateY: 0,
          itemsSpacing: 0,
          itemDirection: 'left-to-right',
          itemWidth: 80,
          itemHeight: 20,
          itemOpacity: 0.75,
          symbolSize: 12,
          symbolShape: 'circle',
          symbolBorderColor: 'rgba(0, 0, 0, .5)',
          effects: [
            {
              on: 'hover',
              style: {
                itemBackground: 'rgba(0, 0, 0, .03)',
                itemOpacity: 1
              }
            }
          ]
        }
      ]}
    />
    <svg>
      <defs>
        <linearGradient id="gradientId" x1="0%" y1="0%" x2="100%" y2="100%" gradientUnits="userSpaceOnUse">
          <stop stopColor="b323ed" />
          <stop offset="43%" stopColor="d7c3ed" stopOpacity="0" />
          <stop offset="65%" stopColor="e5c8c8" stopOpacity="0" />
          <stop offset="100%" stopColor="ecbdaa" />
        </linearGradient>
      </defs>
    </svg>
  </>
);
