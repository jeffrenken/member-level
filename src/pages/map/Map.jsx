import { useContracts, useFilteredMembers, useMeasures, useProviders, useSrf } from '@/api';
import { Box, Grid, IconButton, Stack, Typography, StyledCard } from '@/components';
import AutocompleteButton from '@/components/Autocomplete';
import GaugeChart from '@/components/charts/GaugeChart';
import MembersTable from '@/components/tables/MembersTable';
import { useTheme } from '@/hooks';
import { contractFilterState } from '@/state/contractFilterState';
import { providerFilterState } from '@/state/providerFilterState';
import { srfFilterState } from '@/state/srfFilterState';
import { IconX } from '@tabler/icons-react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useRecoilState } from 'recoil';
import memberData from '../../../data/members.json';
import countiesData from '../../../fakeData/gz_2010_us_050_00_5m.json';
import stateToNumber from '../../../fakeData/stateToNumber.json';
import statesBoundingBoxes from '../../../fakeData/statesBoundingBoxes.json';
import MapViewsButton from './components/MapViewsButton';

/* const st = s.features.map((item) => {
  let statePet = pets.find((pet) => pet.state === item.properties.NAME);
  let itemCopy = { ...item };
  let itemProperties = { ...item.properties, ...statePet };
  itemCopy.properties = itemProperties;
  return itemCopy;
});
 */
const cd = countiesData.features.map((item) => {
  let itemCopy = { ...item };
  const stateAbbreviation = stateToNumber.find((state) => state.number === item.properties.STATE);
  itemCopy.properties = {
    ...item.properties,
    count: memberData.filter((d) => d.COUNTY === item.properties.NAME).length,
    stateAbbreviation: stateAbbreviation?.abbreviation || ''
  };
  return itemCopy;
});

const countyDataWithCount = { type: 'FeatureCollection', features: cd };

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

const filters = ['contract', 'srf'];
const filtersForMembers = ['contract'];

