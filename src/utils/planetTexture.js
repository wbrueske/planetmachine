import glxf from 'glfx';
import perlinNoise from '../utils/noise';
import convertToMask from '../utils/mask';

const planetTexture = (seed, resolution, noiseSize, waterLevel) => {
  const bulgexy = resolution * .5;
  const bulgeRadius = resolution;
  const bulgeStrength = .75;
  const canvas = glxf.canvas();

  const geographyTexture = canvas.texture(perlinNoise(resolution, noiseSize, seed));

  canvas.draw(geographyTexture)
    .bulgePinch(bulgexy, bulgexy, bulgeRadius, bulgeStrength)
    .brightnessContrast(0, .2)
    .update();
  const terrainSrc = canvas.toDataURL();

  canvas.draw(geographyTexture)
    .bulgePinch(bulgexy, bulgexy, bulgeRadius, bulgeStrength)
    .brightnessContrast(waterLevel, .95)
    .update();
  const beachSrc = convertToMask(canvas).toDataURL();

  canvas.draw(geographyTexture)
    .bulgePinch(bulgexy, bulgexy, bulgeRadius, bulgeStrength)
    .brightnessContrast(waterLevel - 0.01, .95)
    .update();
  const oceanSrc = convertToMask(canvas).toDataURL();
  geographyTexture.destroy();

  return {
    terrainMap: terrainSrc,
    beachMap: beachSrc,
    oceanMap: oceanSrc,
  };
};

export default planetTexture;
