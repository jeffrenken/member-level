import dayjs from 'dayjs';
import { useMemo } from 'react';

function getRandomDate() {
  const d = new Date(2015 + Math.floor(Math.random() * 7), 1 + Math.floor(Math.random() * 12), 1 + Math.floor(Math.random() * 30));
  return dayjs(d).format('YYYY-MM-DD');
}

export function useMembersFilteredByMeasures(members, measures) {
  const info = useMemo(() => {
    if (!members.length) {
      return {};
    }
    const measureNames = measures.map((m) => m.name);

    let m = members.map((member) => {
      return {
        ...member,
        name: member.firstName + ' ' + member.lastName,
        id: member.memberId,
        srf: member.isSrf,
        numberOfGaps: member.measuresOpen.length,
        url: `/members/${member.memberId}`,
        date: '2024-01-01',
        totalGapsInSelectedMeasures: member.measuresOpen.filter((m) => measureNames.includes(m)).length
      };
    });

    let splitMembers = {};
    splitMembers.all = m;
    if (measureNames.length) {
      //filter needing all checked- splitMembers.closed = m.filter((member) => measureNames.every((m) => member?.measuresClosed.includes(m)));
      //filter needing all checked-splitMembers.open = m.filter((member) => measureNames.every((m) => member?.measuresOpen.includes(m)));
      splitMembers.closed = m.filter((member) => measureNames.some((m) => member?.measuresClosed.includes(m)));
      splitMembers.open = m.filter((member) => measureNames.some((m) => member?.measuresOpen.includes(m)));

      splitMembers.open = splitMembers.open.map((member) => {
        //use member.memberMeasures if we only want thier info
        //could use all measures
        let datesArray = Object.keys(member.memberMeasures).map((key) => {
          return { [key + '_date']: getRandomDate() };
        });

        return {
          ...member,
          ...member.memberMeasures,
          ...Object.assign({}, ...datesArray)
        };
      });
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
