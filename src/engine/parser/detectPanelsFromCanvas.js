const MIN_PANEL_SIZE = 18;
const LINE_DARKNESS = 214;
const GROUP_GAP = 5;

function isInk(data, index) {
  const alpha = data[index + 3];
  if (alpha < 40) return false;

  const r = data[index];
  const g = data[index + 1];
  const b = data[index + 2];
  const gray = r * 0.299 + g * 0.587 + b * 0.114;
  const saturation = Math.max(r, g, b) - Math.min(r, g, b);
  return gray < LINE_DARKNESS || saturation > 70;
}

function groupIndexes(indexes) {
  const groups = [];
  for (const value of indexes) {
    const last = groups[groups.length - 1];
    if (!last || value - last.end > GROUP_GAP) {
      groups.push({ start: value, end: value });
    } else {
      last.end = value;
    }
  }
  return groups.map((group) => Math.round((group.start + group.end) / 2));
}

function getInkBounds(data, width, height) {
  let minX = width;
  let minY = height;
  let maxX = 0;
  let maxY = 0;
  let count = 0;

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      if (isInk(data, (y * width + x) * 4)) {
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
        count += 1;
      }
    }
  }

  if (!count) return null;
  return { minX, minY, maxX, maxY, width: maxX - minX, height: maxY - minY };
}

function findLineCenters(data, width, height, bounds) {
  const rowHits = [];
  const colHits = [];

  for (let y = bounds.minY; y <= bounds.maxY; y += 1) {
    let hits = 0;
    for (let x = bounds.minX; x <= bounds.maxX; x += 1) {
      if (isInk(data, (y * width + x) * 4)) hits += 1;
    }
    if (hits / Math.max(bounds.width, 1) > 0.18) rowHits.push(y);
  }

  for (let x = bounds.minX; x <= bounds.maxX; x += 1) {
    let hits = 0;
    for (let y = bounds.minY; y <= bounds.maxY; y += 1) {
      if (isInk(data, (y * width + x) * 4)) hits += 1;
    }
    if (hits / Math.max(bounds.height, 1) > 0.18) colHits.push(x);
  }

  const xs = groupIndexes(colHits);
  const ys = groupIndexes(rowHits);

  if (!xs.some((x) => Math.abs(x - bounds.minX) < 8)) xs.unshift(bounds.minX);
  if (!xs.some((x) => Math.abs(x - bounds.maxX) < 8)) xs.push(bounds.maxX);
  if (!ys.some((y) => Math.abs(y - bounds.minY) < 8)) ys.unshift(bounds.minY);
  if (!ys.some((y) => Math.abs(y - bounds.maxY) < 8)) ys.push(bounds.maxY);

  return {
    xs: [...new Set(xs)].sort((a, b) => a - b),
    ys: [...new Set(ys)].sort((a, b) => a - b),
  };
}

function edgeCoverage(data, width, height, x1, y1, x2, y2) {
  const steps = Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1), 1);
  let hits = 0;

  for (let i = 0; i <= steps; i += 1) {
    const x = Math.round(x1 + ((x2 - x1) * i) / steps);
    const y = Math.round(y1 + ((y2 - y1) * i) / steps);
    let localHit = false;

    for (let oy = -2; oy <= 2 && !localHit; oy += 1) {
      for (let ox = -2; ox <= 2; ox += 1) {
        const px = x + ox;
        const py = y + oy;
        if (px < 0 || py < 0 || px >= width || py >= height) continue;
        if (isInk(data, (py * width + px) * 4)) {
          localHit = true;
          break;
        }
      }
    }

    if (localHit) hits += 1;
  }

  return hits / (steps + 1);
}

function detectRectPanels(data, width, height, bounds, lines) {
  const panels = [];
  let id = 1;

  for (let yi = 0; yi < lines.ys.length - 1; yi += 1) {
    for (let xi = 0; xi < lines.xs.length - 1; xi += 1) {
      const x = lines.xs[xi];
      const y = lines.ys[yi];
      const w = lines.xs[xi + 1] - x;
      const h = lines.ys[yi + 1] - y;
      if (w < MIN_PANEL_SIZE || h < MIN_PANEL_SIZE) continue;

      const coverages = [
        edgeCoverage(data, width, height, x, y, x + w, y),
        edgeCoverage(data, width, height, x, y + h, x + w, y + h),
        edgeCoverage(data, width, height, x, y, x, y + h),
        edgeCoverage(data, width, height, x + w, y, x + w, y + h),
      ];

      if (coverages.filter((coverage) => coverage > 0.34).length >= 3) {
        panels.push({ id: `panel-${id}`, x, y, width: w, height: h, role: "panel" });
        id += 1;
      }
    }
  }

  return dedupePanels(panels, bounds);
}

function dedupePanels(panels, bounds) {
  const seen = new Set();
  return panels
    .filter((panel) => {
      const key = [panel.x, panel.y, panel.width, panel.height]
        .map((value) => Math.round(value / 4))
        .join(":");
      if (seen.has(key)) return false;
      seen.add(key);
      return panel.width * panel.height > bounds.width * bounds.height * 0.006;
    })
    .slice(0, 24);
}

function fallbackPanels(bounds) {
  const unit = Math.min(bounds.width / 4, bounds.height / 3);
  const x = bounds.minX + bounds.width / 2 - unit / 2;
  const y = bounds.minY + bounds.height / 2 - unit / 2;
  const layout = [
    [0, 0, "front"],
    [-1, 0, "left"],
    [1, 0, "right"],
    [2, 0, "back"],
    [0, -1, "top"],
    [0, 1, "bottom"],
  ];

  return layout.map(([gx, gy, role], index) => ({
    id: `fallback-${index + 1}`,
    x: x + gx * unit,
    y: y + gy * unit,
    width: unit,
    height: unit,
    role,
  }));
}

export function detectPanelsFromCanvas(canvas) {
  const context = canvas.getContext("2d", { willReadFrequently: true });
  const { width, height } = canvas;
  const image = context.getImageData(0, 0, width, height);
  const bounds = getInkBounds(image.data, width, height);

  if (!bounds || bounds.width < MIN_PANEL_SIZE || bounds.height < MIN_PANEL_SIZE) {
    return { panels: [], bounds: null, imageSize: { width, height } };
  }

  const lines = findLineCenters(image.data, width, height, bounds);
  const panels = detectRectPanels(image.data, width, height, bounds, lines);

  return {
    panels: panels.length >= 2 ? panels : fallbackPanels(bounds),
    bounds,
    imageSize: { width, height },
  };
}
