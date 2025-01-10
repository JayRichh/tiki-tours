import { RefObject, useCallback, useEffect, useState } from "react";

interface Dimensions {
  width: number;
  height: number;
  boundedWidth: number;
  boundedHeight: number;
  marginTop: number;
  marginRight: number;
  marginBottom: number;
  marginLeft: number;
  scale: number;
}

interface ChartSettings {
  marginTop?: number;
  marginRight?: number;
  marginBottom?: number;
  marginLeft?: number;
  minHeight?: number;
  minWidth?: number;
  maxScale?: number;
  minScale?: number;
}

export function useChartDimensions(
  ref: RefObject<HTMLDivElement>,
  settings: ChartSettings = {}
): [Dimensions, (scale: number) => void] {
  const {
    marginTop = 0,
    marginRight = 0,
    marginBottom = 0,
    marginLeft = 0,
    minHeight = 300,
    minWidth = 200,
    maxScale = 1.5,
    minScale = 0.5,
  } = settings;

  const [dimensions, setDimensions] = useState<Dimensions>({
    width: 0,
    height: 0,
    boundedWidth: 0,
    boundedHeight: 0,
    marginTop,
    marginRight,
    marginBottom,
    marginLeft,
    scale: 1,
  });

  const updateDimensions = useCallback(() => {
    if (ref.current) {
      const element = ref.current;
      const boundingRect = element.getBoundingClientRect();

      const width = Math.max(minWidth, boundingRect.width);
      const height = Math.max(minHeight, boundingRect.height);

      const boundedWidth = width - marginLeft - marginRight;
      const boundedHeight = height - marginTop - marginBottom;

      setDimensions((prev) => ({
        ...prev,
        width,
        height,
        boundedWidth,
        boundedHeight,
      }));
    }
  }, [marginTop, marginRight, marginBottom, marginLeft, minHeight, minWidth, ref]);

  useEffect(() => {
    updateDimensions();

    const resizeObserver = new ResizeObserver(updateDimensions);
    if (ref.current) {
      resizeObserver.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        resizeObserver.unobserve(ref.current);
      }
    };
  }, [ref, updateDimensions]);

  const updateScale = useCallback(
    (newScale: number) => {
      const clampedScale = Math.min(Math.max(minScale, newScale), maxScale);
      setDimensions((prev) => ({
        ...prev,
        scale: clampedScale,
        boundedWidth: prev.width * clampedScale - marginLeft - marginRight,
        boundedHeight: prev.height * clampedScale - marginTop - marginBottom,
      }));
    },
    [maxScale, minScale, marginLeft, marginRight, marginTop, marginBottom]
  );

  return [dimensions, updateScale];
}
