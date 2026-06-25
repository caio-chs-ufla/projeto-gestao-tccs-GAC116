import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { MessageService } from 'primeng/api';

function extractMessage(error: HttpErrorResponse): string {
  const body = error.error;

  if (!body) return `Erro ${error.status}: ${error.statusText}`;
  if (typeof body === 'string') return body;

  if (body.detail) return body.detail;

  if (body.non_field_errors?.length) return body.non_field_errors.join(' ');

  const fieldErrors = Object.entries(body)
    .map(([field, msgs]) => `${field}: ${(msgs as string[]).join(', ')}`)
    .join(' | ');

  return fieldErrors || `Erro ${error.status}`;
}

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const messageService = inject(MessageService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      messageService.add({
        severity: 'error',
        summary: `Erro ${error.status}`,
        detail: extractMessage(error),
        life: 6000,
      });
      return throwError(() => error);
    }),
  );
};
