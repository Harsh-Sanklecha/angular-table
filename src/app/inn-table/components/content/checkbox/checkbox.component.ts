import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'inn-checkbox',
  imports: [FormsModule],
  template: `
  <input type="checkbox" [(ngModel)]="value">
  `,
  styles: ``
})
export class CheckboxComponent {
  @Input() value: boolean = false;
}
