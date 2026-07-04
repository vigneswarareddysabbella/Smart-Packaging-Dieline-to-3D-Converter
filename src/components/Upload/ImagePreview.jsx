import useStore from "../../store/useStore.js";

export default function ImagePreview() {
  const canvasURL = useStore((state) => state.canvasURL);
  const uploadedFile = useStore((state) => state.uploadedFile);
  const panels = useStore((state) => state.panels);
  const imageSize = useStore((state) => state.imageSize);

  if (!uploadedFile) return null;

  return (
    <div style={{ marginTop: 18 }}>
      {canvasURL && (
        <img
          src={canvasURL}
          alt="Uploaded dieline preview"
          style={{
            width: "100%",
            maxHeight: 220,
            objectFit: "contain",
            border: "1px solid #cbd5e1",
            borderRadius: 8,
            background: "white",
          }}
        />
      )}

      <div style={{ marginTop: 12, fontSize: 13, color: "#334155" }}>
        <div style={{ fontWeight: 700, wordBreak: "break-word" }}>{uploadedFile.name}</div>
        <div>{(uploadedFile.size / 1024).toFixed(1)} KB</div>
        {imageSize && <div>{imageSize.width} x {imageSize.height}px</div>}
        <div>{panels.length} detected panels</div>
      </div>
    </div>
  );
}
