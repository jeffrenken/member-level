import useMeasures from '@/api/useMeasures';
import AutocompleteButton from '@/components/Autocomplete';
import { measuresFilterState } from '@/state/measuresFilterState';

import { useRecoilState } from 'recoil';

export default function MeasuresAutocomplete() {
  const [measuresState, setMeasuresState] = useRecoilState(measuresFilterState);
  const { data: measures } = useMeasures();

  const handleMeasuresChange = (e, value) => {
    let newValues = value.map((v) => {
      if (typeof v === 'object') {
        return v.id;
      }
      return v;
    });

    if (e.target.getAttribute('name') === 'all' && newValues.includes(0)) {
      newValues = [0, ...measures.map((m) => m.id)];
      setMeasuresState(newValues);
      return;
    }
    if (e.target.getAttribute('name') === 'all') {
      newValues = [];
      setMeasuresState(newValues);
      return;
    }

    setMeasuresState(newValues);
  };

  let label = 'Select Measures';
  if (measuresState.length) {
    label = 'Select Measures (' + measuresState.length + ')';
  }

  return (
    <AutocompleteButton
      defaultLabel="Measures"
      label={label}
      //withAllOption={'All Measures'}
      buttonProps={{
        name: 'measures',
        color: 'neutral',
        variant: 'outlined',
        size: 'large'
      }}
      autocompleteProps={{
        id: 'measuresStateFilter',
        options: measures,
        getOptionLabel: (option) => option.label,
        autoHighlight: true,
        openOnFocus: true,
        value: measuresState,
        onChange: (event, newValue) => handleMeasuresChange(event, newValue),
        isOptionEqualToValue: (option, value) => {
          return option.id === value;
        },
        multiple: true,
        disableCloseOnSelect: true
      }}
    />
  );
}
