import { AfterViewInit, Component, Input, Type, ViewChild, ViewContainerRef } from '@angular/core';
import { ICellParams } from '../../inn-table.type';
import { FormsModule } from '@angular/forms';
import { StringComponent } from '../content/string/string.component';
import { NumberComponent } from '../content/number/number.component';
import { CheckboxComponent } from '../content/checkbox/checkbox.component';
import { DateComponent } from '../content/date/date.component';

interface CellComponent {
  value: any;
  editable: boolean;
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
export class InnTableCellComponent implements AfterViewInit {
  @ViewChild('cellContainer', { read: ViewContainerRef }) container!: ViewContainerRef;

  @Input() value: any;
  @Input() params!: ICellParams;

  ngAfterViewInit(): void {
    if (this.params.dataType) {
      // this.dataType = this.params.dataType;
    } else {
      switch (typeof this.value) {
        case 'number':
          this.renderComponent(NumberComponent);
          break;
        case 'boolean':
          this.renderComponent(CheckboxComponent)
          break;
        case 'object':
          this.renderComponent(DateComponent)
          break;
        default:
          this.renderComponent(StringComponent);
          break;
      }
    }
  }

  renderComponent<C extends CellComponent>(component: Type<C>) {
    if (this.container) {
      this.container.clear();
      const componentRef = this.container.createComponent(component)
      componentRef.instance.value = this.value;
      componentRef.instance.editable = this.params.editable;
    }
  }

}
