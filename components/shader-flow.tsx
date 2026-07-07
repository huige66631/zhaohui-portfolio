"use client";

import { Mesh, Program, Renderer, Transform, Triangle } from "ogl";
import { useEffect, useRef, type ReactNode } from "react";

type ShaderFlowProps = {
  className?: string;
  flowSpeed?: [number, number];
  iterations?: number;
  scale?: number;
  brightness?: number;
  colorLowA?: [number, number, number];
  colorHighA?: [number, number, number];
  fadeRx?: number;
  fadeRy?: number;
  fadeCx?: number;
  fadeCy?: number;
};

const vertexShader = `attribute vec2 position;void main(){gl_Position=vec4(position,0.,1.);}`;

const fragmentShader = `precision highp float;
uniform vec2 uR;
uniform float uT;
uniform vec2 uV;
uniform float uS;
uniform float uTw;
uniform float uDe;
uniform float uMs;
uniform float uB;
uniform int uIt;
uniform vec3 uColorLow;
uniform vec3 uColorHigh;
uniform vec3 uBgColor;
uniform vec4 uFadeShape;

float h(vec2 p){
  return sin(p.x+sin(p.y+uT*uV.x))*sin(p.y*p.x*0.1+uT*uV.y);
}

float fadeAlpha(float d){
  float t=clamp(1.0-d,0.0,1.0);
  return t*t*(3.0-2.0*t);
}

void main(){
  vec2 frag=gl_FragCoord.xy/uR;
  vec2 p=frag-0.5;
  p.x*=uR.x/uR.y;
  p*=uS;

  float ms=uT*uMs*0.1;
  vec2 d=vec2(sin(ms),cos(ms))*0.1;
  float kt=uTw*0.01;
  float kd=1.0/uDe;

  vec2 e=vec2(0.05,0.);
  vec2 r=vec2(0.);
  for(int i=0;i<24;i++){
    if(i>=uIt)break;
    float a=h(p);
    float b=h(p+e.xy);
    float c=h(p+e.yx);
    vec2 q=vec2(b-a,c-a)*20.;
    p+=vec2(-q.y,q.x)*kt+q*kd+d;
    r=q;
  }

  float t=clamp(length(r)*0.5,0.0,1.0);
  vec3 col=mix(uColorLow,uColorHigh,t)*uB;

  vec2 ndc=vec2(frag.x,1.0-frag.y);
  float aspect=uR.x/uR.y;
  float dx=((ndc.x-uFadeShape.x)*aspect)/uFadeShape.z;
  float dy=(ndc.y-uFadeShape.y)/uFadeShape.w;
  float fa=fadeAlpha(sqrt(dx*dx+dy*dy));

  vec3 outColor=mix(uBgColor,col,fa);
  gl_FragColor=vec4(outColor,1.0);
}`;

const defaults = {
  flowSpeed: [0.1, 0.2] as [number, number],
  iterations: 14,
  scale: 6,
  brightness: 1,
  colorLowA: [0.18, 0.2, 0.3] as [number, number, number],
  colorHighA: [0.55, 0.38, 0.32] as [number, number, number],
  fadeRx: 1.4,
  fadeRy: 0.6,
  fadeCx: 0.5,
  fadeCy: 0.0,
};

function parseColor(input: string): [number, number, number] | null {
  const value = input.trim();

  if (value.startsWith("#")) {
    let hex = value.slice(1);
    if (hex.length === 3) {
      hex = hex
        .split("")
        .map((part) => part + part)
        .join("");
    }
    if (hex.length !== 6) return null;
    const number = parseInt(hex, 16);
    if (Number.isNaN(number)) return null;
    return [
      ((number >> 16) & 255) / 255,
      ((number >> 8) & 255) / 255,
      (number & 255) / 255,
    ];
  }

  const matches = value.match(/(\d+(?:\.\d+)?)/g);
  if (!matches || matches.length < 3) return null;

  return [
    Number(matches[0]) / 255,
    Number(matches[1]) / 255,
    Number(matches[2]) / 255,
  ];
}

