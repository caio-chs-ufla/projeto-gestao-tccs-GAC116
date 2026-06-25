import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ConfirmDialog } from 'primeng/confirmdialog';
import {
  UiButton,
  UiInput,
  UiInputSearch,
  UiSelect,
  UiTable,
  UiDialog,
  TableColumn,
} from '../../shared';
import { AlunoService, CursoService, Aluno, Curso } from '../../core';
import { AlunoFormService } from './aluno-form.service';

@Component({
  selector: 'app-alunos',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    ConfirmDialog,
    UiButton,
    UiInput,
    UiInputSearch,
    UiSelect,
    UiTable,
    UiDialog,
  ],
  providers: [AlunoFormService, ConfirmationService],
  template: `
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-semibold text-gray-800">Alunos</h1>
      <ui-button label="Adicionar Aluno" icon="pi pi-plus" (clicked)="openCreate()" />
    </div>

    <!-- Filtros -->
    <div class="mb-4">
      <ui-input-search
        placeholder="Buscar por nome ou matrícula..."
        [(ngModel)]="searchValue"
        (ngModelChange)="onSearch($event)"
      />
    </div>

    <!-- Tabela -->
    <ui-table [columns]="columns" [data]="alunosEnriquecidos()">
      <ng-template #rowActions let-row>
        <div class="flex gap-1">
          <ui-button icon="pi pi-pencil" [text]="true" severity="secondary" (clicked)="openEdit(row)" />
          <ui-button icon="pi pi-trash" [text]="true" severity="danger" (clicked)="onDelete(row)" />
        </div>
      </ng-template>
    </ui-table>

    <!-- Dialog create/edit -->
    <ui-dialog
      [header]="editingId() ? 'Editar Aluno' : 'Adicionar Aluno'"
      [visible]="dialogVisible()"
      (visibleChange)="dialogVisible.set($event)"
      width="560px"
    >
      <form [formGroup]="formService.form" class="flex flex-col gap-4">
        <!-- nome -->
        <div class="flex flex-col gap-1">
          <label class="text-sm font-medium text-gray-700">
            Nome <span class="text-red-500">*</span>
          </label>
          <ui-input placeholder="Nome completo" [formControl]="formService.form.controls.nome" />
          @if (formService.form.controls.nome.invalid && formService.form.controls.nome.touched) {
            <small class="text-red-500">Campo obrigatório</small>
          }
        </div>

        <!-- matricula -->
        <div class="flex flex-col gap-1">
          <label class="text-sm font-medium text-gray-700">
            Matrícula <span class="text-red-500">*</span>
          </label>
          <ui-input placeholder="Ex: 202312345" [formControl]="formService.form.controls.matricula" />
          @if (formService.form.controls.matricula.invalid && formService.form.controls.matricula.touched) {
            <small class="text-red-500">Campo obrigatório</small>
          }
        </div>

        <!-- curso -->
        <div class="flex flex-col gap-1">
          <label class="text-sm font-medium text-gray-700">
            Curso <span class="text-red-500">*</span>
          </label>
          <ui-select
            [options]="cursosOptions()"
            placeholder="Selecione o curso"
            [formControl]="formService.form.controls.curso"
          />
          @if (formService.form.controls.curso.invalid && formService.form.controls.curso.touched) {
            <small class="text-red-500">Campo obrigatório</small>
          }
        </div>
      </form>

      <!-- Footer do dialog -->
      <div class="flex justify-end gap-2 pt-4 mt-4 border-t border-gray-200">
        <ui-button
          label="Cancelar"
          severity="secondary"
          [outlined]="true"
          (clicked)="dialogVisible.set(false)"
        />
        <ui-button label="Salvar" [loading]="saving()" (clicked)="onSave()" />
      </div>
    </ui-dialog>

    <p-confirmdialog />
  `,
})
export class Alunos implements OnInit {
  private alunoService = inject(AlunoService);
  private cursoService = inject(CursoService);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);
  formService = inject(AlunoFormService);

  alunos = signal<Aluno[]>([]);
  cursos = signal<Curso[]>([]);
  saving = signal(false);
  dialogVisible = signal(false);
  editingId = signal<number | null>(null);
  searchTerm = signal('');

  searchValue = '';

  alunosEnriquecidos = computed(() =>
    this.alunos().map(a => ({
      ...a,
      curso_nome: this.cursos().find(c => c.id === a.curso)?.nome ?? '—',
    }))
  );

  cursosOptions = computed(() =>
    this.cursos().map(c => ({ label: c.nome, value: c.id }))
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

  openCreate(): void {
    this.editingId.set(null);
    this.formService.load();
    this.dialogVisible.set(true);
  }

  openEdit(row: any): void {
    this.editingId.set(row.id);
    this.formService.load(row as Aluno);
    this.dialogVisible.set(true);
  }

  onSave(): void {
    if (this.formService.form.invalid) {
      this.formService.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    this.formService.submit(this.editingId() ?? undefined).subscribe({
      next: () => {
        this.saving.set(false);
        this.dialogVisible.set(false);
        this.loadAlunos();
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Aluno salvo com sucesso!',
        });
      },
      error: () => {
        this.saving.set(false);
      },
    });
  }

  onDelete(row: any): void {
    this.confirmationService.confirm({
      message: `Deseja realmente excluir o aluno "${row.nome}"?`,
      header: 'Confirmar exclusão',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Excluir',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.alunoService.delete(row.id).subscribe({
          next: () => {
            this.loadAlunos();
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Aluno excluído com sucesso!',
            });
          },
        });
      },
    });
  }
}
