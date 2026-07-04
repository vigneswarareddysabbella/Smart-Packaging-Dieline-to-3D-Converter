import { create } from "zustand";

const revokeUrl = (url) => {
  if (url) URL.revokeObjectURL(url);
};

const useStore = create((set, get) => ({
  uploadedFile: null,
  previewURL: null,
  canvasURL: null,
  canvas: null,
  binaryImage: null,
  contours: [],
  panels: [],
  graph: { nodes: [], edges: [] },
  meshes: [],
  imageSize: null,
  foldProgress: 1,
  status: "Upload a dieline to begin.",
  error: null,

  setDielineResult: ({
    file,
    previewURL,
    canvasURL,
    canvas,
    binaryImage = null,
    contours = [],
    panels,
    graph = { nodes: [], edges: [] },
    meshes = [],
    imageSize,
  }) => {
    revokeUrl(get().previewURL);
    set({
      uploadedFile: file,
      previewURL,
      canvasURL,
      canvas,
      binaryImage,
      contours,
      panels,
      graph,
      meshes,
      imageSize,
      status: panels.length
        ? `Detected ${panels.length} panel${panels.length === 1 ? "" : "s"}.`
        : "No panels detected. Showing a generated carton layout.",
      error: null,
    });
  },

  setFoldProgress: (foldProgress) => set({ foldProgress }),
  setStatus: (status) => set({ status }),
  setError: (error) => set({ error, status: "Fix needed before preview can update." }),
}));

export default useStore;
