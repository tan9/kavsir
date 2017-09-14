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
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.categoryPublisher.id !== undefined) {
            this.subscribeToSaveResponse(
                this.categoryPublisherService.update(this.categoryPublisher));
        } else {
            this.subscribeToSaveResponse(
                this.categoryPublisherService.create(this.categoryPublisher));
        }
    }

    private subscribeToSaveResponse(result: Observable<CategoryPublisher>) {
        result.subscribe((res: CategoryPublisher) =>
            this.onSaveSuccess(res), (res: Response) => this.onSaveError());
    }

    private onSaveSuccess(result: CategoryPublisher) {
        this.eventManager.broadcast({ name: 'categoryPublisherListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }

    private onError(error: any) {
        this.alertService.error(error.message, null, null);
    }
}

@Component({
    selector: 'jhi-category-publisher-popup',
    template: ''
})
export class CategoryPublisherPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private categoryPublisherPopupService: CategoryPublisherPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.categoryPublisherPopupService
                    .open(CategoryPublisherDialogComponent as Component, params['id']);
            } else {
                this.categoryPublisherPopupService
                    .open(CategoryPublisherDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
