import { Component, Input } from '@angular/core';
import { ResourceImage } from '../../entities/resource-image/resource-image.model';
@Component({
    selector: 'jhi-markup-render',
    templateUrl: './markup-render.component.html'
})
export class MarkupRenderComponent {

    @Input() images: ResourceImage[] = [];

    @Input() text: string;

    escape(text: string): string {
        if (text) {
            return text.replace(/(\\\[.*?\\])|(\\\(.*?\\\))|(<)|(>)/g,
                (match, latexBlock, latexInline, lt, gt) => {
                    if (latexBlock) {
                        return latexBlock;
                    }
                    if (latexInline) {
                        return latexInline;
                    }
                    if (lt) {
                        return '&lt;';
                    }
                    if (gt) {
                        return '&gt;';
                    }
                }).replace(/\n/g, '<br>');
        }
        return text;
    }

}
