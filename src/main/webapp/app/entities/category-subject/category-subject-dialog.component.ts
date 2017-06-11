import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EventManager, AlertService } from 'ng-jhipster';

import { CategorySubject } from './category-subject.model';
import { CategorySubjectPopupService } from './category-subject-popup.service';
import { CategorySubjectService } from './category-subject.service';

@Component({
    selector: 'jhi-category-subject-dialog',
    templateUrl: './category-subject-dialog.component.html'
})
export class CategorySubjectDialogComponent implements OnInit {

    categorySubject: CategorySubject;
    authorities: any[];
    isSaving: boolean;

    constructor(
        public activeModal: NgbActiveModal,
        private alertService: AlertService,
        private categorySubjectService: CategorySubjectService,
        private eventManager: EventManager
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
            this.onSaveSuccess(res), (res: Response) => this.onSaveError(res));
    }

    private onSaveSuccess(result: CategorySubject) {
        this.eventManager.broadcast({ name: 'categorySubjectListModification', content: 'OK'});
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
    selector: 'jhi-category-subject-popup',
    template: ''
})
export class CategorySubjectPopupComponent implements OnInit, OnDestroy {

    modalRef: NgbModalRef;
    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private categorySubjectPopupService: CategorySubjectPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.modalRef = this.categorySubjectPopupService
                    .open(CategorySubjectDialogComponent, params['id']);
            } else {
                this.modalRef = this.categorySubjectPopupService
                    .open(CategorySubjectDialogComponent);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
