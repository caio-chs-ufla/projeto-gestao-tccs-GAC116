import { Injectable, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { AlunoService } from '../../core';
import { Aluno } from '../../core';

@Injectable()
export class AlunoFormService {
  private api = inject(AlunoService);

  form = new FormGroup({
    nome: new FormControl('', Validators.required),
    matricula: new FormControl('', Validators.required),
    curso: new FormControl<number | null>(null, Validators.required),
  });

  load(aluno?: Aluno): void {
    aluno ? this.form.patchValue(aluno) : this.form.reset();
  }

  submit(id?: number): Observable<Aluno> {
    return id
      ? this.api.update(id, this.form.value as Partial<Aluno>)
      : this.api.create(this.form.value as Partial<Aluno>);
  }
}
