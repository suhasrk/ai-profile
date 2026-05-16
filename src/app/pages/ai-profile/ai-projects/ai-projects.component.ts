import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { gsap } from 'gsap';
import { animateOnScroll } from '../reveal-anim';

interface Project {
  id: string;
  title: string;
  status: string;
  problem: string;
  architecture: string;
  aiFlow: string;
  techStack: string[];
  impact: string;
}

@Component({
  selector: 'app-ai-projects',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ai-projects.component.html',
  styleUrl: './ai-projects.component.scss'
})
export class AiProjectsComponent implements AfterViewInit, OnDestroy {
  private observer: IntersectionObserver | null = null;
  expandedIndex: number | null = null;

  projects: Project[] = [
    {
      id: 'PROJECT_01',
      title: 'AI Log Intelligence System',
      status: 'ACTIVE',
      problem: 'Engineering teams drown in log noise. Critical anomalies hide beneath mountains of routine events.',
      architecture: 'Streaming log ingestion → ML classifier → Anomaly scoring → Alert routing → Human-in-the-loop feedback',
      aiFlow: 'Logs are embedded via sentence transformers, clustered in real-time with online DBSCAN, and scored by a fine-tuned classifier. Low-confidence alerts route to human review, which feeds back into the model.',
      techStack: ['LangGraph', 'FastAPI', 'Angular', 'ClickHouse', 'Sentence Transformers'],
      impact: 'Reduced alert fatigue by 78% across 3 engineering teams. Mean time to detection dropped from 12min to 45s.',
    },
    {
      id: 'PROJECT_02',
      title: 'Multi-Agent Incident Commander',
      status: 'IN DEVELOPMENT',
      problem: 'Incident response requires coordinating across multiple tools, teams, and data sources under time pressure.',
      architecture: 'Planner Agent → Parallel Executors → Shared Evaluator → Memory Store → Human Approval Layer',
      aiFlow: 'A planner agent decomposes incidents into parallel investigation tasks. Worker agents execute probes across logs, metrics, and traces. An evaluator agent synthesizes findings and proposes remediation. Humans approve critical actions.',
      techStack: ['LangGraph', 'Python', 'Neo4j', 'Angular', 'WebSocket'],
      impact: 'Prototype cuts mean-time-to-resolution by 60% in controlled simulations. Designed for gradual autonomy escalation.',
    },
    {
      id: 'PROJECT_03',
      title: 'Observability-First AI Pipeline',
      status: 'COMPLETED',
      problem: 'ML pipelines operate as black boxes. When they fail, root cause analysis takes days.',
      architecture: 'Pipeline Runner → Metric Exporters → Trace Collector → Anomaly Detector → Dashboard',
      aiFlow: 'Every pipeline step emits structured telemetry. A trace collector correlates spans across executions. An anomaly detector compares current runs against historical patterns and flags regressions automatically.',
      techStack: ['Python', 'OpenTelemetry', 'Grafana', 'Prometheus', 'FastAPI'],
      impact: 'Cut pipeline debugging time from 2 days to 2 hours. Achieved 95% detection rate for data drift and model degradation.',
    },
  ];

  ngAfterViewInit() {
    const el = document.querySelector('.projects-section');
    if (el) {
      this.observer = animateOnScroll(
        el,
        '.project-entry',
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.2, ease: 'power3.out' },
      );
    }
  }

  ngOnDestroy() {
    this.observer?.disconnect();
  }

  toggleProject(index: number) {
    this.expandedIndex = this.expandedIndex === index ? null : index;
  }
}
