import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererComp, ICellRendererParams } from '../../inn-table.type';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements ICellRendererComp {
  params: any;

  innInit(params: ICellRendererParams): void {
    console.log(params)
  }

}