export default function Map() {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(-96.609435);
  const [lat, setLat] = useState(40.778561);
  const [zoom, setZoom] = useState(4.5);
  const [selectedMeasureOption, setSelectedMeasureOption] = useState('');
  const [selectedCounty, setSelectedCounty] = useState(null);
  const [clickedCounty, setClickedCounty] = useState(null);
  const [measureState, setMeasureState] = useState();
  const [contractState, setContractState] = useRecoilState(contractFilterState);
  const [providerState, setProviderState] = useRecoilState(providerFilterState);
  const [allMembersInDenom, setAllMembersInDenom] = useState([]);
  const [srfState, setSrfState] = useRecoilState(srfFilterState);
  const [mapReady, setMapReady] = useState(false);
  const [chartData, setChartData] = useState({});
  const [filteredMembersInCounty, setFilteredMembersInCounty] = useState([]);
  const [membersInCountyWithClosed, setMembersInCountyWithClosed] = useState([]);
  const [membersInCountyWithOpen, setMembersInCountyWithOpen] = useState([]);
  const [membersInCounty, setMembersInCounty] = useState([]);
  const { filteredMembers, filterSrf } = useFilteredMembers(filtersForMembers);

  const style = darkMode ? 'mapbox://styles/mapbox/dark-v11' : 'mapbox://styles/mapbox/light-v11';
  const stepArray = [0, 25, 30, 35, 50, 70, 100, 1000000];
  let colorArray = [0, 55, 66, 74, 81, 100]; //kind of a default

  const mapData = countyDataWithCount;

  const { data: measures } = useMeasures();
  const { data: contracts } = useContracts();
  const { data: providersData } = useProviders();
  const { data: srf } = useSrf();

  function setupMap() {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: style, //https://docs.mapbox.com/api/maps/styles/
      center: [lng, lat], //lng, lat
      zoom: zoom
    });

    map.current.on('load', () => {
      map.current.addSource('countiesData', {
        type: 'geojson',
        data: mapData
      });

      map.current.addSource('population', {
        type: 'vector',
        url: 'mapbox://mapbox.660ui7x6'
      });

      map.current.addLayer({
        id: 'counties-fill',
        type: 'fill',
        source: 'countiesData',
        sourceLayer: 'countiesData',
        paint: {
          'fill-color': ['step', ['get', 'percent'], '#EAF3B6', 0, '#c00000', 25, '#00ff00', 30, '#3ed', 35, '#0000ff', 50, '#3ed'],
          'fill-opacity': 0.5
        }
      });

      map.current.addLayer({
        id: 'counties-line',
        type: 'line',
        source: 'countiesData',
        paint: {
          'line-color': darkMode ? '#666' : '#aaa'
        }
      });
      map.current.addLayer({
        id: 'states-line',
        type: 'line',
        source: 'population',
        'source-layer': 'state_county_population_2014_cen',
        filter: ['==', 'isState', true],
        paint: {
          'line-color': '#555',
          'line-width': 2
        }
      });

      map.current.on('click', 'counties-fill', (e) => {
        //using layer id does the same thing?
        setClickedCounty(e);
      });

      /* const popup = new mapboxgl.Popup({
        id: 'popup',
        closeButton: false,
        closeOnClick: false
      });

      map.current.on('mousemove', 'counties-fill', (event) => {
        map.current.getCanvas().style.cursor = 'pointer';
        const name = event.features[0].properties.NAME;
        const percent = event.features[0].properties.percent ? event.features[0].properties.percent.toFixed(2) : '-';

        if (percent) {
        popup.setLngLat(event.lngLat).setHTML(`<div class="text-lg font-bold">${name}</div><div>${percent}%</div>`).addTo(map.current);
        }
      });

      map.current.on('mouseleave', 'counties-fill', () => {
        map.current.getCanvas().style.cursor = '';
        popup.remove();
      }); */
    });

    map.current.on('move', () => {
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
    });

    map.current.once('idle', () => {
      setMapReady(true);
    });
  }

  useEffect(() => {
    handleMeasureChange(0);
    setupMap();
  }, []);

  useMemo(() => {
    if (!filteredMembers.length || !mapReady || !map.current) {
      return;
    }

    const selectedMeasure = selectedMeasureOption;
    let membersWithOpen = filteredMembers.filter((member) => member.measuresOpen.length);
    let membersWithClosed = filteredMembers.filter((member) => member.measuresClosed.length);

    if (selectedMeasure) {
      membersWithOpen = filteredMembers.filter((member) => member.measuresOpen.includes(selectedMeasure['Measure Name']));
      membersWithClosed = filteredMembers.filter((member) => member.measuresClosed.includes(selectedMeasure['Measure Name']));

      let chartScale = [
        [75 / 100, '#d27e6f'],
        [82 / 100, '#dcb05c'],
        [100 / 100, '#a1d99e']
      ];

      if (selectedMeasure?.bottom_third_upper_value) {
        chartScale = [
          [selectedMeasure?.bottom_third_upper_value / 100, '#d27e6f'],
          [selectedMeasure?.middle_third_upper_value / 100, '#dcb05c'],
          [selectedMeasure?.top_third_upper_value / 100, '#a1d99e']
        ];
      }
      setChartData({
        scale: chartScale
      });
    } else {
      //members with any open
      //membersWithOpen = filteredMembers.filter((member) => member.measuresOpen.length);
      //membersWithClosed = filteredMembers.filter((member) => member.measuresClosed.length);

      const chartScale = [
        [75 / 100, '#d27e6f'],
        [82 / 100, '#dcb05c'],
        [100 / 100, '#a1d99e']
      ];
      setChartData({
        scale: chartScale
      });
    }

    let uniqueStateAbbreviations = [];

    const updatedCountyData = countyDataWithCount.features.map((item) => {
      let itemCopy = { ...item };
      let membersInCountyFiltered = filteredMembers.filter(
        (member) => member.COUNTY === item.properties.NAME && member.STATE === item.properties.stateAbbreviation
      );
      let membersInCountyNumerator = membersInCountyFiltered.filter((member) => member.measuresClosed.length);
      let membersInCountyDenom = membersInCountyFiltered.filter((member) => member.measuresOpen.length);

      if (selectedMeasure) {
        membersInCountyNumerator = membersInCountyNumerator.filter((member) =>
          member.measuresClosed.includes(selectedMeasure['Measure Name'])
        );
        membersInCountyDenom = membersInCountyDenom.filter((member) => member.measuresOpen.includes(selectedMeasure['Measure Name']));
      }

      if (!membersInCountyDenom.length) {
        let itemProperties = { ...item.properties, percent: '' };
        itemCopy.properties = itemProperties;
        return itemCopy;
      }

      const percent =
        (filterSrf(membersInCountyNumerator).length /
          (filterSrf(membersInCountyNumerator).length + filterSrf(membersInCountyDenom).length)) *
        100;
      let itemProperties = { ...item.properties, percent: percent };
      itemCopy.properties = itemProperties;
      uniqueStateAbbreviations = [...new Set(membersInCountyDenom.map((d) => d.STATE))];
      return itemCopy;
    });

    if (map.current.getSource('countiesData')) {
      map.current.getSource('countiesData').setData({
        type: 'FeatureCollection',
        features: updatedCountyData
      });
      if (selectedMeasureOption?.first_upper) {
        colorArray = [
          0,
          selectedMeasureOption?.first_upper,
          selectedMeasureOption?.second_upper,
          selectedMeasureOption?.third_upper,
          selectedMeasureOption?.fourth_upper,
          100
        ]; //kind of a default
      }
      map.current.setPaintProperty('counties-fill', 'fill-color', [
        'step',
        ['get', 'percent'],
        '#ccc',
        colorArray[0],
        '#9B2323',
        colorArray[1],
        '#C46060',
        colorArray[2],
        '#F8CD6D',
        colorArray[3],
        '#71BE6D',
        colorArray[4],
        '#20701C',
        colorArray[5],
        '#ccc'
      ]);

      const popup2 = new mapboxgl.Popup({
        id: 'popup2',
        closeButton: false,
        closeOnClick: false
      });

      map.current.on('mousemove', 'counties-fill', (event) => {
        map.current.getCanvas().style.cursor = 'pointer';
        // Set constants equal to the current feature's magnitude, location, and time
        const name = event.features[0].properties.NAME;
        const percent = event.features[0].properties.percent ? event.features[0].properties.percent.toFixed(2) : '-';

        //display in popup
        //if (percent) {
        popup2
          //.addClassName('mapboxgl-popup')
          .setLngLat(event.lngLat)
          .setHTML(
            `<div style="font-size:18px;color:#222">${name} County</div><div style="font-size:14px;color:#222;text-align:center">${percent}%</div>`
          )
          .addTo(map.current);
        //}
      });

      map.current.on('mouseleave', 'counties-fill', () => {
        map.current.getCanvas().style.cursor = '';
        popup2.remove();
      });
    }

    if (uniqueStateAbbreviations.length === 1) {
      const stateBounds = statesBoundingBoxes.find((state) => state.STUSPS === uniqueStateAbbreviations[0]);
      map.current.fitBounds(
        [
          [stateBounds.xmin, stateBounds.ymin],
          [stateBounds.xmax, stateBounds.ymax]
        ],
        {
          padding: { top: 250, bottom: 30, left: 80, right: 80 }
        }
      );
    }

    if (selectedCounty) {
      setMembersInCountyWithClosed(
        membersWithClosed.filter((member) => member.COUNTY === selectedCounty.NAME && member.STATE === selectedCounty.stateAbbreviation)
      );
      setMembersInCountyWithOpen(
        membersWithOpen.filter((member) => member.COUNTY === selectedCounty.NAME && member.STATE === selectedCounty.stateAbbreviation)
      );

      setFilteredMembersInCounty(
        filteredMembers.filter((member) => member.COUNTY === selectedCounty.NAME && member.STATE === selectedCounty.stateAbbreviation)
      );
      setMembersInCounty(
        filteredMembers.filter((member) => member.COUNTY === selectedCounty.NAME && member.STATE === selectedCounty.stateAbbreviation)
      );
    }
  }, [selectedMeasureOption, filteredMembers, mapReady, selectedCounty, srfState]);

  useEffect(() => {
    if (!clickedCounty) return;
    const [countyFeatures] = map.current.queryRenderedFeatures(clickedCounty.point, {
      //as this?
      layers: ['counties-fill']
    });

    if (countyFeatures) {
      let county = countyFeatures.properties;
      setSelectedCounty(county);
    }
  }, [clickedCounty]);

  const handleMeasureChange = (value) => {
    setMeasureState(value);
    setSelectedMeasureOption(measures?.find((m) => m.id === value));
  };

  return (
    <>
      <Box sx={{ position: 'relative' }}>
        <Box sx={{ position: 'absolute', top: '16px', left: '16px', zIndex: 2, width: '40%' }}>
          <StyledCard px={0} py={1}>
            <Stack direction="row" alignItems="center" justifyContent="flex-start" spacing={2} px={3}>
              {measures?.length && contracts?.length && srf?.length && (
                <>
                  <AutocompleteButton
                    defaultLabel="Contracts"
                    label={contractState ? (contracts.find((c) => c.id === contractState) || {}).label : 'Contracts'}
                    width={90}
                    autocompleteProps={{
                      id: 'contractState',
                      options: contracts,
                      getOptionLabel: (option) => option.label,
                      autoHighlight: true,
                      openOnFocus: true,
                      value: contractState,
                      onChange: (event, newValue) => setContractState(newValue.id),
                      isOptionEqualToValue: (option, value) => option.id === value.id
                    }}
                  />
                  <AutocompleteButton
                    defaultLabel="Measure"
                    label={measureState ? (measures.find((p) => p.id === measureState) || {}).label : 'Measure'}
                    withAllOption="All Measures"
                    autocompleteProps={{
                      id: 'measureState',
                      options: measures,
                      getOptionLabel: (option) => option.label,
                      autoHighlight: true,
                      openOnFocus: true,
                      value: measureState,
                      onChange: (event, newValue) => handleMeasureChange(newValue.id),
                      isOptionEqualToValue: (option, value) => option.id === value.id
                    }}
                  />
                  <AutocompleteButton
                    label={srfState ? (srf.find((s) => s.id === srfState) || {}).label : 'Members'}
                    withAllOption={'All Members'}
                    autocompleteProps={{
                      id: 'srfState',
                      options: srf,
                      getOptionLabel: (option) => option.label,
                      autoHighlight: true,
                      openOnFocus: true,
                      value: srfState,
                      onChange: (event, newValue) => setSrfState(newValue.id),
                      isOptionEqualToValue: (option, value) => option.id === value.id
                    }}
                  />
                  <MapViewsButton />
                </>
              )}
            </Stack>
          </StyledCard>
        </Box>
        {selectedCounty && (
          <Box sx={{ position: 'absolute', top: '20px', right: '16px', zIndex: 1001, width: '46%' }}>
            <StyledCard p={0} height="100%">
              <Grid container justifyContent="flex-end">
                <IconButton sx={{ padding: 0.5 }} onClick={() => setSelectedCounty(null)}>
                  <IconX />
                </IconButton>
              </Grid>
              <Box pb={2} px={2}>
                <>
                  <Grid container>
                    <Grid item md={12} lg={4}>
                      <Stack direction="column" spacing={2}>
                        <Stack direction="row" justifyContent={'space-between'}>
                          <Box>
                            <Typography
                              sx={{ fontWeight: 600, fontSize: '1.5rem', textDecoration: 'none' }}
                              //component={Link}
                              to={`/states/${selectedCounty?.stateAbbreviation}/counties/${selectedCounty?.NAME}`}
                            >
                              {selectedCounty.NAME} County, {selectedCounty.stateAbbreviation}
                            </Typography>
                            <Typography sx={{ fontSize: '1.1rem' }}>Open Gaps: {filterSrf(membersInCountyWithOpen).length}</Typography>
                          </Box>
                        </Stack>
                      </Stack>
                    </Grid>

                    <Grid item md={12} lg={8}>
                      <Stack direction="row" justifyContent={'flex-end'} alignItems={'center'} spacing={3}>
                        <Box>
                          <>
                            <Box minWidth={140} height={100}>
                              <GaugeChart
                                chartScale={chartData.scale}
                                chartValue={
                                  filterSrf(membersInCountyWithClosed).length /
                                  (filterSrf(membersInCountyWithOpen).length + filterSrf(membersInCountyWithClosed).length)
                                }
                              />
                            </Box>
                            <Typography sx={{ fontSize: '0.7rem', marginTop: '-8px' }} align="center">
                              Stars Performance
                            </Typography>
                          </>
                        </Box>
                        <Box>
                          <>
                            <Box minWidth={140} height={100}>
                              <GaugeChart
                                chartScale={chartData.scale}
                                chartValue={membersInCounty.filter((m) => m.isSrf).length / membersInCounty.length}
                              />
                            </Box>
                            <Typography sx={{ fontSize: '0.7rem', marginTop: '-8px' }} align="center">
                              Health Equity Performance
                            </Typography>
                          </>
                        </Box>
                      </Stack>
                    </Grid>
                  </Grid>
                  <Box sx={{ maxHeight: '290px', height: '290px' }}>
                    {membersInCountyWithOpen.length && (
                      <MembersTable rows={filterSrf(membersInCountyWithOpen)} height="265px" csvDownload />
                    )}
                  </Box>
                </>
              </Box>
            </StyledCard>
          </Box>
        )}
      </Box>
      <div style={{ width: '100%', height: '100%' }}>
        <div ref={mapContainer} style={{ height: '100vh' }} />
      </div>
    </>
  );
}
