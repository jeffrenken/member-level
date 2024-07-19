import { useFilteredMembers } from '@/api';
import MembersLayout from './MembersLayout';

const filters = ['contract', 'measureStatus'];

function MembersPage() {
  const { filteredMembers } = useFilteredMembers(filters);
  console.log('filteredMembers', filteredMembers);

  return (
    <>
      <MembersLayout title="Members" members={filteredMembers} filters={filters} />
    </>
  );
}

export const Component = MembersPage;
