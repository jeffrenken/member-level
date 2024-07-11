import { z } from 'zod';

//also supervisors, check on who this is all for
//providers
//providerGroups

export const MeasureWithStatsSchema = z.object({
  id: z.number(),
  name: z.string(),
  domain: z.string().optional(),
  category: z.string(),
  abbreviation: z.string(),
  gaps_closed_count: z.number().optional(),
  gaps_open_count: z.number().optional(),
  status: z.number(),
  hl_code: z.string().optional(),
  measure_id: z.string().optional(),
  description: z.string().optional(),
  bottom_third_lower_value: z.number().optional(),
  bottom_third_upper_value: z.number().optional(),
  middle_third_lower_value: z.number().optional(),
  middle_third_upper_value: z.number().optional(),
  top_third_lower_value: z.number().optional(),
  top_third_upper_value: z.number().optional(),
  first_upper: z.number().optional(),
  second_upper: z.number().optional(),
  third_upper: z.number().optional(),
  fourth_upper: z.number().optional()
});

export const MeasureSchema = z.object({
  id: z.number(),
  name: z.string(),
  domain: z.string().optional(),
  abbreviation: z.string(),
  category: z.string(),
  hl_code: z.string().optional()
});

const careManager = z.object({
  id: z.number(),
  label: z.string(),
  value: z.string(),
  avgGapsPerMember: z.number(),
  supervisor: z.string()
});

const member = z.object({
  CONTRACT: z.string(),
  'MEMBER ID': z.number(),
  'FIRST NAME': z.string(),
  'LAST NAME': z.string(),
  'DATE OF BIRTH': z.string(),
  ADDRESS: z.string(),
  CITY: z.string(),
  COUNTY: z.string(),
  STATE: z.string(),
  'ZIP CODE': z.number(),
  'PHONE NUMBER': z.string(),
  'EMAIL ADDRESS': z.string(),
  SEX: z.string(),
  RACE: z.string(),
  ETHNICITY: z.string(),
  'PRIMARY LANGUAGE': z.string(),
  fake_address: z.string(),
  coordinates: z.string(),
  unsure: z.number(),
  unsure_2: z.string(),
  statefp: z.number(),
  countyfp: z.number(),
  tractce: z.number(),
  unsure_3: z.number(),
  id: z.number(),
  memberMeasures: z.object({
    CONTRACT: z.string(),
    'MEMBER ID': z.number(),
    'Plan All Cause Readmissions': z.number(),
    'Access to Primary Care Doctor Visits': z.number(),
    'Initiation of Substance Use Disorder Treatment': z.number(),
    'Cardiac Rehabiliation - Engagement 2': z.number(),
    'Cardiac Rehabilation - Initiation': z.number(),
    'Colorectal Cancer Screening (Age 45-75)': z.number()
  }),
  srf: z.object({
    'Low Income Subsidy Copay Level': z.boolean(),
    'DUAL ELIGIBLE': z.boolean(),
    DISABLED: z.boolean()
  }),
  isSrf: z.boolean(),
  numberOfGaps: z.number(),
  filteredNumberOfGaps: z.number(),
  measuresOpen: z.array(z.string()),
  measuresClosed: z.array(z.string()),
  geoId: z.number()
});
