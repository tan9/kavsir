import { Pipe, PipeTransform } from '@angular/core';
import { IResourceImage } from 'app/shared/model/resource-image.model';

@Pipe({ name: 'images' })
export class ImagesPipe implements PipeTransform {
  constructor() {}

  /**
   * Try to replace image syntax to `img` html element with image data inlined.
   * <p>
   * Supported image syntax:
   * <ul>
   *     <li>{{imageName}}</li>
   *     <li>{{imageName|#em}}</li>
   * </ul>
   *
   * @param text text string to be processed
   * @param images resourceImage objects
   * @returns {string} processed text string
   */
  transform(text: string, images: IResourceImage[]): string {
    if (text) {
      text = text.replace(/{{(.*?)(?:\|(.*?)em)?}}/g, (match, name, height) => {
        const image = images.find(e => e.name === name);
        if (image) {
          return `<img src="data:${image.contentContentType};base64,${image.content}" style="max-height: ${
            height !== undefined ? height : 1
          }em;" alt="image"/>`;
        } else {
          return match;
        }
      });
    }
    return text;
  }
}
