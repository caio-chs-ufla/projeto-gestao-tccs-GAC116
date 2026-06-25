import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  Departamento,
  DepartamentoService,
  UnidadeAcademica,
  UnidadeAcademicaService,
} from '../../core';
import { TableColumn, UiInputSearch, UiTable } from '../../shared';

@Component({
  selector: 'app-departamentos',
  standalone: true,
  imports: [FormsModule, UiInputSearch, UiTable],
  template: `
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-semibold text-gray-800">Departamentos</h1>
    </div>

    <div class="mb-4">
      <ui-input-search
        placeholder="Buscar por nome, sigla ou unidade..."
        [(ngModel)]="searchValue"
        (ngModelChange)="onSearch($event)"
      />
    </div>

    <ui-table [columns]="columns" [data]="departamentosEnriquecidos()" />
  `,
})
export class Departamentos implements OnInit {
  private departamentoService = inject(DepartamentoService);
  private unidadeAcademicaService = inject(UnidadeAcademicaService);

  departamentos = signal<Departamento[]>([]);
  unidades = signal<UnidadeAcademica[]>([]);
  searchValue = '';

  departamentosEnriquecidos = computed(() =>
    this.departamentos().map(d => {
      const unidade = this.unidades().find(u => u.id === d.unidade_academica);
      return {
        ...d,
        unidade_nome: unidade?.nome ?? '-',
        unidade_sigla: unidade?.sigla ?? '-',
      };
    })
  );

  columns: TableColumn[] = [
    { field: 'nome', header: 'Nome', sortable: true },
    { field: 'sigla', header: 'Sigla', sortable: true },
    { field: 'unidade_nome', header: 'Unidade Acadêmica', sortable: true },
    { field: 'unidade_sigla', header: 'Sigla da Unidade', sortable: true },
  ];

  ngOnInit(): void {
    this.loadDepartamentos();
    this.loadUnidades();
  }

  onSearch(term: string): void {
    this.loadDepartamentos(term);
  }

  private loadDepartamentos(search?: string): void {
    this.departamentoService.getAll(search || undefined).subscribe({
      next: data => this.departamentos.set(data),
    });
  }

  private loadUnidades(): void {
    this.unidadeAcademicaService.getAll().subscribe({
      next: data => this.unidades.set(data),
    });
  }
}
