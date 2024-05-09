import { useMemo } from 'react';

export default function useMembersFilteredByMeasures(members, measures) {
  const info = useMemo(() => {
    if (!members.length) {
      return {};
    }

    let m = members.map((member) => {
      return {
        ...member,
        name: member['FIRST NAME'] + ' ' + member['LAST NAME'],
        id: member['MEMBER ID'],
        srf: member.isSrf,
        numberOfGaps: member.measuresOpen.length,
        url: `/members/${member['MEMBER ID']}`,
        date: '2024-01-01'
      };
    });

    const measureNames = measures.map((m) => m['Measure Name']);

    let splitMembers = {};
    splitMembers.all = m;

    if (measureNames.length) {
      splitMembers.closed = m.filter((member) => measureNames.every((m) => member?.measuresClosed.includes(m)));
      splitMembers.open = m.filter((member) => measureNames.every((m) => member?.measuresOpen.includes(m)));
    } else {
      splitMembers.closed = m.filter((member) => member.measuresClosed.length);
      splitMembers.open = m.filter((member) => member.measuresOpen.length);
    }

    let chartScale = [
      [75 / 100, '#d27e6f'],
      [82 / 100, '#dcb05c'],
      [100 / 100, '#a1d99e']
    ];

    const measure = measures[0];

    if (measure?.bottom_third_upper_value) {
      chartScale = [
        [measure?.bottom_third_upper_value / 100, '#d27e6f'],
        [measure?.middle_third_upper_value / 100, '#dcb05c'],
        [measure?.top_third_upper_value / 100, '#a1d99e']
      ];
    }
    const starsValue = splitMembers.closed.length / (splitMembers.open.length + splitMembers.closed.length);
    const heiValue = members.filter((member) => member.isSrf).length / members.length;
    const chartData = {
      scale: chartScale,
      starsValue: starsValue,
      heiValue: heiValue
    };

    return { splitMembers, chartData };
  }, [measures, members]);

  return { members: info?.splitMembers, chartData: info?.chartData };
}
