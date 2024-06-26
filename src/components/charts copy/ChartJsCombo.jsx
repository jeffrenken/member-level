import React, { useEffect } from 'react';
import {
  Chart as ChartJS,
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
  LineController,
  BarController,
} from 'chart.js';
import { Chart } from 'react-chartjs-2';
import { useTheme } from '@/hooks';

ChartJS.register(
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
  LineController,
  BarController
);
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

//const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
const months = [
  {
    name: 'Jan',
    index: 1,
    lower: 33,
    middle: 33,
    upper: 33,
    value: 23,
  },
  {
    name: 'Feb',
    index: 2,
    lower: 31,
    middle: 35,
    upper: 33,
    value: 33,
  },
  {
    name: 'Mar',
    index: 3,
    lower: 38,
    middle: 33,
    upper: 28,
    value: 43,
  },
  {
    name: 'Apr',
    index: 4,
    lower: 23,
    middle: 33,
    upper: 43,
    value: 23,
  },
  {
    name: 'May',
    index: 5,
    lower: 33,
    middle: 33,
    upper: 33,
    value: 33,
  },
  {
    name: 'Jun',
    index: 6,
    lower: 30,
    middle: 33,
    upper: 36,
    value: 21,
  },
  {
    name: 'Jul',
    index: 7,
    lower: 33,
    middle: 33,
    upper: 33,
    value: 45,
  },
  {
    name: 'Aug',
    index: 8,
    lower: 37,
    middle: 33,
    upper: 29,
    value: 23,
  },
  {
    name: 'Sep',
    index: 9,
    lower: 40,
    middle: 33,
    upper: 26,
    value: 43,
  },
  {
    name: 'Oct',
    index: 10,
    lower: 43,
    middle: 33,
    upper: 23,
    value: 66,
  },
  {
    name: 'Nov',
    index: 11,
    lower: 43,
    middle: 33,
    upper: 23,
    value: 55,
  },
  {
    name: 'Dec',
    index: 12,
    lower: 33,
    middle: 33,
    upper: 33,
    value: 22,
  },
];

function threeValuesThatAddUpTo100() {
  const values = [];
  let sum = 0;
  while (sum < 100) {
    const value = Math.floor(Math.random() * 100);
    sum += value;
    values.push(value);
  }
  return values;
}

const getOrCreateTooltip = (chart) => {
  let tooltipEl = chart.canvas.parentNode.querySelector('div');

  if (!tooltipEl) {
    tooltipEl = document.createElement('div');
    tooltipEl.style.background = 'rgba(0, 0, 0, 0.7)';
    tooltipEl.style.borderRadius = '3px';
    tooltipEl.style.color = 'white';
    tooltipEl.style.opacity = 1;
    tooltipEl.style.pointerEvents = 'none';
    tooltipEl.style.position = 'absolute';
    tooltipEl.style.transform = 'translate(-50%, 0)';
    tooltipEl.style.transition = 'all .1s ease';

    const table = document.createElement('table');
    table.style.margin = '0px';

    tooltipEl.appendChild(table);
    chart.canvas.parentNode.appendChild(tooltipEl);
  }

  return tooltipEl;
};

const externalTooltipHandler = (context, data) => {
  // Tooltip Element
  const { chart, tooltip } = context;
  const tooltipEl = getOrCreateTooltip(chart);
  const measureData = data.find((d) => d.name === tooltip.dataPoints[0].label);

  // Hide if no tooltip
  if (tooltip.opacity === 0) {
    tooltipEl.style.opacity = 0;
    return;
  }

  // Set Text
  if (tooltip.body) {
    const titleLines = tooltip.title || [];
    const bodyLines = tooltip.body.map((b) => b.lines);

    const tableHead = document.createElement('thead');

    titleLines.forEach((title) => {
      const tr = document.createElement('tr');
      tr.style.borderWidth = 0;

      const th = document.createElement('th');
      th.style.borderWidth = 0;
      const text = document.createTextNode(title);

      th.appendChild(text);
      tr.appendChild(th);
      tableHead.appendChild(tr);
    });

    const tableBody = document.createElement('tbody');
    bodyLines.forEach((body, i) => {
      const colors = tooltip.labelColors[i];

      const span = document.createElement('span');
      span.style.background = colors.backgroundColor;
      span.style.borderColor = colors.borderColor;
      span.style.borderWidth = '2px';
      span.style.marginRight = '10px';
      span.style.height = '10px';
      span.style.width = '10px';
      span.style.display = 'inline-block';

      const tr = document.createElement('tr');
      tr.style.backgroundColor = 'inherit';
      tr.style.borderWidth = 0;

      const td = document.createElement('td');
      td.style.borderWidth = 0;

      const text = document.createTextNode(body);

      td.appendChild(span);
      td.appendChild(text);
      tr.appendChild(td);
      tableBody.appendChild(tr);
    });

    const tableRoot = tooltipEl.querySelector('table');

    // Remove old children
    while (tableRoot.firstChild) {
      tableRoot.firstChild.remove();
    }

    // Add new children
    tableRoot.appendChild(tableHead);
    tableRoot.appendChild(tableBody);
  }

  const { offsetLeft: positionX, offsetTop: positionY } = chart.canvas;

  // Display, position, and set styles for font
  tooltipEl.style.opacity = 1;
  tooltipEl.style.left = positionX + tooltip.caretX + 'px';
  tooltipEl.style.top = positionY + tooltip.caretY + 'px';
  tooltipEl.style.font = tooltip.options.bodyFont.string;
  tooltipEl.style.padding = tooltip.options.padding + 'px ' + tooltip.options.padding + 'px';
};

