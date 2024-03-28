import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import React, { useEffect, useRef, useState, useMemo } from 'react';
import { options, pets } from '../../../fakeData/pets';
//import { states as s } from '../../../fakeData/states';
import { MenuItem, Select, useTheme, Autocomplete, TextField, Stack, Box, Typography, Button } from '@mui/material';
import { Link, useSearchParams } from 'react-router-dom';
import s from '../../../fakeData/gz_2010_us_040_00_500k.json';
//import { countiesData } from "../../../data/counties_us";
import countiesData from '../../../fakeData/gz_2010_us_050_00_5m.json';
import stateToNumber from '../../../fakeData/stateToNumber.json';
import memberData from '../../../fakeData/member_data.json';
import TopFilters from '@/components/inputs/TopFilters';
import allMeasures from '../../../fakeData/measures.json';
import Card from '@/components/Card';
import { useSrfScores } from '@/api/useSrfScores';
import MembersTable from '@/components/tables/MembersTable';

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

const categories = [
  { label: 'Sex', value: 'SEX' },
  { label: 'Race', value: 'RACE' },
  { label: 'Ethnicity', value: 'ETHNICITY' }
];

function findUniqueValues(key) {
  const values = memberData.map((item) => item[key]);
  const uniqueValues = Array.from(new Set(values)).map((item) => ({
    label: item,
    value: item
  }));
  return uniqueValues;
}

function getDataByOption(category, option) {
  const values = memberData.filter((item) => item[category] === option);
  const uniqueValues = Array.from(new Set(values));
  return uniqueValues;
}

const st = s.features.map((item) => {
  //let statePet = pets.find((pet) => pet.state === item.properties.NAME);
  let itemCopy = { ...item };
  /*let itemProperties = { ...item.properties, ...statePet };
  itemCopy.properties = itemProperties; */
  return itemCopy;
});

const statesData = { type: 'FeatureCollection', features: st };

const states = { type: 'FeatureCollection', features: st };

const srfOptions = ['All', 'SRF Only', 'Non-SRF Only'];

mapboxgl.accessToken = 'pk.eyJ1IjoiZDQ1MmRzNTQiLCJhIjoiY2xuN2tvMXNoMGNibTJ1cGRwdTJlM3JnNSJ9.YG9u3Xd5SklObzL_hR8jwg'; // Set your mapbox token here

