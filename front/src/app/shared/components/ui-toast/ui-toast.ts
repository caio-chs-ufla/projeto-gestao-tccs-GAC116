import { Component } from '@angular/core';
import { Toast } from 'primeng/toast';

@Component({
  selector: 'ui-toast',
  standalone: true,
  imports: [Toast],
  template: `<p-toast />`,
})
export class UiToast {}
