import React from 'react';
import ReactECharts from 'echarts-for-react';
import { useTheme } from '@/hooks';

export function ScatterChart() {
  const theme = useTheme();
  const options = {
    grid: { top: 8, right: 8, bottom: 24, left: 36 },
    xAxis: {},
    yAxis: {},
    series: [
      {
        symbolSize: 10,
        itemStyle: {
          color: function (param) {
            return theme.palette.blue.light;
          },
        },
        data: [
          [10.0, 8.04],
          [8.07, 6.95],
          [13.0, 7.58],
          [9.05, 8.81],
          [11.0, 8.33],
          [14.0, 7.66],
          [13.4, 6.81],
          [10.0, 6.33],
          [14.0, 8.96],
          [12.5, 6.82],
          [9.15, 7.2],
          [11.5, 7.2],
          [3.03, 4.23],
          [12.2, 7.83],
          [2.02, 4.47],
          [1.05, 3.33],
          [4.05, 4.96],
          [6.03, 7.24],
          [12.0, 6.26],
          [12.0, 8.84],
          [7.08, 5.82],
          [5.02, 5.68],
        ],
        type: 'scatter',
      },
      {
        symbolSize: 10,
        itemStyle: {
          color: function (param) {
            return theme.palette.purple.light;
          },
        },
        data: [
          [19.9, 8.94],
          [8.97, 9.95],
          [13.9, 7.58],
          [9.95, 8.81],
          [11.9, 8.33],
          [14.9, 7.99],
          [13.4, 9.81],
          [19.9, 9.33],
          [14.9, 8.99],
          [12.5, 9.82],
          [9.15, 7.2],
          [11.5, 7.2],
          [3.93, 4.23],
          [12.2, 7.83],
          [2.92, 4.47],
          [1.95, 3.33],
          [4.95, 4.99],
          [9.93, 7.24],
          [12.9, 9.29],
          [12.9, 8.84],
          [7.98, 5.82],
          [5.92, 5.98],
        ],
        type: 'scatter',
      },
    ],
    tooltip: {
      trigger: 'axis',
    },
  };

  return <ReactECharts option={options} />;
}
