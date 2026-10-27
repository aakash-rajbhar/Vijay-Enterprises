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

export function ProductCard({
  product,
  index,
  onSelect,
  href,
}: ProductCardProps) {
  const formattedIndex = String(index + 1).padStart(2, "0");

  const cardContent = (
    <div
      data-image-reveal
      className="group relative aspect-[4/5] w-full overflow-hidden rounded-2xl sm:rounded-3xl border border-black/10 bg-steel-950 transition-all duration-500 hover:border-black/20 hover:shadow-xl [isolation:isolate] [transform:translateZ(0)] [-webkit-mask-image:-webkit-radial-gradient(white,black)]"
      data-cursor="view"
      data-cursor-row
    >
      {/* ── Product Image ── */}
      <Image
        src={product.image}
        alt={`${product.name} - Vijay Enterprises`}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className="object-cover grayscale contrast-110 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
      />

      {/* ── Minimalist Dark Vignette ── */}
      <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent transition-opacity duration-300 group-hover:from-ink/85" />

      {/* ── Top Index & Minimal View Cue ── */}
      <div className="absolute inset-x-0 top-0 flex items-center justify-between p-5">
        <span className="font-mono text-xs text-white/50 transition-colors duration-300 group-hover:text-white/80">
          {formattedIndex}
        </span>
        <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-ink/30 text-white backdrop-blur-md transition-all duration-300 group-hover:border-spark group-hover:bg-spark group-hover:text-white">
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
      <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6 transition-transform duration-300 ease-out">
        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/60">
          Products
        </p>
        <h3 className="mt-1 font-display text-2xl text-white font-medium tracking-tight transition-colors duration-200 group-hover:text-spark">
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
