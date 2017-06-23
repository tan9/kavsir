import { Directive, ElementRef, Input, OnChanges } from '@angular/core';

/**
 * Directive for MathJax rendering.
 *
 * @see https://stackoverflow.com/a/36371349/3440376
 */
@Directive({
    selector: '[jhiMathJax]'
})
export class MathJaxDirective implements OnChanges {

    @Input() jhiMathJax: string;

    constructor(private el: ElementRef) {
    }

    ngOnChanges() {
        this.el.nativeElement.innerHTML = this.jhiMathJax;
        MathJax.Hub.Queue(['Typeset', MathJax.Hub, this.el.nativeElement]);
    }
}
