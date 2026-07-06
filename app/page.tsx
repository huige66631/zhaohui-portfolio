import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { ThemeSwitch } from "@/components/theme-switch";
import { createMetadata } from "@/lib/metadata";
import { BriefSection } from "@/components/brief-section";
import { ProjectsSection } from "@/components/projects-section";
import { SkillsSection } from "@/components/skills-section";
import { ContactSection } from "@/components/contact-section";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = createMetadata({
  title: "赵晖 | AI 应用开发 / Agent / 自动化",
  description:
    "赵晖的求职个人网站，展示 AI 应用开发、Agent 工作流、自动化系统与通信工程相关项目经验。",
  path: "/",
});

export default function HomePage(): ReactNode {
  return (
    <>
      <Header />
      <ThemeSwitch />
      <main id="main-content" className="flex-1">
        <Hero />
        <BriefSection />
        <ProjectsSection />
        <SkillsSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
