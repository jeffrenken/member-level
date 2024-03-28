import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import updateSearchParamsWithoutNavigation from '@/helpers/updateSearchParamsWithoutNavigation';
import { useSearchParams } from 'react-router-dom';
import { useMemo, useState, useEffect } from 'react';
import { measures } from '../../../data';

const name = 'measure';

export default function MeasureAutocomplete() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selected, setSelected] = useState(searchParams.get(name) || '');
  const selectedItems = useMemo(
    () =>
      measures.filter((item) => {
        return item.value.toString() === selected;
      }),
    [selected]
  );

  useEffect(() => {
    setSelected(searchParams.get(name) || '');
  }, [searchParams]);

  const handleChange = (_, newValue) => {
    let value = '';
    if (newValue) {
      value = newValue?.value.toString();
    }
    //setSearchParams({ ...searchParams, [name]: value });

    updateSearchParamsWithoutNavigation(name, value);
    setSelected(value);
  };

  return (
    <Autocomplete
      disablePortal
      id="combo-box-demo"
      options={measures}
      value={selectedItems[0] || null}
      //sx={{ width: "100%" }}
      fullWidth
      renderInput={(params) => <TextField {...params} label="Measure" />}
      autoHighlight
      onChange={handleChange}
    />
  );
}
