import { useTheme } from '@/hooks';
import ReactEcharts from 'echarts-for-react';
// TODO CREATE CHART

const chartScaleFake = [
  [0.25, '#FF6E76'],
  [0.5, '#FDDD60'],
  [0.75, '#58D9F9'],
  [1, '#7CFFB2']
];

export default function DonutChart({ data, title = '' }) {
  const theme = useTheme();
  const colors = [theme.palette.cardRed, theme.palette.cardYellow, theme.palette.cardGreen];

  const option = {
    tooltip: {
      trigger: 'item',
      valueFormatter: (value) => value + '%',
      backgroundColor: theme.palette.background.semiTransparent2,
      textStyle: {
        color: theme.palette.text.primary
      },
      borderColor: theme.palette.divider
    },
    legend: {
      show: false,
      orient: 'vertical',
      top: '15%',
      right: '5%',
      textStyle: {
        color: theme.palette.text.primary
      }
    },
    title: {
      text: title,
      left: '4%',
      textStyle: {
        fontFamily: 'Inter',
        fontSize: 14,
        fontWeight: 'bold',
        color: theme.palette.text.primary
      }
    },

    series: [
      {
        name: 'SRF Categories',
        type: 'pie',
        radius: ['0%', '90%'],
        avoidLabelOverlap: true,
        color: colors,
        top: '17%',
        left: '0%',
        right: '0%',
        bottom: '2%',
        itemStyle: {
          borderRadius: 0,
          borderColor: '#aaa',
          borderWidth: 1
        },
        label: {
          position: 'inner',
          fontSize: 14,
          formatter: '{d}%',
          color: '#222'
        },

        labelLine: {
          show: false
        },
        data: data
      }
    ]
  };
  const getBarColor = (value) => {
    if (value < chartScale[0][0]) {
      return chartScale[0][1];
    }
    if (value > chartScale[chartScale.length - 1][0]) {
      return chartScale[chartScale.length - 1][1];
    }
    for (let i = 1; i < chartScale.length; i++) {
      if (value >= chartScale[i - 1][0] && value < chartScale[i][0]) {
        return chartScale[i][1];
      }
    }
  };

  return <ReactEcharts option={option} style={{ width: '100%', height: '100%' }} />;
}
