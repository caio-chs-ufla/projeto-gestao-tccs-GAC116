import { Injectable } from '@angular/core';
import { BaseApiService } from './base-api.service';
import { Aluno } from '../models';

@Injectable({ providedIn: 'root' })
export class AlunoService extends BaseApiService<Aluno> {
  protected endpoint = 'alunos';
}
