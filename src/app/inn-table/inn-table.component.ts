import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { ColDef, ProcessedColumn, SortDirection } from './inn-table.type';
import { ColumnResizeDirective } from './directives/column-resize/column-resize.directive';
import { NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'app-inn-table',
  imports: [ColumnResizeDirective, NgTemplateOutlet],
  templateUrl: './inn-table.component.html',
  styleUrl: './inn-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InnTable implements OnChanges {
  @Input() columnDefs: ColDef[] = [];
  @Input() rowData: any[] = [];

  @Input() rowHeight: number = 48;
  @Input() columnWidth: number = 200;

  @ViewChild('headerContainer') headerContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('bodyContainer') bodyContainer!: ElementRef<HTMLDivElement>;

  leftPinnedWidth: number = 0;
  rightPinnedWidth: number = 0;

  _leftPinnedColumns: ProcessedColumn[] = []
  _centerColumns: ProcessedColumn[] = []
  _rightPinnedColumns: ProcessedColumn[] = []

  private currentSortColumn: ProcessedColumn | null = null;
  private currentSortDirection: SortDirection = null;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
  ) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['columnDefs'] || changes['data']) {
      this._initializeTable();
    }
  }

  private _initializeTable() {
    this._leftPinnedColumns = []
    this._centerColumns = []
    this._rightPinnedColumns = []

    // initiate table
    let centerPosition = 0;

    this.columnDefs.forEach((colDef, index) => {

      const processedColumn: ProcessedColumn = {
        ...colDef,
        index,
        width: this.columnWidth,
        position: 0 // Will be calculated based on pinning
      };

      switch (colDef.pinned) {
        case 'left':
          processedColumn.position = this.leftPinnedWidth;
          this._leftPinnedColumns.push(processedColumn);
          this.leftPinnedWidth += processedColumn.width;
          break;
        case 'right':
          processedColumn.position = this.rightPinnedWidth;
          this._rightPinnedColumns.push(processedColumn);
          this.rightPinnedWidth += processedColumn.width;
          break;
        default:
          processedColumn.position = centerPosition;
          this._centerColumns.push(processedColumn);
          centerPosition += processedColumn.width;
      }
    })
  }

  onColumnWidthChange(width: number, index: number, align: 'left' | 'center' | 'right') {
    // Update column width
    let column: ProcessedColumn[] = [];
    switch (align) {
      case 'left':
        column = this._leftPinnedColumns;
        this.leftPinnedWidth = column.reduce((acc, curr) => acc + curr.width, 0);
        break;
      case 'center':
        column = this._centerColumns;
        break;
      case 'right':
        column = this._rightPinnedColumns;
        this.rightPinnedWidth = column.reduce((acc, curr) => acc + curr.width, 0);
        break;
    }
    column[index].width = width;

    for (let i = index+1; i<column.length; i++) {
      column[i].position = column[i-1].position + column[i-1].width;
    }
  }

  headerScrolled($event: Event) {
    const target = $event.target as HTMLDivElement;
    this.bodyContainer.nativeElement.scrollLeft = target.scrollLeft
  }

  bodyScrolled($event: Event) {
    const target = $event.target as HTMLDivElement;
    this.headerContainer.nativeElement.scrollLeft = target.scrollLeft
  }

  onHeaderClick(event: Event, column: ProcessedColumn) {
    // Only allow sorting on sortable columns
    if (column.sortable === false) return;

    // Determine new sort direction
    if (this.currentSortColumn === column) {
      // Cycle through sort states
      this.currentSortDirection =
        this.currentSortDirection === null ? 'asc' :
          this.currentSortDirection === 'asc' ? 'desc' :
            null;
    } else {
      // New column, start with ascending
      this.currentSortColumn = column;
      this.currentSortDirection = 'asc';
    }

    // Sort the data
    this.sortData();
  }

  private sortData() {
    if (!this.currentSortColumn || !this.currentSortDirection) {
      // Reset to original data if no sorting
      return;
    }

    const field = this.currentSortColumn.field;
    const direction = this.currentSortDirection;

    this.rowData = [...this.rowData].sort((a, b) => {
      const valueA = a[field];
      const valueB = b[field];

      if (valueA == null) return direction === 'asc' ? 1 : -1;
      if (valueB == null) return direction === 'asc' ? -1 : 1;

      return direction === 'asc'
        ? (valueA > valueB ? 1 : -1)
        : (valueA < valueB ? 1 : -1);
    });
  }

}
