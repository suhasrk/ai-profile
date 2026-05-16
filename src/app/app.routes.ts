import { Routes } from '@angular/router';
import { AiProfileComponent } from './pages/ai-profile/ai-profile.component';

export const routes: Routes = [
  { path: '', component: AiProfileComponent },
  { path: '**', redirectTo: '' }
];
