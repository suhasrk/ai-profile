import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { gsap } from 'gsap';
import { animateOnScroll } from '../reveal-anim';

@Component({
  selector: 'app-ai-identity',
  standalone: true,
  templateUrl: './ai-identity.component.html',
  styleUrl: './ai-identity.component.scss'
})
export class AiIdentityComponent implements AfterViewInit, OnDestroy {
  private observer: IntersectionObserver | null = null;

  ngAfterViewInit() {
    const el = document.querySelector('.identity-section');
    if (el) {
      this.observer = animateOnScroll(
        el,
        '.identity-card',
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.12, ease: 'power3.out' },
      );
    }
  }

  ngOnDestroy() {
    this.observer?.disconnect();
  }
}
