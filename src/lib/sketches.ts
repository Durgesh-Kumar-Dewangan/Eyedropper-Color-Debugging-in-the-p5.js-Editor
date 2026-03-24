import type p5 from "p5";

export interface SketchDef {
  id: string;
  name: string;
  description: string;
  sketch: (p: p5) => void;
}

const colorWaves: SketchDef = {
  id: "color-waves",
  name: "Color Waves",
  description: "Animated sine waves with rich color gradients",
  sketch: (p: p5) => {
    p.setup = () => {
      p.createCanvas(600, 400);
      p.colorMode(p.HSB, 360, 100, 100, 1);
      p.noStroke();
    };

    p.draw = () => {
      p.background(0, 0, 8);
      const t = p.frameCount * 0.02;

      for (let x = 0; x < p.width; x += 4) {
        for (let y = 0; y < p.height; y += 4) {
          const nx = x / p.width;
          const ny = y / p.height;
          const wave1 = p.sin(nx * 6 + t) * 0.5 + 0.5;
          const wave2 = p.cos(ny * 4 + t * 0.7) * 0.5 + 0.5;
          const wave3 = p.sin((nx + ny) * 5 + t * 1.3) * 0.5 + 0.5;

          const hue = (wave1 * 120 + wave2 * 120 + wave3 * 120) % 360;
          const sat = 70 + wave3 * 30;
          const bri = 40 + wave1 * 50 + wave2 * 10;
          const alpha = 0.8 + wave3 * 0.2;

          p.fill(hue, sat, bri, alpha);
          p.rect(x, y, 4, 4);
        }
      }
    };
  },
};

const noiseField: SketchDef = {
  id: "noise-field",
  name: "Noise Field",
  description: "Perlin noise flow field with color mapping",
  sketch: (p: p5) => {
    const particles: { x: number; y: number; vx: number; vy: number }[] = [];

    p.setup = () => {
      p.createCanvas(600, 400);
      p.colorMode(p.HSB, 360, 100, 100, 1);
      p.background(0, 0, 8);

      for (let i = 0; i < 500; i++) {
        particles.push({
          x: p.random(p.width),
          y: p.random(p.height),
          vx: 0,
          vy: 0,
        });
      }
    };

    p.draw = () => {
      p.background(0, 0, 8, 0.02);
      const t = p.frameCount * 0.003;

      for (const pt of particles) {
        const angle = p.noise(pt.x * 0.005, pt.y * 0.005, t) * p.TWO_PI * 2;
        pt.vx = p.cos(angle) * 1.5;
        pt.vy = p.sin(angle) * 1.5;
        pt.x += pt.vx;
        pt.y += pt.vy;

        if (pt.x < 0 || pt.x > p.width || pt.y < 0 || pt.y > p.height) {
          pt.x = p.random(p.width);
          pt.y = p.random(p.height);
        }

        const hue = (p.noise(pt.x * 0.01, pt.y * 0.01) * 200 + 140) % 360;
        p.stroke(hue, 80, 90, 0.15);
        p.strokeWeight(1.5);
        p.point(pt.x, pt.y);
      }
    };
  },
};

const shaderSimulated: SketchDef = {
  id: "shader-gradient",
  name: "Shader Gradient",
  description: "GPU-style gradient simulation (shader/p5.strands pattern)",
  sketch: (p: p5) => {
    p.setup = () => {
      p.createCanvas(600, 400);
      p.pixelDensity(1);
      p.noStroke();
    };

    p.draw = () => {
      p.loadPixels();
      const t = p.frameCount * 0.015;

      for (let y = 0; y < p.height; y++) {
        for (let x = 0; x < p.width; x++) {
          const u = x / p.width;
          const v = y / p.height;

          const d = p.sqrt((u - 0.5) ** 2 + (v - 0.5) ** 2);
          const ring = p.sin(d * 20 - t * 3) * 0.5 + 0.5;
          const spiral = p.sin(p.atan2(v - 0.5, u - 0.5) * 3 + t * 2) * 0.5 + 0.5;

          const r = Math.floor(ring * 200 + spiral * 55);
          const g = Math.floor(spiral * 150 + (1 - d) * 100);
          const b = Math.floor((1 - ring) * 180 + d * 75);
          const a = 255;

          const idx = (y * p.width + x) * 4;
          p.pixels[idx] = r;
          p.pixels[idx + 1] = g;
          p.pixels[idx + 2] = b;
          p.pixels[idx + 3] = a;
        }
      }
      p.updatePixels();
    };
  },
};

const radialPulse: SketchDef = {
  id: "radial-pulse",
  name: "Radial Pulse",
  description: "Pulsating radial shapes with transparency",
  sketch: (p: p5) => {
    p.setup = () => {
      p.createCanvas(600, 400);
      p.colorMode(p.HSB, 360, 100, 100, 1);
      p.noStroke();
    };

    p.draw = () => {
      p.background(240, 30, 10);
      const t = p.frameCount * 0.03;

      for (let i = 0; i < 8; i++) {
        const angle = (p.TWO_PI / 8) * i + t * 0.3;
        const cx = p.width / 2 + p.cos(angle) * 120;
        const cy = p.height / 2 + p.sin(angle) * 80;
        const pulse = p.sin(t + i * 0.8) * 0.5 + 0.5;

        for (let r = 80; r > 0; r -= 4) {
          const hue = (i * 45 + r * 2 + p.frameCount) % 360;
          const alpha = (r / 80) * 0.3 * pulse;
          p.fill(hue, 80, 90, alpha);
          p.ellipse(cx, cy, r * 2 * (0.5 + pulse * 0.5));
        }
      }
    };
  },
};

