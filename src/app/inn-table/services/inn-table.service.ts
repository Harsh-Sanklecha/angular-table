import { Injectable } from '@angular/core';
import { SortDirection } from 'ag-grid-community';
import { Subject } from 'rxjs';

@Injectable({providedIn: 'root'})
export class InnTableService {
    searchText$ = new Subject<string>();
    sortColumn$ = new Subject<SortDirection>();
    pagination$ = new Subject<number>();

    cellValueChanged$ = new Subject<any>()

    constructor() { }
    
}