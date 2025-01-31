import { AfterViewInit, Component, Input, OnChanges, SimpleChanges, Type, ViewChild, ViewContainerRef } from '@angular/core';
import { CELL_DATA_TYPE, ColDef, ICellRendererComp } from '../../inn-table.type';
import { FormsModule } from '@angular/forms';
import { StringComponent } from '../content/string/string.component';
import { NumberComponent } from '../content/number/number.component';
import { CheckboxComponent } from '../content/checkbox/checkbox.component';
import { DateComponent } from '../content/date/date.component';

interface CellComponent extends ICellRendererComp {
  value: any;
  metaData: {
    editable: boolean;
  }
}

@Component({
  standalone: true,
  selector: 'inn-table-cell',
  imports: [FormsModule],
  template: `
    <ng-container #cellContainer></ng-container>
  `,
  styles: `
    :host {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      padding: 2px 8px;
    }
  `
})
export class InnTableCellComponent implements AfterViewInit, OnChanges {
  @ViewChild('cellContainer', { read: ViewContainerRef })
  container!: ViewContainerRef;

  @Input()
  value: any;

  @Input()
  rowData: any

  @Input()
  colDef!: ColDef

  ngOnChanges(changes: SimpleChanges) {
    this.#transformCellValue()
  }

  ngAfterViewInit(): void {
    this.#transformCellValue()
  }

  getDataType() {
    switch (typeof this.value) {
      case 'number':
        return CELL_DATA_TYPE.NUMBER;
      case 'boolean':
        return CELL_DATA_TYPE.BOOLEAN;
      case 'object':
        return CELL_DATA_TYPE.DATE;
      default:
        return CELL_DATA_TYPE.STRING;
    }
  }

  getComponentFromType(dataType: CELL_DATA_TYPE): Type<CellComponent> {
    switch (dataType) {
      case CELL_DATA_TYPE.NUMBER:
        return NumberComponent;
      case CELL_DATA_TYPE.BOOLEAN:
        return CheckboxComponent;
      case CELL_DATA_TYPE.DATE:
        return DateComponent;
      default:
        return StringComponent;
    }
  }

  #transformCellValue() {
    // Apply valueGetter if defined
    if (this.colDef.valueGetter) {
      if (typeof this.colDef.valueGetter !== 'function') {
        throw new Error('valueGetter should be a function');
      }
      this.value = this.colDef.valueGetter({ colDef: this.colDef, data: this.rowData });
    }

    // Apply valueFormatter if defined
    if (this.colDef.valueFormatter) {
      if (typeof this.colDef.valueFormatter !== 'function') {
        throw new Error('valueFormatter should be a function');
      }
      this.value = this.colDef.valueFormatter({ value: this.value });
    }

    const metaData = {
      editable: !!this.colDef.editable
    }
    // Apply cellRenderer if defined
    if (this.colDef.cellRenderer) {
      return this.renderComponent(this.colDef.cellRenderer, metaData);
    }

    const _component = this.getComponentFromType(this.colDef.dataType ?? this.getDataType());
    this.renderComponent(_component, metaData);
    
  }

  renderComponent<C extends CellComponent>(component: Type<C>, metaData: any) {
    if (this.container) {
      this.container.clear();
      const componentRef = this.container.createComponent(component)
      componentRef.instance.value = this.value;
      componentRef.instance.metaData = metaData;

      // Initialize with params via innInit
      if (componentRef.instance.innInit) {
        componentRef.instance.innInit({ value: this.value, data: this.rowData, colDef: this.colDef });
      }
    }
  }

}
