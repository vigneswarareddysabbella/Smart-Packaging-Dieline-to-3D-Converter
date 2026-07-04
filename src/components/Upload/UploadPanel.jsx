import useStore from "../../store/useStore.js";
import DropZone from "./DropZone";
import ImagePreview from "./ImagePreview";

export default function UploadPanel() {
  const foldProgress = useStore((state) => state.foldProgress);
  const setFoldProgress = useStore((state) => state.setFoldProgress);
  const panels = useStore((state) => state.panels);

  return (
    <section>
      <h2 style={{ margin: "0 0 14px", fontSize: 20 }}>Upload Dieline</h2>
      <DropZone />
      <ImagePreview />

      <div style={{ marginTop: 22 }}>
        <label style={{ display: "block", fontWeight: 700, marginBottom: 8 }}>
          Box closure
        </label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={foldProgress}
          onChange={(event) => setFoldProgress(Number(event.target.value))}
          style={{ width: "100%" }}
        />
        <div style={{ fontSize: 12, color: "#64748b" }}>
          {Math.round(foldProgress * 100)}% closed
        </div>
      </div>

      {panels.length > 0 && (
        <div style={{ marginTop: 22 }}>
          <h3 style={{ margin: "0 0 10px", fontSize: 15 }}>Detected panels</h3>
          <div style={{ display: "grid", gap: 8 }}>
            {panels.map((panel, index) => (
              <div
                key={panel.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  border: "1px solid #e2e8f0",
                  borderRadius: 6,
                  padding: "8px 10px",
                  background: "#fff",
                  fontSize: 12,
                }}
              >
                <span>Panel {index + 1}</span>
                <span>{Math.round(panel.width)} x {Math.round(panel.height)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
