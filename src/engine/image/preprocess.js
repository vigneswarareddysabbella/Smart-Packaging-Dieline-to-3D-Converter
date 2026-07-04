import cv from "./opencv.js";

export function toGray(src) {
  const gray = new cv.Mat();
  cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);
  return gray;
}

export function threshold(gray, thresholdValue = 180) {
  const binary = new cv.Mat();
  cv.threshold(gray, binary, thresholdValue, 255, cv.THRESH_BINARY_INV);
  return binary;
}

export function closeGaps(binary) {
  const kernel = cv.Mat.ones(3, 3, cv.CV_8U);
  const cleaned = new cv.Mat();
  cv.morphologyEx(binary, cleaned, cv.MORPH_CLOSE, kernel);
  kernel.delete();
  return cleaned;
}
