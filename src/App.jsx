import Header from "./components/Layout/Header";
import Sidebar from "./components/Layout/Sidebar";
import StatusBar from "./components/Layout/StatusBar";
import Viewer from "./components/Viewer/Viewer";

export default function App() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        color: "#0f172a",
      }}
    >
      <Header />
      <main style={{ flex: 1, display: "flex", minHeight: 0 }}>
        <Sidebar />
        <section style={{ flex: 1, minWidth: 0 }}>
          <Viewer />
        </section>
      </main>
      <StatusBar />
    </div>
  );
}
