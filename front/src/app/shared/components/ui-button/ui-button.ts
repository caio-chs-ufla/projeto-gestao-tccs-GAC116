import { Component, input, output } from '@angular/core';
import { Button } from 'primeng/button';

@Component({
  selector: 'ui-button',
  standalone: true,
  imports: [Button],
  template: `
    <p-button
      [label]="label()"
      [icon]="icon()"
      [severity]="severity()"
      [outlined]="outlined()"
      [text]="text()"
      [loading]="loading()"
      [disabled]="disabled()"
      [type]="type()"
      [size]="size()"
      (onClick)="clicked.emit($event)"
    />
  `,
})
export class UiButton {
  label = input<string>('');
  icon = input<string>('');
  severity = input<'primary' | 'secondary' | 'success' | 'danger' | 'warn' | 'info' | 'contrast'>('primary');
  outlined = input<boolean>(false);
  text = input<boolean>(false);
  loading = input<boolean>(false);
  disabled = input<boolean>(false);
  type = input<'button' | 'submit' | 'reset'>('button');
  size = input<'small' | 'large' | undefined>(undefined);

  clicked = output<MouseEvent>();
}
