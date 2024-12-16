export interface ColDef {
    field: string
    pinned?: 'left' | 'right'
}

export interface ProcessedColumn extends ColDef {
    index: number
    width: number
    position: number
    sortable?: boolean
}

type SortDirection = 'asc' | 'desc' | null;