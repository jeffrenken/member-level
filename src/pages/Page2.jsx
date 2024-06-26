import { StyledCard as Card } from '@/components';
import RechartTest from '@/components/charts/ReChart';
import MeasureAutocomplete from '@/components/inputs/MeasureAutocomplete';
import { Box, Button, ButtonGroup, Container, Grid, Stack, Typography } from '@mui/material';
import { useState } from 'react';

export default function Page2() {
  const [selectedValue, setSelectedValue] = useState(1);
  const [toggle, setToggle] = useState('YOY');

  const handleChange = (e) => {
    setSelectedValue(e.target.value);
  };

  return (
    <>
      <Container maxWidth="xl">
        <Stack direction="row" alignItems="space-between" justifyContent="space-between" m={2}>
          <Typography sx={{ fontSize: '1.5rem' }}>Page Title</Typography>
          <Typography sx={{ fontSize: '1.5rem' }}>Plan Name</Typography>
        </Stack>
        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <Card>Top 20%</Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>Average</Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>Median</Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>Bottom 20%</Card>
          </Grid>
          <Grid item xs={12}>
            <Card height={400}>
              <Stack direction="row" alignItems="space-between" justifyContent="space-between" p={2}>
                <Box width={300}>
                  <MeasureAutocomplete />
                </Box>
                <ButtonGroup size="small" variant="contained">
                  <Button onClick={() => setToggle('YOY')}>YOY</Button>
                  <Button onClick={() => setToggle('Score')}>Score</Button>
                </ButtonGroup>
              </Stack>
              <Box height={300}>
                <RechartTest />
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/*   <div className="col-span-12">
          <Card className="card p-1 mt-0 h-96" isBlurred shadow="md">
            <div className="flex flex-row justify-between m-2">
              <Select
                size="sm"
                aria-label="Measure"
                label="Measure"
                className="max-w-xs mb-4"
                items={measures}
                selectedKey={selectedValue}
                variant="bordered"
                onChange={handleChange}
              >
                {(item) => <SelectItem key={item.value}>{item.label}</SelectItem>}
              </Select>
              <div>
                <ButtonGroup size="sm" radius="full">
                  <Button onClick={() => setToggle('YOY')} className={`border ${toggle === 'YOY' ? 'bg-primary' : ''}`}>
                    YOY
                  </Button>
                  <Button onClick={() => setToggle('Score')} className={`border ${toggle === 'Score' ? 'bg-primary' : ''}`}>
                    Score
                  </Button>
                </ButtonGroup>
              </div>
            </div>
            <RechartTest data={selectedValue} />
          </Card>
        </div>
      </div> */}
    </>
  );
}