function createFakeData(data, value) {
  const lowerBand = data.bottom_third_upper_value - data.bottom_third_lower_value;
  const middleBand = data.middle_third_upper_value - data.middle_third_lower_value;
  const upperBand = data.top_third_upper_value - data.top_third_lower_value;

  let d = months.map((m, i) => {
    const randomNumberBetween0And5 = Math.floor(Math.random() * 5);
    const randomLineValueBetween0And5 = Math.floor(Math.random() * 5);
    const plusOrMinus = Math.random() < 0.5 ? -1 : 1;
    const randomValue = randomNumberBetween0And5 * plusOrMinus;
    const lineChange = randomLineValueBetween0And5 * plusOrMinus;
    const lineValue = value + lineChange < 0 ? 0 : value + lineChange;

    if (i === months.length - 1) {
      //last month match actual value
      return {
        name: m.name,
        lower: lowerBand,
        middle: middleBand,
        upper: upperBand,
        value: value,
      };
    }
    return {
      name: m.name,
      lower: lowerBand + randomValue,
      middle: middleBand,
      upper: upperBand - randomValue,
      value: lineValue,
    };
  });
  return d;
}

export default function ChartJsCombo({ data, title }) {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  //fake data is just a single month--should be an array of 12
  const [fakeData, setFakeData] = React.useState([]);
  ChartJS.defaults.color = theme.palette.text.primary;
  ChartJS.defaults.borderColor = isDarkMode ? theme.palette.grey[800] : theme.palette.grey[300];
  ChartJS.defaults.font.family = 'Poppins';

  useEffect(() => {
    if (data?.measure) {
      setFakeData(createFakeData(data.measure, data['SRF Score']));
    } else {
      setFakeData(createFakeData({ lower: 0, middle: 0, upper: 0, value: 0 }, 0));
    }
  }, [data]);

  //colors are not good
  const blue = isDarkMode ? 'rgb(53, 162, 235, 1)' : 'rgba(53, 162, 235, 0.5)';
  const red = isDarkMode ? 'rgb(253, 95, 95, 0.7)' : 'rgba(255, 99, 132, 0.6)';
  const yellow = isDarkMode ? 'rgb(248, 211, 122, 0.8)' : 'rgba(255, 205, 86, 0.6)';
  const green = isDarkMode ? 'rgb(86,127,100, 0.9)' : 'rgba(86,152,109,0.6)';
  const borderColor = isDarkMode ? 'rgba(100, 100, 100, 1)' : 'rgba(230, 230, 230, 1)';
  const options = {
    plugins: {
      title: {
        display: false,
        //text: title + ' by month'
      },
      legend: {
        display: true,
      },
      animations: {
        radius: {
          duration: 400,
          easing: 'linear',
          loop: (context) => context.active,
        },
      },
      tooltip: {
        filter: (item) => item.datasetIndex === 0,
        //custom is possible, but was going to take a while. So only showing My Contract now
        //enabled: false,
        //position: 'nearest',
        //external: (context) => externalTooltipHandler(context, fakeData),
      },
    },
    maintainAspectRatio: false,
    responsive: true,
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
      },
    },
  };

  const labels = fakeData.map((month) => month.name);

  const datasets = {
    labels,
    datasets: [
      {
        type: 'line',
        label: 'My Contract',
        borderColor: blue,
        backgroundColor: blue,
        borderWidth: 2,
        fill: false,
        data: fakeData.map((month) => month.value),
        cubicInterpolationMode: 'monotone',
      },
      {
        type: 'bar',
        label: 'Lower Threshold',
        backgroundColor: red,
        data: fakeData.map((month) => month.lower),
        borderColor: borderColor,
        borderWidth: 2,
        stack: 'bar-stacked',
      },
      {
        type: 'bar',
        label: 'Middle Threshold',
        backgroundColor: yellow,
        data: fakeData.map((month) => month.middle),
        borderColor: borderColor,
        borderWidth: 2,
        stack: 'bar-stacked',
      },
      {
        type: 'bar',
        label: 'Upper Threshold',
        backgroundColor: green,
        data: fakeData.map((month) => month.upper),
        borderColor: borderColor,
        borderWidth: 2,
        stack: 'bar-stacked',
      },
    ],
  };

  return <Chart type='bar' data={datasets} options={options} />;
}
