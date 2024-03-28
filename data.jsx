import testData from './bob_initial_data.json';
import hlCodes from './hl_codes.json';

function fetchItems(attribute) {
  // get distinct contracts from data
  const options = [];
  testData.forEach((item) => {
    if (!options.find((option) => option.value === item[attribute]) && item[attribute]) {
      options.push({ value: item[attribute], label: item[attribute] });
    }
  });
  //sort highest to lowest
  options.sort((a, b) => (a.label < b.label ? 1 : -1));
  return options;
}

export const contracts = fetchItems('contract');

export const years = fetchItems('year');

export const planTypes = [
  { value: 'HMO', label: 'HMO' },
  { value: 'PPO', label: 'PPO' },
  { value: 'POS', label: 'POS' }
];

export const ratings = [
  { value: '1', label: '1' },
  { value: '2', label: '2' },
  { value: '3', label: '3' },
  { value: '4', label: '4' },
  { value: '5', label: '5' }
];

export const measures = hlCodes.map((hlCode) => ({
  label: hlCode.stars_measure,
  value: hlCode.hl_code
}));

export const sidebarFilteredData = (year, contract) => {
  // const year = useRecoilValue(yearState);
  // const contract = useRecoilValue(contractState);
  const d = testData.filter((item) => item.year === Number(year) && item.contract === contract);
  return d;
};

/* {id: 1, value: 1, label: "Measure 1", ytdImprovement: "90.00", year: 2021, contractID: 123123},
    {id: 2, value: 2, label: "Measure 2", ytdImprovement: "80.00", year: 2021, contractID: 123123},
    {id: 3, value: 3, label: "Measure 3", ytdImprovement: "70.00", year: 2021, contractID: 123123},
    {id: 4, value: 4, label: "Measure 4", ytdImprovement: "60.00", year: 2021, contractID: 123123},
    {id: 5, value: 5, label: "Measure 5", ytdImprovement: "50.00", year: 2021, contractID: 123123},
    {id: 6, value: 6, label: "Measure 6", ytdImprovement: "40.00", year: 2021, contractID: 123123},
    {id: 7, value: 7, label: "Measure 7", ytdImprovement: "30.00", year: 2021, contractID: 123123},
    {id: 8, value: 8, label: "Measure 8", ytdImprovement: "20.00", year: 2021, contractID: 123123},
    {id: 9, value: 9, label: "Measure 9", ytdImprovement: "10.00", year: 2021, contractID: 123123},
    {id: 10, value: 10, label: "Measure 10", ytdImprovement: "0.00", year: 2021, contractID: 123123},
    {id: 11, value: 11, label: "Measure 1", ytdImprovement: "88.00", year: 2022, contractID: 123123},
    {id: 12, value: 12, label: "Measure 2", ytdImprovement: "77.00", year: 2022, contractID: 123123},
    {id: 13, value: 13, label: "Measure 3", ytdImprovement: "66.00", year: 2022, contractID: 123123},
    {id: 14, value: 14, label: "Measure 4", ytdImprovement: "55.00", year: 2022, contractID: 123123},
    {id: 15, value: 15, label: "Measure 5", ytdImprovement: "44.00", year: 2022, contractID: 123123},
    {id: 16, value: 16, label: "Measure 6", ytdImprovement: "33.00", year: 2022, contractID: 123123},
    {id: 17, value: 17, label: "Measure 7", ytdImprovement: "22.00", year: 2022, contractID: 123123},
    {id: 18, value: 18, label: "Measure 8", ytdImprovement: "11.00", year: 2022, contractID: 123123},
    {id: 19, value: 19, label: "Measure 9", ytdImprovement: "6.00", year: 2022, contractID: 123123},
    {id: 20, value: 20, label: "Measure 10", ytdImprovement: "97.00", year: 2022, contractID: 123123},
    {id: 21, value: 21, label: "Measure 1", ytdImprovement: "96.00", year: 2023, contractID: 123123},
    {id: 22, value: 22, label: "Measure 2", ytdImprovement: "76.00", year: 2023, contractID: 123123},
    {id: 23, value: 23, label: "Measure 3", ytdImprovement: "65.00", year: 2023, contractID: 123123},
    {id: 24, value: 24, label: "Measure 4", ytdImprovement: "54.00", year: 2023, contractID: 123123},
    {id: 25, value: 25, label: "Measure 5", ytdImprovement: "43.00", year: 2023, contractID: 123123},
    {id: 26, value: 26, label: "Measure 6", ytdImprovement: "32.00", year: 2023, contractID: 123123},
    {id: 27, value: 27, label: "Measure 7", ytdImprovement: "21.00", year: 2023, contractID: 123123},
    {id: 28, value: 28, label: "Measure 8", ytdImprovement: "20.00", year: 2023, contractID: 123123},
    {id: 29, value: 29, label: "Measure 9", ytdImprovement: "19.00", year: 2023, contractID: 123123},
    {id: 30, value: 30, label: "Measure 10", ytdImprovement: "10.00", year: 2023, contractID: 123123}, */

