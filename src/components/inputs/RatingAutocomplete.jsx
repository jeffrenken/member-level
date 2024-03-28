import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import updateSearchParamsWithoutNavigation from '@/helpers/updateSearchParamsWithoutNavigation';
import { useSearchParams } from 'react-router-dom';
import { useMemo, useState, useEffect } from 'react';

const name = 'rating';

export default function RatingAutocomplete() {
  const [searchParams] = useSearchParams();
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
    updateSearchParamsWithoutNavigation(name, value);
    setSelected(value);
  };

  return (
    <Autocomplete
      disablePortal
      id="combo-box-demo"
      options={items}
      value={selectedItems[0] || null}
      //sx={{ width: "100%" }}
      fullWidth
      renderInput={(params) => <TextField {...params} label="Rating" />}
      autoHighlight
      onChange={handleChange}
    />
  );
}

const items = [
  { id: 1, label: '2.5' },
  { id: 2, label: '3' },
  { id: 3, label: '3.5' },
  { id: 4, label: '4' },
  { id: 5, label: '4.5' },
  { id: 6, label: '5' }
];
