import ReactEcharts from 'echarts-for-react';
import { m } from 'framer-motion';
// TODO CREATE CHART

const chartScaleFake = [
  [0.25, '#FF6E76'],
  [0.5, '#FDDD60'],
  [0.75, '#58D9F9'],
  [1, '#7CFFB2']
];

export default function GaugeChart({ chartScale, chartValue }) {
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

  const option2 = {
    grid: { left: '50px', right: '20px' },
    series: [
      {
        type: 'gauge',
        center: ['50%', '60%'],
        startAngle: 180,
        endAngle: 0,
        min: 0,
        max: 100,
        splitNumber: 5,
        itemStyle: {
          color: getBarColor(chartValue)
        },
        progress: {
          show: true,
          width: 10
        },
        pointer: {
          show: false
        },
        axisLine: {
          lineStyle: {
            width: 10
          }
        },
        axisTick: {
          show: false,
          distance: 10,
          splitNumber: 5,
          lineStyle: {
            width: 1,
            color: '#999'
          }
        },
        splitLine: {
          distance: -20,
          length: '10%',
          lineStyle: {
            width: 2,
            color: '#999'
          }
        },
        axisLabel: {
          distance: -12,
          color: '#999',
          fontSize: 12,
          padding: [0, -6, 0, 0]
        },
        anchor: {
          show: false
        },
        title: {
          show: false
        },
        detail: {
          valueAnimation: true,
          width: '90%',
          lineHeight: 30,
          borderRadius: 8,
          offsetCenter: [0, '-10%'],
          fontSize: 24,
          fontWeight: 'bolder',
          formatter: '{value}',
          color: 'inherit'
        },
        data: [
          {
            value: chartValue * 100
          }
        ]
      },
      {
        type: 'gauge',
        center: ['50%', '60%'],
        radius: '66.1%',
        startAngle: 180,
        endAngle: 0,
        min: 0,
        max: 100,
        itemStyle: {
          //color: '#00ff00'
        },
        axisLine: {
          lineStyle: {
            width: 6,
            color: chartScale
          }
        },

        pointer: {
          show: false
        },

        axisTick: {
          show: false
        },
        splitLine: {
          show: false
        },
        axisLabel: {
          show: false
        },
        detail: {
          show: false
        }
        /* data: [
          {
            value: 80
          }
        ] */
      }
    ]
  };

  const option3 = {
    grid: { bottom: '90px' },
    series: [
      {
        type: 'gauge',
        radius: '100%', // this
        startAngle: 180,
        endAngle: 0,
        min: 0,
        max: 100,
        splitNumber: 5,
        itemStyle: {
          color: getBarColor(chartValue),
          shadowColor: 'rgba(0,0,0,0.2)',
          shadowBlur: 10,
          shadowOffsetX: 2,
          shadowOffsetY: 2
        },
        progress: {
          show: true,
          roundCap: true,
          width: 12
        },
        pointer: {
          icon: 'path://M2090.36389,615.30999 L2090.36389,615.30999 C2091.48372,615.30999 2092.40383,616.194028 2092.44859,617.312956 L2096.90698,728.755929 C2097.05155,732.369577 2094.2393,735.416212 2090.62566,735.56078 C2090.53845,735.564269 2090.45117,735.566014 2090.36389,735.566014 L2090.36389,735.566014 C2086.74736,735.566014 2083.81557,732.63423 2083.81557,729.017692 C2083.81557,728.930412 2083.81732,728.84314 2083.82081,728.755929 L2088.2792,617.312956 C2088.32396,616.194028 2089.24407,615.30999 2090.36389,615.30999 Z',
          length: '75%',
          width: 8,
          offsetCenter: [0, '5%']
        },
        axisLine: {
          roundCap: true,
          lineStyle: {
            width: 16
          }
        },
        axisTick: {
          show: false,
          splitNumber: 2,
          lineStyle: {
            width: 2,
            color: '#999'
          }
        },
        splitLine: {
          distance: 2,

          length: 6,
          lineStyle: {
            width: 2,
            color: '#999'
          }
        },
        axisLabel: {
          show: false,
          distance: 20,
          color: '#999',
          fontSize: 16
        },
        title: {
          show: false
        },
        detail: {
          backgroundColor: '#fff',
          borderColor: '#aaa',
          borderWidth: 1,
          width: '70%',
          lineHeight: 20,
          height: 20,
          borderRadius: 8,
          offsetCenter: [0, '35%'],
          valueAnimation: true,
          formatter: function (value) {
            return '{value|' + value.toFixed(0) + '}';
          },
          rich: {
            value: {
              fontSize: 18,
              color: '#777'
            }
          }
        },
        data: [
          {
            value: chartValue * 100
          }
        ]
      }
    ]
  };

  return <ReactEcharts option={option3} style={{ width: '100%', height: '100%' }} />;
}
