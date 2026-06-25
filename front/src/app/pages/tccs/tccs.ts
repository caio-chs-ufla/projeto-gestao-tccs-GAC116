import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Textarea } from 'primeng/textarea';
import {
  Aluno,
  AlunoService,
  Professor,
  ProfessorService,
  Tcc,
  TccService,
} from '../../core';
import {
  TableColumn,
  UiButton,
  UiDialog,
  UiFileUpload,
  UiInput,
  UiInputSearch,
  UiSelect,
  UiSelectSearch,
  UiTable,
  UiTag,
} from '../../shared';
import { environment } from '../../../environments/environment';
import { TccFormService } from './tcc-form.service';

@Component({
  selector: 'app-tccs',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    Textarea,
    UiButton,
    UiDialog,
    UiFileUpload,
    UiInput,
    UiInputSearch,
    UiSelect,
    UiSelectSearch,
    UiTable,
    UiTag,
  ],
  providers: [TccFormService],
  template: `
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-semibold text-gray-800">TCCs</h1>
      <ui-button label="Adicionar TCC" icon="pi pi-plus" (clicked)="openCreate()" />
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
      <ui-input-search
        placeholder="Buscar por título ou resumo..."
        [(ngModel)]="searchValue"
        (ngModelChange)="onSearch($event)"
      />
      <ui-select
        label=""
        [options]="statusOptions"
        placeholder="Filtrar por status"
        [showClear]="true"
        [(ngModel)]="filtroStatusModel"
      />
      <ui-select
        label=""
        [options]="tipoOptions"
        placeholder="Filtrar por tipo"
        [showClear]="true"
        [(ngModel)]="filtroTipoModel"
      />
      <ui-select
        label=""
        [options]="idiomaOptions"
        placeholder="Filtrar por idioma"
        [showClear]="true"
        [(ngModel)]="filtroIdiomaModel"
      />
    </div>

    <ui-table [columns]="columns" [data]="tccsEnriquecidos()">
      <ng-template #rowActions let-row>
        <div class="flex items-center gap-2">
          <ui-tag [status]="row.status" />
          <ui-button icon="pi pi-sync" [text]="true" severity="secondary" (clicked)="openStatusDialog(row)" />
        </div>
      </ng-template>
    </ui-table>

    <ui-dialog
      header="Adicionar TCC"
      [visible]="dialogVisible()"
      (visibleChange)="dialogVisible.set($event)"
      width="900px"
    >
      <form [formGroup]="formService.form" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div class="flex flex-col gap-1 col-span-full">
          <label class="text-sm font-medium text-gray-700">
            Título <span class="text-red-500">*</span>
          </label>
          <ui-input placeholder="Título do TCC" [formControl]="formService.form.controls.titulo" />
          @if (formService.form.controls.titulo.invalid && formService.form.controls.titulo.touched) {
            <small class="text-red-500">Campo obrigatório</small>
          }
        </div>

        <div class="flex flex-col gap-1 col-span-full">
          <label class="text-sm font-medium text-gray-700">
            Resumo <span class="text-red-500">*</span>
          </label>
          <textarea
            pTextarea
            [formControl]="formService.form.controls.resumo"
            rows="3"
            class="w-full"
            placeholder="Resumo do TCC"
          ></textarea>
          @if (formService.form.controls.resumo.invalid && formService.form.controls.resumo.touched) {
            <small class="text-red-500">Campo obrigatório</small>
          }
        </div>

        <div class="flex flex-col gap-1 col-span-full">
          <label class="text-sm font-medium text-gray-700">
            Palavras-chave <span class="text-red-500">*</span>
          </label>
          <ui-input
            placeholder="Ex: machine learning, redes neurais, python"
            [formControl]="formService.form.controls.palavras_chave"
          />
          @if (
            formService.form.controls.palavras_chave.invalid &&
            formService.form.controls.palavras_chave.touched
          ) {
            <small class="text-red-500">Campo obrigatório</small>
          }
        </div>

        <div class="flex flex-col gap-1">
          <label class="text-sm font-medium text-gray-700">
            Tipo <span class="text-red-500">*</span>
          </label>
          <ui-select
            [options]="tipoOptions"
            placeholder="Selecione o tipo"
            [formControl]="formService.form.controls.tipo"
          />
          @if (formService.form.controls.tipo.invalid && formService.form.controls.tipo.touched) {
            <small class="text-red-500">Campo obrigatório</small>
          }
        </div>

        <div class="flex flex-col gap-1">
          <label class="text-sm font-medium text-gray-700">
            Idioma <span class="text-red-500">*</span>
          </label>
          <ui-select
            [options]="idiomaOptions"
            placeholder="Selecione o idioma"
            [formControl]="formService.form.controls.idioma"
          />
          @if (formService.form.controls.idioma.invalid && formService.form.controls.idioma.touched) {
            <small class="text-red-500">Campo obrigatório</small>
          }
        </div>

        <div class="flex flex-col gap-1">
          <label class="text-sm font-medium text-gray-700">Semestre de Defesa</label>
          <ui-select
            [options]="semestreOptions"
            placeholder="Selecione o semestre"
            [showClear]="true"
            [formControl]="formService.form.controls.semestre_letivo_defesa"
          />
        </div>

        <div class="flex flex-col gap-1">
          <label class="text-sm font-medium text-gray-700">Arquivo PDF</label>
          <ui-file-upload
            accept=".pdf"
            chooseLabel="Selecionar PDF"
            [formControl]="formService.form.controls.arquivo"
          />
        </div>

        <div class="flex flex-col gap-1">
          <label class="text-sm font-medium text-gray-700">
            Aluno <span class="text-red-500">*</span>
          </label>
          <ui-select-search
            [options]="alunosOptions()"
            placeholder="Selecione o aluno"
            filterPlaceholder="Buscar aluno..."
            [formControl]="formService.form.controls.aluno"
          />
          @if (formService.form.controls.aluno.invalid && formService.form.controls.aluno.touched) {
            <small class="text-red-500">Campo obrigatório</small>
          }
        </div>

        <div class="flex flex-col gap-1">
          <label class="text-sm font-medium text-gray-700">
            Orientador <span class="text-red-500">*</span>
          </label>
          <ui-select-search
            [options]="professoresOptions()"
            placeholder="Selecione o orientador"
            filterPlaceholder="Buscar professor..."
            [formControl]="formService.form.controls.orientador"
          />
          @if (formService.form.controls.orientador.invalid && formService.form.controls.orientador.touched) {
            <small class="text-red-500">Campo obrigatório</small>
          }
        </div>

        <div class="flex flex-col gap-1">
          <label class="text-sm font-medium text-gray-700">Coorientador</label>
          <ui-select-search
            [options]="professoresOptions()"
            placeholder="Selecione o coorientador"
            filterPlaceholder="Buscar professor..."
            [showClear]="true"
            [formControl]="formService.form.controls.coorientador"
          />
        </div>

        <div class="flex flex-col gap-1">
          <label class="text-sm font-medium text-gray-700">
            Presidente da Banca <span class="text-red-500">*</span>
          </label>
          <ui-select-search
            [options]="professoresOptions()"
            placeholder="Selecione o presidente"
            filterPlaceholder="Buscar professor..."
            [formControl]="formService.form.controls.presidente"
          />
          @if (formService.form.controls.presidente.invalid && formService.form.controls.presidente.touched) {
            <small class="text-red-500">Campo obrigatório</small>
          }
        </div>

        <div class="flex flex-col gap-1">
          <label class="text-sm font-medium text-gray-700">
            1º Membro da Banca <span class="text-red-500">*</span>
          </label>
          <ui-select-search
            [options]="professoresOptions()"
            placeholder="Selecione o 1º membro"
            filterPlaceholder="Buscar professor..."
            [formControl]="formService.form.controls.primeiro_membro"
          />
          @if (formService.form.controls.primeiro_membro.invalid && formService.form.controls.primeiro_membro.touched) {
            <small class="text-red-500">Campo obrigatório</small>
          }
        </div>

        <div class="flex flex-col gap-1">
          <label class="text-sm font-medium text-gray-700">
            2º Membro da Banca <span class="text-red-500">*</span>
          </label>
          <ui-select-search
            [options]="professoresOptions()"
            placeholder="Selecione o 2º membro"
            filterPlaceholder="Buscar professor..."
            [formControl]="formService.form.controls.segundo_membro"
          />
          @if (formService.form.controls.segundo_membro.invalid && formService.form.controls.segundo_membro.touched) {
            <small class="text-red-500">Campo obrigatório</small>
          }
        </div>
      </form>

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

    <ui-dialog
      header="Alterar Status"
      [visible]="statusDialogVisible()"
      (visibleChange)="statusDialogVisible.set($event)"
      width="420px"
    >
      <div class="flex flex-col gap-4">
        <p class="text-sm text-gray-600">{{ statusTarget()?.titulo }}</p>
        <div class="flex flex-col gap-1">
          <label class="text-sm font-medium text-gray-700">Status</label>
          <ui-select
            [options]="statusOptions"
            placeholder="Selecione o status"
            [(ngModel)]="statusValueModel"
          />
        </div>
      </div>

      <div class="flex justify-end gap-2 pt-4 mt-4 border-t border-gray-200">
        <ui-button
          label="Cancelar"
          severity="secondary"
          [outlined]="true"
          (clicked)="statusDialogVisible.set(false)"
        />
        <ui-button label="Salvar" [loading]="statusSaving()" (clicked)="onSaveStatus()" />
      </div>
    </ui-dialog>
  `,
})
export class Tccs implements OnInit {
  private tccService = inject(TccService);
  private alunoService = inject(AlunoService);
  private professorService = inject(ProfessorService);
  private messageService = inject(MessageService);
  formService = inject(TccFormService);

