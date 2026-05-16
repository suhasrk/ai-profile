import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { gsap } from 'gsap';
import { animateOnScroll } from '../reveal-anim';

@Component({
  selector: 'app-how-i-build',
  standalone: true,
  templateUrl: './how-i-build.component.html',
  styleUrl: './how-i-build.component.scss'
})
export class HowIBuildComponent implements AfterViewInit, OnDestroy {
  private observers: IntersectionObserver[] = [];

  ngAfterViewInit() {
    const section = document.querySelector('.architecture-section');
    if (section) {
      this.observers.push(animateOnScroll(
        section,
        '.arch-node',
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.6, stagger: 0.15, ease: 'back.out(1.7)' },
      ));
      this.observers.push(animateOnScroll(
        section,
        '.arch-connector-line',
        { scaleY: 0 },
        { scaleY: 1, transformOrigin: 'top center', duration: 0.4, stagger: 0.15, ease: 'power3.out' },
      ));
    }
  }

  ngOnDestroy() {
    this.observers.forEach(o => o.disconnect());
  }
}
