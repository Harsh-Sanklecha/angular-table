import { Directive, ElementRef, Input, OnInit, OnDestroy, Renderer2, Output, EventEmitter } from '@angular/core';
import { fromEvent, Subject, takeUntil, switchMap, map, tap } from 'rxjs';

interface ProcessedColumnDefinition {
  field: string;
  width: number;
  position: number;
}

@Directive({
  selector: '[innColumnResize]'
})
export class ColumnResizeDirective implements OnInit, OnDestroy {
  @Input('innColumnResize') column!: ProcessedColumnDefinition;
  @Input() minWidth = 50;
  @Input() maxWidth = 500;

  @Output() columnWidthChange = new EventEmitter<number>();

  private resizeHandle!: HTMLDivElement;
  private destroy$ = new Subject<void>();

  constructor(
    private el: ElementRef<HTMLDivElement>,
    private renderer: Renderer2
  ) { }

  ngOnInit() {
    this.createResizeHandle();
    this.setupResizeEvents();
  }

  private createResizeHandle() {
    this.resizeHandle = this.renderer.createElement('div');
    this.renderer.addClass(this.resizeHandle, 'column-resize-handle'); // Styles in inn-table.component.scss

    this.renderer.appendChild(this.el.nativeElement, this.resizeHandle);
  }

  private setupResizeEvents() {
    // Mouse down event on resize handle
    const mouseDown$ = fromEvent<MouseEvent>(this.resizeHandle, 'mousedown').pipe(
      tap(event => event.preventDefault()),
      map(event => ({
        startX: event.pageX,
        startWidth: this.el.nativeElement.offsetWidth
      }))
    );

    const mouseMove$ = fromEvent<MouseEvent>(document, 'mousemove');
    const mouseUp$ = fromEvent<MouseEvent>(document, 'mouseup');

    mouseDown$.pipe(
      switchMap(start =>
        mouseMove$.pipe(
          takeUntil(mouseUp$),
          map(moveEvent => ({
            deltaX: moveEvent.pageX - start.startX,
            startWidth: start.startWidth
          }))
        )
      ),
      map(resize => {
        return Math.max(this.minWidth, Math.min(resize.startWidth + resize.deltaX, this.maxWidth))
      }),
      tap(newWidth => {
        // Emit Event to Parent to update column width
        this.columnWidthChange.emit(newWidth);
      }),
      takeUntil(this.destroy$)
    ).subscribe();
  }

  ngOnDestroy() {
    if (this.resizeHandle) {
      this.renderer.removeChild(this.el.nativeElement, this.resizeHandle);
    }
    this.destroy$.next();
    this.destroy$.complete();
  }
}