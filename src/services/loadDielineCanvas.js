import * as pdfjsLib from "pdfjs-dist";

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.mjs",
  import.meta.url
).toString();

const MAX_SIDE = 1800;

function scaleCanvas(canvas) {
  const longest = Math.max(canvas.width, canvas.height);
  if (longest <= MAX_SIDE) return canvas;

  const scale = MAX_SIDE / longest;
  const scaled = document.createElement("canvas");
  scaled.width = Math.round(canvas.width * scale);
  scaled.height = Math.round(canvas.height * scale);
  scaled.getContext("2d").drawImage(canvas, 0, 0, scaled.width, scaled.height);
  return scaled;
}

function drawImageFile(file) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    const url = URL.createObjectURL(file);

    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = image.naturalWidth || image.width;
      canvas.height = image.naturalHeight || image.height;
      const context = canvas.getContext("2d", { willReadFrequently: true });
      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.drawImage(image, 0, 0);
      resolve({ canvas: scaleCanvas(canvas), previewURL: url });
    };

    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("The selected image could not be loaded."));
    };

    image.src = url;
  });
}

async function drawPdfFile(file) {
  const data = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data }).promise;
  const page = await pdf.getPage(1);
  const viewport = page.getViewport({ scale: 2 });
  const canvas = document.createElement("canvas");
  canvas.width = viewport.width;
  canvas.height = viewport.height;

  await page.render({
    canvasContext: canvas.getContext("2d", { willReadFrequently: true }),
    viewport,
  }).promise;

  const scaled = scaleCanvas(canvas);
  return { canvas: scaled, previewURL: scaled.toDataURL("image/png") };
}

export async function loadDielineCanvas(file) {
  if (!file) throw new Error("Choose a dieline file first.");

  const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
  return isPdf ? drawPdfFile(file) : drawImageFile(file);
}
