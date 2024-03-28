import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import updateSearchParamsWithoutNavigation from '@/helpers/updateSearchParamsWithoutNavigation';
import { useSearchParams } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';

const name = 'state';

export default function StatesAutocomplete() {
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
      renderInput={(params) => <TextField {...params} label="State" />}
      autoHighlight
      onChange={handleChange}
    />
  );
}

const items = [
  { id: 1, label: 'Alabama' },
  { id: 2, label: 'Alaska' },
  { id: 3, label: 'Arizona' },
  { id: 4, label: 'Arkansas' },
  { id: 5, label: 'California' },
  { id: 6, label: 'Colorado' },
  { id: 7, label: 'Connecticut' },
  { id: 8, label: 'Delaware' },
  { id: 9, label: 'Florida' },
  { id: 10, label: 'Georgia' },
  { id: 11, label: 'Hawaii' },
  { id: 12, label: 'Idaho' },
  { id: 13, label: 'Illinois' },
  { id: 14, label: 'Indiana' },
  { id: 15, label: 'Iowa' },
  { id: 16, label: 'Kansas' },
  { id: 17, label: 'Kentucky' },
  { id: 18, label: 'Louisiana' },
  { id: 19, label: 'Maine' },
  { id: 20, label: 'Maryland' },
  { id: 21, label: 'Massachusetts' },
  { id: 22, label: 'Michigan' },
  { id: 23, label: 'Minnesota' },
  { id: 24, label: 'Mississippi' },
  { id: 25, label: 'Missouri' },
  { id: 26, label: 'Montana' },
  { id: 27, label: 'Nebraska' },
  { id: 28, label: 'Nevada' },
  { id: 29, label: 'New Hampshire' },
  { id: 30, label: 'New Jersey' },
  { id: 31, label: 'New Mexico' },
  { id: 32, label: 'New York' },
  { id: 33, label: 'North Carolina' },
  { id: 34, label: 'North Dakota' },
  { id: 35, label: 'Ohio' },
  { id: 36, label: 'Oklahoma' },
  { id: 37, label: 'Oregon' },
  { id: 38, label: 'Pennsylvania' },
  { id: 39, label: 'Rhode Island' },
  { id: 40, label: 'South Carolina' },
  { id: 41, label: 'South Dakota' },
  { id: 42, label: 'Tennessee' },
  { id: 43, label: 'Texas' },
  { id: 44, label: 'Utah' },
  { id: 45, label: 'Vermont' },
  { id: 46, label: 'Virginia' },
  { id: 47, label: 'Washington' },
  { id: 48, label: 'West Virginia' },
  { id: 49, label: 'Wisconsin' },
  { id: 50, label: 'Wyoming' }
];
