import Select from '@/components/Select';
import { thresholdFilterState } from '@/state/thresholdFilterState';
import { useRecoilState } from 'recoil';

const options = [
  { id: 0, label: 'All Measures', value: 0 },
  { id: 3, label: 'Measures < 3 pts from next threshold', value: 3 }
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
