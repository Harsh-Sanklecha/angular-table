import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { InnTableService } from '../../../services/inn-table.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'inn-date',
  imports: [FormsModule],
  template: `
     @if (metaData.editable) {
      <input type="date" [(ngModel)]="value" (blur)="valueChanged()">
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
    }`
})
export class DateComponent implements OnInit {
  @Input() value: any;

  @Input()
  metaData!: { editable: boolean };

  @Output() valueChange = new EventEmitter<string>();

  ngOnInit(): void {
    if (this.value) {
      const date = new Date(this.value);
      this.value = date.toISOString().split('T')[0]; // Formats to 'YYYY-MM-DD'
    }
  }


  constructor(
    private innTableService: InnTableService
  ) { }

  valueChanged() {
    this.innTableService.cellValueChanged$.next(this.value);
  }

}
