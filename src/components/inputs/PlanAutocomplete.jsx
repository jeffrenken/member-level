import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import updateSearchParamsWithoutNavigation from '@/helpers/updateSearchParamsWithoutNavigation';
import { useSearchParams } from 'react-router-dom';
import { useMemo, useState, useEffect } from 'react';

const name = 'plan';

export default function PlanAutocomplete() {
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
      renderInput={(params) => <TextField {...params} label="Plan Type" />}
      autoHighlight
      onChange={handleChange}
    />
  );
}

const items = [
  { id: 1, label: 'HMO' },
  { id: 2, label: 'PPO' },
  { id: 3, label: 'POS' }
];
