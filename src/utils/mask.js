const assignChannel = (imageData, channelTo, channelFrom) => {
  if(channelTo < 0 || channelTo > 3 || channelFrom < 0 || channelFrom > 3) {
    throw new Error("bad channel number");
  }
  if(channelTo === channelFrom)
    return;
  let px = imageData.data;
  for(let i = 0; i < px.length; i += 4) {
    px[i + channelTo] = px[i + channelFrom];
  }
};

const convertToMask = (glfxCanvas) => {
  const width = glfxCanvas.width;
  const height = glfxCanvas.height;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(glfxCanvas, 0, 0);
  const imageData = ctx.getImageData(0, 0, width, height)
  assignChannel(imageData, 3, 0);
  ctx.putImageData(imageData, 0, 0);

  // console.log(canvas.toDataURL());
  return canvas;
};

export default convertToMask;
