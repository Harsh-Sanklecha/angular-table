import { Component, Input } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { OverflowTooltipDirective } from '../../../directives/overflow-tooltip/overflow-tooltip.directive';
import { FormsModule } from '@angular/forms';


@Component({
  standalone: true,
  selector: 'inn-string-content',
  imports: [MatTooltipModule, OverflowTooltipDirective, FormsModule],
  template: `
    <!-- <span> {{value}}</span> -->
    <input type="text" [(ngModel)]="value" (blur)="onBlur()">
  `,
  styles: `
    :host {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
    }

    input {
      width: 100%;
      height: 100%;
      border: 1px solid transparent;
      background-color: transparent;
    }
  `
})
export class StringComponent {
  @Input() value: any;

  onBlur() {
  }

}
