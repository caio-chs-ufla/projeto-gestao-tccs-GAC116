import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UiInputSearch, UiTable, TableColumn } from '../../shared';
import { ProfessorService, DepartamentoService, Professor, Departamento } from '../../core';

@Component({
  selector: 'app-professores',
  standalone: true,
  imports: [FormsModule, UiInputSearch, UiTable],
  template: `
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-semibold text-gray-800">Professores</h1>
    </div>

    <div class="mb-4">
      <ui-input-search
        placeholder="Buscar por nome..."
        [(ngModel)]="searchValue"
        (ngModelChange)="onSearch($event)"
      />
    </div>

    <ui-table [columns]="columns" [data]="professoresEnriquecidos()" />
  `,
})
export class Professores implements OnInit {
  private professorService = inject(ProfessorService);
  private departamentoService = inject(DepartamentoService);

  professores = signal<Professor[]>([]);
  departamentos = signal<Departamento[]>([]);
  searchTerm = signal('');
  searchValue = '';

  professoresEnriquecidos = computed(() =>
    this.professores().map(p => ({
      ...p,
      departamento_nome: this.departamentos().find(d => d.id === p.departamento)?.nome ?? '—',
    }))
  );

  columns: TableColumn[] = [
    { field: 'nome', header: 'Nome', sortable: true },
    { field: 'departamento_nome', header: 'Departamento', sortable: true },
  ];

  ngOnInit(): void {
    this.loadProfessores();
    this.loadDepartamentos();
  }

  loadProfessores(): void {
    this.professorService.getAll(this.searchTerm() || undefined).subscribe({
      next: (data) => this.professores.set(data),
    });
  }

  loadDepartamentos(): void {
    this.departamentoService.getAll().subscribe({
      next: (data) => this.departamentos.set(data),
    });
  }

  onSearch(term: string): void {
    this.searchTerm.set(term);
    this.loadProfessores();
  }
}
