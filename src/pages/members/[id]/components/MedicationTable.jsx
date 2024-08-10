import AgGrid from '@/components/tables/AgGrid';
import { IconButton } from '@/root/src/components/ui';
import { IconCalendar } from '@tabler/icons-react';
import { CalendarDialog } from './CalendarDialog';
import { useState } from 'react';
import { PillRenderer } from '@/root/src/components/tables/CellRenderers';

export const medicationCategoryColors = {
  Diabetes: '#696cb5',
  RAS: '#297e8f',
  Statins: '#f08a5b'
};

export function MedicationTable({ medications, member }) {
  const [selectedDrugName, setSelectedDrugName] = useState('');
  const columnDefs = [
    {
      field: 'caledndar',
      headerName: '',
      filter: true,
      chartDataType: 'category',
      maxWidth: 80,
      cellRenderer: (params) => {
        const medication = params.data;
        return (
          <IconButton onClick={() => setSelectedDrugName(medication.drug_name)}>
            <IconCalendar />
          </IconButton>
        );
      }
    },
    { field: 'drug_name', headerName: 'Name', filter: true, chartDataType: 'category' },
    {
      field: 'adherence_category',
      headerName: 'Adherence Category',
      filter: true,
      chartDataType: 'category',
      cellRenderer: (params) => PillRenderer(params, medicationCategoryColors[params.value])
    },
    { field: 'fill_date', headerName: 'Fill Date', filter: true, chartDataType: 'category' },
    { field: 'last_coverage_date', headerName: 'Last Coverage Date', filter: true, chartDataType: 'category' },
    { field: 'quantity', headerName: 'Quantity', filter: true, chartDataType: 'category' },
    { field: 'days_supply', headerName: 'Days Supply', filter: true, chartDataType: 'category' },
    { field: 'covered_days', headerName: 'Covered Days', filter: true, chartDataType: 'category' },
    { field: 'prescriber_name', headerName: 'Prescriber Name', filter: true, chartDataType: 'category' },
    { field: 'claim_number', headerName: 'Claim Number', filter: true, chartDataType: 'category' }
  ];

  const rows = medications.map((medication) => {
    return {
      ...medication,
      drug_name: medication.drug_name
    };
  });

  return (
    <div>
      <CalendarDialog
        open={Boolean(selectedDrugName)}
        onClose={() => {
          setSelectedDrugName('');
        }}
        member={member}
        selectedDrugName={selectedDrugName}
      />
      <AgGrid rowData={rows} columnDefs={columnDefs} hideColumns hideFilters />
    </div>
  );
}
