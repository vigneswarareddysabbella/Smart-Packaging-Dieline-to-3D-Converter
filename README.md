# 📦 AI-Powered 2D Dieline to Interactive 3D Box Generator

![React](https://img.shields.io/badge/React-19-blue)
![Vite](https://img.shields.io/badge/Vite-7-purple)
![Three.js](https://img.shields.io/badge/Three.js-WebGL-green)
![OpenCV](https://img.shields.io/badge/OpenCV.js-Computer%20Vision-red)
![License](https://img.shields.io/badge/License-MIT-yellow)

---

## 📖 Overview

The **AI-Powered 2D Dieline to Interactive 3D Box Generator** is a web-based application that converts **2D packaging dielines** into **interactive 3D folding box models**.

Unlike conventional approaches that estimate a simple cube from an uploaded image, this project applies **Computer Vision**, **Computational Geometry**, and **3D Graphics** techniques to reconstruct packaging structures by identifying panels, fold lines, and their relationships.

---

# 🎯 Problem Statement

Most open-source dieline visualizers follow this workflow:

```
Upload Image
      │
      ▼
Bounding Rectangle
      │
      ▼
Create Cube
```

This approach has several limitations:

- Every uploaded dieline produces the same box.
- Fold lines are ignored.
- Glue tabs are ignored.
- Irregular packaging templates cannot be reconstructed.
- Panel relationships are lost.

---

# 💡 Proposed Solution

This project introduces a complete reconstruction pipeline.

```
Upload
   │
   ▼
Image Processing
   │
   ▼
Contour Detection
   │
   ▼
Panel Detection
   │
   ▼
Fold Line Detection
   │
   ▼
Panel Connectivity Graph
   │
   ▼
Mesh Generation
   │
   ▼
Interactive 3D Viewer
```

Each detected panel is converted into an independent mesh connected through hinge relationships.

---

# 🏗 System Architecture

```
                User

                  │

                  ▼

          Upload Engine

                  │

                  ▼

      PDF/Image Loader

                  │

                  ▼

      Canvas Renderer

                  │

                  ▼

        OpenCV Engine

                  │

                  ▼

      Contour Detection

                  │

                  ▼

      Panel Recognition

                  │

                  ▼

     Fold Line Detection

                  │

                  ▼

     Connectivity Graph

                  │

                  ▼

      Geometry Engine

                  │

                  ▼

      Three.js Renderer

                  │

                  ▼

      Folding Animation

                  │

                  ▼

           Export Engine
```

---

# ⚙️ Software Workflow

```
Upload File

↓

Load PDF / Image

↓

Canvas Rendering

↓

Grayscale Conversion

↓

Thresholding

↓

Morphological Processing

↓

Contour Detection

↓

Panel Detection

↓

Fold Line Detection

↓

Graph Construction

↓

Mesh Generation

↓

Texture Mapping

↓

Three.js Rendering

↓

Interactive Folding

↓

Export GLTF / OBJ
```

---

# 📂 Project Structure

```
dieline-3d-generator
│
├── public
│
├── src
│   │
│   ├── assets
│   │
│   ├── components
│   │     ├── Layout
│   │     ├── Upload
│   │     ├── Viewer
│   │     └── Common
│   │
│   ├── engine
│   │     ├── image
│   │     ├── parser
│   │     ├── geometry
│   │     ├── animation
│   │     └── export
│   │
│   ├── hooks
│   ├── services
│   ├── store
│   ├── styles
│   ├── utils
│   │
│   ├── App.jsx
│   └── main.jsx
│
├── package.json
└── README.md
```

---

# 🚀 Features

### Upload Engine

- Drag & Drop Upload
- Browse Files
- PNG Support
- JPG Support
- SVG Support
- PDF Support

---

### Computer Vision Engine

- Grayscale Conversion
- Binary Thresholding
- Noise Removal
- Contour Detection
- Edge Detection

---

### Parser Engine

- Panel Detection
- Fold Line Detection
- Glue Tab Detection
- Connectivity Graph

---

### Geometry Engine

- Individual Panel Mesh Generation
- UV Mapping
- Material Assignment

---

### 3D Viewer

- Three.js Rendering
- Orbit Controls
- Zoom
- Rotate
- Pan
- Lighting

---

### Animation

- Fold
- Unfold
- Smooth Rotation
- Interactive Controls

---

### Export

- GLTF Export
- OBJ Export

---

# 🧠 Engineering Design

The application is divided into six independent modules.

## Upload Engine

Responsible for importing packaging dielines.

```
Upload

↓

Validation

↓

Preview

↓

Storage
```

---

## Image Processing Engine

Prepares images for computer vision.

```
Original Image

↓

Grayscale

↓

Threshold

↓

Binary Image
```

---

## Parser Engine

Extracts packaging structure.

```
Binary Image

↓

Contours

↓

Panels

↓

Fold Lines
```

---

## Geometry Engine

Creates independent panel meshes.

```
Detected Panel

↓

Vertices

↓

PlaneGeometry
```

---

## Animation Engine

Creates hinge-based folding.

```
Panel

↓

Rotation Axis

↓

Fold Animation
```

---

## Export Engine

Exports generated models.

```
Scene

↓

GLTF / OBJ
```

---

# 🛠 Technology Stack

| Category | Technology |
|----------|------------|
| Frontend | React |
| Build Tool | Vite |
| 3D Graphics | Three.js |
| Rendering | React Three Fiber |
| State Management | Zustand |
| Computer Vision | OpenCV.js |
| PDF Rendering | PDF.js |
| Geometry | Earcut |
| Polygon Processing | Polygon Clipping |

---

# 📦 Installation

Clone the repository.

```bash
git clone https://github.com/yourusername/dieline-3d-generator.git
```

Move into the project directory.

```bash
cd dieline-3d-generator
```

Install dependencies.

```bash
npm install
```

Start the development server.

```bash
npm run dev
```

Open your browser.

```
http://localhost:5173
```

---

# 📥 Required Packages

```bash
npm install three
npm install @react-three/fiber
npm install @react-three/drei
npm install zustand
npm install react-dropzone
npm install pdfjs-dist
npm install @techstark/opencv-js
npm install earcut
npm install polygon-clipping
npm install leva
npm install react-spring
```

---

# 🏃 Build

```bash
npm run build
```

---

# 🔍 Preview Production Build

```bash
npm run preview
```

---

# 📈 Future Enhancements

- AI-based packaging classification
- Automatic dimension estimation
- Material thickness simulation
- Physics-based folding
- Packaging library
- AR Preview
- Cloud Storage
- Multi-user Collaboration

---

# 👨‍💻 Author

**Sabbella Vigneswara Reddy**

- GitHub: https://github.com/yourusername
- LinkedIn: https://www.linkedin.com/in/vigneswara-reddy-sabbella-bb7588262/

---

# 📄 License

This project is licensed under the MIT License.