const colorWheel: SketchDef = {
  id: "color-wheel",
  name: "Color Wheel",
  description: "HSB color wheel with rotating highlight",
  sketch: (p: p5) => {
    p.setup = () => {
      p.createCanvas(600, 400);
      p.colorMode(p.HSB, 360, 100, 100, 1);
      p.noStroke();
    };

    p.draw = () => {
      p.background(0, 0, 5);
      const cx = p.width / 2;
      const cy = p.height / 2;
      const maxR = 160;
      const t = p.frameCount * 0.01;

      for (let a = 0; a < 360; a += 1) {
        for (let r = 20; r < maxR; r += 2) {
          const hue = (a + p.frameCount * 0.3) % 360;
          const sat = p.map(r, 20, maxR, 10, 100);
          const bri = p.map(r, 20, maxR, 90, 60);
          const highlight = p.sin(p.radians(a) * 3 + t * 4) * 0.5 + 0.5;
          const alpha = 0.7 + highlight * 0.3;

          p.fill(hue, sat, bri, alpha);
          const x = cx + p.cos(p.radians(a)) * r;
          const y = cy + p.sin(p.radians(a)) * r;
          p.ellipse(x, y, 4, 4);
        }
      }

      // Center glow
      for (let r = 30; r > 0; r -= 2) {
        const bri = p.map(r, 0, 30, 100, 40);
        p.fill(0, 0, bri, 0.15);
        p.ellipse(cx, cy, r * 2);
      }
    };
  },
};

const perlinNoiseField: SketchDef = {
  id: "perlin-noise-field",
  name: "Perlin Noise Field",
  description: "Dense Perlin noise visualization with color mapping",
  sketch: (p: p5) => {
    p.setup = () => {
      p.createCanvas(600, 400);
      p.pixelDensity(1);
      p.noStroke();
    };

    p.draw = () => {
      p.loadPixels();
      const t = p.frameCount * 0.008;
      const scale = 0.008;

      for (let y = 0; y < p.height; y++) {
        for (let x = 0; x < p.width; x++) {
          const n1 = p.noise(x * scale, y * scale, t);
          const n2 = p.noise(x * scale + 100, y * scale + 100, t * 0.7);
          const n3 = p.noise(x * scale * 2, y * scale * 2, t * 1.3);

          const r = Math.floor(n1 * 180 + n3 * 75);
          const g = Math.floor(n2 * 120 + n1 * 80);
          const b = Math.floor(n3 * 200 + n2 * 55);

          const idx = (y * p.width + x) * 4;
          p.pixels[idx] = r;
          p.pixels[idx + 1] = g;
          p.pixels[idx + 2] = b;
          p.pixels[idx + 3] = 255;
        }
      }
      p.updatePixels();
    };
  },
};

const shaderSimulation: SketchDef = {
  id: "shader-simulation",
  name: "Shader Simulation",
  description: "Fragment shader-style plasma with warping",
  sketch: (p: p5) => {
    p.setup = () => {
      p.createCanvas(600, 400);
      p.pixelDensity(1);
      p.noStroke();
    };

    p.draw = () => {
      p.loadPixels();
      const t = p.frameCount * 0.02;

      for (let y = 0; y < p.height; y++) {
        for (let x = 0; x < p.width; x++) {
          const u = x / p.width;
          const v = y / p.height;

          // Plasma-style shader
          const v1 = p.sin(u * 10 + t);
          const v2 = p.sin(10 * (u * p.sin(t / 2) + v * p.cos(t / 3)) + t);
          const cx = u + 0.5 * p.sin(t / 5);
          const cy = v + 0.5 * p.cos(t / 3);
          const v3 = p.sin(p.sqrt(100 * (cx * cx + cy * cy)) + t);
          const vf = (v1 + v2 + v3) / 3;

          const r = Math.floor((p.sin(vf * p.PI) * 0.5 + 0.5) * 255);
          const g = Math.floor((p.cos(vf * p.PI + t * 0.3) * 0.5 + 0.5) * 200);
          const b = Math.floor((p.sin(vf * p.PI * 2 + 2.094) * 0.5 + 0.5) * 255);

          const idx = (y * p.width + x) * 4;
          p.pixels[idx] = r;
          p.pixels[idx + 1] = g;
          p.pixels[idx + 2] = b;
          p.pixels[idx + 3] = 255;
        }
      }
      p.updatePixels();
    };
  },
};

export const sketches: SketchDef[] = [
  colorWaves,
  noiseField,
  shaderSimulated,
  radialPulse,
  colorWheel,
  perlinNoiseField,
  shaderSimulation,
];
