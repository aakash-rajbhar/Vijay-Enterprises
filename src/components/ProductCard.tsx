"use client";

import Image from "next/image";
import Link from "next/link";

import { type ProductCategory } from "@/lib/products";

interface ProductCardProps {
  product: ProductCategory;
  index: number;
  onSelect?: (product: ProductCategory) => void;
  href?: string;
}

export function ProductCard({ product, index, onSelect, href }: ProductCardProps) {
  const formattedIndex = String(index + 1).padStart(2, "0");

  const cardContent = (
    <div
      data-image-reveal
      className="group bg-steel-950 hover:bg-spark relative [isolation:isolate] aspect-[4/5] w-full [transform:translateZ(0)] overflow-hidden transition-colors duration-500 [-webkit-mask-image:-webkit-radial-gradient(white,black)]"
      data-cursor="view"
      data-cursor-row
    >
      {/* ── Product Image ── */}
      <Image
        src={product.image}
        alt={`${product.name} - Vijay Enterprises`}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className="object-cover contrast-110 grayscale transition-[transform,filter] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105 group-hover:grayscale-0"
      />

      {/* ── Minimalist Dark Vignette ── */}
      <div className="from-ink/80 via-ink/20 group-hover:from-ink/85 absolute inset-0 bg-gradient-to-t to-transparent transition-opacity duration-300" />
      <span
        className="group-hover:border-spark pointer-events-none absolute inset-0 z-20 border border-transparent transition-colors duration-300"
        aria-hidden="true"
      />

      {/* ── Top Index & Minimal View Cue ── */}
      <div className="absolute inset-x-0 top-0 flex items-center justify-between p-5">
        <span className="bg-ink/60 group-hover:border-spark border border-white/20 px-1.5 py-0.5 font-mono text-[10px] text-white/60 transition-colors duration-300 group-hover:text-white">
          {formattedIndex}
        </span>
        <span className="bg-ink/30 group-hover:border-spark group-hover:bg-spark group-hover:text-ink! flex h-9 w-9 items-center justify-center border border-white/20 text-white backdrop-blur-md transition-all duration-300">
          <svg
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="none"
            aria-hidden="true"
            className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          >
            <path
              d="M1 9L9 1M9 1H1M9 1V9"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>

      {/* ── Minimalist Bottom Label: Just Title ── */}
      <div className="absolute inset-x-0 bottom-0 p-5 transition-transform duration-300 ease-out sm:p-6">
        <h3 className="font-display group-hover:text-spark mt-1 text-2xl font-medium tracking-tight text-white transition-colors duration-200">
          {product.name}
        </h3>
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block w-full text-left focus:outline-none">
        {cardContent}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={() => onSelect?.(product)}
      className="block w-full text-left focus:outline-none"
      aria-haspopup="dialog"
    >
      {cardContent}
    </button>
  );
}
