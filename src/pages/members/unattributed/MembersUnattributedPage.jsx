import useFilteredMembers from '@/api/useFilteredMembers';
import { useMemo } from 'react';
import MembersLayout from '../MembersLayout';

export default function MembersUnattributedPage() {
  const { filteredMembers } = useFilteredMembers(['contract']);
  const members = useMemo(() => {
    if (!filteredMembers) {
      return null;
    }
    return filteredMembers.filter((member) => !member.providerGroup);
  }, [filteredMembers]);

  return (
    <>
      <MembersLayout title="Unattributed Members" members={members} />
    </>
  );
}
