import { useContracts, useFilteredMembers, useMeasures, useProviders, useSrf } from '@/api';
import { Box, Grid, IconButton, Stack, Typography, StyledCard } from '@/components/ui';
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
import MapViewsButton from '../map/components/MapViewsButton';

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

async function fetchClientDataAndUpdateMap(geoIdCounts, map) {
  // Fetch client data (example: from an API)
  //const clientData = await fetch('https://api.example.com/client-data').then((response) => response.json());

  // Process the data to create a color mapping
  const fakeData = [
    { tractId: 1, count: 1 },
    { tractId: 2, count: 2 },
    { tractId: 3, count: 3 }
  ];
  const colorMapping = createColorMapping(geoIdCounts);

  // Update the fill layer colors based on the client data
  updateFillLayerColors(map, colorMapping);
}

function createColorMapping(data) {
  // Create a color mapping based on the client data
  // This is just an example, adjust based on your data structure
  const colorMapping = {};
  data.forEach((item) => {
    //colorMapping[key] = getColorForCount(data[key]);

    colorMapping[item.id] = getColorForCount(item.count);
  });
  return colorMapping;
}

function getColorForCount(count) {
  if (count === 1) {
    return '#20701C';
  } else if (count === 2) {
    return '#F8CD6D';
  } else if (count === 3) {
    return 'orange';
  } else if (count > 3) {
    return '#9B2323';
  } else {
    return '#fff';
  }
}

function updateFillLayerColors(map, colorMapping) {
  const colorEntries = Object.entries(colorMapping).flatMap(([key, value]) => [parseInt(key), value]);

  // Use 'setPaintProperty' to update the fill-color based on data-driven styling
  map.setPaintProperty('census-fill', 'fill-color', [
    'match',
    ['id'],

    ...colorEntries,
    'transparent' // Default color if no match
  ]);
}

