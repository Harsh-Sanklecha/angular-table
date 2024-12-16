import { Routes } from '@angular/router';

export const routes: Routes = [{
    path: '',
    loadComponent: () => import('./ag-grid/ag-grid.component').then(m => m.AgGridComponent),
}, {
    path: 'inn-table',
    loadComponent: () => import('./inn-table/inn-table.component').then(m => m.InnTable),
}];
