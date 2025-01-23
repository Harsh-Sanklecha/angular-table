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
    { field: "make", pinned: 'left'},
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
    { field: "date", pinned: 'left' },
    { field: "electric", pinned: 'left' },
    { field: "electric" },
    { field: "electric" },
  ];

  rowData = [
    { make: "Tesla", model: "Model Y", price: 64950, date: new Date(), electric: true, horsePower: 100, country: 'USA' },
    { make: "Ford", model: "F-Series", price: 33850, electric: false },
    { make: "Toyota", model: "Corolla", price: 29600, electric: false },
    { make: "Tesla", model: "Model Y", price: 64950, date: new Date(), electric: true, horsePower: 100, country: 'USA' },
    { make: "Toyota", model: "Corolla", price: 29600, electric: false },
    { make: "Honda", model: "Civic", price: 25000, date: new Date(), electric: false, horsePower: 158, country: 'Japan' },
    { make: "BMW", model: "3 Series", price: 45000, date: new Date(), electric: false, horsePower: 255, country: 'Germany' },
    { make: "Hyundai", model: "Ioniq 5", price: 39950, date: new Date(), electric: true, horsePower: 225, country: 'South Korea' },
    { make: "Chevrolet", model: "Bolt", price: 31995, date: new Date(), electric: true, horsePower: 200, country: 'USA' },
    { make: "Volkswagen", model: "ID.4", price: 37495, date: new Date(), electric: true, horsePower: 201, country: 'Germany' }
  ];

  pinnedTopRowData: any[] = [
    { make: "BMW", model: "3 Series", price: 45000, date: new Date(), electric: false, horsePower: 255, country: 'Germany' },
    { make: "Audi", model: "e-tron", price: 65900, date: new Date(), electric: true, horsePower: 355, country: 'Germany' }
  ];

  pinnedBottomRowData: any[] = [
    // { make: "Toyota", model: "Corolla", price: 29600, electric: false },
  ];

}
