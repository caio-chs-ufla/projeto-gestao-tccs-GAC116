import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UiInputSearch, UiTable, TableColumn } from '../../shared';
import { AlunoService, CursoService, Aluno, Curso } from '../../core';

@Component({
  selector: 'app-alunos',
  standalone: true,
  imports: [FormsModule, UiInputSearch, UiTable],
  template: `
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-semibold text-gray-800">Alunos</h1>
    </div>

    <div class="mb-4">
      <ui-input-search
        placeholder="Buscar por nome ou matrícula..."
        [(ngModel)]="searchValue"
        (ngModelChange)="onSearch($event)"
      />
    </div>

    <ui-table [columns]="columns" [data]="alunosEnriquecidos()" />
  `,
})
export class Alunos implements OnInit {
  private alunoService = inject(AlunoService);
  private cursoService = inject(CursoService);

  alunos = signal<Aluno[]>([]);
  cursos = signal<Curso[]>([]);
  searchTerm = signal('');
  searchValue = '';

  alunosEnriquecidos = computed(() =>
    this.alunos().map(a => ({
      ...a,
      curso_nome: this.cursos().find(c => c.id === a.curso)?.nome ?? '—',
    }))
  );

  columns: TableColumn[] = [
    { field: 'nome', header: 'Nome', sortable: true },
    { field: 'matricula', header: 'Matrícula', sortable: true },
    { field: 'curso_nome', header: 'Curso', sortable: true },
  ];

  ngOnInit(): void {
    this.loadAlunos();
    this.loadCursos();
  }

  loadAlunos(): void {
    this.alunoService.getAll(this.searchTerm() || undefined).subscribe({
      next: (data) => this.alunos.set(data),
    });
  }

  loadCursos(): void {
    this.cursoService.getAll().subscribe({
      next: (data) => this.cursos.set(data),
    });
  }

  onSearch(term: string): void {
    this.searchTerm.set(term);
    this.loadAlunos();
  }
}
