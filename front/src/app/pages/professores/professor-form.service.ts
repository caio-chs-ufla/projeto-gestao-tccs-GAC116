import { Injectable, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { ProfessorService } from '../../core';
import { Professor } from '../../core';

@Injectable()
export class ProfessorFormService {
  private api = inject(ProfessorService);

  form = new FormGroup({
    nome: new FormControl('', Validators.required),
    departamento: new FormControl<number | null>(null, Validators.required),
  });

  load(professor?: Professor): void {
    professor ? this.form.patchValue(professor) : this.form.reset();
  }

  submit(id?: number): Observable<Professor> {
    return id
      ? this.api.update(id, this.form.value as Partial<Professor>)
      : this.api.create(this.form.value as Partial<Professor>);
  }
}
