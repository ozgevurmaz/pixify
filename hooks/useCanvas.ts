import { useEffect, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as fabric from 'fabric';
import { RootState } from '@/store/store';
import { resetCanvas, setCanvas } from '@/store/slices/canvasSlice';

export const useCanvas = (canvasRef: React.RefObject<HTMLCanvasElement>) => {
  const dispatch = useDispatch();
  const canvas = useSelector((state: RootState) => state.canvas.canvas);
  const isInitialized = useRef(false); // Yerel bir kontrol

  const initializeCanvas = useCallback(() => {
    if (!canvasRef.current || isInitialized.current) return;

    const fabricCanvas = new fabric.Canvas(canvasRef.current, {
      preserveObjectStacking: true,
    });

    dispatch(setCanvas(fabricCanvas));
    isInitialized.current = true;

    return () => {
      fabricCanvas.dispose();
      dispatch(resetCanvas());
      isInitialized.current = false;
    };
  }, [canvasRef, dispatch]);

  // Canvas'ı başlatmak için
  useEffect(() => {
    const cleanup = initializeCanvas();
    return () => cleanup?.();
  }, [initializeCanvas]);

  const downloadCanvas = useCallback(() => {
    if (!canvas) return null;

    return canvas.toDataURL({
      format: 'png',
      quality: 1,
      multiplier: 2,
    });
  }, [canvas]);

  const addText = useCallback((text: string, options = {}) => {
    if (!canvas) return;

    const textObject = new fabric.Textbox(text, {
      left: canvas.getWidth() / 2,
      top: canvas.getHeight() / 2,
      originX: 'center',
      originY: 'center',
      ...options,
    });

    canvas.add(textObject);
    canvas.setActiveObject(textObject);
    canvas.renderAll();
  }, [canvas]);

  const updateBackground = useCallback((color: string) => {
    if (!canvas) return;

    canvas.backgroundColor = color;
    canvas.renderAll();
  }, [canvas]);

  return {
    canvas,
    downloadCanvas,
    addText,
    updateBackground,
    isInitialized: isInitialized.current,
  };
};
