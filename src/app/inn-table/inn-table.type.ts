import { Component } from "@angular/core"

export type CellData = string

export interface ValueGetter {
    colDef: ColDef
    data: any
}

export interface ValueFormatter<T> {
    value: T
}

interface BaseColumn {
    field?: CellData
    headerName?: string
    pinned?: 'left' | 'right'
    sortable?: boolean
    dataType?: CELL_DATA_TYPE
    editable?: boolean
}

export interface ColDef {
    field?: CellData
    formattedName?: string
    headerName?: string
    parentHeader?: string
    children?: ProcessedColumn[]
    pinned?: 'left' | 'right'
    sortable?: boolean
    dataType?: CELL_DATA_TYPE
    editable?: boolean
    valueGetter?: (param: ValueGetter) => CellData
    valueFormatter?: (param: ValueFormatter<CellData>) => CellData
    cellRenderer?: any
}

export interface ProcessedColumn extends ColDef {
    cellType: 'grouped' | 'data' | 'actions'
    index: number
    layoutStyles?: Record<string, number>
}

export type SortDirection = 'asc' | 'desc' | null;

export interface IRowSelection {
    mode: 'singleRow' | 'multiRow'
}

export enum CELL_DATA_TYPE {
    STRING = 'string',
    NUMBER = 'number',
    DATE = 'date',
    BOOLEAN = 'boolean',
    COMPONENT = 'component'
}

export interface ICellRendererParams {
    value: any
    data: any
    colDef: ColDef
}

export interface ICellRendererComp {
    innInit?(params: ICellRendererParams): void
}
