import UploadPanel from "../Upload/UploadPanel";

export default function Sidebar() {
  return (
    <aside
      style={{
        width: 340,
        padding: 20,
        background: "#f8fafc",
        overflow: "auto",
        borderRight: "1px solid #e2e8f0",
      }}
    >
      <UploadPanel />
    </aside>
  );
}
