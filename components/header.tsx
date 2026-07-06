"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import Link from "next/link";
import { useState, type ReactNode } from "react";

const navLinks = [
  { href: "#about", label: "首页" },
  { href: "#projects", label: "项目" },
  { href: "#skills", label: "能力" },
  { href: "#contact", label: "联系" },
];

export function Header(): ReactNode {
  const [isOpen, setIsOpen] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;

    if (latest > previous && latest > 60) {
      setIsHidden(true);
    } else {
      setIsHidden(false);
    }
  });

  const closeMenu = () => setIsOpen(false);

  return (
    <>
      <motion.header
        className="fixed top-0 z-50 w-full"
        initial={{ opacity: 0, y: -18, filter: "blur(10px)" }}
        animate={{
          opacity: 1,
          y: isHidden && !isOpen ? -120 : 0,
          filter: isHidden && !isOpen ? "blur(8px)" : "blur(0px)",
        }}
        transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 pt-4 sm:px-6 lg:px-8">
          <div className="flex w-full items-center justify-between rounded-full border border-white/10 bg-black/18 px-4 py-3 shadow-[0_10px_40px_rgba(0,0,0,0.18)] backdrop-blur-xl">
            <Link
              href="#about"
              className="text-sm font-medium tracking-[0.02em] text-foreground"
            >
              赵晖
            </Link>

            <nav className="hidden items-center gap-1 md:flex" aria-label="Main navigation">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-full px-3 py-2 text-sm text-foreground/64 transition-colors hover:bg-white/[0.06] hover:text-foreground"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="hidden md:block">
              <Link
                href="#contact"
                className="rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-sm text-foreground/84 transition-colors hover:bg-white/[0.09]"
              >
                求职联系
              </Link>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen((value) => !value)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-foreground md:hidden"
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
            >
              <span className="relative block h-3.5 w-3.5">
                <span
                  className={`absolute left-0 top-1/2 h-px w-full -translate-y-[5px] bg-current transition-transform duration-300 ${
                    isOpen ? "translate-y-0 rotate-45" : ""
                  }`}
                />
                <span
                  className={`absolute left-0 top-1/2 h-px w-full translate-y-[5px] bg-current transition-transform duration-300 ${
                    isOpen ? "translate-y-0 -rotate-45" : ""
                  }`}
                />
              </span>
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {isOpen ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-[#06070dcc]/90 backdrop-blur-2xl md:hidden"
          >
            <nav className="mx-auto flex h-full max-w-7xl flex-col gap-4 px-6 pt-30" aria-label="Mobile navigation">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -26, filter: "blur(10px)" }}
                  animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, x: -16, filter: "blur(10px)" }}
                  transition={{
                    duration: 0.35,
                    delay: index * 0.05,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                >
                  <Link
                    href={link.href}
                    onClick={closeMenu}
                    className="block text-4xl leading-tight text-foreground"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.35, delay: 0.28 }}
                className="pt-6"
              >
                <Link
                  href="#contact"
                  onClick={closeMenu}
                  className="inline-flex rounded-full border border-white/10 bg-white/[0.05] px-5 py-3 text-sm text-foreground/84"
                >
                  求职联系
                </Link>
              </motion.div>
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
