import { gsap } from 'gsap';

export function animateOnScroll(
  trigger: Element,
  targets: gsap.TweenTarget,
  fromVars: gsap.TweenVars,
  toVars: gsap.TweenVars,
  options?: { threshold?: number; rootMargin?: string }
) {
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        gsap.fromTo(targets, fromVars, {
          ...toVars,
          overwrite: true,
          clearProps: 'transform',
        });
        observer.disconnect();
      }
    },
    { threshold: options?.threshold ?? 0.1, rootMargin: options?.rootMargin ?? '0px 0px -50px 0px' }
  );
  observer.observe(trigger);
  return observer;
}
