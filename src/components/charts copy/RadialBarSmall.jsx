import React, { useEffect, useMemo } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

import { useTheme } from '@/hooks';
import { useSearchParams } from 'react-router-dom';
ChartJS.register(ArcElement, Tooltip, Legend);

const barColors = {
  lower: 'rgba(255, 99, 132, 0.6)',
  middle: 'rgba(255, 205, 86, 0.6)',
  upper: 'rgba(86,152,109,0.6)',
};
const barColorsDark = {
  lower: 'rgb(253, 95, 95, 0.6)',
  middle: 'rgb(248,212,122, 0.6)',
  upper: 'rgb(86,127,100, 0.6)',
};

export default function RadialBarSmall({ value, maxValue, tier }) {
  const [searchParams] = useSearchParams();
  const [testValue, setTestValue] = React.useState(0);
  //const [plugins, setPlugins] = React.useState({ id: 'centerLabel', beforeDraw: function (chart) {} });
  const theme = useTheme();
  const chartRef = React.useRef();
  const isDarkMode = theme.palette.mode === 'dark';
  const valuePerMeasure = 100 / maxValue;
  const displayValue = (value / maxValue) * 100;
  const emptyValue = ((maxValue - value) / maxValue) * 100;

  const colors = isDarkMode ? barColorsDark : barColors;

  useEffect(() => {
    if (value !== undefined) {
      const chart = chartRef.current;
      if (chart) {
        //setPlugins(
      }
    }
  }, [value]);

  const plugins = {
    id: 'centerLabel',
    beforeDraw: function (chart) {
      var width = chart.width,
        height = chart.height,
        ctx = chart.ctx;
      ctx.restore();
      var fontSize = (height / 30).toFixed(2);
      ctx.font = fontSize + 'em sans-serif';
      ctx.fillStyle = theme.palette.text.primary;
      //ctx.textBaseline = 'center';
      var text = value,
        textX = Math.round((width - ctx.measureText(text).width) / 2),
        textY = height / 1.5;
      ctx.fillText(text, textX, textY);
      ctx.save();
    },
  };

  const options = {
    responsive: true,
    cutout: '80%',

    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
  };

  const chartData = {
    labels: ['Red', 'Blue'],
    datasets: [
      {
        label: '# of Votes',
        data: [displayValue, emptyValue],
        backgroundColor: [colors[tier], 'rgba(54, 162, 235, 0.0)'],
        borderRadius: 20,
        borderWidth: 0,
      },
    ],
  };

  return <Doughnut options={options} data={chartData} ref={chartRef} plugins={[plugins]} redraw />;
}
