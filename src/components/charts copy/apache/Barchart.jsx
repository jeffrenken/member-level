import React from 'react';
import ReactECharts from 'echarts-for-react';
import { useTheme } from '@/hooks';

export function BarChart() {
  const theme = useTheme();
  const options = {
    grid: { top: 8, right: 8, bottom: 24, left: 36 },
    xAxis: {
      show: false,
      type: 'category',
      splitLine: { show: true },
      data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        name: 'One',
        type: 'bar',
        data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3],

        itemStyle: {
          color: function (param) {
            return theme.palette.blue.light;
          },
        },
      },
      {
        name: 'Two',
        type: 'bar',
        data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3],

        itemStyle: {
          color: function (param) {
            return theme.palette.purple.light;
          },
        },
      },
    ],
    tooltip: {
      trigger: 'axis',
    },
  };

  return <ReactECharts option={options} />;
}
