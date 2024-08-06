import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import measures from '../../data/measures.json';
import memberMeasures from '../../data/memberMeasures.json';
import srfData from '../../data/memberSrf.json';
import memberData from '../../data/membersWithCensus.json';
import providerGroupsData from '../../data/providerGroups.json';
import careData from '../../data/care.json';

const contracts = [
  {
    id: 1,
    name: 'H1111'
  },
  {
    id: 2,
    name: 'H2222'
  }
];

function addLeadingZerosForLength(number, length) {
  if (!number) return null;
  var num = '' + number;
  while (num.length < length) num = '0' + num;
  return num;
}

const members = memberData.map((member, i) => {
  const measures = memberMeasures.find((m) => m['MEMBER ID'] === member['MEMBER ID']);
  const numberOfGaps = Object.keys(measures).filter((key) => measures?.[key] === 0).length;
  const srfOptions = ['Low Income Subsidy Copay Level', 'DUAL ELIGIBLE', 'DISABLED'];

  let srf = {};
  let isSrf = false;
  if (srfData.find((s) => s['MEMBER ID'] === member['MEMBER ID'])) {
    const srfArray = Object.keys(srfData.find((s) => s['MEMBER ID'] === member['MEMBER ID'])).slice(2);
    isSrf = Boolean(srfArray.length);

    srfOptions.forEach((key) => {
      srf[key] = srfArray.includes(key);
    });
  }

  const statefp = addLeadingZerosForLength(member?.statefp, 2);
  const countyfp = addLeadingZerosForLength(member?.countyfp, 3);
  const tractce = addLeadingZerosForLength(member?.tractce, 6);

  return {
    ...member,
    id: member['MEMBER ID'],
    providerGroup: providerGroupsData.find((p) => p['MEMBER ID'] === member['MEMBER ID']),
    provider: providerGroupsData.find((p) => p['MEMBER ID'] === member['MEMBER ID'])?.Provider,
    supervisor: careData.find((c) => c['MEMBER ID'] === member['MEMBER ID'])?.Supervisor,
    careManager: careData.find((c) => c['MEMBER ID'] === member['MEMBER ID'])?.['Care Manager'],
    memberMeasures: measures,
    srf: srf,
    isSrf: isSrf,
    numberOfGaps: numberOfGaps,
    filteredNumberOfGaps: numberOfGaps,
    measuresOpen: Object.keys(measures).filter((key) => measures?.[key] === 0),
    measuresClosed: Object.keys(measures).filter((key) => measures?.[key] === 1),
    geoId: parseInt(`${statefp}${countyfp}${tractce}`),
    zipCode: member['ZIP CODE'],
    phoneNumber: member['PHONE NUMBER'],
    email: member['EMAIL ADDRESS'],
    memberId: member['MEMBER ID'],
    firstName: member['FIRST NAME'],
    lastName: member['LAST NAME'],
    dateOfBirth: member['DATE OF BIRTH'],
    primaryLanguage: member['PRIMARY LANGUAGE'],
    address: member['ADDRESS'],
    city: member['CITY'],
    state: member['STATE'],
    prescriptions: member?.prescriptions || []
  };
});
//just assuming names are unique for testing
const distinctProviders = providerGroupsData
  .filter((value, index, self) => index === self.findIndex((t) => t.Provider === value.Provider))
  .map((p, i) => {
    const filteredMembers = members.filter((m) => m.provider === p.Provider);
    let avgGapsPerMember = filteredMembers.reduce((sum, member) => sum + member.numberOfGaps, 0) / filteredMembers.length;
    avgGapsPerMember = parseFloat(avgGapsPerMember.toFixed(2));
    return { id: i + 1, label: p.Provider, value: p.Provider, avgGapsPerMember: avgGapsPerMember, providerGroup: p['Provider Group'] };
  });

const distinctCareManagers = careData
  .filter((value, index, self) => index === self.findIndex((t) => t['Care Manager'] === value['Care Manager']))
  .map((p, i) => {
    const filteredMembers = members.filter((m) => m.careManager === p['Care Manager']);
    let avgGapsPerMember = filteredMembers.reduce((sum, member) => sum + member.numberOfGaps, 0) / filteredMembers.length;
    avgGapsPerMember = parseFloat(avgGapsPerMember.toFixed(2));
    return { id: i + 1, label: p['Care Manager'], value: p['Care Manager'], avgGapsPerMember: avgGapsPerMember, supervisor: p.Supervisor };
  });

