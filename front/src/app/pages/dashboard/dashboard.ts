import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { DecimalPipe, NgTemplateOutlet } from '@angular/common';
import { forkJoin } from 'rxjs';
import { ProgressBar } from 'primeng/progressbar';
import { Aluno, AlunoService, CursoService, Professor, ProfessorService, Tcc, TccEstatisticas, TccService } from '../../core';

interface StatCard {
  label: string;
  value: number;
  icon: string;
  detail: string;
  colorClass: string;
  bgClass: string;
}

interface BreakdownItem {
  label: string;
  value: number;
  percent: number;
  colorClass: string;
  bgClass: string;
}

interface RankItem {
  nome: string;
  count: number;
  percent: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ProgressBar, DecimalPipe, NgTemplateOutlet],
  template: `
    <div class="space-y-6">
      <section class="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 class="text-2xl font-semibold text-gray-800">Dashboard</h1>
          <p class="text-sm text-gray-500 mt-1">Panorama acadêmico dos TCCs cadastrados</p>
        </div>
        <div class="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-500">
          <i class="pi pi-database text-teal-500"></i>
          Dados da API em tempo real
        </div>
      </section>

      <section class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        @for (card of totalCards(); track card.label) {
          <article class="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
            <div class="flex items-start justify-between gap-3">
              <div>
                <p class="text-sm text-gray-500">{{ card.label }}</p>
                <p class="mt-2 text-3xl font-semibold text-gray-900">{{ card.value }}</p>
              </div>
              <span class="flex h-11 w-11 items-center justify-center rounded-lg" [class]="card.bgClass">
                <i [class]="card.icon + ' text-lg ' + card.colorClass"></i>
              </span>
            </div>
            <p class="mt-4 text-xs text-gray-500">{{ card.detail }}</p>
          </article>
        }
      </section>

      <section class="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <article class="xl:col-span-2 bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
          <div class="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 class="text-base font-semibold text-gray-800">Situação dos TCCs</h2>
              <p class="text-sm text-gray-500 mt-1">Distribuição por andamento e resultado</p>
            </div>
            <div class="text-left sm:text-right">
              <p class="text-sm text-gray-500">Taxa de aprovação</p>
              <p class="text-3xl font-semibold text-green-600">{{ taxaAprovacao() }}%</p>
            </div>
          </div>

          <div class="mt-5">
            <p-progressbar [value]="taxaAprovacao()" styleClass="h-2" [showValue]="false" />
          </div>

          <div class="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            @for (item of statusBreakdown(); track item.label) {
              <div class="rounded-lg border border-gray-100 p-4">
                <div class="flex items-center justify-between gap-3">
                  <div class="flex items-center gap-2 min-w-0">
                    <span class="h-2.5 w-2.5 rounded-full flex-shrink-0" [class]="item.bgClass"></span>
                    <span class="text-sm font-medium text-gray-700 truncate">{{ item.label }}</span>
                  </div>
                  <span class="text-sm font-semibold text-gray-800">{{ item.value }}</span>
                </div>
                <div class="mt-3 h-2 rounded-full bg-gray-100 overflow-hidden">
                  <div class="h-full rounded-full" [class]="item.bgClass" [style.width.%]="item.percent"></div>
                </div>
                <p class="mt-2 text-xs text-gray-400">{{ item.percent | number:'1.0-0' }}% do total</p>
              </div>
            }
          </div>
        </article>

        <article class="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
          <h2 class="text-base font-semibold text-gray-800">Saúde do Cadastro</h2>
          <p class="text-sm text-gray-500 mt-1">Pendências úteis para apresentação e gestão</p>

          <div class="mt-5 space-y-5">
            <div>
              <div class="flex items-center justify-between">
                <p class="text-sm font-medium text-gray-700">Alunos com TCC</p>
                <p class="text-sm font-semibold text-gray-800">{{ alunosComTccPercentual() }}%</p>
              </div>
              <div class="mt-2 h-2 rounded-full bg-gray-100 overflow-hidden">
                <div class="h-full rounded-full bg-indigo-500" [style.width.%]="alunosComTccPercentual()"></div>
              </div>
              <p class="mt-2 text-xs text-gray-500">{{ alunosSemTcc().length }} alunos sem TCC cadastrado</p>
            </div>

            <div>
              <div class="flex items-center justify-between">
                <p class="text-sm font-medium text-gray-700">Professores vinculados</p>
                <p class="text-sm font-semibold text-gray-800">{{ professoresVinculadosPercentual() }}%</p>
              </div>
              <div class="mt-2 h-2 rounded-full bg-gray-100 overflow-hidden">
                <div class="h-full rounded-full bg-teal-500" [style.width.%]="professoresVinculadosPercentual()"></div>
              </div>
              <p class="mt-2 text-xs text-gray-500">{{ professoresSemVinculo().length }} professores sem vínculo em TCCs</p>
            </div>

            <div class="rounded-lg bg-gray-50 p-4">
              <p class="text-xs font-semibold uppercase text-gray-500">Status de atenção</p>
              <p class="mt-2 text-2xl font-semibold text-gray-900">{{ tccsEmAberto() }}</p>
              <p class="text-xs text-gray-500">TCCs em elaboração ou enviados</p>
            </div>
          </div>
        </article>
      </section>

      <section class="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <article class="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
          <h2 class="text-base font-semibold text-gray-800">Por Tipo</h2>
          <div class="mt-4 space-y-4">
            @for (item of tipoBreakdown(); track item.label) {
              <ng-container [ngTemplateOutlet]="barRow" [ngTemplateOutletContext]="{ item: item }" />
            }
          </div>
        </article>

        <article class="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
          <h2 class="text-base font-semibold text-gray-800">Por Idioma</h2>
          <div class="mt-4 space-y-4">
            @for (item of idiomaBreakdown(); track item.label) {
              <ng-container [ngTemplateOutlet]="barRow" [ngTemplateOutletContext]="{ item: item }" />
            }
          </div>
        </article>

        <article class="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
          <h2 class="text-base font-semibold text-gray-800">Semestres Recentes</h2>
          <div class="mt-4 space-y-4">
            @for (item of semestreBreakdown(); track item.label) {
              <ng-container [ngTemplateOutlet]="barRow" [ngTemplateOutletContext]="{ item: item }" />
            }
          </div>
        </article>
      </section>

      <section class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <article class="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
          <div class="flex items-center gap-2 mb-4">
            <i class="pi pi-star text-yellow-500"></i>
            <h2 class="text-base font-semibold text-gray-800">Top Orientadores</h2>
          </div>
          <div class="space-y-4">
            @for (item of topOrientadores(); track item.nome; let i = $index) {
              <div class="flex items-center gap-3">
                <span class="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-xs font-semibold text-blue-700">{{ i + 1 }}</span>
                <div class="min-w-0 flex-1">
                  <div class="flex items-center justify-between gap-3">
                    <p class="truncate text-sm font-medium text-gray-700">{{ item.nome }}</p>
                    <p class="text-sm font-semibold text-gray-800">{{ item.count }}</p>
                  </div>
                  <div class="mt-2 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                    <div class="h-full rounded-full bg-blue-500" [style.width.%]="item.percent"></div>
                  </div>
                </div>
              </div>
            } @empty {
              <p class="text-sm text-gray-400">Nenhum dado disponível.</p>
            }
          </div>
        </article>

        <article class="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
          <div class="flex items-center gap-2 mb-4">
            <i class="pi pi-graduation-cap text-teal-500"></i>
            <h2 class="text-base font-semibold text-gray-800">Top Cursos</h2>
          </div>
          <div class="space-y-4">
            @for (item of topCursos(); track item.nome; let i = $index) {
              <div class="flex items-center gap-3">
                <span class="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-50 text-xs font-semibold text-teal-700">{{ i + 1 }}</span>
                <div class="min-w-0 flex-1">
                  <div class="flex items-center justify-between gap-3">
                    <p class="truncate text-sm font-medium text-gray-700">{{ item.nome }}</p>
                    <p class="text-sm font-semibold text-gray-800">{{ item.count }}</p>
                  </div>
                  <div class="mt-2 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                    <div class="h-full rounded-full bg-teal-500" [style.width.%]="item.percent"></div>
                  </div>
                </div>
              </div>
            } @empty {
              <p class="text-sm text-gray-400">Nenhum dado disponível.</p>
            }
          </div>
        </article>
      </section>
    </div>

    <ng-template #barRow let-item="item">
      <div>
        <div class="flex items-center justify-between gap-3">
          <span class="truncate text-sm font-medium text-gray-700">{{ item.label }}</span>
          <span class="text-sm font-semibold text-gray-800">{{ item.value }}</span>
        </div>
        <div class="mt-2 h-2 rounded-full bg-gray-100 overflow-hidden">
          <div class="h-full rounded-full" [class]="item.bgClass" [style.width.%]="item.percent"></div>
        </div>
        <p class="mt-1 text-xs text-gray-400">{{ item.percent | number:'1.0-0' }}%</p>
      </div>
    </ng-template>
  `,
})
export class DashboardPage implements OnInit {
  private tccService = inject(TccService);
  private alunoService = inject(AlunoService);
  private professorService = inject(ProfessorService);
  private cursoService = inject(CursoService);

