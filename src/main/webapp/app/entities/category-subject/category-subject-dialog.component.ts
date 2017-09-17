import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { CategorySubject } from './category-subject.model';
import { CategorySubjectPopupService } from './category-subject-popup.service';
import { CategorySubjectService } from './category-subject.service';

@Component({
    selector: 'jhi-category-subject-dialog',
    templateUrl: './category-subject-dialog.component.html'
})
export class CategorySubjectDialogComponent implements OnInit {

    categorySubject: CategorySubject;
    isSaving: boolean;

    constructor(
        public activeModal: NgbActiveModal,
        private alertService: JhiAlertService,
        private categorySubjectService: CategorySubjectService,
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
        if (this.categorySubject.id !== undefined) {
            this.subscribeToSaveResponse(
                this.categorySubjectService.update(this.categorySubject));
        } else {
            this.subscribeToSaveResponse(
                this.categorySubjectService.create(this.categorySubject));
        }
    }

    private subscribeToSaveResponse(result: Observable<CategorySubject>) {
        result.subscribe((res: CategorySubject) =>
            this.onSaveSuccess(res), (res: Response) => this.onSaveError());
    }

    private onSaveSuccess(result: CategorySubject) {
        this.eventManager.broadcast({ name: 'categorySubjectListModification', content: 'OK'});
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
    selector: 'jhi-category-subject-popup',
    template: ''
})
export class CategorySubjectPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private categorySubjectPopupService: CategorySubjectPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.categorySubjectPopupService
                    .open(CategorySubjectDialogComponent as Component, params['id']);
            } else {
                this.categorySubjectPopupService
                    .open(CategorySubjectDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
