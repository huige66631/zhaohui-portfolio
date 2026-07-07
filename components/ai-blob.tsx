"use client";

import {
  useEffect,
  useMemo,
  useRef,
  type CSSProperties,
  type ReactNode,
} from "react";
import * as THREE from "three";

export interface AIBlobProps {
  size?: number;
  animationSpeed?: number;
  glowIntensity?: number;
  noiseScale?: number;
  innerScale?: number;
  resolution?: number;
  colors?: string[];
  className?: string;
  style?: CSSProperties;
}

const DEFAULT_COLORS: [string, string, string, string] = [
  "#ff006e",
  "#8338ec",
  "#3a86ff",
  "#06ffa5",
];

const vertexShader = `
  void main() {
    gl_Position = vec4(position, 1.0);
  }
`;

const fragmentShader = `
  #ifdef GL_FRAGMENT_PRECISION_HIGH
  precision highp float;
  #else
  precision mediump float;
  #endif

  uniform float uTime;
  uniform vec2 uResolution;
  uniform float uSpeed;
  uniform float uGlowIntensity;
  uniform float uNoiseScale;
  uniform float uInnerScale;
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  uniform vec3 uColor3;
  uniform vec3 uColor4;

  #define PI_TWO 6.28318530718

  float rng(vec2 n) {
    return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
  }

  float perlin(vec2 p) {
    vec2 ip = floor(p);
    vec2 u = fract(p);
    u = u * u * (3.0 - 2.0 * u);
    float res = mix(
      mix(rng(ip), rng(ip + vec2(1.0, 0.0)), u.x),
      mix(rng(ip + vec2(0.0, 1.0)), rng(ip + vec2(1.0, 1.0)), u.x),
      u.y
    );
    return res * res;
  }

  float fractal(vec2 p, int octaves) {
    float s = 0.0;
    float m = 0.0;
    float a = 0.5;

    s += a * perlin(p);
    m += a;
    a *= 0.5;
    p *= 2.0;

    if (octaves >= 2) {
      s += a * perlin(p);
      m += a;
    }

    return s / m;
  }

  float brightness(vec3 color) {
    return dot(color, vec3(0.299, 0.587, 0.114));
  }

  mat3 rotateX(float angle) {
    float s = sin(angle);
    float c = cos(angle);
    return mat3(
      1.0, 0.0, 0.0,
      0.0, c, -s,
      0.0, s, c
    );
  }

  mat3 rotateY(float angle) {
    float s = sin(angle);
    float c = cos(angle);
    return mat3(
      c, 0.0, s,
      0.0, 1.0, 0.0,
      -s, 0.0, c
    );
  }

  mat3 rotateZ(float angle) {
    float s = sin(angle);
    float c = cos(angle);
    return mat3(
      c, -s, 0.0,
      s, c, 0.0,
      0.0, 0.0, 1.0
    );
  }

  void main() {
    float min_res = min(uResolution.x, uResolution.y);
    vec2 uv = (gl_FragCoord.xy * 2.0 - uResolution.xy) / min_res * 1.5;
    float t = uTime * uSpeed;

    float l = dot(uv, uv);
    if (l > 2.5) {
      gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
      return;
    }

    float sm = smoothstep(1.04, 0.96, l);
    float z = sqrt(max(0.0, 1.0 - min(l, 1.0)));
    vec3 noisePos = normalize(vec3(uv.x, uv.y, z));

    float angleX = sin(t * 0.23) * 1.5 + cos(t * 0.37) * 0.6;
    float angleY = sin(t * 0.19) * 1.3 + cos(t * 0.41) * 0.7;
    float angleZ = sin(t * 0.31) * 1.1 + cos(t * 0.29) * 0.5;

    noisePos = rotateX(angleX) * noisePos;
    noisePos = rotateY(angleY) * noisePos;
    noisePos = rotateZ(angleZ) * noisePos;

    float d = sm * l * l * l * 2.0;
    vec3 norm = normalize(vec3(uv.x, uv.y, 0.7 - d));

    float nx = fractal(noisePos.xy * 2.0 * uNoiseScale / 3.0 + t * 0.4 + 25.69, 2);
    float ny = fractal(noisePos.xy * 2.0 * uNoiseScale / 3.0 + t * 0.4 + 86.31, 2);
    float n = fractal(noisePos.xy * uNoiseScale + 2.0 * vec2(nx, ny), 2);
    vec3 col = vec3(n * 0.5 + 0.25);
    float a = atan(noisePos.y, noisePos.x) / PI_TWO + t * 0.1;

    float gradPos = fract(a);
    vec3 gradientColor;
    if (gradPos < 0.25) {
      gradientColor = mix(uColor1, uColor2, gradPos * 4.0);
    } else if (gradPos < 0.5) {
      gradientColor = mix(uColor2, uColor3, (gradPos - 0.25) * 4.0);
    } else if (gradPos < 0.75) {
      gradientColor = mix(uColor3, uColor4, (gradPos - 0.5) * 4.0);
    } else {
      gradientColor = mix(uColor4, uColor1, (gradPos - 0.75) * 4.0);
    }

    col *= gradientColor;
    col *= 2.0 * uGlowIntensity * 1.25;
    vec3 cd = abs(col);
    vec3 c = col * d;
    float lightDot = max(0.0, dot(norm, vec3(0.0, 0.0, -1.0)));
    c += (c * 0.5 + vec3(1.0) - brightness(c)) * vec3(pow(lightDot, 5.0) * 3.0);
    float g = 1.5 * smoothstep(0.5, 1.0, fractal(noisePos.xy * uInnerScale / (1.0 + noisePos.z), 1)) * d;
    c += g * uGlowIntensity;

    float uvLen = length(uv);
    col = c + col * pow((1.0 - smoothstep(1.0, 0.98, l) - pow(max(0.0, uvLen - 1.0), 0.2)) * 2.0, 4.0);
    float f = fractal(noisePos.xy * 2.0 + t, 2) + 0.1;
    vec2 innerUV = uv * (f + 0.1) * 0.5 / uInnerScale;
    float innerL = dot(innerUV, innerUV);
    vec3 ins = normalize(cd) + 0.1;
    float ind = 0.2 + pow(smoothstep(0.0, 1.5, sqrt(innerL)) * 48.0, 0.25);
    ind *= ind * ind * ind;
    ind = 1.0 / ind;
    ins *= ind;
    col += ins * ins * sm * smoothstep(0.7, 1.0, ind) * uGlowIntensity;
    col += abs(norm) * (1.0 - d) * sm * 0.25;

    float colBrightness = brightness(col);
    float alpha = sm * pow(colBrightness, 2.5) * 2.0;
    alpha = clamp(alpha, 0.0, 1.0);

    float edgeFalloff = smoothstep(1.0, 0.95, uvLen);
    alpha *= edgeFalloff;
    col = pow(col, vec3(0.95));

    gl_FragColor = vec4(col, alpha);
  }
`;