  estatisticas = signal<TccEstatisticas | null>(null);
  tccs = signal<Tcc[]>([]);
  alunos = signal<Aluno[]>([]);
  professores = signal<Professor[]>([]);
  totalCursos = signal(0);

  taxaAprovacao = computed(() => this.percentual(this.estatisticas()?.por_status?.['Aprovado'] ?? 0));

  tccsEmAberto = computed(() => {
    const status = this.estatisticas()?.por_status ?? {};
    return (status['Em Elaboração'] ?? 0) + (status['Enviado'] ?? 0);
  });

  alunosSemTcc = computed(() => {
    const comTcc = new Set(this.tccs().map(t => t.aluno));
    return this.alunos().filter(a => !comTcc.has(a.id));
  });

  professoresSemVinculo = computed(() => {
    const vinculados = new Set<number>();
    this.tccs().forEach(t => {
      [t.orientador, t.coorientador, t.presidente, t.primeiro_membro, t.segundo_membro]
        .filter((id): id is number => id !== null && id !== undefined)
        .forEach(id => vinculados.add(id));
    });
    return this.professores().filter(p => !vinculados.has(p.id));
  });

  alunosComTccPercentual = computed(() => {
    const total = this.alunos().length;
    return total ? Math.round(((total - this.alunosSemTcc().length) / total) * 100) : 0;
  });

