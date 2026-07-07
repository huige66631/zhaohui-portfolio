"use client";

import { Download } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

type NavItem = {
  id: string;
  href: string;
  label: string;
};

const NAV_ITEMS: readonly NavItem[] = [
  { id: "home", href: "#home", label: "首页" },
  { id: "projects", href: "#projects", label: "项目" },
  { id: "skills", href: "#skills", label: "能力" },
  { id: "contact", href: "#contact", label: "联系" },
];

export function Header(): ReactNode {
  const listRef = useRef<HTMLUListElement>(null);
  const itemRefs = useRef<Array<HTMLLIElement | null>>([]);
  const [activeId, setActiveId] = useState<string>("home");
  const [pillRect, setPillRect] = useState<{ x: number; width: number } | null>(
    null
  );
  const [hasMeasured, setHasMeasured] = useState(false);

  useEffect(() => {
    const sections = NAV_ITEMS.map((item) => document.getElementById(item.id)).filter(
      Boolean
    ) as HTMLElement[];
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible[0]?.target.id) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: "-25% 0px -45% 0px",
        threshold: [0.2, 0.4, 0.6],
      }
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  useLayoutEffect(() => {
    const activeIndex = NAV_ITEMS.findIndex((item) => item.id === activeId);
    const list = listRef.current;
    const activeEl = activeIndex >= 0 ? itemRefs.current[activeIndex] : null;

    if (!list || !activeEl) {
      setPillRect(null);
      return;
    }

    const listRect = list.getBoundingClientRect();
    const itemRect = activeEl.getBoundingClientRect();

    setPillRect({
      x: itemRect.left - listRect.left,
      width: itemRect.width,
    });
  }, [activeId]);

  useEffect(() => {
    if (!pillRect) return;
    const id = requestAnimationFrame(() => setHasMeasured(true));
    return () => cancelAnimationFrame(id);
  }, [pillRect]);

  return (
    <motion.header
      className="pointer-events-none fixed inset-x-0 top-4 z-50"
      initial={{ opacity: 0, y: -18, filter: "blur(10px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="mx-auto flex w-fit max-w-[calc(100vw-1.5rem)] items-center justify-center px-3">
        <div className="pointer-events-auto flex items-center gap-1 rounded-full border border-violet-200/12 bg-[#0f0a1fcc]/85 p-1.5 shadow-[0_16px_60px_rgba(7,4,18,0.38)] backdrop-blur-xl">
          <ul ref={listRef} className="relative flex items-center gap-1">
            {pillRect ? (
              <motion.span
                aria-hidden="true"
                className="absolute inset-y-0 left-0 rounded-full border border-violet-200/14 bg-violet-300/12"
                initial={false}
                animate={{ x: pillRect.x, width: pillRect.width }}
                transition={
                  hasMeasured
                    ? { type: "spring", stiffness: 380, damping: 32 }
                    : { duration: 0 }
                }
              />
            ) : null}

            {NAV_ITEMS.map((item, index) => {
              const isActive = item.id === activeId;

              return (
                <li
                  key={item.id}
                  ref={(element) => {
                    itemRefs.current[index] = element;
                  }}
                  className="relative"
                >
                  <Link
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    className="relative inline-flex min-w-15 items-center justify-center rounded-full px-4 py-2 text-sm font-medium text-foreground/72 transition-colors hover:text-foreground sm:min-w-18"
                  >
                    <span className={isActive ? "text-foreground" : ""}>
                      {item.label}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>

          <Link
            href="/resume-zhaohui.pdf"
            target="_blank"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-violet-200/12 bg-violet-300/10 text-foreground/78 transition-colors hover:bg-violet-300/16 hover:text-foreground"
            aria-label="查看简历"
          >
            <Download className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </motion.header>
  );
}
