import { Component } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { InnTable } from '../inn-table/inn-table.component';
import { ColDef } from 'ag-grid-community';

@Component({
  selector: 'app-ag-grid',
  imports: [AgGridAngular, InnTable],
  templateUrl: './ag-grid.component.html',
  styleUrl: './ag-grid.component.scss'
})
export class AgGridComponent {
  defaultColDef: ColDef = {
    editable: true,
  };

  // Column Definitions: Defines the columns to be displayed.
  colDefs: any[] = [
    { field: "make", pinned: 'left' },
    { field: "model" },
    { field: "price" },
    {
      headerName: 'Name & Country',
      children: [
        { field: 'horsePower' },
        { field: 'country' },
      ],
    },
    {
      headerName: 'Names & Country',
      children: [
        { field: 'name' },
        { field: 'country' },
      ],
    },
    { field: "date", pinned: 'right' },
    { field: "electric" },
    { field: "electric" },
    { field: "electric" },
  ];

  rowData = [
    { make: "Tesla", model: "Model Y", price: 64950, date: new Date(), electric: true, horsePower: 100, country: 'USA' },
    { make: "Ford", model: "F-Series", price: 33850, electric: false },
    { make: "Toyota", model: "Corolla", price: 29600, electric: false },
  ];

  pinnedTopRowData: any[] = [
    { make: "Toyota", model: "Corolla", price: 29600, electric: false },
  ];

  pinnedBottomRowData: any[] = [
    // { make: "Toyota", model: "Corolla", price: 29600, electric: false },
  ];


}
