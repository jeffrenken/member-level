import { useTheme } from '@/hooks';
import ReactEcharts from 'echarts-for-react';
// TODO CREATE CHART

export default function ProgressChart({ measure, quotient }) {
  const theme = useTheme();

  let chartScale = [70, 12, 18];

  if (measure?.bottom_third_upper_value) {
    chartScale = [
      measure?.bottom_third_upper_value,
      measure?.middle_third_upper_value - measure?.bottom_third_upper_value,
      100 - measure?.top_third_lower_value
    ];
  }
  const rawData = chartScale;

  const colors = [theme.palette.cardRed, theme.palette.cardYellow, theme.palette.cardGreen];
  let series = ['Lower', 'Middle', 'Upper'].map((name, i) => {
    return {
      name,
      type: 'bar',
      stack: 'total',
      barWidth: 22,
      xAxisIndex: 0,
      yAxisIndex: 0,
      label: {
        show: true,
        offset: [0, -22],
        formatter: (params) => {
          let value = params.value;
          params.componentIndex === 1 && (value = rawData[0] + rawData[1]);
          params.componentIndex === chartScale.length - 1 && (value = '');
          if (value) {
            value = Math.round(value);
          }
          return value;
        },
        color: theme.palette.text.primary
      },
      data: [rawData[i]],
      itemStyle: { color: colors[i] }
    };
  });

  series = [
    ...series,
    {
      name: 'Current Score',
      xAxisIndex: 1,
      yAxisIndex: 1,
      data: [quotient || 0],
      type: 'bar',
      symbol: 'none',
      barWidth: 8,
      lineStyle: {
        color: theme.palette.primary.main,
        width: 20
      }
    }
  ];

  const option = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: theme.palette.background.semiTransparent2,
      textStyle: {
        color: theme.palette.text.primary
      },
      axisPointer: {
        // Use axis to trigger tooltip
        type: 'shadow' // 'shadow' as default; can also be 'line' or 'shadow'
      },
      valueFormatter: (value) => {
        //might need a better way to do this
        let val = value;
        let valRange = [
          `${measure?.bottom_third_lower_value ?? ''} - ${measure?.bottom_third_upper_value ?? ''}`,
          `${measure?.middle_third_lower_value ?? ''} - ${measure?.middle_third_upper_value ?? ''}`,
          `${measure?.top_third_lower_value ?? ''} - ${measure?.top_third_upper_value ?? ''}`
        ];
        const valueIndex = rawData.findIndex((data) => data === val);
        valueIndex === 1 && (val = rawData[0] + rawData[1]);
        valueIndex === chartScale.length - 1 && (val = 100);
        if (val) {
          val = Math.round(val);
        }
        return valRange[valueIndex] || val;
      }
      /* formatter: function (params) {
        return params.map((param) => `${param.seriesName} - ${param.value.toFixed(2)}`).join('<br />');
      } */
    },
    legend: {
      show: false
    },
    grid: {
      top: -4,
      left: -60,
      right: 0,
      bottom: -20,
      containLabel: true
    },
    xAxis: [
      {
        name: 'Value',
        show: false,
        type: 'value',
        axisLine: { onZero: false },
        offset: 0
      },
      {
        name: 'Current Score',
        show: false,
        type: 'value',
        min: 0,
        max: 100,
        axisLine: { onZero: false },
        offset: 30
      }
    ],

    yAxis: [
      {
        show: false,
        type: 'category',
        data: ['Thresholds']
      },
      {
        show: false,
        type: 'category',
        data: ['']
      }
    ],

    series: series
  };

  return <ReactEcharts option={option} style={{ width: '100%', height: '100%' }} />;
}
