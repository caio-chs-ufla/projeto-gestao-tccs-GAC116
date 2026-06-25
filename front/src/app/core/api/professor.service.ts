import { Injectable } from '@angular/core';
import { BaseApiService } from './base-api.service';
import { Professor } from '../models';

@Injectable({ providedIn: 'root' })
export class ProfessorService extends BaseApiService<Professor> {
  protected endpoint = 'professores';
}
