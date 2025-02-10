import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';
import { InnTableService } from '../../../services/inn-table.service';


@Component({
  standalone: true,
  selector: 'inn-string-content',
  imports: [MatTooltipModule, FormsModule],
  template: `
    @if (metaData.editable) {
      <input type="text" [(ngModel)]="value" (blur)="valueChanged()">
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
  metaData!: { editable: boolean };

  @Output() valueChange = new EventEmitter<string>();

  constructor(
    private innTableService: InnTableService
  ) { }

  valueChanged() {
    this.innTableService.cellValueChanged$.next(this.value);
  }

}
