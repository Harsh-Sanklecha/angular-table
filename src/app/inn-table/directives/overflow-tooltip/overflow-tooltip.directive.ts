import { AfterViewInit, Directive, ElementRef, Input } from '@angular/core';
import { MatTooltip } from '@angular/material/tooltip';

@Directive({
    selector: '[overflowTooltip]',
    hostDirectives: [{
        directive: MatTooltip,
        inputs: ['matTooltipPosition: tooltipPosition', 'matTooltipShowDelay', 'matTooltipHideDelay']
    }]
})
export class OverflowTooltipDirective implements AfterViewInit {
    @Input() tooltipPosition: 'above' | 'below' | 'left' | 'right' = 'above';

    constructor(
        private elementRef: ElementRef,
        private matTooltip: MatTooltip
    ) { }

    ngAfterViewInit() {
        const element = this.elementRef.nativeElement;
        // element.style.overflow = 'hidden';
        // element.style.textOverflow = 'ellipsis';
        // element.style.whiteSpace = 'nowrap';

        // Check for overflow
        if (element.scrollWidth > element.clientWidth) {
            this.matTooltip.message = element.textContent || '';
            this.matTooltip.disabled = false;
        } else {
            this.matTooltip.message = element.textContent || '';
            this.matTooltip.disabled = true;
        }

        // Added resize observer to handle dynamic content changes
        const resizeObserver = new ResizeObserver(() => {
            this.matTooltip.disabled = !(element.scrollWidth > element.clientWidth);
        });

        resizeObserver.observe(element);
    }
}