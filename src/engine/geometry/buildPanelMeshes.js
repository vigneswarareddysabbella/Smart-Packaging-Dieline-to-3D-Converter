function lerp(start, end, amount) {
  return start + (end - start) * amount;
}

export function mixTransform(panel, progress) {
  return {
    position: panel.flatPosition.map((value, index) =>
      lerp(value, panel.closedPosition[index], progress)
    ),
    rotation: panel.flatRotation.map((value, index) =>
      lerp(value, panel.closedRotation[index], progress)
    ),
  };
}

function overlapAmount(aStart, aEnd, bStart, bEnd) {
  return Math.max(0, Math.min(aEnd, bEnd) - Math.max(aStart, bStart));
}

function getPanelCenter(panel) {
  return {
    x: panel.x + panel.width / 2,
    y: panel.y + panel.height / 2,
  };
}

function findNeighborDepth(panels, root) {
  const rootRight = root.x + root.width;
  const rootBottom = root.y + root.height;
  const candidates = panels
    .filter((panel) => panel.id !== root.id)
    .map((panel) => {
      const center = getPanelCenter(panel);
      const rootCenter = getPanelCenter(root);
      const horizontalOverlap = overlapAmount(panel.y, panel.y + panel.height, root.y, rootBottom);
      const verticalOverlap = overlapAmount(panel.x, panel.x + panel.width, root.x, rootRight);
      const sideDistance = Math.min(
        Math.abs(panel.x + panel.width - root.x),
        Math.abs(panel.x - rootRight)
      );
      const topDistance = Math.min(
        Math.abs(panel.y + panel.height - root.y),
        Math.abs(panel.y - rootBottom)
      );

      return {
        panel,
        horizontalScore: horizontalOverlap - sideDistance - Math.abs(center.y - rootCenter.y) * 0.1,
        verticalScore: verticalOverlap - topDistance - Math.abs(center.x - rootCenter.x) * 0.1,
      };
    });

  const side = [...candidates].sort((a, b) => b.horizontalScore - a.horizontalScore)[0];
  const top = [...candidates].sort((a, b) => b.verticalScore - a.verticalScore)[0];
  const sideDepth = side?.horizontalScore > 0 ? side.panel.width : 0;
  const topDepth = top?.verticalScore > 0 ? top.panel.height : 0;

  return Math.max(sideDepth, topDepth, root.width * 0.42);
}

function getClosedFaces(width, height, depth) {
  return [
    {
      role: "front",
      size: [width, height],
      closedPosition: [0, 0, depth / 2],
      closedRotation: [0, 0, 0],
    },
    {
      role: "back",
      size: [width, height],
      closedPosition: [0, 0, -depth / 2],
      closedRotation: [0, Math.PI, 0],
    },
    {
      role: "left",
      size: [depth, height],
      closedPosition: [-width / 2, 0, 0],
      closedRotation: [0, -Math.PI / 2, 0],
    },
    {
      role: "right",
      size: [depth, height],
      closedPosition: [width / 2, 0, 0],
      closedRotation: [0, Math.PI / 2, 0],
    },
    {
      role: "top",
      size: [width, depth],
      closedPosition: [0, height / 2, 0],
      closedRotation: [-Math.PI / 2, 0, 0],
    },
    {
      role: "bottom",
      size: [width, depth],
      closedPosition: [0, -height / 2, 0],
      closedRotation: [Math.PI / 2, 0, 0],
    },
  ];
}

function scoreSidePanel(panel, root, direction) {
  const center = getPanelCenter(panel);
  const rootCenter = getPanelCenter(root);
  const xDistance = Math.abs(center.x - rootCenter.x);
  const yDistance = Math.abs(center.y - rootCenter.y);
  const horizontalOverlap = overlapAmount(panel.y, panel.y + panel.height, root.y, root.y + root.height);
  const verticalOverlap = overlapAmount(panel.x, panel.x + panel.width, root.x, root.x + root.width);

  if (direction === "left" && center.x < rootCenter.x) {
    return horizontalOverlap * 4 - xDistance - yDistance * 0.35;
  }
  if (direction === "right" && center.x > rootCenter.x) {
    return horizontalOverlap * 4 - xDistance - yDistance * 0.35;
  }
  if (direction === "top" && center.y < rootCenter.y) {
    return verticalOverlap * 4 - yDistance - xDistance * 0.35;
  }
  if (direction === "bottom" && center.y > rootCenter.y) {
    return verticalOverlap * 4 - yDistance - xDistance * 0.35;
  }

  return -Infinity;
}

function pickBestPanel(panels, usedIds, root, direction) {
  const candidates = panels
    .filter((panel) => !usedIds.has(panel.id))
    .map((panel) => ({
      panel,
      score: scoreSidePanel(panel, root, direction),
    }))
    .sort((a, b) => b.score - a.score);

  const best = candidates[0];
  if (!best || best.score === -Infinity) return null;
  usedIds.add(best.panel.id);
  return best.panel;
}

function assignPanelsToClosedFaces(panels, root) {
  const usedIds = new Set([root.id]);
  const assigned = {
    front: root,
    left: pickBestPanel(panels, usedIds, root, "left"),
    right: pickBestPanel(panels, usedIds, root, "right"),
    top: pickBestPanel(panels, usedIds, root, "top"),
    bottom: pickBestPanel(panels, usedIds, root, "bottom"),
    back: null,
  };

  const remaining = panels
    .filter((panel) => !usedIds.has(panel.id))
    .sort((a, b) => b.width * b.height - a.width * a.height);
  assigned.back = remaining[0] || assigned.right || assigned.left || root;

  return assigned;
}

export function buildPanelMeshes(panels, imageSize) {
  if (!panels.length || !imageSize) return [];

  const scale = 4 / Math.max(imageSize.width, imageSize.height);
  const centerX = imageSize.width / 2;
  const centerY = imageSize.height / 2;
  const sorted = [...panels].sort((a, b) => b.width * b.height - a.width * a.height);
  const root = sorted[0];
  const width = Math.max(root.width * scale, 0.4);
  const height = Math.max(root.height * scale, 0.4);
  const depth = Math.max(findNeighborDepth(panels, root) * scale, Math.min(width, height) * 0.45);
  const faces = getClosedFaces(width, height, depth);
  const assignedPanels = assignPanelsToClosedFaces(panels, root);

  return faces.map((face, index) => {
    const panel = assignedPanels[face.role] || panels[index] || root;
    const cx = panel.x + panel.width / 2;
    const cy = panel.y + panel.height / 2;

    return {
      ...panel,
      id: `${face.role}-${panel.id || index + 1}`,
      role: face.role,
      size: face.size,
      flatPosition: [(cx - centerX) * scale, -(cy - centerY) * scale, 0],
      flatRotation: [0, 0, 0],
      closedPosition: face.closedPosition,
      closedRotation: face.closedRotation,
    };
  });
}
