import { Component } from '@angular/core';
import { HeroComponent } from './hero/hero.component';
import { AiIdentityComponent } from './ai-identity/ai-identity.component';
import { HowIBuildComponent } from './how-i-build/how-i-build.component';
import { AiProjectsComponent } from './ai-projects/ai-projects.component';
import { HfSpacesComponent } from './hf-spaces/hf-spaces.component';
import { ResearchLogsComponent } from './research-logs/research-logs.component';
import { FooterComponent } from './footer/footer.component';

@Component({
  selector: 'app-ai-profile',
  standalone: true,
  imports: [
    HeroComponent,
    AiIdentityComponent,
    HowIBuildComponent,
    AiProjectsComponent,
    HfSpacesComponent,
    ResearchLogsComponent,
    FooterComponent,
  ],
  templateUrl: './ai-profile.component.html',
  styleUrl: './ai-profile.component.scss'
})
export class AiProfileComponent {
  activeTab: 'identity' | 'architecture' = 'identity';

  setActiveTab(tab: 'identity' | 'architecture') {
    this.activeTab = tab;
  }
}
