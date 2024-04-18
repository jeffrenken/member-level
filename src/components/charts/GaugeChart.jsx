import ReactEcharts from 'echarts-for-react';
// TODO CREATE CHART

const chartScaleFake = [
  [0.25, '#FF6E76'],
  [0.5, '#FDDD60'],
  [0.75, '#58D9F9'],
  [1, '#7CFFB2']
];

export default function GaugeChart({ chartScale, chartValue }) {
  console.log(chartScale, chartValue);
  const option = {
    series: [
      {
        type: 'gauge',
        startAngle: 180,
        endAngle: 0,
        center: ['50%', '75%'],
        radius: '90%',
        min: 0,
        max: 1,
        splitNumber: 0,
        splitLine: {
          show: false
        },
        axisLine: {
          lineStyle: {
            width: 6,
            color: chartScale
          }
        },
        pointer: {
          icon: 'path://M12.8,0.7l12,40.1H0.7L12.8,0.7z',
          length: '12%',
          width: 20,
          offsetCenter: [0, '-60%'],
          itemStyle: {
            color: 'auto'
          }
        },
        axisTick: {
          show: false,
          length: 12,
          lineStyle: {
            color: 'auto',
            width: 2
          }
        },
        /* splitLine: {
          length: 20,
          lineStyle: {
            color: 'auto',
            width: 5
          }
        }, */
        axisLabel: {
          color: '#464646',
          fontSize: 12,
          distance: -60,
          rotate: 'tangential',
          formatter: function (value) {
            if (value < chartScale[0][0]) {
              return 'Lower';
            }
            if (value > chartScale[chartScale.length - 1][0]) {
              return 'Upper';
            }
            return 'Middle';
          }
        },
        title: {
          offsetCenter: [0, '-10%'],
          fontSize: 12
        },
        detail: {
          fontSize: 12,
          offsetCenter: [0, '-35%'],
          valueAnimation: true,
          formatter: function (value) {
            return Math.round(value * 100) + '';
          },
          color: 'inherit'
        },
        data: [
          {
            value: chartValue,
            name: 'Title'
          }
        ]
      }
    ]
  };
  return <ReactEcharts option={option} />;
}
