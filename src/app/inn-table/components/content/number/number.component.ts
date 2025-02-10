import { Component, EventEmitter, Input, Output } from '@angular/core';
import { InnTableService } from '../../../services/inn-table.service';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'inn-number',
  imports: [FormsModule],
  template: `
   @if (metaData.editable) {
      <input type="number" [(ngModel)]="value" (blur)="valueChanged()">
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
export class NumberComponent {
  @Input() value!: number;

  @Input()
  metaData!: { editable: boolean };

  @Output() valueChange = new EventEmitter<string>();

  constructor(
    private innTableService: InnTableService
  ) { }

  valueChanged() {
    this.innTableService.cellValueChanged$.next(this.value);
  }

}
