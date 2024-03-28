import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import updateSearchParamsWithoutNavigation from '@/helpers/updateSearchParamsWithoutNavigation';
import { useSearchParams } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';

const name = 'year';

export default function YearAutocomplete() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selected, setSelected] = useState(searchParams.get(name) || '');
  const selectedItems = useMemo(
    () =>
      items.filter((item) => {
        return item.id.toString() === selected;
      }),
    [selected]
  );

  useEffect(() => {
    setSelected(searchParams.get(name) || '');
  }, [searchParams]);

  const handleChange = (_, newValue) => {
    let value = '';
    if (newValue) {
      value = newValue?.id.toString();
    }
    //setSearchParams({ ...searchParams, [name]: value });

    updateSearchParamsWithoutNavigation(name, value);
    setSelected(value);
  };

  return (
    <Autocomplete
      disablePortal
      id="combo-box-demo"
      options={items}
      value={selectedItems[0] || null}
      //sx={{ width: 200 }}
      fullWidth
      renderInput={(params) => <TextField {...params} label="Year" />}
      autoHighlight
      onChange={handleChange}
    />
  );
}

const items = [
  { id: 1, label: '2000' },
  { id: 2, label: '2001' },
  { id: 3, label: '2002' },
  { id: 4, label: '2003' },
  { id: 5, label: '2004' },
  { id: 6, label: '2005' },
  { id: 7, label: '2006' },
  { id: 8, label: '2007' },
  { id: 9, label: '2008' },
  { id: 10, label: '2009' },
  { id: 11, label: '2010' },
  { id: 12, label: '2011' },
  { id: 13, label: '2012' },
  { id: 14, label: '2013' },
  { id: 15, label: '2014' },
  { id: 16, label: '2015' },
  { id: 17, label: '2016' },
  { id: 18, label: '2017' },
  { id: 19, label: '2018' },
  { id: 20, label: '2019' },
  { id: 21, label: '2020' },
  { id: 22, label: '2021' },
  { id: 23, label: '2022' },
  { id: 24, label: '2023' },
  { id: 25, label: '2024' }
];