const providerGroups = providerGroupsData.map((p, i) => {
  const filteredMembers = members.filter((m) => m.providerGroup && m.providerGroup['Provider Group'] === p['Provider Group']);

  let avgGapsPerMember = filteredMembers.reduce((sum, member) => sum + member.numberOfGaps, 0) / filteredMembers.length;
  avgGapsPerMember = parseFloat(avgGapsPerMember.toFixed(2));

  return { ...p, id: i + 1, avgGapsPerMember: avgGapsPerMember };
});

const supervisors = careData.map((p, i) => {
  const filteredMembers = members.filter((m) => m.supervisor === p['Provider Group']);
  let avgGapsPerMember = filteredMembers.reduce((sum, member) => sum + member.numberOfGaps, 0) / filteredMembers.length;
  avgGapsPerMember = parseFloat(avgGapsPerMember.toFixed(2));

  return { ...p, id: i + 1, avgGapsPerMember: avgGapsPerMember };
});

const measuresWithStats = (body, params) => {
  const contract = contracts.find((c) => c.id === body.contractId);
  let filteredMeasures = [...measures];
  let filteredMembers = members.filter((member) => member.CONTRACT === contract.name);
  if (params.measureStatus !== 0) {
    filteredMeasures = measures.filter((measure) => measure.status === params.measureStatus);
  }
  if (params.providerGroupId) {
    filteredMembers = filteredMembers.filter((member) => member.providerGroup && member.providerGroup.id === params.providerGroupId);
  }
  if (params.srf === 1) {
    filteredMembers = filteredMembers.filter((member) => member.isSrf);
  }
  if (params.srf === 2) {
    filteredMembers = filteredMembers.filter((member) => !member.isSrf);
  }

  return filteredMeasures
    .map((measure, i) => ({
      ...measure,
      //id: i + 1,
      gaps_closed_count: filteredMembers.filter((member) => member?.measuresClosed.includes(measure['Measure Name'])).length,
      gaps_open_count: filteredMembers.filter((member) => member?.measuresOpen.includes(measure['Measure Name'])).length,
      name: measure['Measure Name'],
      label: measure['Measure Name'],
      value: measure['Acronym'],
      abbreviation: measure['Acronym'],
      domain: measure['Domain']
    }))
    .sort((a, b) => b.abbreviation - a.abbreviation);
};

const fakeMeasures = measures.map((measure, i) => ({
  ...measure,
  //id: i + 1,
  label: measure['Measure Name'],
  value: measure['Acronym'],
  abbreviation: measure['Acronym'],
  name: measure['Measure Name']
}));

const fakeContracts = () => {
  const contractName = providerGroups.map((d) => d['CONTRACT']).sort();
  const distinctContracts = [...new Set(contractName)];
  return distinctContracts.map((c, i) => ({ id: i + 1, label: c, value: i + 1 }));
};

const fakeYears = [
  { id: 23, label: '2022', maxMonth: 12 },
  { id: 24, label: '2023', maxMonth: 6 }
];

const fakePlans = [
  { id: 1, label: 'HMO' },
  { id: 2, label: 'PPO' },
  { id: 3, label: 'POS' }
];

const fakeRatings = [
  { id: 1, label: '2.5' },
  { id: 2, label: '3' },
  { id: 3, label: '3.5' },
  { id: 4, label: '4' },
  { id: 5, label: '4.5' },
  { id: 6, label: '5' }
];

const fakeProviderGroups = () => {
  const providerName = providerGroups
    .map((d) => d['Provider Group'])
    .filter((d) => Boolean(d))
    .sort();
  const distinctProviderGroups = [...new Set(providerName)];
  const p = distinctProviderGroups.map((p, i) => {
    const filteredMembers = members.filter((m) => m.providerGroup && m.providerGroup['Provider Group'] === p);
    const avgGapsPerMember = filteredMembers.reduce((sum, member) => sum + member.numberOfGaps, 0) / filteredMembers.length;
    return { name: p, id: i + 1, avgGapsPerMember: avgGapsPerMember, label: p, value: i + 1 };
  });
  return p;
};

