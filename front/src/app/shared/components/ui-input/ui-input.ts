import { Component, forwardRef, input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { InputText } from 'primeng/inputtext';

@Component({
  selector: 'ui-input',
  standalone: true,
  imports: [InputText],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UiInput),
      multi: true,
    },
  ],
  template: `
    <div class="flex flex-col gap-1 w-full">
      @if (label()) {
        <label class="text-sm font-medium text-gray-700">{{ label() }}</label>
      }
      <input
        pInputText
        class="w-full"
        [value]="value"
        [placeholder]="placeholder()"
        [disabled]="isDisabled"
        (input)="onInputChange($event)"
        (blur)="onTouched()"
      />
    </div>
  `,
})
export class UiInput implements ControlValueAccessor {
  label = input<string>('');
  placeholder = input<string>('');

  value = '';
  isDisabled = false;

  private onChange: (v: string) => void = () => {};
  onTouched: () => void = () => {};

  writeValue(value: string): void {
    this.value = value ?? '';
  }

  registerOnChange(fn: (v: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  onInputChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.value = value;
    this.onChange(value);
  }
}
