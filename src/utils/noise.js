import { Random } from 'random';

const perlinNoise = (imgSize, noiseSize, seed) => {
  if (noiseSize < 1) {
    noiseSize = 1;
  }

  const rng = new Random();
  rng.use(seed);
  const canvas = document.createElement('canvas');
  canvas.width = imgSize;
  canvas.height = imgSize;

  let canvas_ctx = canvas.getContext("2d"),
    offscreen = document.createElement("canvas"),
    offscreen_ctx = offscreen.getContext("2d");
    // saved_alpha = canvas_ctx.globalAlpha;

  // canvas_ctx.filter = 'invert(1)';
  canvas_ctx.fillStyle='#000000';
  canvas_ctx.fillRect(0, 0, imgSize, imgSize);

  /* Fill the offscreen buffer with random noise. */
  offscreen.width = canvas.width;
  offscreen.height = canvas.height;

  let offscreen_id = offscreen_ctx.getImageData(0, 0,
    offscreen.width,
    offscreen.height),
    offscreen_pixels = offscreen_id.data;

  for (let i = 0; i < offscreen_pixels.length; i += 4) {
    const alpha = rng.int(0, 255);
    offscreen_pixels[i] = alpha;
    offscreen_pixels[i + 1] = alpha;
    offscreen_pixels[i + 2] = alpha;
    offscreen_pixels[i + 3] = 255;
  }

  offscreen_ctx.putImageData(offscreen_id, 0, 0);

  /* Scale random iterations onto the canvas to generate Perlin noise. */
  for (let size = noiseSize; size <= offscreen.width; size *= 2) {
    let x = rng.int(0, (offscreen.width - size)),
      y = rng.int(0, (offscreen.height - size));

    canvas_ctx.globalAlpha = noiseSize / size;
    canvas_ctx.drawImage(offscreen, x, y, size, size,
      0, 0, canvas.width, canvas.height);
  }

  // canvas_ctx.drawImage(offscreen, 0, 0);

  // canvas_ctx.globalAlpha = saved_alpha;

  // return canvas.toDataURL();
  return canvas;
};

export default perlinNoise;
