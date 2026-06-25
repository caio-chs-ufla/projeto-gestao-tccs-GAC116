import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface NavItem {
  path: string;
  label: string;
  icon: string;
  exact?: boolean;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <aside class="w-64 h-screen bg-white border-r border-gray-200 flex flex-col flex-shrink-0">
      <div class="p-6 border-b border-gray-200">
        <h2 class="text-base font-bold text-gray-800 leading-tight">Gestão de TCCs</h2>
        <p class="text-xs text-gray-400 mt-1">GAC116 — 2026/1</p>
      </div>

      <nav class="flex-1 p-3 overflow-y-auto">
        <ul class="space-y-0.5">
          @for (item of navItems; track item.path) {
            <li>
              <a
                [routerLink]="item.path"
                routerLinkActive="bg-blue-50 text-blue-600 font-semibold"
                [routerLinkActiveOptions]="{ exact: !!item.exact }"
                class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors text-sm"
              >
                <i [class]="item.icon + ' text-base w-4 text-center'"></i>
                <span>{{ item.label }}</span>
              </a>
            </li>
          }
        </ul>
      </nav>
    </aside>
  `,
})
export class Sidebar {
  readonly navItems: NavItem[] = [
    { path: 'dashboard', label: 'Dashboard', icon: 'pi pi-home', exact: true },
    { path: 'tccs', label: 'TCCs', icon: 'pi pi-book' },
    { path: 'alunos', label: 'Alunos', icon: 'pi pi-users' },
    { path: 'professores', label: 'Professores', icon: 'pi pi-user' },
    { path: 'cursos', label: 'Cursos', icon: 'pi pi-graduation-cap' },
    { path: 'departamentos', label: 'Departamentos', icon: 'pi pi-building' },
    { path: 'unidades-academicas', label: 'Unidades', icon: 'pi pi-sitemap' },
  ];
}
