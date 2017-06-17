import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AlertService, EventManager } from 'ng-jhipster';

import { CategoryPublisher } from './category-publisher.model';
import { CategoryPublisherPopupService } from './category-publisher-popup.service';
import { CategoryPublisherService } from './category-publisher.service';

@Component({
    selector: 'jhi-category-publisher-delete-dialog',
    templateUrl: './category-publisher-delete-dialog.component.html'
})
export class CategoryPublisherDeleteDialogComponent {

    categoryPublisher: CategoryPublisher;

    constructor(
        private categoryPublisherService: CategoryPublisherService,
        public activeModal: NgbActiveModal,
        private alertService: AlertService,
        private eventManager: EventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.categoryPublisherService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'categoryPublisherListModification',
                content: 'Deleted an categoryPublisher'
            });
            this.activeModal.dismiss(true);
        });
        this.alertService.success('kavsirApp.categoryPublisher.deleted', { param : id }, null);
    }
}

@Component({
    selector: 'jhi-category-publisher-delete-popup',
    template: ''
})
export class CategoryPublisherDeletePopupComponent implements OnInit, OnDestroy {

    modalRef: NgbModalRef;
    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private categoryPublisherPopupService: CategoryPublisherPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.modalRef = this.categoryPublisherPopupService
                .open(CategoryPublisherDeleteDialogComponent, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
