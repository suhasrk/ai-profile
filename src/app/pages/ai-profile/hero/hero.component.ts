import { Component, OnInit, OnDestroy, ElementRef, ViewChild, AfterViewInit, ChangeDetectorRef, ChangeDetectionStrategy, NgZone } from '@angular/core';
import { gsap } from 'gsap';

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

@Component({
  selector: 'app-hero',
  standalone: true,
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeroComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('neuralCanvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('glow', { static: true }) glowRef!: ElementRef<HTMLDivElement>;
  @ViewChild('terminalBody', { static: true }) terminalBodyRef!: ElementRef<HTMLDivElement>;

  private ctx!: CanvasRenderingContext2D;
  private nodes: Node[] = [];
  private animationId!: number;
  private mouseX = -1000;
  private mouseY = -1000;
  private resizeObserver!: ResizeObserver;
  private mouseCleanup!: () => void;
  private viewObserver!: IntersectionObserver;
  private isVisible = true;
  private rafMouseId!: number;

  lines: string[] = [];
  private terminalIndex = 0;
  private terminalTimer: any;
  cycleCount = 0;

  constructor(private cdr: ChangeDetectorRef, private ngZone: NgZone) {}

  private allLines = [
    '> initializing agents...',
    '> connecting to orchestrator...',
    '> agents online: 3/3',
    '> anomaly detected in production-log-stream',
    '> confidence score: 94.2%',
    '> generating remediation plan...',
    '> plan: scale-down cache, restart consumer',
    '> awaiting human approval...',
    '> approval received. executing...',
    '> remediation complete. MTTR: 47s',
    '',
    '> system status: OPERATIONAL',
    '> monitoring...',
  ];

  ngOnInit() {
    this.initCanvas();
    this.initMouseTracking();
    this.initViewObserver();
    this.startNeuralAnimation();
    this.startTerminal();
  }

  ngAfterViewInit() {
    this.initHeroAnimations();
  }

  ngOnDestroy() {
    cancelAnimationFrame(this.animationId);
    cancelAnimationFrame(this.rafMouseId);
    this.resizeObserver?.disconnect();
    this.mouseCleanup?.();
    this.viewObserver?.disconnect();
    clearTimeout(this.terminalTimer);
  }

  private initCanvas() {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d')!;
    this.resizeCanvas();

    this.resizeObserver = new ResizeObserver(() => this.resizeCanvas());
    this.resizeObserver.observe(canvas.parentElement!);
  }

  private initViewObserver() {
    this.viewObserver = new IntersectionObserver(([entry]) => {
      this.isVisible = entry.isIntersecting;
      if (this.isVisible && !this.animationId) {
        this.startNeuralAnimation();
      }
    }, { threshold: 0.1 });
    this.viewObserver.observe(this.canvasRef.nativeElement.parentElement!);
  }

  private resizeCanvas() {
    const canvas = this.canvasRef.nativeElement;
    const parent = canvas.parentElement!;
    const dpr = Math.min(window.devicePixelRatio, 2);
    canvas.width = parent.clientWidth * dpr;
    canvas.height = parent.clientHeight * dpr;
    canvas.style.width = parent.clientWidth + 'px';
    canvas.style.height = parent.clientHeight + 'px';
    this.ctx.scale(dpr, dpr);
    this.initNodes();
  }

  private initNodes() {
    const canvas = this.canvasRef.nativeElement;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    const count = Math.floor((w * h) / 15000);
    this.nodes = Array.from({ length: Math.max(count, 40) }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      radius: Math.random() * 2 + 1,
    }));
  }

  private startNeuralAnimation() {
    const animate = () => {
      if (!this.isVisible) {
        this.animationId = 0;
        return;
      }
      this.ctx.clearRect(0, 0, this.canvasRef.nativeElement.clientWidth, this.canvasRef.nativeElement.clientHeight);
      this.updateNodes();
      this.drawConnections();
      this.animationId = requestAnimationFrame(animate);
    };
    this.animationId = requestAnimationFrame(animate);
  }

  private updateNodes() {
    const canvas = this.canvasRef.nativeElement;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;

    for (const node of this.nodes) {
      node.x += node.vx;
      node.y += node.vy;

      if (node.x < 0 || node.x > w) node.vx *= -1;
      if (node.y < 0 || node.y > h) node.vy *= -1;

      const dx = this.mouseX - node.x;
      const dy = this.mouseY - node.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 150) {
        node.vx -= dx * 0.0002;
        node.vy -= dy * 0.0002;
      }

      node.vx += (Math.random() - 0.5) * 0.01;
      node.vy += (Math.random() - 0.5) * 0.01;
      node.vx = Math.max(-0.5, Math.min(0.5, node.vx));
      node.vy = Math.max(-0.5, Math.min(0.5, node.vy));
    }
  }

  private drawConnections() {
    const ctx = this.ctx;
    const w = this.canvasRef.nativeElement.clientWidth;
    const h = this.canvasRef.nativeElement.clientHeight;

    for (let i = 0; i < this.nodes.length; i++) {
      const a = this.nodes[i];

      const dx = this.mouseX - a.x;
      const dy = this.mouseY - a.y;
      const distToMouse = Math.sqrt(dx * dx + dy * dy);
      const glowIntensity = Math.max(0, 1 - distToMouse / 200) * 0.8;

      ctx.beginPath();
      ctx.arc(a.x, a.y, a.radius + glowIntensity, 0, Math.PI * 2);
      ctx.fillStyle = glowIntensity > 0.1
        ? `rgba(0, 240, 255, ${0.5 + glowIntensity * 0.5})`
        : 'rgba(0, 240, 255, 0.35)';
      ctx.fill();

      for (let j = i + 1; j < this.nodes.length; j++) {
        const b = this.nodes[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 150) {
          const opacity = (1 - dist / 150) * 0.12;

          const mx = (a.x + b.x) / 2;
          const my = (a.y + b.y) / 2;
          const md = Math.sqrt((this.mouseX - mx) ** 2 + (this.mouseY - my) ** 2);
          const mouseGlow = Math.max(0, 1 - md / 200) * 0.5;

          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(0, 240, 255, ${opacity + mouseGlow})`;
          ctx.lineWidth = 0.5 + mouseGlow;
          ctx.stroke();
        }
      }
    }
  }

  private initMouseTracking() {
    const handleMouse = (e: MouseEvent) => {
      cancelAnimationFrame(this.rafMouseId);
      this.rafMouseId = requestAnimationFrame(() => {
        this.mouseX = e.clientX;
        this.mouseY = e.clientY;
      });
    };
    document.addEventListener('mousemove', handleMouse, { passive: true });
    this.mouseCleanup = () => document.removeEventListener('mousemove', handleMouse);
  }

  private startTerminal() {
    this.typeNextLine();
  }

  private typeNextLine() {
    if (this.terminalIndex >= this.allLines.length) {
      this.terminalIndex = 0;
      this.lines = [];
      this.cycleCount++;
      this.cdr.markForCheck();
      this.terminalTimer = setTimeout(() => this.typeNextLine(), 500);
      return;
    }

    const line = this.allLines[this.terminalIndex];
    this.lines.push(line);
    this.terminalIndex++;
    this.cdr.markForCheck();

    const delay = line.startsWith('> system status') ? 3000 :
                  line.includes('awaiting') ? 2500 :
                  line === '' ? 1500 : 800;

    this.terminalTimer = setTimeout(() => this.typeNextLine(), delay);
  }

  private initHeroAnimations() {
    this.ngZone.runOutsideAngular(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo('.hero-tagline', 
        { y: 30, opacity: 0, visibility: 'hidden' },
        { y: 0, opacity: 0.7, visibility: 'visible', duration: 0.8 }
      )
      .fromTo('.hero-name', 
        { y: 60, opacity: 0, visibility: 'hidden' },
        { y: 0, opacity: 1, visibility: 'visible', duration: 0.8 },
        '-=0.4'
      )
      .fromTo('.hero-name-accent', 
        { y: 60, opacity: 0, visibility: 'hidden' },
        { y: 0, opacity: 1, visibility: 'visible', duration: 0.8 },
        '-=0.6'
      )
      .fromTo('.hero-tagline-text', 
        { y: 20, opacity: 0, visibility: 'hidden' },
        { y: 0, opacity: 1, visibility: 'visible', duration: 0.6 },
        '-=0.4'
      )
      .fromTo('.hero-subtitle', 
        { y: 20, opacity: 0, visibility: 'hidden' },
        { y: 0, opacity: 1, visibility: 'visible', duration: 0.6 },
        '-=0.4'
      )
      .fromTo('.hero-cta', 
        { y: 20, opacity: 0, visibility: 'hidden' },
        { y: 0, opacity: 1, visibility: 'visible', duration: 0.5, stagger: 0.1 },
        '-=0.3'
      )
      .fromTo('.hero-scroll-hint', 
        { opacity: 0, visibility: 'hidden' },
        { opacity: 1, visibility: 'visible', duration: 0.4 },
        '-=0.2'
      );
    });
  }

  scrollToProjects() {
    const el = document.querySelector('app-ai-projects');
    el?.scrollIntoView({ behavior: 'smooth' });
  }

  scrollToLogs() {
    const el = document.querySelector('app-research-logs');
    el?.scrollIntoView({ behavior: 'smooth' });
  }
}
