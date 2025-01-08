import React, { useEffect, useRef } from 'react';
import * as fabric from 'fabric';

interface CanvasEditorProps {
  text: string;
  font: Font;
  fontSize: string;
  textColor: string;
  template: Template;
  aspectRatio: string;
}

const CanvasEditor: React.FC<CanvasEditorProps> = ({
  text,
  font,
  fontSize,
  textColor,
  template,
  aspectRatio
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const container = canvasRef.current.parentElement;
    if (!container) return;

    const width = container.clientWidth;
    const height = aspectRatio === 'aspect-square'
      ? width
      : (width * 16) / 9;

    // Initialize Fabric canvas
    fabricCanvasRef.current = new fabric.Canvas(canvasRef.current, {
      width,
      height
    });

    // Set background
    const canvas = fabricCanvasRef.current;
    if (template.id === "gradient") {
      const radians = (template.gradient?.angle * Math.PI) / 180;

      const width = canvas.getWidth();
      const height = canvas.getHeight();

      const gradient = new fabric.Gradient({
        type: 'linear',
        coords: {
          x1: 0,
          y1: 0,
          x2: width * Math.cos(radians),
          y2: height * Math.sin(radians),
        },
        colorStops: [
          { offset: 0, color: template.gradient?.color1 },
          { offset: 1, color: template.gradient?.color2 },
        ],
      });

      const rect = new fabric.Rect({
        width,
        height,
        fill: gradient,
        selectable: false,
      });

      canvas.add(rect);

    } else if (template.id === "photo") {
      canvas.setBackgroundImage(template.url,
        canvas.renderAll.bind(canvas));
    } else {
      canvas.backgroundColor = template.bg;
      canvas.renderAll();
    }

    // Create text object
    const textObject = new fabric.Textbox(text || 'Enter your text', {
      left: width / 2,
      top: height / 2,
      widht: width / 2,
      originX: 'center',
      originY: 'center',
      padding: 1,
      fontFamily: font.name,
      fontSize: parseInt(fontSize.replace('text-[', '').replace('px]', '')),
      fill: textColor,
      textAlign: 'center',
      width: width * 0.8,
      minWidth: width * 0.2,
      selectable: true,
      hasControls: true,
      hasBorders: true,
      lockRotation: false,
      lockScalingX: false,
      lockScalingY: false,
      centeredScaling: true
    });

    canvas.add(textObject);
    canvas.setActiveObject(textObject);
    canvas.renderAll();

    // Cleanup
    return () => {
      if (fabricCanvasRef.current) {
        fabricCanvasRef.current.dispose();
      }
    };
  }, []);

  // Update text properties when they change
  useEffect(() => {
    if (!fabricCanvasRef.current) return;

    const activeObject = fabricCanvasRef.current.getActiveObject();
    if (!activeObject || !(activeObject instanceof fabric.Textbox)) return;

    activeObject.set({
      text: text || 'Enter your text',
      fontFamily: font.name,
      fontSize: parseInt(fontSize.replace('text-[', '').replace('px]', '')),
      fill: textColor
    });

    fabricCanvasRef.current.renderAll();
  }, [text, font, fontSize, textColor]);

  // Update background when template changes
  useEffect(() => {
    if (!fabricCanvasRef.current) return;
    const canvas = fabricCanvasRef.current;

    if (template.id === "gradient") {
      const radians = (template.gradient?.angle * Math.PI) / 180;

      const width = canvas.getWidth();
      const height = canvas.getHeight();

      const gradient = new fabric.Gradient({
        type: 'linear',
        coords: {
          x1: 0,
          y1: 0,
          x2: width * Math.cos(radians),
          y2: height * Math.sin(radians),
        },
        colorStops: [
          { offset: 0, color: template.gradient?.color1 },
          { offset: 1, color: template.gradient?.color2 },
        ],
      });

      const rect = new fabric.Rect({
        width,
        height,
        fill: gradient,
        selectable: false,
      });

      canvas.add(rect);
    } else if (template.id === "photo") {
      canvas.setBackgroundImage(template.url,
        canvas.renderAll.bind(canvas));
    } else {
      canvas.backgroundColor = template.bg;
      canvas.renderAll();
    }

  }, [template.gradient, template.bg, template.gradient?.color2]);

  return (
    <div className={`relative ${aspectRatio} ${aspectRatio === 'aspect-[9/16]' ? 'w-3/5 mx-auto' : 'w-full'
      }`}>
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
};

export default CanvasEditor;