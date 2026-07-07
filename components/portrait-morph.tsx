"use client";

import { Mesh, Program, Renderer, Texture, Transform, Triangle } from "ogl";
import { useEffect, useRef, useState, type ReactNode } from "react";

type PortraitMorphProps = {
  srcA: string;
  srcB: string;
  alt: string;
  className?: string;
};

const vertexShader = `
attribute vec2 position;
varying vec2 vUv;
void main() {
  vUv = position * 0.5 + 0.5;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragmentShader = `
precision highp float;

uniform sampler2D uTexA;
uniform sampler2D uTexB;
uniform float uProgress;
uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uImageSize;
uniform vec2 uOrigin;
uniform vec2 uDirection;

varying vec2 vUv;

vec2 coverUv(vec2 uv) {
  vec2 ratio = vec2(
    min((uResolution.x / uResolution.y) / (uImageSize.x / uImageSize.y), 1.0),
    min((uResolution.y / uResolution.x) / (uImageSize.y / uImageSize.x), 1.0)
  );
  return vec2(
    uv.x * ratio.x + (1.0 - ratio.x) * 0.5,
    uv.y * ratio.y + (1.0 - ratio.y) * 0.5
  );
}

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;
  for (int i = 0; i < 5; i++) {
    value += amplitude * noise(p);
    p *= 2.0;
    amplitude *= 0.5;
  }
  return value;
}

