import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

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

    private subscribeToSaveResponse(result: Observable<HttpResponse<CategoryPublisher>>) {
        result.subscribe((res: HttpResponse<CategoryPublisher>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: CategoryPublisher) {
        this.eventManager.broadcast({ name: 'categoryPublisherListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
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
