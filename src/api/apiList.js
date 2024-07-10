const list = [
  {
    url: '/contracts',
    return: [{ id: '', name: '' }]
  },
  {
    url: '/provider-groups',
    return: [{ id: '', name: '' }]
  },
  {
    url: '/measures',
    return: [{ id: '', name: '', category: 'stars or display' }]
  },
  {
    url: '/some kind of measures with stats', //could just use a measureId combined with /measures
    params: { contractId: 1, providerGroupId: 'null or id', srf: 'null = all, srf, nonSrf', measureCategory: 'null, display, stars' },
    notes:
      'contractId is the only required param, the rest just filter. measureCategory could be filtered on frontned, the rest probably cant be',
    return: [
      {
        id: 1,
        domain: 'HEDIS',
        name: 'Breast Cancer Screening',
        abbreviation: 'BCS-E',
        bottom_third_lower_value: 0,
        bottom_third_upper_value: 66.4926,
        gaps_closed_count: 206,
        description: 'Percent of female plan members aged 52-74 who had a mammogram during the past two years.',
        first_upper: 55,
        forecast: 'N/A',
        fourth_upper: 81,
        hl_code: 'HL01',
        measure_id: 'C01',
        middle_third_lower_value: 66.4927,
        middle_third_upper_value: 72.4913,
        gaps_open_count: 55,
        second_upper: 66,
        category: 'stars or display',
        third_upper: 74,
        top_third_lower_value: 72.4914,
        top_third_upper_value: 100
      }
    ]
  },
  {
    url: '/members/gaps',
    params: { contractId: 1, providerGroupId: 'null or id', measureCategory: 'null, display, stars' },
    notes:
      'contractId is the only required param, the rest just filter. Page has selctable measures--not sure if fron or back will handle that',
    return: [
      {
        total_members_count: 0,
        members_with_more_than_one_gap_count: 0,
        members_with_more_than_three_gaps_count: 0,
        gap_distrubution: [
          { number: 1, count: 100 }, //number of members with 1 gap, 2 gaps...
          { number: 2, count: 100 }
        ],
        members: [
          //table, server-side pagination and sorting
          {
            id: 1,
            name: 'test',
            srf: 'boolean',
            gaps_count: 0,
            measures: [
              {
                id: 1,
                name: 'Breast Cancer Screening',
                abbreviation: 'BCS-E',
                value: 'bool', //numerator or denom
                date_last_numerator: '2020-01-01',
                gaps_count: 0
              }
            ]
          }
        ]
      }
    ]
  },
  {
    url: '/hei',
    params: { contractId: 1, providerGroupId: 'null or id', measureCategory: 'null, display, stars' },
    notes: 'main call can use the same /measures as above, added a couple things below, but could combine them with something',
    return: [
      {
        srf_percentage: 0, //or counts
        hei_reward: 0.2
      }
    ]
  },
  {
    url: '/map',
    params: { contractId: 1, providerGroupId: 'null or id', measureId: 'null or id' },
    notes: 'This could be complex',
    return: [{}]
  },
  {
    url: '/members',
    params: { contractId: 1, providerGroupId: 'null or id', measureId: 'null or id' },
    notes: 'server-side pag, sort for table',
    return: [
      {
        id: 1,
        first_name: 'test',
        last_name: 'test',
        srf: 'boolean',
        gaps_count: 0,
        gap_count_by_month: [
          { month: 'January', count: 0 },
          { month: 'February', count: 0 } //...used in chart on table
        ],
        provider: {
          id: 1,
          name: 'test'
        },
        provider_group: {
          id: 1,
          name: 'test'
        },
        member_id: 1,
        city: '',
        county: '',
        state: '',
        zip: 123456,
        phone: '',
        email: '',
        sex: '',
        race: '',
        ethnicity: '',
        primary_language: '',
        measures: [
          //all - I think can be separated by srf, stars or display on front
          {
            id: 1,
            name: 'Breast Cancer Screening',
            abbreviation: 'BCS-E',
            value: 'bool' //if numerator, denom or null for member
          }
        ]
      }
    ]
  },
  {
    url: '/provider groups with stats',
    params: { contractId: 1, providerGroupId: 'null or id', measureCategory: 'null, display, stars' },
    notes: 'for a table, unsure how many to need server-side',
    return: [
      {
        id: 1,
        name: 'provider group name',
        provider: {
          id: 1,
          name: 'provider name'
        },
        average_gaps_per_member_count: 0, //also an increase/decrease indicator - not sure how
        provider_average_gaps_per_member_count: 0, //also an increase/decrease indicator - not sure how
        gap_count_by_month: [
          { month: 'January', count: 0 },
          { month: 'February', count: 0 } //...used in chart on table
        ],
        gaps_count: 0
      }
    ]
  },
  {
    url: '/care managers with stats',
    params: { contractId: 1, measureCategory: 'null, display, stars' },
    notes: 'This is the exact same as provider groups with stats--except its for care managers and supervisors',
    //don't care how it's saved or fetched. Can use the same call with different params if you want
    return: [
      {
        id: 1,
        name: 'supervisor name',
        care_manager: {
          id: 1,
          name: 'care manager name'
        },
        average_gaps_per_member_count: 0, //also an increase/decrease indicator - not sure how
        supervisor_average_gaps_per_member_count: 0, //also an increase/decrease indicator - not sure how
        gap_count_by_month: [
          { month: 'January', count: 0 },
          { month: 'February', count: 0 } //...used in chart on table
        ],
        gaps_count: 0
      }
    ]
  }
];