  tccs = signal<Tcc[]>([]);
  alunos = signal<Aluno[]>([]);
  professores = signal<Professor[]>([]);
  saving = signal(false);
  dialogVisible = signal(false);
  statusDialogVisible = signal(false);
  statusSaving = signal(false);
  statusTarget = signal<Tcc | null>(null);
  statusValue = signal<string>('0');

  searchTerm = signal('');
  filtroStatus = signal<string | null>(null);
  filtroTipo = signal<string | null>(null);
  filtroIdioma = signal<string | null>(null);

  searchValue = '';

  readonly tipoOptions = [
    { label: 'Monografia', value: 'MONOGRAFIA' },
    { label: 'Relatório de Estágio', value: 'RELATORIO_ESTAGIO' },
    { label: 'Relatório Técnico', value: 'RELATORIO_TECNICO' },
    { label: 'Artigo', value: 'ARTIGO' },
  ];

  readonly statusOptions = [
    { label: 'Em Elaboração', value: '0' },
    { label: 'Enviado', value: '1' },
    { label: 'Aprovado', value: '2' },
    { label: 'Reprovado', value: '3' },
  ];

  readonly idiomaOptions = [
    { label: 'Português', value: 'PT' },
    { label: 'Inglês', value: 'EN' },
  ];

  readonly semestreOptions = [
    '2020/1', '2020/2', '2021/1', '2021/2', '2022/1', '2022/2',
    '2023/1', '2023/2', '2024/1', '2024/2', '2025/1', '2025/2', '2026/1',
  ].map(s => ({ label: s, value: s }));

