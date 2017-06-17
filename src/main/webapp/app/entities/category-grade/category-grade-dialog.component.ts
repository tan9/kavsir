import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { CategoryGrade } from './category-grade.model';
import { CategoryGradePopupService } from './category-grade-popup.service';
import { CategoryGradeService } from './category-grade.service';

@Component({
    selector: 'jhi-category-grade-dialog',
    templateUrl: './category-grade-dialog.component.html'
})
export class CategoryGradeDialogComponent implements OnInit {

    categoryGrade: CategoryGrade;
    authorities: any[];
    isSaving: boolean;

    constructor(
        public activeModal: NgbActiveModal,
        private alertService: JhiAlertService,
        private categoryGradeService: CategoryGradeService,
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
        if (this.categoryGrade.id !== undefined) {
            this.subscribeToSaveResponse(
                this.categoryGradeService.update(this.categoryGrade), false);
        } else {
            this.subscribeToSaveResponse(
                this.categoryGradeService.create(this.categoryGrade), true);
        }
    }

    private subscribeToSaveResponse(result: Observable<CategoryGrade>, isCreated: boolean) {
        result.subscribe((res: CategoryGrade) =>
            this.onSaveSuccess(res, isCreated), (res: Response) => this.onSaveError(res));
    }

    private onSaveSuccess(result: CategoryGrade, isCreated: boolean) {
        this.alertService.success(
            isCreated ? 'kavsirApp.categoryGrade.created'
            : 'kavsirApp.categoryGrade.updated',
            { param : result.id }, null);

        this.eventManager.broadcast({ name: 'categoryGradeListModification', content: 'OK'});
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
    selector: 'jhi-category-grade-popup',
    template: ''
})
export class CategoryGradePopupComponent implements OnInit, OnDestroy {

    modalRef: NgbModalRef;
    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private categoryGradePopupService: CategoryGradePopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.modalRef = this.categoryGradePopupService
                    .open(CategoryGradeDialogComponent, params['id']);
            } else {
                this.modalRef = this.categoryGradePopupService
                    .open(CategoryGradeDialogComponent);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
