import { Component, Input } from '@angular/core';

@Component({
  standalone: true,
  selector: 'inn-number',
  imports: [],
  template: `
   {{value}}
  `,
  styles: ``
})
export class NumberComponent {
   @Input() value!: number;
}
