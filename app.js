const canvasElement = document.getElementById("pixel-canvas");
const context = canvasElement.getContext("2d");
let canvasState = null;

function setCanvasState(nextCanvasState) {
  canvasState = nextCanvasState;
}

function renderCanvas() {
  if (!canvasState) {
    return;
  }

  context.clearRect(0, 0, canvasElement.width, canvasElement.height);

  for (let y = 0; y < canvasState.height; y += 1) {
    for (let x = 0; x < canvasState.width; x += 1) {
      const index = y * canvasState.width + x;
      const colorIndex = canvasState.pixels[index];

      if (colorIndex === 0) {
        continue;
      }

      context.fillStyle = canvasState.palette[colorIndex];
      context.fillRect(x, y, 1, 1);
    }
  }
}

async function loadCanvas() {
  const response = await fetch("/canvas");
  const data = await response.json();
  setCanvasState(data);
  renderCanvas();
}

async function clearCanvas() {
  const response = await fetch("/clear", {
    method: "POST",
  });

  const data = await response.json();
  setCanvasState(data);
  renderCanvas();
}

async function applyTool(action) {
  const response = await fetch("/apply-tool", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(action),
  });

  const data = await response.json();

  if (!data.result || !data.result.ok) {
    return;
  }

  setCanvasState(data.canvas);
  renderCanvas();
}

document.getElementById("clear-button").addEventListener("click", () => {
  clearCanvas();
});

document.getElementById("fill-button").addEventListener("click", () => {
  applyTool({
    tool: "fill_rect",
    args: { x: 0, y: 0, w: 64, h: 64, color: 5 },
  });
});

document.getElementById("block-button").addEventListener("click", async () => {
  await applyTool({
    tool: "fill_rect",
    args: { x: 18, y: 18, w: 16, h: 16, color: 2 },
  });

  await applyTool({
    tool: "fill_rect",
    args: { x: 22, y: 22, w: 8, h: 8, color: 4 },
  });
});

document.getElementById("border-button").addEventListener("click", () => {
  applyTool({
    tool: "draw_rect",
    args: { x: 2, y: 2, w: 60, h: 60, color: 1 },
  });
});

loadCanvas();
