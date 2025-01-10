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
}

interface ChartSettings {
  marginTop?: number;
  marginRight?: number;
  marginBottom?: number;
  marginLeft?: number;
  minHeight?: number;
  minWidth?: number;
  baseHeight?: number;
  baseWidth?: number;
}

export function useChartDimensions(
  ref: RefObject<HTMLDivElement>,
  settings: ChartSettings = {}
): Dimensions {
  const {
    marginTop = 0,
    marginRight = 0,
    marginBottom = 0,
    marginLeft = 0,
    minHeight = 300,
    minWidth = 200,
    baseHeight = 500,
    baseWidth = 800,
  } = settings;

  const [dimensions, setDimensions] = useState<Dimensions>({
    width: baseWidth,
    height: baseHeight,
    boundedWidth: baseWidth - marginLeft - marginRight,
    boundedHeight: baseHeight - marginTop - marginBottom,
    marginTop,
    marginRight,
    marginBottom,
    marginLeft,
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

  return dimensions;
}
