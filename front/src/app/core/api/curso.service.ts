import { Injectable } from '@angular/core';
import { BaseApiService } from './base-api.service';
import { Curso } from '../models';

@Injectable({ providedIn: 'root' })
export class CursoService extends BaseApiService<Curso> {
  protected endpoint = 'cursos';
}
