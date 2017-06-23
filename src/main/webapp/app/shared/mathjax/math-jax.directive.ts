import { Directive, ElementRef, Input, OnChanges } from '@angular/core';

@Directive({
    selector: '[jhiMathJax]'
})
export class MathJaxDirective implements OnChanges {

    @Input('jhiMathJax')
    jhiMathJax: string;

    constructor(private el: ElementRef) {
    }

    ngOnChanges() {
        this.el.nativeElement.innerHTML = this.jhiMathJax;
        MathJax.Hub.Queue(['Typeset', MathJax.Hub, this.el.nativeElement]);
    }
}
