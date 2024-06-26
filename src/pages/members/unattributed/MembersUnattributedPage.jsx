import { useFilteredMembers } from '@/api';
import { useMemo } from 'react';
import MembersLayout from '../MembersLayout';

const filters = ['contract', 'measureStatus'];
export default function MembersUnattributedPage() {
  const { filteredMembers } = useFilteredMembers(filters);
  const members = useMemo(() => {
    if (!filteredMembers) {
      return null;
    }
    return filteredMembers.filter((member) => !member.providerGroup);
  }, [filteredMembers]);
  return (
    <>
      <MembersLayout title="Unattributed Members" members={members} filters={filters} />
    </>
  );
}
