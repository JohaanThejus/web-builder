import { useState, useRef, useEffect } from 'react';
import '../../sass/widget.scss';

type WidgetProps = {
    theme: boolean;
    title: string;
    name: string;
    type: string;
    position: { x: number; y: number };
    dimensions: { width: number; height: number };
    onResize: (newDimensions: { width: number; height: number }) => void;
    onDrag: (newPosition: { x: number; y: number }) => void;
    containerRef: React.RefObject<HTMLDivElement>; 
  };
  

function Widget(props: WidgetProps) {
  const [isResizing, setIsResizing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [resizeDirection, setResizeDirection] = useState('');
  const [currentDimensions, setCurrentDimensions] = useState(props.dimensions);
  const [currentPosition, setCurrentPosition] = useState(props.position);
  const [initialMousePosition, setInitialMousePosition] = useState({ x: 0, y: 0 });
  const [initialDimensions, setInitialDimensions] = useState(props.dimensions);
  const [initialPosition, setInitialPosition] = useState(props.position);
  const widgetRef = useRef<HTMLDivElement>(null);

  const handleMouseDownDrag = (e: React.MouseEvent) => {
    if (isResizing) return;
    e.preventDefault();
    setIsDragging(true);
    setInitialMousePosition({ x: e.clientX, y: e.clientY });
    setInitialPosition(currentPosition);
  };

  const handleMouseDownResize = (e: React.MouseEvent, direction: string) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    setResizeDirection(direction);
    setInitialMousePosition({ x: e.clientX, y: e.clientY });
    setInitialDimensions(currentDimensions);
    setInitialPosition(currentPosition);
  };

  const handleMouseMove = (e: MouseEvent) => {
    const container = props.containerRef.current;
    if (!container) return;
    const containerRect = container.getBoundingClientRect();
  
    if (isDragging) {
      const dx = e.clientX - initialMousePosition.x;
      const dy = e.clientY - initialMousePosition.y;
  
      let newX = initialPosition.x + dx;
      let newY = initialPosition.y + dy;
  
      // Clamp position within container
      newX = Math.max(0, Math.min(newX, containerRect.width - currentDimensions.width));
      newY = Math.max(0, Math.min(newY, containerRect.height - currentDimensions.height));
  
      setCurrentPosition({ x: newX, y: newY });
      props.onDrag({ x: newX, y: newY });
    }
  
    if (isResizing) {
      const dx = e.clientX - initialMousePosition.x;
      const dy = e.clientY - initialMousePosition.y;
  
      let newWidth = initialDimensions.width;
      let newHeight = initialDimensions.height;
      let newX = initialPosition.x;
      let newY = initialPosition.y;
  
      if (resizeDirection.includes('right')) {
        newWidth = Math.max(100, initialDimensions.width + dx);
        newWidth = Math.min(newWidth, containerRect.width - initialPosition.x);
      }
      if (resizeDirection.includes('bottom')) {
        newHeight = Math.max(100, initialDimensions.height + dy);
        newHeight = Math.min(newHeight, containerRect.height - initialPosition.y);
      }
      if (resizeDirection.includes('left')) {
        newWidth = Math.max(100, initialDimensions.width - dx);
        newX = Math.min(
          Math.max(0, initialPosition.x + dx),
          initialPosition.x + initialDimensions.width - 100
        );
      }
      if (resizeDirection.includes('top')) {
        newHeight = Math.max(100, initialDimensions.height - dy);
        newY = Math.min(
          Math.max(0, initialPosition.y + dy),
          initialPosition.y + initialDimensions.height - 100
        );
      }
  
      setCurrentDimensions({ width: newWidth, height: newHeight });
      setCurrentPosition({ x: newX, y: newY });
  
      props.onResize({ width: newWidth, height: newHeight });
      props.onDrag({ x: newX, y: newY });
    }
  };
  

  const handleMouseUp = () => {
    setIsResizing(false);
    setIsDragging(false);
    setResizeDirection('');
  };

  useEffect(() => {
    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, initialDimensions, initialPosition]);

  return (
    <div
      ref={widgetRef}
      className={`widget ${props.theme ? 'dark' : ''}`}
      style={{
        position: 'absolute',
        left: currentPosition.x,
        top: currentPosition.y,
        width: currentDimensions.width,
        height: currentDimensions.height,
        cursor: isResizing ? 'se-resize' : isDragging ? 'grabbing' : 'grab',
        userSelect: 'none',
      }}
      onMouseDown={handleMouseDownDrag}
    >
      <h3>{props.title}</h3>

      {/* Resize Handles */}
      <div className="resize-handle top-left" onMouseDown={(e) => handleMouseDownResize(e, 'top-left')} />
      <div className="resize-handle top-right" onMouseDown={(e) => handleMouseDownResize(e, 'top-right')} />
      <div className="resize-handle bottom-left" onMouseDown={(e) => handleMouseDownResize(e, 'bottom-left')} />
      <div className="resize-handle bottom-right" onMouseDown={(e) => handleMouseDownResize(e, 'bottom-right')} />
      <div className="resize-handle top" onMouseDown={(e) => handleMouseDownResize(e, 'top')} />
      <div className="resize-handle right" onMouseDown={(e) => handleMouseDownResize(e, 'right')} />
      <div className="resize-handle bottom" onMouseDown={(e) => handleMouseDownResize(e, 'bottom')} />
      <div className="resize-handle left" onMouseDown={(e) => handleMouseDownResize(e, 'left')} />
    </div>
  );
}

export default Widget;
