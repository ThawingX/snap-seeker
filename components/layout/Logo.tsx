"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";

export const Logo = () => {
  return (
    <Link
      href="#"
      className="relative z-20 flex items-center justify-center w-full py-4 px-2 text-sm font-normal text-foreground"
    >
      <div className="flex items-center space-x-3">
        <div className="h-10 w-10 shrink-0">
          <Image
            src="/images/web-logo.png"
            alt="SnapSeeker Logo"
            width={40}
            height={40}
            className="rounded-md"
            priority
            quality={100}
          />
        </div>
        <span className="text-xl font-bold text-foreground">SnapSeeker</span>
      </div>
    </Link>
  );
};

export const LogoIcon = () => {
  return (
    <Link
      href="#"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-foreground"
    >
      <div className="flex items-center space-x-2">
        <div className="h-8 w-8 shrink-0">
          <Image
            src="/images/web-logo.png"
            alt="SnapSeeker Logo"
            width={32}
            height={32}
            className="rounded-md"
            priority
            quality={100}
          />
        </div>
        <span className="text-lg font-semibold text-foreground">SnapSeeker</span>
      </div>
    </Link>
  );
};