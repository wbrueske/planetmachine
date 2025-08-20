import { Random } from 'random';

const planetSeeder = (seed) => {
  const rng = new Random();
  rng.use(seed);

  const geographyDist = rng.normal(8, 2);
  let geographyPerlinSize = Math.abs(Math.round(geographyDist()));
  if (geographyPerlinSize < 1) {
    geographyPerlinSize = 1;
  }

  const terrainHueDist = rng.normal(80, 30);
  const terrainHue = Math.round(Math.abs(terrainHueDist()));
  const terrainSaturationDist = rng.normal(35, 5);
  const terrainSaturation = Math.round(terrainSaturationDist());
  const terrainLightness = rng.int(30, 45);
    
  const atmospheretHue = rng.int(0, 359);
  const atmosphereSaturation = rng.int(90, 100);
  const atmosphereLightness = rng.int(50, 100);

  // const sunlightDirection = rng.int(0, 359);
  const sunlightDirection = 135;
  // const sunlightDistance = rng.int(25, 45) * -1;
  const sunlightDistance = -25;

  const oceanHue = rng.int(0, 359);
  const oceanSaturation = rng.int(50, 90);
  const oceanLightness = rng.int(15, 25);

  const waterLevelDist = rng.normal(0, .08);
  const waterLevel = waterLevelDist().toFixed(2);

  return {
    noiseSize: geographyPerlinSize,
    landColor: {
      h: terrainHue,
      s: terrainSaturation,
      l: terrainLightness,
    },
    oceanColor: {
      h: oceanHue,
      s: oceanSaturation,
      l: oceanLightness,
    },
    atmosphereColor: {
      h: atmospheretHue,
      s: atmosphereSaturation,
      l: atmosphereLightness
    },
    sunlightDirection: sunlightDirection,
    sunlightDistance: sunlightDistance,
    waterLevel: waterLevel,
  };
};

export default planetSeeder;
