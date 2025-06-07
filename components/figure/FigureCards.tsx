"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { IconPhoto, IconTarget, IconChartBar, IconBulb } from "@tabler/icons-react";
import { ImageModal } from "../ui/image-modal";

/**
 * 图片数据接口
 */
export interface FigureData {
  step: string;
  figureIndex: number;
  content: string; // base64 图片数据
}

/**
 * 获取图表标题
 */
const getFigureTitle = (figureIndex: number): string => {
  const titleMap: { [key: number]: string } = {
    1: "Solutions-Pain Matrix",
    2: "Revenue-Users Matrix",
    3: "Feature-ROI Analysis"
  };
  return titleMap[figureIndex] || `Figure ${figureIndex}`;
};

/**
 * 获取图表对应的图标
 */
const getFigureIcon = (figureIndex: number) => {
  const iconMap: { [key: number]: JSX.Element } = {
    1: <IconTarget className="w-5 h-5 text-white" />, // Solutions-Pain Matrix - 目标定位
    2: <IconChartBar className="w-5 h-5 text-white" />, // Revenue-Users Matrix - 数据图表
    3: <IconBulb className="w-5 h-5 text-white" /> // Feature-ROI Analysis - 分析洞察
  };
  return iconMap[figureIndex] || <IconPhoto className="w-5 h-5 text-white" />;
};

/**
 * 单个图片卡片组件
 */
const FigureCard = ({
  figure,
  onImageClick
}: {
  figure: FigureData;
  onImageClick: (imageSrc: string, title: string) => void;
}) => {
  const figureTitle = getFigureTitle(figure.figureIndex);

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-xl p-5 shadow-md mb-6">

      <div className="mb-4">
        <div className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-700 rounded-lg px-4 py-3 shadow-sm">
          {getFigureIcon(figure.figureIndex)}
          <h3 className="text-xl font-bold text-white">
            {figureTitle}
          </h3>
        </div>
      </div>

      <div className="w-full bg-neutral-100 dark:bg-neutral-800 rounded-lg overflow-hidden group cursor-pointer transition-all duration-300 hover:shadow-lg">
        <div className="relative w-full">
          <img
            src={`data:image/png;base64,${figure.content}`}
            alt={figureTitle}
            className="w-full h-auto object-contain transition-transform duration-300 group-hover:scale-105"
            onClick={() => onImageClick(`data:image/png;base64,${figure.content}`, figureTitle)}
            onError={(e) => {
              console.error('Image load error:', e);
              e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OWFhMiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIEVycm9yPC90ZXh0Pjwvc3ZnPg==';
            }}
          />
          {/* 悬停时显示放大图标 */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center pointer-events-none">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 dark:bg-black/90 rounded-full p-3">
              <svg
                className="w-6 h-6 text-neutral-700 dark:text-neutral-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * 骨架加载样式 - 图片卡片
 */
const FigureCardSkeleton = () => (
  <div className="bg-neutral-900 rounded-xl p-5 shadow-md mb-6 animate-pulse">
    <div className="mb-4">
      <div className="h-6 bg-neutral-800 rounded-md w-1/3 mb-2"></div>
    </div>

    <div className="w-full h-64 bg-neutral-800 rounded-lg"></div>
  </div>
);

interface FigureCardsProps {
  figureData: FigureData[];
  loading: boolean;
  figuresRef: React.RefObject<HTMLDivElement>;
}

/**
 * 图片卡片展示组件
 */
export const FigureCards: React.FC<FigureCardsProps> = ({
  figureData,
  loading,
  figuresRef
}) => {
  const [modalImage, setModalImage] = useState<{
    src: string;
    title: string;
  } | null>(null);

  const handleImageClick = (imageSrc: string, title: string) => {
    console.log('Image clicked:', title);
    console.log('Image src length:', imageSrc.length);
    console.log('Image src preview:', imageSrc.substring(0, 50) + '...');
    setModalImage({ src: imageSrc, title });
  };

  const handleCloseModal = () => {
    setModalImage(null);
  };

  return (
    <>
      <motion.div
        ref={figuresRef}
        id="figures"
        className="mb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2 className="text-2xl font-semibold mb-6 dark:text-white flex items-center">
          <IconPhoto className="mr-2 h-5 w-5 text-neutral-500 dark:text-neutral-400" />
          Analysis Figures
          <span className="ml-2 text-sm text-neutral-500 dark:text-neutral-400 font-normal">
            (Click to enlarge)
          </span>
        </h2>
        <div className="space-y-6">
          {figureData.length > 0 ? (
            <>
              {/* Figure 1 和 Figure 2 在同一行 */}
              {figureData.filter(figure => figure != null && figure.figureIndex <= 2).length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {figureData
                    .filter(figure => figure != null && figure.figureIndex <= 2)
                    .map((figure, index) => (
                      <FigureCard
                        key={`figure-${figure.figureIndex}`}
                        figure={figure}
                        index={index}
                        onImageClick={handleImageClick}
                      />
                    ))
                  }
                  {/* 如果只有一个图片且正在加载，显示骨架屏 */}
                  {loading && figureData.filter(figure => figure != null && figure.figureIndex <= 2).length === 1 && (
                    <FigureCardSkeleton />
                  )}
                </div>
              )}

              {/* Figure 3 及以后的图片单独占一行 */}
              {figureData.filter(figure => figure != null && figure.figureIndex >= 3).map((figure, index) => (
                <div key={`figure-row-${figure.figureIndex}`} className="grid grid-cols-1">
                  <FigureCard
                    figure={figure}
                    index={index + 2}
                    onImageClick={handleImageClick}
                  />
                </div>
              ))}

              {/* 加载状态的骨架屏 */}
              {loading && figureData.length === 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FigureCardSkeleton />
                  <FigureCardSkeleton />
                </div>
              )}
              {loading && figureData.length === 2 && (
                <div className="grid grid-cols-1">
                  <FigureCardSkeleton />
                </div>
              )}
            </>
          ) : (
            loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FigureCardSkeleton />
                <FigureCardSkeleton />
              </div>
            ) : (
              <div className="text-center py-8 text-neutral-400">
                <p>No figure data available. Please try searching again.</p>
              </div>
            )
          )}
        </div>
      </motion.div>

      {/* 图片放大模态框 */}
      <ImageModal
        isOpen={modalImage !== null}
        onClose={handleCloseModal}
        imageSrc={modalImage?.src || ''}
        imageAlt={modalImage?.title || ''}
        title={modalImage?.title}
      />
    </>
  );
};