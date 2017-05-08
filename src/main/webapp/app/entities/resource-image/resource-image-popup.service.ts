import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ResourceImage } from './resource-image.model';
import { ResourceImageService } from './resource-image.service';
@Injectable()
export class ResourceImagePopupService {
    private isOpen = false;
    constructor(
        private modalService: NgbModal,
        private router: Router,
        private resourceImageService: ResourceImageService

    ) {}

    open(component: Component, id?: number | any): NgbModalRef {
        if (this.isOpen) {
            return;
        }
        this.isOpen = true;

        if (id) {
            this.resourceImageService.find(id).subscribe((resourceImage) => {
                this.resourceImageModalRef(component, resourceImage);
            });
        } else {
            return this.resourceImageModalRef(component, new ResourceImage());
        }
    }

    resourceImageModalRef(component: Component, resourceImage: ResourceImage): NgbModalRef {
        const modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.resourceImage = resourceImage;
        modalRef.result.then((result) => {
            this.router.navigate([{ outlets: { popup: null }}], { replaceUrl: true });
            this.isOpen = false;
        }, (reason) => {
            this.router.navigate([{ outlets: { popup: null }}], { replaceUrl: true });
            this.isOpen = false;
        });
        return modalRef;
    }
}
