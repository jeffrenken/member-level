import useContracts from '@/api/useContracts';
import useMeasures from '@/api/useMeasures';
import useProviders from '@/api/useProvidersGroups';
import useSrf from '@/api/useSrf';
import AutocompleteButton from '@/components/Autocomplete';
import Card from '@/components/Card';
import MembersTable from '@/components/tables/MembersTable';
import { contractFilterState } from '@/state/contractFilterState';
import { measureFilterState } from '@/state/measureFilterState';
import { providerFilterState } from '@/state/providerFilterState';
import { srfFilterState } from '@/state/srfFilterState';
import { Box, Grid, Stack, Typography, useTheme } from '@mui/material';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import s from '../../../fakeData/gz_2010_us_040_00_500k.json';
import countiesData from '../../../fakeData/gz_2010_us_050_00_5m.json';
import memberData from '../../../fakeData/member_data.json';
import stateToNumber from '../../../fakeData/stateToNumber.json';
import statesBoundingBoxes from '../../../fakeData/statesBoundingBoxes.json';
import useFilteredMembers from '@/api/useFilteredMembers';
import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from 'recharts';
import GaugeChart from '@/components/charts/GaugeChart';

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
  const [countyFilteredMembers, setCountyFilteredMembers] = useState([]);
  const [clickedCounty, setClickedCounty] = useState(null);
  const [measureState, setMeasureState] = useState(null);
  const [contractState, setContractState] = useRecoilState(contractFilterState);
  const [providerState, setProviderState] = useRecoilState(providerFilterState);
  const [allMembersInDenom, setAllMembersInDenom] = useState([]);
  const [srfState, setSrfState] = useRecoilState(srfFilterState);
  const [mapReady, setMapReady] = useState(false);
  const { filteredMembers } = useFilteredMembers();

  const style = darkMode ? 'mapbox://styles/mapbox/dark-v11' : 'mapbox://styles/mapbox/light-v11';
  const stepArray = [25, 30, 35, 1000000];
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
          'fill-color': [
            'step',
            ['get', 'percent'],
            '#70F870',
            stepArray[0],
            '#ffeda0',
            stepArray[1],
            '#F8EC70',
            stepArray[2],
            '#c00000',
            110,
            '#fd8d3c',
            120,
            '#fc4e2a'
          ],
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

      const popup = new mapboxgl.Popup({
        id: 'popup',
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
        popup.setLngLat(event.lngLat).setHTML(`<div class="text-lg font-bold">${name}</div><div>${percent}%</div>`).addTo(map.current);
        //}
      });

      map.current.on('mouseleave', 'counties-fill', () => {
        map.current.getCanvas().style.cursor = '';
        popup.remove();
      });
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
    setupMap();
  }, []);

  const chartScale = [
    [selectedMeasureOption?.bottom_third_upper_value / 100, theme.palette.cardRed],
    [selectedMeasureOption?.middle_third_upper_value / 100, theme.palette.cardYellow],
    [selectedMeasureOption?.top_third_upper_value / 100, theme.palette.cardGreen]
  ];
  const chartValue = 0.77;

  useMemo(() => {
    if (!filteredMembers.length || !mapReady || !map.current || !selectedMeasureOption) {
      return;
    }

    const selectedMeasure = selectedMeasureOption;
    let membersInDenom = [...filteredMembers];

    if (selectedMeasure) {
      membersInDenom = filteredMembers.filter((member) => member.memberMeasures[selectedMeasure['Measure Name']] === 0);
    }
    setAllMembersInDenom(membersInDenom);

    let uniqueStateAbbreviations = [];

    const updatedCountyData = countyDataWithCount.features.map((item) => {
      let itemCopy = { ...item };
      let membersInCountyDenom = membersInDenom.filter(
        (member) => member.COUNTY === item.properties.NAME && member.STATE === item.properties.stateAbbreviation
      );

      if (membersInCountyDenom.length === 0) {
        let itemProperties = { ...item.properties, percent: '' };
        itemCopy.properties = itemProperties;
        return itemCopy;
      }
      let countInCountyDenom = membersInCountyDenom.length;
      let countTotalInCounty = filteredMembers.filter(
        (member) => member.COUNTY === item.properties.NAME && member.STATE === item.properties.stateAbbreviation
      ).length;
      let percent = (countInCountyDenom / countTotalInCounty) * 100;
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
      let membersInCountyDenom = allMembersInDenom.filter(
        (member) => member.COUNTY === selectedCounty.NAME && member.STATE === selectedCounty.stateAbbreviation
      );

      setCountyFilteredMembers(membersInCountyDenom);
    }
  }, [selectedMeasureOption, filteredMembers, mapReady]);

  useEffect(() => {
    if (!clickedCounty) return;
    const [countyFeatures] = map.current.queryRenderedFeatures(clickedCounty.point, {
      //as this?
      layers: ['counties-fill']
    });

    if (countyFeatures) {
      let county = countyFeatures.properties;
      setSelectedCounty(county);
      let membersInCountyDenom = allMembersInDenom.filter(
        (member) => member.COUNTY === county.NAME && member.STATE === county.stateAbbreviation
      );
      setCountyFilteredMembers(membersInCountyDenom);
    }
  }, [clickedCounty]);

  const handleMeasureChange = (value) => {
    setMeasureState(value);
    setSelectedMeasureOption(measures.find((m) => m.id === value));
  };

  return (
    <>
      <Box sx={{ position: 'relative' }}>
        <Box sx={{ position: 'absolute', top: '16px', left: '16px', zIndex: 2, width: '40%' }}>
          <Card px={0} py={1}>
            <Stack direction="row" alignItems="center" justifyContent="flex-start" spacing={2} px={3}>
              {measures.length && contracts.length && srf.length && (
                <>
                  <AutocompleteButton
                    defaultLabel="Contracts"
                    options={contracts}
                    value={contractState}
                    onChange={setContractState}
                    width={90}
                  />
                  <AutocompleteButton defaultLabel="Measures" options={measures} value={measureState} onChange={handleMeasureChange} />
                  <AutocompleteButton defaultLabel="SRF" options={srf} value={srfState} onChange={setSrfState} />
                </>
              )}
            </Stack>
          </Card>
        </Box>
        {selectedCounty && (
          <Box sx={{ position: 'absolute', top: '20px', right: '16px', zIndex: 1001, width: '46%' }}>
            <Card p={2} height="100%">
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
                        <Typography sx={{ fontSize: '1.1rem' }}>Open Gaps: {countyFilteredMembers.length}</Typography>
                      </Box>
                    </Stack>
                  </Stack>
                </Grid>
                <Grid item md={12} lg={8}>
                  <Stack direction="row" justifyContent={'flex-end'} alignItems={'center'} spacing={3}>
                    <Box>
                      <Box minWidth={140} height={100}>
                        <GaugeChart chartScale={chartScale} chartValue={0.66} />
                      </Box>
                      <Typography sx={{ fontSize: '0.7rem', marginTop: '-8px' }} align="center">
                        Stars Performance
                      </Typography>
                    </Box>
                    <Box>
                      <Box minWidth={140} height={100}>
                        <GaugeChart chartScale={chartScale} chartValue={0.99} />
                      </Box>
                      <Typography sx={{ fontSize: '0.7rem', marginTop: '-8px' }} align="center">
                        Health Equity Performance
                      </Typography>
                    </Box>
                    {/* <Typography sx={{ fontSize: '0.7rem', width: '150px' }}>
                      Some kind of desctiption. Maybe? .Not sure what to do with the space.
                    </Typography> */}
                  </Stack>
                </Grid>
              </Grid>
              <Box sx={{ height: '290px' }}>
                {countyFilteredMembers.length && <MembersTable rows={countyFilteredMembers} height="290px" />}
              </Box>
            </Card>
          </Box>
        )}
      </Box>
      <div style={{ width: '100%', height: '100%' }}>
        <div ref={mapContainer} style={{ height: '100vh' }} />
      </div>
    </>
  );
}