export const measuresOld = [
  {
    id: 1,
    value: 1,
    label: 'Measure 1',
    ytdImprovement: '90.00',
    year: 2021,
    contractID: 123123
  },
  {
    id: 2,
    value: 2,
    label: 'Measure 2',
    ytdImprovement: '80.00',
    year: 2021,
    contractID: 123123
  },
  {
    id: 3,
    value: 3,
    label: 'Measure 3',
    ytdImprovement: '70.00',
    year: 2021,
    contractID: 123123
  },
  {
    id: 4,
    value: 4,
    label: 'Measure 4',
    ytdImprovement: '60.00',
    year: 2021,
    contractID: 123123
  },
  {
    id: 5,
    value: 5,
    label: 'Measure 5',
    ytdImprovement: '50.00',
    year: 2021,
    contractID: 123123
  },
  {
    id: 6,
    value: 6,
    label: 'Measure 6',
    ytdImprovement: '40.00',
    year: 2021,
    contractID: 123123
  },
  {
    id: 7,
    value: 7,
    label: 'Measure 7',
    ytdImprovement: '30.00',
    year: 2021,
    contractID: 123123
  },
  {
    id: 8,
    value: 8,
    label: 'Measure 8',
    ytdImprovement: '20.00',
    year: 2021,
    contractID: 123123
  },
  {
    id: 9,
    value: 9,
    label: 'Measure 9',
    ytdImprovement: '10.00',
    year: 2021,
    contractID: 123123
  },
  {
    id: 10,
    value: 10,
    label: 'Measure 10',
    ytdImprovement: '0.00',
    year: 2021,
    contractID: 123123
  },
  {
    id: 11,
    value: 11,
    label: 'Measure 1',
    ytdImprovement: '88.00',
    year: 2022,
    contractID: 123123
  },
  {
    id: 12,
    value: 12,
    label: 'Measure 2',
    ytdImprovement: '77.00',
    year: 2022,
    contractID: 123123
  },
  {
    id: 13,
    value: 13,
    label: 'Measure 3',
    ytdImprovement: '66.00',
    year: 2022,
    contractID: 123123
  },
  {
    id: 14,
    value: 14,
    label: 'Measure 4',
    ytdImprovement: '55.00',
    year: 2022,
    contractID: 123123
  },
  {
    id: 15,
    value: 15,
    label: 'Measure 5',
    ytdImprovement: '44.00',
    year: 2022,
    contractID: 123123
  },
  {
    id: 16,
    value: 16,
    label: 'Measure 6',
    ytdImprovement: '33.00',
    year: 2022,
    contractID: 123123
  },
  {
    id: 17,
    value: 17,
    label: 'Measure 7',
    ytdImprovement: '22.00',
    year: 2022,
    contractID: 123123
  },
  {
    id: 18,
    value: 18,
    label: 'Measure 8',
    ytdImprovement: '11.00',
    year: 2022,
    contractID: 123123
  },
  {
    id: 19,
    value: 19,
    label: 'Measure 9',
    ytdImprovement: '6.00',
    year: 2022,
    contractID: 123123
  },
  {
    id: 20,
    value: 20,
    label: 'Measure 10',
    ytdImprovement: '97.00',
    year: 2022,
    contractID: 123123
  },
  {
    id: 21,
    value: 21,
    label: 'Measure 1',
    ytdImprovement: '96.00',
    year: 2023,
    contractID: 123123
  },
  {
    id: 22,
    value: 22,
    label: 'Measure 2',
    ytdImprovement: '76.00',
    year: 2023,
    contractID: 123123
  },
  {
    id: 23,
    value: 23,
    label: 'Measure 3',
    ytdImprovement: '65.00',
    year: 2023,
    contractID: 123123
  },
  {
    id: 24,
    value: 24,
    label: 'Measure 4',
    ytdImprovement: '54.00',
    year: 2023,
    contractID: 123123
  },
  {
    id: 25,
    value: 25,
    label: 'Measure 5',
    ytdImprovement: '43.00',
    year: 2023,
    contractID: 123123
  },
  {
    id: 26,
    value: 26,
    label: 'Measure 6',
    ytdImprovement: '32.00',
    year: 2023,
    contractID: 123123
  },
  {
    id: 27,
    value: 27,
    label: 'Measure 7',
    ytdImprovement: '21.00',
    year: 2023,
    contractID: 123123
  },
  {
    id: 28,
    value: 28,
    label: 'Measure 8',
    ytdImprovement: '20.00',
    year: 2023,
    contractID: 123123
  },
  {
    id: 29,
    value: 29,
    label: 'Measure 9',
    ytdImprovement: '19.00',
    year: 2023,
    contractID: 123123
  },
  {
    id: 30,
    value: 30,
    label: 'Measure 10',
    ytdImprovement: '10.00',
    year: 2023,
    contractID: 123123
  }
];
