import { Component } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { InnTable } from '../inn-table/inn-table.component';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { HeaderComponent } from '../inn-table/components/header/header.component';

@Component({
  selector: 'app-ag-grid',
  imports: [AgGridAngular, InnTable],
  templateUrl: './ag-grid.component.html',
  styleUrl: './ag-grid.component.scss'
})
export class AgGridComponent {
  private gridApi!: GridApi

  defaultColDef: ColDef = {
    editable: true,
  };

  // Column Definitions: Defines the columns to be displayed.
  colDefs: any[] = [
    { field: "make", pinned: 'left' },
    { field: "model", editable: true },
    { field: "price", cellRenderer: HeaderComponent },
    {
      headerName: 'Power & Country',
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
    { field: "date" },
    { field: "electric" }
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
    { make: "Volkswagen", model: "ID.4", price: 37495, date: new Date(), electric: true, horsePower: 201, country: 'Germany' },
    { make: "Porsche", model: "Taycan", price: 82700, date: new Date(), electric: true, horsePower: 402, country: 'Germany' },
    { make: "Mercedes", model: "EQS", price: 102310, date: new Date(), electric: true, horsePower: 516, country: 'Germany' },
    { make: "Kia", model: "EV6", price: 48700, date: new Date(), electric: true, horsePower: 320, country: 'South Korea' },
    { make: "Nissan", model: "Leaf", price: 27800, date: new Date(), electric: true, horsePower: 147, country: 'Japan' },
    { make: "Audi", model: "A4", price: 39100, date: new Date(), electric: false, horsePower: 201, country: 'Germany' },
    { make: "Lexus", model: "ES", price: 40000, date: new Date(), electric: false, horsePower: 203, country: 'Japan' },
    { make: "Mazda", model: "CX-5", price: 26250, date: new Date(), electric: false, horsePower: 187, country: 'Japan' },
    { make: "Subaru", model: "Outback", price: 27145, date: new Date(), electric: false, horsePower: 182, country: 'Japan' },
    { make: "Volvo", model: "XC40", price: 55300, date: new Date(), electric: true, horsePower: 402, country: 'Sweden' },
    { make: "Jaguar", model: "I-PACE", price: 69900, date: new Date(), electric: true, horsePower: 394, country: 'UK' },
    { make: "Polestar", model: "2", price: 48400, date: new Date(), electric: true, horsePower: 408, country: 'Sweden' },
    { make: "Lucid", model: "Air", price: 87400, date: new Date(), electric: true, horsePower: 480, country: 'USA' },
    { make: "Rivian", model: "R1T", price: 73000, date: new Date(), electric: true, horsePower: 835, country: 'USA' },
    { make: "Mini", model: "Cooper SE", price: 29900, date: new Date(), electric: true, horsePower: 181, country: 'UK' },
    { make: "Acura", model: "TLX", price: 37500, date: new Date(), electric: false, horsePower: 272, country: 'Japan' },
    { make: "Genesis", model: "GV60", price: 58890, date: new Date(), electric: true, horsePower: 429, country: 'South Korea' },
    { make: "Infiniti", model: "Q50", price: 42650, date: new Date(), electric: false, horsePower: 300, country: 'Japan' },
    { make: "Chrysler", model: "300", price: 31540, date: new Date(), electric: false, horsePower: 292, country: 'USA' },
    { make: "Cadillac", model: "LYRIQ", price: 62990, date: new Date(), electric: true, horsePower: 340, country: 'USA' },
    { make: "Maserati", model: "Ghibli", price: 76200, date: new Date(), electric: false, horsePower: 345, country: 'Italy' }
  ];

  pinnedTopRowData: any[] = [
    { make: "BMW", model: "3 Series", price: 45000, date: new Date(), electric: false, horsePower: 255, country: 'Germany', name: 'India' },
    { make: "Audi", model: "e-tron", price: 65900, date: new Date(), electric: true, horsePower: 355, country: 'Germany' }
  ];

  pinnedBottomRowData: any[] = [
    // { make: "Toyota", model: "Corolla", price: 29600, electric: false },
  ];

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }

  onFilterTextBoxChanged() {
    this.gridApi.setGridOption(
      "quickFilterText",
      (document.getElementById("filter-text-box") as HTMLInputElement).value,
    );
  }


}
