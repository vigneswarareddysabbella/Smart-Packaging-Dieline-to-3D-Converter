import { useDropzone } from "react-dropzone";
import useStore from "../../store/useStore.js";
import { loadDielineCanvas } from "../../services/loadDielineCanvas.js";
import { createPanelTextures } from "../../engine/image/createPanelTextures.js";
import { buildPanelGraph } from "../../engine/parser/buildPanelGraph.js";
import { detectPanelsFromCanvas } from "../../engine/parser/detectPanelsFromCanvas.js";

export default function DropZone() {
  const setDielineResult = useStore((state) => state.setDielineResult);
  const setStatus = useStore((state) => state.setStatus);
  const setError = useStore((state) => state.setError);

  const onDrop = async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    try {
      setStatus("Loading dieline...");
      const { canvas, previewURL } = await loadDielineCanvas(file);
      setStatus("Detecting panels...");
      const result = detectPanelsFromCanvas(canvas);
      const texturedPanels = createPanelTextures(result.panels, canvas);
      const graph = buildPanelGraph(texturedPanels);

      setDielineResult({
        file,
        previewURL,
        canvasURL: canvas.toDataURL("image/png"),
        canvas,
        panels: texturedPanels,
        graph,
        imageSize: result.imageSize,
      });
    } catch (error) {
      setError(error.message || "Could not process this file.");
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      "image/png": [".png"],
      "image/jpeg": [".jpg", ".jpeg"],
      "image/svg+xml": [".svg"],
      "application/pdf": [".pdf"],
    },
  });

  return (
    <div
      {...getRootProps()}
      style={{
        border: `2px dashed ${isDragActive ? "#2563eb" : "#94a3b8"}`,
        borderRadius: 8,
        padding: 24,
        cursor: "pointer",
        textAlign: "center",
        background: isDragActive ? "#eff6ff" : "#ffffff",
      }}
    >
      <input {...getInputProps()} />
      <strong>{isDragActive ? "Drop the dieline" : "Upload dieline"}</strong>
      <p style={{ margin: "8px 0 0", color: "#64748b", fontSize: 13 }}>
        PDF, PNG, JPG, JPEG, or SVG
      </p>
    </div>
  );
}
