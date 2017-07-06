import { Component, Input } from '@angular/core';
import { ResourceImage } from '../../entities/resource-image/resource-image.model';
@Component({
    selector: 'jhi-markup-render',
    templateUrl: './markup-render.component.html'
})
export class MarkupRenderComponent {

    @Input() images: ResourceImage[] = [];

    @Input() text: string;

}