function hexToRgb(hex: string): THREE.Vector3 {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return new THREE.Vector3(1, 1, 1);

  return new THREE.Vector3(
    parseInt(result[1]!, 16) / 255,
    parseInt(result[2]!, 16) / 255,
    parseInt(result[3]!, 16) / 255
  );
}

export default function AIBlob({
  size = 400,
  animationSpeed = 1,
  glowIntensity = 0.8,
  noiseScale = 3,
  innerScale = 1,
  resolution = 1,
  colors = DEFAULT_COLORS,
  className = "",
  style,
}: AIBlobProps): ReactNode {
  const containerRef = useRef<HTMLDivElement>(null);
  const colorsKey = useMemo(() => colors.join("|"), [colors]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const normalizedColors: [string, string, string, string] = [
      colors[0] ?? DEFAULT_COLORS[0],
      colors[1] ?? DEFAULT_COLORS[1],
      colors[2] ?? DEFAULT_COLORS[2],
      colors[3] ?? DEFAULT_COLORS[3],
    ];
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      depth: false,
      powerPreference: "high-performance",
      premultipliedAlpha: false,
      stencil: false,
    });

    renderer.setClearColor(0x000000, 0);
    renderer.domElement.style.position = "absolute";
    renderer.domElement.style.inset = "0";
    renderer.domElement.style.display = "block";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const uniforms = {
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(1, 1) },
      uSpeed: { value: animationSpeed },
      uGlowIntensity: { value: glowIntensity },
      uNoiseScale: { value: noiseScale },
      uInnerScale: { value: innerScale },
      uColor1: { value: hexToRgb(normalizedColors[0]) },
      uColor2: { value: hexToRgb(normalizedColors[1]) },
      uColor3: { value: hexToRgb(normalizedColors[2]) },
      uColor4: { value: hexToRgb(normalizedColors[3]) },
    };
    const material = new THREE.ShaderMaterial({
      blending: THREE.NormalBlending,
      depthTest: false,
      depthWrite: false,
      fragmentShader,
      transparent: true,
      uniforms,
      vertexShader,
    });
    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const syncSize = (): void => {
      const rect = container.getBoundingClientRect();
      const width = Math.max(1, Math.round(rect.width));
      const height = Math.max(1, Math.round(rect.height));
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2) * resolution;

      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(width, height, false);
      uniforms.uResolution.value.set(width * pixelRatio, height * pixelRatio);
    };

    const resizeObserver = new ResizeObserver(syncSize);
    resizeObserver.observe(container);
    syncSize();

    let animationId = 0;
    const animate = (time: number): void => {
      uniforms.uTime.value = time * 0.001;
      renderer.render(scene, camera);

      if (!reduceMotion) {
        animationId = requestAnimationFrame(animate);
      }
    };
    animate(0);

    return () => {
      cancelAnimationFrame(animationId);
      resizeObserver.disconnect();
      scene.remove(mesh);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [
    animationSpeed,
    colors,
    colorsKey,
    glowIntensity,
    innerScale,
    noiseScale,
    resolution,
  ]);

  return (
    <div
      aria-hidden="true"
      className={`relative block ${className}`}
      data-ai-blob="true"
      style={{
        aspectRatio: "1 / 1",
        maxWidth: "calc(100vw - 2rem)",
        width: `${size}px`,
        ...style,
      }}
    >
      <div ref={containerRef} className="absolute inset-0 bg-transparent" />
    </div>
  );
}
