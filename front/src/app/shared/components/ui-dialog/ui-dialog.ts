import { Component, input, model, output } from '@angular/core';
import { Dialog } from 'primeng/dialog';

@Component({
  selector: 'ui-dialog',
  standalone: true,
  imports: [Dialog],
  template: `
    <p-dialog
      [header]="header()"
      [visible]="visible()"
      (visibleChange)="visible.set($event)"
      [modal]="true"
      [draggable]="false"
      [resizable]="false"
      [style]="{ width: width() }"
      (onHide)="closed.emit()"
    >
      <ng-content />
    </p-dialog>
  `,
})
export class UiDialog {
  header = input<string>('');
  visible = model<boolean>(false);
  width = input<string>('520px');

  closed = output<void>();
}
