import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UnidadeAcademica, UnidadeAcademicaService } from '../../core';
import { TableColumn, UiInputSearch, UiTable } from '../../shared';

@Component({
  selector: 'app-unidades-academicas',
  standalone: true,
  imports: [FormsModule, UiInputSearch, UiTable],
  template: `
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-semibold text-gray-800">Unidades Acadêmicas</h1>
    </div>

    <div class="mb-4">
      <ui-input-search
        placeholder="Buscar por nome ou sigla..."
        [(ngModel)]="searchValue"
        (ngModelChange)="onSearch($event)"
      />
    </div>

    <ui-table [columns]="columns" [data]="filteredUnidades()" />
  `,
})
export class UnidadesAcademicas implements OnInit {
  private unidadeAcademicaService = inject(UnidadeAcademicaService);

  unidades = signal<UnidadeAcademica[]>([]);
  searchTerm = signal('');
  searchValue = '';

  columns: TableColumn[] = [
    { field: 'nome', header: 'Nome', sortable: true },
    { field: 'sigla', header: 'Sigla', sortable: true },
  ];

  ngOnInit(): void {
    this.loadUnidades();
  }

  onSearch(term: string): void {
    this.searchTerm.set(term);
  }

  filteredUnidades = computed(() => {
    const term = this.normalize(this.searchTerm());
    if (!term) return this.unidades();

    return this.unidades().filter(u =>
      [u.nome, u.sigla].some(value => this.normalize(value).includes(term))
    );
  });

  private loadUnidades(): void {
    this.unidadeAcademicaService.getAll().subscribe({
      next: data => this.unidades.set(data),
    });
  }

  private normalize(value: string | null | undefined): string {
    return (value ?? '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();
  }
}