function readBackgroundColor(element: HTMLElement): [number, number, number] {
  const styles = getComputedStyle(element);
  const variableValue = styles.getPropertyValue("--background").trim();
  const parsed = variableValue ? parseColor(variableValue) : null;
  if (parsed) return parsed;

  const probe = document.createElement("div");
  probe.style.cssText =
    "position:absolute;width:0;height:0;background:var(--background);";
  element.appendChild(probe);
  const raw = getComputedStyle(probe).backgroundColor;
  element.removeChild(probe);

  return parseColor(raw) ?? [1, 1, 1];
}

export function ShaderFlow(props: ShaderFlowProps): ReactNode {
  const ref = useRef<HTMLDivElement | null>(null);
  const propRef = useRef(props);

  useEffect(() => {
    propRef.current = props;
  });

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const renderer = new Renderer({
      dpr: Math.min(window.devicePixelRatio || 1, 1.25),
      alpha: false,
      antialias: false,
      powerPreference: "high-performance",
    });

    const gl = renderer.gl;
    gl.canvas.style.width = "100%";
    gl.canvas.style.height = "100%";
    gl.canvas.style.display = "block";
    element.appendChild(gl.canvas);

    const geometry = new Triangle(gl);
    const program = new Program(gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms: {
        uT: { value: 0 },
        uR: { value: [1, 1] },
        uV: { value: [...defaults.flowSpeed] },
        uS: { value: defaults.scale },
        uTw: { value: 50 },
        uDe: { value: 200 },
        uMs: { value: 2.5 },
        uB: { value: defaults.brightness },
        uIt: { value: defaults.iterations },
        uColorLow: { value: [...defaults.colorLowA] },
        uColorHigh: { value: [...defaults.colorHighA] },
        uBgColor: { value: readBackgroundColor(document.documentElement) },
        uFadeShape: {
          value: [defaults.fadeCx, defaults.fadeCy, defaults.fadeRx, defaults.fadeRy],
        },
      },
    });

    const mesh = new Mesh(gl, { geometry, program });
    const scene = new Transform();
    mesh.setParent(scene);

    const resize = (): void => {
      const width = element.clientWidth;
      const height = element.clientHeight;
      renderer.setSize(width, height);
      program.uniforms.uR.value = [gl.drawingBufferWidth, gl.drawingBufferHeight];
    };

    resize();

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(element);

    let frame = 0;
    let visible = true;
    let onScreen = true;
    const startTime = performance.now();

    const onVisibilityChange = (): void => {
      visible = document.visibilityState === "visible";
    };

    document.addEventListener("visibilitychange", onVisibilityChange);

    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          onScreen = entry.isIntersecting;
        }
      },
      { rootMargin: "100px" }
    );
    intersectionObserver.observe(element);

    const syncBackground = (): void => {
      program.uniforms.uBgColor.value = readBackgroundColor(document.documentElement);
    };

    const themeObserver = new MutationObserver(syncBackground);
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "data-theme", "style"],
    });
    syncBackground();

    const syncProps = (): void => {
      const current = propRef.current;
      program.uniforms.uV.value = [...(current.flowSpeed ?? defaults.flowSpeed)];
      program.uniforms.uS.value = current.scale ?? defaults.scale;
      program.uniforms.uB.value = current.brightness ?? defaults.brightness;
      program.uniforms.uIt.value = current.iterations ?? defaults.iterations;
      program.uniforms.uColorLow.value = [
        ...(current.colorLowA ?? defaults.colorLowA),
      ];
      program.uniforms.uColorHigh.value = [
        ...(current.colorHighA ?? defaults.colorHighA),
      ];
      program.uniforms.uFadeShape.value = [
        current.fadeCx ?? defaults.fadeCx,
        current.fadeCy ?? defaults.fadeCy,
        current.fadeRx ?? defaults.fadeRx,
        current.fadeRy ?? defaults.fadeRy,
      ];
    };

    const tick = (): void => {
      if (visible && onScreen) {
        program.uniforms.uT.value = (performance.now() - startTime) / 1000;
        syncProps();
        renderer.render({ scene });
      }

      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      themeObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
      if (gl.canvas.parentElement === element) {
        element.removeChild(gl.canvas);
      }
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, []);

  return <div ref={ref} aria-hidden="true" className={props.className} />;
}
