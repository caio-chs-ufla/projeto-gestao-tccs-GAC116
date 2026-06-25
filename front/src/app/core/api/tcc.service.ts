import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from './base-api.service';
import { Tcc, TccEstatisticas } from '../models';

@Injectable({ providedIn: 'root' })
export class TccService extends BaseApiService<Tcc> {
  protected endpoint = 'tccs';

  getEstatisticas(): Observable<TccEstatisticas> {
    return this.http.get<TccEstatisticas>(`${this.baseUrl}/estatisticas/`);
  }

  createWithFile(data: Partial<Tcc>, arquivo?: File | null): Observable<Tcc> {
    return this.http.post<Tcc>(`${this.baseUrl}/`, this.buildFormData(data, arquivo));
  }

  updateWithFile(id: number, data: Partial<Tcc>, arquivo?: File | null): Observable<Tcc> {
    return this.http.put<Tcc>(`${this.baseUrl}/${id}/`, this.buildFormData(data, arquivo));
  }

  private buildFormData(data: Partial<Tcc>, arquivo?: File | null): FormData {
    const form = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        form.append(key, String(value));
      }
    });
    if (arquivo) form.append('arquivo', arquivo);
    return form;
  }
}
