import { Component, Input } from '@angular/core';
import { IResourceImage } from 'app/shared/model/resource-image.model';

@Component({
  selector: 'jhi-markup-render',
  templateUrl: './markup-render.component.html'
})
export class MarkupRenderComponent {
  @Input() images: IResourceImage[] = [];

  @Input() text: string;

  escape(text: string): string {
    if (text) {
      return text
        .replace(/((?:\\\[.*?\\])|(?:\\\(.*?\\\)))|(<)|(>)/g, (match, latex, lt, gt) => latex || (lt && '&lt;') || (gt && '&gt;'))
        .replace(/\n/g, '<br>');
    }
    return text;
  }
}
