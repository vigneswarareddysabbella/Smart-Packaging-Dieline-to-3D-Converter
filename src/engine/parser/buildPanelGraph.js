const EDGE_TOLERANCE = 8;

function rangesOverlap(aStart, aEnd, bStart, bEnd) {
  return Math.max(0, Math.min(aEnd, bEnd) - Math.max(aStart, bStart));
}

function getSharedEdge(a, b) {
  const aRight = a.x + a.width;
  const bRight = b.x + b.width;
  const aBottom = a.y + a.height;
  const bBottom = b.y + b.height;

  const verticalOverlap = rangesOverlap(a.y, aBottom, b.y, bBottom);
  const horizontalOverlap = rangesOverlap(a.x, aRight, b.x, bRight);

  if (Math.abs(aRight - b.x) <= EDGE_TOLERANCE && verticalOverlap > EDGE_TOLERANCE) {
    return { from: "right", to: "left", length: verticalOverlap };
  }
  if (Math.abs(bRight - a.x) <= EDGE_TOLERANCE && verticalOverlap > EDGE_TOLERANCE) {
    return { from: "left", to: "right", length: verticalOverlap };
  }
  if (Math.abs(aBottom - b.y) <= EDGE_TOLERANCE && horizontalOverlap > EDGE_TOLERANCE) {
    return { from: "bottom", to: "top", length: horizontalOverlap };
  }
  if (Math.abs(bBottom - a.y) <= EDGE_TOLERANCE && horizontalOverlap > EDGE_TOLERANCE) {
    return { from: "top", to: "bottom", length: horizontalOverlap };
  }

  return null;
}

export function buildPanelGraph(panels) {
  const nodes = panels.map((panel) => ({
    id: panel.id,
    panel,
    neighbors: [],
  }));
  const nodeById = new Map(nodes.map((node) => [node.id, node]));
  const edges = [];

  for (let i = 0; i < panels.length; i += 1) {
    for (let j = i + 1; j < panels.length; j += 1) {
      const sharedEdge = getSharedEdge(panels[i], panels[j]);
      if (!sharedEdge) continue;

      edges.push({
        from: panels[i].id,
        to: panels[j].id,
        hinge: sharedEdge,
      });
      nodeById.get(panels[i].id).neighbors.push(panels[j].id);
      nodeById.get(panels[j].id).neighbors.push(panels[i].id);
    }
  }

  return { nodes, edges };
}
