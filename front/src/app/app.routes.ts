import { Routes } from '@angular/router';
import { MainLayout } from './layout/main-layout/main-layout';
import { DashboardPage } from './pages/dashboard/dashboard';
import { Alunos } from './pages/alunos/alunos';
import { Professores } from './pages/professores/professores';
import { Tccs } from './pages/tccs/tccs';

export const routes: Routes = [
  {
    path: '',
    component: MainLayout,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardPage },
      { path: 'alunos', component: Alunos },
      { path: 'professores', component: Professores },
      { path: 'tccs', component: Tccs },
    ],
  },
  { path: '**', redirectTo: 'dashboard' },
];
