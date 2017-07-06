import { Component, Input } from '@angular/core';
import { JhiDataUtils } from 'ng-jhipster';

import { ResourceImage, ResourceImageService } from '../../entities/resource-image';
import { BaseEntity } from '../model/base-entity';
import { Observable } from 'rxjs/Observable';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'jhi-images',
    templateUrl: './images.component.html',
    styleUrls: [ './images.component.css' ]
})
export class ImagesComponent {

    @Input() images: ResourceImage[];

    imagesDeleted: ResourceImage[] = [];

    constructor(protected domSanitizer: DomSanitizer,
                private dataUtils: JhiDataUtils,
                private resourceImageService: ResourceImageService) {
    }

    setFileData(event, resourceImage, field, isImage) {
        if (event && event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            if (isImage && !/^image\//.test(file.type)) {
                return;
            }
            this.dataUtils.toBase64(file, (base64Data) => {
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

    /**
     * Persistent all images related to the specified entity.
     *
     * @param related
     * @param owner <strong>choices</strong>, <strong>choiceOptions</strong>, <strong>trueFalses</strong> or <strong>essays</strong>
     * @returns {Observable<any[]>}
     */
    save(related: BaseEntity, ownerType: string): Observable<any> {
        if (['choices', 'choiceOptions', 'trueFalses', 'essays'].indexOf(ownerType) === -1) {
            return Observable.throw(`Invalid ownerType: ${ownerType}`);
        }

        const observables: Observable<any>[] = [];
        this.images.forEach((image) => {
            image[ownerType] = [ this.convert(related) ]; // TODO n-to-n relation?
            if (image.id) {
                // TODO dirty check? prevent untouched image been updated
                observables.push(this.resourceImageService.update(image));
            } else {
                observables.push(this.resourceImageService.create(image)
                    .map((result) => {
                        image.id = result.id;
                        return image;
                    })
                );
            }
        });
        this.imagesDeleted.forEach((image) => {
            if (image.id) {
                observables.push(this.resourceImageService.delete(image.id));
            }
        });

        return Observable.forkJoin(observables);
    }

    private convert(related: BaseEntity): BaseEntity {
        const copy = Object.assign({}, related);
        if (copy['images']) {
            copy['images'] = undefined;
        }
        return copy;
    }

    removeImage(index: number) {
        this.imagesDeleted.push.apply(this.imagesDeleted, this.images.splice(index, 1));
    }

    isEditing() {
        return this.images && this.images.some((option) => option['isEditing']);
    }

    addImage() {
        const option = new ResourceImage();
        option['isEditing'] = true;
        this.images.push(option);
    }
}
