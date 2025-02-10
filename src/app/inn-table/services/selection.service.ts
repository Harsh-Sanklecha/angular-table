import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface SelectionState<T> {
    selectedRows: Set<T>;
    isMultiSelectMode: boolean;
    isAllSelected: boolean;
    isIndeterminate: boolean;
}

export interface SelectionEvent<T> {
    value: T;
    data: T[];
}

@Injectable({ providedIn: 'root'})
export class SelectionService<T extends { id: string | number }> {
    private state: SelectionState<T> = {
        selectedRows: new Set(),
        isMultiSelectMode: false,
        isAllSelected: false,
        isIndeterminate: false
    };

    private selectionState$ = new BehaviorSubject<SelectionState<T>>(this.state);
    private selectionEvent$ = new BehaviorSubject<SelectionEvent<T> | null>(null);

    // Observables for components to subscribe to
    selection$ = this.selectionState$.asObservable();
    selectionChange$ = this.selectionEvent$.asObservable();

    toggleSelectionMode(isMultiSelect: boolean) {
        this.state.isMultiSelectMode = isMultiSelect;
        if (!isMultiSelect) {
            this.state.selectedRows.clear();
            this.state.isAllSelected = false;
            this.state.isIndeterminate = false;
        }
        this.emitState();
    }

    toggleRowSelection(row: T, currentPageRows: T[]) {
        if (this.state.isMultiSelectMode) {
            const existingRow = Array.from(this.state.selectedRows)
                .find(r => r.id === row.id);

            if (existingRow) {
                this.state.selectedRows.delete(existingRow);
            } else {
                this.state.selectedRows.add(row);
            }
            this.updateParentCheckboxState(currentPageRows);
        } else {
            // Single select mode
            this.state.selectedRows.clear();
            this.state.selectedRows.add(row);
        }

        this.emitState();
        this.emitSelectionEvent(row);
    }

    toggleAllSelection(currentPageRows: T[]) {
        if (!this.state.isMultiSelectMode) return;

        if (this.state.isAllSelected) {
            // Deselect all current page rows
            currentPageRows.forEach(row => {
                const existingRow = Array.from(this.state.selectedRows)
                    .find(r => r.id === row.id);
                if (existingRow) {
                    this.state.selectedRows.delete(existingRow);
                }
            });
            this.state.isAllSelected = false;
            this.state.isIndeterminate = false;
        } else {
            // Select all current page rows
            currentPageRows.forEach(row => {
                const existingRow = Array.from(this.state.selectedRows)
                    .find(r => r.id === row.id);
                if (!existingRow) {
                    this.state.selectedRows.add(row);
                }
            });
            this.state.isAllSelected = true;
            this.state.isIndeterminate = false;
        }

        this.emitState();
        this.emitSelectionEvent(null);
    }

    updateParentCheckboxState(currentPageRows: T[]) {
        const selectedOnCurrentPage = currentPageRows.filter(row =>
            Array.from(this.state.selectedRows).some(r => r.id === row.id)
        );

        this.state.isAllSelected = selectedOnCurrentPage.length === currentPageRows.length;
        this.state.isIndeterminate = selectedOnCurrentPage.length > 0 &&
            selectedOnCurrentPage.length < currentPageRows.length;
    }

    getSelectedRows(): T[] {
        return Array.from(this.state.selectedRows);
    }

    clearSelection() {
        this.state.selectedRows.clear();
        this.state.isAllSelected = false;
        this.state.isIndeterminate = false;
        this.emitState();
        this.emitSelectionEvent(null);
    }

    private emitState() {
        this.selectionState$.next({ ...this.state });
    }

    private emitSelectionEvent(currentRow: T | null) {
        this.selectionEvent$.next({
            value: currentRow!,
            data: Array.from(this.state.selectedRows)
        });
    }
}