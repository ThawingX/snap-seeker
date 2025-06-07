"use client";
import React from "react";
import { motion } from "framer-motion";
import { IconPhoto } from "@tabler/icons-react";

/**
 * 图片数据接口
 */
export interface FigureData {
  step: string;
  figureIndex: number;
  content: string; // base64 图片数据
}

/**
 * 单个图片卡片组件
 */
const FigureCard = ({ figure, index }: { figure: FigureData; index: number }) => (
  <div className="bg-white dark:bg-neutral-900 rounded-xl p-5 shadow-md mb-6">
    <div className="mb-4">
      <h3 className="text-xl font-bold text-neutral-900 dark:text-white">
        Figure {figure.figureIndex}
      </h3>
    </div>
    
    <div className="w-full h-64 bg-neutral-100 dark:bg-neutral-800 rounded-lg overflow-hidden">
      <img 
        src={`data:image/png;base64,${figure.content}`}
        alt={`Figure ${figure.figureIndex}`}
        className="w-full h-full object-contain"
        onError={(e) => {
          console.error('Image load error:', e);
          e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OWFhMiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIEVycm9yPC90ZXh0Pjwvc3ZnPg==';
        }}
      />
    </div>
  </div>
);

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
  return (
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
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {figureData.length > 0 ? (
          <>
            {figureData.filter(figure => figure != null).map((figure, index) => (
              <FigureCard key={`figure-${figure.figureIndex}`} figure={figure} index={index} />
            ))}
            {loading && figureData.length < 3 &&
              Array(3 - figureData.length).fill(0).map((_, index) => (
                <FigureCardSkeleton key={`skeleton-${index}`} />
              ))
            }
          </>
        ) : (
          loading ? (
            Array(3).fill(0).map((_, index) => (
              <FigureCardSkeleton key={index} />
            ))
          ) : (
            <div className="col-span-3 text-center py-8 text-neutral-400">
              <p>No figure data available. Please try searching again.</p>
            </div>
          )
        )}
      </div>
    </motion.div>
  );
};