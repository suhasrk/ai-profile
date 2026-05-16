import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit, OnDestroy {
  private lenis: Lenis | null = null;

  ngOnInit() {
    this.lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
    });

    this.lenis.on('scroll', ScrollTrigger.update);
    (gsap as any).ticker.add((time: number) => {
      this.lenis?.raf(time * 1000);
    });
    (gsap as any).ticker.lagSmoothing(0);
  }

  ngOnDestroy() {
    this.lenis?.destroy();
  }
}
