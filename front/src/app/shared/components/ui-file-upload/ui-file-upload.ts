import { Component, forwardRef, input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { FileUpload } from 'primeng/fileupload';

@Component({
  selector: 'ui-file-upload',
  standalone: true,
  imports: [FileUpload],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UiFileUpload),
      multi: true,
    },
  ],
  template: `
    <div class="flex flex-col gap-1 w-full">
      @if (label()) {
        <label class="text-sm font-medium text-gray-700">{{ label() }}</label>
      }
      <p-fileupload
        mode="basic"
        [accept]="accept()"
        [maxFileSize]="maxFileSize()"
        [chooseLabel]="value ? value.name : chooseLabel()"
        [chooseIcon]="value ? 'pi pi-check' : 'pi pi-upload'"
        [disabled]="isDisabled"
        (onSelect)="onFileSelect($event)"
      />
    </div>
  `,
})
export class UiFileUpload implements ControlValueAccessor {
  label = input<string>('');
  accept = input<string>('*');
  maxFileSize = input<number>(10_000_000);
  chooseLabel = input<string>('Selecionar arquivo');

  value: File | null = null;
  isDisabled = false;

  private onChange: (v: File | null) => void = () => {};
  onTouched: () => void = () => {};

  writeValue(value: File | null): void {
    this.value = value ?? null;
  }

  registerOnChange(fn: (v: File | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  onFileSelect(event: { files: File[] }): void {
    const file = event.files[0] ?? null;
    this.value = file;
    this.onChange(file);
    this.onTouched();
  }
}
