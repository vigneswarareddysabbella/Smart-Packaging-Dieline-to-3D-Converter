import useStore from "../../store/useStore.js";

export default function StatusBar() {
  const status = useStore((state) => state.status);
  const error = useStore((state) => state.error);

  return (
    <footer
      style={{
        minHeight: 34,
        background: error ? "#7f1d1d" : "#111827",
        color: "white",
        display: "flex",
        alignItems: "center",
        padding: "0 15px",
        fontSize: 13,
      }}
    >
      {error || status}
    </footer>
  );
}
