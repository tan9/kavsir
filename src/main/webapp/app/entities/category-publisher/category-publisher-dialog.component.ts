import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { CategoryPublisher } from './category-publisher.model';
import { CategoryPublisherPopupService } from './category-publisher-popup.service';
import { CategoryPublisherService } from './category-publisher.service';

@Component({
    selector: 'jhi-category-publisher-dialog',
    templateUrl: './category-publisher-dialog.component.html'
})
export class CategoryPublisherDialogComponent implements OnInit {

    categoryPublisher: CategoryPublisher;
    authorities: any[];
    isSaving: boolean;

    constructor(
        public activeModal: NgbActiveModal,
        private alertService: JhiAlertService,
        private categoryPublisherService: CategoryPublisherService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.authorities = ['ROLE_USER', 'ROLE_ADMIN'];
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.categoryPublisher.id !== undefined) {
            this.subscribeToSaveResponse(
                this.categoryPublisherService.update(this.categoryPublisher), false);
        } else {
            this.subscribeToSaveResponse(
                this.categoryPublisherService.create(this.categoryPublisher), true);
        }
    }

    private subscribeToSaveResponse(result: Observable<CategoryPublisher>, isCreated: boolean) {
        result.subscribe((res: CategoryPublisher) =>
            this.onSaveSuccess(res, isCreated), (res: Response) => this.onSaveError(res));
    }

    private onSaveSuccess(result: CategoryPublisher, isCreated: boolean) {
        this.alertService.success(
            isCreated ? 'kavsirApp.categoryPublisher.created'
            : 'kavsirApp.categoryPublisher.updated',
            { param : result.id }, null);

        this.eventManager.broadcast({ name: 'categoryPublisherListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError(error) {
        try {
            error.json();
        } catch (exception) {
            error.message = error.text();
        }
        this.isSaving = false;
        this.onError(error);
    }

    private onError(error) {
        this.alertService.error(error.message, null, null);
    }
}

@Component({
    selector: 'jhi-category-publisher-popup',
    template: ''
})
export class CategoryPublisherPopupComponent implements OnInit, OnDestroy {

    modalRef: NgbModalRef;
    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private categoryPublisherPopupService: CategoryPublisherPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.modalRef = this.categoryPublisherPopupService
                    .open(CategoryPublisherDialogComponent, params['id']);
            } else {
                this.modalRef = this.categoryPublisherPopupService
                    .open(CategoryPublisherDialogComponent);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
