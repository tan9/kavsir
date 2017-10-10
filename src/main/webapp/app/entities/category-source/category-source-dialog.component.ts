import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { CategorySource } from './category-source.model';
import { CategorySourcePopupService } from './category-source-popup.service';
import { CategorySourceService } from './category-source.service';

@Component({
    selector: 'jhi-category-source-dialog',
    templateUrl: './category-source-dialog.component.html'
})
export class CategorySourceDialogComponent implements OnInit {

    categorySource: CategorySource;
    isSaving: boolean;

    constructor(
        public activeModal: NgbActiveModal,
        private jhiAlertService: JhiAlertService,
        private categorySourceService: CategorySourceService,
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
        if (this.categorySource.id !== undefined) {
            this.subscribeToSaveResponse(
                this.categorySourceService.update(this.categorySource));
        } else {
            this.subscribeToSaveResponse(
                this.categorySourceService.create(this.categorySource));
        }
    }

    private subscribeToSaveResponse(result: Observable<CategorySource>) {
        result.subscribe((res: CategorySource) =>
            this.onSaveSuccess(res), (res: Response) => this.onSaveError());
    }

    private onSaveSuccess(result: CategorySource) {
        this.eventManager.broadcast({ name: 'categorySourceListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }

    private onError(error: any) {
        this.jhiAlertService.error(error.message, null, null);
    }
}

@Component({
    selector: 'jhi-category-source-popup',
    template: ''
})
export class CategorySourcePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private categorySourcePopupService: CategorySourcePopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.categorySourcePopupService
                    .open(CategorySourceDialogComponent as Component, params['id']);
            } else {
                this.categorySourcePopupService
                    .open(CategorySourceDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
