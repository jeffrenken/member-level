import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import updateSearchParamsWithoutNavigation from '@/helpers/updateSearchParamsWithoutNavigation';
import { useSearchParams } from 'react-router-dom';
import { useMemo, useState, useEffect } from 'react';
import useMeasures from '@/api/useMeasures';
import { useRecoilState } from 'recoil';
import { measureState } from '@/state/measureState';

const useCustomSearchParams = () => {
  const [search, setSearch] = useSearchParams();
  const searchAsObject = Object.fromEntries(new URLSearchParams(search));

  return [searchAsObject, setSearch];
};

const name = 'measure';

export default function MeasureAutocomplete() {
  const [searchParams, setSearchParams] = useCustomSearchParams();
  const [selected, setSelected] = useState(searchParams[name] || '');
  const { data: measures, isLoading } = useMeasures();
  const [selectedMeasure, setSelectedMeasure] = useRecoilState(measureState);

  useEffect(() => {
    if (measures.length && !selectedMeasure) {
      setSelectedMeasure(measures[0].id);
    }
  }, [measures, selectedMeasure]);

  /*   const selectedItems = useMemo(
    () =>
      measures.filter((item) => {
        return item.value.toString() === selected;
      }),
    [selected]
  ); */

  /* useEffect(() => {
    setSelected(searchParams[name] || '');
  }, [searchParams, name]); */

  const handleChange = (_, newValue) => {
    /*  let value = '';
    if (newValue) {
      value = newValue?.id.toString();
    } */
    //updateSearchParamsWithoutNavigation(name, value);
    setSelectedMeasure(newValue.id);
    //setSearchParams({ ...searchParams, [name]: newValue.id });
    //setSelected(value);
  };

  return (
    <Autocomplete
      loading={isLoading}
      options={measures}
      disableClearable
      //value={measures?.find((item) => item.id.toString() === searchParams[name]) || null}
      value={measures?.find((item) => item.id === selectedMeasure) || null}
      //sx={{ width: "100%" }}
      fullWidth
      renderInput={(params) => <TextField {...params} label="Measure" />}
      autoHighlight
      onChange={handleChange}
    />
  );
}
