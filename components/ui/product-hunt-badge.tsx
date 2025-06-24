"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface ProductHuntBadgeProps {
  className?: string;
}

export const ProductHuntBadge: React.FC<ProductHuntBadgeProps> = ({ className }) => {
  return (
    <div className={cn("inline-block", className)}>
      <a 
        href="https://www.producthunt.com/products/snapseeker?embed=true&utm_source=badge-featured&utm_medium=badge&utm_source=badge-snapseeker" 
        target="_blank" 
        rel="noopener noreferrer"
        className="block transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg"
        aria-label="SnapSeeker on Product Hunt"
      >
        <img 
          src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=982626&theme=light&t=1750781776426" 
          alt="SnapSeeker - Get your MVP right, find your PMF fast. | Product Hunt" 
          className="w-[250px] h-[54px] max-w-full h-auto" 
          width="250" 
          height="54"
          loading="lazy"
        />
      </a>
    </div>
  );
};

export default ProductHuntBadge;