export default function Map() {
  //const darkMode = useRecoilValue(darkModeState);
  const searchParams = useSearchParams();
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(-96.609435);
  const [lat, setLat] = useState(40.778561);
  const [zoom, setZoom] = useState(4.5);
  const [category, setCategory] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categoryOption, setCategoryOption] = useState('');
  const [selectedMeasureOption, setSelectedMeasureOption] = useState('');
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [selectedCounty, setSelectedCounty] = useState(null);
  const [selectedCategoryOption, setSelectedCategoryOption] = useState(null);
  const [detail, setDetail] = useState(null);
  const [option, setOption] = useState('');
  const [options, setOptions] = useState([]);
  const [measureOption, setMeasureOption] = useState('');
  const [measureOptions, setMeasureOptions] = useState(allMeasures);
  const [selectedSrfOption, setSelectedSrfOption] = useState(null);
  const [measure, setMeasure] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [stepArray, setStepArray] = useState([30, 40, 50, 1000000]);
  const [mapData, setMapData] = useState(countyDataWithCount);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [measureName, setMeasureName] = useState('');
  const [value, setValue] = React.useState('');
  const [clickedCounty, setClickedCounty] = useState(null);
  const { data: srfScores } = useSrfScores({ measure: selectedMeasureOption?.hl_code, limit: selectedSrfOption });

  console.log(srfScores);

  /*   useEffect(() => {
    const entries = Object.fromEntries([...searchParams]);
    const searchAsObject = Object.fromEntries(searchParams);
  }, [searchParams]); */

  useEffect(() => {
    //filters
    if (!selectedCategory) return;
    setCategoryOptions(findUniqueValues(selectedCategory.value));
  }, [selectedCategory]);

  useEffect(() => {
    //filters
    if (!selectedCategoryOption) return;
    let values = getDataByOption(selectedCategory.value, selectedCategoryOption.value);
    setFilteredData(values);
  }, [selectedCategory, selectedCategoryOption]);

  useMemo(() => {
    //filters
    if (!selectedMeasureOption) return;
    //setMeasure(value);
    //const selectedMeasure = allMeasures.find((item) => item.hl_code === selectedMeasureOption.hl_code);
    const selectedMeasure = selectedMeasureOption;
    console.log(selectedMeasure);

    setMeasureName(selectedMeasure.measure_name);
    const measureStepArray = [
      0,
      selectedMeasure.bottom_third_value_2,
      selectedMeasure.middle_third_value_2,
      selectedMeasure.top_third_value_2
    ];

    //county stuff
    const updatedCountyData = countyDataWithCount.features.map((item) => {
      let itemCopy = { ...item };
      let membersInCountyDenom = memberData.filter(
        (d) =>
          d[selectedMeasure.measure_name] === 'FALSE' && d.COUNTY === item.properties.NAME && d.STATE === item.properties.stateAbbreviation
      );

      if (membersInCountyDenom.length === 0) {
        let itemProperties = { ...item.properties, percent: '' };
        itemCopy.properties = itemProperties;
        return itemCopy;
      }
      console.log('MEMBERS DENOM', membersInCountyDenom);
      let countInCountyDenom = membersInCountyDenom.length;
      let countTotalInCounty = memberData.filter((d) => d.COUNTY === item.properties.NAME).length;
      let percent = (countInCountyDenom / countTotalInCounty) * 100;
      let itemProperties = { ...item.properties, percent: percent };
      itemCopy.properties = itemProperties;
      return itemCopy;
    });

    map.current.getSource('countiesData').setData({
      type: 'FeatureCollection',
      features: updatedCountyData
    });

    if (selectedCounty) {
      let countyName = selectedCounty.NAME;
      let membersInCountyDenom = memberData.filter((d) => d[measureName] === 'FALSE' && d.COUNTY === countyName);
      setFilteredMembers(membersInCountyDenom);
    }

    /* 
    This works, but colors were always yellow, so disabled for now
    map.current.setPaintProperty("counties-fill", "fill-color", [
      "step",
      ["get", "percent"],
      "#70F870",
      measureStepArray[0],
      "#ffeda0",
      measureStepArray[1],
      "#F8EC70",
      measureStepArray[2],
      "#c00000",
      110,
      "#fd8d3c",
      120,
      "#fc4e2a",
    ]); */

    //setMapData({ type: "FeatureCollection", features: updatedCountyData });
  }, [selectedMeasureOption, selectedCategoryOption, selectedCategory, filteredData]);

  useEffect(() => {
    if (!clickedCounty) return;
    const [countyFeatures] = map.current.queryRenderedFeatures(clickedCounty.point, {
      //as this?
      layers: ['counties-fill']
    });

    if (countyFeatures) {
      let countyName = countyFeatures.properties.NAME;
      setSelectedCounty(countyFeatures.properties);
      let membersInCountyDenom = memberData.filter((d) => d[measureName] === 'FALSE' && d.COUNTY === countyName);
      setFilteredMembers(membersInCountyDenom);
    }
  }, [clickedCounty]);

  const style = darkMode ? 'mapbox://styles/mapbox/dark-v11' : 'mapbox://styles/mapbox/light-v11';

  useEffect(() => {
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

    /* new mapboxgl.Marker({
      color: "#c00000",
      scale: 0.7,
    })
      .setLngLat([-96.633964, 40.778561])
      .setPopup(popup)
      .addTo(map.current); */

    map.current.on('move', () => {
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
    });
  }, [mapData, darkMode]);

  const handleCategoryChange = (value) => {
    setCategory(value);
    setOptions(findUniqueValues(value));
  };

  const handleOptionChange = (value) => {
    setOption(value);
    let values = getDataByOption(category, value);
    setFilteredData(values);
  };

  const handleMeasureChange = (value) => {
    return;
    //old sate stuff below

    /* const totalCount = filteredData.length;
    const membersInDenom = filteredData.filter(
      (d) => d[selectedMeasure.measure_name] === "FALSE",
    );
    const countInDenom = membersInDenom.length;
    const percent = (countInDenom / totalCount) * 100;

    let color = "red";
    if (percent >= selectedMeasure.bottom_third_value_1) {
      color = "yellow";
    }
    if (percent >= selectedMeasure.middle_third_value_1) {
      color = "green";
    }

    const values = mapData.features.map((item) => {
      let itemCopy = { ...item };
      let membersInStateDenom = filteredData.filter(
        (d) =>
          d[selectedMeasure.measure_name] === "FALSE" &&
          d.STATE === item.properties.ABBR,
      );

      if (membersInStateDenom.length === 0) {
        let itemProperties = { ...item.properties, percent: "" };
        itemCopy.properties = itemProperties;
        return itemCopy;
      }
      let countInStateDenom = membersInStateDenom.length;
      let countTotalInState = filteredData.filter(
        (d) => d.STATE === item.properties.ABBR,
      ).length;
      let percent = (countInStateDenom / countTotalInState) * 100;
      let itemProperties = { ...item.properties, percent: percent };
      itemCopy.properties = itemProperties;
      return itemCopy;
    });

    setMapData({ type: "FeatureCollection", features: values });
    */
  };

  const handleSelectionChange = (e) => {
    setValue(e.target.value);
  };

  return (
    <>
      <Box sx={{ position: 'relative' }}>
        <Box sx={{ position: 'absolute', top: '16px', left: '16px', zIndex: 1000, width: '50%' }}>
          <Card px={2} py={1}>
            <Stack direction="row" alignItems="space-between" justifyContent="space-between" m={1} spacing={2}>
              {/* <Autocomplete
                disablePortal
                id="combo-box-demo"
                options={categories}
                value={selectedCategory}
                //sx={{ width: 200 }}
                fullWidth
                renderInput={(params) => <TextField {...params} label="Category" />}
                autoHighlight
                onChange={(e, value) => setSelectedCategory(value)}
              />
              <Autocomplete
                disablePortal
                id="combo-box-demo"
                options={categoryOptions}
                value={selectedCategoryOption}
                //sx={{ width: 200 }}
                fullWidth
                renderInput={(params) => <TextField {...params} label="Category Options" />}
                autoHighlight
                onChange={(e, value) => setSelectedCategoryOption(value)}
              /> */}
              <Autocomplete
                disablePortal
                id="combo-box-demo"
                options={allMeasures}
                value={selectedMeasureOption || ''}
                //sx={{ width: 200 }}
                fullWidth
                getOptionLabel={(item) => item?.measure_name || ''}
                renderInput={(params) => <TextField {...params} label="Measure" />}
                autoHighlight
                onChange={(e, value) => setSelectedMeasureOption(value)}
              />
              <Autocomplete
                disablePortal
                id="combo-box-demo"
                options={srfOptions}
                value={selectedSrfOption || ''}
                //sx={{ width: 200 }}
                fullWidth
                getOptionLabel={(item) => item || ''}
                renderInput={(params) => <TextField {...params} label="SRF Options" />}
                autoHighlight
                onChange={(e, value) => setSelectedSrfOption(value)}
              />
            </Stack>
          </Card>
        </Box>
        {selectedCounty && (
          <Box sx={{ position: 'absolute', top: '20px', right: '16px', zIndex: 1001, width: '46%', height: '360px' }}>
            <Card p={2} height="100%">
              <Stack direction="column" spacing={2}>
                <Stack direction="row" justifyContent={'space-between'}>
                  <Typography
                    sx={{ fontWeight: 600, fontSize: '1.5rem', textDecoration: 'none', color: '#4d9fda' }}
                    component={Link}
                    to={`/states/${selectedCounty?.stateAbbreviation}/counties/${selectedCounty?.NAME}`}
                  >
                    {selectedCounty.NAME} County, {selectedCounty.stateAbbreviation}
                  </Typography>
                  <Typography>
                    {filteredMembers.length} Members <br />
                    {selectedMeasureOption.measure_name} in denominator
                  </Typography>
                </Stack>
                {/* <Typography sx={{ fontWeight: 600, fontSize: '1.15rem' }}>
                  {selectedCounty.percent ? selectedCounty?.percent.toFixed(2) : 'N/A'}%
                </Typography>
                <Typography sx={{ fontWeight: 600, fontSize: '0.9rem' }}>Other Info about this. Not sure what.</Typography> */}
              </Stack>
              <Box sx={{ height: '290px', overflow: 'auto' }}>
                {filteredMembers.length && <MembersTable rows={filteredMembers} csvDownload />}
              </Box>
            </Card>
          </Box>
        )}
      </Box>
      <div style={{ width: '100%', height: '100%' }}>
        <div ref={mapContainer} style={{ height: '100vh' }} />
      </div>
      {/* <Select label="Select an option" value={option} onChange={(e) => setOption(e.target.value)}>
        {options.map((item) => (
          <MenuItem key={item} value={item.value}>
            {item.label}
          </MenuItem>
        ))}
      </Select>
      <Link to={`/counties/${selectedState?.STATE}`}>{selectedState?.NAME}</Link>
      <div>
        {detail} {option.includes('Perc') && '%'}
      </div>
      */}
    </>
  );
}
