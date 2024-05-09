import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import measures from '../../data/measures.json';
import memberMeasures from '../../data/memberMeasures.json';
import srfData from '../../data/memberSrf.json';
import memberData from '../../data/members.json';
import providerGroupsData from '../../data/providerGroups.json';
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

  return {
    ...member,
    id: member['MEMBER ID'],
    providerGroup: providerGroupsData.find((p) => p['MEMBER ID'] === member['MEMBER ID']),
    provider: providerGroupsData.find((p) => p['MEMBER ID'] === member['MEMBER ID'])?.Provider,
    memberMeasures: measures,
    srf: srf,
    isSrf: isSrf,
    numberOfGaps: numberOfGaps,
    filteredNumberOfGaps: numberOfGaps,
    measuresOpen: Object.keys(measures).filter((key) => measures?.[key] === 0),
    measuresClosed: Object.keys(measures).filter((key) => measures?.[key] === 1)
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

const providerGroups = providerGroupsData.map((p, i) => {
  const filteredMembers = members.filter((m) => m.providerGroup && m.providerGroup['Provider Group'] === p['Provider Group']);

  let avgGapsPerMember = filteredMembers.reduce((sum, member) => sum + member.numberOfGaps, 0) / filteredMembers.length;
  avgGapsPerMember = parseFloat(avgGapsPerMember.toFixed(2));

  return { ...p, id: i + 1, avgGapsPerMember: avgGapsPerMember };
});

const fakeMeasures = measures.map((measure, i) => ({
  ...measure,
  //id: i + 1,
  label: measure['Measure Name'],
  value: measure['Acronym'],
  abbreviation: measure['Acronym']
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

const axiosClient = axios.create({
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
mock.onGet('/member-measures').reply(200, memberMeasures);
mock.onGet('/members').reply(200, members);
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

export async function fetchPlans() {
  const res = await axiosClient.get('/plans');
  return res.data;
}

export async function fetchRatings() {
  const res = await axiosClient.get('/ratings');
  return res.data;
}

export async function fetchMeasures() {
  const res = await axiosClient.get('/measures');
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
