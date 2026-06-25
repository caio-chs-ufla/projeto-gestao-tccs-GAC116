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
import { ProfessorService, DepartamentoService, Professor, Departamento } from '../../core';
import { ProfessorFormService } from './professor-form.service';

@Component({
  selector: 'app-professores',
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
  providers: [ProfessorFormService, ConfirmationService],
  template: `
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-semibold text-gray-800">Professores</h1>
      <ui-button label="Adicionar Professor" icon="pi pi-plus" (clicked)="openCreate()" />
    </div>

    <!-- Filtros -->
    <div class="mb-4">
      <ui-input-search
        placeholder="Buscar por nome..."
        [(ngModel)]="searchValue"
        (ngModelChange)="onSearch($event)"
      />
    </div>

    <!-- Tabela -->
    <ui-table [columns]="columns" [data]="professoresEnriquecidos()">
      <ng-template #rowActions let-row>
        <div class="flex gap-1">
          <ui-button icon="pi pi-pencil" [text]="true" severity="secondary" (clicked)="openEdit(row)" />
          <ui-button icon="pi pi-trash" [text]="true" severity="danger" (clicked)="onDelete(row)" />
        </div>
      </ng-template>
    </ui-table>

    <!-- Dialog create/edit -->
    <ui-dialog
      [header]="editingId() ? 'Editar Professor' : 'Adicionar Professor'"
      [visible]="dialogVisible()"
      (visibleChange)="dialogVisible.set($event)"
      width="480px"
    >
      <form [formGroup]="formService.form" class="flex flex-col gap-4">
        <!-- nome -->
        <div class="flex flex-col gap-1">
          <label class="text-sm font-medium text-gray-700">
            Nome <span class="text-red-500">*</span>
          </label>
          <ui-input placeholder="Nome do professor" [formControl]="formService.form.controls.nome" />
          @if (formService.form.controls.nome.invalid && formService.form.controls.nome.touched) {
            <small class="text-red-500">Campo obrigatório</small>
          }
        </div>

        <!-- departamento -->
        <div class="flex flex-col gap-1">
          <label class="text-sm font-medium text-gray-700">
            Departamento <span class="text-red-500">*</span>
          </label>
          <ui-select
            [options]="departamentosOptions()"
            placeholder="Selecione o departamento"
            [formControl]="formService.form.controls.departamento"
          />
          @if (formService.form.controls.departamento.invalid && formService.form.controls.departamento.touched) {
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
export class Professores implements OnInit {
  private professorService = inject(ProfessorService);
  private departamentoService = inject(DepartamentoService);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);
  formService = inject(ProfessorFormService);

  professores = signal<Professor[]>([]);
  departamentos = signal<Departamento[]>([]);
  saving = signal(false);
  dialogVisible = signal(false);
  editingId = signal<number | null>(null);
  searchTerm = signal('');

  searchValue = '';

  professoresEnriquecidos = computed(() =>
    this.professores().map(p => ({
      ...p,
      departamento_nome: this.departamentos().find(d => d.id === p.departamento)?.nome ?? '—',
    }))
  );

  departamentosOptions = computed(() =>
    this.departamentos().map(d => ({ label: d.nome, value: d.id }))
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

  openCreate(): void {
    this.editingId.set(null);
    this.formService.load();
    this.dialogVisible.set(true);
  }

  openEdit(row: any): void {
    this.editingId.set(row.id);
    this.formService.load(row as Professor);
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
        this.loadProfessores();
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Professor salvo com sucesso!',
        });
      },
      error: () => {
        this.saving.set(false);
      },
    });
  }

  onDelete(row: any): void {
    this.confirmationService.confirm({
      message: `Deseja realmente excluir o professor "${row.nome}"?`,
      header: 'Confirmar exclusão',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Excluir',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.professorService.delete(row.id).subscribe({
          next: () => {
            this.loadProfessores();
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Professor excluído com sucesso!',
            });
          },
        });
      },
    });
  }
}
