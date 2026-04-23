const DEFAULT_WIDTH = 64;
const DEFAULT_HEIGHT = 64;

const DEFAULT_PALETTE = [
  "transparent",
  "#111827",
  "#f59e0b",
  "#3b82f6",
  "#ef4444",
  "#10b981",
];

function createCanvas(width = DEFAULT_WIDTH, height = DEFAULT_HEIGHT) {
  const pixels = new Array(width * height).fill(0);

  function getIndex(x, y) {
    if (
      !Number.isInteger(x) ||
      !Number.isInteger(y) ||
      x < 0 ||
      y < 0 ||
      x >= width ||
      y >= height
    ) {
      return -1;
    }

    return y * width + x;
  }

  return {
    width,
    height,
    palette: DEFAULT_PALETTE,
    clearCanvas() {
      pixels.fill(0);
    },
    getPixel(x, y) {
      const index = getIndex(x, y);
      return index === -1 ? null : pixels[index];
    },
    setPixel(x, y, colorIndex) {
      const index = getIndex(x, y);

      if (
        index === -1 ||
        !Number.isInteger(colorIndex) ||
        colorIndex < 0 ||
        colorIndex >= DEFAULT_PALETTE.length
      ) {
        return false;
      }

      pixels[index] = colorIndex;
      return true;
    },
    serializeCanvas() {
      return JSON.stringify({
        width,
        height,
        palette: DEFAULT_PALETTE,
        pixels,
      });
    },
  };
}

module.exports = {
  DEFAULT_PALETTE,
  createCanvas,
};
