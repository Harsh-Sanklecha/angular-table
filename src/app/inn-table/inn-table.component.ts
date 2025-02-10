import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import { ColDef, IRowSelection, ProcessedColumn, SortDirection } from './inn-table.type';
import { ColumnResizeDirective } from './directives/column-resize/column-resize.directive';
import { NgTemplateOutlet } from '@angular/common';
import { InnTableCellComponent } from './components/inn-table-cell/inn-table-cell.component';
import { FormsModule } from '@angular/forms';
import { InnTableService } from './inn-table.service';
import { MatMenuModule } from '@angular/material/menu';
import { cloneDeep } from '../shared/utils';

@Component({
  selector: 'app-inn-table',
  imports: [ColumnResizeDirective, InnTableCellComponent, NgTemplateOutlet, FormsModule, MatMenuModule],
  templateUrl: './inn-table.component.html',
  styleUrl: './inn-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InnTable implements OnChanges {
  @ViewChild('headerContainer') headerContainer!: ElementRef<HTMLDivElement>;
  @ViewChildren('bodyContainer') bodyContainers!: ElementRef<HTMLDivElement>[];

  @Input() rowModelType: 'clientSide' | 'serverSide' = 'clientSide';
  @Input() pinRows: boolean = false;

  @Input() columnDefs: ColDef[] = [];
  @Input() rowData: any[] = [];

  @Input() pinnedTopRowData: any[] = [];
  @Input() pinnedBottomRowData: any[] = [];

  @Input() rowHeight: number = 48;
  @Input() columnWidth: number = 200;

  @Input() rowSelection!: IRowSelection

  @Input() currentPage: number = 1;
  @Input() itemsPerPage: number = 20;
  @Input() totalItems: number = 0;

  filteredData: any[] = []

  searchTerm!: string

  leftPinnedWidth: number = 0;
  centerWidth: number = 0;
  rightPinnedWidth: number = 0;

  _leftColumnGroup: ProcessedColumn[] = []
  _centerColumnGroup: ProcessedColumn[] = []
  _rightColumnGroup: ProcessedColumn[] = []

  _leftPinnedColumns: ProcessedColumn[] = []
  _centerColumns: ProcessedColumn[] = []
  _rightPinnedColumns: ProcessedColumn[] = []

  currentSortColumn: ProcessedColumn | null = null;
  currentSortDirection: SortDirection = null;

  itemsPerPageOptions = [20, 50, 100];

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private innTableService: InnTableService
  ) { }


  get totalPages() {
    return Math.ceil(this.rowData.length / this.itemsPerPage);
  }

  get currentItemsCount() {
    return Math.min((this.itemsPerPage * this.currentPage), this.totalItems)
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['columnDefs'] || changes['rowData']) {
      this.rowData = this.rowData.map((each, index) => ({ ...each, id: index }))
      this.filteredData = this.paginatedData()

      this.#initializeTable();
    }
  }

  #convertCamelToTitleCase(str: string) {
    return str
      .replace(/([A-Z])/g, ' $1')  // Add space before uppercase letters
      .replace(/^./, match => match.toUpperCase()); // Capitalize first letter
  }
  
  get hasGroupedHeaders() {
    return this.columnDefs.some(colDef => colDef.children?.length);
  }

  #initializeTable() {
    this._leftPinnedColumns = []
    this._centerColumns = []
    this._rightPinnedColumns = []

    this._leftColumnGroup = []
    this._centerColumnGroup = []
    this._rightColumnGroup = []

    const formattedColumns = []
    const groupedColumns = []

    if (this.rowSelection || this.pinRows) {
      const width = 48 * 2
      groupedColumns.push({ layoutStyles: { width, top: 0, height: 0 } })
      formattedColumns.push({
        cellType: 'actions',
        layoutStyles: { width, top: 0 }
      })
    }

    const pinnedPositions = ['left', 'center', 'right'];
    const columns = cloneDeep(this.columnDefs);

    for(let i = 0; i< columns.length; i++) {
      const colDef = columns[i];
      colDef.formattedName = this.#convertCamelToTitleCase(colDef.field ?? '');

      // if the column has children then add group 
      if (colDef.children?.length) {
        colDef.formattedName = this.#convertCamelToTitleCase(colDef.headerName ?? '');

        const pinnedChildrenMap = {
          left: colDef.children.filter(child => child.pinned === 'left'),
          right: colDef.children.filter(child => child.pinned === 'right'),
          center: colDef.children.filter(child => !child.pinned)
        }

        pinnedPositions.forEach(pinned => {
          const children = pinned === 'center' ? pinnedChildrenMap.center : (pinnedChildrenMap as any)[pinned];

          if (children.length) {
            groupedColumns.push({
              ...colDef,
              cellType: 'grouped',
              index: i,
              field: colDef.headerName,
              children: colDef.children,
              pinned: pinned !== 'center' ? pinned : undefined,
              layoutStyles: {
                width: this.columnWidth * children.length,
                height: this.rowHeight,
                top: 0
              }
            });
          }
        })


        columns.splice(i + 1, 0, ...colDef.children.map(each => ({ ...each, parentHeader: colDef.headerName })))
      } else {
        if (!colDef.parentHeader) {
          groupedColumns.push({
            ...colDef,
            cellType: 'grouped',
            index: i,
            field: '',
            layoutStyles: { width: this.columnWidth, top: 0, height: 0 }
          })
        }

        let height = colDef.parentHeader ? this.rowHeight : 2 * this.rowHeight;
        if (!this.hasGroupedHeaders) height = this.rowHeight;

        formattedColumns.push({
          ...colDef,
          cellType: 'data',
          index: i,
          layoutStyles: { width: this.columnWidth, top: colDef.parentHeader ? this.rowHeight : 0, height }
        })
      }
    }

    this.#initializeHeader(groupedColumns)
    this.#initializeHeader(formattedColumns)

    this.#initializeRowData()
  }

  #initializeHeader(colDefs: any[]) {
    this.centerWidth = 0
    this.leftPinnedWidth = 0
    this.rightPinnedWidth = 0

    for(let i=0; i<colDefs.length; i++) {
      const colDef = colDefs[i];

      switch (colDef.pinned) {
        case 'left':
          this.pinColumnLeft(colDef)
          break;
        case 'right':
          this.pinColumnRight(colDef)
          break;
        default:
          this.centerColumn(colDef)
      }
    }
  }

  centerColumn(column: ProcessedColumn) {
    column.layoutStyles!['left'] = this.centerWidth
    this.centerWidth += column.layoutStyles!['width'] ?? this.columnWidth;
    
    const isGroupedHeader = column.cellType === 'grouped';
    if (isGroupedHeader) {
      this._centerColumnGroup.push(column);
    }else {
      this._centerColumns.push(column);
    }
  }

  pinColumnLeft(column: ProcessedColumn) {
    column.layoutStyles!['left'] = this.leftPinnedWidth
    this.leftPinnedWidth += column.layoutStyles!['width'] ?? this.columnWidth;

    const isGroupedHeader = column.cellType === 'grouped';
    if (isGroupedHeader) {
      this._leftColumnGroup.push(column);
    } else {
      this._leftPinnedColumns.push(column);
    }
  }

  pinColumnRight(column: ProcessedColumn) {
    column.layoutStyles!['left'] = this.rightPinnedWidth
    this.rightPinnedWidth += column.layoutStyles!['width'] ?? this.columnWidth;

    const isGroupedHeader = column.cellType === 'grouped';
    if (isGroupedHeader) {
      this._rightColumnGroup.push(column);
    } else {
      this._rightPinnedColumns.push(column);
    }
  }

  pinColumn(column: ProcessedColumn, pinned?: 'left' | 'right') {
    if (column.parentHeader) {
      const parentColumn = this.columnDefs.find(col => col.headerName === column.parentHeader)
      if(parentColumn?.children?.length) {
        parentColumn.children.find(child => child.field === column.field)!.pinned = pinned
      }
    }else {
      this.columnDefs.find(col => col.field === column.field)!.pinned = pinned
    }
    this.#initializeTable()
  }

  #initializeRowData() {
    this.filteredData = this.#transformRows(this.filteredData)
    this.pinnedTopRowData = this.#transformRows(this.pinnedTopRowData, 'top')

    if (!this.totalItems) {
      this.totalItems = this.rowData.length;
    }
  }

  #transformRows(rows: any[], pinned?: 'top' | 'bottom') {
    return rows.map((data, index) => ({
      ...data,
      ...(pinned ? {pinned} : {}),
      styles: { translateY: index * this.rowHeight }
    }))
  }

  onColumnWidthChange(width: number, index: number, header: ProcessedColumn) {
    if (header.children?.length) {
      this.onGroupedColumnWidthChange(width, header);
      return;
    }

    let columns: ProcessedColumn[] = [];
    let groupedColumns: ProcessedColumn[] = [];
    switch (header.pinned) {
      case 'left':
        columns = this._leftPinnedColumns;
        groupedColumns = this._leftColumnGroup;
        this.leftPinnedWidth = columns.reduce((acc, curr) => acc + (curr.layoutStyles?.['width'] ?? 0), 0);
        break;
      case 'right':
        columns = this._rightPinnedColumns;
        groupedColumns = this._rightColumnGroup;
        this.rightPinnedWidth = columns.reduce((acc, curr) => acc + (curr.layoutStyles?.['width'] ?? 0), 0);
        break;
      default:
        columns = this._centerColumns;
        groupedColumns = this._centerColumnGroup;
        this.centerWidth = columns.reduce((acc, curr) => acc + (curr.layoutStyles?.['width'] ?? 0), 0);
    }

    if(!columns.length) return;

    columns[index].layoutStyles!['width'] = width

    // Iteratively update the left position of the next columns
    for (let i = index + 1; i < columns.length; i++) {
      const lastColumn = columns[i - 1].layoutStyles as { [key: string]: number }
      (columns[i].layoutStyles)!['left'] = lastColumn['left'] + lastColumn['width']

      if (columns[i].parentHeader) {
        const groupColumn = groupedColumns.find(col => col.headerName === columns[i].parentHeader);
        const firstChild = columns.find(col => col.parentHeader === columns[i].parentHeader);

        if (groupColumn && firstChild) {
          groupColumn.layoutStyles!['left'] = firstChild.layoutStyles?.['left'] ?? 0
        }
      }
    }

    // Update the width of the group columnx
    if(header.parentHeader) {
      const groupColumnIndex = groupedColumns.findIndex(col => col.headerName === header.parentHeader);
      const groupColumn = groupedColumns[groupColumnIndex];
      const children = columns.filter(col => col.parentHeader === header.parentHeader);

      // Update the width of the group column by calculating the sum of the children
      groupColumn.layoutStyles!['width'] = children?.reduce((acc, curr) => acc + +(curr.layoutStyles?.['width'] ?? 0), 0)

      for (let i = groupColumnIndex + 1; i < groupedColumns.length; i++) {
        const lastColumn = groupedColumns[i - 1].layoutStyles as { [key: string]: number }
        groupedColumns[i].layoutStyles!['left'] = lastColumn?.['left'] + lastColumn?.['width']
      }
    }
  }

  onGroupedColumnWidthChange(width: number, header: ProcessedColumn) {
    let columns: ProcessedColumn[] = [];
    switch (header.pinned) {
      case 'left':
        columns = this._leftPinnedColumns;
        break;
      case 'right':
        columns = this._rightPinnedColumns
        break;
      default:
        columns = this._centerColumns
    }
    const children = columns.filter(col => col.parentHeader === header.headerName)

    for(const child of children) {
      const childIndex = columns.findIndex(col => col === child);
      this.onColumnWidthChange(width / children.length, childIndex, child);
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
    if(column.cellType === 'actions') return
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

  sortColumn(column: ProcessedColumn, direction: SortDirection) {
    this.currentSortColumn = column;
    this.currentSortDirection = direction;

    this.sortData();
  }

  private sortData() {
    if (!this.currentSortColumn) {
      return;
    }

    // Server Side Sorting
    if(this.rowModelType === 'serverSide') {
      this.innTableService.sortColumn$.next(this.currentSortDirection);
      return
    }

    if (!this.currentSortDirection) {
      // Reset to original data if no sorting
      this.filteredData = this.filteredData.map(data => ({ ...data, styles: { translateY: data.id * this.rowHeight } }));
      return;
    }

    const field = this.currentSortColumn.field;
    const direction = this.currentSortDirection;

    const sortedData = structuredClone(this.rowData).sort((a, b) => {
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

    this.filteredData = this.rowData.map(data => ({ ...data, styles: { translateY: translateYMapping.get(data.id) } }));
  }

  searchTextChanged() {
    // Server Side Filtering
    if(this.rowModelType === 'serverSide') {
      this.innTableService.searchText$.next(this.searchTerm);
      return
    }

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

  pinUnpinRowTop(row: any, index: number) {
    if(row.pinned) {
      row.pinned = undefined;
      this.filteredData.push(row);
      this.filteredData = this.#transformRows(this.filteredData);

      this.pinnedTopRowData.splice(index, 1);
      this.pinnedTopRowData = this.#transformRows(this.pinnedTopRowData);
    }else {
      row.pinned = 'top';
      this.pinnedTopRowData.push(row);
      this.pinnedTopRowData = this.#transformRows(this.pinnedTopRowData);
      
      this.filteredData.splice(index, 1);
      this.filteredData = this.#transformRows(this.filteredData);
    }
    this.onRowMouseLeave(row)
  }

  onRowMouseEntered(row: any) {
    row.hovered = true;
  }

  onRowMouseLeave(row: any) {
    row.hovered = false
  }

  paginatedData() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const data = this.rowData.slice(startIndex, startIndex + this.itemsPerPage);
    return this.#transformRows(data)
  }

  changePage(newPage: number) {
    if (newPage >= 1 && newPage <= this.totalPages) {
      this.currentPage = newPage;
      this.filteredData = this.paginatedData()
      this.innTableService.pagination$.next(this.currentPage);
    }
  }

  changeItemsPerPage(event: Event) {
    this.itemsPerPage = Number((event.target as HTMLSelectElement).value);
    this.currentPage = 1;
  }


}
