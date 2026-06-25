import { Component, forwardRef, input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { DatePicker } from 'primeng/datepicker';

@Component({
  selector: 'ui-input-date',
  standalone: true,
  imports: [DatePicker, FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UiInputDate),
      multi: true,
    },
  ],
  template: `
    <div class="flex flex-col gap-1 w-full">
      @if (label()) {
        <label class="text-sm font-medium text-gray-700">{{ label() }}</label>
      }
      <p-datepicker
        class="w-full"
        [ngModel]="value"
        [placeholder]="placeholder()"
        [dateFormat]="dateFormat()"
        [disabled]="isDisabled"
        [showIcon]="true"
        [showButtonBar]="true"
        (ngModelChange)="onValueChange($event)"
        (onBlur)="onTouched()"
      />
    </div>
  `,
})
export class UiInputDate implements ControlValueAccessor {
  label = input<string>('');
  placeholder = input<string>('');
  dateFormat = input<string>('dd/mm/yy');

  value: Date | null = null;
  isDisabled = false;

  private onChange: (v: Date | null) => void = () => {};
  onTouched: () => void = () => {};

  writeValue(value: Date | null): void {
    this.value = value ?? null;
  }

  registerOnChange(fn: (v: Date | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  onValueChange(value: Date): void {
    this.value = value;
    this.onChange(value);
  }
}
