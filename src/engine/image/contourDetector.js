import cv from "./opencv.js";

export function detectContours(binary) {
  const contours = new cv.MatVector();
  const hierarchy = new cv.Mat();

  cv.findContours(
    binary,
    contours,
    hierarchy,
    cv.RETR_EXTERNAL,
    cv.CHAIN_APPROX_SIMPLE
  );

  hierarchy.delete();
  return contours;
}
