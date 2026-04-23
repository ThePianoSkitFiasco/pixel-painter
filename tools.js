function draw_pixel(canvas, args) {
  if (!canvas || !args) {
    return { ok: false, error: "Invalid canvas or args" };
  }

  const { x, y, color } = args;

  if (
    !Number.isInteger(x) ||
    !Number.isInteger(y) ||
    !Number.isInteger(color)
  ) {
    return { ok: false, error: "Invalid arguments" };
  }

  const ok = canvas.setPixel(x, y, color);

  if (!ok) {
    return { ok: false, error: "Failed to draw pixel" };
  }

  return { ok: true };
}

function erase_pixel(canvas, args) {
  if (!canvas || !args) {
    return { ok: false, error: "Invalid canvas or args" };
  }

  const { x, y } = args;

  if (!Number.isInteger(x) || !Number.isInteger(y)) {
    return { ok: false, error: "Invalid arguments" };
  }

  const ok = canvas.setPixel(x, y, 0);

  if (!ok) {
    return { ok: false, error: "Failed to erase pixel" };
  }

  return { ok: true };
}

function fill_rect(canvas, args) {
  if (!canvas || !args) {
    return { ok: false, error: "Invalid canvas or args" };
  }

  const { x, y, w, h, color } = args;

  if (
    !Number.isInteger(x) ||
    !Number.isInteger(y) ||
    !Number.isInteger(w) ||
    !Number.isInteger(h) ||
    !Number.isInteger(color) ||
    w <= 0 ||
    h <= 0
  ) {
    return { ok: false, error: "Invalid arguments" };
  }

  let wroteAny = false;

  for (let py = y; py < y + h; py += 1) {
    for (let px = x; px < x + w; px += 1) {
      if (canvas.setPixel(px, py, color)) {
        wroteAny = true;
      }
    }
  }

  if (!wroteAny) {
    return { ok: false, error: "Failed to fill rectangle" };
  }

  return { ok: true };
}

function draw_rect(canvas, args) {
  if (!canvas || !args) {
    return { ok: false, error: "Invalid canvas or args" };
  }

  const { x, y, w, h, color } = args;

  if (
    !Number.isInteger(x) ||
    !Number.isInteger(y) ||
    !Number.isInteger(w) ||
    !Number.isInteger(h) ||
    !Number.isInteger(color) ||
    w <= 0 ||
    h <= 0
  ) {
    return { ok: false, error: "Invalid arguments" };
  }

  const right = x + w - 1;
  const bottom = y + h - 1;
  let wroteAny = false;

  for (let px = x; px <= right; px += 1) {
    if (canvas.setPixel(px, y, color)) {
      wroteAny = true;
    }

    if (canvas.setPixel(px, bottom, color)) {
      wroteAny = true;
    }
  }

  for (let py = y + 1; py < bottom; py += 1) {
    if (canvas.setPixel(x, py, color)) {
      wroteAny = true;
    }

    if (canvas.setPixel(right, py, color)) {
      wroteAny = true;
    }
  }

  if (!wroteAny) {
    return { ok: false, error: "Failed to draw rectangle" };
  }

  return { ok: true };
}

function applyTool(canvas, action) {
  if (!canvas || !action || typeof action !== "object") {
    return { ok: false, error: "Invalid action" };
  }

  const { tool, args } = action;

  if (typeof tool !== "string") {
    return { ok: false, error: "Invalid tool" };
  }

  const tools = {
    draw_pixel,
    erase_pixel,
    fill_rect,
    draw_rect,
  };

  const toolFn = tools[tool];

  if (!toolFn) {
    return { ok: false, error: "Unknown tool" };
  }

  return toolFn(canvas, args);
}

module.exports = {
  draw_pixel,
  erase_pixel,
  fill_rect,
  draw_rect,
  applyTool,
};
