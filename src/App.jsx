import {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
  useId,
} from 'react';
import planetSeeder from './utils/planetSeeder';
import planetTexture from './utils/planetTexture';
import Planet from './components/Planet';
import PlusMinusRange from './components/PlusMinusRange';
import { useDebounce, useDebouncedCallback } from 'use-debounce';
import { HexColorInput, HexColorPicker, HslColorPicker } from 'react-colorful';
import { colord } from 'colord';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowsRotate } from '@fortawesome/free-solid-svg-icons';

function App() {
  const seeder = () => {
    return Math.random().toString().replace('0.', '').slice(0, 8);
  };

  const seedInputId = useId();
  const [seed, setSeed] = useState(seeder);
  const planetSeed = useMemo(() => planetSeeder(seed), [seed]);

  const resolutionId = useId();
  const [resolution, setResolution] = useState(512);

  const [landColor, setLandColor] = useState(
    colord(planetSeed.landColor).toHex()
  );
  const [oceanColor, setOceanColor] = useState(
    colord(planetSeed.oceanColor).toHex()
  );
  const [atmosphereColor, setAtmosphereColor] = useState(
    colord(planetSeed.atmosphereColor).toHex()
  );
  const [waterLevel, setWaterLevel] = useState(planetSeed.waterLevel);
  const [loading, setLoading] = useState('');
  const [randomizeAll, setRandomizeAll] = useState(true);
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(false);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);

  const planetSeedColors = {
    land: colord(planetSeed.landColor).toHex(),
    ocean: colord(planetSeed.oceanColor).toHex(),
    atmosphere: colord(planetSeed.atmosphereColor).toHex(),
  };

  // const planetColors = planetSeedColors;
  const planetColors = {
    landColor: landColor,
    oceanColor: oceanColor,
    atmosphereColor: atmosphereColor,
  };

  if (landColor) {
    planetColors.land = landColor;
  }

  if (oceanColor) {
    planetColors.ocean = oceanColor;
  }

  if (atmosphereColor) {
    planetColors.atmosphere = atmosphereColor;
  }

  const debounceSwitch = useDebouncedCallback((value, variableType) => {
    switch (variableType) {
      case 'seed':
        setSeed(value);
        break;
      case 'landColor':
        setLandColor(value);
        break;
      case 'oceanColor':
        setOceanColor(value);
        break;
      case 'atmosphereColor':
        setAtmosphereColor(value);
        break;
      case 'waterLevel':
        setWaterLevel(parseFloat(value).toFixed(2));
        break;
      default:
        console.log('invalid variableType for debounceSwitch()');
    }
  }, 200);

  const newSeed = () => {
    const newSeedValue = seeder();
    setSeed(newSeedValue);
    document.getElementById(seedInputId).value = newSeedValue;
  };

  const clickRandomizeAll = () => {
    setRandomizeAll(true);
    setLoading('loading');
    newSeed();
  };

  useEffect(() => {
    if (randomizeAll) {
      setLandColor(colord(planetSeed.landColor).toHex());
      setOceanColor(colord(planetSeed.oceanColor).toHex());
      setAtmosphereColor(colord(planetSeed.atmosphereColor).toHex());
      setWaterLevel(planetSeed.waterLevel);
    }

    setLoading('');
    setRandomizeAll(false);
  }, [seed]);

  const texture = useMemo(() => (
    planetTexture(
      seed,
      resolution,
      planetSeed.noiseSize,
      waterLevel
    )
  ), [seed, resolution, planetSeed.noiseSize, waterLevel]);

  const planetStyle = useMemo(() => ({
    '--planet-color': `${planetColors.land}`,
    '--ocean-color': `${planetColors.ocean}`,
    '--atmosphere-color': `${planetColors.atmosphere}`,
    '--sunlight-direction': `rotate(${planetSeed.sunlightDirection}deg)`,
    '--sunlight-distance': `${planetSeed.sunlightDistance}%`,
    '--detail-img': `url(${texture.terrainMap})`,
    '--beach-mask': `url(${texture.beachMap})`,
    '--ocean-mask': `url(${texture.oceanMap})`,
  }), [
    planetColors.land,
    planetColors.ocean,
    planetColors.atmosphere,
    planetSeed.sunlightDirection,
    planetSeed.sunlightDistance,
    texture.terrainMap,
    texture.beachMap,
    texture.oceanMap,
  ]);

  const waterSliderId = useId();

  const waterUp = (nextValue) => {
    const newValue = nextValue != null ? nextValue : (parseFloat(waterLevel) + 0.01);
    debounceSwitch(newValue.toFixed(2), 'waterLevel');
  };

  const waterDown = (nextValue) => {
    const newValue = nextValue != null ? nextValue : (parseFloat(waterLevel) - 0.01);
    debounceSwitch(newValue.toFixed(2), 'waterLevel');
  };

  const changeResolution = (newResolution) => {
    setResolution(parseInt(newResolution));
  };

  const toggleLeftSidebar = () => {
    setLeftSidebarOpen((prev) => !prev);
    setRightSidebarOpen(false);
  };

  const toggleRightSidebar = () => {
    setRightSidebarOpen((prev) => !prev);
    setLeftSidebarOpen(false);
  };

  const closeSidebars = () => {
    setLeftSidebarOpen(false);
    setRightSidebarOpen(false);
  };

  return (
    <div className='viewport'>
      <div className={'sidebar sidebar--left' + (leftSidebarOpen ? ' is-open' : '')}>
        <div className='sidebar__inner'>
          <div className='seed-info'>
            <h1>Planet Machine</h1>
          </div>
          <div className='seed-info'>
            <label className='seed-info__label' htmlFor={resolutionId}>
              Resolution
            </label>
            {/* <input className='seed-info__input' id={resolutionId} defaultValue={seed} onChange={(e) => debounceSwitch(e.target.value, 'seed')} type="text" /> */}
            <select
              name='resolution'
              id={resolutionId}
              defaultValue={resolution}
              onChange={(e) => changeResolution(e.target.value)}
            >
              <option value='256'>256</option>
              <option value='512'>512</option>
              <option value='1024'>1024</option>
            </select>
          </div>
          <div className='seed-info'>
            <label className='seed-info__label' htmlFor={seedInputId}>
              Seed
            </label>
            <div className='seed-info__controls'>
              <input
                className='seed-info__input'
                id={seedInputId}
                defaultValue={seed}
                onChange={(e) => debounceSwitch(e.target.value, 'seed')}
                type='text'
              />
              <button
                className='seed-info__random'
                onClick={newSeed}
                aria-label='Randomize seed'
              >
                <FontAwesomeIcon icon={faArrowsRotate} />
              </button>
            </div>
          </div>
          <div className='seed-info'>
            <PlusMinusRange
              label={'Ocean Depth'}
              rangeId={waterSliderId}
              min={-0.25}
              max={0.25}
              step={0.01}
              defaultValue={waterLevel}
              onDown={waterDown}
              onUp={waterUp}
              onChange={(event) =>
                debounceSwitch(parseFloat(event.target.value), 'waterLevel')
              }
            />
            {/* <PlusMinusRange label={''} rangeId={waterSliderId} min={-0.25} max={0.25} step={0.01} defaultValue={waterLevel} onDown={waterDown} onUp={waterUp} onChange={(event) => debounceSwitch(parseFloat(event.target.value), 'waterLevel')} /> */}
          </div>
          <div className='seed-info seed-info--randomize'>
            <button className='seed-info__button' onClick={clickRandomizeAll}>
              Randomize all
            </button>
          </div>
        </div>
      </div>

      <div>
        <div className={loading + ' planet-container'}>
          <Planet styleVariables={planetStyle} />
        </div>
      </div>

      <div className={'sidebar sidebar--right' + (rightSidebarOpen ? ' is-open' : '')}>
        <div className='sidebar__inner'>
          <div className='seed-info'>
            <label>Terrain Color</label>
            <HexColorPicker
              color={landColor}
              onChange={(newLandColor) => setLandColor(newLandColor)}
            />
            <HexColorInput
              color={landColor}
              onChange={(newLandColor) => setLandColor(newLandColor)}
            />
          </div>
          <div className='seed-info'>
            <label>Ocean Color</label>
            <HexColorPicker
              color={oceanColor}
              onChange={(newOceanColor) => setOceanColor(newOceanColor)}
            />
            <HexColorInput
              color={oceanColor}
              onChange={(newOceanColor) => setOceanColor(newOceanColor)}
            />
          </div>
          <div className='seed-info'>
            <label>Atmosphere Color</label>
            <HexColorPicker
              color={atmosphereColor}
              onChange={(newAtmosphereColor) => setAtmosphereColor(newAtmosphereColor)}
            />
            <HexColorInput
              color={atmosphereColor}
              onChange={(newAtmosphereColor) => setAtmosphereColor(newAtmosphereColor)}
            />
          </div>
        </div>
      </div>
      <button
        className='sidebar-toggle sidebar-toggle--left'
        aria-label='Toggle settings'
        aria-expanded={leftSidebarOpen}
        onClick={toggleLeftSidebar}
      >
        Settings
      </button>
      <button
        className='sidebar-toggle sidebar-toggle--right'
        aria-label='Toggle color controls'
        aria-expanded={rightSidebarOpen}
        onClick={toggleRightSidebar}
      >
        Colors
      </button>
    </div>
  );
}

export default App;
