import { Component, Input } from '@angular/core';
import { CellData } from '../../inn-table.type';

@Component({
  standalone: true,
  selector: 'app-inn-table-cell',
  imports: [],
  template: `
   <div class="label text-truncate-1">
      {{ value }}
    </div>
  `,
  styles: ``
})
export class InnTableCellComponent {
  @Input() value!: CellData

}
