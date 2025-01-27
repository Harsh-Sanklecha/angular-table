import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import { ColDef, ProcessedColumn, SortDirection } from './inn-table.type';
import { ColumnResizeDirective } from './directives/column-resize/column-resize.directive';
import { JsonPipe, NgStyle, NgTemplateOutlet } from '@angular/common';
import { InnTableCellComponent } from './components/inn-table-cell/inn-table-cell.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-inn-table',
  imports: [ColumnResizeDirective, InnTableCellComponent, NgTemplateOutlet, NgStyle, FormsModule],
  templateUrl: './inn-table.component.html',
  styleUrl: './inn-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InnTable implements OnChanges {
  @Input() columnDefs: ColDef[] = [];
  @Input() rowData: any[] = [];

  @Input() pinnedTopRowData: any[] = [];
  @Input() pinnedBottomRowData: any[] = [];

  @Input() rowHeight: number = 48;
  @Input() columnWidth: number = 200;

  @Input() currentPage: number = 1;
  @Input() itemsPerPage: number = 10;
  
  @ViewChild('dynamicCellContainer') dynamicCellContainer!: ElementRef<HTMLDivElement>;

  @ViewChild('headerContainer') headerContainer!: ElementRef<HTMLDivElement>;
  @ViewChildren('bodyContainer') bodyContainers!: ElementRef<HTMLDivElement>[];

  filteredData: any[] = []

  searchTerm!: string

  leftPinnedWidth: number = 0;
  rightPinnedWidth: number = 0;

  _centerColumnGroup: ProcessedColumn[] = []

  _leftPinnedColumns: ProcessedColumn[] = []
  _centerColumns: ProcessedColumn[] = []
  _rightPinnedColumns: ProcessedColumn[] = []

  currentSortColumn: ProcessedColumn | null = null;
  currentSortDirection: SortDirection = null;

  itemsPerPageOptions = [10, 20, 50, 100];

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
  ) { }

  private hasHeader: boolean = false

  get totalPages() {
    return Math.ceil(this.filteredData.length / this.itemsPerPage);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['columnDefs'] || changes['rowData']) {
      this.hasHeader = this.columnDefs.some(colDef => colDef.children?.length);
      this.filteredData = structuredClone(this.rowData);

      this.#initializeTable();

    }
  }

  #initializeTable() {
    this._leftPinnedColumns = []
    this._centerColumns = []
    this._rightPinnedColumns = []

    // initiate table
    let centerPosition = 0;

    for (let i = 0; i < this.columnDefs.length; i++) {
      const colDef = this.columnDefs[i];
      if (colDef.children?.length) {

        this._centerColumnGroup.push({ 
          ...colDef, 
          field: colDef.headerName,
          index: i,
          styles: { 
            width: `${this.columnWidth * colDef.children.length}px`, 
            left: `${centerPosition}px`, 
            top: '0px',
            height: `${this.rowHeight}px`
          } });
        this.columnDefs.splice(i + 1, 0, ...colDef.children.map(each => ({...each, parentHeader: colDef.headerName}))); // TODO: Parent header should be changed to index or reference
      } else {
        const processedColumn: ProcessedColumn = { ...colDef, index: i };
        switch (colDef.pinned) {
          case 'left':
            processedColumn.layoutStyles = {
              width: `${this.columnWidth}px`,
              left: `${this.leftPinnedWidth}px`,
            }
            processedColumn.styles = {
              top: this.hasHeader && colDef.parentHeader ? `${this.rowHeight}px` : '0px',
              height: this.hasHeader && colDef.parentHeader ? `${this.rowHeight}px` : `100%`
            };
            this._leftPinnedColumns.push(processedColumn);
            this.leftPinnedWidth += this.columnWidth;
            break;
          case 'right':
            processedColumn.layoutStyles = {
              width: `${this.columnWidth}px`,
              left: `${this.rightPinnedWidth}px`,
            }
            processedColumn.styles = {
              top: this.hasHeader && colDef.parentHeader ? `${this.rowHeight}px` : '0px',
              height: this.hasHeader && colDef.parentHeader ? `${this.rowHeight}px` : `100%`
            };
            this._rightPinnedColumns.push(processedColumn);
            this.rightPinnedWidth += this.columnWidth;
            break;
          default:
            processedColumn.layoutStyles = {
              width: `${this.columnWidth}px`,
              left: `${centerPosition}px`,
            }
            processedColumn.styles = {
              top: this.hasHeader && colDef.parentHeader ? `${this.rowHeight}px` : '0px',
              height: this.hasHeader && colDef.parentHeader ? `${this.rowHeight}px` : `100%`
            };
            this._centerColumns.push(processedColumn);
            centerPosition += this.columnWidth;
        }
      }
    }

    this.#initializeRowData()
  }

  #initializeRowData() {
    this.filteredData = this.#transformRowCells(this.filteredData)
    this.pinnedTopRowData = this.#transformRowCells(this.pinnedTopRowData)
  }

  #transformRowCells(rows: any[]) {
    return rows.map((data, index) => {
      const transformedData = { ...data }

      Object.keys(transformedData).forEach(key => {
        const colDef = this.columnDefs.find(col => col.field === key);
        if (!colDef) return;

        let value = transformedData[key];

        // Apply valueGetter if defined
        if (colDef.valueGetter) {
          if (typeof colDef.valueGetter !== 'function') {
            throw new Error('valueGetter should be a function');
          }
          value = colDef.valueGetter({ colDef, data: transformedData });
        }

        // Apply valueFormatter if defined
        if (colDef.valueFormatter) {
          if (typeof colDef.valueFormatter !== 'function') {
            throw new Error('valueFormatter should be a function');
          }
          value = colDef.valueFormatter({ value });
        }

        transformedData[key] = value
      })
      return { 
        ...transformedData, 
        id: index, 
        styles: { translateY: index * this.rowHeight } 
      }
    });
  }

  #createDynamicComponent() {
    
  }

  onColumnWidthChange(width: number, index: number, align: 'left' | 'center' | 'right', header: ProcessedColumn) {
    if (header.children?.length) {
      this.onGroupedColumnWidthChange(width, index, header);
      return;
    }

    let column: ProcessedColumn[] = [];
    switch (align) {
      case 'left':
        column = this._leftPinnedColumns;
        this.leftPinnedWidth = column.reduce((acc, curr) => acc + +((curr.styles?.['width'] as string)?.replace('px', '') ?? 0), 0);
        break;
      case 'center':
        column = this._centerColumns;
        break;
      case 'right':
        column = this._rightPinnedColumns;
        this.rightPinnedWidth = column.reduce((acc, curr) => acc + +((curr.styles?.['width'] as string)?.replace('px', '') ?? 0), 0);
        break;
    }
    (column[index].layoutStyles as { [key: string]: any })['width'] = width + 'px';

    for (let i = index + 1; i < column.length; i++) {
      const lastColumn = column[i - 1].layoutStyles as { [key: string]: any }
      (column[i].layoutStyles as { [key: string]: any })['left'] = +(lastColumn?.['left']?.replace('px', '') ?? 0) + +(lastColumn?.['width']?.replace('px', '') || 0) + 'px';

      if (column[i].parentHeader) {
        const groupColumn = this._centerColumnGroup.find(col => col.headerName === column[i].parentHeader);
        const firstChild = this._centerColumns.find(col => col.parentHeader === column[i].parentHeader);

        if (groupColumn && firstChild) {      
          groupColumn.styles = {
            ...groupColumn.styles,
            left: firstChild.layoutStyles?.['left'] as string
          }
        }
      }
    }

    if(header.parentHeader) {
      const groupColumnIndex = this._centerColumnGroup.findIndex(col => col.headerName === header.parentHeader); // TODO Change to index or reference
      const groupColumn = this._centerColumnGroup[groupColumnIndex];
      const children = this._centerColumns.filter(col => col.parentHeader === header.parentHeader);

      if(groupColumn) {
        groupColumn.styles = {
          ...groupColumn.styles,
          width: children?.reduce((acc, curr) => acc + +((curr.layoutStyles?.['width'] as string)?.replace('px', '') ?? 0), 0) + 'px'
        }

        for (let i = groupColumnIndex + 1; i < this._centerColumnGroup.length; i++) {
          const lastColumn = this._centerColumnGroup[i - 1].styles as { [key: string]: any }
          (this._centerColumnGroup[i].styles as { [key: string]: any })['left'] = +(lastColumn?.['left']?.replace('px', '') ?? 0) + +(lastColumn?.['width']?.replace('px', '') || 0) + 'px';
        }
      }
    }
  }

  onGroupedColumnWidthChange(width: number, index: number, header: ProcessedColumn) {
    const children = this._centerColumns.filter(col => col.parentHeader === header.headerName)

    for(const child of children) {
      const childIndex = this._centerColumns.findIndex(col => col === child);
      this.onColumnWidthChange(width / 2, childIndex, 'center', child);
    }
  }

  headerScrolled($event: Event) {
    const target = $event.target as HTMLDivElement;
    this.bodyContainers.forEach(bodyContainer => bodyContainer.nativeElement.scrollLeft = target.scrollLeft);
  }

  bodyScrolled($event: Event) {
    const target = $event.target as HTMLDivElement;
    this.headerContainer.nativeElement.scrollLeft = target.scrollLeft
  }

  onHeaderClick(event: Event, column: ProcessedColumn) {
    if (column.sortable === false) return;

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
    if (!this.currentSortColumn) {
      return;
    }

    if (!this.currentSortDirection) {
      // Reset to original data if no sorting
      this.filteredData = this.filteredData.map(data => ({ ...data, styles: { translateY: data.id * this.rowHeight } }));
      return;
    }

    const field = this.currentSortColumn.field;
    const direction = this.currentSortDirection;

    const sortedData = structuredClone(this.filteredData).sort((a, b) => {
      const valueA = a[field ?? ''];
      const valueB = b[field ?? ''];

      if (valueA == null) return direction === 'asc' ? 1 : -1;
      if (valueB == null) return direction === 'asc' ? -1 : 1;

      return direction === 'asc'
        ? (valueA > valueB ? 1 : -1)
        : (valueA < valueB ? 1 : -1);
    });

    const translateYMapping = new Map<number, number>();
    sortedData.forEach((data, index) => translateYMapping.set(data.id, index * this.rowHeight));

    this.filteredData = this.filteredData.map(data => ({ ...data, styles: { translateY: translateYMapping.get(data.id) } }));
  }

  getCombinedHeaderStyles(column: ProcessedColumn) {
    return {
      ...column.layoutStyles,
      ...column.styles
    }
  }

  searchTextChanged() {
    if (!this.searchTerm) {
      this.filteredData = structuredClone(this.rowData)
    }else { 
      this.filteredData = structuredClone(this.rowData).filter(item =>
        Object.values(item).some(value =>
          value != null && value.toString().toLowerCase().includes(this.searchTerm.toLowerCase())
        )
      )
    }

    this.currentPage = 1
    this.#initializeRowData()
  }

  get paginatedData() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredData.slice(startIndex, startIndex + this.itemsPerPage);
  }


  changePage(newPage: number) {
    if (newPage >= 1 && newPage <= this.totalPages) {
      this.currentPage = newPage;
    }
  }

  changeItemsPerPage(event: Event) {
    this.itemsPerPage = Number((event.target as HTMLSelectElement).value);
    this.currentPage = 1;
  }


}
