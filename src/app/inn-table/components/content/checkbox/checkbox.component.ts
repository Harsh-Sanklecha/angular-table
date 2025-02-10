import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InnTableService } from '../../../services/inn-table.service';

@Component({
  selector: 'inn-checkbox',
  imports: [FormsModule],
  template: `
  <input type="checkbox" [(ngModel)]="value" (ngModelChange)="valueChange.emit($event)" [disabled]="!metaData.editable">
  `,
  styles: `
    :host {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
    }
  `
})
export class CheckboxComponent {
  @Input() value: boolean = false;

  @Input()
  metaData!: { editable: boolean }

  @Output() valueChange = new EventEmitter<string>();

  constructor(
    private innTableService: InnTableService
  ) { }

  valueChanged() {
    this.innTableService.cellValueChanged$.next(this.value);
  }
}
