import React, { useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useTheme } from '@/hooks';
import { useSearchParams } from 'react-router-dom';
import ChartSkeleton from './ChartSkeleton';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function ChartJsBar({ data, otherData, title, mySrfScore, showLegend = true, isLoading }) {
  const [searchParams] = useSearchParams();
  const [testValue, setTestValue] = React.useState(0);
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  ChartJS.defaults.color = theme.palette.text.primary;
  ChartJS.defaults.borderColor = isDarkMode ? theme.palette.grey[800] : theme.palette.grey[300];
  ChartJS.defaults.font.family = 'Poppins';

  //colors are not good
  const red = isDarkMode ? 'rgba(255, 99, 132, 0.4)' : 'rgba(255, 99, 132, 0.6)';
  const blue = isDarkMode ? 'rgb(53, 162, 235, 0.5)' : 'rgba(53, 162, 235, 0.5)';

  function randomInt() {
    const max = 6000;
    return Math.floor(Math.random() * max);
  }

  useEffect(() => {
    const measure = searchParams.get('measure');
    setTestValue(randomInt());
  }, [searchParams]);

  //const sortedData = data.sort((a, b) => (a.Denominator > b.Denominator ? 1 : -1));
  let testData = otherData.map((d) => {
    return { label: 'otherData', value: d['SRF Score'] };
  });

  /*   sortedData.forEach((element) => {
    if (element.Denominator && element.Denominator < 6000 && element.Denominator > 1000) {
      testData.push({ label: 'otherData', value: element.Denominator });
    }
  }); */

  let average = 0;

  if (mySrfScore.length > 0) {
    average = mySrfScore.reduce((a, b) => a + b) / mySrfScore.length;
  }

  testData.filter((d) => d.value >= 0);
  testData.push({ label: 'myData', value: average });

  const labels = testData.map((e) => e.value);
  testData.sort((a, b) => (a.value > b.value ? 1 : -1));

  const filtered = testData.filter((d) => d.value >= 0);

  const myData = filtered.map((d) => {
    if (d.label === 'myData') {
      return d.value;
    } else {
      return 0;
    }
  });

  let delayed;

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        display: showLegend,
      },
      title: {
        display: false,
      },
      tooltip: {
        callbacks: {
          title: function (context) {
            return '';
          },
        },
      },
    },
    animations: {
      radius: {
        duration: 400,
        easing: 'linear',
        loop: (context) => context.active,
      },
    },
    scales: {
      x: {
        ticks: {
          callback: function (val, index) {
            return ''; //remove numbers from x axis
            return val.toFixed(2);
          },
          color: 'red',
        },
        grid: {
          display: false,
        },
      },
    },
  };

  const chartData = {
    labels,
    datasets: [
      {
        label: 'My Contract',
        data: myData,
        barThickness: filtered.length > 7 ? 10 : 'flex',
        backgroundColor: blue,
      },
      {
        label: 'Other Contracts',
        data: filtered.map((d) => d.value),
        backgroundColor: red,
      },
    ],
  };

  if (isLoading) {
    return <ChartSkeleton showLegend={showLegend} />;
  }

  return <Bar options={options} data={chartData} />;
}