function MapCensus() {
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
  const [selectedGeoId, setSelectedGeoId] = useState(null);
  const [rows, setRows] = useState([]);

  //const mapStyle = 'mapbox://styles/d452ds54/clxur3azb048w01qm98wd34qc';
  const mapStyle = darkMode ? 'mapbox://styles/mapbox/dark-v11' : 'mapbox://styles/mapbox/light-v11';

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
      style: mapStyle,
      center: [lng, lat], //lng, lat
      zoom: zoom
    });
    map.current.setSty;

    map.current.on('load', () => {
      map.current.addSource('census-source', {
        type: 'vector',
        // Use any Mapbox-hosted tileset using its tileset id.
        // Learn more about where to find a tileset id:
        // https://docs.mapbox.com/help/glossary/tileset-id/
        url: 'mapbox://d452ds54.6y7bz4ho'
      });
      map.current.addLayer(
        {
          id: 'census-line',
          type: 'line',
          source: 'census-source',
          'source-layer': 'tractsclippedbystate', //name from the mapbox tileset style layer
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': darkMode ? '#444' : '#ddd',
            'line-width': 1
          }
        },
        'road-label-simple' // Add layer below labels
      );
      map.current.addLayer({
        id: 'census-fill',
        type: 'fill',
        source: 'census-source',
        'source-layer': 'tractsclippedbystate',
        paint: {
          //'fill-color': ['step', ['get', 'geoIdCount'], '#EAF3B6', 0, '#c00000', 25, '#00ff00', 30, '#3ed', 35, '#0000ff', 50, '#3ed'],
          'fill-opacity': 0.5
        }
      });
      // Add click event listener to inspect properties
      map.current.on('click', 'census-fill', function (e) {
        const features = map.current.queryRenderedFeatures(e.point, {
          layers: ['census-fill']
        });
        setSelectedGeoId(features[0].id);
      });

      const popup = new mapboxgl.Popup({
        id: 'popup',
        closeButton: false,
        closeOnClick: false
      });

      map.current.on('mousemove', 'census-fill', (e) => {
        map.current.getCanvas().style.cursor = 'pointer';
        const features = map.current.queryRenderedFeatures(e.point, {
          layers: ['census-fill']
        });
        let geoId = features[0].id;
        const count = filteredMembers.filter((member) => member.geoId === geoId).length;
        const label = count > 1 ? 'Members' : 'Member';
        if (count) {
          popup
            .setLngLat(e.lngLat)
            .setHTML(
              `<div style="font-size:18px;color:#222;text-align:center">${count}</div><div style="font-size:14px;color:#222;text-align:center">${label}</div>`
            )
            .addTo(map.current);
        }
      });

      map.current.on('mouseleave', 'census-fill', () => {
        map.current.getCanvas().style.cursor = '';
        popup.remove();
      });
    });

    map.current.once('idle', () => {
      setMapReady(true);
    });
  }

  useEffect(() => {
    //handleMeasureChange(0);
    if (filteredMembers.length) {
      setupMap();
    }
  }, [filteredMembers]);

  useEffect(() => {
    if (map.current) {
      //map.current.setStyle(mapStyle);
    }
  }, [darkMode]);

  useMemo(() => {
    if (!filteredMembers.length || !mapReady || !map.current) {
      return;
    }

    const mapped = filteredMembers.map((f) => ({ geoId: f.geoId }));
    const validGeoidArray = mapped.filter((obj) => obj.geoId !== null && obj.geoId !== undefined);

    // Step 1: Count the occurrences of each geoid
    const countMap = validGeoidArray.reduce((acc, obj) => {
      acc[obj.geoId] = (acc[obj.geoId] || 0) + 1;
      return acc;
    }, {});

    // Step 2: Transform the result into an array of objects
    const resultArray = Object.entries(countMap).map(([geoId, count]) => ({
      id: parseInt(geoId), // Ensure the geoId is an integer
      count
    }));
    fetchClientDataAndUpdateMap(resultArray, map.current);
  }, [selectedMeasureOption, filteredMembers, mapReady, selectedCounty]);

  useEffect(() => {
    if (!selectedGeoId) return;
    setRows(filteredMembers.filter((member) => member.geoId === selectedGeoId));
  }, [selectedGeoId]);

  const handleMeasureChange = (value) => {
    setMeasureState(value);
    setSelectedMeasureOption(measures.find((m) => m.id === value));
  };

  return (
    <>
      <Box sx={{ position: 'relative' }}>
        <Box sx={{ position: 'absolute', top: '16px', left: '16px', zIndex: 2, width: '40%' }}>
          <StyledCard px={0} py={1}>
            <Stack direction="row" alignItems="center" justifyContent="flex-start" spacing={2} px={3}>
              {measures && contracts && srf && (
                <>
                  <AutocompleteButton
                    defaultLabel="Contracts"
                    label={contractState ? (contracts.find((c) => c.id === contractState) || {}).label : 'Contracts'}
                    width={90}
                    autocompleteProps={{
                      id: 'contractState',
                      options: contracts,
                      getOptionLabel: (option) => (option.label ? option.label : ''),
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
                      getOptionLabel: (option) => (option.label ? option.label : ''),
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
                      getOptionLabel: (option) => (option.label ? option.label : ''),
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
        {selectedGeoId && (
          <Box sx={{ position: 'absolute', top: '20px', right: '16px', zIndex: 1001, width: '46%' }}>
            <StyledCard p={0} height="100%">
              <Grid container justifyContent="flex-end">
                <IconButton sx={{ padding: 0.5 }} onClick={() => setSelectedGeoId(null)}>
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
                              to={`/states/${rows[0]?.STATE}/counties/${rows[0]?.COUNTY}`}
                            >
                              {rows[0]?.fake_address}
                            </Typography>
                            <Typography sx={{ fontSize: '1.1rem' }}>Open Gaps: {rows.length}</Typography>
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
                                chartValue={filterSrf(rows).length / (filterSrf(rows).length + filterSrf(rows).length)}
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
                              <GaugeChart chartScale={chartData.scale} chartValue={rows.filter((m) => m.isSrf).length / rows.length} />
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
                    {rows.length && <MembersTable rows={filterSrf(rows)} height="265px" csvDownload disableAutoHeight />}
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

export const Component = MapCensus;
