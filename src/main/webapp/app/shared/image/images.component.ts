import { Component, Input } from '@angular/core';
import { JhiDataUtils } from 'ng-jhipster';

import { DomSanitizer } from '@angular/platform-browser';
import { IResourceImage, ResourceImage } from 'app/shared/model/resource-image.model';

@Component({
  selector: 'jhi-images',
  templateUrl: './images.component.html',
  styleUrls: ['./images.component.scss']
})
export class ImagesComponent {
  @Input() images: IResourceImage[];

  imagesDeleted: IResourceImage[] = [];

  constructor(public domSanitizer: DomSanitizer, private dataUtils: JhiDataUtils) {}

  setFileData(event, resourceImage, field, isImage) {
    if (event && event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (isImage && !/^image\//.test(file.type)) {
        return;
      }
      this.dataUtils.toBase64(file, base64Data => {
        resourceImage[field] = base64Data;
        resourceImage[`${field}ContentType`] = file.type;
      });
      if (!resourceImage.name) {
        resourceImage.name = file.name;
      }
    }
  }

  byteSize(field) {
    return this.dataUtils.byteSize(field);
  }

  removeImage(index: number) {
    this.imagesDeleted.push.apply(this.imagesDeleted, this.images.splice(index, 1));
  }

  isEditing() {
    return this.images && this.images.some(option => option['isEditing']);
  }

  addImage() {
    const option = new ResourceImage();
    option['isEditing'] = true;
    this.images.push(option);
  }
}
