import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from '../sidebar/sidebar';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, Sidebar],
  template: `
    <div class="flex h-screen bg-gray-50 overflow-hidden">
      <app-sidebar />
      <main class="flex-1 overflow-y-auto">
        <div class="p-8">
          <router-outlet />
        </div>
      </main>
    </div>
  `,
})
export class MainLayout {}
