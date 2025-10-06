/**
 * DotGrid - Interactive animated dot grid background
 * Vanilla JS implementation (no React required)
 * Requires GSAP library with InertiaPlugin
 */

class DotGrid {
  constructor(container, options = {}) {
    // Default options
    this.options = {
      dotSize: options.dotSize || 10,
      gap: options.gap || 15,
      baseColor: options.baseColor || '#0a5f7a',
      activeColor: options.activeColor || '#ff6b35',
      proximity: options.proximity || 120,
      speedTrigger: options.speedTrigger || 100,
      shockRadius: options.shockRadius || 250,
      shockStrength: options.shockStrength || 5,
      maxSpeed: options.maxSpeed || 5000,
      resistance: options.resistance || 750,
      returnDuration: options.returnDuration || 1.5,
      opacity: options.opacity || 0.6
    };

    this.container = container;
    this.wrapper = null;
    this.canvas = null;
    this.ctx = null;
    this.dots = [];
    this.pointer = {
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      speed: 0,
      lastTime: 0,
      lastX: 0,
      lastY: 0
    };

    this.rafId = null;
    this.resizeObserver = null;
    
    this.baseRgb = this.hexToRgb(this.options.baseColor);
    this.activeRgb = this.hexToRgb(this.options.activeColor);
    
    this.init();
  }

  hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  }

  throttle(func, limit) {
    let lastCall = 0;
    return (...args) => {
      const now = performance.now();
      if (now - lastCall >= limit) {
        lastCall = now;
        func.apply(this, args);
      }
    };
  }

  init() {
    // Create wrapper and canvas
    this.wrapper = document.createElement('div');
    this.wrapper.className = 'dot-grid__wrap';
    this.wrapper.style.cssText = 'width: 100%; height: 100%; position: relative;';
    
    this.canvas = document.createElement('canvas');
    this.canvas.className = 'dot-grid__canvas';
    this.canvas.style.cssText = `position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; opacity: ${this.options.opacity};`;
    
    this.wrapper.appendChild(this.canvas);
    this.container.appendChild(this.wrapper);
    
    this.ctx = this.canvas.getContext('2d');
    
    // Build initial grid
    this.buildGrid();
    
    // Start animation loop
    this.startAnimation();
    
    // Setup event listeners
    this.setupEventListeners();
    
    // Setup resize observer
    this.setupResizeObserver();
  }

  buildGrid() {
    if (!this.wrapper || !this.canvas) return;
    
    const { width, height } = this.wrapper.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    
    this.canvas.width = width * dpr;
    this.canvas.height = height * dpr;
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;
    
    if (this.ctx) {
      this.ctx.scale(dpr, dpr);
    }
    
    const { dotSize, gap } = this.options;
    const cols = Math.floor((width + gap) / (dotSize + gap));
    const rows = Math.floor((height + gap) / (dotSize + gap));
    const cell = dotSize + gap;
    
    const gridW = cell * cols - gap;
    const gridH = cell * rows - gap;
    
    const extraX = width - gridW;
    const extraY = height - gridH;
    
    const startX = extraX / 2 + dotSize / 2;
    const startY = extraY / 2 + dotSize / 2;
    
    this.dots = [];
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const cx = startX + x * cell;
        const cy = startY + y * cell;
        this.dots.push({
          cx,
          cy,
          xOffset: 0,
          yOffset: 0,
          _inertiaApplied: false
        });
      }
    }
  }

  draw() {
    if (!this.canvas || !this.ctx) return;
    
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    const { x: px, y: py } = this.pointer;
    const proxSq = this.options.proximity * this.options.proximity;
    
    for (const dot of this.dots) {
      const ox = dot.cx + dot.xOffset;
      const oy = dot.cy + dot.yOffset;
      const dx = dot.cx - px;
      const dy = dot.cy - py;
      const dsq = dx * dx + dy * dy;
      
      let style = this.options.baseColor;
      
      if (dsq <= proxSq) {
        const dist = Math.sqrt(dsq);
        const t = 1 - dist / this.options.proximity;
        const r = Math.round(this.baseRgb.r + (this.activeRgb.r - this.baseRgb.r) * t);
        const g = Math.round(this.baseRgb.g + (this.activeRgb.g - this.baseRgb.g) * t);
        const b = Math.round(this.baseRgb.b + (this.activeRgb.b - this.baseRgb.b) * t);
        style = `rgb(${r},${g},${b})`;
      }
      
      this.ctx.beginPath();
      this.ctx.arc(ox, oy, this.options.dotSize / 2, 0, Math.PI * 2);
      this.ctx.fillStyle = style;
      this.ctx.fill();
    }
    
    this.rafId = requestAnimationFrame(() => this.draw());
  }

  startAnimation() {
    this.draw();
  }

  handleMouseMove(e) {
    const now = performance.now();
    const pr = this.pointer;
    const dt = pr.lastTime ? now - pr.lastTime : 16;
    const dx = e.clientX - pr.lastX;
    const dy = e.clientY - pr.lastY;
    
    let vx = (dx / dt) * 1000;
    let vy = (dy / dt) * 1000;
    let speed = Math.hypot(vx, vy);
    
    if (speed > this.options.maxSpeed) {
      const scale = this.options.maxSpeed / speed;
      vx *= scale;
      vy *= scale;
      speed = this.options.maxSpeed;
    }
    
    pr.lastTime = now;
    pr.lastX = e.clientX;
    pr.lastY = e.clientY;
    pr.vx = vx;
    pr.vy = vy;
    pr.speed = speed;
    
    const rect = this.canvas.getBoundingClientRect();
    pr.x = e.clientX - rect.left;
    pr.y = e.clientY - rect.top;
    
    // Apply inertia effect on fast movement
    if (typeof gsap !== 'undefined' && gsap.plugins.inertia) {
      for (const dot of this.dots) {
        const dist = Math.hypot(dot.cx - pr.x, dot.cy - pr.y);
        if (speed > this.options.speedTrigger && dist < this.options.proximity && !dot._inertiaApplied) {
          dot._inertiaApplied = true;
          gsap.killTweensOf(dot);
          
          const pushX = dot.cx - pr.x + vx * 0.005;
          const pushY = dot.cy - pr.y + vy * 0.005;
          
          gsap.to(dot, {
            inertia: {
              xOffset: pushX,
              yOffset: pushY,
              resistance: this.options.resistance
            },
            onComplete: () => {
              gsap.to(dot, {
                xOffset: 0,
                yOffset: 0,
                duration: this.options.returnDuration,
                ease: 'elastic.out(1,0.75)'
              });
              dot._inertiaApplied = false;
            }
          });
        }
      }
    }
  }

  handleClick(e) {
    if (typeof gsap === 'undefined') return;
    
    const rect = this.canvas.getBoundingClientRect();
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;
    
    for (const dot of this.dots) {
      const dist = Math.hypot(dot.cx - cx, dot.cy - cy);
      
      if (dist < this.options.shockRadius && !dot._inertiaApplied) {
        dot._inertiaApplied = true;
        gsap.killTweensOf(dot);
        
        const falloff = Math.max(0, 1 - dist / this.options.shockRadius);
        const pushX = (dot.cx - cx) * this.options.shockStrength * falloff;
        const pushY = (dot.cy - cy) * this.options.shockStrength * falloff;
        
        if (gsap.plugins.inertia) {
          gsap.to(dot, {
            inertia: {
              xOffset: pushX,
              yOffset: pushY,
              resistance: this.options.resistance
            },
            onComplete: () => {
              gsap.to(dot, {
                xOffset: 0,
                yOffset: 0,
                duration: this.options.returnDuration,
                ease: 'elastic.out(1,0.75)'
              });
              dot._inertiaApplied = false;
            }
          });
        } else {
          // Fallback without inertia plugin
          gsap.to(dot, {
            xOffset: pushX,
            yOffset: pushY,
            duration: 0.3,
            ease: 'power2.out',
            onComplete: () => {
              gsap.to(dot, {
                xOffset: 0,
                yOffset: 0,
                duration: this.options.returnDuration,
                ease: 'elastic.out(1,0.75)'
              });
              dot._inertiaApplied = false;
            }
          });
        }
      }
    }
  }

  setupEventListeners() {
    this.throttledMouseMove = this.throttle((e) => this.handleMouseMove(e), 50);
    this.boundClick = (e) => this.handleClick(e);
    
    window.addEventListener('mousemove', this.throttledMouseMove, { passive: true });
    window.addEventListener('click', this.boundClick);
  }

  setupResizeObserver() {
    if ('ResizeObserver' in window) {
      this.resizeObserver = new ResizeObserver(() => this.buildGrid());
      this.resizeObserver.observe(this.wrapper);
    } else {
      this.boundResize = () => this.buildGrid();
      window.addEventListener('resize', this.boundResize);
    }
  }

  destroy() {
    // Cancel animation frame
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
    }
    
    // Remove event listeners
    window.removeEventListener('mousemove', this.throttledMouseMove);
    window.removeEventListener('click', this.boundClick);
    
    // Disconnect resize observer
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    } else if (this.boundResize) {
      window.removeEventListener('resize', this.boundResize);
    }
    
    // Kill all GSAP animations
    if (typeof gsap !== 'undefined') {
      for (const dot of this.dots) {
        gsap.killTweensOf(dot);
      }
    }
    
    // Remove DOM elements
    if (this.wrapper && this.wrapper.parentNode) {
      this.wrapper.parentNode.removeChild(this.wrapper);
    }
  }
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DotGrid;
}
