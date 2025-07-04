"use client"

import React, { useEffect, useRef, useState, useImperativeHandle, forwardRef } from 'react';
import * as fabric from 'fabric';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { setDimensions, setTextColor } from '@/store/slices/postSlice';

declare module "fabric" {
  interface Canvas {
    createTextObject?: () => void;
  }
}

interface CanvasEditorHandle {
  getCanvas: () => fabric.Canvas | null;
}

const CanvasEditor = forwardRef<CanvasEditorHandle>((_, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
  const backgroundRectRef = useRef<fabric.Rect | null>(null);

  const dispatch = useDispatch();

  const activeTab = useSelector((state: RootState) => state.post.activeTab);
  const text = useSelector((state: RootState) => state.post.text);
  const template = useSelector((state: RootState) => state.post.template);
  const font = useSelector((state: RootState) => state.post.font);
  const bgColor = useSelector((state: RootState) => state.post.bgColor);
  const textColor = useSelector((state: RootState) => state.post.textColor);
  const fontSize = useSelector((state: RootState) => state.post.fontSize);
  const bgColor2 = useSelector((state: RootState) => state.post.bgColor2);
  const angle = useSelector((state: RootState) => state.post.angle);
  const percentage = useSelector((state: RootState) => state.post.percentage);
  const percentage2 = useSelector((state: RootState) => state.post.percentage2);
  const url = useSelector((state: RootState) => state.post.url);
  const dimension = useSelector((state: RootState) => state.post.dimensions);


  const getContrastingTextColor = (hexColor: string): string => {
    // HEX to RGB
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);

    // Calculate Brightness
    const brightness = r * 0.299 + g * 0.587 + b * 0.114;

    return brightness > 128 ? "#000000" : "#FFFFFF";
  };

  // Function to update background
  const updateBackground = (canvas: fabric.Canvas) => {
    if (backgroundRectRef.current) {
      canvas.remove(backgroundRectRef.current);
      backgroundRectRef.current = null;
    }


    // Clear background color and image
    canvas.set('backgroundColor', '');
    canvas.set('backgroundImage', null);
    canvas.renderAll();

    const width = canvas.getWidth();
    const height = canvas.getHeight();
    const newAspectRatio = activeTab === 'post' ? "square" : "portrait";

    dispatch(setDimensions({
      width: width,
      height: height,
      aspectRatio: newAspectRatio,
      maxChars: 100
    }))

    if (template.name === "gradients") {
      const radians = (angle * Math.PI) / 180;

      const gradient = new fabric.Gradient({
        type: 'linear',
        coords: {
          x1: 0,
          y1: 0,
          x2: width * Math.cos(radians),
          y2: height * Math.sin(radians),
        },
        colorStops: [
          { offset: Number(percentage) / 100, color: bgColor },
          { offset: Number(percentage2) / 100, color: bgColor2 }
        ],
      });

      backgroundRectRef.current = new fabric.Rect({
        width,
        height,
        fill: gradient,
        selectable: false,
        evented: false,
      });

      canvas.add(backgroundRectRef.current);
      canvas.sendObjectToBack(backgroundRectRef.current);

    }
    else if (template.name === "photo") {

      if (!fabricCanvasRef.current) {
        console.error("Canvas not initialized");
        return;
      }

      const canvas = fabricCanvasRef.current;
      const canvasWidth = canvas.getWidth();
      const canvasHeight = canvas.getHeight();


      fabric.FabricImage.fromURL(url).then((img) => {
        if (!img) {
          console.error("Image object is null");
          return;
        }

        const scaleX = canvasWidth / img.width!;
        const scaleY = canvasHeight / img.height!;
        const scale = Math.max(scaleX, scaleY);

        try {
          img.set({
            scaleX: scale,
            scaleY: scale,
            left: (canvasWidth - img.width! * scale) / 2,
            top: (canvasHeight - img.height! * scale) / 2,
            selectable: false,
            evented: false,
          });

          canvas.set('backgroundImage', img);
          canvas.renderAll();
        } catch (error) {
          console.error("Error setting image properties:", error);
        }


      }).catch((error) => {
        console.error("Error loading image:", error);
      });

    } else {
      canvas.backgroundColor = bgColor;
    }

    canvas.renderAll();
  };

  // Initial canvas setup
  useEffect(() => {
    if (!canvasRef.current) return;

    const container = canvasRef.current.parentElement;
    if (!container) return;

    const width = container.clientWidth;
    const height = activeTab === 'post'
      ? width
      : (width * 16) / 9;

    fabricCanvasRef.current = new fabric.Canvas(canvasRef.current, {
      width,
      height,
      preserveObjectStacking: true
    });

    const canvas = fabricCanvasRef.current;

    // Set initial background
    updateBackground(canvas);

    // Create text object
    const createTextObject = () => {
      const textObject = new fabric.Textbox(text, {
        left: width / 2,
        top: height / 2,
        originX: 'center',
        originY: 'center',
        padding: 1,
        fontFamily: font.name,
        fontSize: fontSize,
        fill: textColor,
        textAlign: 'center',
        width: width * 0.8,
        minWidth: width * 0.4,
        selectable: true,
        hasControls: true,
        hasBorders: true,
        lockRotation: false,
        lockScalingX: false,
        lockScalingY: false,
        centeredScaling: true
      });

      return textObject;
    };

    const initialText = createTextObject();
    canvas.add(initialText);
    canvas.setActiveObject(initialText);
    canvas.renderAll();

    // Store the createTextObject function in the ref for later use
    fabricCanvasRef.current.createTextObject = createTextObject;

    return () => {
      if (fabricCanvasRef.current) {
        fabricCanvasRef.current.dispose();
      }
    };
  }, []);

  // Update text properties
  useEffect(() => {
    if (!fabricCanvasRef.current) return;

    const canvas = fabricCanvasRef.current;

    const objects = canvas.getObjects();

    const textObject = objects.find(obj => obj instanceof fabric.Textbox);

    if (textObject && textObject instanceof fabric.Textbox) {
      // Preserve the current position and dimensions
      const { left, top, width, scaleX, scaleY } = textObject;

      textObject.set({
        text: text,
        fontFamily: font.name,
        fontSize: fontSize,
        fill: textColor,
        left,
        top,
        width,
        scaleX,
        scaleY
      });

      textObject.setCoords();
      canvas.requestRenderAll();
    }

  }, [text, font, fontSize, textColor]);

  // Update background when template or colors change
  useEffect(() => {
    if (!fabricCanvasRef.current) return;
    updateBackground(fabricCanvasRef.current);

  }, [template, bgColor, bgColor2, angle, url, percentage, percentage2, activeTab]);

  useEffect(() => {
    dispatch(setTextColor(getContrastingTextColor(bgColor)));
  }, [bgColor, url])

  useImperativeHandle(ref, () => ({
    getCanvas: () => fabricCanvasRef.current,
  }));

  return (
    <div className={`relative ${activeTab === 'post' ? 'w-full' : 'w-3/5 mx-auto'
      }`}>
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
});

export default CanvasEditor;