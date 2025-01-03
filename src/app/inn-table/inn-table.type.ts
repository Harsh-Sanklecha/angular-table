export interface ColDef {
    field?: string
    headerName?: string
    parentHeader?: string
    children?: ProcessedColumn[]
    pinned?: 'left' | 'right'
    sortable?: boolean
}

export interface ProcessedColumn extends ColDef {
    index: number
    layoutStyles?: Record<string, string | number>
    styles?: Record<string, string | number>
}

export type SortDirection = 'asc' | 'desc' | null;