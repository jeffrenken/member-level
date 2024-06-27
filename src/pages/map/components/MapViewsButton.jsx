import AutocompleteButton from '@/components/Autocomplete';
import { useLocation, useNavigate } from 'react-router-dom';

const views = [
  {
    id: 'countied',
    label: 'Counties',
    url: '/map'
  },
  {
    id: 'zipcodes',
    label: 'Zip Codes',
    url: '/map-zipcodes'
  },

  {
    id: 'census',
    label: 'Census Tracts',
    url: '/map-census'
  }
];
export default function MapViewsButton() {
  const navigate = useNavigate();
  const location = useLocation();

  const selectedView = views.find((view) => view.url === location.pathname);
  return (
    <AutocompleteButton
      label={selectedView ? selectedView.label : 'Map Views'}
      autocompleteProps={{
        id: 'map-views',
        options: views,
        getOptionLabel: (option) => option.label,
        autoHighlight: true,
        openOnFocus: true,
        value: selectedView,
        onChange: (event, newValue) => navigate(newValue.url),
        isOptionEqualToValue: (option, value) => option.id === value.id
      }}
    />
  );
}
