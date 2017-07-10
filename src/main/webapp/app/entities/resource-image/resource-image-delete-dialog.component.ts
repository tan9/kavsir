import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { ResourceImage } from './resource-image.model';
import { ResourceImagePopupService } from './resource-image-popup.service';
import { ResourceImageService } from './resource-image.service';

@Component({
    selector: 'jhi-resource-image-delete-dialog',
    templateUrl: './resource-image-delete-dialog.component.html'
})
export class ResourceImageDeleteDialogComponent {

    resourceImage: ResourceImage;

    constructor(
        private resourceImageService: ResourceImageService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.resourceImageService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'resourceImageListModification',
                content: 'Deleted an resourceImage'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-resource-image-delete-popup',
    template: ''
})
export class ResourceImageDeletePopupComponent implements OnInit, OnDestroy {

    modalRef: NgbModalRef;
    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private resourceImagePopupService: ResourceImagePopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.modalRef = this.resourceImagePopupService
                .open(ResourceImageDeleteDialogComponent, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