  get filtroStatusModel(): string | null { return this.filtroStatus(); }
  set filtroStatusModel(v: string | null) { this.filtroStatus.set(v); }

  get filtroTipoModel(): string | null { return this.filtroTipo(); }
  set filtroTipoModel(v: string | null) { this.filtroTipo.set(v); }

  get filtroIdiomaModel(): string | null { return this.filtroIdioma(); }
  set filtroIdiomaModel(v: string | null) { this.filtroIdioma.set(v); }

  get statusValueModel(): string { return this.statusValue(); }
  set statusValueModel(v: string) { this.statusValue.set(v); }

  tccsEnriquecidos = computed(() => {
    return this.tccs()
      .filter(t => {
        const status = this.filtroStatus();
        const tipo = this.filtroTipo();
        const idioma = this.filtroIdioma();
        return (
          (!status || t.status === status) &&
          (!tipo || t.tipo === tipo) &&
          (!idioma || t.idioma === idioma)
        );
      })
      .map(t => ({
        ...t,
        aluno_nome: this.alunos().find(a => a.id === t.aluno)?.nome ?? '—',
        orientador_nome: this.professores().find(p => p.id === t.orientador)?.nome ?? '—',
        arquivo_url: this.resolveArquivoUrl(t.arquivo),
      }));
  });

