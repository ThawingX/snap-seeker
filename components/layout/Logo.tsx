"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";

export const Logo = () => {
  return (
    <Link
      href="#"
      className="relative z-20 flex items-center justify-center w-full py-4 px-2 text-sm font-normal text-black"
    >
      <div className="w-full max-w-[200px] h-12 shrink-0">
        <Image
          src="/images/header-logo.jpg"
          alt="SnapSeeker Logo"
          width={200}
          height={48}
          className="rounded-md w-full h-full"
          style={{ objectFit: 'contain' }}
          priority
          quality={100}
        />
      </div>
    </Link>
  );
};

export const LogoIcon = () => {
  return (
    <Link
      href="#"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
    >
      <div className="h-8 w-8 shrink-0">
        <Image
          src="/images/header-logo.jpg"
          alt="SnapSeeker Logo"
          width={32}
          height={32}
          className="rounded-md"
          priority
          quality={100}
        />
      </div>
    </Link>
  );
}; 