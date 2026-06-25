import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  template: `
    <div>
      <h1 class="text-2xl font-semibold text-gray-800 mb-1">Dashboard</h1>
      <p class="text-gray-500 text-sm">Bem-vindo ao sistema de gestão de TCCs.</p>
    </div>
  `,
})
export class DashboardPage {}
