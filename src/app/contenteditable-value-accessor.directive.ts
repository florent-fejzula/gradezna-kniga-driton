import { Directive, ElementRef, Renderer2, forwardRef, HostListener } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

@Directive({
  selector: '[contenteditable][ngModel]',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ContenteditableValueAccessorDirective),
      multi: true
    }
  ]
})
export class ContenteditableValueAccessorDirective implements ControlValueAccessor {
  private onChange: ((value: any) => void) | undefined;
  private onTouched: (() => void) | undefined;

  constructor(private elementRef: ElementRef, private renderer: Renderer2) {}

  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    const value = (event.target as HTMLElement).innerHTML;
    if (this.onChange) {
      this.onChange(value);
    }
  }

  @HostListener('blur')
  onBlur(): void {
    if (this.onTouched) {
      this.onTouched();
    }
  }

  writeValue(value: any): void {
    this.renderer.setProperty(this.elementRef.nativeElement, 'innerHTML', value);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    const action = isDisabled ? 'addClass' : 'removeClass';
    this.renderer[action](this.elementRef.nativeElement, 'disabled');
  }
}
