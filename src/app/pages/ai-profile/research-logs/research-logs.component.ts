import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { gsap } from 'gsap';
import { animateOnScroll } from '../reveal-anim';

interface LogEntry {
  category: string;
  title: string;
  description: string;
  readingTime: string;
  tags: string[];
}

@Component({
  selector: 'app-research-logs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './research-logs.component.html',
  styleUrl: './research-logs.component.scss'
})
export class ResearchLogsComponent implements AfterViewInit, OnDestroy {
  private observer: IntersectionObserver | null = null;

  logs: LogEntry[] = [
    {
      category: 'OBSERVABILITY',
      title: 'Building AI-driven Anomaly Detection Pipelines',
      description: 'A deep dive into designing real-time anomaly detection systems that scale across distributed infrastructure.',
      readingTime: '8 min read',
      tags: ['Monitoring', 'ML', 'Architecture'],
    },
    {
      category: 'AGENTS',
      title: 'Multi-Agent Orchestration with LangGraph',
      description: 'Patterns for coordinating specialized agents with shared memory and human-in-the-loop approval gates.',
      readingTime: '12 min read',
      tags: ['LangGraph', 'Python', 'Agents'],
    },
    {
      category: 'SYSTEM DESIGN',
      title: 'Observability-First ML Pipeline Architecture',
      description: 'Why treating ML pipelines as observable systems reduces debugging time from days to minutes.',
      readingTime: '6 min read',
      tags: ['OpenTelemetry', 'MLOps', 'Architecture'],
    },
    {
      category: 'UX',
      title: 'Designing AI Interfaces for High-Stakes Decisions',
      description: 'UX principles for building interfaces that help humans trust, verify, and act on AI recommendations.',
      readingTime: '10 min read',
      tags: ['AI UX', 'Angular', 'Design'],
    },
  ];

  ngAfterViewInit() {
    const el = document.querySelector('.logs-section');
    if (el) {
      this.observer = animateOnScroll(
        el,
        '.log-entry',
        { x: -30, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.6, stagger: 0.15, ease: 'power3.out' },
      );
    }
  }

  ngOnDestroy() {
    this.observer?.disconnect();
  }
}
