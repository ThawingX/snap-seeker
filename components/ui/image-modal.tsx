"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ZoomIn, ZoomOut, Download } from "lucide-react";
import { useState } from "react";

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
  imageAlt: string;
  title?: string;
}

export const ImageModal: React.FC<ImageModalProps> = ({
  isOpen,
  onClose,
  imageSrc,
  imageAlt,
  title
}) => {
  const [scale, setScale] = useState(0.8);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // 防止模态框打开时页面滚动
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      // 重置缩放和位置
      setScale(0.8);
      setPosition({ x: 0, y: 0 });
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // 阻止点击内部元素时关闭模态框
  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  // 放大图片
  const handleZoomIn = () => {
    setScale(prev => Math.min(prev * 1.5, 5));
  };

  // 缩小图片
  const handleZoomOut = () => {
    setScale(prev => Math.max(prev / 1.5, 0.5));
  };

  // 重置缩放和位置
  const handleReset = () => {
    setScale(0.8);
    setPosition({ x: 0, y: 0 });
  };

  // 下载图片
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = imageSrc;
    link.download = `${title || 'image'}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 鼠标拖拽开始
  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  };

  // 鼠标拖拽移动
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && scale > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  // 鼠标拖拽结束
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // 键盘事件处理
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case '+':
        case '=':
          e.preventDefault();
          handleZoomIn();
          break;
        case '-':
          e.preventDefault();
          handleZoomOut();
          break;
        case '0':
          e.preventDefault();
          handleReset();
          break;
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-sm"
          onClick={onClose}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* 工具栏 */}
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 flex items-center gap-2 bg-black/50 backdrop-blur-sm rounded-lg px-4 py-2">
            {title && (
              <span className="text-white text-sm font-medium mr-4">{title}</span>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleZoomOut();
              }}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              title="Zoom Out (-)"
            >
              <ZoomOut className="h-4 w-4" />
            </button>
            <span className="text-white text-sm min-w-[60px] text-center">
              {Math.round(scale * 100)}%
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleZoomIn();
              }}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              title="Zoom In (+)"
            >
              <ZoomIn className="h-4 w-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleReset();
              }}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors text-sm"
              title="Reset (0)"
            >
              1:1
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDownload();
              }}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              title="Download"
            >
              <Download className="h-4 w-4" />
            </button>
          </div>

          {/* 关闭按钮 */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white z-10 transition-colors"
            title="Close (Esc)"
          >
            <X className="h-6 w-6" />
          </button>

          {/* 图片容器 */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="relative max-w-[90vw] max-h-[90vh] overflow-hidden"
            onClick={handleModalClick}
          >
            <motion.img
              src={imageSrc}
              alt={imageAlt}
              className={`max-w-full max-h-full w-auto h-auto object-contain select-none ${
                scale > 1 ? 'cursor-grab' : 'cursor-zoom-in'
              } ${isDragging ? 'cursor-grabbing' : ''}`}
              style={{
                transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
                transformOrigin: 'center center'
              }}
              onMouseDown={handleMouseDown}
              onDoubleClick={(e) => {
                e.stopPropagation();
                if (scale === 0.8) {
                  handleZoomIn();
                } else {
                  handleReset();
                }
              }}
              onError={(e) => {
                console.error('Image load error in modal:', e);
                console.log('Image src:', imageSrc);
              }}
              onLoad={() => {
                console.log('Image loaded successfully in modal');
              }}
              draggable={false}
            />
          </motion.div>

          {/* 使用说明 */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white/70 text-sm text-center">
            <p>Double-click to zoom • Drag to pan • Use +/- keys to zoom • Press 0 to reset</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};