export interface UnidadeAcademica {
  id: number;
  nome: string;
  sigla: string;
}

export interface Departamento {
  id: number;
  nome: string;
  sigla: string;
  unidade_academica: number;
}

export interface Curso {
  id: number;
  nome: string;
  sigla: string;
  codigo: string;
}

export interface Aluno {
  id: number;
  nome: string;
  matricula: string;
  curso: number;
}

export interface Professor {
  id: number;
  nome: string;
  departamento: number;
}

export type TccTipo = 'MONOGRAFIA' | 'RELATORIO_ESTAGIO' | 'RELATORIO_TECNICO' | 'ARTIGO';
export type TccIdioma = 'PT' | 'EN';
export type TccStatus = '0' | '1' | '2' | '3';

export type SemestreLetivo =
  | '2020/1' | '2020/2'
  | '2021/1' | '2021/2'
  | '2022/1' | '2022/2'
  | '2023/1' | '2023/2'
  | '2024/1' | '2024/2'
  | '2025/1' | '2025/2'
  | '2026/1';

export interface Tcc {
  id: number;
  titulo: string;
  resumo: string;
  palavras_chave: string;
  tipo: TccTipo;
  tipo_display: string;
  idioma: TccIdioma;
  idioma_display: string;
  status: TccStatus;
  status_display: string;
  semestre_letivo_defesa: SemestreLetivo | null;
  arquivo: string | null;
  aluno: number;
  orientador: number;
  coorientador: number | null;
  presidente: number;
  primeiro_membro: number;
  segundo_membro: number;
}

export interface TccEstatisticas {
  total_geral: number;
  por_status: Record<string, number>;
  por_tipo: Record<string, number>;
  por_idioma: Record<string, number>;
  por_semestre: Record<string, number>;
  por_orientador: Record<string, number>;
  por_coorientador: Record<string, number>;
  por_curso: Record<string, number>;
  por_departamento: Record<string, number>;
  por_unidade_academica: Record<string, number>;
}
