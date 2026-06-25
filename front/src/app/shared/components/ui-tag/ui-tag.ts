import { Component, computed, input } from '@angular/core';
import { Tag } from 'primeng/tag';

type TagSeverity = 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast';
type TccStatus = '0' | '1' | '2' | '3';

const TCC_STATUS_MAP: Record<TccStatus, { label: string; severity: TagSeverity }> = {
  '0': { label: 'Em Elaboração', severity: 'secondary' },
  '1': { label: 'Enviado', severity: 'info' },
  '2': { label: 'Aprovado', severity: 'success' },
  '3': { label: 'Reprovado', severity: 'danger' },
};

@Component({
  selector: 'ui-tag',
  standalone: true,
  imports: [Tag],
  template: `<p-tag [value]="resolvedValue()" [severity]="resolvedSeverity()" />`,
})
export class UiTag {
  value = input<string>('');
  severity = input<TagSeverity>('info');
  status = input<TccStatus | undefined>(undefined);

  resolvedValue = computed(() => {
    const s = this.status();
    return s !== undefined ? TCC_STATUS_MAP[s].label : this.value();
  });

  resolvedSeverity = computed(() => {
    const s = this.status();
    return s !== undefined ? TCC_STATUS_MAP[s].severity : this.severity();
  });
}
