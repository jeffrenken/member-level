import useFilteredMembers from '@/api/useFilteredMembers';
import { useMemo } from 'react';
import MembersLayout from '../MembersLayout';

const filters = ['contract', 'measureStatus'];
export default function MembersUnattributedPage() {
  const { filteredMembers } = useFilteredMembers(filters);
  console.log('filteredMembers', filteredMembers);

  const members = useMemo(() => {
    if (!filteredMembers) {
      return null;
    }
    return filteredMembers.filter((member) => !member.providerGroup);
  }, [filteredMembers]);
  console.log('members', members);

  return (
    <>
      <MembersLayout title="Unattributed Members" members={members} filters={filters} />
    </>
  );
}
