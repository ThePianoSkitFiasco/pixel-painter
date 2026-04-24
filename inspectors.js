function countColors(canvasData) {
  const counts = {};
  const pixels = canvasData && Array.isArray(canvasData.pixels) ? canvasData.pixels : [];

  for (let i = 0; i < pixels.length; i += 1) {
    const colorIndex = pixels[i];

    if (counts[colorIndex] === undefined) {
      counts[colorIndex] = 0;
    }

    counts[colorIndex] += 1;
  }

  return counts;
}

function countFilledPixels(canvasData) {
  const pixels = canvasData && Array.isArray(canvasData.pixels) ? canvasData.pixels : [];
  let filledPixels = 0;

  for (let i = 0; i < pixels.length; i += 1) {
    if (pixels[i] !== 0) {
      filledPixels += 1;
    }
  }

  return filledPixels;
}

function getBounds(canvasData) {
  const width = canvasData ? canvasData.width : 0;
  const height = canvasData ? canvasData.height : 0;
  const pixels = canvasData && Array.isArray(canvasData.pixels) ? canvasData.pixels : [];

  let minX = width;
  let minY = height;
  let maxX = -1;
  let maxY = -1;

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const index = y * width + x;

      if (pixels[index] === 0) {
        continue;
      }

      if (x < minX) {
        minX = x;
      }

      if (y < minY) {
        minY = y;
      }

      if (x > maxX) {
        maxX = x;
      }

      if (y > maxY) {
        maxY = y;
      }
    }
  }

  if (maxX === -1 || maxY === -1) {
    return null;
  }

  return {
    x: minX,
    y: minY,
    w: maxX - minX + 1,
    h: maxY - minY + 1,
  };
}

function inspectCanvas(canvasData) {
  return {
    filledPixels: countFilledPixels(canvasData),
    colorCounts: countColors(canvasData),
    bounds: getBounds(canvasData),
  };
}

module.exports = {
  countColors,
  countFilledPixels,
  getBounds,
  inspectCanvas,
};
