import React, { useState, useEffect } from "react";

type DominantColor = [number, number, number]; // Change this to "string" for HEX color or "{ r: number, g: number, b: number }" for RGB color

const useImageColor = (imageUrl: string): DominantColor | undefined => {
  const [dominantColor, setDominantColor] = useState<DominantColor>();

  useEffect(() => {
    const getColorFromImage = async () => {
      const image = new Image();

      // Wait for the image to load
      image.onload = () => {
        const color = extractDominantColor(image);
        setDominantColor(color);
      };

      // Handle image loading errors
      image.onerror = () => {
        console.error("Error loading the image.");
        setDominantColor(undefined);
      };

      // Set the image source
      image.crossOrigin = "anonymous"; // Enable CORS if the image URL requires it
      image.src = imageUrl;
    };

    getColorFromImage();
  }, [imageUrl]);

  return dominantColor;
};

const extractDominantColor = (
  image: HTMLImageElement,
): DominantColor | undefined => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    console.error("Canvas context not supported.");
    return undefined;
  }

  canvas.width = image.width;
  canvas.height = image.height;
  ctx.drawImage(image, 0, 0, image.width, image.height);

  const imageData = ctx.getImageData(0, 0, image.width, image.height).data;

  let rSum = 0;
  let gSum = 0;
  let bSum = 0;
  let pixelCount = 0;

  for (let i = 0; i < imageData.length; i += 4) {
    const r = imageData[i];
    const g = imageData[i + 1];
    const b = imageData[i + 2];

    rSum += r;
    gSum += g;
    bSum += b;

    pixelCount++;
  }

  const averageR = Math.floor(rSum / pixelCount);
  const averageG = Math.floor(gSum / pixelCount);
  const averageB = Math.floor(bSum / pixelCount);

  return [averageR, averageG, averageB];
};

export default useImageColor;