  professoresVinculadosPercentual = computed(() => {
    const total = this.professores().length;
    return total ? Math.round(((total - this.professoresSemVinculo().length) / total) * 100) : 0;
  });

  totalCards = computed((): StatCard[] => [
    {
      label: 'TCCs',
      value: this.estatisticas()?.total_geral ?? 0,
      icon: 'pi pi-book',
      detail: `${this.tccsEmAberto()} em andamento`,
      colorClass: 'text-blue-600',
      bgClass: 'bg-blue-50',
    },
    {
      label: 'Alunos',
      value: this.alunos().length,
      icon: 'pi pi-users',
      detail: `${this.alunosSemTcc().length} sem TCC`,
      colorClass: 'text-indigo-600',
      bgClass: 'bg-indigo-50',
    },
    {
      label: 'Professores',
      value: this.professores().length,
      icon: 'pi pi-user',
      detail: `${this.professoresSemVinculo().length} sem vínculo`,
      colorClass: 'text-orange-600',
      bgClass: 'bg-orange-50',
    },
    {
      label: 'Cursos',
      value: this.totalCursos(),
      icon: 'pi pi-graduation-cap',
      detail: 'Cursos com alunos cadastrados',
      colorClass: 'text-teal-600',
      bgClass: 'bg-teal-50',
    },
  ]);

  statusBreakdown = computed(() =>
    this.breakdownFrom(this.estatisticas()?.por_status ?? {}, ['bg-blue-500', 'bg-orange-500', 'bg-green-500', 'bg-red-500'])
  );

  tipoBreakdown = computed(() =>
    this.breakdownFrom(this.estatisticas()?.por_tipo ?? {}, ['bg-cyan-500', 'bg-violet-500', 'bg-amber-500', 'bg-emerald-500'])
  );

  idiomaBreakdown = computed(() =>
    this.breakdownFrom(this.estatisticas()?.por_idioma ?? {}, ['bg-indigo-500', 'bg-teal-500'])
  );

  semestreBreakdown = computed(() =>
    this.breakdownFrom(this.estatisticas()?.por_semestre ?? {}, ['bg-sky-500', 'bg-fuchsia-500', 'bg-lime-500', 'bg-rose-500'], 5)
      .sort((a, b) => b.label.localeCompare(a.label))
  );

  topOrientadores = computed(() =>
    this.rankingFrom(this.estatisticas()?.por_orientador ?? {}, 5)
  );

  topCursos = computed(() =>
    this.rankingFrom(this.estatisticas()?.por_curso ?? {}, 5)
  );

  ngOnInit(): void {
    forkJoin({
      estatisticas: this.tccService.getEstatisticas(),
      tccs: this.tccService.getAll(),
      alunos: this.alunoService.getAll(),
      professores: this.professorService.getAll(),
      cursos: this.cursoService.getAll(),
    }).subscribe({
      next: ({ estatisticas, tccs, alunos, professores, cursos }) => {
        this.estatisticas.set(estatisticas);
        this.tccs.set(tccs);
        this.alunos.set(alunos);
        this.professores.set(professores);
        this.totalCursos.set(cursos.length);
      },
      error: () => {},
    });
  }

  private rankingFrom(record: Record<string, number>, limit: number): RankItem[] {
    const max = Math.max(...Object.values(record), 0);
    return Object.entries(record)
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit)
      .map(([nome, count]) => ({
        nome,
        count,
        percent: max ? Math.round((count / max) * 100) : 0,
      }));
  }

  private breakdownFrom(record: Record<string, number>, colors: string[], limit?: number): BreakdownItem[] {
    return Object.entries(record)
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit ?? Number.POSITIVE_INFINITY)
      .map(([label, value], index) => ({
        label,
        value,
        percent: this.percentual(value),
        colorClass: colors[index % colors.length],
        bgClass: colors[index % colors.length],
      }));
  }

  private percentual(value: number): number {
    const total = this.estatisticas()?.total_geral ?? 0;
    return total ? Math.round((value / total) * 100) : 0;
  }
}