const fakeSupervisors = () => {
  const supervisorNames = supervisors
    .map((d) => d['Supervisor'])
    .filter((d) => Boolean(d))
    .sort();
  const distinctSupervisors = [...new Set(supervisorNames)];
  const p = distinctSupervisors.map((p, i) => {
    const filteredMembers = members.filter((m) => m.supervisor === p);
    const avgGapsPerMember = filteredMembers.reduce((sum, member) => sum + member.numberOfGaps, 0) / filteredMembers.length;
    return { name: p, id: i + 1, avgGapsPerMember: avgGapsPerMember, label: p, value: i + 1 };
  });
  return p;
};

export const axiosClient = axios.create({
  //baseURL: 'https://jsonplaceholder.typicode.com',
  headers: {
    'Content-Type': 'application/json'
  }
});

const fakeSrf = [
  { id: 1, label: 'SRF Only', value: 1 },
  { id: 2, label: 'Non-SRF Only', value: 2 }
];

const mock = new MockAdapter(axiosClient, { delayResponse: 0 });
mock.onGet('/contracts').reply(200, fakeContracts());
mock.onGet('/provider-groups').reply(200, fakeProviderGroups());
mock.onGet('/providers').reply(200, distinctProviders);
mock.onGet('/srf').reply(200, fakeSrf);
mock.onGet('/years').reply(200, fakeYears);
mock.onGet('/plans').reply(200, fakePlans);
mock.onGet('/ratings').reply(200, fakeRatings);
mock.onGet('/measures').reply(200, fakeMeasures);

mock.onPost('/measures-filtered').reply((config) => {
  const data = JSON.parse(config.data);
  return [200, measuresWithStats(data.body, data?.params)];
});

mock.onGet('/member-measures').reply(200, memberMeasures);
mock.onGet('/care-managers').reply(200, distinctCareManagers);
mock.onGet('/supervisors').reply(200, fakeSupervisors());
mock.onGet('/members').reply(200, members);

mock.onPost('/members-paginated').reply((config) => {
  const body = JSON.parse(config.data);
  let membersData = [...members];
  if (body.sortModel.length) {
    const ascOrDesc = body.sortModel[0].sort === 'asc' ? 1 : -1;
    membersData = membersData.sort((a, b) => (a[body.sortModel[0].colId] > b[body.sortModel[0].colId] ? 1 : -1) * ascOrDesc);
  }

  if (body.rowGroupCols.length) {
    //group by this column
    membersData = Object.groupBy(membersData, (member) => member[body.rowGroupCols[0].id]);
  } else {
    membersData = { rows: membersData.slice(body.startRow, body.endRow), lastRow: members.length };
  }

  return [200, membersData];
});

mock.onGet('/members/1').reply(200, members[0]);
mock.onPost('/srf-scores').reply((config) => {
  const body = JSON.parse(config.data);
  let year = body.year;
  //const contracts = fakeContracts();
  //const contract = contracts.find((c) => c.id === body.contract).label;
  let srfInfo = srfData.filter((d) => d['Year'] === year && d['Month'] === 12); //december

  srfInfo = srfInfo.map((d) => ({ ...d, measure: measures.find((m) => m.value === d['HL Code']) }));
  if (body.measure) {
    const measure = measures.find((m) => m.value === body.measure);
    srfInfo = srfInfo.find((d) => d['HL Code'] === measure.value);
  }
  return [200, srfInfo];
});

mock.onPost('/other-contract-srf-scores').reply((config) => {
  const body = JSON.parse(config.data);
  let year = fakeYears.find((y) => y.id === body.year);
  const contracts = fakeContracts();
  const contract = contracts.find((c) => c.id === body.contract).label;
  let srfInfo = srfData.filter((d) => d['Year'] === parseInt(year.label) && d['Contract'] !== contract && d['Month'] === year.maxMonth);
  srfInfo = srfInfo.map((d) => ({ ...d, measure: measures.find((m) => m.value === d['HL Code']) }));
  if (body.measure) {
    const measure = measures.find((m) => m.id === body.measure);
    srfInfo = srfInfo.filter((d) => d['HL Code'] === measure.value).sort((a, b) => (a['SRF Score'] > b['SRF Score'] ? 1 : -1));
  }
  return [200, srfInfo];
});

