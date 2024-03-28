import useMeasures from '@/api/useMeasures';
import { useParams } from 'react-router-dom';

export default function Measure() {
  const params = useParams();
  const id = parseInt(params.id);
  const { data: measures, isLoading } = useMeasures();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const measure = measures.find((measure) => measure.id === id);
  return <div>{measure?.label}</div>;
}
