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

  rowData = [
    { make: "Tesla", model: "Model Y", price: 64950, date: new Date(), electric: true },
    { make: "Ford", model: "F-Series", price: 33850, electric: false },
    { make: "Toyota", model: "Corolla", price: 29600, electric: false },
  ];

  // Column Definitions: Defines the columns to be displayed.
  colDefs: any[] = [
    // {
    //   headerName: 'Name & Country',
    //   children: [
    //     { field: 'athlete' },
    //     { field: 'country' }
    //   ]
    // },
    { field: "make", pinned: 'left' },
    { field: "model" },
    { field: "price" },
    { field: "date", pinned: 'right' },
    { field: "electric" },
    { field: "electric" },
    { field: "electric" },
    { field: "electric" },
    { field: "electric" },
    { field: "electric" },
    { field: "electric" },
  ];

}
