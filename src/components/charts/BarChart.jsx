import { useTheme } from '@mui/material';
import { fontFamily, fontSize, fontWeight, grid } from '@mui/system';
import { color } from 'echarts';
import ReactEcharts from 'echarts-for-react';
// TODO CREATE CHART

const chartScaleFake = [
  [0.25, '#FF6E76'],
  [0.5, '#FDDD60'],
  [0.75, '#58D9F9'],
  [1, '#7CFFB2']
];

export default function BarChart({ data, title }) {
  console.log(data);
  const theme = useTheme();
  const colors = [theme.palette.cardRed, theme.palette.cardYellow, theme.palette.cardGreen];

  const option = {
    grid: {
      top: '15%',
      left: '4%',
      right: '2%',
      bottom: '9%'
    },
    title: {
      text: title,
      left: 'center',
      textStyle: {
        fontFamily: 'Roboto',
        fontSize: 18,
        fontWeight: 'bold',
        color: theme.palette.text.primary
      }
    },
    tooltip: {
      trigger: 'item',
      valueFormatter: (value) => value + ' Members',
      backgroundColor: theme.palette.background.semiTransparent2,
      textStyle: {
        color: theme.palette.text.primary
      },
      borderColor: theme.palette.divider
    },

    xAxis: {
      type: 'category',
      data: data.map((i) => i.label),
      axisLabel: {
        color: theme.palette.text.primary
      },
      color: '#3ed'
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        color: theme.palette.text.primary
      },
      splitLine: {
        lineStyle: {
          color: theme.palette.divider
        }
      }
    },
    series: [
      {
        data: data.map((i) => i.value),
        type: 'bar',
        itemStyle: {
          color: theme.palette.primary.main
        }
      }
    ]
  };

  return <ReactEcharts option={option} style={{ width: '100%', height: '100%' }} />;
}
