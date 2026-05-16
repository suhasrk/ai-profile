import { Component, OnInit, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-live-console',
  standalone: true,
  templateUrl: './live-console.component.html',
  styleUrl: './live-console.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LiveConsoleComponent implements OnInit, OnDestroy {
  lines: string[] = [];
  private currentIndex = 0;
  private timer: any;
  cycleCount = 0;

  constructor(private cdr: ChangeDetectorRef) {}

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
    this.typeNextLine();
  }

  ngOnDestroy() {
    clearTimeout(this.timer);
  }

  private typeNextLine() {
    if (this.currentIndex >= this.allLines.length) {
      this.currentIndex = 0;
      this.lines = [];
      this.cycleCount++;
      this.cdr.markForCheck();
      this.timer = setTimeout(() => this.typeNextLine(), 500);
      return;
    }

    const line = this.allLines[this.currentIndex];
    this.lines.push(line);
    this.currentIndex++;
    this.cdr.markForCheck();

    const delay = line.startsWith('> system status') ? 3000 :
                  line.includes('awaiting') ? 2500 :
                  line === '' ? 1500 : 800;

    this.timer = setTimeout(() => this.typeNextLine(), delay);
  }
}
