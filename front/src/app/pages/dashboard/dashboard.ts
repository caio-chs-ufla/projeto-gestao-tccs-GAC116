import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { forkJoin } from 'rxjs';
import { ProgressBar } from 'primeng/progressbar';
import { TccService, AlunoService, ProfessorService, CursoService } from '../../core';
import { Tcc, Aluno, Professor, TccEstatisticas } from '../../core';

interface StatCard {
  label: string;
  value: number;
  icon: string;
  colorClass: string;
  bgClass: string;
}

interface StatusCard {
  label: string;
  value: number;
  borderClass: string;
  textClass: string;
  bgClass: string;
  icon: string;
}

interface RankItem {
  nome: string;
  count: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ProgressBar, DecimalPipe],
  template: `
    <div class="mb-8">
      <h1 class="text-2xl font-semibold text-gray-800">Dashboard</h1>
      <p class="text-sm text-gray-500 mt-1">Visão geral do sistema de gestão de TCCs</p>
    </div>

    @if (!loading()) {

      <!-- Linha 1: Totais gerais -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        @for (card of totalCards(); track card.label) {
          <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center gap-4">
            <div class="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0" [class]="card.bgClass">
              <i [class]="card.icon + ' text-xl ' + card.colorClass"></i>
            </div>
            <div>
              <p class="text-sm text-gray-500">{{ card.label }}</p>
              <p class="text-2xl font-bold text-gray-800">{{ card.value }}</p>
            </div>
          </div>
        }
      </div>

      <!-- Linha 2: Status dos TCCs -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        @for (card of statusCards(); track card.label) {
          <div class="bg-white rounded-xl shadow-sm border-l-4 p-5" [class]="card.borderClass">
            <div class="flex items-center justify-between">
              <p class="text-sm font-medium text-gray-600">{{ card.label }}</p>
              <div class="w-8 h-8 rounded-full flex items-center justify-center" [class]="card.bgClass">
                <i [class]="card.icon + ' text-sm ' + card.textClass"></i>
              </div>
            </div>
            <p class="text-3xl font-bold mt-2" [class]="card.textClass">{{ card.value }}</p>
            <p class="text-xs text-gray-400 mt-1">
              @if (estatisticas()?.total_geral) {
                {{ ((card.value / (estatisticas()?.total_geral ?? 1)) * 100) | number:'1.0-0' }}% do total
              }
            </p>
          </div>
        }
      </div>

      <!-- Linha 3: Insights -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

        <!-- Taxa de aprovação -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div class="flex items-center gap-2 mb-3">
            <i class="pi pi-check-circle text-green-500"></i>
            <h3 class="font-semibold text-gray-700 text-sm">Taxa de Aprovação</h3>
          </div>
          <p class="text-4xl font-bold text-gray-800 mb-3">{{ taxaAprovacao() }}<span class="text-lg text-gray-400">%</span></p>
          <p-progressbar [value]="taxaAprovacao()" styleClass="h-2" [showValue]="false" />
          <p class="text-xs text-gray-400 mt-2">
            {{ estatisticas()?.por_status?.['Aprovado'] ?? 0 }} aprovados de {{ estatisticas()?.total_geral ?? 0 }} TCCs
          </p>
        </div>

        <!-- Professores sem vínculo -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div class="flex items-center gap-2 mb-3">
            <i class="pi pi-user-minus text-orange-500"></i>
            <h3 class="font-semibold text-gray-700 text-sm">Professores sem Vínculo</h3>
          </div>
          <p class="text-4xl font-bold text-gray-800 mb-1">{{ professoresSemVinculo().length }}</p>
          <p class="text-xs text-gray-400 mb-3">de {{ professores().length }} professores cadastrados</p>
          @if (professoresSemVinculo().length > 0) {
            <ul class="space-y-1 max-h-20 overflow-y-auto">
              @for (prof of professoresSemVinculo().slice(0, 3); track prof.id) {
                <li class="text-xs text-gray-500 flex items-center gap-1">
                  <i class="pi pi-minus text-orange-300 text-xs"></i>
                  {{ prof.nome }}
                </li>
              }
              @if (professoresSemVinculo().length > 3) {
                <li class="text-xs text-gray-400 italic">+ {{ professoresSemVinculo().length - 3 }} outros</li>
              }
            </ul>
          } @else {
            <p class="text-xs text-green-600 flex items-center gap-1">
              <i class="pi pi-check text-xs"></i>
              Todos os professores têm vínculos
            </p>
          }
        </div>

        <!-- Alunos sem TCC -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div class="flex items-center gap-2 mb-3">
            <i class="pi pi-exclamation-circle text-yellow-500"></i>
            <h3 class="font-semibold text-gray-700 text-sm">Alunos sem TCC</h3>
          </div>
          <p class="text-4xl font-bold text-gray-800 mb-1">{{ alunosSemTcc().length }}</p>
          <p class="text-xs text-gray-400 mb-3">de {{ alunos().length }} alunos cadastrados</p>
          @if (alunosSemTcc().length > 0) {
            <ul class="space-y-1 max-h-20 overflow-y-auto">
              @for (aluno of alunosSemTcc().slice(0, 3); track aluno.id) {
                <li class="text-xs text-gray-500 flex items-center gap-1">
                  <i class="pi pi-minus text-yellow-400 text-xs"></i>
                  {{ aluno.nome }}
                </li>
              }
              @if (alunosSemTcc().length > 3) {
                <li class="text-xs text-gray-400 italic">+ {{ alunosSemTcc().length - 3 }} outros</li>
              }
            </ul>
          } @else {
            <p class="text-xs text-green-600 flex items-center gap-1">
              <i class="pi pi-check text-xs"></i>
              Todos os alunos têm TCC cadastrado
            </p>
          }
        </div>

      </div>

      <!-- Linha 4: Rankings -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">

        <!-- Top 5 Orientadores -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div class="flex items-center gap-2 mb-4">
            <i class="pi pi-star text-blue-500"></i>
            <h3 class="font-semibold text-gray-700">Top 5 Orientadores</h3>
          </div>
          @if (topOrientadores().length === 0) {
            <p class="text-sm text-gray-400">Nenhum dado disponível.</p>
          } @else {
            <ul class="space-y-3">
              @for (item of topOrientadores(); track item.nome; let i = $index) {
                <li class="flex items-center gap-3">
                  <span class="w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center flex-shrink-0"
                    [class]="i === 0 ? 'bg-yellow-100 text-yellow-700' : i === 1 ? 'bg-gray-100 text-gray-600' : 'bg-orange-50 text-orange-600'">
                    {{ i + 1 }}
                  </span>
                  <span class="flex-1 text-sm text-gray-700 truncate">{{ item.nome }}</span>
                  <span class="text-sm font-semibold text-gray-500 flex items-center gap-1">
                    {{ item.count }}
                    <span class="text-xs text-gray-400 font-normal">TCC{{ item.count !== 1 ? 's' : '' }}</span>
                  </span>
                </li>
              }
            </ul>
          }
        </div>

        <!-- Top 5 Cursos -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div class="flex items-center gap-2 mb-4">
            <i class="pi pi-chart-bar text-purple-500"></i>
            <h3 class="font-semibold text-gray-700">Top 5 Cursos</h3>
          </div>
          @if (topCursos().length === 0) {
            <p class="text-sm text-gray-400">Nenhum dado disponível.</p>
          } @else {
            <ul class="space-y-3">
              @for (item of topCursos(); track item.nome; let i = $index) {
                <li class="flex items-center gap-3">
                  <span class="w-6 h-6 bg-purple-50 text-purple-600 rounded-full text-xs font-bold flex items-center justify-center flex-shrink-0">
                    {{ i + 1 }}
                  </span>
                  <span class="flex-1 text-sm text-gray-700 truncate">{{ item.nome }}</span>
                  <div class="flex items-center gap-2">
                    <div class="w-16 bg-gray-100 rounded-full h-1.5">
                      <div class="bg-purple-400 h-1.5 rounded-full"
                        [style.width.%]="topCursos()[0].count > 0 ? (item.count / topCursos()[0].count) * 100 : 0">
                      </div>
                    </div>
                    <span class="text-sm font-semibold text-gray-500 w-4 text-right">{{ item.count }}</span>
                  </div>
                </li>
              }
            </ul>
          }
        </div>

      </div>

    }
  `,
})
export class DashboardPage implements OnInit {
  private tccService = inject(TccService);
  private alunoService = inject(AlunoService);
  private professorService = inject(ProfessorService);
  private cursoService = inject(CursoService);

