import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { OverflowTooltipDirective } from '../../../directives/overflow-tooltip/overflow-tooltip.directive';
import { FormsModule } from '@angular/forms';
import { InnTableService } from '../../../inn-table.service';


@Component({
  standalone: true,
  selector: 'inn-string-content',
  imports: [MatTooltipModule, OverflowTooltipDirective, FormsModule],
  template: `
    @if (editable) {
      <input type="text" [(ngModel)]="value" (blur)="onBlur()">
    }@else {
      <span> {{value}}</span>
    }
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

  @Input()
  editable = false;

  @Output() valueChange = new EventEmitter<string>();

  constructor(
    private innTableService: InnTableService
  ) { }

  onBlur() {
    this.innTableService.cellValueChanged$.next(this.value);
  }

}
