import { Component, forwardRef, input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { Select } from 'primeng/select';

@Component({
  selector: 'ui-select-search',
  standalone: true,
  imports: [Select, FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UiSelectSearch),
      multi: true,
    },
  ],
  template: `
    <div class="flex flex-col gap-1 w-full">
      @if (label()) {
        <label class="text-sm font-medium text-gray-700">{{ label() }}</label>
      }
      <p-select
        styleClass="w-full"
        [ngModel]="value"
        [options]="options()"
        [optionLabel]="optionLabel()"
        [optionValue]="optionValue()"
        [placeholder]="placeholder()"
        [disabled]="isDisabled"
        [showClear]="showClear()"
        [filter]="true"
        [filterPlaceholder]="filterPlaceholder()"
        (ngModelChange)="onValueChange($event)"
        (onBlur)="onTouched()"
      />
    </div>
  `,
})
export class UiSelectSearch implements ControlValueAccessor {
  label = input<string>('');
  placeholder = input<string>('Selecione...');
  filterPlaceholder = input<string>('Buscar...');
  options = input<any[]>([]);
  optionLabel = input<string>('label');
  optionValue = input<string>('value');
  showClear = input<boolean>(false);

  value: any = null;
  isDisabled = false;

  private onChange: (v: any) => void = () => {};
  onTouched: () => void = () => {};

  writeValue(value: any): void {
    this.value = value ?? null;
  }

  registerOnChange(fn: (v: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  onValueChange(value: any): void {
    this.value = value;
    this.onChange(value);
  }
}
