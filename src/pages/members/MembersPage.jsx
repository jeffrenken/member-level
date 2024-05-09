import useFilteredMembers from '@/api/useFilteredMembers';
import MembersLayout from './MembersLayout';

const filters = ['contract', 'measureStatus'];

export default function MembersPage() {
  const { filteredMembers } = useFilteredMembers(filters);

  return (
    <>
      <MembersLayout title="Members" members={filteredMembers} filters={filters} />
    </>
  );
}
