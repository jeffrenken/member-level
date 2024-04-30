import Select from '@/components/Select';
import { thresholdFilterState } from '@/state/thresholdFilterState';
import { useRecoilState } from 'recoil';

const options = [
  { id: 0, label: 'All Measures', value: 0 },
  { id: 1, label: 'Measures < 1 pt from next threshold', value: 1 },
  { id: 3, label: 'Measures < 3 pts from next threshold', value: 3 },
  { id: 5, label: 'Measures < 5 pts from next threshold', value: 5 },
  { id: 25, label: 'Measures < 25-Remove (proof it works)', value: 25 }
];

export default function ThresholdSelect() {
  const [selectedValue, setSelectedValue] = useRecoilState(thresholdFilterState);

  const handleSelect = (e, value) => {
    if (!isNaN(value)) {
      setSelectedValue(value);
    }
  };

  return <Select options={options} value={selectedValue} onChange={handleSelect} />;
}
