import { Routes } from '@angular/router';
import { MainLayout } from './layout/main-layout/main-layout';

export const routes: Routes = [
  {
    path: '',
    component: MainLayout,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/dashboard/dashboard').then(m => m.DashboardPage),
      },
      {
        path: 'alunos',
        loadComponent: () => import('./pages/alunos/alunos').then(m => m.Alunos),
      },
      {
        path: 'professores',
        loadComponent: () => import('./pages/professores/professores').then(m => m.Professores),
      },
      {
        path: 'cursos',
        loadComponent: () => import('./pages/cursos/cursos').then(m => m.Cursos),
      },
      {
        path: 'departamentos',
        loadComponent: () => import('./pages/departamentos/departamentos').then(m => m.Departamentos),
      },
      {
        path: 'unidades-academicas',
        loadComponent: () => import('./pages/unidades-academicas/unidades-academicas').then(m => m.UnidadesAcademicas),
      },
      {
        path: 'tccs',
        loadComponent: () => import('./pages/tccs/tccs').then(m => m.Tccs),
      },
    ],
  },
  { path: '**', redirectTo: 'dashboard' },
];
