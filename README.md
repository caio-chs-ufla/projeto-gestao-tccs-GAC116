# Projeto de Gestao de TCCs - GAC116

Sistema web para gestao de Trabalhos de Conclusao de Curso, desenvolvido com backend em Django REST Framework e frontend em Angular.

## Funcionalidades

- Dashboard com estatisticas de TCCs, alunos, professores, cursos e rankings.
- Listagem e busca de alunos, professores, cursos, departamentos, unidades academicas e TCCs.
- Cadastro, edicao e exclusao de alunos, professores e TCCs.
- Alteracao de status de TCC pelo formulario de edicao.
- Upload de arquivo no cadastro/edicao de TCC.
- Link para visualizar ou baixar o arquivo na listagem de TCCs.
- Execucao local com SQLite ou Docker Compose com Postgres.

## Executar sem Docker

### Backend

Use Python 3.12.

```bash
cd back/projeto-gestao-tccs
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python load.py
python manage.py runserver
```

API: `http://127.0.0.1:8000/api/`

### Frontend

Use Node.js compativel com Angular 21.

```bash
cd front
npm ci
npm start
```

Aplicacao: `http://127.0.0.1:4200/`

## Executar com Docker

Com Docker Desktop aberto:

```bash
cd docker
docker compose up --build
```

Servicos:

- Frontend: `http://127.0.0.1:4200/`
- Backend: `http://127.0.0.1:8000/api/`
- Postgres: porta `5432`

Para popular o banco em Docker:

```bash
docker compose exec backend python load.py
```

## Endpoints principais

- `/api/unidades-academicas/`
- `/api/departamentos/`
- `/api/cursos/`
- `/api/alunos/`
- `/api/professores/`
- `/api/tccs/`
- `/api/tccs/estatisticas/`

## Observacoes

Nao ha controle de login ou permissoes, conforme solicitado no enunciado.
