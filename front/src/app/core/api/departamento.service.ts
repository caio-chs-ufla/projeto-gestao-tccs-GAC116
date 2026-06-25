import { Injectable } from '@angular/core';
import { BaseApiService } from './base-api.service';
import { Departamento } from '../models';

@Injectable({ providedIn: 'root' })
export class DepartamentoService extends BaseApiService<Departamento> {
  protected endpoint = 'departamentos';
}
