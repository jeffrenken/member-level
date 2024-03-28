import { useParams, Link } from 'react-router-dom';
import { states } from '../../../../../../fakeData/states';
import countiesData from '../../../../../../fakeData/gz_2010_us_050_00_5m.json';
import { stateAbbreviations } from '@/helpers/functions';

import useMembers from '@/api/useMembers';

export default function County() {
  const { abbreviation, countyName } = useParams();
  const { data } = useMembers();
  const members = data.filter((member) => member['STATE'] === abbreviation && member['COUNTY'] === countyName);
  //const county = countiesData.features.find((c) => c.properties.STATE === stateNumber && c.properties.NAME === countyName)?.properties;

  return (
    <>
      <div>{countyName}</div>

      <div>
        **Dashboard View:** Displays KPIs, visual analytics on the selected measure for the chosen county.
        <br />
        **Table View:** Offers a detailed list of members with the ability to filter and search.
      </div>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>County</th>
            <th>State</th>
          </tr>
        </thead>
        <tbody>
          {members.map((member) => (
            <tr key={member.id}>
              <td>
                <Link to={`/members/${member['MEMBER ID']}`}>
                  {member['FIRST NAME']} {member['LAST NAME']}
                </Link>
              </td>
              <td>{member['COUNTY']}</td>
              <td>{member['STATE']}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
