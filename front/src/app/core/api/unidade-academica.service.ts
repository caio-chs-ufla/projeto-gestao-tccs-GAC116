import { Injectable } from '@angular/core';
import { BaseApiService } from './base-api.service';
import { UnidadeAcademica } from '../models';

@Injectable({ providedIn: 'root' })
export class UnidadeAcademicaService extends BaseApiService<UnidadeAcademica> {
  protected endpoint = 'unidades-academicas';
}
