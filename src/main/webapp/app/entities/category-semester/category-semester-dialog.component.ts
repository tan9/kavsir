import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EventManager, AlertService } from 'ng-jhipster';

import { CategorySemester } from './category-semester.model';
import { CategorySemesterPopupService } from './category-semester-popup.service';
import { CategorySemesterService } from './category-semester.service';

@Component({
    selector: 'jhi-category-semester-dialog',
    templateUrl: './category-semester-dialog.component.html'
})
export class CategorySemesterDialogComponent implements OnInit {

    categorySemester: CategorySemester;
    authorities: any[];
    isSaving: boolean;

    constructor(
        public activeModal: NgbActiveModal,
        private alertService: AlertService,
        private categorySemesterService: CategorySemesterService,
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
        if (this.categorySemester.id !== undefined) {
            this.subscribeToSaveResponse(
                this.categorySemesterService.update(this.categorySemester), false);
        } else {
            this.subscribeToSaveResponse(
                this.categorySemesterService.create(this.categorySemester), true);
        }
    }

    private subscribeToSaveResponse(result: Observable<CategorySemester>, isCreated: boolean) {
        result.subscribe((res: CategorySemester) =>
            this.onSaveSuccess(res, isCreated), (res: Response) => this.onSaveError(res));
    }

    private onSaveSuccess(result: CategorySemester, isCreated: boolean) {
        this.alertService.success(
            isCreated ? 'kavsirApp.categorySemester.created'
            : 'kavsirApp.categorySemester.updated',
            { param : result.id }, null);

        this.eventManager.broadcast({ name: 'categorySemesterListModification', content: 'OK'});
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
    selector: 'jhi-category-semester-popup',
    template: ''
})
export class CategorySemesterPopupComponent implements OnInit, OnDestroy {

    modalRef: NgbModalRef;
    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private categorySemesterPopupService: CategorySemesterPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.modalRef = this.categorySemesterPopupService
                    .open(CategorySemesterDialogComponent, params['id']);
            } else {
                this.modalRef = this.categorySemesterPopupService
                    .open(CategorySemesterDialogComponent);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