  alunosOptions = computed(() =>
    this.alunos().map(a => ({ label: `${a.nome} (${a.matricula})`, value: a.id }))
  );

  professoresOptions = computed(() =>
    this.professores().map(p => ({ label: p.nome, value: p.id }))
  );

  columns: TableColumn[] = [
    { field: 'titulo', header: 'Título', sortable: true },
    { field: 'tipo_display', header: 'Tipo', sortable: true },
    { field: 'aluno_nome', header: 'Aluno', sortable: true },
    { field: 'orientador_nome', header: 'Orientador', sortable: true },
    { field: 'semestre_letivo_defesa', header: 'Semestre', sortable: true },
    { field: 'status_display', header: 'Status', sortable: true },
    { field: 'arquivo_url', header: 'Arquivo', type: 'link', linkLabel: 'Abrir' },
  ];

  ngOnInit(): void {
    this.loadTccs();
    this.loadAlunos();
    this.loadProfessores();
  }

  loadTccs(): void {
    this.tccService.getAll(this.searchTerm() || undefined).subscribe({
      next: data => this.tccs.set(data),
    });
  }

  loadAlunos(): void {
    this.alunoService.getAll().subscribe({
      next: data => this.alunos.set(data),
    });
  }

  loadProfessores(): void {
    this.professorService.getAll().subscribe({
      next: data => this.professores.set(data),
    });
  }

  onSearch(term: string): void {
    this.searchTerm.set(term);
    this.loadTccs();
  }

  openCreate(): void {
    this.formService.load();
    this.dialogVisible.set(true);
  }

  onSave(): void {
    if (this.formService.form.invalid) {
      this.formService.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    this.formService.submit().subscribe({
      next: () => {
        this.saving.set(false);
        this.dialogVisible.set(false);
        this.loadTccs();
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'TCC cadastrado com sucesso!',
        });
      },
      error: () => {
        this.saving.set(false);
      },
    });
  }

  openStatusDialog(row: Tcc): void {
    this.statusTarget.set(row);
    this.statusValue.set(row.status);
    this.statusDialogVisible.set(true);
  }

  onSaveStatus(): void {
    const target = this.statusTarget();
    if (!target) return;

    this.statusSaving.set(true);
    this.tccService.patch(target.id, { status: this.statusValue() as Tcc['status'] }).subscribe({
      next: () => {
        this.statusSaving.set(false);
        this.statusDialogVisible.set(false);
        this.loadTccs();
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Status atualizado com sucesso!',
        });
      },
      error: () => {
        this.statusSaving.set(false);
      },
    });
  }

  private resolveArquivoUrl(arquivo: string | null): string | null {
    if (!arquivo) return null;
    if (/^https?:\/\//i.test(arquivo)) return arquivo;

    const apiOrigin = new URL(environment.apiUrl).origin;
    return arquivo.startsWith('/') ? `${apiOrigin}${arquivo}` : `${apiOrigin}/${arquivo}`;
  }
}
