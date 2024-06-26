import updateSearchParamsWithoutNavigation from '@/helpers/updateSearchParamsWithoutNavigation';
import { useSearchParams } from 'react-router-dom';
import { useMemo, useState, useEffect } from 'react';
import { TextField, Skeleton, Autocomplete, Typography, Box } from '@/components';

const useCustomSearchParams = () => {
  const [search, setSearch] = useSearchParams();
  const searchAsObject = Object.fromEntries(new URLSearchParams(search));

  return [searchAsObject, setSearch];
};

export default function SidebarAutocomplete({ options, label, name, isLoading }) {
  const [searchParams, setSearchParams] = useCustomSearchParams();
  const [selected, setSelected] = useState(searchParams[name] || '');
  const selectedItems = useMemo(
    () =>
      items.filter((item) => {
        return item.id.toString() === selected;
      }),
    [selected]
  );

  useEffect(() => {
    setSelected(searchParams[name] || '');
  }, [searchParams, name]);

  const handleChange = (_, newValue) => {
    /* let value = '';
    if (newValue) {
      value = newValue?.id.toString();
    } */
    //updateSearchParamsWithoutNavigation(name, value);
    setSearchParams({ ...searchParams, [name]: newValue.id });
    //setSelected(value);
  };

  if (isLoading) {
    return <Skeleton variant="rounded" width={210} height={60} />;
  }

  return (
    <Box
      sx={{
        //borderRadius: `${customization.borderRadius}px`,
        mb: 0.5,
        alignItems: 'flex-start',
        pt: 1.25,
        px: `12px`
      }}
    >
      <Typography mb={0.5} ml={1} align="left">
        {label}
      </Typography>
      <Autocomplete
        disablePortal
        id="combo-box-demo"
        options={options}
        value={options.find((item) => item.id === parseInt(searchParams[name])) || null}
        //sx={{ width: "100%" }}
        fullWidth
        renderInput={(params) => <TextField {...params} />}
        autoHighlight
        onChange={handleChange}
        disableClearable
      />
    </Box>
  );
}

const items = [
  { id: 1, label: 'H1234' },
  { id: 2, label: 'H1235' },
  { id: 3, label: 'H1236' },
  { id: 4, label: 'H1237' },
  { id: 5, label: 'H1238' },
  { id: 6, label: 'H1239' },
  { id: 7, label: 'H1240' },
  { id: 8, label: 'H1241' },
  { id: 9, label: 'H1242' },
  { id: 10, label: 'H1243' },
  { id: 11, label: 'H1244' },
  { id: 12, label: 'H1245' },
  { id: 13, label: 'H1246' },
  { id: 14, label: 'H1247' },
  { id: 15, label: 'H1248' },
  { id: 16, label: 'H1249' },
  { id: 17, label: 'H1250' },
  { id: 18, label: 'H1251' },
  { id: 19, label: 'H1252' },
  { id: 20, label: 'H1253' },
  { id: 21, label: 'H1254' },
  { id: 22, label: 'H1255' },
  { id: 23, label: 'H1256' },
  { id: 24, label: 'H1257' },
  { id: 25, label: 'H1258' },
  { id: 26, label: 'H1259' },
  { id: 27, label: 'H1260' },
  { id: 28, label: 'H1261' },
  { id: 29, label: 'H1262' },
  { id: 30, label: 'H1263' },
  { id: 31, label: 'H1264' },
  { id: 32, label: 'H1265' },
  { id: 33, label: 'H1266' },
  { id: 34, label: 'H1267' }
];
