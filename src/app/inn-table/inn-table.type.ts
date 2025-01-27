export type CellData = string

export interface ValueGetter {
    colDef: ColDef
    data: any
}

export interface ValueFormatter<T> {
    value: T
}

export interface ColDef {
    field?: CellData
    headerName?: string
    parentHeader?: string
    children?: ProcessedColumn[]
    pinned?: 'left' | 'right'
    sortable?: boolean
    valueGetter?: (param: ValueGetter) => CellData
    valueFormatter?: (param: ValueFormatter<CellData>) => CellData
}

export interface ProcessedColumn extends ColDef {
    index: number
    layoutStyles?: Record<string, string | number>
    styles?: Record<string, string | number>
}

export type SortDirection = 'asc' | 'desc' | null;