export async function fetchContracts() {
  const res = await axiosClient.get('/contracts');
  return res.data;
}
export async function fetchSrf() {
  const res = await axiosClient.get('/srf');
  return res.data;
}
export async function fetchProviderGroups() {
  const res = await axiosClient.get('/provider-groups');
  return res.data;
}
export async function fetchProviders() {
  const res = await axiosClient.get('/providers');
  return res.data;
}

export async function fetchYears() {
  const res = await axiosClient.get('/years');
  return res.data;
}
export async function fetchCareManagers() {
  const res = await axiosClient.get('/care-managers');
  return res.data;
}
export async function fetchSupervisors() {
  const res = await axiosClient.get('/supervisors');
  return res.data;
}

export async function fetchPlans() {
  const res = await axiosClient.get('/plans');
  return res.data;
}

export async function fetchRatings() {
  const res = await axiosClient.get('/ratings');
  return res.data;
}

export async function fetchMeasures() {
  const res = await axiosClient.get('/measures', { params: { filter: 'SRF' } });
  return res.data;
}

export async function fetchMemberMeasures() {
  const res = await axiosClient.get('/member-measures');
  return res.data;
}

export async function fetchMembers() {
  const res = await axiosClient.get('/members');
  return res.data;
}

export async function fetchMembersPaginated() {
  const res = await axiosClient.post('/members-paginated');
  return res.data;
}

export async function fetchMember(id) {
  const res = await axiosClient.get('/members/1');
  return res.data;
}

export async function fetchSrfScores(body) {
  const res = await axiosClient.post('/srf-scores', body);
  return res.data;
}

export async function fetchOtherContractSrfScores(body) {
  const res = await axiosClient.post('/other-contract-srf-scores', body);
  return res.data;
}

/* const fakeContracts = [
  { id: 1, label: 'H1234' },
  { id: 2, label: 'H1235' },
  { id: 3, label: 'H1236' },
  { id: 4, label: 'H1237' },
  { id: 5, label: 'H1238' },
  { id: 6, label: 'H1239' },
  { id: 7, label: 'H1240' },
  { id: 8, label: 'H1241' },
  { id: 9, label: 'H1242' },
  { id: 10, label: 'H1243' },
  { id: 11, label: 'H1244' },
  { id: 12, label: 'H1245' },
  { id: 13, label: 'H1246' },
  { id: 14, label: 'H1247' },
  { id: 15, label: 'H1248' },
  { id: 16, label: 'H1249' },
  { id: 17, label: 'H1250' },
  { id: 18, label: 'H1251' },
  { id: 19, label: 'H1252' },
  { id: 20, label: 'H1253' },
  { id: 21, label: 'H1254' },
  { id: 22, label: 'H1255' },
  { id: 23, label: 'H1256' },
  { id: 24, label: 'H1257' },
  { id: 25, label: 'H1258' },
  { id: 26, label: 'H1259' },
  { id: 27, label: 'H1260' },
  { id: 28, label: 'H1261' },
  { id: 29, label: 'H1262' },
  { id: 30, label: 'H1263' },
  { id: 31, label: 'H1264' },
  { id: 32, label: 'H1265' },
  { id: 33, label: 'H1266' },
  { id: 34, label: 'H1267' }
]; */

/* const fakeYears = [
  { id: 1, label: '2000' },
  { id: 2, label: '2001' },
  { id: 3, label: '2002' },
  { id: 4, label: '2003' },
  { id: 5, label: '2004' },
  { id: 6, label: '2005' },
  { id: 7, label: '2006' },
  { id: 8, label: '2007' },
  { id: 9, label: '2008' },
  { id: 10, label: '2009' },
  { id: 11, label: '2010' },
  { id: 12, label: '2011' },
  { id: 13, label: '2012' },
  { id: 14, label: '2013' },
  { id: 15, label: '2014' },
  { id: 16, label: '2015' },
  { id: 17, label: '2016' },
  { id: 18, label: '2017' },
  { id: 19, label: '2018' },
  { id: 20, label: '2019' },
  { id: 21, label: '2020' },
  { id: 22, label: '2021' },
  { id: 23, label: '2022' },
  { id: 24, label: '2023' },
  { id: 25, label: '2024' }
]; */
