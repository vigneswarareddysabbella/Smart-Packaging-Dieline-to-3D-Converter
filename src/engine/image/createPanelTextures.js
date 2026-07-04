const TEXTURE_PADDING = 4;

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export function createPanelTextures(panels, sourceCanvas) {
  return panels.map((panel) => {
    const x = clamp(Math.floor(panel.x - TEXTURE_PADDING), 0, sourceCanvas.width);
    const y = clamp(Math.floor(panel.y - TEXTURE_PADDING), 0, sourceCanvas.height);
    const right = clamp(
      Math.ceil(panel.x + panel.width + TEXTURE_PADDING),
      0,
      sourceCanvas.width
    );
    const bottom = clamp(
      Math.ceil(panel.y + panel.height + TEXTURE_PADDING),
      0,
      sourceCanvas.height
    );
    const width = Math.max(right - x, 1);
    const height = Math.max(bottom - y, 1);
    const textureCanvas = document.createElement("canvas");
    textureCanvas.width = width;
    textureCanvas.height = height;

    const context = textureCanvas.getContext("2d");
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, width, height);
    context.drawImage(sourceCanvas, x, y, width, height, 0, 0, width, height);

    return {
      ...panel,
      textureURL: textureCanvas.toDataURL("image/png"),
    };
  });
}
