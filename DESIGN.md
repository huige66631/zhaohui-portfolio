---
name: 赵晖个人网站
description: 面向求职场景的 AI 应用开发与自动化作品集网站
colors:
  primary: "oklch(0.57 0.18 23)"
  accent: "oklch(0.74 0.11 82)"
  neutral-bg: "oklch(0.985 0 0)"
  surface: "oklch(0.955 0.006 25)"
  ink: "oklch(0.2 0.02 20)"
  muted: "oklch(0.47 0.015 22)"
  line: "oklch(0.88 0.01 24)"
typography:
  display:
    fontFamily: "\"Manrope\", \"Noto Sans SC\", sans-serif"
    fontSize: "clamp(3.4rem, 8vw, 6rem)"
    fontWeight: 700
    lineHeight: 0.96
    letterSpacing: "-0.05em"
  title:
    fontFamily: "\"Manrope\", \"Noto Sans SC\", sans-serif"
    fontSize: "clamp(1.4rem, 2vw, 2rem)"
    fontWeight: 600
    lineHeight: 1.1
  body:
    fontFamily: "\"Noto Sans SC\", sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.7
  label:
    fontFamily: "\"Manrope\", \"Noto Sans SC\", sans-serif"
    fontSize: "0.82rem"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "0.08em"
rounded:
  sm: "14px"
  md: "28px"
  lg: "40px"
spacing:
  sm: "12px"
  md: "20px"
  lg: "32px"
  xl: "56px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.neutral-bg}"
    rounded: "{rounded.sm}"
    padding: "14px 24px"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "14px 24px"
---

# Design System: 赵晖个人网站

## 1. Overview

**Creative North Star: "Precise Momentum"**

这个系统服务于一个刚进入职业上升期的 AI 应用开发者，因此页面不能显得用力过猛，也不能平庸无记忆点。视觉表达要像一份被认真打磨过的技术陈述：结构清楚、节奏稳定、细节可靠，但在关键处露出锋芒。

整体审美走高密度留白与强层级排版路线，用接近白纸的背景承接内容，让深暖红成为少量但有分量的品牌动作。页面拒绝“模板化作品集”的散乱卡片感，也拒绝“泛 AI 科技站”的过度特效和情绪噪音。

**Key Characteristics:**
- 信息优先，视觉辅助
- 克制留白，强标题层级
- 深暖色点题，不泛滥使用
- 模块节奏不对称，但阅读路径清晰

## 2. Colors

配色采用 Committed 策略，用纯净浅底承载内容，让一组带温度的深红和低饱和金色承担品牌辨识度。

### Primary
- **Signal Crimson** (`oklch(0.57 0.18 23)`): 用于主按钮、强调线条、关键数据和交互焦点，是整站最明确的风格信号。

### Secondary
- **Quiet Brass** (`oklch(0.74 0.11 82)`): 用于标签、强调块和局部高亮，为冷静的页面注入一点职业野心和温度。

### Neutral
- **Clear Canvas** (`oklch(0.985 0 0)`): 页面主背景。必须保持干净，不允许随意染色。
- **Soft Panel** (`oklch(0.955 0.006 25)`): 区块承托底色，用于卡片、时间轴容器和局部面板。
- **Deep Graphite** (`oklch(0.2 0.02 20)`): 正文与主标题颜色，保证阅读对比。
- **Measured Ash** (`oklch(0.47 0.015 22)`): 次级信息、说明文案和辅助标签。
- **Paper Line** (`oklch(0.88 0.01 24)`): 轮廓线和分隔线。

**The One Signal Rule.** Primary 色只出现在真正需要决策或记忆的位置。若一个屏幕里到处都是红色，说明层级已经失控。

## 3. Typography

**Display Font:** Manrope (fallback: Noto Sans SC, sans-serif)  
**Body Font:** Noto Sans SC (fallback: sans-serif)  
**Label/Mono Font:** Manrope

**Character:** 标题字重果断、收口紧，正文保持平静和清晰。整套字体要传达的是“年轻但靠谱”，而不是“前卫炫技”。

### Hierarchy
- **Display** (700, `clamp(3.4rem, 8vw, 6rem)`, 0.96): 仅用于首屏主标题和章节级高势能文案。
- **Title** (600, `clamp(1.4rem, 2vw, 2rem)`, 1.1): 用于模块标题和项目名。
- **Body** (400, `1rem`, 1.7): 用于项目描述、能力说明和联系方式，正文宽度控制在 65ch 内。
- **Label** (600, `0.82rem`, 0.08em): 用于导航、年份、标签和辅助说明。

**The Sharp Headline Rule.** 大标题永远依赖字重、尺寸和留白建立存在感，禁止用渐变字或装饰效果制造“高级感”。

## 4. Elevation

这个系统以 tonal layering 为主，而不是依赖厚重阴影。深度通过明暗面差、边线和局部模糊光晕体现，保持干净和现代。

### Shadow Vocabulary
- **Ambient Lift** (`0 24px 60px color-mix(in oklab, oklch(0.57 0.18 23) 10%, transparent)`): 仅用于首屏重点区域与悬停态，表达轻微抬升。

**The Flat-First Rule.** 默认状态保持平面与克制，抬升只作为节奏点，不作为所有模块的通用装饰。

## 5. Components

### Buttons
- **Shape:** 温和圆角（14px），但不是过分柔软的胶囊按钮。
- **Primary:** Signal Crimson 底色，Clear Canvas 文字，强调求职行动路径。
- **Hover / Focus:** 悬停时轻微上浮并增强光晕；焦点必须使用清晰描边。
- **Secondary:** Soft Panel 背景配 Deep Graphite 文本，用于非主行动。

### Cards / Containers
- **Corner Style:** 大圆角（28px）。
- **Background:** Clear Canvas 与 Soft Panel 交替使用，建立层次但不形成厚重组件感。
- **Shadow Strategy:** 默认弱化，仅在首屏和作品亮点处使用 Ambient Lift。
- **Border:** 统一使用 Paper Line。
- **Internal Padding:** 以 20px、32px、56px 为主节奏。

### Navigation
- **Style:** 顶部导航保持轻量，随着滚动收紧背景和边线。
- **States:** 当前项和 hover 只通过颜色与下划线变化提示，不做夸张动画。
- **Mobile:** 折叠为按钮触发的抽屉式面板，保持同一语言。

### Signature Component
- **Project Story Block:** 每个重点项目以“问题 / 方法 / 结果”的纵向叙事呈现，旁边辅以角色、技术和成果标签。这是网站最关键的识别组件。

## 6. Do's and Don'ts

### Do:
- **Do** 让首屏在 5 秒内说清楚方向、能力和目标岗位。
- **Do** 用留白和排版建立高级感，而不是堆叠装饰。
- **Do** 让项目内容优先呈现问题、方法、结果三段逻辑。
- **Do** 保持主色稀缺，把注意力留给真正重要的 CTA 和成果数字。

### Don't:
- **Don't** 做成通用求职模板、普通卡片堆叠式作品集或夸张炫技的 AI 科技风。
- **Don't** 使用紫色霓虹、玻璃拟态、泛滥渐变、密集数据看板感。
- **Don't** 把“项目”和“作品”都做成同一种列表，造成重复阅读。
- **Don't** 用一堆技术关键词替代真实的项目叙事和结果说明。
