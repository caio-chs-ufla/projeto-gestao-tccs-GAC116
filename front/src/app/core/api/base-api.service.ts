import { inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export abstract class BaseApiService<T> {
  protected http = inject(HttpClient);
  protected abstract endpoint: string;

  protected get baseUrl(): string {
    return `${environment.apiUrl}/${this.endpoint}`;
  }

  getAll(search?: string): Observable<T[]> {
    const params = search ? new HttpParams().set('search', search) : undefined;
    return this.http.get<T[]>(`${this.baseUrl}/`, { params });
  }

  getById(id: number): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}/${id}/`);
  }

  create(data: Partial<T>): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}/`, data);
  }

  update(id: number, data: Partial<T>): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}/${id}/`, data);
  }

  patch(id: number, data: Partial<T>): Observable<T> {
    return this.http.patch<T>(`${this.baseUrl}/${id}/`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}/`);
  }
}
