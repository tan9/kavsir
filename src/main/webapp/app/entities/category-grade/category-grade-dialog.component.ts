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
    isSaving: boolean;

    constructor(
        public activeModal: NgbActiveModal,
        private jhiAlertService: JhiAlertService,
        private categoryGradeService: CategoryGradeService,
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
        if (this.categoryGrade.id !== undefined) {
            this.subscribeToSaveResponse(
                this.categoryGradeService.update(this.categoryGrade));
        } else {
            this.subscribeToSaveResponse(
                this.categoryGradeService.create(this.categoryGrade));
        }
    }

    private subscribeToSaveResponse(result: Observable<CategoryGrade>) {
        result.subscribe((res: CategoryGrade) =>
            this.onSaveSuccess(res), (res: Response) => this.onSaveError());
    }

    private onSaveSuccess(result: CategoryGrade) {
        this.eventManager.broadcast({ name: 'categoryGradeListModification', content: 'OK'});
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
    selector: 'jhi-category-grade-popup',
    template: ''
})
export class CategoryGradePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private categoryGradePopupService: CategoryGradePopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.categoryGradePopupService
                    .open(CategoryGradeDialogComponent as Component, params['id']);
            } else {
                this.categoryGradePopupService
                    .open(CategoryGradeDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
