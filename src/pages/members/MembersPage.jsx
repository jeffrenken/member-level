import { useFilteredMembers } from '@/api';
import MembersLayout from './MembersLayout';

const filters = ['contract', 'measureStatus'];

function MembersPage() {
  const { filteredMembers } = useFilteredMembers(filters);

  return (
    <>
      <MembersLayout title="Members" members={filteredMembers} filters={filters} />
    </>
  );
}

export const Component = MembersPage;
