import useFilteredMembers from '@/api/useFilteredMembers';
import MembersLayout from './MembersLayout';

const filters = ['contract'];

export default function MembersPage() {
  const { filteredMembers } = useFilteredMembers(filters);

  return (
    <>
      <MembersLayout title="All Members" members={filteredMembers} />
    </>
  );
}