void main() {
  vec2 uv = vUv;

  float progress = uProgress;
  float bell = 4.0 * progress * (1.0 - progress);

  vec2 dir = normalize(uDirection + vec2(0.0001));
  float along = dot(uv - uOrigin, dir);
  float distGradient = (along + 1.4) / 2.8;

  float warpLow = fbm(uv * 1.8 + uTime * 0.05) - 0.5;
  float warpHigh = fbm(uv * 5.5 - uTime * 0.04 + 13.0) - 0.5;
  float warp = warpLow * 0.55 + warpHigh * 0.18;

  float field = distGradient + warp;
  float remapped = mix(-0.25, 1.25, progress);
  float edgeWidth = 0.07;
  float mask = smoothstep(remapped - edgeWidth, remapped + edgeWidth, field);
  mask = 1.0 - mask;

  vec2 perp = vec2(-dir.y, dir.x);
  float ripplePhase = (field - remapped) * 14.0;
  float ripple = sin(ripplePhase) * 0.5 + 0.5;
  float edgeBand = 1.0 - smoothstep(0.0, edgeWidth * 1.6, abs(field - remapped));
  float pushAmount = ripple * edgeBand * 0.025 * bell;
  vec2 pushedUv = uv + perp * pushAmount;

  vec4 texA = texture2D(uTexA, coverUv(pushedUv));
  vec4 texB = texture2D(uTexB, coverUv(pushedUv));
  vec4 color = mix(texA, texB, mask);

  float edgeShade = edgeBand * 0.35 * bell;
  color.rgb *= 1.0 - edgeShade;

  gl_FragColor = color;
}
`;

export function PortraitMorph({
  srcA,
  srcB,
  alt,
  className,
}: PortraitMorphProps): ReactNode {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [ready, setReady] = useState(false);
  const hoverRef = useRef(false);
  const progressRef = useRef(0);
  const originRef = useRef<[number, number]>([0.5, 0.5]);
  const directionRef = useRef<[number, number]>([1, 0]);
  const lastPointerRef = useRef<{ x: number; y: number; t: number } | null>(
    null
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const renderer = new Renderer({
      alpha: true,
      premultipliedAlpha: false,
      dpr: Math.min(window.devicePixelRatio || 1, 2),
    });

    const gl = renderer.gl;
    const canvas = gl.canvas as HTMLCanvasElement;
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.display = "block";
    container.appendChild(canvas);

    const scene = new Transform();
    const textureA = new Texture(gl, { generateMipmaps: false });
    const textureB = new Texture(gl, { generateMipmaps: false });
    const imageSize: [number, number] = [1, 1];

    const loadImage = (src: string, texture: Texture): Promise<void> =>
      new Promise((resolve, reject) => {
        const image = new Image();
        image.crossOrigin = "anonymous";
        image.onload = () => {
          texture.image = image;
          imageSize[0] = image.naturalWidth;
          imageSize[1] = image.naturalHeight;
          resolve();
        };
        image.onerror = reject;
        image.src = src;
      });

    const geometry = new Triangle(gl);
    const program = new Program(gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms: {
        uTexA: { value: textureA },
        uTexB: { value: textureB },
        uProgress: { value: 0 },
        uTime: { value: 0 },
        uResolution: { value: [1, 1] as [number, number] },
        uImageSize: { value: imageSize },
        uOrigin: { value: [0.5, 0.5] as [number, number] },
        uDirection: { value: [1, 0] as [number, number] },
      },
      transparent: true,
    });

    const mesh = new Mesh(gl, { geometry, program });
    mesh.setParent(scene);

    const resize = (): void => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      renderer.setSize(width, height);
      program.uniforms.uResolution.value = [
        width * renderer.dpr,
        height * renderer.dpr,
      ];
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    resize();

    let animationFrame = 0;
    let lastTime = performance.now();
    let elapsed = 0;
    let running = true;

    const tick = (): void => {
      if (!running) return;

      const now = performance.now();
      const delta = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      elapsed += delta;

      const target = hoverRef.current ? 1 : 0;
      const stiffness = hoverRef.current ? 2.4 : 2.0;
      const blend = 1 - Math.exp(-stiffness * delta);
      progressRef.current += (target - progressRef.current) * blend;

      program.uniforms.uTime.value = elapsed;
      program.uniforms.uProgress.value = progressRef.current;
      program.uniforms.uOrigin.value = originRef.current;
      program.uniforms.uDirection.value = directionRef.current;
      program.uniforms.uImageSize.value = imageSize;

      renderer.render({ scene });
      animationFrame = requestAnimationFrame(tick);
    };

    const edgeDirection = (x: number, y: number): [number, number] => {
      const left = x;
      const right = 1 - x;
      const bottom = y;
      const top = 1 - y;
      const min = Math.min(left, right, bottom, top);

      if (min === left) return [1, 0];
      if (min === right) return [-1, 0];
      if (min === bottom) return [0, 1];
      return [0, -1];
    };

    const syncPointerOrigin = (
      event: PointerEvent
    ): { x: number; y: number } => {
      const rect = container.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = 1 - (event.clientY - rect.top) / rect.height;
      originRef.current = [x, y];
      directionRef.current = edgeDirection(x, y);
      lastPointerRef.current = { x, y, t: performance.now() };
      return { x, y };
    };

    const clearTouchPress = (): void => {
      window.clearTimeout(longPressTimer);
      longPressTimer = 0;
      touchStartRef = null;
    };

    let longPressTimer = 0;
    let touchStartRef: { x: number; y: number } | null = null;

    const onPointerEnter = (event: PointerEvent): void => {
      if (event.pointerType === "touch") return;

      syncPointerOrigin(event);
      hoverRef.current = true;
    };

    const onPointerLeave = (event: PointerEvent): void => {
      if (event.pointerType === "touch") return;

      const rect = container.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = 1 - (event.clientY - rect.top) / rect.height;
      originRef.current = [x, y];
      directionRef.current = edgeDirection(x, y).map((value) => -value) as [
        number,
        number,
      ];
      hoverRef.current = false;
    };

    const onPointerMove = (event: PointerEvent): void => {
      if (event.pointerType === "touch" && touchStartRef) {
        const distance = Math.hypot(
          event.clientX - touchStartRef.x,
          event.clientY - touchStartRef.y
        );

        if (distance > 12 && !hoverRef.current) {
          clearTouchPress();
          return;
        }
      }

      const rect = container.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = 1 - (event.clientY - rect.top) / rect.height;
      const lastPointer = lastPointerRef.current;

      if (
        lastPointer &&
        performance.now() - lastPointer.t < 80 &&
        progressRef.current < 0.15
      ) {
        const vx = x - lastPointer.x;
        const vy = y - lastPointer.y;
        const magnitude = Math.hypot(vx, vy);

        if (magnitude > 0.01) {
          directionRef.current = [vx / magnitude, vy / magnitude];
        }
      }

      lastPointerRef.current = { x, y, t: performance.now() };
    };

    const onPointerDown = (event: PointerEvent): void => {
      if (event.pointerType === "mouse") return;

      syncPointerOrigin(event);
      touchStartRef = { x: event.clientX, y: event.clientY };
      window.clearTimeout(longPressTimer);
      longPressTimer = window.setTimeout(() => {
        hoverRef.current = true;
      }, 320);
    };

    const onPointerUp = (): void => {
      clearTouchPress();
      hoverRef.current = false;
    };

    const onContextMenu = (event: MouseEvent): void => {
      event.preventDefault();
    };

    container.addEventListener("pointerenter", onPointerEnter);
    container.addEventListener("pointerleave", onPointerLeave);
    container.addEventListener("pointermove", onPointerMove);
    container.addEventListener("pointerdown", onPointerDown);
    container.addEventListener("pointerup", onPointerUp);
    container.addEventListener("pointercancel", onPointerUp);
    container.addEventListener("contextmenu", onContextMenu);

    Promise.all([loadImage(srcA, textureA), loadImage(srcB, textureB)])
      .then(() => {
        setReady(true);
        lastTime = performance.now();
        tick();
      })
      .catch(() => {
        setReady(false);
      });

    return () => {
      running = false;
      cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      container.removeEventListener("pointerenter", onPointerEnter);
      container.removeEventListener("pointerleave", onPointerLeave);
      container.removeEventListener("pointermove", onPointerMove);
      container.removeEventListener("pointerdown", onPointerDown);
      container.removeEventListener("pointerup", onPointerUp);
      container.removeEventListener("pointercancel", onPointerUp);
      container.removeEventListener("contextmenu", onContextMenu);
      const extension = gl.getExtension("WEBGL_lose_context");
      extension?.loseContext();
      if (canvas.parentNode === container) {
        container.removeChild(canvas);
      }
    };
  }, [srcA, srcB]);

  return (
    <div
      ref={containerRef}
      role="img"
      aria-label={alt}
      className={className}
      style={{
        position: "relative",
        touchAction: "pan-y",
        width: "100%",
        height: "100%",
      }}
    >
      {!ready ? (
        <img
          src={srcA}
          alt={alt}
          draggable={false}
          className="absolute inset-0 h-full w-full object-cover select-none"
        />
      ) : null}
    </div>
  );
}
