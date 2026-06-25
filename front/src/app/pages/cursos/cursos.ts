import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CursoService, Curso } from '../../core';
import { TableColumn, UiInputSearch, UiTable } from '../../shared';

@Component({
  selector: 'app-cursos',
  standalone: true,
  imports: [FormsModule, UiInputSearch, UiTable],
  template: `
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-semibold text-gray-800">Cursos</h1>
    </div>

    <div class="mb-4">
      <ui-input-search
        placeholder="Buscar por nome, sigla ou código..."
        [(ngModel)]="searchValue"
        (ngModelChange)="onSearch($event)"
      />
    </div>

    <ui-table [columns]="columns" [data]="cursos()" />
  `,
})
export class Cursos implements OnInit {
  private cursoService = inject(CursoService);

  cursos = signal<Curso[]>([]);
  searchValue = '';

  columns: TableColumn[] = [
    { field: 'nome', header: 'Nome', sortable: true },
    { field: 'sigla', header: 'Sigla', sortable: true },
    { field: 'codigo', header: 'Código', sortable: true },
  ];

  ngOnInit(): void {
    this.loadCursos();
  }

  onSearch(term: string): void {
    this.loadCursos(term);
  }

  private loadCursos(search?: string): void {
    this.cursoService.getAll(search || undefined).subscribe({
      next: data => this.cursos.set(data),
    });
  }
}