  loading = signal(true);
  estatisticas = signal<TccEstatisticas | null>(null);
  tccs = signal<Tcc[]>([]);
  alunos = signal<Aluno[]>([]);
  professores = signal<Professor[]>([]);
  totalCursos = signal(0);

  taxaAprovacao = computed(() => {
    const stats = this.estatisticas();
    if (!stats || stats.total_geral === 0) return 0;
    return Math.round(((stats.por_status['Aprovado'] ?? 0) / stats.total_geral) * 100);
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

  alunosSemTcc = computed(() => {
    const comTcc = new Set(this.tccs().map(t => t.aluno));
    return this.alunos().filter(a => !comTcc.has(a.id));
  });

  topOrientadores = computed((): RankItem[] =>
    Object.entries(this.estatisticas()?.por_orientador ?? {})
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([nome, count]) => ({ nome, count }))
  );

  topCursos = computed((): RankItem[] =>
    Object.entries(this.estatisticas()?.por_curso ?? {})
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([nome, count]) => ({ nome, count }))
  );

  totalCards = computed((): StatCard[] => [
    { label: 'Total de TCCs', value: this.estatisticas()?.total_geral ?? 0, icon: 'pi pi-book', colorClass: 'text-blue-500', bgClass: 'bg-blue-50' },
    { label: 'Alunos', value: this.alunos().length, icon: 'pi pi-users', colorClass: 'text-indigo-500', bgClass: 'bg-indigo-50' },
    { label: 'Professores', value: this.professores().length, icon: 'pi pi-user', colorClass: 'text-violet-500', bgClass: 'bg-violet-50' },
    { label: 'Cursos', value: this.totalCursos(), icon: 'pi pi-graduation-cap', colorClass: 'text-teal-500', bgClass: 'bg-teal-50' },
  ]);

  statusCards = computed((): StatusCard[] => {
    const s = this.estatisticas()?.por_status ?? {};
    return [
      { label: 'Em Elaboração', value: s['Em Elaboração'] ?? 0, borderClass: 'border-blue-400', textClass: 'text-blue-600', bgClass: 'bg-blue-50', icon: 'pi pi-pencil' },
      { label: 'Enviados', value: s['Enviado'] ?? 0, borderClass: 'border-orange-400', textClass: 'text-orange-600', bgClass: 'bg-orange-50', icon: 'pi pi-send' },
      { label: 'Aprovados', value: s['Aprovado'] ?? 0, borderClass: 'border-green-400', textClass: 'text-green-600', bgClass: 'bg-green-50', icon: 'pi pi-check' },
      { label: 'Reprovados', value: s['Reprovado'] ?? 0, borderClass: 'border-red-400', textClass: 'text-red-600', bgClass: 'bg-red-50', icon: 'pi pi-times' },
    ];
  });

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
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}
