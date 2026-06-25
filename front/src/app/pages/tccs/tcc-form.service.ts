import { Injectable, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { TccService } from '../../core';
import { Tcc } from '../../core';

@Injectable()
export class TccFormService {
  private api = inject(TccService);

  form = new FormGroup({
    titulo: new FormControl('', Validators.required),
    resumo: new FormControl('', Validators.required),
    palavras_chave: new FormControl('', Validators.required),
    tipo: new FormControl<string | null>(null, Validators.required),
    idioma: new FormControl<string | null>(null, Validators.required),
    status: new FormControl<string>('0', Validators.required),
    semestre_letivo_defesa: new FormControl<string | null>(null),
    arquivo: new FormControl<File | null>(null),
    aluno: new FormControl<number | null>(null, Validators.required),
    orientador: new FormControl<number | null>(null, Validators.required),
    coorientador: new FormControl<number | null>(null),
    presidente: new FormControl<number | null>(null, Validators.required),
    primeiro_membro: new FormControl<number | null>(null, Validators.required),
    segundo_membro: new FormControl<number | null>(null, Validators.required),
  });

  load(tcc?: Tcc): void {
    if (tcc) {
      const { arquivo, ...rest } = tcc;
      this.form.patchValue(rest);
    } else {
      this.form.reset({ status: '0' });
    }
  }

  submit(id?: number): Observable<Tcc> {
    const { arquivo, ...rest } = this.form.value;
    const data = rest as Partial<Tcc>;
    if (arquivo instanceof File) {
      return id
        ? this.api.updateWithFile(id, data, arquivo)
        : this.api.createWithFile(data, arquivo);
    }
    return id ? this.api.update(id, data) : this.api.create(data);
  }
}
