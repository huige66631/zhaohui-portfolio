"use client";

import Link from "next/link";
import type { ReactNode } from "react";

export function Footer(): ReactNode {
  return (
    <footer className="px-4 pb-10 pt-6 text-foreground/48 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm">
          {new Date().getFullYear()} 赵晖 · 求职个人网站
        </p>
        <div className="flex flex-wrap items-center gap-5 text-sm">
          <Link href="#projects" className="transition-colors hover:text-foreground">
            项目
          </Link>
          <Link href="#skills" className="transition-colors hover:text-foreground">
            能力
          </Link>
          <Link
            href="https://github.com/huige66631"
            target="_blank"
            rel="noreferrer"
            className="transition-colors hover:text-foreground"
          >
            GitHub
          </Link>
        </div>
      </div>
    </footer>
  );
}
